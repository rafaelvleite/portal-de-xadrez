# ADR 0002 — CMS editorial próprio mínimo

**Status:** Aceito
**Data:** 12 de setembro de 2026

## Contexto

O Xadrez Hoje precisa publicar notícias, análises e atualizações com fontes, revisões, créditos de mídia, relações com jogadores/torneios e futuras integrações de vídeo e busca. O modelo editorial é parte central do produto, não apenas uma página de texto.

Um CMS headless externo aceleraria um primeiro formulário de publicação, mas criaria uma segunda administração, webhooks, limites de modelagem e uma camada adicional para o conteúdo que precisará se relacionar diretamente com dados de xadrez.

## Decisão

Construir um CMS próprio, mínimo e restrito a usuários convidados, dentro da aplicação Next.js. Ele usará Supabase Auth para identidade e PostgreSQL/Supabase Storage para conteúdo, versões, fontes, mídia e permissões.

O primeiro formato de publicação será Markdown estruturado, armazenado como texto canônico e renderizado com sanitização no servidor. Um editor visual pode ser incorporado depois sem alterar a API ou o modelo de publicação.

## Escopo do MVP

### Papéis

| Papel | Pode fazer |
|---|---|
| `admin` | Gerenciar usuários, configurações e todo conteúdo |
| `editor` | Criar, revisar, aprovar, agendar e publicar |
| `contributor` | Criar e editar apenas os próprios rascunhos; enviar para revisão |

### Estados de conteúdo

`draft` → `in_review` → `changes_requested` ou `approved` → `scheduled` ou `published` → `archived`

Somente `editor` e `admin` podem mover conteúdo para `approved`, `scheduled`, `published` ou `archived`. Conteúdo público consulta exclusivamente registros com estado `published` e `published_at` no passado.

### Modelo mínimo

| Entidade | Campos/uso essencial |
|---|---|
| `profiles` | Usuário, nome, papel editorial e status de convite |
| `articles` | Slug, título, resumo, corpo Markdown, estado, autoria, datas e SEO |
| `article_revisions` | Snapshot imutável antes de revisão/publicação, autor e data |
| `article_sources` | URL, nome, tipo, data de consulta e nota editorial |
| `assets` | Arquivo, crédito, licença, origem, alt text e responsável |
| `article_assets` | Relação e posição da mídia na matéria |
| `editorial_audit_log` | Transições de estado e ações críticas |

Jogadores, torneios, vídeos e tags terão tabelas e telas próprias quando seus respectivos módulos forem implementados. O CMS deve permitir relacioná-los a um artigo, mas não tenta administrar todo o produto em um único formulário agora.

### Rotas e operações

- `/admin`: dashboard editorial protegido.
- `/admin/articles`: lista, filtros por estado e criação de rascunho.
- `/admin/articles/[id]`: edição, fontes, mídias, histórico e ações de fluxo.
- `/admin/assets`: upload e biblioteca de mídia autorizada.
- Server Actions para salvar, submeter, aprovar, agendar e publicar.

O Next.js suporta formulários com Server Actions, permitindo processar operações editoriais no servidor. [Next.js Forms](https://nextjs.org/docs/app/guides/forms)

## Segurança

- Todos os usuários editoriais entram por convite e magic link; não existe cadastro público no MVP.
- RLS e grants são definidos por migration para toda tabela exposta.
- Permissões são avaliadas no banco e repetidas nas Server Actions; esconder um botão não substitui autorização.
- A service-role key só é usada no servidor, em operações administrativas pontuais.
- Storage possui bucket editorial privado para upload; publicação de uma imagem cria uma URL pública/controlada somente após revisão de direitos e crédito.
- Cada política RLS terá testes de permitir e negar para `anon`, `contributor`, `editor` e `admin`.

O Supabase recomenda habilitar RLS e configurar grants para cada tabela exposta; políticas são avaliadas em toda operação sobre dados. [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) O Storage também é protegido por políticas RLS e não permite upload sem uma política que o autorize. [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)

## Limites explícitos

Não entra no MVP:

- builder visual de páginas e blocos reutilizáveis;
- plugins, marketplace ou webhooks de terceiros;
- colaboração simultânea em tempo real;
- comentários internos, notificações e automações de aprovação;
- tradução/editorial multilíngue;
- importação automática de texto de fontes externas;
- múltiplos formatos ricos além de Markdown, imagens e embeds autorizados.

## Consequências

### Positivas

- Fluxo editorial, fontes e direitos ficam no mesmo banco e na mesma política de acesso do produto.
- O modelo pode evoluir para torneios, jogadores e vídeos sem sincronização entre plataformas.
- Reduz custo e dependências no estágio de validação.

### Trade-offs

- A equipe precisa construir telas de administração e um fluxo básico de revisão.
- Recursos maduros de CMS externo só serão adicionados quando houver uma necessidade comprovada.

## Critério de saída

O CMS estará pronto para uso interno quando um contributor conseguir criar um rascunho com fontes e imagem; um editor conseguir revisar, publicar e agendar; e o público enxergar apenas conteúdo publicado, com créditos e URLs estáveis.
