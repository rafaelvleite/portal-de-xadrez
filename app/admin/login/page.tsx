"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setIsSubmitting(false);
    setMessage(
      !response.ok
        ? "Não foi possível enviar o link. Use um e-mail editorial convidado."
        : "Se o e-mail estiver convidado, o link de acesso chegará em instantes."
    );
  }

  return (
    <main className="admin-login">
      <section className="login-card" aria-labelledby="login-title">
        <p className="admin-kicker">Xadrez Hoje · Editorial</p>
        <h1 id="login-title">Acesso da redação</h1>
        <p>Use o e-mail que recebeu convite. Não há cadastro público neste painel.</p>
        <form onSubmit={sendMagicLink} className="login-form">
          <label htmlFor="email">E-mail editorial</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando…" : "Enviar link de acesso"}
          </button>
        </form>
        {message ? <p className="form-message" aria-live="polite">{message}</p> : null}
      </section>
    </main>
  );
}
