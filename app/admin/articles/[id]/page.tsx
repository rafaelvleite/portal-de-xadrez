import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  approveArticle,
  publishArticle,
  requestChanges,
  saveArticle,
  submitForReview
} from "../../actions";

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  in_review: "Em revisão",
  changes_requested: "Ajustes solicitados",
  approved: "Aprovada",
  scheduled: "Agendada",
  published: "Publicada",
  archived: "Arquivada"
};

export default async function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [session, supabase] = await Promise.all([getCurrentProfile(), createClient()]);
  const [{ data: article }, { data: sources }, { data: tags }, { data: articleTags }, { data: auditLog }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, slug, title, summary, body_markdown, status, seo_title, seo_description, updated_at, published_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("article_sources").select("source_name, source_url").eq("article_id", id).order("created_at"),
    supabase.from("tags").select("id, label").order("label"),
    supabase.from("article_tags").select("tag_id").eq("article_id", id),
    supabase.from("editorial_audit_log").select("action, from_status, to_status, created_at").eq("article_id", id).order("created_at", { ascending: false }).limit(8)
  ]);

  if (!article || !session) {
    notFound();
  }

  const isReviewer = ["admin", "editor"].includes(session.profile.role);
  const isEditable = isReviewer || ["draft", "changes_requested"].includes(article.status);
  const selectedTagIds = new Set(articleTags?.map((item) => item.tag_id));
  const sourceValue = sources?.map((source) => `${source.source_name} | ${source.source_url}`).join("\n") ?? "";

  return (
    <>
      <header className="admin-page-header compact-header article-heading">
        <div>
          <p className="admin-kicker">Matéria</p>
          <h1>{article.title}</h1>
          <p>Slug: <code>{article.slug}</code></p>
        </div>
        <span className={`status-pill status-${article.status}`}>{statusLabels[article.status]}</span>
      </header>

      <div className="editor-layout">
        <form className="editor-form" action={saveArticle}>
          <input type="hidden" name="articleId" value={article.id} />
          <fieldset disabled={!isEditable}>
            <label htmlFor="title">Título</label>
            <input id="title" name="title" defaultValue={article.title} minLength={5} required />

            <label htmlFor="summary">Resumo</label>
            <textarea id="summary" name="summary" defaultValue={article.summary} minLength={20} required rows={4} />

            <label htmlFor="bodyMarkdown">Texto em Markdown</label>
            <textarea id="bodyMarkdown" name="bodyMarkdown" defaultValue={article.body_markdown} rows={18} />

            <div className="field-grid">
              <div>
                <label htmlFor="seoTitle">Título para busca</label>
                <input id="seoTitle" name="seoTitle" defaultValue={article.seo_title ?? ""} maxLength={220} />
              </div>
              <div>
                <label htmlFor="seoDescription">Descrição para busca</label>
                <input id="seoDescription" name="seoDescription" defaultValue={article.seo_description ?? ""} maxLength={320} />
              </div>
            </div>

            <label htmlFor="sources">Fontes</label>
            <textarea
              id="sources"
              name="sources"
              defaultValue={sourceValue}
              rows={5}
              placeholder="Nome da fonte | https://url-da-fonte"
              aria-describedby="source-help"
            />
            <p id="source-help" className="field-help">Uma fonte por linha. Registre somente páginas que foram de fato consultadas.</p>

            <fieldset className="tag-fieldset">
              <legend>Temas relacionados</legend>
              {tags?.length ? (
                <div className="tag-options">
                  {tags.map((tag) => (
                    <label key={tag.id}>
                      <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={selectedTagIds.has(tag.id)} />
                      {tag.label}
                    </label>
                  ))}
                </div>
              ) : <p className="field-help">As tags serão cadastradas junto ao catálogo editorial.</p>}
            </fieldset>
          </fieldset>

          {isEditable ? (
            <div className="form-actions">
              <button type="submit">Salvar rascunho</button>
              {!isReviewer ? <button formAction={submitForReview} className="secondary-button">Enviar para revisão</button> : null}
              {isReviewer && article.status === "in_review" ? <button formAction={requestChanges} className="secondary-button">Solicitar ajustes</button> : null}
              {isReviewer && ["in_review", "changes_requested"].includes(article.status) ? <button formAction={approveArticle} className="secondary-button">Aprovar</button> : null}
              {isReviewer && article.status === "approved" ? <button formAction={publishArticle}>Publicar</button> : null}
            </div>
          ) : (
            <p className="read-only-notice">Esta matéria está em revisão e aguarda uma decisão editorial.</p>
          )}
        </form>

        <aside className="editor-aside">
          <section>
            <p className="admin-kicker">Fluxo</p>
            <ol className="workflow-list">
              <li className={article.status === "draft" ? "active" : ""}>Rascunho</li>
              <li className={article.status === "in_review" ? "active" : ""}>Revisão</li>
              <li className={article.status === "approved" ? "active" : ""}>Aprovação</li>
              <li className={article.status === "published" ? "active" : ""}>Publicação</li>
            </ol>
          </section>
          <section>
            <p className="admin-kicker">Histórico</p>
            {auditLog?.length ? (
              <ul className="audit-list">
                {auditLog.map((entry, index) => (
                  <li key={`${entry.created_at}-${index}`}>
                    <strong>{entry.from_status ? `${statusLabels[entry.from_status]} → ${statusLabels[entry.to_status ?? ""]}` : entry.action}</strong>
                    <span>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.created_at))}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="field-help">Ainda não há mudanças de status.</p>}
          </section>
        </aside>
      </div>
    </>
  );
}
