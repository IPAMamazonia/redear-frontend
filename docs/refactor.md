# Guia de refatoração — RedeAR Frontend

> Documento derivado das refatorações feitas na branch `feature/Vinicius`
> (commits `089d8f8` a `26d4625`). O objetivo é tornar explícitos os critérios
> que usamos para organizar componentes, hooks e funções, para que as próximas
> refatorações sigam a mesma direção sem depender de memória ou contexto de
> conversa.
>
> Este guia complementa ESLint e Prettier. Ele não substitui as regras
> automáticas; cobre decisões estruturais que ferramenta nenhuma decide sozinha.

---

## 1. Resumo em oito regras

1. **Refatorar é preservar comportamento.** Mudança de comportamento é bug fix
   ou feature, e deve aparecer separada no diff/commit.
2. **Separe responsabilidades por camada:** container orquestra, componente
   desenha, hook cuida de ciclo de vida, util transforma dados, helper integra
   com biblioteca/DOM.
3. **Extraia a lógica pura antes de extrair componentes.** Função pura é o
   contrato mais estável e o que mais facilita manutenção/teste.
4. **Componente principal deve ser fino:** estado + composição + JSX. Config
   grande, cálculo de dados e efeitos saem.
5. **Estado derivado não é estado.** Use `useMemo`, não `useState` + `useEffect`.
6. **Efeito tem dono e cleanup simétrico.** Listener remove, timer limpa, chart
   destrói, requisição aborta.
7. **Compartilhe quando houver repetição comprovada**, não por semelhança
   teórica. Um consumidor → pasta da feature; dois ou mais → `src/hooks`,
   `src/helpers` ou `src/components/<nome>`.
8. **Diff pequeno e temático é parte da entrega.** Sem reformatação em massa,
   sem renomear o que não precisa, sem tocar em arquivo fora do escopo.

---

## 2. Contrato de uma refatoração

### 2.1 O que deve permanecer igual

Antes de mover qualquer arquivo, trate como invariantes:

- estrutura visual, classes Tailwind e animações;
- texto, chaves de i18n e ordem de mensagens;
- props públicas e formato dos callbacks (`value`/`onChange`);
- eventos, foco, `disabled`, `aria-*`, `role` e navegação por teclado;
- contratos com Redux e com a API;
- estados de loading, erro, vazio e sem seleção.

Se for necessário mudar algum desses pontos para viabilizar a estrutura, pare:
isso não é mais refatoração. Implemente como correção/feature e registre no PR.

### 2.2 Bugs encontrados no caminho

Achados durante a leitura podem ser corrigidos, mas devem ser **visíveis**:

- liste o bug no commit/PR, com “antes” e “depois”;
- mantenha a correção pequena e próxima do código refatorado;
- quando possível, separe em commit próprio.

Exemplos desta sessão: guard incorreto em `About`, timers empilhados no
carrossel, status antigo no formulário de contato e criação de Chart sem canvas
montado.

### 2.3 Escopo e higiene de diff

- Não toque em arquivos sujos de trabalho alheio. Exemplo: durante a
  refatoração original, `readingsSlice.js` ficou intocado; a unificação da
  normalização veio depois, como mudança própria.
- Não reordene exports/imports em massa. Isso já aconteceu com
  `src/helpers/index.js` e foi revertido: o ruído escondia a única mudança real.
- Não rode `npm run format` no repositório inteiro durante uma refatoração.
  Formate apenas os arquivos tocados:
  `npx prettier --write caminho/arquivo.js caminho/outro.jsx`.
- Rode `git diff --check` antes de fechar.
- Prefira um commit por tema (about, chart, mapa, componentes compartilhados,
  exportação), como no histórico recente.

---

## 3. Modelo de camadas

### 3.1 Estrutura de referência de uma feature

O `export-readings` é o exemplo mais completo do padrão desejado:

```text
src/components/<feature>/
  index.jsx                 # container: estado da feature + composição + JSX
  components/               # componentes de apresentação
    index.js                # barrel público da pasta
    <parte>.jsx
  hooks/                    # comportamento React da feature
    use<Feature>.js
  utils/                    # funções puras / transformações de dados
    index.js
    <assunto>.js
  helpers/                  # opcional: integração com libs, DOM ou side effects
  rules/                    # opcional: constantes, configurações e regras
```

Exemplo aplicado: `src/components/export-readings/` tem container, `components/`,
`hooks/useExportReadings.js` e `utils/` separando payload, datas, download,
erros e metadata.

### 3.2 Papel de cada camada

| Camada                       | Responsabilidade                                                           | Evita                                                               | Exemplos                                                               |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `index.jsx` (container)      | Ler store, manter estado de UI, compor hooks/componentes e montar o layout | Cálculo pesado, config inline, detalhes de Chart/OpenLayers         | `chart/index.jsx`, `export-readings/index.jsx`, `map-view/index.jsx`   |
| `components/`                | Desenhar uma parte da UI a partir de props                                 | Fetch, regra de negócio, acesso direto à API                        | `ChartState`, `ExportFilters`, `SensorSelectPanel`                     |
| `hooks/`                     | Estado, efeitos, ciclo de vida e orquestração de side effects              | Esconder JSX ou virar “hook-deus” com responsabilidades misturadas  | `useChartData`, `useChartInstance`, `useCarousel`, `useExportReadings` |
| `utils/`                     | Transformação pura/quase pura: dados entram, dados saem                    | React, estado de UI, fetch/gerenciamento de requisição, componentes | `montarSeries`, `buildExportPayload`, `validateDateRange`              |
| `helpers/`                   | Apoio da feature, incluindo integração com biblioteca/DOM                  | Regra de UI e estado React                                          | `createMapInstance`, `createSpiderfyController`                        |
| `rules/` ou módulo de config | Constantes, opções, paletas, listas fixas                                  | Recriar arrays/objetos a cada render                                | `CONFIG_SELECT`, `MODES`, `PERIODOS`, `SLIDES`, `STATS_FIXAS`          |
| `src/hooks/`                 | Comportamento React reutilizado por 2+ features                            | Importar código de uma feature específica                           | `useClickOutside`, `useForm`, `useInterval`                            |
| `src/helpers/`               | Utilitário reutilizado por 2+ features                                     | Depender de `src/components`                                        | `formatLimite`, `scrollToAnchor`, `formatNumberString`                 |
| `src/components/<nome>/`     | Componente compartilhado por 2+ features                                   | Ficar dentro de uma feature e ser importado “de lado”               | `sensor-select/`, `segmented-control/`                                 |
| `src/store/slices/`          | Estado global e thunks                                                     | Estado local de UI que só uma feature usa                           | `sensorsSlice`, `readingsSlice`                                        |
| `src/API/`                   | Transporte HTTP, streaming, erros de API                                   | Regra de apresentação ou JSX                                        | `APIService`                                                           |

### 3.3 Direção das dependências

```text
container  →  components
    │             │
    ├────────→  hooks  →  utils / helpers  →  src/helpers
    │             │
    └────────→  store / API
```

Regras práticas:

- `utils/` não importa React, componentes nem store. Pode importar helpers
  globais e conter adaptadores de fronteira pequenos e explícitos — normalizar
  erro da API (`export-readings/utils/errors.js`) ou disparar download
  (`export-readings/utils/download.js`). O que não pode é concentrar fluxo de UI
  ou estado.
- `components/` não faz fetch nem cria Chart/OpenLayers. Recebe dados e
  callbacks por props.
- `hooks/` pode orquestrar store, API e ciclo de vida. Deve expor uma API
  pequena e coesa.
- `src/helpers` e `src/hooks` não importam de uma feature específica. Se
  precisarem, o código ainda não é compartilhado: volte para a feature.
- O container é o único que combina store + estado local + composição da tela.

> Exceção consciente: um painel de feature pode ler o store para derivar opções
> (ex.: `ChartFilters` usa `selectSensors`). O estado principal da feature
> continua no container, e o painel não faz fetch.

---

## 4. Onde colocar cada coisa

Use esta tabela antes de criar arquivo novo:

| Se o código…                                              | Vai para                                              | Exemplo                                        |
| --------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Transforma uma lista/objeto sem React                     | `utils/` da feature                                   | `buildSensorOptions`, `resolveSelectedSensors` |
| Formata número/data/texto e serve a várias features       | `src/helpers/`                                        | `formatLimite`, `formatarDataInput`            |
| Precisa de `useState`/`useEffect`/refs e é de uma feature | `hooks/` da feature                                   | `useChartReadings`, `useExportReadings`        |
| Precisa de React e é usado por várias features            | `src/hooks/`                                          | `useClickOutside`                              |
| Cria/configura recurso de biblioteca ou mexe no DOM       | `helpers/` da feature                                 | `createMapInstance`, `createSensorFeatures`    |
| É só marcação/estilo de uma parte da tela                 | `components/` da feature                              | `ExportSummary`, `ChartState`                  |
| É usado por 2+ features                                   | `src/hooks`, `src/helpers` ou `src/components/<nome>` | `sensor-select`, `scrollToAnchor`              |
| É constante, lista de opções, paleta ou config            | módulo `rules/` ou arquivo de config                  | `MODES`, `PMS_FIELDS`, `CONFIG_SELECT`         |
| É estado global ou chamada de API                         | `src/store/slices` / `src/API`                        | `fetchSensors`, `APIService`                   |
| É validação de formulário                                 | `utils/` ou módulo `form.js` da feature               | `validateContactForm`, `prepareExportRequest`  |

### 4.1 Ordem de extração

Quando um componente está grande, extraia nesta ordem:

1. **Dados puros** → `utils/` (ou `src/helpers` se for cross-feature).
2. **Ciclo de vida/estado** → `hooks/` (ou `src/hooks` se for cross-feature).
3. **Blocos de JSX/estado visual** → `components/`.
4. **Constantes/config** → módulo próprio.
5. **Reconecte imports/barrels, apague código morto e valide.**

Essa ordem evita criar subcomponentes que só existem para receber props de uma
lógica que ainda está no pai.

---

## 5. Quando extrair

### 5.1 Sinais fortes

- Componente passou de ~150 linhas ou acumulou mais de 3 responsabilidades.
- Há 3+ `useEffect` com assuntos diferentes no mesmo componente.
- Um objeto de configuração inline passa de ~20 linhas.
- A mesma transformação, listener, timer ou validação aparece em 2+ lugares.
- Existem 3+ estados mutuamente exclusivos (sem seleção, loading, erro, vazio,
  conteúdo) misturados no JSX.
- Uma função declarada no componente não usa estado/closure e só serve para
  calcular dados.
- O componente ficou difícil de nomear sem ser “index”.

### 5.2 Contrapesos

Os números acima são heurística, não lei. Antes de extrair, pergunte:

- a nova unidade tem um nome claro e uma responsabilidade única?
- ela reduz o custo de leitura ou só espalha o mesmo código?
- o contrato de props/retorno é menor que o código original?
- existe um segundo consumidor real ou a extração prepara reutilização concreta?

### 5.3 Quando NÃO extrair

- Componente presentacional pequeno (< ~60 linhas) só com JSX e classes.
- Wrapper que apenas adiciona uma `className`.
- Abstração com um único consumidor e nome vago (`helpers2`, `utils-extra`).
- Divisão puramente por contagem de linhas, sem fronteira de responsabilidade.
- Criação de uma pasta por componente pequeno: prefira arquivos irmãos e um
  barrel quando fizer sentido.
- Renomear símbolos existentes apenas por preferência pessoal.

> Preferência registrada nesta base: para componentes presentacionais, prefira
> hooks/helpers compartilhados a criar uma pasta por componente.

---

## 6. Regras por camada

### 6.1 Container (`index.jsx`)

- Lê seletores e mantém o estado de UI da feature.
- Chama hooks de orquestração e passa resultados para os componentes.
- Monta o esqueleto da seção e os textos de i18n.
- Não contém grandes cálculos, config de biblioteca, fetch direto nem blocos
  extensos de opções.

Exemplo: `chart/index.jsx` caiu de ~298 para ~161 linhas ao mover dados,
leituras e ciclo do Chart para hooks e estados visuais para `ChartState`.

### 6.2 Componentes

- Preferem props explícitas e controladas (`value`, `onChange`, `disabled`).
- Não fazem fetch; quando precisam de dados, recebem do container ou de um hook
  de feature.
- Mantêm `role`, `aria-*`, `<label>`, `type="button"` e estados de foco.
- Não duplicam regra de negócio: recebem resultado pronto ou chamam util puro.
- Para variantes visuais, use props/condicionais; não clone o componente.

Exemplo positivo: `SensorSelect` foi promovido para
`src/components/sensor-select/` quando a exportação passou a usá-lo. Em vez de
copiar, ganhou `disabled` e chaves de i18n configuráveis.

### 6.3 Hooks

- Um hook = um ciclo de vida ou uma orquestração coesa.
- Nome pelo domínio: `useChartData`, `useChartInstance`, `useExportReadings`,
  `useCarousel`, não `useHelpers`.
- Efeitos com cleanup simétrico; refs para recursos mutáveis.
- Requisições assíncronas: `AbortController`, guarda de corrida (`runId`) e
  cleanup no unmount.
- Callbacks retornados devem ser estáveis quando entram em dependências de
  outros hooks (`useCallback`).
- Não esconda JSX no hook; ele devolve dados e ações.

### 6.4 Utils e helpers

- Prefira funções pequenas, nomeadas pelo resultado:
  `buildExportPayload`, `resolveSelectedSensors`, `validateDateRange`,
  `assertMetadataMatches`.
- Devolva dados, não strings de UI. Validação devolve **chaves i18n**.
- Não mutar entradas. Quando a API do Chart.js exige, devolva nova estrutura.
- Documente unidade, nulabilidade e efeitos colaterais no JSDoc.
- Se a função começar a depender de estado React, ela virou hook.

### 6.5 Constantes e configuração

- Listas fixas, paletas, modos, períodos e labels ficam fora do render.
- Config que só muda por props deve ser derivada por `useMemo`, não recriada
  dentro do JSX quando entra em dependências.
- Exemplos: `PERIODOS`, `SLIDES`, `PMS_FIELDS`, `PMS_COLORS`, `CONFIG_SELECT`,
  `STATS_FIXAS`, `INPUT_CLASS`.

### 6.6 Store e API

- Slice continua dono do estado global e dos thunks; a feature não duplica esse
  estado localmente sem motivo.
- `APIService` concentra transporte. Hook/container chama o serviço; componente
  não.
- Erros de API são normalizados antes de chegar na UI
  (`toExportError` → `{ code, messageKey, status, details }`).
- O componente renderiza `t(messageKey)`, nunca uma mensagem técnica crua.

### 6.7 Estado global e seletores

- Seletor é contrato do slice: exporte `selectX` e importe do slice. Não repita
  `useSelector((state) => state.ui.selectedVariable)` em cada componente.
- Seletor derivado (soma, filtro, agrupamento) usa `createSelector` do RTK. Não
  derive dado dentro de `useSelector` inline: isso recalcula a cada ação e cria
  nova referência.
- Estado global guarda dado normalizado, não dado já formatado para uma tela.
- Não copie estado do Redux para `useState` local sem edição real. A cópia vira
  uma segunda fonte de verdade.
- Documente o shape de `loading`, `error` e `data`. `error` é código ou chave
  i18n, não frase pronta; `loading` não substitui estado vazio/erro.
- Requisição com resposta fora de ordem usa `runId`/`signature` no slice ou no
  thunk. `readingsSlice` usa `signature`; use como referência.

### 6.8 Fronteira da API

- `src/API` faz transporte: monta request, lê resposta e lança erro tipado. Não
  traduz, não formata para UI e não conhece componentes.
- Normalização de payload acontece uma vez, na fronteira ou em helper
  compartilhado. Exemplo: `parseReadingDatetime`, `normalizeReading` e
  `normalizeReadings` vivem em `src/helpers/readings.js`; os slices apenas
  orquestram.
- Slice não parseia data, não converte unidade e não infere `source`.
- `_fetchJson`/`_request` não podem engolir erro e devolver `undefined`.
  Diferencie erro de rede, HTTP inválido, corpo inválido e cancelamento.
- Erro de transporte vira `{ code, status, details }` (ou `ExportApiError`);
  a UI traduz a chave i18n.
- Valide a config no bootstrap: `VITE_API_URL` ausente deve falhar com mensagem
  clara, não gerar `undefined/v1/...`.
- `VITE_*` é público: segredo não entra no frontend.

---

## 7. React: estado, derivação e efeitos

### 7.1 Derivação

```js
// Evite: estado que só existe para espelhar cálculo
const [stats, setStats] = useState(INITIAL);
useEffect(() => setStats(buildStats(sensors)), [sensors]);

// Prefira: derivação
const stats = useMemo(() => buildStats(sensors), [sensors]);
```

- Fonte de verdade única: não copie props/Redux para estado local sem edição.
- `useMemo` é para cálculo caro ou identidade que entra em dependências; não
  memoize tudo por reflexo.
- Use inicializador preguiçoso quando o valor inicial depende de cálculo/data:
  `useState(() => defaultDateRange())`.

### 7.2 Efeitos

- Um efeito, um assunto.
- Cleanup simétrico:

```js
useEffect(() => {
  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, []);
```

- O efeito deve depender do recurso real, não de um proxy indireto. Exemplo:
  `useChartInstance` recebe `visible`, pois o canvas só existe quando o gráfico
  está visível.
- Nada de `async` direto no `useEffect`; defina a função interna e controle
  cancelamento.
- Ações disparadas por evento ficam no handler, não em efeito.

### 7.3 Timers e listeners

```js
// Evite: cada clique empilha um timeout
setPaused(true);
setTimeout(() => setPaused(false), 10000);

// Prefira: um timer por vez, limpo no unmount
resumeTimeoutRef.current = setTimeout(() => {
  resumeTimeoutRef.current = null;
  setPaused(false);
}, autoplayMs);

useEffect(() => () => clearTimeout(resumeTimeoutRef.current), []);
```

- Timer/listener recorrente em 2+ componentes → hook compartilhado
  (`useClickOutside`, `useInterval`).
- Sempre limpe no unmount e antes de reagendar.

### 7.4 Operações assíncronas

- Use `AbortController` para cancelar requisições/streams.
- Use um `runId` incremental para ignorar resposta antiga que chega depois de
  uma nova ação.
- No cleanup, incremente o `runId` e aborte.
- Exponha ações de domínio (`exportNow`, `cancel`, `retry`, `reset`), não
  detalhes de `fetch`.

Referência: `src/components/export-readings/hooks/useExportReadings.js`.

---

## 8. Estados, validação e erros

### 8.1 Estados explícitos

Modele os estados mutuamente exclusivos em um componente dedicado:

- sem seleção → loading → erro → vazio → conteúdo.

Exemplo: `chart/components/chart-state.jsx` centraliza as mensagens e mantém a
ordem de precedência. `export-feedback.jsx` faz o mesmo para validação, erro,
cancelamento e sucesso.

### 8.2 Validação

- Validação é função pura: recebe dados, devolve erros e/ou payload pronto.
- Erros são **chaves i18n**, não frases.
- O componente só traduz e renderiza.

```js
// export-readings/utils/build-export-payload.js
prepareExportRequest({ sensors, selecao, startDate, endDate, precision, today });
// → { errors: ['exportData.validation...'], payload, selected, ... }
```

### 8.3 Normalização de erro

- Converta erro de transporte em estrutura de UI uma única vez
  (`utils/errors.js`).
- Não despeje `error.message` técnico na tela.
- `role="alert"`/`aria-live` devem acompanhar mensagens dinâmicas.
- Cancelamento não é erro fatal: a UI deve distinguir `CANCELLED`.

### 8.4 Invariantes de domínio

Regra de domínio não fica no JSX nem no seletor de tela. Fica em util puro, com
JSDoc e, quando possível, teste.

- Unidades explícitas no nome ou na documentação: `µg/m³`, `°C`, bytes, ms.
- Timezone explícito. Datas da API são normalizadas para ISO UTC; filtros de
  calendário usam o fuso de São Paulo (`todayInSaoPaulo`).
- Enums de domínio centralizados (`RedeAr`, `purpleAir`, `source`, UF), sem
  string mágica repetida.
- Intervalo de datas, precisão e campos opcionais têm validação única; a UI
  recebe chave de erro.
- Campo ausente tem tratamento definido: `sensor.estado` ausente, lista vazia,
  leitura sem `datetime`.
- Invariante não vira `if` defensivo espalhado: normalize na fronteira e deixe o
  restante do código assumir o contrato.

---

## 9. Contratos e APIs de componentes

- Props documentadas com JSDoc quando o componente é compartilhado ou tem
  contrato não óbvio.
- Nomes: `value`/`onChange`, `onRetry`, `onCancel`, `disabled`, `loading`.
- Componente compartilhado evolui por props, não por fork. Se a variante muda
  apenas texto/comportamento pontual, parametrize.
- Evite passar objetos gigantes (`state` inteiro) quando três valores bastam.
- Não exponha a instância interna de Chart/OpenLayers; devolva apenas o
  necessário (ex.: `canvasRef`, `resetZoom`).
- Mantenha o contrato de retorno de hooks pequeno e nomeado por domínio.

---

## 10. Nomenclatura, arquivos e barrels

### 10.1 Nomes

- Hooks: `useX`.
- Fábricas/construtores: `createX`, `buildX` ou `criarX`/`montarX` conforme o
  domínio local.
- Resolução/transformação: `resolveX`, `formatX`, `toXError`, `validateX`,
  `assertX`.
- Booleanos: `isX`, `hasX`, `temX`, `mostrarX`.
- Handlers: `handleX`; callbacks de prop: `onX`.
- Domínio em português quando o arquivo já usa português (`montarSeries`,
  `resolverIds`, `faixasVisiveis`, `formatarDataInput`); infraestrutura React em
  inglês (`useChartData`, `buildStats`). **Siga a convenção do arquivo/pasta;
  não renomeie o existente só para uniformizar.**

### 10.2 Arquivos

- Componente principal exportado: `PascalCase.jsx` (`SensorSelect.jsx`).
- Subcomponentes/painéis: `kebab-case.jsx` (`sensor-select-panel.jsx`,
  `chart-state.jsx`, `export-feedback.jsx`).
- Hooks: `camelCase.js` (`useChartData.js`).
- Utils/helpers: `kebab-case.js` (`build-export-payload.js`, `date-range.js`).
- Pasta só quando há um componente compartilhado com múltiplos arquivos ou um
  conjunto coeso (`sensor-select/`, `export-readings/`).

### 10.3 Barrels

- Cada pasta expõe seu contrato em `index.js`.
- `src/components/index.js` reexporta features e componentes compartilhados.
- Evite importar caminho interno de outra feature
  (`@/components/chart/utils/...`); importe o barrel público.
- Não crie ciclo: `utils` não importa `components`; `components` não importa o
  container; `src/helpers` não importa features.

---

## 11. JSDoc e tipagem

- Documente hooks/helpers públicos com `@param`, `@returns` e unidades.
- Documente contratos de props de componentes compartilhados.
- Comentários explicam **por que**, não o que o código já diz.
- Tipos globais de domínio podem viver em um arquivo sem `import`/`export`
  (ex.: `map-view/helpers/types.js`), com prefixo para evitar colisão com tipos
  nativos (`MapSensor`, não `Sensor`).
- Tipagem é camada de DX: se o IntelliSense quebrar, remova a parte de tipos sem
  reverter a organização estrutural.
- Verifique o `jsconfig.json` ao mexer em tipos. A opção
  `ignoreDeprecations: "6.0"` pode não ser aceita por todas as versões de
  TypeScript usadas pelo editor; valide no VSCode antes de considerar a tarefa
  concluída.

---

## 12. Acessibilidade e paridade visual

Ao dividir um componente, preserve:

- `role`, `aria-haspopup`, `aria-expanded`, `aria-multiselectable`, `aria-busy`,
  `aria-live`, `aria-label`;
- `<button type="button">` e `<label>` associados;
- estados `disabled`, foco e navegação por teclado;
- classes, ordem de elementos e transições;
- chaves de i18n e parâmetros de interpolação.

Um `role="listbox"` pertence ao painel que contém as opções, não ao wrapper do
componente. Ao mover JSX, mova a semântica junto.

### 12.1 Baseline para código novo

Preservar o que existe não basta para código novo:

- elemento nativo primeiro: `<button type="button">` para ação, `<a>` para
  navegação e `<label>` para campo. Nunca `<span onClick>` clicável.
- teclado completo: `Tab`, `Enter`/`Space`, `Escape` fecha dropdown e devolve o
  foco ao botão; setas navegam em listbox/menu.
- nome acessível: `aria-label` ou `<label>` associado. Placeholder não é label.
- dropdown: `aria-haspopup`, `aria-expanded` e `aria-controls`; opções com
  `role="option"` e `aria-selected`; `role="listbox"` só no container das
  opções.
- mensagens dinâmicas com `role="status"`/`role="alert"` e `aria-live`.
- autoplay/carrossel: pausa acessível, pausa em hover/focus/aba oculta e
  respeito a `prefers-reduced-motion`.
- imagens com `alt`, `width`/`height` e estratégia de carregamento adequada.
- contraste e foco visível preservados.

Exemplos atuais que não atendem: os dots do `hero-slider` são `<span onClick>`;
o `SensorSelect` usa `role="listbox"` com filhos `<label>`; o input de busca não
tem label.

### 12.2 Design tokens e estilos

- Cor, raio, sombra, fonte e transição vêm do `tailwind.config.js`. Use
  `text-laranja`, `bg-card`, `rounded-sm` e `shadow-glass`; não repita hex.
- Hex inline é exceção para gradiente, SVG ou valor realmente dinâmico, com
  comentário.
- Não crie cor nova sem token. Se a cor é semântica (erro, sucesso, foco),
  prefira um token semântico.
- Strings de classe repetidas (input, foco, botão) viram constante ou
  componente; não copie a mesma classe em cinco arquivos.
- Trocar hex por token é refactor visual: deve manter o mesmo pixel. Se mudar o
  tom, é correção/design, não refactor.

---

## 13. Validação e definição de pronto

### 13.1 Comandos

```bash
npm run lint
npm run build
git diff --check
```

O projeto não tem suíte de testes configurada (`package.json` não expõe script
de `test`). A validação é lint + build + smoke manual. Funções puras de
`utils/` são os melhores candidatos para os primeiros testes quando houver
runner no projeto.

### 13.2 Checklist de smoke manual

- **Gráfico:** sem seleção, loading, erro, vazio e dados; troca de período;
  datas manuais; modos sensor/município/estado; busca e multi-seleção; chips;
  troca de variável; zoom/pan/reset; troca de idioma.
- **Mapa:** carregamento, popup, mini gráfico, troca de variável, cluster,
  spiderfy, recenter.
- **Exportação:** modos, validações, progresso, cancelamento, sucesso,
  “baixar novamente”, retry e disabled durante export.
- **Carrossel:** autoplay, setas/dots, pausa/retomada, unmount sem timers
  pendentes.
- **Contato:** campos obrigatórios, e-mail inválido, sucesso, reset e limpeza de
  status ao digitar.
- **About:** contagem com lista vazia, lista válida e item sem `estado`.
- **Navbar/Footer:** todas as âncoras e fechamento do menu mobile.

### 13.3 Definition of Done

- [ ] Comportamento visual e funcional preservado.
- [ ] Bug fixes (se houver) documentados separadamente.
- [ ] `npm run lint` passa sem warnings.
- [ ] `npm run build` passa.
- [ ] `git diff --check` limpo.
- [ ] Nenhum arquivo fora do escopo alterado.
- [ ] Sem código morto/import não usado.
- [ ] JSDoc nos novos hooks/helpers públicos.
- [ ] Barrels/exports atualizados.
- [ ] Seletores exportados pelo slice; sem `state.ui.*` inline repetido.
- [ ] Nenhuma normalização de payload duplicada em slice/componente.
- [ ] Invariantes de domínio em util puro e documentado.
- [ ] Baseline de acessibilidade aplicado a código novo.
- [ ] Cores/tokens reutilizados; sem hex de marca inline quando há token.
- [ ] Sem `console.log`, código comentado ou `TODO` sem issue.
- [ ] Smoke manual dos fluxos afetados.
- [ ] Diff revisável, sem reformatação/reordenação em massa.
- [ ] Avisos pré-existentes (ex.: chunk > 500 kB) não foram introduzidos nem
      “corrigidos” fora de escopo.

### 13.4 ESLint como contrato arquitetural

O guia descreve a direção das dependências; o ESLint deve barrar o que quebra
essa direção.

- `npm run lint` deve rodar com `--max-warnings=0`. Warning tolerado vira
  dívida invisível; se uma regra nova gerar baseline grande, ative aos poucos e
  registre a dívida.
- `eslint-plugin-jsx-a11y` para o baseline de acessibilidade.
- `import/no-cycle` (ou `madge`/`dpdm` no CI) para barrar ciclo entre barrels.
- `no-restricted-imports` por camada:
  - `src/helpers/**` não importa `@/components/**` nem `@/store/**`;
  - `src/components/*/utils/**` não importa React, store, API nem
    `components/`;
  - `src/components/*/components/**` não importa `@/API/**`;
  - feature não importa caminho interno de outra feature; use o barrel.
- Política de `console`: proibido no caminho de produção; exceção explícita
  para `console.warn` de i18n em DEV.
- `eslint-disable` exige justificativa na mesma linha ou na linha anterior.
- Ativar regra nova não autoriza corrigir o repositório inteiro no mesmo commit
  de refactor.

### 13.5 Higiene de configuração e código

- Config de ambiente validada no bootstrap; falhar cedo e com mensagem clara.
- `.env` não versionado; `.env.example` mantém paridade com as chaves usadas.
- `jsconfig.json` e aliases: mudança de resolução de módulo é tarefa própria,
  não efeito colateral de refactor.
- Sem código comentado, `TODO` sem issue, export não usado, prop morta ou branch
  inalcançável “para depois”.
- `console.log` não passa em review; `console.warn`/`console.error` só em ponto
  central de log ou DEV justificado.
- Arquivo de config (Vite, Tailwind, ESLint, Docker/nginx) só muda se o escopo
  da refatoração exigir; registre o motivo no PR.

---

## 14. Casos desta sessão

| Commit    | Escopo               | Decisão estrutural                                                                                                   | Lição                                                |
| --------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `089d8f8` | Mapa                 | `index.jsx` 540 → 208 linhas; helpers de mapa/features/spiderfy/styles/animação; typedefs globais `Map*`             | Orquestração separada de integração com OpenLayers   |
| `2d98441` | About                | `buildStats` puro + `useMemo`; 91 → 65 linhas                                                                        | Estado derivado não precisa de estado/efeito         |
| `97fc53c` | Chart                | `useChartData`, `useChartReadings`, `useChartInstance`, `ChartState`; 298 → 161 linhas                               | Container orquestra; ciclo do Chart tem hook próprio |
| `42845cf` | Mini gráfico         | Config/datasets em `map-view/helpers/sensor-mini-chart.js`; componente 148 → 42 linhas                               | Componente vira wrapper do Chart.js                  |
| `5f0b9f9` | Componentes diversos | `useClickOutside`, `scrollToAnchor`, `useCarousel`, `contact/form`, `formatLimite`                                   | Comportamento repetido sobe para compartilhado       |
| `26d4625` | Exportação           | Feature completa em `components/hooks/utils`; `SensorSelect` promovido; erros normalizados; abort/progresso/metadata | Este é o template de feature para novas telas        |

### 14.1 Chart: separação em três hooks

- `useChartData`: resolve seleção, variável, intervalo, filtro, séries, faixas e
  métricas derivadas.
- `useChartReadings`: busca sensores/leituras e expõe `retry` com a mesma
  assinatura de requisição.
- `useChartInstance`: registra plugins, cria/destrói Chart.js e expõe
  `resetZoom`; só cria quando `visible`.
- `ChartState`: concentra estados sem seleção/loading/erro/vazio.
- `SensorSelect`: lógica pura em `utils`, UI em painel/opção, fora-click via
  hook compartilhado.

### 14.2 Exportação: referência de feature completa

- Container controla formulário, seleção, período, precisão e erros locais.
- Hook controla status, progresso, cancelamento, retry e download.
- Utils montam payload, validam datas, normalizam erros, validam metadata e
  disparam download.
- Componentes só desenham filtros, resumo, progresso, feedback e ajuda.
- `SensorSelect` foi reutilizado com `disabled` e chaves i18n, em vez de
  duplicado.

### 14.3 Compartilhamento por repetição

- `useClickOutside` substituiu três listeners `mousedown` duplicados
  (`SensorSelect`, `VariableSelector`, `SensorTypeLegend`).
- `scrollToAnchor` substituiu `document.querySelector(href).scrollIntoView` em
  navbar e footer.
- `formatLimite` saiu da legenda do gráfico para `src/helpers/format.js`.
- `SensorSelect` saiu de `chart/components` para
  `src/components/sensor-select/` quando a exportação virou segundo consumidor.
- `parseReadingDatetime`, `normalizeReading` e `normalizeReadings` saíram de
  `readingsSlice`/`sensorsSlice` para `src/helpers/readings.js`.

---

## 15. Catálogo de anti-patterns

| Anti-pattern                | Sintoma                                             | Correção                                   |
| --------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Estado derivado com efeito  | `useState` + `useEffect` recalculando stats         | `useMemo` + função pura                    |
| Timeout empilhado           | cada clique agenda outro `setTimeout` sem limpar    | ref + `clearTimeout` + cleanup             |
| Listener duplicado          | mesmo `mousedown` em vários componentes             | hook compartilhado com `enabled`           |
| Scroll repetido             | `querySelector`/`scrollIntoView` em navbar e footer | helper `scrollToAnchor`                    |
| Fork de componente          | copiar dropdown para mudar um texto/prop            | parametrizar e promover para compartilhado |
| Componente “faz tudo”       | fetch + cálculo + Chart + JSX no mesmo arquivo      | container + hooks + utils                  |
| Config inline               | arrays/objetos grandes dentro do render             | constante de módulo                        |
| Cálculo em JSX              | `map/filter/reduce` pesado no retorno               | `useMemo`/util puro                        |
| Erro como string de UI      | mensagem técnica hardcoded no JSX                   | `{ code, messageKey }` + `t()`             |
| Fetch no componente         | `APIService` dentro de componente presentacional    | hook/container                             |
| Efeito dependente de proxy  | cria Chart quando canvas ainda não existe           | depender de `visible`/recurso real         |
| Guard invertido             | `!Array.isArray(x) && x.length === 0`               | normalizar (`Array.isArray ? x : []`)      |
| Dead code                   | `useMemo` cujo resultado ninguém usa                | remover                                    |
| Ruído no diff               | reordenar exports/imports sem necessidade           | manter ordem e mexer só no necessário      |
| Seletor inline repetido     | `useSelector((state) => state.ui.x)` em N arquivos  | exportar `selectX` no slice                |
| Normalização duplicada      | parse/normalize copiado em dois slices              | helper compartilhado na fronteira          |
| API traduz                  | `APIService` importa `t`                            | erro `{ code, status }` + `t()` na UI      |
| Contrato de erro misto      | `error.message ?? 'errors.x'`                       | sempre chave/código, nunca os dois         |
| Texto de UI hardcoded       | `'10 mil+'` em arquivo JS                           | chave i18n + `Intl`                        |
| Ação em elemento não nativo | `<span onClick>` para dot/ação                      | `<button>` + teclado                       |
| Hex de marca inline         | `#FF6D00` apesar do token `laranja`                 | token do Tailwind                          |
| Erro engolido               | `catch` com `console.error` e retorno `undefined`   | erro tipado + ponto central de log         |
| Dívida invisível            | `TODO`/código comentado sem issue                   | remover ou abrir tarefa                    |

---

## 16. Bugs corrigidos durante a refatoração

| Bug                                                                  | Correção                                                   |
| -------------------------------------------------------------------- | ---------------------------------------------------------- |
| `About` acessava `.length` quando `sensors` não era array            | `buildStats` normaliza para `[]` e filtra `estado` ausente |
| Carrossel empilhava timeouts de pausa                                | `useCarousel` mantém um único timeout e limpa no unmount   |
| Status do contato permanecia após digitar                            | `handleChange` limpa o status                              |
| `useChartInstance` podia criar Chart sem canvas montado              | recebe `visible` e só cria quando o gráfico está visível   |
| Mini gráfico usava `Math.max` em valores possivelmente não numéricos | conversão explícita para `Number` antes de comparar        |
| Cleanup do mini gráfico não anulava a ref                            | cleanup destrói e seta `chartRef.current = null`           |
| Formatter de data e de faixa duplicados                              | `formatarDataInput` e `formatLimite` compartilhados        |

---

## 17. Dívidas conhecidas

- **Sem testes automatizados:** lint/build não cobrem regressão de comportamento;
  o smoke manual é obrigatório.
- **Sem CI de lint/build:** os workflows atuais só fazem deploy. Se possível,
  adicionar um workflow de validação.
- **Bundle > 500 kB:** aviso pré-existente do Vite. Não é regressão deste
  trabalho; code splitting deve ser tratado como tarefa própria.
- **Tipagem JSDoc:** os typedefs `Map*` são globais e dependem do editor incluir
  `src` no projeto. Validar IntelliSense; se falhar, remover tipos sem desfazer
  a organização.
- **Convenções mistas:** há `utils` e `helpers` com fronteiras parecidas e nomes
  em PT/EN. Para código novo, siga a tabela deste guia; não faça renomeação em
  massa.
- **Barrel global amplo:** `src/components/index.js` reexporta todas as features.
  Funciona, mas exige disciplina para não criar ciclos; prefira importar do
  barrel da feature.

---

## 18. Template de PR de refatoração

```md
## Objetivo

Qual dívida técnica esta mudança reduz?

## O que mudou

- [ ] camada/arquivo movido
- [ ] hook/helper extraído
- [ ] componente dividido
- [ ] código morto removido

## Comportamento preservado

Descreva o que foi conferido (visual, props, i18n, a11y, eventos).

## Bugs corrigidos (se houver)

- Antes:
- Depois:

## Estrutura

- Novos arquivos:
- Arquivos removidos:
- Barrels/exports alterados:

## Validação

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `git diff --check`
- [ ] smoke manual dos fluxos afetados
- [ ] IntelliSense verificado (se mexeu em tipos)

## Riscos / follow-ups

O que ficou fora do escopo?
```

---

## 19. Regra final

Se houver dúvida entre uma abstração “elegante” e um diff pequeno, legível e
com comportamento comprovadamente igual, escolha o diff pequeno. A refatoração
existe para reduzir o custo da próxima mudança, não para maximizar a quantidade
de arquivos.
