import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  in_review: "Em revisão",
  changes_requested: "Ajustes solicitados",
  approved: "Aprovada",
  scheduled: "Agendada",
  published: "Publicada",
  archived: "Arquivada"
};

export default async function AdminHomePage() {
  const [session, supabase] = await Promise.all([getCurrentProfile(), createClient()]);
  const isReviewer = session?.profile.role === "admin" || session?.profile.role === "editor";
  const articlesQuery = supabase
    .from("articles")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(6);
  const reviewQuery = supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "in_review");
  const [{ data: recentArticles }, { count: reviewCount }] = await Promise.all([articlesQuery, reviewQuery]);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Redação</p>
          <h1>Bom trabalho, {session?.profile.display_name}.</h1>
          <p>Escreva com fontes, revise com contexto e publique com responsabilidade.</p>
        </div>
        <Link className="primary-link" href="/admin/articles/new">Nova matéria</Link>
      </header>

      <section className="editorial-summary" aria-label="Resumo editorial">
        <article>
          <span>Em revisão</span>
          <strong>{isReviewer ? reviewCount ?? 0 : "—"}</strong>
          <p>{isReviewer ? "Aguardando decisão editorial." : "Visível para editores."}</p>
        </article>
        <article>
          <span>Fluxo</span>
          <strong>6 etapas</strong>
          <p>Rascunho → revisão → publicação.</p>
        </article>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <p className="admin-kicker">Atividade recente</p>
            <h2>Matérias</h2>
          </div>
          <Link href="/admin/articles">Ver todas</Link>
        </div>
        {recentArticles?.length ? (
          <ul className="article-list">
            {recentArticles.map((article) => (
              <li key={article.id}>
                <Link href={`/admin/articles/${article.id}`}>{article.title}</Link>
                <span className={`status-pill status-${article.status}`}>{statusLabels[article.status]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state"><p>A redação está pronta para a primeira matéria.</p></div>
        )}
      </section>
    </>
  );
}
