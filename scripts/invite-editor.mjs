import { createClient } from "@supabase/supabase-js";

const email = process.env.INVITE_EDITOR_EMAIL?.trim() || process.env.EDITOR_EMAIL?.trim();
const displayName = process.env.INVITE_EDITOR_DISPLAY_NAME?.trim() || process.env.EDITOR_DISPLAY_NAME?.trim() || email?.split("@")[0];
const siteUrl = (process.env.INVITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.replace(/\/$/, "");

if (!email || !siteUrl || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Defina INVITE_EDITOR_EMAIL e INVITE_SITE_URL, além das variáveis do .env, antes de convidar um editor.");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
  data: { display_name: displayName },
  redirectTo: `${siteUrl}/auth/callback?next=/admin`
});

if (error || !data.user) {
  throw new Error(error?.message || "Não foi possível criar o convite editorial.");
}

const { error: profileError } = await supabase
  .from("profiles")
  .update({ display_name: displayName, role: "admin", invited_at: new Date().toISOString() })
  .eq("id", data.user.id);

if (profileError) {
  throw new Error("O convite foi criado, mas o papel de administrador não pôde ser definido.");
}

console.log(`Convite administrativo enviado para ${email}.`);
