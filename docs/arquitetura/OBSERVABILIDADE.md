# Observabilidade inicial — Xadrez Hoje MVP

**Status:** Decidido para o MVP
**Data:** 12 de setembro de 2026

## Objetivo

Detectar e investigar falhas sem adicionar um serviço pago ou coletar dados pessoais desnecessários antes do lançamento editorial.

## Sinais disponíveis

| Sinal | Onde consultar | Uso |
|---|---|---|
| Falha de build ou deploy | Logs do deployment na Vercel | Corrigir uma publicação antes ou logo após a entrega |
| Erro de execução no servidor | Runtime Logs da Vercel | Investigar rota, integração ou exceção de servidor |
| Erro de renderização | Limite de erro do Next.js em `app/error.tsx` e console do cliente | Oferecer recuperação ao visitante e registrar evidência durante diagnóstico |
| Banco, Auth e Storage | Logs do projeto Supabase | Investigar consultas, autenticação, permissões e arquivos |
| Schema local | `supabase db reset` | Reproduzir migrations antes de aplicá-las em produção |

## Regras

- Não registrar senhas, tokens, service role, e-mail completo de usuários ou conteúdo privado em logs da aplicação.
- Não enviar eventos de produto, pixels ou rastreadores antes de decidir uma política de analytics e consentimento.
- A página de erro mostra apenas uma mensagem genérica; detalhes ficam nos logs técnicos.
- Toda falha em produção deve ser correlacionada por horário, deployment e rota antes de qualquer correção.
- Alertas e monitoramento externo serão reconsiderados quando houver autenticação de público, CMS em uso ou tráfego recorrente.

## Rotina operacional

1. Confirmar o deployment e seu horário na Vercel.
2. Consultar os Runtime Logs da mesma janela de tempo.
3. Se a falha envolver dados, conferir os logs do Supabase e reproduzir localmente.
4. Corrigir em branch, validar com CI e Preview Deployment.
5. Publicar em produção somente após a validação.
