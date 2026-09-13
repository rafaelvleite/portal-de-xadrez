"use server";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function requiredText(formData: FormData, name: string, minimum: number) {
  const value = String(formData.get(name) ?? "").trim();
  if (value.length < minimum) {
    throw new Error(`O campo ${name} precisa ser preenchido.`);
  }
  return value;
}

function optionalText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function parseSources(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sourceName, sourceUrl] = line.split("|").map((part) => part.trim());
      if (!sourceName || !sourceUrl || !/^https?:\/\//.test(sourceUrl)) {
        throw new Error("Cada fonte deve usar o formato Nome da fonte | https://url-da-fonte");
      }
      return { source_name: sourceName, source_url: sourceUrl, source_type: "primary" as const };
    });
}

async function requireEditorialUser() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

async function requireReviewer() {
  const session = await requireEditorialUser();
  if (session.profile.role !== "admin" && session.profile.role !== "editor") {
    throw new Error("Apenas editores podem executar esta ação.");
  }
  return session;
}

async function saveRevision(
  article: { id: string; title: string; summary: string; body_markdown: string; status: string },
  profileId: string,
  reason: string
) {
  const supabase = await createClient();
  await supabase.from("article_revisions").insert({
    article_id: article.id,
    created_by: profileId,
    reason,
    snapshot: {
      title: article.title,
      summary: article.summary,
      body_markdown: article.body_markdown,
      status: article.status
    }
  });
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createArticle(formData: FormData) {
  const session = await requireEditorialUser();
  const title = requiredText(formData, "title", 5);
  const summary = requiredText(formData, "summary", 20);
  const supabase = await createClient();
  const slug = `${toSlug(title) || "materia"}-${crypto.randomUUID().slice(0, 8)}`;

  const { data, error } = await supabase
    .from("articles")
    .insert({ slug, title, summary, author_id: session.profile.id, status: "draft" })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Não foi possível criar o rascunho.");
  }

  redirect(`/admin/articles/${data.id}`);
}

export async function saveArticle(formData: FormData) {
  const session = await requireEditorialUser();
  const articleId = requiredText(formData, "articleId", 1);
  const title = requiredText(formData, "title", 5);
  const summary = requiredText(formData, "summary", 20);
  const bodyMarkdown = String(formData.get("bodyMarkdown") ?? "").trim();
  const seoTitle = optionalText(formData, "seoTitle");
  const seoDescription = optionalText(formData, "seoDescription");
  const sources = parseSources(String(formData.get("sources") ?? ""));
  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  const supabase = await createClient();
  const { data: article, error: findError } = await supabase
    .from("articles")
    .select("id, title, summary, body_markdown, status")
    .eq("id", articleId)
    .single();

  if (findError || !article) {
    throw new Error("Matéria não encontrada ou sem permissão de edição.");
  }

  await saveRevision(article, session.profile.id, "before_save");
  const nextStatus = article.status === "changes_requested" ? "draft" : article.status;
  const { error: updateError } = await supabase
    .from("articles")
    .update({
      title,
      summary,
      body_markdown: bodyMarkdown,
      seo_title: seoTitle,
      seo_description: seoDescription,
      status: nextStatus
    })
    .eq("id", articleId);

  if (updateError) {
    throw new Error("Não foi possível salvar a matéria.");
  }

  const { error: deleteSourcesError } = await supabase.from("article_sources").delete().eq("article_id", articleId);
  if (deleteSourcesError) {
    throw new Error("Não foi possível atualizar as fontes.");
  }
  if (sources.length) {
    const { error: sourcesError } = await supabase
      .from("article_sources")
      .insert(sources.map((source) => ({ ...source, article_id: articleId })));
    if (sourcesError) {
      throw new Error("Não foi possível salvar as fontes.");
    }
  }

  const { error: deleteTagsError } = await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (deleteTagsError) {
    throw new Error("Não foi possível atualizar as tags.");
  }
  if (tagIds.length) {
    const { error: tagsError } = await supabase
      .from("article_tags")
      .insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
    if (tagsError) {
      throw new Error("Não foi possível salvar as tags.");
    }
  }

  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
}

export async function submitForReview(formData: FormData) {
  const articleId = requiredText(formData, "articleId", 1);
  const supabase = await createClient();
  const { count } = await supabase
    .from("article_sources")
    .select("*", { count: "exact", head: true })
    .eq("article_id", articleId);

  if (!count) {
    throw new Error("Inclua ao menos uma fonte antes de enviar para revisão.");
  }

  const { error } = await supabase.from("articles").update({ status: "in_review" }).eq("id", articleId);
  if (error) {
    throw new Error("Não foi possível enviar a matéria para revisão.");
  }
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
}

export async function requestChanges(formData: FormData) {
  const session = await requireReviewer();
  const articleId = requiredText(formData, "articleId", 1);
  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ status: "changes_requested", reviewed_by: session.profile.id })
    .eq("id", articleId);
  if (error) {
    throw new Error("Não foi possível solicitar ajustes.");
  }
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
}

export async function approveArticle(formData: FormData) {
  const session = await requireReviewer();
  const articleId = requiredText(formData, "articleId", 1);
  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ status: "approved", reviewed_by: session.profile.id })
    .eq("id", articleId);
  if (error) {
    throw new Error("Não foi possível aprovar a matéria.");
  }
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
}

export async function publishArticle(formData: FormData) {
  const session = await requireReviewer();
  const articleId = requiredText(formData, "articleId", 1);
  const supabase = await createClient();
  const { count } = await supabase
    .from("article_sources")
    .select("*", { count: "exact", head: true })
    .eq("article_id", articleId);
  if (!count) {
    throw new Error("Não publique uma matéria sem fontes registradas.");
  }
  const { error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: new Date().toISOString(), reviewed_by: session.profile.id })
    .eq("id", articleId);
  if (error) {
    throw new Error("Não foi possível publicar a matéria.");
  }
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
}
