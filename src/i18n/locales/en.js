/**
 * English dictionary.
 *
 * Mirrors the key tree of `pt.js` exactly (checked by `scripts/check-i18n.js`).
 */
export default {
  common: {
    language: 'Language',
    retry: 'Try again',
    remove: 'Remove',
    loading: 'Loading...',
    error: 'Error',
    noDataShort: 'Not enough data for the chart',
  },

  errors: {
    requestFailed: 'Request failed',
    fetchSensors: 'Failed to fetch sensors',
    fetchReadings: 'Failed to fetch readings',
  },

  nav: {
    about: 'About',
    map: 'Map',
    chart: 'Chart',
    faq: 'FAQ',
    contact: 'Contact Us',
    partners: 'Partners',
    menu: 'Menu',
  },

  hero: {
    prev: 'Previous',
    next: 'Next',
    slides: [
      {
        title: 'RedeAr: Monitoring Air Quality',
        subtitle: 'Real-time air quality data across Brazil',
        author: 'Photo: Filipe Viegas de Arruda',
      },
      {
        title: 'Monitoring air quality in traditional territories',
        subtitle: '',
        author: 'Photo: Bibiana Garrido',
      },
      {
        title: 'Clean Air Matters',
        subtitle: 'Track air quality in real time and protect your health',
        author: 'Photo: Victor Moriyama',
      },
    ],
  },

  about: {
    subtitle: 'Learn about our air quality monitoring initiative',
    titlePre: 'About',
    p1Pre: '',
    p1Mid:
      ' is an air quality monitoring platform developed to track atmospheric pollutant levels in real time across ',
    p1Post: '.',
    p2: 'It focuses on three main goals: visualization, storage and availability of sensor data from different partners in the monitoring network.',
    p3Pre:
      'Through a strategically distributed network of sensors, we collect data on particulate matter (PM2.5 and PM10), relative humidity and temperature, turning this information into ',
    p3Strong: 'open and accessible data',
    p3Post: ' for researchers, public managers and civil society.',
    p4Pre: 'Our goal is to ',
    p4Strong: 'strengthen the air quality monitoring network in Brazil',
    p4Post:
      ', providing real-time data to support public policies that positively impact the health of the population.',
    stats: {
      sensorsTotal: 'Total Sensors',
      statesMonitored: 'Monitored States',
      sensorsRedear: 'RedeAr Sensors',
      sensorsPurpleair: 'PurpleAir Sensors',
      readingsDaily: 'Readings collected every day',
      monitoringContinuous: 'Continuous Monitoring',
    },
  },

  footer: {
    columns: {
      network: 'RedeAr',
      contact: 'Contact',
      links: 'Links',
      social: 'Social Media',
      legal: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Use',
        api: 'Data API',
      },
    },
    rights: 'All rights reserved.',
    developedWith: 'Developed with ',
    byTeam: ' by the RedeAr team.',
  },

  partners: {
    titlePre: 'Institutions',
    titleHighlight: 'Involved',
    developedBy: 'Developed by',
    ourPartners: 'Our Partners',
    sensorDevelopment: 'Sensor Development',
  },

  faq: {
    subtitle: 'Get answers about the project and air quality',
    titlePre: 'Frequently Asked',
    titleHighlight: 'Questions',
    items: [
      {
        q: 'What is the Air Quality Index (AQI)?',
        a: 'The AQI is a standardized index that represents air quality based on the concentration of atmospheric pollutants. The higher the index value, the worse the air quality and the greater the health risks. The AQI scale ranges from 0 to 500, with lower values indicating better air quality. The index is calculated from pollutant concentrations, such as particulate matter (PM2.5 and PM10), among others, according to the adopted methodology.',
      },
      {
        q: 'How is air quality measured?',
        a: 'We use low-cost sensors that take continuous air quality measurements. The equipment monitors particulate matter (PM2.5 and PM10) concentrations, as well as temperature and relative humidity. The collected data is processed and converted into air quality indicators based on internationally recognized methodologies and the guidelines of Brazilian environmental agencies, enabling real-time monitoring of atmospheric conditions.',
      },
      {
        q: 'What do the AQI colors mean?',
        a: 'The colors represent air quality categories and indicate the potential health risk associated with exposure to atmospheric pollutants: Green (Good) — 0 to 40; Yellow (Moderate) — 41 to 80; Orange (Poor) — 81 to 120; Red (Very Poor) — 121 to 200; Brown (Hazardous) — above 200. The worse the category, the greater the health risks, especially for children, the elderly, pregnant women and people with respiratory or cardiovascular conditions.',
      },
      {
        q: 'How does air pollution affect health?',
        a: 'Exposure to air pollution can cause or worsen several health problems, especially when pollutant levels remain high for long periods. The main effects include eye, nose and throat irritation, shortness of breath, worsening of respiratory conditions such as asthma and bronchitis, and an increased risk of cardiovascular disease. Children, the elderly, pregnant women and people with respiratory or cardiovascular conditions are the groups most vulnerable to the impacts of air pollution.',
      },
      {
        q: 'Is the data updated in real time?',
        a: 'Yes! RedeAr sensors automatically transmit data to the platform every hour. As soon as new measurements are received, the charts and indicators are updated, allowing continuous monitoring of air quality in the monitored regions.',
      },
      {
        q: 'How can I contribute to the project?',
        a: 'You can contribute by spreading the word about the initiative, sharing platform data, establishing partnerships or supporting the project development. Research institutions, civil society organizations and public agencies can also collaborate by installing new sensors and using the data in research, studies and public policy making. If your institution is interested in joining RedeAr, get in touch with us.',
      },
      {
        q: 'Does the project cover all of Brazil?',
        a: 'Not yet. Currently, RedeAr has sensors installed in states of the North and Central-West regions, and is constantly expanding to broaden air quality monitoring coverage across the country. Our goal is to build a national monitoring network covering all Brazilian biomes — Amazon, Cerrado, Pantanal, Caatinga, Atlantic Forest and Pampa — strengthening the availability of data in different regions of Brazil.',
      },
      {
        q: 'How are the sensors installed and maintained?',
        a: 'RedeAr sensors are installed in partnership with universities, research institutions, conservation units, indigenous communities and other partner organizations. Each station goes through periodic inspections and maintenance to ensure proper operation and data quality. In addition, data is subject to quality control procedures to ensure its reliability before being published on the platform.',
      },
    ],
  },

  contact: {
    subtitle: 'Questions, suggestions or want to become a partner? Get in touch!',
    titlePre: 'Contact',
    titleHighlight: 'Us',
    infoTitle: 'Contact Information',
    partnershipText:
      'We are open to partnerships with research institutions, government agencies and civil society organizations committed to environmental preservation.',
    placeholders: {
      name: 'Your name',
      email: 'Your email',
      subject: 'Subject',
      message: 'Your message',
    },
    status: {
      missingFields: 'Please fill out all fields.',
      invalidEmail: 'Please enter a valid email address.',
      sent: 'Message sent successfully! We will get back to you soon.',
    },
    submit: 'Send Message',
  },

  variables: {
    pm25: 'PM2.5',
    aqi: 'US EPA PM2.5',
    pm1: 'PM1.0',
    pm10: 'PM10',
    temperature: 'Temperature',
    humidity: 'Humidity',
    pressure: 'Pressure',
    p03um: 'P ≥ 0.3µm',
    p10um: 'P ≥ 1.0µm',
    p25um: 'P ≥ 2.5µm',
    p100um: 'P ≥ 10µm',
  },

  map: {
    subtitle: 'Click on the sensors to see air quality details across Brazil',
    title1: 'Sensor',
    title2: 'Map',
    selectVariable: 'Select variable',
    dataSource: 'Data source for this sensor',
    awaitingData: 'Awaiting data',
    sensorOffline: 'Sensor offline',
    latestReading: 'Last reading',
    firstReading: 'First reading',
    untrustworthySensors: ' Readings diverge between sensors; the data may not be reliable. ',
    hideChart: 'Hide chart',
    viewHistory: 'View history (chart)',
    loadingSensors: 'Loading sensors…',
    recenter: 'Recenter map',
    disableClusters: 'Disable clusters',
    enableClusters: 'Enable clusters',
    sensorTypes: 'Sensor Types',
    circular: 'circular',
    square: 'square',
  },

  chart: {
    title1: 'Air Quality',
    title2: 'over Time',
    subtitle: 'Track how indices evolve with period and location filters',
    manualDates: 'Manual dates',
    from: 'From',
    to: 'To',
    backToPresets: 'Back to preset periods',
    presets: 'Periods',
    interval: {
      required: 'Enter the start and end dates.',
      futureDates: 'Dates cannot be in the future.',
      endAfterStart: 'The end date must be after the start date.',
      maxSixMonths: 'The maximum allowed range is 6 months.',
    },
    resetZoom: 'Reset to default zoom',
    recenter: 'Recenter',
    emptyBefore: 'Select',
    emptySensors: 'sensors',
    emptyMid: ', a',
    emptyMunicipality: 'municipality',
    emptyMid2: 'or a',
    emptyState: 'state',
    emptyAfter: 'above to view the AQI series.',
    loading: 'Loading readings...',
    noReadings: 'No readings found in the selected period for the applied filters.',
    zoomHint: 'Drag to zoom, scroll to zoom further. Hover over points for details.',
    modeSensors: 'Sensors',
    modeMunicipality: 'Municipality',
    modeState: 'State',
    placeholderSensors: 'Select sensors',
    placeholderMunicipality: 'Select a municipality',
    placeholderState: 'Select a state',
    search: 'Search...',
    unmarkVisible: 'Unmark visible',
    markVisible: 'Mark visible',
    clearCount: 'Clear ({count})',
    noOptions: 'No options available.',
    noResults: 'No results for "{search}".',
    selectedSingular: 'selected',
    selectedPlural: 'selected',
    removeSensor: 'Remove {name}',
  },

  bands: {
    good: 'Good',
    goodFem: 'Good',
    moderate: 'Moderate',
    moderateFem: 'Moderate',
    unhealthy: 'Unhealthy',
    veryUnhealthy: 'Very unhealthy',
    hazardous: 'Hazardous',
    veryHazardous: 'Very hazardous',
    poor: 'Poor',
    veryPoor: 'Very poor',
    veryBad: 'Hazardous',
    cold: 'Cold',
    pleasant: 'Pleasant',
    hot: 'Hot',
    veryHot: 'Very hot',
    extreme: 'Extreme',
    veryDry: 'Very dry',
    dry: 'Dry',
    comfortable: 'Comfortable',
    humid: 'Humid',
    veryHumid: 'Very humid',
    low: 'Low',
    normal: 'Normal',
    stable: 'Stable',
    high: 'High',
    veryHigh: 'Very high',
    noData: 'No data',
    offline: 'Offline',
  },
};