# ADR 0003 — Morning Brief próprio com Mailjet

**Status:** Aceito
**Data:** 12 de setembro de 2026

## Contexto

O Morning Brief é o principal produto de recorrência do Xadrez Hoje. Ele precisa captar inscrições no site, confirmar consentimento, enviar uma edição útil nos dias úteis, permitir descadastro confiável e fornecer métricas sem transformar o MVP numa operação própria de infraestrutura de e-mail.

## Decisão

Construir o Morning Brief dentro do Xadrez Hoje. Supabase será a fonte de verdade para assinantes, consentimento, preferências, conteúdo, agendamento e eventos. A assinatura existente do **Mailjet** será usada somente como infraestrutura de envio, autenticação de domínio e feedback de entregabilidade.

O Mailjet expõe APIs para envio, contatos, estatísticas e webhooks; o produto não dependerá dos formulários, editor ou CRM do provedor. [Mailjet API](https://dev.mailjet.com/docs/api-reference)

## Produto

### Formato e cadência

- Nome: **Morning Brief — Xadrez Hoje**.
- Frequência inicial: segunda a sexta-feira, às **7h30 (America/Sao_Paulo)**.
- Em dias sem notícia suficiente, enviar uma edição curta com agenda, partida, vídeo ou contexto útil; nunca disparar conteúdo vazio apenas para manter frequência.
- Edições especiais de grandes eventos exigem decisão editorial e não devem virar rotina automática.

### Estrutura da edição

1. Abertura: o fato mais importante do período e por que importa.
2. Em jogo: 3 a 5 notícias, resultados ou movimentos relevantes.
3. Agenda: partidas, rodadas e transmissões do dia.
4. Para ver/estudar: um vídeo, partida ou conteúdo permanente do portal.
5. Chamada editorial: um único CTA para conteúdo relacionado, inscrição ou resposta do leitor.

Cada item deve apontar para uma página própria do Xadrez Hoje quando ela acrescentar contexto. Links externos são usados quando a fonte original for o destino mais útil.

### Fases de lançamento

| Fase | Objetivo | Critério de avanço |
|---|---|---|
| Pré-lançamento | Captar interesse e validar entrega | Domínio autenticado, formulário e confirmação funcionando |
| Piloto | Enviar a uma lista pequena e conhecida | 10 edições úteis e revisão de cliques/respostas |
| Beta | Abrir captura em todo o site e nos canais próprios | Fluxo estável, sem problema de descadastro ou entregabilidade |
| Operação | Consolidar hábito | Publicação consistente e métricas semanais acompanhadas |

## Captura, consentimento e dados

### Fluxo de assinatura

1. Pessoa informa email (e primeiro nome, opcional) em formulário do Xadrez Hoje.
2. O servidor cria ou atualiza um registro `pending` em `newsletter_subscriptions` no Supabase com origem, URL/referrer, UTMs, versão do texto de consentimento e data.
3. O servidor envia um email de confirmação pelo Mailjet com token de uso único, armazenado somente em forma de hash e com expiração.
4. A pessoa confirma no site; a assinatura vira `active` e recebe a mensagem de boas-vindas.
5. Descadastro, bounce ou complaint atualizam imediatamente o registro local e bloqueiam novos envios.

Double opt-in é obrigatório no MVP: confirma intenção, reduz endereços incorretos e protege a reputação de envio.

### Fonte de verdade

- **Supabase:** fonte única de verdade para consentimento, origem, preferências, conteúdo, agenda e estado de assinatura.
- **Mailjet:** infraestrutura de envio e eventos de entrega.
- Em qualquer conflito, descadastro, bounce ou complaint bloqueiam novos envios até uma nova inscrição válida.

Dados mínimos: email, nome opcional, estado, data de consentimento, origem, UTMs, versão da política, identificador Mailjet e eventos de entrega agregados. Não coletar telefone, data de nascimento, endereço ou dados sensíveis para o Morning Brief.

O consentimento precisa ser livre, informado e ligado a uma finalidade determinada; o controlador deve poder demonstrar a obtenção e oferecer revogação facilitada. [LGPD, Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)

### Texto inicial do formulário

> Receba o Morning Brief, com o que importa no xadrez em dias úteis. Ao assinar, você concorda com a Política de Privacidade e pode sair a qualquer momento.

O formulário deve linkar a Política de Privacidade. Consentimento para patrocínios, ofertas de parceiros ou produtos próprios será separado do consentimento do Morning Brief.

## Segmentos e automações

### Preferências iniciais

- `morning_brief_enabled` — lista editorial principal;
- `acquisition_source` — `site`, `youtube`, `instagram` ou `partner`;
- `interests` — torneios, vídeos ou iniciantes; somente após ação explícita;
- `pilot` — grupo inicial de testes.

### Automação inicial

- **Double opt-in** obrigatório.
- **Uma mensagem de boas-vindas:** confirmação de inscrição, explicação da promessa editorial e convite para responder “o que você acompanha no xadrez?”.
- Um job agendado busca edições aprovadas e assinantes ativos, cria lotes idempotentes e envia pelo Mailjet.
- Webhooks do Mailjet chegam em endpoint HTTPS autenticado e atualizam entrega, bounce, spam e descadastro.

Não implementar automações complexas, lead scoring, segmentação comportamental invasiva ou fluxos comerciais no MVP.

## Entregabilidade e domínio

- Remetente: **Xadrez Hoje <brief@xadrezhoje.com.br>**.
- Autenticar o domínio no Mailjet antes do primeiro envio com SPF, DKIM e DMARC configurados conforme instruções do provedor.
- Não importar listas sem prova de consentimento; não comprar, alugar ou raspar emails.
- Começar com o grupo piloto, aumentando o volume gradualmente.
- Processar imediatamente bounces, reclamações de spam e descadastros recebidos pelos eventos do Mailjet.
- Evitar encurtadores de URL, assunto enganoso e excesso de imagens; enviar versão HTML e texto simples.

## Métricas

### North star

**Assinantes ativos que clicam em pelo menos uma edição ou retornam ao portal em 30 dias.**

### Acompanhar semanalmente

- inscrições confirmadas e taxa de confirmação;
- origem de cada inscrição;
- entregas, bounces, complaints e descadastros;
- cliques únicos e CTR por item;
- sessões e retorno ao portal atribuídos ao email;
- respostas qualitativas dos leitores;
- consistência de envio.

Taxa de abertura é apenas indicador secundário, pois pode ser distorcida por recursos de privacidade de clientes de email.

## Responsabilidades editoriais

- O editor responsável aprova assunto, pré-cabeçalho, links e conteúdo antes do agendamento.
- Todo link deve ser testado; UTM é adicionada automaticamente sem alterar o destino essencial.
- Patrocínio ou publicidade deve ser identificado de forma clara e separado da seleção editorial.
- O mesmo rigor de fontes e correções da política editorial vale para a newsletter.

## Alternativas avaliadas

| Alternativa | Decisão | Motivo |
|---|---|---|
| Mailjet | Escolhida | Assinatura já disponível, com envio via API, autenticação de domínio e webhooks de eventos |
| Kit | Não agora | Acelera a operação, mas duplica lista, consentimento e automação que o produto pode manter internamente |
| Resend | Não agora | Boa API, mas seria uma segunda assinatura para uma função que Mailjet já cobre |
| Amazon SES | Não agora | Custo baixo, mas adicionaria conta, cobrança e integração AWS sem necessidade atual |
| beehiiv | Não agora | Plataforma forte para publisher, porém duplicaria website/CMS e seus recursos de automação mais avançados entram em planos pagos |
| Brevo | Não agora | Mais ampla que a necessidade inicial e adiciona uma camada de CRM/marketing desnecessária ao MVP |

## Critério de saída

O Morning Brief estará pronto para o beta quando:

- a captura própria criar assinaturas pendentes e confirmadas corretamente;
- double opt-in, descadastro e processamento de webhooks do Mailjet estiverem testados;
- domínio de envio estiver autenticado;
- sequência de boas-vindas e template da edição estiverem aprovados;
- 10 envios do piloto tiverem sido revisados por métricas e feedback.
