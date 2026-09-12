# Política editorial, fontes e direitos de uso — Xadrez Hoje

**Status:** Política operacional para o MVP
**Versão:** 1.0
**Data:** 12 de setembro de 2026
**Revisão:** a cada seis meses e antes de qualquer nova fonte, licença ou automação de coleta

> Esta é uma política interna de operação, não um parecer jurídico. Casos de licenciamento, retirada de conteúdo, difamação, direito de imagem, dados de menores ou contratos devem ser encaminhados a assessoria jurídica antes da publicação ou reutilização.

## 1. Princípio editorial

O Xadrez Hoje publica informação de interesse do público enxadrístico com contexto próprio, atribuição clara e respeito aos direitos de autores, criadores, jogadores, organizadores e plataformas. A finalidade não é republicar em escala o trabalho de terceiros: é informar, organizar e acrescentar valor editorial.

Em regra, a redação deve **apurar, resumir e contextualizar**, em vez de copiar texto, imagens, vídeos, partidas ou bancos de dados de terceiros.

## 2. Política de fontes e atribuição

### Hierarquia de fontes

1. **Fonte primária:** jogador, organizador, federação, árbitro, documento oficial, transmissão ou resultado oficial.
2. **Fonte diretamente envolvida:** assessoria, equipe, patrocinador ou plataforma responsável.
3. **Fonte jornalística confiável:** usada para contexto, com atribuição e, quando o fato for relevante, confirmação independente.
4. **Redes sociais:** apenas quando a conta for verificadamente autêntica e a publicação for tratada como declaração, não como prova suficiente de fato complexo.

Para resultados, calendário, ratings, suspensões, acusações, contratos e outros fatos sensíveis, registrar no CMS ao menos uma fonte primária ou duas fontes independentes confiáveis. Rumor, print sem proveniência e conteúdo gerado por IA não são fontes.

### Como atribuir

- Linkar a fonte original no corpo ou no bloco “Fontes”.
- Identificar autor, veículo, organizador ou plataforma quando aplicável.
- Distinguir claramente o que é fato apurado, declaração de terceiro, análise e opinião.
- Indicar data e horário de atualização em cobertura em andamento.
- Arquivar URL, data de consulta, tipo de licença/uso e editor responsável no registro interno da matéria.

A Lei de Direitos Autorais brasileira prevê, entre outras limitações, a reprodução de notícia ou artigo informativo na imprensa com menção ao autor e à publicação, e citações justificadas para estudo, crítica ou polêmica, com indicação de autor e origem. Isso não torna permitido copiar uma matéria inteira, fotos, bases de dados ou conteúdo audiovisual sem análise de direitos. Ver [Lei nº 9.610/1998, art. 46](https://www.planalto.gov.br/ccivil_03/leis/l9610.htm).

### Texto, fotos e gráficos de terceiros

- Produzir texto próprio; não publicar tradução ou reprodução substancial sem autorização escrita.
- Citações devem ser breves, necessárias ao contexto e atribuídas.
- Usar fotos, vídeos, ilustrações, infográficos e transmissões apenas se forem próprios, de banco com licença compatível, de domínio público ou autorizados por escrito.
- Não presumir que uma imagem, PGN ou tabela “publicamente disponível” possa ser republicada.
- Preservar autor, crédito, legenda, licença e eventuais restrições de uso de todo ativo incorporado.

## 3. Vídeos e conteúdo de terceiros

### Regra do MVP

O catálogo de vídeos usa a **YouTube Data API** e o player oficial incorporado. Não baixar, transcodificar, reupar, extrair áudio, remover anúncios, ocultar atribuição, alterar o player ou fazer scraping de páginas do YouTube.

### Requisitos de implementação

- Exibir nome do canal, título e origem “YouTube” de forma clara junto a cada item.
- Manter a marca e as atribuições fornecidas pelo YouTube visíveis em todos os dispositivos.
- Não misturar resultados de outras fontes como se fossem resultados do YouTube.
- O usuário deve iniciar a reprodução; o MVP não usa autoplay.
- Não condicionar a reprodução a cadastro, clique em anúncio, curtida, inscrição ou recompensa.
- Não vender patrocínio “dentro” do player. Páginas com vídeo podem ter publicidade somente quando também oferecerem conteúdo editorial independente e suficiente.
- Consultar e respeitar a configuração de incorporação do vídeo; se o player não puder tocar, mostrar link para a página original.
- Atualizar ou remover itens quando o vídeo, canal ou metadado deixar de estar disponível, conforme as políticas vigentes da API.

As [políticas para desenvolvedores do YouTube](https://developers.google.com/youtube/terms/developer-policies) exigem identificação clara da origem do conteúdo, preservação de atribuições e proíbem interferir no player e em sua publicidade. A integração deve ser revisada contra essas políticas no momento da implementação, pois elas podem mudar.

### Criadores e relações comerciais

- Todo vídeo de terceiro terá link para o canal original.
- Parceria, pagamento, permuta, vínculo societário ou uso de conteúdo de qualquer parte relacionada deve ser identificado quando relevante ao leitor.
- Inclusão no catálogo não é endosso editorial nem transferência de direitos.
- Uma solicitação legítima de correção, remoção ou atribuição deve suspender o item de forma preventiva até a revisão do editor responsável.

## 4. IA e revisão humana

IA pode apoiar pesquisa, estrutura, transcrição, resumo, classificação, tradução de trabalho interno e sugestão de metadados. Ela não pode publicar de forma autônoma.

Antes de publicar qualquer conteúdo com assistência de IA, o editor responsável deve:

1. verificar fatos, nomes, datas, placares, citações, links e números contra as fontes;
2. confirmar que a redação acrescenta valor e não reproduz material de terceiros de modo substancial;
3. remover alegações, citações ou detalhes que não possam ser sustentados por fonte confiável;
4. revisar tom, contexto, título, imagem e metadados;
5. registrar a revisão no CMS.

Não é permitido usar IA para inventar entrevistas, declarações, partidas, fontes, imagens jornalísticas de eventos reais ou resultados. Imagens sintéticas só podem ilustrar conceitos abstratos e devem ser rotuladas quando puderem ser confundidas com registro factual.

## 5. Acusações, menores, privacidade e correções

### Acusações e controvérsias

- Publicar somente fatos verificáveis e de interesse público claro.
- Priorizar documentos, decisões oficiais e declaração direta das partes.
- Oferecer oportunidade razoável de resposta a pessoa ou organização diretamente acusada, salvo urgência editorial justificada e documentada.
- Usar linguagem proporcional à evidência: “alegou”, “segundo documento”, “foi acusado de” e nunca tratar alegação como fato confirmado.
- Exigir aprovação de editor sênior e consulta jurídica quando houver acusação de crime, fraude, doping, assédio, trapaça, suspensão ou dano reputacional relevante.

### Menores de idade

- Usar somente informação necessária para a cobertura esportiva.
- Não publicar contato, rotina, escola, endereço, localização em tempo real ou outro dado que aumente risco à criança ou adolescente.
- Evitar entrevistas, imagens ou detalhes sensíveis sem autorização adequada do responsável e avaliação editorial.
- Não explorar sofrimento, constrangimento ou polêmica para gerar cliques.

### Correções

- Corrigir erros factuais assim que confirmados.
- Em correções materiais, adicionar nota no fim da matéria com o que mudou e quando.
- Não apagar silenciosamente uma mudança que altere título, resultado, atribuição, contexto ou conclusão.
- Conteúdo retirado por direito, privacidade ou decisão legal deve manter uma página curta de transparência quando isso não ampliar o dano.
- Solicitações de correção ou remoção devem ser registradas com data, origem, decisão e responsável.

## 6. Fontes de dados para o MVP

| Dado | Fonte candidata | Status de uso | Regra |
|---|---|---|---|
| Vídeos de canais elegíveis | YouTube Data API e player oficial | Aprovado | Usar API/player oficiais e seguir as políticas do YouTube |
| Vídeos de terceiros | YouTube Data API e player oficial | Aprovado com revisão | Atribuir canal e YouTube; não baixar nem reupar |
| Partidas públicas de Lichess | [Lichess Open Database](https://database.lichess.org/) | Aprovado para dados sob CC0 | Registrar versão, URL e data de ingestão |
| Transmissões/PGNs de broadcasts Lichess | Lichess Broadcasts | Condicional | Usar somente se a implementação cumprir a licença CC BY-SA 4.0, com atribuição e requisitos de compartilhamento |
| Ratings internacionais | [FIDE Ratings Database](https://ratings.fide.com/) | A validar | Usar como referência oficial; validar termos, frequência de coleta e redistribuição antes de armazenar em lote |
| Calendário internacional | [FIDE Calendar](https://calendar.fide.com/) | A validar | Linkar/atribuir; validar permissão para reuso e armazenamento |
| Torneios nacionais | Confederação, federações estaduais e organizadores | A validar por fonte | Preferir página oficial do evento; registrar permissão ou termos antes de espelhar tabelas/PGNs |
| PGNs de torneios proprietários | Organizador ou detentor expresso dos direitos | Somente com autorização | Exigir licença, e-mail ou contrato que permita publicação e armazenamento |
| Ratings nacionais | Confederação/federação responsável | A validar | Não fazer scraping; usar exportação/API ou autorização documentada |

Os exports gerais do Lichess são declarados como [CC0](https://database.lichess.org/), enquanto PGNs de broadcasts são declarados como CC BY-SA 4.0. Essas licenças têm obrigações diferentes e não devem ser tratadas como equivalentes.

## 7. Registro obrigatório de origem

Toda importação ou ativo de terceiro precisa de:

- nome e URL da fonte;
- data/hora de coleta;
- tipo de conteúdo;
- licença, permissão ou justificativa de uso;
- crédito obrigatório;
- prazo ou frequência de revalidação;
- responsável pela aprovação;
- histórico de remoção/correção, se houver.

## 8. Fluxo de aprovação

| Situação | Pode publicar? | Aprovação necessária |
|---|---|---|
| Notícia baseada em fonte primária e apuração normal | Sim | Editor responsável |
| Vídeo via player oficial do YouTube | Sim | Regra técnica e revisão editorial |
| Foto ou PGN sem licença clara | Não | Licença/autorização antes de publicar |
| Acusação, menor, remoção ou conflito de direito | Não até revisão | Editor sênior + jurídico quando aplicável |
| Conteúdo rascunhado com IA | Sim, após revisão | Editor responsável |

## 9. Pontos de revisão antes do beta

- Validar formalmente os termos de uso e a estratégia de ingestão da FIDE, CBX e demais provedores de ratings/calendários.
- Definir canal de contato para correções e remoções (`contato@xadrezhoje.com.br` ou equivalente).
- Publicar páginas de Política de Correções, Termos de Uso, Privacidade e Direitos Autorais no site.
- Criar campos de proveniência e licença no CMS antes de importar vídeos, PGNs ou imagens.
- Obter modelo simples de autorização para colaboradores, fotógrafos e organizadores.
