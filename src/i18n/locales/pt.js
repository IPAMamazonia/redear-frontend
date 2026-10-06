/**
 * Dicionário canônio (pt-BR).
 *
 * Todas as strings de exibição da UI vivem aqui, organizadas por seção.
 * Os demais idiomas devem espelhar exatamente esta árvore de chaves
 * (verificado por `scripts/check-i18n.js`).
 */
export default {
  common: {
    language: 'Idioma',
    retry: 'Tentar novamente',
    remove: 'Remover',
    loading: 'Carregando...',
    error: 'Erro',
    noDataShort: 'Dados insuficientes para o gráfico',
  },

  errors: {
    requestFailed: 'Falha na requisição',
    fetchSensors: 'Erro ao buscar sensores',
    fetchReadings: 'Erro ao buscar leituras',
  },

  nav: {
    about: 'Sobre',
    map: 'Mapa',
    chart: 'Gráfico',
    faq: 'FAQ',
    contact: 'Fale Conosco',
    partners: 'Parceiros',
    menu: 'Menu',
  },

  hero: {
    prev: 'Anterior',
    next: 'Próximo',
    slides: [
      {
        title: 'RedeAr: Monitorando a Qualidade do Ar',
        subtitle: 'Dados em tempo real da qualidade do ar em todo o Brasil',
        author: 'Foto: Filipe Viegas de Arruda',
      },
      {
        title: 'Monitoramento da qualidade do ar em territórios tradicionais',
        subtitle: '',
        author: 'Foto: Bibiana Garrido',
      },
      {
        title: 'Qualidade do Ar Importa',
        subtitle: 'Acompanhe a qualidade do ar em tempo real e proteja sua saúde',
        author: 'Foto: Victor Moriyama',
      },
    ],
  },

  about: {
    subtitle: 'Conheça nossa iniciativa de monitoramento da qualidade do ar',
    titlePre: 'Sobre a',
    p1Pre: 'A ',
    p1Mid:
      ' é uma plataforma de monitoramento da qualidade do ar desenvolvida para acompanhar em tempo real os índices de poluentes atmosféricos em todo o ',
    p1Post: '.',
    p2: 'Ela foca em três principais objetivos: visualização, armazenamento e disponibilidade dos dados de sensores de diferentes parceiros da rede de monitoramento.',
    p3Pre:
      'Por meio de uma rede de sensores distribuídos estrategicamente, coletamos dados de material particulado (PM2.5 e PM10), umidade relativa do ar e temperatura, transformando essas informações em ',
    p3Strong: 'dados abertos e acessíveis',
    p3Post: ' para pesquisadores, gestores públicos e a sociedade civil.',
    p4Pre: 'Nosso objetivo é ',
    p4Strong: 'fortalecer a rede de monitoramento da qualidade do ar no Brasil',
    p4Post:
      ', fornecendo dados em tempo real para auxiliar na elaboração de políticas públicas que impactem positivamente na saúde da população.',
    stats: {
      sensorsTotal: 'Sensores Totais',
      statesMonitored: 'Estados Monitorados',
      sensorsRedear: 'Sensores RedeAr',
      sensorsPurpleair: 'Sensores PurpleAir',
      readingsDaily: 'Leituras Coletadas todos os dias',
      monitoringContinuous: 'Monitoramento Contínuo',
    },
  },

  footer: {
    columns: {
      network: 'RedeAr',
      contact: 'Contato',
      links: 'Links',
      social: 'Redes Sociais',
      legal: {
        privacy: 'Política de Privacidade',
        terms: 'Termos de Uso',
        api: 'API de Dados',
      },
    },
    rights: 'Todos os direitos reservados.',
    developedWith: 'Desenvolvido com ',
    byTeam: ' pela equipe RedeAr.',
  },

  partners: {
    titlePre: 'Instituições',
    titleHighlight: 'Envolvidas',
    developedBy: 'Desenvolvido por',
    ourPartners: 'Nossos Parceiros',
    sensorDevelopment: 'Desenvolvimento dos Sensores',
  },

  faq: {
    subtitle: 'Tire suas dúvidas sobre o projeto e a qualidade do ar',
    titlePre: 'Perguntas',
    titleHighlight: 'Frequentes',
    items: [
      {
        q: 'O que é o Índice de Qualidade do Ar (AQI)?',
        a: 'O AQI (Air Quality Index) é um índice padronizado que representa a qualidade do ar com base na concentração de poluentes atmosféricos. Quanto maior o valor do índice, pior é a qualidade do ar e maiores são os riscos à saúde. A escala do AQI varia de 0 a 500, sendo que valores mais baixos indicam melhor qualidade do ar. O índice é calculado a partir das concentrações de poluentes, como o material particulado (PM2.5 e PM10), entre outros, conforme a metodologia adotada.',
      },
      {
        q: 'Como a qualidade do ar é medida?',
        a: 'Utilizamos sensores de baixo custo que realizam medições contínuas da qualidade do ar. Os equipamentos monitoram a concentração de material particulado (PM2.5 e PM10), além da temperatura e da umidade relativa do ar. Os dados coletados são processados e convertidos em indicadores de qualidade do ar com base em metodologias reconhecidas internacionalmente e nas diretrizes dos órgãos ambientais brasileiros, permitindo o acompanhamento das condições atmosféricas em tempo real.',
      },
      {
        q: 'O que significam as cores do AQI?',
        a: 'As cores representam as categorias de qualidade do ar e indicam o potencial risco à saúde associado à exposição aos poluentes atmosféricos: Verde (Bom) — 0 a 40; Amarelo (Moderado) — 41 a 80; Laranja (Ruim) — 81 a 120; Vermelho (Muito Ruim) — 121 a 200; Marrom (Péssimo) — acima de 200. Quanto pior a categoria, maiores são os riscos à saúde, especialmente para crianças, idosos, gestantes e pessoas com doenças respiratórias ou cardiovasculares.',
      },
      {
        q: 'Como a poluição do ar afeta a saúde?',
        a: 'A exposição à poluição do ar pode causar ou agravar diversos problemas de saúde, especialmente quando os níveis de poluentes permanecem elevados por longos períodos. Entre os principais efeitos estão irritação nos olhos, nariz e garganta, dificuldade para respirar, agravamento de doenças respiratórias, como asma e bronquite, e aumento do risco de doenças cardiovasculares. Crianças, idosos, gestantes e pessoas com doenças respiratórias ou cardiovasculares são os grupos mais vulneráveis aos impactos da poluição do ar.',
      },
      {
        q: 'Os dados são atualizados em tempo real?',
        a: 'Sim! Os sensores da RedeAr transmitem dados automaticamente para a plataforma a cada hora. Assim que novas medições são recebidas, os gráficos e indicadores são atualizados, permitindo o acompanhamento contínuo da qualidade do ar nas regiões monitoradas.',
      },
      {
        q: 'Como posso contribuir com o projeto?',
        a: 'Você pode contribuir divulgando a iniciativa, compartilhando os dados da plataforma, estabelecendo parcerias ou apoiando o desenvolvimento do projeto. Instituições de pesquisa, organizações da sociedade civil e órgãos públicos também podem colaborar por meio da instalação de novos sensores e da utilização dos dados em pesquisas, estudos e na formulação de políticas públicas. Se sua instituição tem interesse em fazer parte da RedeAr, entre em contato conosco.',
      },
      {
        q: 'O projeto cobre todo o Brasil?',
        a: 'Ainda não. Atualmente, a RedeAr conta com sensores instalados em estados das regiões Norte e Centro-Oeste, e está em constante expansão para ampliar a cobertura do monitoramento da qualidade do ar no país. Nosso objetivo é construir uma rede nacional de monitoramento que contemple todos os biomas brasileiros — Amazônia, Cerrado, Pantanal, Caatinga, Mata Atlântica e Pampa —, fortalecendo a disponibilidade de dados em diferentes regiões do Brasil.',
      },
      {
        q: 'Como os sensores são instalados e mantidos?',
        a: 'Os sensores da RedeAr são instalados em parceria com universidades, instituições de pesquisa, unidades de conservação, comunidades indígenas e outras organizações parceiras. Cada estação passa por inspeções e manutenções periódicas para garantir seu funcionamento adequado e a qualidade dos dados coletados. Além disso, os dados são submetidos a procedimentos de controle de qualidade para assegurar sua confiabilidade antes de serem disponibilizados na plataforma.',
      },
    ],
  },

  contact: {
    subtitle: 'Tem dúvidas, sugestões ou quer ser parceiro? Entre em contato!',
    titlePre: 'Fale',
    titleHighlight: 'Conosco',
    infoTitle: 'Informações de Contato',
    partnershipText:
      'Estamos abertos a parcerias com instituições de pesquisa, órgãos governamentais e organizações da sociedade civil comprometidas com a preservação ambiental.',
    placeholders: {
      name: 'Seu nome',
      email: 'Seu e-mail',
      subject: 'Assunto',
      message: 'Sua mensagem',
    },
    status: {
      missingFields: 'Por favor, preencha todos os campos.',
      invalidEmail: 'Por favor, insira um e-mail válido.',
      sent: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    },
    submit: 'Enviar Mensagem',
  },

  variables: {
    pm25: 'PM2.5',
    aqi: 'US EPA PM2.5',
    pm1: 'PM1.0',
    pm10: 'PM10',
    temperature: 'Temperatura',
    humidity: 'Umidade',
    pressure: 'Pressão',
    p03um: 'P ≥ 0.3µm',
    p10um: 'P ≥ 1.0µm',
    p25um: 'P ≥ 2.5µm',
    p100um: 'P ≥ 10µm',
  },

  map: {
    subtitle: 'Clique nos sensores para ver detalhes da qualidade do ar em todo o Brasil',
    title1: 'Mapa de',
    title2: 'Sensores',
    selectVariable: 'Selecionar variável',
    dataSource: 'Origem dos dados desse sensor',
    awaitingData: 'Aguardando dados',
    sensorOffline: 'Sensor offline',
    latestReading: 'Última leitura',
    firstReading: 'Primeira leitura',
    untrustworthySensors: ' Leitura divergentes entre os sensores, os dados podem não ser confiáveis. ',
    hideChart: 'Ocultar gráfico',
    viewHistory: 'Ver Histórico (gráfico)',
    loadingSensors: 'Carregando sensores…',
    recenter: 'Centralizar mapa',
    disableClusters: 'Desabilitar clusters',
    enableClusters: 'Habilitar clusters',
    sensorTypes: 'Tipos de Sensor',
    circular: 'circular',
    square: 'quadrado',
  },

  chart: {
    title1: 'Qualidade do Ar',
    title2: 'ao Longo do Tempo',
    subtitle: 'Acompanhe a evolução dos índices com filtros de período e localização',
    manualDates: 'Datas manuais',
    from: 'De',
    to: 'Até',
    backToPresets: 'Voltar aos períodos pré-definidos',
    presets: 'Períodos',
    interval: {
      required: 'Informe as datas inicial e final.',
      futureDates: 'As datas não podem ser futuras.',
      endAfterStart: 'A data final deve ser posterior à inicial.',
      maxSixMonths: 'O intervalo máximo permitido é de 6 meses.',
    },
    resetZoom: 'Voltar ao zoom padrão',
    recenter: 'Recentralizar',
    emptyBefore: 'Selecione',
    emptySensors: 'sensores',
    emptyMid: ', um',
    emptyMunicipality: 'município',
    emptyMid2: 'ou um',
    emptyState: 'estado',
    emptyAfter: 'acima para visualizar a série do AQI.',
    loading: 'Carregando leituras...',
    noReadings: 'Nenhuma leitura encontrada no período selecionado para os filtros aplicados.',
    zoomHint: 'Arraste para zoom, role para ampliar. Passe o mouse sobre os pontos para detalhes.',
    modeSensors: 'Sensores',
    modeMunicipality: 'Município',
    modeState: 'Estado',
    placeholderSensors: 'Selecionar sensores',
    placeholderMunicipality: 'Selecione um município',
    placeholderState: 'Selecione um estado',
    search: 'Buscar...',
    unmarkVisible: 'Desmarcar visíveis',
    markVisible: 'Marcar visíveis',
    clearCount: 'Limpar ({count})',
    noOptions: 'Nenhuma opção disponível.',
    noResults: 'Nenhum resultado para "{search}".',
    selectedSingular: 'selecionado',
    selectedPlural: 'selecionados',
    removeSensor: 'Remover {name}',
  },

  bands: {
    good: 'Bom',
    goodFem: 'Boa',
    moderate: 'Moderado',
    moderateFem: 'Moderada',
    unhealthy: 'Insalubre',
    veryUnhealthy: 'Muito insalubre',
    hazardous: 'Perigoso',
    veryHazardous: 'Muito perigoso',
    poor: 'Ruim',
    veryPoor: 'Muito Ruim',
    veryBad: 'Péssima',
    cold: 'Frio',
    pleasant: 'Agradável',
    hot: 'Quente',
    veryHot: 'Muito quente',
    extreme: 'Extremo',
    veryDry: 'Muito seco',
    dry: 'Seco',
    comfortable: 'Confortável',
    humid: 'Úmido',
    veryHumid: 'Muito úmido',
    low: 'Baixa',
    normal: 'Normal',
    stable: 'Estável',
    high: 'Alta',
    veryHigh: 'Muito alta',
    noData: 'Sem dados',
    offline: 'Offline',
  },
};
