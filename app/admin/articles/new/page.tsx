import { createArticle } from "../../actions";

export default function NewArticlePage() {
  return (
    <>
      <header className="admin-page-header compact-header">
        <div>
          <p className="admin-kicker">Nova matéria</p>
          <h1>Comece pelo essencial.</h1>
          <p>O título e o resumo abrem um rascunho privado para a redação.</p>
        </div>
      </header>
      <form className="editor-form narrow-form" action={createArticle}>
        <label htmlFor="title">Título</label>
        <input id="title" name="title" minLength={5} required autoFocus />
        <label htmlFor="summary">Resumo</label>
        <textarea id="summary" name="summary" minLength={20} required rows={4} />
        <div className="form-actions"><button type="submit">Criar rascunho</button></div>
      </form>
    </>
  );
}
