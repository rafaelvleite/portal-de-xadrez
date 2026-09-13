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

export default async function ArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, status, updated_at, published_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <header className="admin-page-header compact-header">
        <div>
          <p className="admin-kicker">Conteúdo</p>
          <h1>Matérias</h1>
        </div>
        <Link className="primary-link" href="/admin/articles/new">Nova matéria</Link>
      </header>
      {articles?.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Matéria</th><th>Status</th><th>Atualizada</th></tr></thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td><Link href={`/admin/articles/${article.id}`}>{article.title}</Link></td>
                  <td><span className={`status-pill status-${article.status}`}>{statusLabels[article.status]}</span></td>
                  <td>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(article.updated_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="empty-state"><p>Nenhuma matéria criada ainda.</p></div>}
    </>
  );
}
