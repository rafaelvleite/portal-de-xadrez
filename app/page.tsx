import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="shell" aria-labelledby="headline">
        <header className="site-header">
          <Image
            className="wordmark"
            src="/brand/wordmark.svg"
            alt="Xadrez Hoje"
            width={760}
            height={160}
            priority
            unoptimized
          />
          <span className="status">Em breve</span>
        </header>

        <div className="hero">
          <p className="eyebrow">Notícias · torneios · partidas · vídeos</p>
          <h1 id="headline">O xadrez que importa, hoje.</h1>
          <p className="intro">
            Um novo lugar para acompanhar o xadrez em português, com contexto,
            agenda e as histórias que movem o jogo.
          </p>
        </div>

        <div className="signal" aria-label="Em preparação">
          <span className="signal-dot" aria-hidden="true" />
          Estamos preparando o primeiro lance.
        </div>

        <footer>
          <p>xadrezhoje.com.br</p>
        </footer>
      </section>
    </main>
  );
}
