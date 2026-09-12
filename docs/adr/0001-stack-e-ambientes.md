# ADR 0001 — Next.js, Vercel e Supabase para o MVP

**Status:** Aceito
**Data:** 12 de setembro de 2026

## Contexto

O Xadrez Hoje precisa lançar um portal com SEO, conteúdo editorial, dados relacionais, autenticação de editores, imagens e integrações externas, sem criar uma plataforma complexa antes de validar o produto.

## Decisão

Usar Next.js com TypeScript/App Router na Vercel e Supabase para PostgreSQL, Auth e Storage. Usar Supabase CLI e migrations SQL versionadas; não adotar ORM no primeiro corte.

Manter dois ambientes de dados: Supabase local via Docker e um único projeto remoto Supabase de produção. O código flui de feature branch para `main`; Preview Deployments não recebem service role nem executam migrations contra o projeto remoto.

## Consequências

### Positivas

- Caminho curto para uma aplicação performática e orientada a SEO.
- Banco PostgreSQL e autenticação sem operar infraestrutura própria no MVP.
- Schema reproduzível, auditável e tipado.
- O banco local reproduzível reduz risco de mudanças de schema sem adicionar custo de um segundo projeto remoto.

### Trade-offs

- Dependência inicial de Vercel e Supabase.
- Sem staging remoto, migrations de produção exigem validação local completa, plano de rollback e aplicação controlada.
- A ausência de ORM exige cuidado maior ao organizar consultas e módulos de acesso a dados.

## Alternativas rejeitadas por agora

- WordPress ou CMS tradicional como plataforma central: acelera publicação, mas complica o modelo de dados, a busca e a experiência de produto pretendida.
- Backend/API separado: adiciona deploy, autenticação e contrato de API antes de haver necessidade comprovada.
- ORM no primeiro corte: adiciona abstração sobre o PostgreSQL enquanto schema e regras de segurança ainda estão em descoberta.

## Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel Environments](https://vercel.com/docs/deployments/environments)
- [Supabase local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
