# CMS editorial — operação inicial

**Status:** Implementado para o MVP

## Acesso

O painel fica em `/admin` e usa magic link do Supabase Auth. Não existe formulário de cadastro público: o projeto remoto está configurado com `enable_signup = false`.

O primeiro administrador é criado uma única vez por um operador com acesso ao ambiente local, usando:

```bash
EDITOR_EMAIL=editor@exemplo.com EDITOR_DISPLAY_NAME="Nome" node --env-file=.env scripts/invite-editor.mjs
```

O script envia o convite e promove o perfil criado pelo trigger para `admin`. Depois disso, um administrador pode convidar novos perfis pelo mesmo processo controlado até que a tela própria de gestão de usuários seja necessária.

## Fluxo de matéria

1. `contributor` cria um rascunho e registra as fontes.
2. A pessoa autora salva ou envia para `in_review`.
3. `editor` ou `admin` solicita ajustes ou aprova.
4. `editor` ou `admin` publica; o conteúdo recebe data de publicação e se torna legível publicamente.

Cada alteração de status gera um registro em `editorial_audit_log`. Antes de salvar, o CMS armazena um snapshot em `article_revisions`.

## Limites atuais

- Fontes são registradas por nome e URL; classificação mais detalhada entra no próximo incremento editorial.
- Tags podem ser associadas quando o catálogo de tags existir.
- Upload e gestão de imagens licenciadas serão adicionados junto à biblioteca de mídia; não há upload público.
