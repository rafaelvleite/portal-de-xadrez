-- Modelo de dados central do MVP.
-- Conteúdo público é sempre pt-BR e o banco não recebe dados de terceiros sem
-- proveniência, licença ou autorização registradas.

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.editorial_role as enum ('admin', 'editor', 'contributor');
create type public.article_status as enum (
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'scheduled',
  'published',
  'archived'
);
create type public.tournament_status as enum ('upcoming', 'in_progress', 'completed', 'cancelled');
create type public.game_result as enum ('white_win', 'black_win', 'draw', 'unfinished');
create type public.video_platform as enum ('youtube');
create type public.newsletter_status as enum ('draft', 'approved', 'scheduled', 'sent', 'archived');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  role public.editorial_role not null default 'contributor',
  invited_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  full_name text not null check (char_length(trim(full_name)) between 2 and 160),
  short_name text,
  fide_id bigint unique,
  birth_date date,
  city text,
  state text,
  country_code char(2) not null default 'BR' check (country_code ~ '^[A-Z]{2}$'),
  titles text[] not null default '{}',
  bio_markdown text,
  image_url text,
  official_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) between 2 and 200),
  description_markdown text,
  status public.tournament_status not null default 'upcoming',
  starts_on date,
  ends_on date,
  city text,
  state text,
  country_code char(2) not null default 'BR' check (country_code ~ '^[A-Z]{2}$'),
  venue text,
  organizer_name text,
  official_url text,
  source_url text,
  source_checked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  platform public.video_platform not null default 'youtube',
  external_channel_id text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null check (char_length(trim(display_name)) between 2 and 160),
  description text,
  channel_url text not null,
  thumbnail_url text,
  is_eligible boolean not null default false,
  last_imported_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (platform, external_channel_id)
);

create table public.openings (
  id uuid primary key default gen_random_uuid(),
  eco_code char(3) not null unique check (eco_code ~ '^[A-E][0-9]{2}$'),
  name text not null check (char_length(trim(name)) between 2 and 160),
  variation text,
  moves_san text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label text not null unique check (char_length(trim(label)) between 2 and 80),
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  tournament_id uuid references public.tournaments(id) on delete set null,
  white_player_id uuid references public.players(id) on delete set null,
  black_player_id uuid references public.players(id) on delete set null,
  opening_id uuid references public.openings(id) on delete set null,
  round_label text,
  played_at date,
  result public.game_result not null default 'unfinished',
  pgn text,
  source_name text,
  source_url text,
  license_name text,
  license_url text,
  source_checked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (pgn is null or (source_url is not null and license_name is not null))
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete restrict,
  external_video_id text not null,
  title text not null check (char_length(trim(title)) between 1 and 240),
  description text,
  published_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  thumbnail_url text,
  playlist_external_id text,
  playlist_title text,
  source_url text not null,
  is_embeddable boolean not null default true,
  is_available boolean not null default true,
  imported_at timestamptz not null default timezone('utc', now()),
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (channel_id, external_video_id)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(trim(title)) between 5 and 220),
  summary text not null check (char_length(trim(summary)) between 20 and 500),
  body_markdown text not null default '',
  status public.article_status not null default 'draft',
  author_id uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  canonical_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    status not in ('published', 'scheduled')
    or (author_id is not null and published_at is not null)
  )
);

create table public.newsletter_editions (
  id uuid primary key default gen_random_uuid(),
  edition_number integer not null unique check (edition_number > 0),
  subject text not null check (char_length(trim(subject)) between 3 and 180),
  preheader text,
  body_markdown text not null default '',
  status public.newsletter_status not null default 'draft',
  author_id uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz,
  sent_at timestamptz,
  mailjet_campaign_id text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (status <> 'scheduled' or scheduled_at is not null),
  check (status <> 'sent' or sent_at is not null)
);

create table public.article_players (
  article_id uuid not null references public.articles(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  primary key (article_id, player_id)
);

create table public.article_tournaments (
  article_id uuid not null references public.articles(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  primary key (article_id, tournament_id)
);

create table public.article_games (
  article_id uuid not null references public.articles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  primary key (article_id, game_id)
);

create table public.article_videos (
  article_id uuid not null references public.articles(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  primary key (article_id, video_id)
);

create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table public.video_players (
  video_id uuid not null references public.videos(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  primary key (video_id, player_id)
);

create table public.video_tournaments (
  video_id uuid not null references public.videos(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  primary key (video_id, tournament_id)
);

create table public.video_openings (
  video_id uuid not null references public.videos(id) on delete cascade,
  opening_id uuid not null references public.openings(id) on delete cascade,
  primary key (video_id, opening_id)
);

create table public.video_tags (
  video_id uuid not null references public.videos(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (video_id, tag_id)
);

create index games_tournament_id_idx on public.games (tournament_id);
create index games_played_at_idx on public.games (played_at desc);
create index videos_channel_published_at_idx on public.videos (channel_id, published_at desc);
create index videos_published_at_idx on public.videos (published_at desc);
create index articles_publication_idx on public.articles (published_at desc) where status = 'published';
create index articles_author_id_idx on public.articles (author_id);
create index tournaments_schedule_idx on public.tournaments (starts_on, ends_on);

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger players_set_updated_at before update on public.players
  for each row execute procedure public.set_updated_at();
create trigger tournaments_set_updated_at before update on public.tournaments
  for each row execute procedure public.set_updated_at();
create trigger channels_set_updated_at before update on public.channels
  for each row execute procedure public.set_updated_at();
create trigger openings_set_updated_at before update on public.openings
  for each row execute procedure public.set_updated_at();
create trigger tags_set_updated_at before update on public.tags
  for each row execute procedure public.set_updated_at();
create trigger games_set_updated_at before update on public.games
  for each row execute procedure public.set_updated_at();
create trigger videos_set_updated_at before update on public.videos
  for each row execute procedure public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles
  for each row execute procedure public.set_updated_at();
create trigger newsletter_editions_set_updated_at before update on public.newsletter_editions
  for each row execute procedure public.set_updated_at();

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

grant execute on function public.is_editor() to authenticated;

alter table public.profiles enable row level security;
alter table public.players enable row level security;
alter table public.tournaments enable row level security;
alter table public.channels enable row level security;
alter table public.openings enable row level security;
alter table public.tags enable row level security;
alter table public.games enable row level security;
alter table public.videos enable row level security;
alter table public.articles enable row level security;
alter table public.newsletter_editions enable row level security;
alter table public.article_players enable row level security;
alter table public.article_tournaments enable row level security;
alter table public.article_games enable row level security;
alter table public.article_videos enable row level security;
alter table public.article_tags enable row level security;
alter table public.video_players enable row level security;
alter table public.video_tournaments enable row level security;
alter table public.video_openings enable row level security;
alter table public.video_tags enable row level security;

create policy "Publica perfis de autores" on public.profiles for select
  using (true);
create policy "Editor gerencia perfis" on public.profiles for all to authenticated
  using (public.is_editor()) with check (public.is_editor());
create policy "Usuario atualiza proprio nome" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "Leitura publica de jogadores" on public.players for select using (true);
create policy "Editor gerencia jogadores" on public.players for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de torneios" on public.tournaments for select using (true);
create policy "Editor gerencia torneios" on public.tournaments for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de canais" on public.channels for select using (true);
create policy "Editor gerencia canais" on public.channels for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de aberturas" on public.openings for select using (true);
create policy "Editor gerencia aberturas" on public.openings for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de tags" on public.tags for select using (true);
create policy "Editor gerencia tags" on public.tags for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de partidas" on public.games for select using (true);
create policy "Editor gerencia partidas" on public.games for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de videos" on public.videos for select using (is_available);
create policy "Editor gerencia videos" on public.videos for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de artigos publicados" on public.articles for select
  using (status = 'published' and published_at <= timezone('utc', now()));
create policy "Editor gerencia artigos" on public.articles for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Editor gerencia edicoes da newsletter" on public.newsletter_editions for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "Leitura publica de relacoes de artigo publicado" on public.article_players for select
  using (exists (select 1 from public.articles where id = article_id and status = 'published' and published_at <= timezone('utc', now())));
create policy "Editor gerencia relacoes artigo jogador" on public.article_players for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de artigo publicado" on public.article_tournaments for select
  using (exists (select 1 from public.articles where id = article_id and status = 'published' and published_at <= timezone('utc', now())));
create policy "Editor gerencia relacoes artigo torneio" on public.article_tournaments for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de artigo publicado" on public.article_games for select
  using (exists (select 1 from public.articles where id = article_id and status = 'published' and published_at <= timezone('utc', now())));
create policy "Editor gerencia relacoes artigo partida" on public.article_games for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de artigo publicado" on public.article_videos for select
  using (exists (select 1 from public.articles where id = article_id and status = 'published' and published_at <= timezone('utc', now())));
create policy "Editor gerencia relacoes artigo video" on public.article_videos for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de artigo publicado" on public.article_tags for select
  using (exists (select 1 from public.articles where id = article_id and status = 'published' and published_at <= timezone('utc', now())));
create policy "Editor gerencia relacoes artigo tag" on public.article_tags for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "Leitura publica de relacoes de video" on public.video_players for select
  using (exists (select 1 from public.videos where id = video_id and is_available));
create policy "Editor gerencia relacoes video jogador" on public.video_players for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de video" on public.video_tournaments for select
  using (exists (select 1 from public.videos where id = video_id and is_available));
create policy "Editor gerencia relacoes video torneio" on public.video_tournaments for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de video" on public.video_openings for select
  using (exists (select 1 from public.videos where id = video_id and is_available));
create policy "Editor gerencia relacoes video abertura" on public.video_openings for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "Leitura publica de relacoes de video" on public.video_tags for select
  using (exists (select 1 from public.videos where id = video_id and is_available));
create policy "Editor gerencia relacoes video tag" on public.video_tags for all to authenticated using (public.is_editor()) with check (public.is_editor());
