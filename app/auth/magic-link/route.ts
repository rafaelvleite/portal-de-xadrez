import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const cooldowns = new Map<string, number>();
const cooldownMs = 60_000;

function acceptedResponse() {
  return NextResponse.json({ accepted: true });
}

function validEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!validEmail(body?.email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const now = Date.now();
  const lastRequest = cooldowns.get(email);
  if (lastRequest && now - lastRequest < cooldownMs) {
    return acceptedResponse();
  }

  try {
    const supabase = createAdminClient();
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = users?.users.find((candidate) => candidate.email?.toLowerCase() === email);
    if (usersError || !user) {
      return acceptedResponse();
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) {
      return acceptedResponse();
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://xadrezhoje.com.br").replace(/\/$/, "");
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/admin` }
    });
    const actionLink = linkData?.properties?.action_link;
    if (linkError || !actionLink) {
      console.error("Não foi possível gerar o link editorial.", linkError?.message);
      return NextResponse.json({ error: "Não foi possível enviar o link agora." }, { status: 500 });
    }

    const apiKey = process.env.MJ_APIKEY_PUBLIC;
    const secretKey = process.env.MJ_APIKEY_PRIVATE;
    if (!apiKey || !secretKey) {
      console.error("Mailjet não está configurado para o login editorial.");
      return NextResponse.json({ error: "Não foi possível enviar o link agora." }, { status: 500 });
    }

    const mailjetResponse = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: "brief@xadrezhoje.com.br", Name: "Xadrez Hoje" },
            To: [{ Email: email }],
            Subject: "Seu acesso à redação — Xadrez Hoje",
            TextPart: `Use este link único para acessar a redação do Xadrez Hoje: ${actionLink}`,
            HTMLPart: `<p>Use o link abaixo para acessar a redação do Xadrez Hoje.</p><p><a href="${actionLink}">Acessar a redação</a></p><p>Se você não solicitou este acesso, ignore esta mensagem.</p>`
          }
        ]
      })
    });
    if (!mailjetResponse.ok) {
      console.error("Mailjet recusou o envio do link editorial.", mailjetResponse.status);
      return NextResponse.json({ error: "Não foi possível enviar o link agora." }, { status: 500 });
    }

    cooldowns.set(email, now);
    return acceptedResponse();
  } catch (error) {
    console.error("Falha ao solicitar acesso editorial.", error instanceof Error ? error.message : "erro desconhecido");
    return NextResponse.json({ error: "Não foi possível enviar o link agora." }, { status: 500 });
  }
}
