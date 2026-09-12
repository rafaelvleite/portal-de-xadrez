"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Erro de renderização da aplicação", error);
  }, [error]);

  return (
    <main>
      <section className="shell error-shell" aria-labelledby="error-title">
        <p className="eyebrow">Xadrez Hoje</p>
        <h1 id="error-title">Este lance não saiu como esperado.</h1>
        <p className="intro">
          Ocorreu uma falha temporária. Tente carregar novamente em alguns instantes.
        </p>
        <button className="retry-button" type="button" onClick={reset}>
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
