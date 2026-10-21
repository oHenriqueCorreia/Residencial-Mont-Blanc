# Landing page Mont Blanc Residence

Landing page estática, responsiva e preparada para publicação no Sites.

## Executar localmente

No diretório do projeto, inicie qualquer servidor HTTP apontando para `dist`. Por exemplo:

```powershell
npx --yes serve dist
```

Depois, abra o endereço local exibido no terminal.

## Configuração comercial

Edite `dist/config.js` para trocar:

- número e mensagem do WhatsApp;
- telefone exibido;
- endpoint do CRM;
- percentual e data de atualização da obra.

Enquanto `crmEndpoint` estiver vazio, os formulários não transmitem dados. Eles apenas exibem uma confirmação de demonstração. O ponto de integração está identificado na função `submitLead` em `dist/app.js`.

## Rastreamento

Cliques em CTAs geram o evento `cta_click` e formulários geram `lead_submit` em `window.dataLayer`. A inclusão do contêiner do Google Tag Manager deve ser feita após a definição do ID da conta.

## Itens para a versão definitiva

- Endpoint, campos e política de privacidade do CRM.
- ID do Google Tag Manager e IDs de conversão do Google Ads/Meta.
- Confirmação formal do telefone e da mensagem inicial do WhatsApp.
- Previsão oficial de entrega, caso deva aparecer na página.
- URL canônica do domínio final e imagem social definitiva.
- Consentimento/cookies, conforme a estratégia jurídica e de mídia.
- Aprovação dos textos legais e da utilização das imagens institucionais.
