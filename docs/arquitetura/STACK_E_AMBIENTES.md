# Stack e ambientes — Xadrez Hoje MVP

**Status:** Decidido para o MVP
**Escopo:** Parte 1 da CHE-30 — stack e ambientes
**Data:** 12 de setembro de 2026

## 1. Decisão

O MVP será uma aplicação web **Next.js com TypeScript**, hospedada na **Vercel**, com **Supabase** para PostgreSQL, autenticação editorial e armazenamento de arquivos. O repositório GitHub será a fonte de verdade para código, migrations e configuração não secreta.

Não haverá ORM no primeiro corte: o schema, as migrations, as políticas de acesso e as consultas mais importantes serão escritos em SQL e acessados com `@supabase/supabase-js`. Isso reduz camadas e mantém o modelo PostgreSQL explícito enquanto o produto ainda está sendo definido.

## 2. Stack

| Camada | Escolha | Papel no MVP |
|---|---|---|
| Linguagem | TypeScript em modo estrito | Tipagem do frontend, serviços e integrações |
| Aplicação | Next.js, App Router | Rotas, renderização orientada a SEO, APIs e interface |
| UI | React + CSS e variáveis de design | Interface responsiva baseada nos tokens da marca |
| Hospedagem | Vercel | Deploys de preview e produção |
| Banco de dados | Supabase PostgreSQL | Conteúdo, taxonomia, usuários editoriais e dados do produto |
| Acesso a dados | `@supabase/supabase-js` + `@supabase/ssr` | Clientes de browser/servidor e sessão |
| Migrations | Supabase CLI + SQL versionado | Evolução reproduzível de schema, RLS e dados de referência |
| Storage | Supabase Storage | Imagens e arquivos próprios, com políticas de acesso |
| Tipos de banco | Supabase CLI | Geração de `database.types.ts` após mudanças de schema |
| CI | GitHub Actions | Lint, typecheck, build e reset/lint das migrations a cada pull request e merge na `main` |
| Observabilidade inicial | Logs da Vercel + logs do Supabase | Diagnóstico do MVP; monitoramento dedicado será decidido depois |

O App Router é a base atual do Next.js para aplicações com Server Components e rotas por sistema de arquivos. [Documentação do Next.js](https://nextjs.org/docs/app)

As migrations SQL e o ambiente local devem ser controlados pelo Supabase CLI; a própria documentação recomenda desenvolvimento local com migrations versionadas antes de aplicar mudanças no projeto remoto. [Migrations do Supabase](https://supabase.com/docs/guides/local-development/database-migrations)

## 3. O que fica fora desta decisão

- CMS editorial e fluxo de revisão;
- internacionalização, estrutura de rotas multilíngues e traduções — fora do MVP, que usa somente `pt-BR` e conteúdo nacional;
- mecanismo de busca dedicado;
- observabilidade avançada, analytics e automações de ingestão.

Essas escolhas serão documentadas em ADRs próprios para evitar que a aplicação inicial carregue dependências prematuras.

A decisão de CMS foi registrada no [ADR 0002 — CMS editorial próprio mínimo](../adr/0002-cms-editorial-proprio.md).

A decisão de newsletter foi registrada no [ADR 0003 — Morning Brief próprio com Mailjet](../adr/0003-newsletter-morning-brief.md).

A decisão de escopo de idioma e cobertura foi registrada no [ADR 0004 — pt-BR e conteúdo nacional no MVP](../adr/0004-escopo-ptbr-conteudo-nacional.md).

## 4. Ambientes

| Ambiente | Código | Aplicação | Dados | Finalidade |
|---|---|---|---|---|
| Local | qualquer branch | `next dev` na máquina do desenvolvedor | Supabase local iniciado pela CLI; seeds descartáveis | Desenvolvimento e testes de schema |
| Produção | branch `main` | Deploy Production da Vercel em `xadrezhoje.com.br` | Projeto remoto Supabase `Xadrez Hoje` | Usuários e conteúdo reais |

Pull requests de branches de feature recebem Preview Deployments na Vercel para validação de interface. Mudanças de schema e integrações são testadas integralmente no Supabase local via Docker. Previews não recebem a service role nem executam migrations contra o projeto remoto.

A Vercel mantém ambientes Local, Preview e Production e suporta variáveis específicas por ambiente e por branch. [Ambientes da Vercel](https://vercel.com/docs/deployments/environments)

## 5. Fluxo de entrega

1. Criar branch de feature a partir de `main`.
2. Desenvolver contra o Supabase local; toda mudança de schema vira migration SQL no repositório.
3. Rodar localmente lint, typecheck, testes e `supabase db reset`.
4. Abrir pull request para `main`; a Vercel cria Preview Deployment.
5. Após aprovação, aplicar migrations no projeto remoto de produção em passo controlado e fazer merge em `main`; a Vercel publica a produção.

Migrations de produção não são executadas automaticamente por um preview. Qualquer migration destrutiva, de alto custo ou que transforme dados exige plano de rollback e aprovação explícita.

## 6. Banco e migrations

Estrutura prevista no repositório:

```text
supabase/
  config.toml
  migrations/
  seed.sql
src/
  lib/supabase/
    browser.ts
    server.ts
    admin.ts
  types/
    database.types.ts
```

Regras:

- `supabase/migrations` é a única fonte de verdade para schema, extensões, RLS, buckets e políticas.
- Mudanças feitas no dashboard precisam ser trazidas para uma migration antes de seguir.
- Cada PR com migration deve incluir a regeneração de `src/types/database.types.ts`.
- `seed.sql` contém somente conteúdo fictício ou explicitamente autorizado para desenvolvimento local.
- Nunca executar `supabase db reset --linked` contra produção.
- Chaves de serviço só podem ser usadas no servidor; nunca começam com `NEXT_PUBLIC_`.

O Supabase CLI permite gerar tipos TypeScript diretamente do schema, mantendo as consultas alinhadas à base. [Geração de tipos](https://supabase.com/docs/guides/api/rest/generating-types)

## 7. Variáveis de ambiente

### Públicas

| Variável | Local | Produção |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | `local` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://xadrezhoje.com.br` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL local | projeto remoto de produção |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | chave local | chave pública de produção |

### Apenas servidor/CI

| Variável | Uso |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Rotinas administrativas no servidor; nunca expor no client |
| `SUPABASE_ACCESS_TOKEN` | CI e Supabase CLI; secret de repositório/ambiente |
| `SUPABASE_PROJECT_REF` | Referência do projeto remoto de produção para Supabase CLI e migrations |
| `MJ_APIKEY_PUBLIC` | Chave pública da API Mailjet; somente servidor |
| `MJ_APIKEY_PRIVATE` | Chave privada da API Mailjet; somente servidor |
| `VERCEL_DEPLOY_HOOK_URL` | Opcional; só para automações futuras autorizadas |

Um `.env.example` documentará apenas os nomes das variáveis, sem valores. `.env.local`, chaves, tokens, URLs privadas, dumps e exports de produção ficam fora do Git.

## 8. Segurança operacional mínima

- O MVP não mantém staging remoto para permanecer no plano Free. O Supabase local com Docker é o ambiente isolado para schema, RLS, seeds e testes de integração.
- Produção não recebe seeds, dados de teste ou resets remotos.
- Preview não envia emails, dispara webhooks externos ou executa ingestões agendadas.
- Apenas as contas necessárias têm acesso a Vercel, Supabase e GitHub; revisar acessos trimestralmente.
- Backups e retenção do Supabase precisam ser conferidos antes do lançamento público.
- Antes de abrir o CMS a editores, ativar RLS em todas as tabelas expostas e testar políticas por papel.

## 9. Critérios para iniciar a CHE-31

- [x] Repositório inicializado como app Next.js com TypeScript estrito.
- [x] Projeto Vercel conectado ao GitHub, com `main` mapeado.
- [x] Projeto remoto Supabase de produção criado; Supabase local funciona para desenvolvimento.
- [x] `.env.example` criado e secrets configurados apenas nos respectivos ambientes.
- [x] Supabase CLI inicializado; migrations e seed local serão adicionados com o primeiro schema.
- [x] Pipeline mínimo executa lint, typecheck, build e reset/lint das migrations no Supabase local.
