# ADR 0005 — Supabase local e produção única no MVP

**Status:** Aceito
**Data:** 12 de setembro de 2026

## Decisão

O MVP usará apenas dois ambientes de dados:

- **local:** Supabase executado via Docker para desenvolvimento, migrations, RLS, seeds e testes de integração;
- **produção:** projeto remoto `Xadrez Hoje` no plano Free do Supabase.

Não haverá projeto remoto de staging. Preview Deployments da Vercel são usados somente para revisão de interface e não recebem service role nem executam migrations.

## Consequências

- Não há custo de um segundo projeto Supabase.
- Toda migration deve passar por `supabase db reset` local e revisão antes de ser aplicada à produção.
- Migrations remotas são executadas em passo controlado, com backup e plano de rollback quando forem destrutivas.
