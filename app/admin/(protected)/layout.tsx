import { getCurrentProfile } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "../actions";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">Xadrez Hoje<span>Editorial</span></Link>
        <nav aria-label="Navegação editorial">
          <Link href="/admin">Visão geral</Link>
          <Link href="/admin/articles">Matérias</Link>
          <Link href="/admin/articles/new">Nova matéria</Link>
        </nav>
        <div className="admin-user">
          <p>{session.profile.display_name}</p>
          <span>{session.profile.role}</span>
          <form action={signOut}>
            <button type="submit" className="text-button">Sair</button>
          </form>
        </div>
      </aside>
      <section className="admin-content">{children}</section>
    </main>
  );
}
