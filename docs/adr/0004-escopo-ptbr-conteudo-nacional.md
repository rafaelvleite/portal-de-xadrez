# ADR 0004 — pt-BR e conteúdo nacional no MVP

**Status:** Aceito
**Data:** 12 de setembro de 2026

## Contexto

O produto começará com uma equipe e um ciclo editorial enxutos. Rotas multilíngues, tradução, cobertura internacional ampla e taxonomias globais aumentariam o custo de produção e a superfície técnica antes de validar recorrência e valor editorial.

## Decisão

O MVP será publicado somente em **português do Brasil (`pt-BR`)** e terá foco em conteúdo nacional: jogadores brasileiros, torneios realizados no país, clubes, federações, escolas, criadores e acontecimentos relevantes para o público brasileiro.

Não haverá no MVP:

- seletor de idioma, prefixo de idioma nas URLs ou arquivos de tradução;
- modelagem de traduções por entidade;
- cobertura internacional como linha editorial própria.

Fatos internacionais poderão ser mencionados apenas quando forem indispensáveis para contextualizar uma pauta nacional.

## Consequências

- O schema e as rotas ficam mais simples no primeiro corte.
- A redação concentra apuração, agenda e autoridade no público brasileiro.
- Qualquer expansão de idioma ou de cobertura exigirá um ADR novo, hipótese de produto e capacidade editorial comprovada.
