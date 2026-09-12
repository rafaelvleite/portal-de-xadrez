# Instruções para agentes

## Integrações e automação

- Use **API, CLI ou conectores próprios** como caminho padrão para qualquer integração, operação externa ou administração de serviços.
- Não use browser, automação de interface gráfica ou Computer Use por padrão.
- Browser/UI só pode ser usado quando o usuário tiver solicitado **e autorizado explicitamente** seu uso para a ação em questão.
- Não peça, exponha, imprima ou registre senhas, tokens, chaves privadas ou outros segredos em arquivos versionados. Prefira variáveis de ambiente e gerenciadores de segredos.
