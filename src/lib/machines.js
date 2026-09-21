export const MACHINE_CATEGORIES = ['Diagnostic', 'Therapeutic', 'Life Support', 'Lab Equipment', 'Monitoring']

const DEFAULT_SAFETY = [
  'Handle with care.',
  'Follow teacher or staff instructions.',
  'Return the unit after use.',
]

export const HOSPITAL_MACHINES = [
  {
    id: 'EQ-001',
    name: 'X-Ray Machine',
    aliases: ['xray', 'x-ray', 'radiograph', 'roentgen'],
    category: 'Diagnostic',
    manufacturer: 'GE Healthcare',
    model: 'XR-600',
    location: 'Radiology Department - Room 2',
    meaning: 'X-ray means “unknown ray.” Wilhelm Röntgen named it X because the radiation type was new.',
    whatFor: 'Taking pictures of bones and organs to find fractures, infections, or other problems.',
    purpose: 'Produces images of internal body structures using X-rays for diagnostic purposes.',
    safety: [
      'Use proper shielding (lead apron, barriers).',
      'Do not exceed recommended exposure limits.',
      'Follow radiation safety protocols.',
    ],
    releaseDate: '2021-06-15',
    yearIntroduced: 2018,
    aiSummary:
      'The X-Ray Machine is a diagnostic imaging device that uses ionizing radiation to capture images of bones, organs, and other internal structures.',
  },
  {
    id: 'EQ-002',
    name: 'Ultrasound Machine',
    aliases: ['sonogram', 'sonography', 'echo', 'ultrasound'],
    category: 'Diagnostic',
    manufacturer: 'Philips',
    model: 'Affiniti 70',
    location: 'Imaging Suite - Room 1',
    meaning: 'Ultra + sound: sound waves higher than human hearing used to form live body images.',
    whatFor: 'Seeing organs, blood flow, and babies in the womb without using radiation.',
    purpose: 'Uses high-frequency sound waves to create live images of organs, vessels, and developing babies.',
    safety: [
      'Use medical-grade ultrasound gel only.',
      'Keep probes clean and disinfected between patients.',
      'Avoid unnecessary prolonged scanning.',
    ],
    releaseDate: '2019-03-12',
    yearIntroduced: 2015,
    aiSummary:
      'The Ultrasound Machine is a non-invasive diagnostic tool that uses sound waves instead of radiation.',
  },
  {
    id: 'EQ-003',
    name: 'ECG Machine',
    aliases: ['ekg', 'electrocardiogram', 'ecg', 'heart monitor'],
    category: 'Diagnostic',
    manufacturer: 'Schiller',
    model: 'CARDIOVIT AT-102',
    location: 'Cardiology Station',
    meaning: 'ECG stands for electrocardiogram: electro (electric) + cardio (heart) + gram (record).',
    whatFor: 'Recording the heart’s electrical activity to check rhythm and heart health.',
    purpose: 'Records the electrical activity of the heart to detect rhythm problems and heart disease.',
    safety: [
      'Attach electrodes to clean, dry skin.',
      'Keep the unit away from liquids.',
      'Do not use damaged lead cables.',
    ],
    releaseDate: '2017-11-08',
    yearIntroduced: 2012,
    aiSummary: 'The ECG Machine measures heart electrical signals through skin electrodes.',
  },
  {
    id: 'EQ-004',
    name: 'Ventilator',
    aliases: ['respirator', 'breathing machine', 'vent'],
    category: 'Life Support',
    manufacturer: 'Dräger',
    model: 'Evita V300',
    location: 'ICU Bay A',
    meaning: 'From ventilate: to move air in and out. It is a machine that helps a patient breathe.',
    whatFor: 'Supporting or taking over breathing when a patient cannot breathe well enough alone.',
    purpose: 'Supports or takes over breathing for patients who cannot breathe adequately on their own.',
    safety: [
      'Only trained staff should change ventilator settings.',
      'Check tubing connections before use.',
      'Monitor alarms and never silence them without cause.',
    ],
    releaseDate: '2018-09-20',
    yearIntroduced: 2014,
    aiSummary: 'The Ventilator is a life-support machine that delivers oxygen and controlled airflow to the lungs.',
  },
  {
    id: 'EQ-005',
    name: 'CT Scanner',
    aliases: ['cat scan', 'computed tomography', 'ct'],
    category: 'Diagnostic',
    manufacturer: 'Siemens Healthineers',
    model: 'SOMATOM go.Now',
    location: 'CT Imaging Room',
    meaning: 'CT means Computed Tomography: computer-built slice pictures of the body.',
    whatFor: 'Making detailed cross-section images to find injury, bleeding, tumors, or disease.',
    purpose: 'Takes cross-sectional X-ray images that can be combined into 3D views of the body.',
    safety: [
      'Limit radiation dose to the lowest needed.',
      'Screen patients for contrast allergies.',
      'Keep the gantry area clear during rotation.',
    ],
    releaseDate: '2020-02-04',
    yearIntroduced: 2016,
    aiSummary: 'The CT Scanner rotates an X-ray source around the body to produce detailed slice images.',
  },
  {
    id: 'EQ-006',
    name: 'Microscope',
    aliases: ['lab microscope', 'light microscope'],
    category: 'Lab Equipment',
    manufacturer: 'Olympus',
    model: 'CX23',
    location: 'Clinical Laboratory',
    meaning: 'Micro (small) + scope (to look): an instrument for looking at tiny things.',
    whatFor: 'Examining cells, tissues, blood, and microorganisms that cannot be seen by the naked eye.',
    purpose: 'Magnifies cells, tissues, and microorganisms for laboratory diagnosis and science learning.',
    safety: [
      'Carry with both hands using the arm and base.',
      'Do not touch glass lenses with fingers.',
      'Start with the lowest magnification.',
    ],
    releaseDate: '2016-05-22',
    yearIntroduced: 2011,
    aiSummary: 'The Microscope is laboratory equipment used to examine samples too small to see with the naked eye.',
  },
  {
    id: 'EQ-007',
    name: 'MRI Scanner',
    aliases: ['mri', 'magnetic resonance', 'nmr'],
    category: 'Diagnostic',
    manufacturer: 'Canon Medical',
    model: 'Vantage Orian',
    location: 'MRI Suite',
    meaning: 'MRI means Magnetic Resonance Imaging: pictures made with magnets and radio waves.',
    whatFor: 'Creating detailed images of the brain, muscles, and organs without X-rays.',
    purpose: 'Uses strong magnets and radio waves to create detailed images of soft tissues without X-rays.',
    safety: [
      'Remove all metal objects before entering the room.',
      'Screen patients for implants and pacemakers.',
      'Never bring ferromagnetic equipment into the magnet room.',
    ],
    releaseDate: '2019-08-18',
    yearIntroduced: 2013,
    aiSummary: 'The MRI Scanner creates high-detail pictures of soft tissue using magnetism rather than radiation.',
  },
  {
    id: 'EQ-008',
    name: 'Defibrillator',
    aliases: ['aed', 'defib', 'shock machine'],
    category: 'Therapeutic',
    manufacturer: 'Zoll',
    model: 'R Series',
    location: 'Emergency Cart',
    meaning: 'De + fibrillation: it stops dangerous uncoordinated heart quivering so a normal beat can return.',
    whatFor: 'Giving a controlled electric shock to restore a normal heart rhythm during cardiac arrest.',
    purpose: 'Delivers a controlled electric shock to restore a normal heart rhythm during cardiac arrest.',
    safety: [
      'Stand clear before delivering a shock.',
      'Do not use on a wet surface.',
      'Follow AED/defibrillator voice and screen prompts.',
    ],
    releaseDate: '2015-01-30',
    yearIntroduced: 2010,
    aiSummary: 'The Defibrillator is emergency therapeutic equipment that can restart or correct the heartbeat.',
  },
  {
    id: 'EQ-009',
    name: 'Infusion Pump',
    aliases: ['iv pump', 'drip pump', 'infusomat'],
    category: 'Therapeutic',
    manufacturer: 'B. Braun',
    model: 'Infusomat Space',
    location: 'Ward 2 - Medication Station',
    meaning: 'Infusion means slowly putting fluid into the body. The pump controls that flow.',
    whatFor: 'Giving medicine, fluids, or nutrients into a patient at a precise programmed rate.',
    purpose: 'Delivers fluids, nutrients, or medicine into a patient at a precise, programmed rate.',
    safety: [
      'Double-check medication name and dose.',
      'Inspect IV lines for kinks or air.',
      'Respond to occlusion and empty-bag alarms immediately.',
    ],
    releaseDate: '2014-10-11',
    yearIntroduced: 2008,
    aiSummary: 'The Infusion Pump controls how quickly medicine or fluids enter the body.',
  },
  {
    id: 'EQ-010',
    name: 'Anesthesia Machine',
    aliases: ['anaesthesia', 'gas machine', 'anesthesia'],
    category: 'Life Support',
    manufacturer: 'GE Healthcare',
    model: 'Aisys CS2',
    location: 'Operating Room 1',
    meaning: 'Anesthesia means without sensation. The machine keeps a patient safely asleep for surgery.',
    whatFor: 'Delivering oxygen and anesthetic gases so a patient can sleep safely during an operation.',
    purpose: 'Delivers a controlled mix of oxygen and anesthetic gases so a patient can sleep safely during surgery.',
    safety: [
      'Check gas supplies before every procedure.',
      'Verify scavenging and alarm systems.',
      'Never leave an anesthetized patient unattended.',
    ],
    releaseDate: '2016-12-02',
    yearIntroduced: 2011,
    aiSummary: 'The Anesthesia Machine supports breathing and delivers anesthetic gases during operations.',
  },
  {
    id: 'EQ-011',
    name: 'Patient Monitor',
    aliases: ['vital signs monitor', 'bedside monitor', 'cardiac monitor'],
    category: 'Monitoring',
    manufacturer: 'Mindray',
    model: 'BeneView T8',
    location: 'ICU Monitoring Station',
    meaning: 'A monitor is a device that watches and displays information. This one watches vital signs.',
    whatFor: 'Showing heart rate, blood pressure, oxygen level, and other vital signs in real time.',
    purpose: 'Continuously displays a patient’s vital signs so staff can detect changes quickly.',
    safety: [
      'Check sensor placement before relying on readings.',
      'Do not ignore alarms.',
      'Keep cables organized to prevent falls.',
    ],
    releaseDate: '2018-04-09',
    yearIntroduced: 2013,
    aiSummary: 'The Patient Monitor tracks vital signs so nurses and doctors can see a patient’s condition at a glance.',
  },
  {
    id: 'EQ-012',
    name: 'Dialysis Machine',
    aliases: ['hemodialysis', 'kidney machine', 'dialyzer'],
    category: 'Therapeutic',
    manufacturer: 'Fresenius',
    model: '4008S',
    location: 'Renal Unit',
    meaning: 'Dialysis means separating waste from blood, like a filter. It stands in for failing kidneys.',
    whatFor: 'Cleaning waste and extra fluid from the blood when the kidneys cannot do this job.',
    purpose: 'Filters a patient’s blood to remove waste products and extra fluid during kidney failure.',
    safety: [
      'Verify patient identity and prescription before treatment.',
      'Watch for bleeding at the access site.',
      'Respond to machine alarms immediately.',
    ],
    releaseDate: '2013-07-21',
    yearIntroduced: 2007,
    aiSummary: 'The Dialysis Machine acts as an artificial kidney by filtering blood during treatment sessions.',
  },
  {
    id: 'EQ-013',
    name: 'Autoclave',
    aliases: ['sterilizer', 'steam sterilizer'],
    category: 'Lab Equipment',
    manufacturer: 'Tuttnauer',
    model: '3870EA',
    location: 'Central Sterile Supply',
    meaning: 'Auto + clave (self-locking): a sealed steam chamber that sterilizes tools.',
    whatFor: 'Killing germs on surgical and laboratory instruments using high-pressure steam.',
    purpose: 'Sterilizes instruments and lab materials with pressurized steam before reuse.',
    safety: [
      'Do not open the chamber until pressure is fully released.',
      'Use heat-resistant gloves.',
      'Load items so steam can circulate.',
    ],
    releaseDate: '2012-09-14',
    yearIntroduced: 2006,
    aiSummary: 'The Autoclave uses steam under pressure to sterilize hospital and laboratory equipment.',
  },
  {
    id: 'EQ-014',
    name: 'Centrifuge',
    aliases: ['lab centrifuge', 'blood spinner'],
    category: 'Lab Equipment',
    manufacturer: 'Eppendorf',
    model: '5424',
    location: 'Clinical Laboratory',
    meaning: 'From centrifugal: moving away from the center. Spinning separates heavier parts of a sample.',
    whatFor: 'Spinning blood or other samples so serum, cells, or other layers separate for testing.',
    purpose: 'Separates fluids into layers by rapid spinning for laboratory analysis.',
    safety: [
      'Balance tubes before starting.',
      'Keep the lid closed while spinning.',
      'Do not open until the rotor has fully stopped.',
    ],
    releaseDate: '2015-03-03',
    yearIntroduced: 2010,
    aiSummary: 'The Centrifuge spins samples at high speed so laboratory staff can separate blood and other fluids.',
  },
  {
    id: 'EQ-015',
    name: 'Infant Incubator',
    aliases: ['baby incubator', 'isolette', 'neonatal incubator'],
    category: 'Life Support',
    manufacturer: 'Dräger',
    model: 'Isolette 8000',
    location: 'Neonatal ICU',
    meaning: 'To incubate means to keep in a controlled warm place, like an egg until it hatches.',
    whatFor: 'Keeping newborns warm, humid, and protected while they grow stronger.',
    purpose: 'Provides a warm, controlled environment for premature or ill newborns.',
    safety: [
      'Check temperature and humidity settings often.',
      'Keep ports closed when not in use.',
      'Follow infection-control procedures.',
    ],
    releaseDate: '2017-02-16',
    yearIntroduced: 2011,
    aiSummary: 'The Infant Incubator protects newborns by controlling warmth, humidity, and exposure.',
  },
  {
    id: 'EQ-016',
    name: 'Pulse Oximeter',
    aliases: ['pulse ox', 'spo2', 'oxygen clip'],
    category: 'Monitoring',
    manufacturer: 'Masimo',
    model: 'Rad-97',
    location: 'Ward 1 - Nursing Station',
    meaning: 'Pulse + oximeter (oxygen measurer): it reads oxygen in the blood using the pulse.',
    whatFor: 'Checking how much oxygen is in the blood and how fast the heart is beating.',
    purpose: 'Measures oxygen saturation and pulse rate through a finger, toe, or ear sensor.',
    safety: [
      'Place the sensor on a clean, well-perfused site.',
      'Avoid nail polish that blocks the light.',
      'Compare readings with the patient’s condition.',
    ],
    releaseDate: '2019-11-05',
    yearIntroduced: 2014,
    aiSummary: 'The Pulse Oximeter uses light through the skin to estimate blood oxygen without a needle.',
  },
  {
    id: 'EQ-017',
    name: 'Sphygmomanometer',
    aliases: ['bp apparatus', 'blood pressure', 'bp cuff'],
    category: 'Monitoring',
    manufacturer: 'Welch Allyn',
    model: 'DS66',
    location: 'OPD Clinic',
    meaning: 'Sphygmo (pulse) + manometer (pressure meter): a device that measures blood pressure.',
    whatFor: 'Measuring blood pressure to check heart and vessel health.',
    purpose: 'Measures systolic and diastolic blood pressure using a cuff and gauge or digital sensor.',
    safety: [
      'Use the correct cuff size.',
      'Do not place the cuff over a wound or IV site.',
      'Let the patient rest before measuring.',
    ],
    releaseDate: '2011-08-19',
    yearIntroduced: 2005,
    aiSummary: 'The Sphygmomanometer is the classic blood-pressure device used in clinics and wards.',
  },
  {
    id: 'EQ-018',
    name: 'Surgical Lamp',
    aliases: ['or light', 'operating light', 'surgical light'],
    category: 'Therapeutic',
    manufacturer: 'Stryker',
    model: 'Berchtold F Generation',
    location: 'Operating Room 2',
    meaning: 'A lamp is a light source. Surgical lamps give bright, shadow-controlled light for operations.',
    whatFor: 'Lighting the surgical field so doctors can see tissues clearly during procedures.',
    purpose: 'Provides intense, adjustable light for surgery without overheating the patient.',
    safety: [
      'Do not touch hot lamp surfaces.',
      'Keep sterile handles covered.',
      'Avoid shining the light into anyone’s eyes.',
    ],
    releaseDate: '2016-01-27',
    yearIntroduced: 2012,
    aiSummary: 'The Surgical Lamp focuses bright, cool light on the operating area.',
  },
  {
    id: 'EQ-019',
    name: 'Suction Machine',
    aliases: ['aspirator', 'suction pump', 'yankauer suction'],
    category: 'Therapeutic',
    manufacturer: 'Medela',
    model: 'Dominant Flex',
    location: 'Emergency Room',
    meaning: 'Suction means pulling fluid or air by vacuum. The machine clears airways or wounds.',
    whatFor: 'Removing mucus, blood, or fluids so a patient can breathe or a wound can be cleaned.',
    purpose: 'Creates controlled vacuum to aspirate fluids from the airway, surgical site, or wound.',
    safety: [
      'Use the correct suction pressure.',
      'Do not suction longer than instructed.',
      'Empty and clean canisters using infection-control rules.',
    ],
    releaseDate: '2014-05-08',
    yearIntroduced: 2009,
    aiSummary: 'The Suction Machine uses vacuum to clear fluids and keep the airway or surgical field clean.',
  },
  {
    id: 'EQ-020',
    name: 'Nebulizer',
    aliases: ['nebuliser', 'aerosol machine', 'steam inhaler'],
    category: 'Therapeutic',
    manufacturer: 'Omron',
    model: 'NE-C28',
    location: 'Pediatric Ward',
    meaning: 'From nebula (mist): it turns liquid medicine into a breathable mist.',
    whatFor: 'Helping patients inhale medicine into the lungs, especially for asthma or breathing problems.',
    purpose: 'Converts liquid medication into mist so it can be inhaled through a mask or mouthpiece.',
    safety: [
      'Use only prescribed medication and saline.',
      'Clean the cup and mask after each use.',
      'Keep electrical parts dry.',
    ],
    releaseDate: '2013-12-01',
    yearIntroduced: 2008,
    aiSummary: 'The Nebulizer turns liquid medicine into a fine mist for easier breathing treatment.',
  },
  {
    id: 'EQ-021',
    name: 'Oxygen Concentrator',
    aliases: ['o2 concentrator', 'oxygen machine'],
    category: 'Life Support',
    manufacturer: 'Philips Respironics',
    model: 'EverFlo',
    location: 'Respiratory Therapy',
    meaning: 'Concentrate means to make stronger. It takes oxygen from air and delivers a higher amount.',
    whatFor: 'Giving extra oxygen to patients who have low blood oxygen.',
    purpose: 'Extracts oxygen from room air and delivers it through a nasal cannula or mask.',
    safety: [
      'Keep away from flames and smoking.',
      'Do not block air intake vents.',
      'Check tubing for kinks.',
    ],
    releaseDate: '2015-06-18',
    yearIntroduced: 2010,
    aiSummary: 'The Oxygen Concentrator supplies medical oxygen without relying only on cylinder tanks.',
  },
  {
    id: 'EQ-022',
    name: 'Fetal Monitor',
    aliases: ['ctg', 'cardiotocograph', 'tocodynamometer'],
    category: 'Monitoring',
    manufacturer: 'GE Healthcare',
    model: 'Corometrics 259',
    location: 'Labor and Delivery',
    meaning: 'Fetal means related to the unborn baby. The monitor tracks the baby’s heart and contractions.',
    whatFor: 'Watching the baby’s heartbeat and the mother’s contractions during pregnancy and labor.',
    purpose: 'Records fetal heart rate and uterine contractions to assess the baby during labor.',
    safety: [
      'Place transducers according to protocol.',
      'Check skin for pressure from belts.',
      'Report sudden tracing changes at once.',
    ],
    releaseDate: '2016-10-22',
    yearIntroduced: 2011,
    aiSummary: 'The Fetal Monitor helps staff see how the baby is doing during labor.',
  },
  {
    id: 'EQ-023',
    name: 'EEG Machine',
    aliases: ['electroencephalogram', 'brain wave', 'eeg'],
    category: 'Diagnostic',
    manufacturer: 'Nihon Kohden',
    model: 'EEG-1200',
    location: 'Neurology Lab',
    meaning: 'EEG stands for electroencephalogram: a written record of the brain’s electrical activity.',
    whatFor: 'Recording brain waves to study seizures, sleep problems, or brain function.',
    purpose: 'Measures electrical activity of the brain through scalp electrodes.',
    safety: [
      'Prepare the scalp as instructed.',
      'Keep the patient still during recording.',
      'Do not pull on electrode wires.',
    ],
    releaseDate: '2018-07-30',
    yearIntroduced: 2012,
    aiSummary: 'The EEG Machine records brain electrical signals used in neurology and student learning.',
  },
  {
    id: 'EQ-024',
    name: 'Endoscope',
    aliases: ['endoscopy', 'gastroscope', 'colonoscope'],
    category: 'Diagnostic',
    manufacturer: 'Olympus',
    model: 'EVIS X1',
    location: 'Endoscopy Unit',
    meaning: 'Endo (inside) + scope (to look): a camera tool for looking inside the body.',
    whatFor: 'Looking inside the digestive tract or other hollow organs to find and sometimes treat problems.',
    purpose: 'Uses a flexible camera to view internal organs without a large surgical cut.',
    safety: [
      'Follow strict cleaning and disinfection steps.',
      'Never force the insertion tube.',
      'Check light and suction before a procedure.',
    ],
    releaseDate: '2020-09-11',
    yearIntroduced: 2016,
    aiSummary: 'The Endoscope lets clinicians see inside the body using a thin camera tube.',
  },
  {
    id: 'EQ-025',
    name: 'C-Arm X-Ray',
    aliases: ['c-arm', 'fluoroscopy', 'mobile xray'],
    category: 'Diagnostic',
    manufacturer: 'Siemens Healthineers',
    model: 'Cios Select',
    location: 'Operating Room Imaging',
    meaning: 'Named for its C-shaped arm that holds the X-ray source and detector around the patient.',
    whatFor: 'Giving live X-ray pictures during surgery so doctors can guide instruments.',
    purpose: 'Provides real-time fluoroscopic X-ray images during operations and procedures.',
    safety: [
      'Wear lead protection during fluoroscopy.',
      'Use the lowest practical radiation dose.',
      'Keep hands out of the primary beam.',
    ],
    releaseDate: '2019-05-06',
    yearIntroduced: 2014,
    aiSummary: 'The C-Arm is a mobile X-ray unit used in surgery for live imaging.',
  },
].map((item) => ({
  ...item,
  releaseSource: item.releaseSource || 'AI Estimated',
  status: 'Available',
  quantity: 1,
  qrPayload: `SCANLEARN:${item.id}`,
}))

function normalizeScanText(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/scanlearn[:\s-]*/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function parseMachineCode(raw) {
  if (!raw) return ''
  const text = String(raw).toUpperCase().trim()
  const id = text.match(/EQ[-\s]?(\d{1,4})/)
  if (id) return `EQ-${id[1].padStart(3, '0')}`
  return text.replace(/^SCANLEARN[:\s-]*/, '')
}

export function matchInventoryQr(raw, inventory = []) {
  const text = String(raw || '').trim()
  if (!text) return null

  const payload = text.toUpperCase()
  const fromInventory = inventory.find((item) => {
    const code = String(item.qrPayload || `SCANLEARN:${item.id}`).toUpperCase()
    return code === payload || item.id.toUpperCase() === payload
  })
  if (fromInventory) {
    const known = findMachine(fromInventory.id, HOSPITAL_MACHINES)
    return withAiDetails(known || fromInventory)
  }

  if (!/^SCANLEARN[:\s-]*/i.test(text) && !/^EQ[-\s]?\d{1,4}$/i.test(text)) {
    return null
  }

  const found = findMachine(text, HOSPITAL_MACHINES)
  return found ? withAiDetails(found) : null
}

export function findMachine(code, extra = []) {
  const id = parseMachineCode(code)
  const pool = [...HOSPITAL_MACHINES, ...extra]
  return (
    pool.find((item) => item.id.toUpperCase() === id) ||
    pool.find((item) => item.name.toLowerCase() === String(code).trim().toLowerCase()) ||
    null
  )
}

function scoreMachine(item, query) {
  const hay = [item.id, item.name, item.model, item.manufacturer, ...(item.aliases || [])]
    .join(' ')
    .toLowerCase()
  if (!query) return 0
  if (hay === query) return 100
  if (item.id.toLowerCase() === query) return 95
  if (item.name.toLowerCase() === query) return 90
  if ((item.aliases || []).some((alias) => alias.toLowerCase() === query)) return 85
  if (hay.includes(query)) return 40 + Math.min(query.length, 20)
  return query.split(' ').reduce((sum, word) => (word.length > 2 && hay.includes(word) ? sum + 8 : sum), 0)
}

export function identifyHospitalMachine(raw, extra = []) {
  const direct = findMachine(raw, extra)
  if (direct) return withAiDetails(direct)

  const query = normalizeScanText(raw)
  if (!query) return null

  const pool = [...HOSPITAL_MACHINES, ...extra]
  const ranked = pool
    .map((item) => ({ item, score: scoreMachine(item, query) }))
    .filter((row) => row.score >= 8)
    .sort((a, b) => b.score - a.score)

  return ranked[0] ? withAiDetails(ranked[0].item) : null
}

function hashYear(name, min, max) {
  let n = 0
  for (const ch of name) n = (n * 31 + ch.charCodeAt(0)) >>> 0
  return min + (n % (max - min + 1))
}

export function withAiDetails(item) {
  if (!item) return null

  const yearIntroduced = item.yearIntroduced || hashYear(item.name || item.id, 2005, 2018)
  const releaseYear = item.releaseDate ? Number(item.releaseDate.slice(0, 4)) : Math.min(yearIntroduced + 4, 2023)
  const releaseDate = item.releaseDate || `${releaseYear}-06-15`
  const safety = item.safety
    ? Array.isArray(item.safety)
      ? item.safety
      : String(item.safety).split('\n').filter(Boolean)
    : DEFAULT_SAFETY
  const meaning =
    item.meaning ||
    `AI meaning: ${item.name} is hospital equipment used in diagnosis, treatment, monitoring, or laboratory work.`
  const whatFor =
    item.whatFor ||
    item.what_is_for ||
    item.purpose ||
    `Used to support hospital and science-laboratory learning about ${item.name}.`

  return {
    ...item,
    manufacturer: item.manufacturer || item.brand || 'Hospital Equipment',
    model: item.model || item.id,
    location: item.location || 'Science Laboratory',
    meaning,
    whatFor,
    purpose: item.purpose || whatFor,
    description: item.description || whatFor,
    safety,
    aiSummary:
      item.aiSummary ||
      `The ${item.name} is ${item.category ? item.category.toLowerCase() : 'hospital'} equipment. Meaning: ${meaning} What it is for: ${whatFor} AI estimated its common introduction around ${yearIntroduced}.`,
    releaseDate,
    yearIntroduced,
    releaseSource: item.releaseSource || 'AI Estimated',
    qrPayload: item.qrPayload || item.qr_payload || `SCANLEARN:${item.id}`,
    status: item.status || 'Available',
    quantity: Number(item.quantity || 1),
  }
}

export function toInventoryRecord(item, { scanned = true } = {}) {
  const ai = withAiDetails(item)
  return {
    ...ai,
    scanned,
    scannedAt: scanned ? new Date().toISOString() : item.scannedAt || null,
    qrPayload: `SCANLEARN:${ai.id}`,
    brand: ai.manufacturer,
    description: ai.whatFor,
    arHint: ai.arHint || `Point your camera at the ${ai.name} QR code (${ai.id}) to open Scan and AR details.`,
  }
}
