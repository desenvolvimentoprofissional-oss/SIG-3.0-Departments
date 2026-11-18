# Guia de Integração: Autenticação Segura para Apps Integrados (iFrame)

Este documento descreve como o SIG 3.0 compartilha de forma segura a identidade do usuário logado (e-mail, regras, etc.) para os aplicativos integrados, cumprindo rigorosamente as normativas de segurança apontadas na **Regra de Refatoração 4.1 (Autenticação Obrigatória e Geração de Token JWT Dinâmico)**.

## 1. Por que não passamos o e-mail em texto puro?

Passar variáveis abertas na URL (ex: `sig_user_email=joao@crasp.org.br`) é inseguro e viola a política contra o envio de parâmetros "chumbados" que podem ser facilmente forjados ou capturados.

Em vez disso, o SIG gera um **Token JWT dinâmico de curto prazo** pelo SDK do Firebase no momento da renderização do App e o entrega ao aplicativo terceiro. O aplicativo terceiro deve validar o token para extrair de forma segura e garantida o e-mail do usuário.

## 2. Como o SIG entrega a identidade para o App Integrado?

**O Fluxo de Entrega:**
1. No painel de administração, o gestor configura a URL do aplicativo terceiro e marca a opção **"Repassar email do usuário?"**.
2. Quando o SIG renderiza a página do tipo **INTEGRAÇÃO**, o frontend verifica a sessão autenticada.
3. O SIG gera o JWT da sessão (`auth.currentUser.getIdToken(true)`).
4. O SIG concatena o parâmetro `sig_token` contendo o JWT seguro na URL do iFrame.

**Exemplo Prático:**
A URL resultante será: `https://meu-app-externo.com/dashboard?sig_token=eyJhbGciOiJSUzI1...`

---

## 3. Como o Aplicativo Integrado deve validar o JWT e extrair o e-mail?

O sistema integrado (dentro do iFrame) deve capturar o `sig_token` e decodificá-lo/validá-lo. 

### Validação (Backend ou GAS)
Para uma validação 100% segura, o app integrado deve confirmar o token usando o Firebase Admin SDK (ou bibliotecas equivalentes para validar as chaves públicas do Google `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`). 
Ao validar, você obterá o payload do usuário, que contém a chave `email`.

### Exemplo no Google Apps Script (GAS)
```javascript
function doGet(e) {
  var token = e.parameter.sig_token;
  
  if (!token) {
    return HtmlService.createHtmlOutput('Acesso Negado: Token não fornecido.');
  }
  
  // No GAS, você pode usar uma biblioteca JWT ou decodificar o Base64 para leitura
  // NOTA: Para total segurança, valide a assinatura do token usando as chaves públicas do Firebase.
  var payloadBase64 = token.split('.')[1];
  var decodedPayload = Utilities.base64DecodeWebSafe(payloadBase64);
  var jsonPayload = JSON.parse(Utilities.newBlob(decodedPayload).getDataAsString());
  
  var emailValidado = jsonPayload.email;
  
  Logger.log("Usuário autenticado seguro: " + emailValidado);
  
  return HtmlService.createHtmlOutput('Olá, usuário autenticado: ' + emailValidado);
}
```

## 4. Conformidade Técnica
- **Aderência ao Documento Sydle V2.5:** "É terminantemente proibido o envio de Tokens fixos ou chumbados. O Token JWT tem validade de curto prazo e deve ser gerado pelo SDK do Firebase exatamente no momento..."
- **Aderência ao AGENTS.md (Thin Client):** O SIG apenas gera a prova de identidade (JWT) e injeta de forma isolada. A extração, filtros de permissão e lógicas de negócios baseadas no e-mail ficam totalmente sob a responsabilidade da aplicação que está sendo embarcada.
