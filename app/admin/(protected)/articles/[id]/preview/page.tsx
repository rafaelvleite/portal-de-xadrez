import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: article }, { data: sources }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, summary, body_markdown, status, updated_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("article_sources").select("source_name, source_url").eq("article_id", id).order("created_at")
  ]);

  if (!article) {
    notFound();
  }

  return (
    <article className="article-preview">
      <header className="preview-toolbar">
        <div>
          <p className="admin-kicker">Pré-visualização editorial</p>
          <p>Estado atual: <strong>{article.status}</strong></p>
        </div>
        <Link className="secondary-link" href={`/admin/articles/${article.id}`}>Voltar à edição</Link>
      </header>
      <section className="preview-paper">
        <p className="preview-section">Xadrez Hoje</p>
        <h1>{article.title}</h1>
        <p className="preview-summary">{article.summary}</p>
        <p className="preview-date">Atualizada em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(article.updated_at))}</p>
        <div className="markdown-content"><ReactMarkdown>{article.body_markdown || "_O texto desta matéria ainda está em branco._"}</ReactMarkdown></div>
        {sources?.length ? (
          <footer className="preview-sources">
            <h2>Fontes</h2>
            <ul>
              {sources.map((source) => (
                <li key={source.source_url}><a href={source.source_url} rel="noreferrer" target="_blank">{source.source_name}</a></li>
              ))}
            </ul>
          </footer>
        ) : null}
      </section>
    </article>
  );
}
