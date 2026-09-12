-- Dados exclusivamente fictícios para desenvolvimento local.
-- Não executar contra o projeto remoto de produção.

insert into public.players (slug, full_name, city, state, titles, bio_markdown)
values
  ('ana-exemplo', 'Ana Exemplo', 'São Paulo', 'SP', array['CM'], 'Jogadora fictícia usada apenas no ambiente local.'),
  ('bruno-exemplo', 'Bruno Exemplo', 'Curitiba', 'PR', array['MN'], 'Jogador fictício usado apenas no ambiente local.');

insert into public.tournaments (slug, name, status, starts_on, ends_on, city, state, organizer_name, source_url, source_checked_at)
values
  ('copa-exemplo-2026', 'Copa Exemplo 2026', 'upcoming', '2026-10-10', '2026-10-12', 'São Paulo', 'SP', 'Organização fictícia', 'https://example.com/copa-exemplo', timezone('utc', now()));

insert into public.channels (platform, external_channel_id, slug, display_name, channel_url, is_eligible)
values
  ('youtube', 'UC_EXEMPLO_XADREZ_HOJE', 'canal-exemplo', 'Canal Exemplo', 'https://www.youtube.com/@canal-exemplo', true);

insert into public.openings (eco_code, name, variation, moves_san)
values ('C20', 'Abertura do Rei', 'Linha fictícia', '1. e4 e5 2. Bc4');

insert into public.tags (slug, label, description)
values
  ('xadrez-brasileiro', 'Xadrez brasileiro', 'Etiqueta de desenvolvimento para conteúdo nacional.'),
  ('torneios', 'Torneios', 'Etiqueta de desenvolvimento para eventos.');

insert into public.games (
  external_id, tournament_id, white_player_id, black_player_id, opening_id, round_label, played_at, result,
  pgn, source_name, source_url, license_name, license_url, source_checked_at
)
select
  'local-example-game-001', tournament.id, white_player.id, black_player.id, opening.id, '1', '2026-10-10', 'draw',
  '[Event "Copa Exemplo 2026"]\n[White "Ana Exemplo"]\n[Black "Bruno Exemplo"]\n[Result "1/2-1/2"]\n\n1. e4 e5 2. Bc4 Bc5 1/2-1/2',
  'Base fictícia local', 'https://example.com/copa-exemplo/partidas', 'Dados fictícios para desenvolvimento', 'https://example.com/licenca', timezone('utc', now())
from public.tournaments tournament
cross join public.players white_player
cross join public.players black_player
cross join public.openings opening
where tournament.slug = 'copa-exemplo-2026'
  and white_player.slug = 'ana-exemplo'
  and black_player.slug = 'bruno-exemplo'
  and opening.eco_code = 'C20';

insert into public.videos (
  channel_id, external_video_id, title, description, published_at, duration_seconds, thumbnail_url, source_url, raw_metadata
)
select
  channel.id, 'video-exemplo-001', 'Vídeo fictício para desenvolvimento', 'Metadados fictícios. Nenhum conteúdo externo foi importado.',
  '2026-09-12T10:00:00Z', 420, 'https://example.com/thumbnail.jpg', 'https://www.youtube.com/watch?v=video-exemplo-001',
  '{"fixture": true}'::jsonb
from public.channels channel
where channel.slug = 'canal-exemplo';

insert into public.articles (slug, title, summary, body_markdown)
values (
  'rascunho-exemplo-local',
  'Rascunho fictício para desenvolvimento local',
  'Este registro não é conteúdo editorial e existe somente para validar o modelo de dados no ambiente local.',
  '# Rascunho local\n\nNenhum conteúdo de produção foi incluído neste seed.'
);

insert into public.article_players (article_id, player_id)
select article.id, player.id
from public.articles article
join public.players player on player.slug = 'ana-exemplo'
where article.slug = 'rascunho-exemplo-local';

insert into public.article_tournaments (article_id, tournament_id)
select article.id, tournament.id
from public.articles article
join public.tournaments tournament on tournament.slug = 'copa-exemplo-2026'
where article.slug = 'rascunho-exemplo-local';

insert into public.article_games (article_id, game_id)
select article.id, game.id
from public.articles article
join public.games game on game.external_id = 'local-example-game-001'
where article.slug = 'rascunho-exemplo-local';

insert into public.article_videos (article_id, video_id)
select article.id, video.id
from public.articles article
join public.videos video on video.external_video_id = 'video-exemplo-001'
where article.slug = 'rascunho-exemplo-local';

insert into public.article_tags (article_id, tag_id)
select article.id, tag.id
from public.articles article
join public.tags tag on tag.slug in ('xadrez-brasileiro', 'torneios')
where article.slug = 'rascunho-exemplo-local';

insert into public.video_players (video_id, player_id)
select video.id, player.id
from public.videos video
join public.players player on player.slug = 'ana-exemplo'
where video.external_video_id = 'video-exemplo-001';

insert into public.video_tournaments (video_id, tournament_id)
select video.id, tournament.id
from public.videos video
join public.tournaments tournament on tournament.slug = 'copa-exemplo-2026'
where video.external_video_id = 'video-exemplo-001';

insert into public.video_openings (video_id, opening_id)
select video.id, opening.id
from public.videos video
join public.openings opening on opening.eco_code = 'C20'
where video.external_video_id = 'video-exemplo-001';

insert into public.video_tags (video_id, tag_id)
select video.id, tag.id
from public.videos video
join public.tags tag on tag.slug = 'xadrez-brasileiro'
where video.external_video_id = 'video-exemplo-001';

insert into public.newsletter_editions (edition_number, subject, preheader, body_markdown)
values (1, 'Edição fictícia de desenvolvimento', 'Somente para validar o ambiente local.', 'Conteúdo fictício de desenvolvimento.');
