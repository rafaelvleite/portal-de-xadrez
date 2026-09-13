-- Fluxo editorial mínimo: fontes, snapshots, auditoria e permissões de contributor.

create type public.article_source_type as enum ('primary', 'involved_party', 'journalism', 'social', 'other');

create table public.article_sources (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  source_name text not null check (char_length(trim(source_name)) between 2 and 160),
  source_url text not null check (source_url ~ '^https?://'),
  source_type public.article_source_type not null default 'primary',
  checked_at timestamptz not null default timezone('utc', now()),
  editorial_note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  reason text not null check (char_length(trim(reason)) between 2 and 80),
  snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.editorial_audit_log (
  id bigint generated always as identity primary key,
  article_id uuid not null references public.articles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  from_status public.article_status,
  to_status public.article_status,
  created_at timestamptz not null default timezone('utc', now())
);

create index article_sources_article_id_idx on public.article_sources (article_id);
create index article_revisions_article_id_idx on public.article_revisions (article_id, created_at desc);
create index editorial_audit_log_article_id_idx on public.editorial_audit_log (article_id, created_at desc);

create or replace function public.can_edit_article(target_article_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_editor()
    or exists (
      select 1
      from public.articles
      where id = target_article_id
        and author_id = auth.uid()
        and status in ('draft', 'changes_requested')
    );
$$;

create or replace function public.can_view_article(target_article_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_editor()
    or exists (
      select 1
      from public.articles
      where id = target_article_id
        and (
          author_id = auth.uid()
          or (status = 'published' and published_at <= timezone('utc', now()))
        )
    );
$$;

create or replace function public.log_article_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is distinct from new.status then
    insert into public.editorial_audit_log (article_id, actor_id, action, from_status, to_status)
    values (new.id, auth.uid(), 'status_changed', old.status, new.status);
  end if;
  return new;
end;
$$;

create trigger articles_log_status_change
  after update of status on public.articles
  for each row execute procedure public.log_article_status_change();

grant execute on function public.can_edit_article(uuid) to authenticated;
grant execute on function public.can_view_article(uuid) to authenticated;

alter table public.article_sources enable row level security;
alter table public.article_revisions enable row level security;
alter table public.editorial_audit_log enable row level security;

create policy "Contribuidor le proprios artigos" on public.articles for select to authenticated
  using (author_id = auth.uid());
create policy "Contribuidor cria rascunhos" on public.articles for insert to authenticated
  with check (author_id = auth.uid() and status = 'draft');
create policy "Contribuidor edita rascunhos" on public.articles for update to authenticated
  using (author_id = auth.uid() and status in ('draft', 'changes_requested'))
  with check (author_id = auth.uid() and status in ('draft', 'in_review'));

create policy "Leitura de fontes conforme artigo" on public.article_sources for select
  using (public.can_view_article(article_id));
create policy "Edicao de fontes conforme artigo" on public.article_sources for all to authenticated
  using (public.can_edit_article(article_id)) with check (public.can_edit_article(article_id));

create policy "Leitura de revisoes conforme artigo" on public.article_revisions for select to authenticated
  using (public.can_view_article(article_id));
create policy "Criacao de revisoes conforme artigo" on public.article_revisions for insert to authenticated
  with check (created_by = auth.uid() and public.can_edit_article(article_id));

create policy "Leitura de auditoria para editores" on public.editorial_audit_log for select to authenticated
  using (public.is_editor() or exists (select 1 from public.articles where id = article_id and author_id = auth.uid()));

create policy "Contribuidor gerencia tags de rascunhos" on public.article_tags for all to authenticated
  using (public.can_edit_article(article_id)) with check (public.can_edit_article(article_id));
