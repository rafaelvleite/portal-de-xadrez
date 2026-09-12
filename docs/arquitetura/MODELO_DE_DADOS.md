# Modelo de dados central — Xadrez Hoje MVP

**Status:** Implementado na migration inicial
**Data:** 12 de setembro de 2026

## Núcleo editorial

| Entidade | Responsabilidade |
|---|---|
| `profiles` | Identidade e papel de usuários convidados do painel editorial |
| `articles` | Notícia ou conteúdo editorial em Markdown, com estado, autoria e publicação |
| `newsletter_editions` | Edições do Morning Brief e seu ciclo de aprovação/envio |
| `players` | Perfis permanentes de enxadristas |
| `tournaments` | Eventos, agenda e fonte oficial |
| `games` | Partidas com jogadores, torneio, abertura e proveniência do PGN |
| `channels` | Canais elegíveis por plataforma; o MVP inicia com YouTube |
| `videos` | Metadados de vídeos importados por API oficial, sem hospedar mídia de terceiros |
| `openings` | Aberturas identificadas pelo código ECO |
| `tags` | Temas editoriais e agrupamento navegável |

## Relações

```text
profiles ──< articles >── players / tournaments / games / videos / tags
tournaments ──< games >── players
channels ──< videos >── players / tournaments / openings / tags
newsletter_editions ── profiles
```

As relações muitos-para-muitos usam tabelas de ligação explícitas. Isso permite uma matéria apontar para vários jogadores, eventos, partidas, vídeos e temas sem inserir listas ou objetos duplicados em uma coluna.

## Segurança e publicação

- Todas as tabelas expostas têm RLS ativado.
- Visitantes só leem artigos com estado `published` e data de publicação já alcançada.
- Conteúdo editorial, newsletter e cadastros de catálogo são geridos somente por `editor` ou `admin`.
- Perfis novos entram como `contributor`; papéis editoriais são promovidos somente por administrador.
- O seed usa exclusivamente registros fictícios e fica restrito ao Supabase local.

## Proveniência

Partidas com PGN exigem URL de origem e licença registrada. Vídeos armazenam o identificador, a URL e os metadados recebidos da API oficial; a plataforma continua hospedando e reproduzindo a mídia.

Essas regras operacionalizam a [política editorial, fontes e direitos](../POLITICA_EDITORIAL_E_DIREITOS.md).
