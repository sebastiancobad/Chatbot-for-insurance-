export type InsuranceRamo = {
  slug: string
  name: string
  tagline: string
  description: string
  color: string
  coverages: {
    included: string[]
    excluded: string[]
  }
  benefits: {
    title: string
    description: string
  }[]
  process: {
    step: number
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  targetAudience: string[]
  priceFrom: string
  seoKeywords: string[]
}

export const insuranceContent: Record<string, InsuranceRamo> = {

  auto: {
    slug: 'auto',
    name: 'Seguro de Auto',
    tagline: 'Maneja con tranquilidad. Nosotros te respaldamos.',
    description: 'Protege tu vehículo contra accidentes, robo, daños a terceros y mucho más. Comparamos entre las mejores aseguradoras para darte la cobertura que necesitas al mejor precio.',
    color: '#1A6BC4',
    coverages: {
      included: [
        'Pérdida total por accidente o robo',
        'Daños parciales por colisión',
        'Responsabilidad civil a terceros',
        'Asistencia vial 24/7',
        'Gastos médicos para ocupantes',
        'Fenómenos naturales (granizo, inundación)',
        'Pérdida de accesorios',
        'Vehículo de reemplazo',
      ],
      excluded: [
        'Conducción bajo efectos del alcohol',
        'Uso de vehículo para transporte público no declarado',
        'Daños por desgaste normal',
        'Accesorios no declarados en póliza',
      ],
    },
    benefits: [
      { title: 'Cotización en 24h', description: 'Comparamos entre 8+ aseguradoras y te enviamos las mejores opciones.' },
      { title: 'Asistencia inmediata', description: 'Ante cualquier accidente, te acompañamos en el proceso de reclamación.' },
      { title: 'Precio justo', description: 'Al ser independientes, buscamos la mejor relación cobertura-precio para ti.' },
      { title: 'Renovación sin trámites', description: 'Te avisamos 30 días antes y gestionamos la renovación por ti.' },
    ],
    process: [
      { step: 1, title: 'Cotiza', description: 'Cuéntanos sobre tu vehículo: marca, modelo, año y uso.' },
      { step: 2, title: 'Compara', description: 'Recibes opciones de múltiples aseguradoras con coberturas claras.' },
      { step: 3, title: 'Elige', description: 'Seleccionas el plan que mejor se adapta a tus necesidades y presupuesto.' },
      { step: 4, title: 'Listo', description: 'Emites la póliza y quedas protegido. Nosotros guardamos todos tus documentos.' },
    ],
    faqs: [
      { question: '¿Cuánto cuesta un seguro de auto?', answer: 'El precio varía según el vehículo, el uso y las coberturas. Generalmente entre $80.000 y $300.000 mensuales. Cotiza gratis y te damos opciones exactas para tu caso.' },
      { question: '¿Qué es la responsabilidad civil?', answer: 'Es la cobertura que paga los daños que le causes a terceros (otras personas, vehículos o propiedades) en un accidente donde tú seas responsable.' },
      { question: '¿Puedo asegurar un carro usado?', answer: 'Sí, aseguramos vehículos de cualquier año. El precio y las coberturas disponibles varían según la antigüedad.' },
      { question: '¿Qué hago si tengo un accidente?', answer: 'Llama a nuestra línea de asistencia. Te guiamos paso a paso: desde el reporte hasta el pago del siniestro.' },
      { question: '¿El seguro cubre si me roban el carro?', answer: 'Depende del plan. Los planes con cobertura de hurto sí cubren robo total. Te explicamos las diferencias al cotizar.' },
    ],
    targetAudience: ['Propietarios de vehículos particulares', 'Flotas empresariales', 'Motos y vehículos especiales'],
    priceFrom: 'Desde $89.000/mes',
    seoKeywords: ['seguro de auto', 'seguro vehicular', 'SOAT', 'seguro todo riesgo auto'],
  },

  vida: {
    slug: 'vida',
    name: 'Seguro de Vida',
    tagline: 'El mejor regalo que le puedes dar a tu familia.',
    description: 'Un seguro de vida garantiza que las personas que más quieres estarán protegidas económicamente si algo te llegara a pasar. Encuentra el plan ideal para tu familia.',
    color: '#00936C',
    coverages: {
      included: [
        'Indemnización por fallecimiento por cualquier causa',
        'Muerte accidental (doble indemnización)',
        'Enfermedades graves (cáncer, infarto, ACV)',
        'Incapacidad total y permanente',
        'Gastos funerarios',
        'Renta por incapacidad temporal',
        'Anticipo por enfermedad terminal',
      ],
      excluded: [
        'Preexistencias no declaradas al contratar',
        'Suicidio en los primeros 2 años de la póliza',
        'Actividades de alto riesgo no declaradas',
      ],
    },
    benefits: [
      { title: 'Protección real', description: 'Tu familia recibe el capital asegurado sin complicaciones ni demoras.' },
      { title: 'Desde cualquier edad', description: 'Planes desde los 18 hasta los 70 años, adaptados a cada etapa de vida.' },
      { title: 'Primas fijas', description: 'Pagas lo mismo durante toda la vigencia. Sin sorpresas.' },
      { title: 'Beneficiarios a elección', description: 'Tú decides quién recibe el beneficio y en qué porcentaje.' },
    ],
    process: [
      { step: 1, title: 'Tu perfil', description: 'Edad, estado de salud general y monto de cobertura deseado.' },
      { step: 2, title: 'Opciones claras', description: 'Te presentamos planes de diferentes aseguradoras con primas y coberturas comparadas.' },
      { step: 3, title: 'Examen médico', description: 'Según el monto, puede requerirse examen. Te orientamos en todo el proceso.' },
      { step: 4, title: 'Póliza emitida', description: 'Tus beneficiarios quedan protegidos desde el primer día de vigencia.' },
    ],
    faqs: [
      { question: '¿A qué edad conviene contratar un seguro de vida?', answer: 'Cuanto antes mejor. A menor edad, la prima es más baja y es más fácil pasar el examen médico. Los 25-35 años es el momento ideal.' },
      { question: '¿Cómo cobran los beneficiarios?', answer: 'Presentan el certificado de defunción y los documentos de la póliza. Nosotros los acompañamos en todo el trámite.' },
      { question: '¿Qué pasa si tengo una enfermedad preexistente?', answer: 'Depende de la condición. Algunas aseguradoras tienen planes específicos. Es importante declararlo al contratar para que la cobertura sea válida.' },
      { question: '¿El seguro de vida tiene valor de rescate?', answer: 'Los seguros de vida con ahorro (vida entera) sí. Los de término puro no. Te explicamos las diferencias y cuál conviene más para tu caso.' },
    ],
    targetAudience: ['Padres de familia', 'Personas con deudas o hipoteca', 'Empresarios y socios de negocio'],
    priceFrom: 'Desde $45.000/mes',
    seoKeywords: ['seguro de vida', 'seguro de vida familiar', 'seguro fallecimiento'],
  },

  salud: {
    slug: 'salud',
    name: 'Seguro de Salud',
    tagline: 'Atención médica de calidad cuando más lo necesitas.',
    description: 'Complementa tu EPS o reemplázala con un seguro de salud privado. Acceso a mejores clínicas, especialistas y sin listas de espera.',
    color: '#E24B4A',
    coverages: {
      included: [
        'Hospitalización y cirugías',
        'Consultas con especialistas',
        'Medicamentos durante hospitalización',
        'Exámenes diagnósticos',
        'Urgencias 24/7',
        'Maternidad (con período de carencia)',
        'Odontología básica',
        'Telemedicina',
      ],
      excluded: [
        'Condiciones preexistentes durante período de carencia',
        'Cirugías estéticas no reconstructivas',
        'Tratamientos experimentales',
        'Medicamentos ambulatorios (según plan)',
      ],
    },
    benefits: [
      { title: 'Sin listas de espera', description: 'Consulta con especialistas en días, no en meses.' },
      { title: 'Red amplia de clínicas', description: 'Acceso a las mejores clínicas y hospitales privados del país.' },
      { title: 'Planes familiares', description: 'Cubre a toda tu familia con un solo plan a precio preferencial.' },
      { title: 'Telemedicina incluida', description: 'Consultas médicas por videollamada desde cualquier lugar.' },
    ],
    process: [
      { step: 1, title: 'Tu perfil', description: 'Edad, cantidad de beneficiarios y necesidades específicas de salud.' },
      { step: 2, title: 'Comparamos', description: 'Planes individuales, familiares y complementarios a tu EPS.' },
      { step: 3, title: 'Declaración de salud', description: 'Formulario sencillo sobre tu historial médico.' },
      { step: 4, title: 'Vigencia inmediata', description: 'Muchos planes inician cobertura desde el primer día.' },
    ],
    faqs: [
      { question: '¿Es mejor que la EPS?', answer: 'Es complementario. La EPS cubre lo básico; el seguro privado te da acceso a mejores clínicas, especialistas sin demora y habitación individual.' },
      { question: '¿Qué es el período de carencia?', answer: 'Es el tiempo que debe pasar desde que contratas hasta que puedes usar algunas coberturas (como maternidad o enfermedades preexistentes). Generalmente entre 3 y 12 meses.' },
      { question: '¿Puedo incluir a mis padres?', answer: 'Sí, aunque la prima varía con la edad. Te damos opciones para adultos mayores con coberturas adaptadas.' },
      { question: '¿Cómo uso el seguro si me hospitalizo?', answer: 'Llamas a la aseguradora, te autorizan y vas directo a la clínica de la red. Nosotros te acompañamos si hay algún inconveniente.' },
    ],
    targetAudience: ['Familias con hijos', 'Personas mayores de 40 años', 'Trabajadores independientes sin EPS corporativa'],
    priceFrom: 'Desde $120.000/mes',
    seoKeywords: ['seguro de salud', 'medicina prepagada', 'seguro médico familiar'],
  },

  hogar: {
    slug: 'hogar',
    name: 'Seguro de Hogar',
    tagline: 'Tu casa es tu mayor patrimonio. Protégela.',
    description: 'Cobertura completa para tu vivienda: estructura, contenidos, responsabilidad civil y asistencias del hogar. Para propietarios e inquilinos.',
    color: '#BA7517',
    coverages: {
      included: [
        'Incendio y explosión',
        'Terremoto y temblor',
        'Inundación y lluvia',
        'Robo con violencia',
        'Daños por agua (tuberías)',
        'Responsabilidad civil familiar',
        'Electrodomésticos y contenido del hogar',
        'Asistencias: plomería, electricidad, cerrajería 24/7',
      ],
      excluded: [
        'Daños por humedad o goteras preexistentes',
        'Bienes dejados en vehículos',
        'Obras sin permiso de construcción',
      ],
    },
    benefits: [
      { title: 'Propietarios e inquilinos', description: 'Planes para quien es dueño y quien arrienda. Cada uno con coberturas adaptadas.' },
      { title: 'Asistencias 24/7', description: 'Plomero, electricista y cerrajero cuando los necesites, incluidos en la póliza.' },
      { title: 'Sin avalúo previo', description: 'Para la mayoría de viviendas no se requiere avalúo para emitir la póliza.' },
      { title: 'Prima desde el primer mes', description: 'Protección inmediata desde que pagas la primera cuota.' },
    ],
    process: [
      { step: 1, title: 'Datos del inmueble', description: 'Dirección, estrato, área en m², si es casa o apartamento.' },
      { step: 2, title: 'Valor a asegurar', description: 'Te ayudamos a calcular el valor correcto de la estructura y contenidos.' },
      { step: 3, title: 'Plan elegido', description: 'Seleccionas coberturas según tus necesidades y presupuesto.' },
      { step: 4, title: 'Póliza activa', description: 'Recibes tu póliza digital y quedas cubierto.' },
    ],
    faqs: [
      { question: '¿El seguro cubre terremotos?', answer: 'Sí, la mayoría de planes en Colombia incluyen cobertura sísmica dado el riesgo del país. Es importante verificarlo al cotizar.' },
      { question: '¿Si soy arrendatario puedo asegurar?', answer: 'Sí. Puedes asegurar el contenido del hogar (tus muebles y electrodomésticos) aunque no seas dueño del inmueble.' },
      { question: '¿Qué es la responsabilidad civil familiar?', answer: 'Cubre daños que tú o tu familia causen accidentalmente a terceros. Ejemplo: si tu hijo rompe una ventana del vecino jugando.' },
      { question: '¿Cómo reporto un daño?', answer: 'Llamas a la aseguradora, tomarás fotos del daño y presentas los documentos básicos. Nosotros te orientamos en todo el proceso.' },
    ],
    targetAudience: ['Propietarios de casa o apartamento', 'Arrendatarios', 'Conjuntos residenciales'],
    priceFrom: 'Desde $35.000/mes',
    seoKeywords: ['seguro de hogar', 'seguro para vivienda', 'seguro de apartamento'],
  },

  accidentes: {
    slug: 'accidentes',
    name: 'Accidentes Personales',
    tagline: 'Protección personal ante cualquier imprevisto.',
    description: 'Cobertura económica en caso de accidentes que afecten tu integridad física. Ideal como complemento a tu seguro de salud.',
    color: '#534AB7',
    coverages: {
      included: [
        'Muerte accidental',
        'Invalidez total o parcial por accidente',
        'Gastos médicos por accidente',
        'Incapacidad temporal',
        'Asistencia funeraria',
        'Gastos de transporte y traslado',
      ],
      excluded: [
        'Enfermedades (solo accidentes)',
        'Actividades de alto riesgo no declaradas',
        'Accidentes bajo efectos de sustancias',
      ],
    },
    benefits: [
      { title: 'Prima muy accesible', description: 'De los seguros más económicos del mercado con cobertura real.' },
      { title: 'Sin examen médico', description: 'En la mayoría de planes no se requiere examen para emitir.' },
      { title: 'Complementa tu salud', description: 'Cubre lo que tu EPS o seguro de salud no paga.' },
      { title: 'Cobertura 24/7', description: 'Te protege en todo momento: trabajo, hogar, vacaciones.' },
    ],
    process: [
      { step: 1, title: 'Edad y actividad', description: 'Datos básicos: edad, ocupación y actividades de riesgo.' },
      { step: 2, title: 'Cobertura deseada', description: 'Monto de indemnización y coberturas adicionales.' },
      { step: 3, title: 'Sin trámites complejos', description: 'La mayoría emite sin examen médico previo.' },
      { step: 4, title: 'Cobertura inmediata', description: 'Vigente desde el primer día de pago.' },
    ],
    faqs: [
      { question: '¿En qué se diferencia del seguro de vida?', answer: 'El seguro de vida cubre fallecimiento por cualquier causa. Accidentes personales solo cubre eventos accidentales, pero incluye invalidez y gastos médicos por accidente.' },
      { question: '¿Cubre accidentes laborales?', answer: 'Complementa la ARL. La ARL cubre accidentes en el trabajo; este seguro te cubre en todo momento, incluyendo tiempo libre.' },
    ],
    targetAudience: ['Trabajadores independientes', 'Deportistas', 'Personas con actividades de riesgo'],
    priceFrom: 'Desde $18.000/mes',
    seoKeywords: ['seguro de accidentes', 'accidentes personales', 'seguro de invalidez'],
  },

  empresarial: {
    slug: 'empresarial',
    name: 'Seguros Empresariales',
    tagline: 'Protege tu negocio con la misma dedicación que lo construiste.',
    description: 'Soluciones integrales para empresas de todos los tamaños. Desde responsabilidad civil hasta seguros colectivos de vida y salud para tus empleados.',
    color: '#2C2C2A',
    coverages: {
      included: [
        'Responsabilidad civil general y profesional',
        'Todo riesgo para instalaciones y equipos',
        'Seguros colectivos de vida para empleados',
        'Salud colectiva (medicina prepagada empresarial)',
        'SOAT y seguros para flota vehicular',
        'Manejo y sustracción',
        'Lucro cesante',
        'Transporte de mercancías',
      ],
      excluded: [
        'Varía según el producto específico',
      ],
    },
    benefits: [
      { title: 'Asesoría especializada', description: 'Análisis de riesgos específicos de tu industria y negocio.' },
      { title: 'Planes colectivos', description: 'Mejores tarifas en seguros de vida y salud para grupos de empleados.' },
      { title: 'Gestión centralizada', description: 'Una sola agencia para todos los seguros de tu empresa.' },
      { title: 'Soporte en siniestros', description: 'Acompañamiento dedicado cuando ocurre un siniestro empresarial.' },
    ],
    process: [
      { step: 1, title: 'Diagnóstico', description: 'Analizamos los riesgos específicos de tu empresa y sector.' },
      { step: 2, title: 'Propuesta integral', description: 'Plan de seguros completo adaptado a tu presupuesto.' },
      { step: 3, title: 'Negociación', description: 'Gestionamos condiciones especiales con las aseguradoras.' },
      { step: 4, title: 'Gestión continua', description: 'Somos tu departamento de seguros externo.' },
    ],
    faqs: [
      { question: '¿Cuántos empleados necesito para seguro colectivo?', answer: 'Desde 5 empleados ya puedes acceder a tarifas colectivas. Con más personas, mejores condiciones.' },
      { question: '¿Qué es la responsabilidad civil profesional?', answer: 'Cubre reclamos de clientes por errores u omisiones en tus servicios profesionales. Esencial para consultoras, firmas legales, médicos y otros.' },
    ],
    targetAudience: ['Pymes y microempresas', 'Empresas con flota vehicular', 'Profesionales independientes'],
    priceFrom: 'Cotización personalizada',
    seoKeywords: ['seguros empresariales', 'seguros para empresas', 'seguro colectivo empleados'],
  },
}

export const RAMO_SLUGS = Object.keys(insuranceContent)

export function getRamo(slug: string): InsuranceRamo | undefined {
  return insuranceContent[slug]
}

export function getRelatedRamos(currentSlug: string, count = 3): InsuranceRamo[] {
  return Object.values(insuranceContent)
    .filter(r => r.slug !== currentSlug)
    .slice(0, count)
}
