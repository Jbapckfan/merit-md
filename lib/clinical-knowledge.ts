// ── Merit-MD Clinical Knowledge Base ──
// Structured clinical knowledge injected into analysis and chat prompts.
// This is the moat — impossible to replicate without an ER physician.

export const CLINICAL_KNOWLEDGE = {
  // Standard of care references by chief complaint
  standardsOfCare: {
    chestPain: {
      requiredWorkup: [
        "Serial troponins (0h and 3h minimum, preferably 0/1/3h with high-sensitivity)",
        "12-lead ECG within 10 minutes of arrival",
        "Repeat ECG if symptoms change or persist",
        "HEART score calculation and documentation",
        "Risk stratification documented in MDM",
      ],
      redFlags: [
        "Single troponin with discharge (must be serial)",
        "No ECG documented",
        "HEART score >= 4 without admission or observation",
        "ACS symptoms attributed to anxiety without workup",
        "Chest pain in women/diabetics dismissed without troponin",
      ],
      commonDeviations: [
        "Premature discharge before second troponin results",
        "Failure to repeat ECG with ongoing symptoms",
        "Inadequate documentation of risk stratification",
        "No shared decision-making documented for early discharge",
      ],
      expertWitnessPoints: [
        "ACEP Clinical Policy on Acute Coronary Syndromes (2018, reaffirmed 2024)",
        "AHA/ACC Guidelines for Management of ACS",
        "Fourth Universal Definition of Myocardial Infarction",
      ],
    },
    stroke: {
      requiredWorkup: [
        "NIHSS documented within 15 minutes",
        "CT head within 25 minutes of arrival",
        "Door-to-needle time < 60 minutes for tPA candidates",
        "Last known well time documented",
        "Blood glucose checked before tPA",
        "Large vessel occlusion screen for thrombectomy candidacy",
      ],
      redFlags: [
        "No NIHSS documented",
        "CT delayed beyond 25 minutes without documented reason",
        "tPA candidate not given tPA without documented contraindication",
        "Stroke symptoms attributed to migraine without imaging",
        "Wake-up stroke not evaluated with MRI/DWI-FLAIR mismatch",
      ],
      commonDeviations: [
        "Delayed stroke team activation",
        "Failure to document shared decision-making for tPA",
        "No 24-hour follow-up imaging post-tPA",
        "Transfer delays for thrombectomy-eligible patients",
      ],
      expertWitnessPoints: [
        "AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke (2019)",
        "Target: Stroke Phase III benchmarks",
        "DAWN and DEFUSE 3 trial criteria for extended window thrombectomy",
      ],
    },
    sepsis: {
      requiredWorkup: [
        "Lactate within 1 hour of sepsis suspicion",
        "Blood cultures before antibiotics (but do not delay antibiotics for cultures)",
        "Broad-spectrum antibiotics within 1 hour of recognition",
        "30 mL/kg crystalloid for hypotension or lactate >= 4",
        "Repeat lactate within 6 hours if initially elevated",
        "Reassessment of volume status documented",
      ],
      redFlags: [
        "No lactate ordered in suspected infection with SIRS criteria",
        "Antibiotics delayed > 1 hour after sepsis recognition",
        "No fluid resuscitation for septic shock",
        "Lactate > 4 without ICU consultation",
        "No repeat lactate to assess clearance",
      ],
      commonDeviations: [
        "SEP-1 bundle non-compliance (CMS quality measure)",
        "Failure to recognize sepsis in elderly/immunocompromised",
        "Inadequate source control documentation",
        "Premature de-escalation without culture data",
      ],
      expertWitnessPoints: [
        "Surviving Sepsis Campaign Guidelines (2021)",
        "CMS SEP-1 Core Measure specifications",
        "SSC Hour-1 Bundle recommendations",
      ],
    },
    abdominalPain: {
      requiredWorkup: [
        "Serial abdominal exams documented",
        "CT abdomen/pelvis with IV contrast for acute abdomen",
        "Pregnancy test in women of childbearing age",
        "Lactate if mesenteric ischemia suspected",
        "Lipase for epigastric pain",
        "Urinalysis for flank/lower abdominal pain",
      ],
      redFlags: [
        "RLQ pain in young patient without CT or surgical consultation",
        "Elderly patient with abdominal pain discharged without CT",
        "No pregnancy test in reproductive-age female",
        "Abdominal pain with hemodynamic instability without emergent imaging",
      ],
      commonDeviations: [
        "Premature anchoring on benign diagnosis (gastritis, constipation)",
        "Failure to consider mesenteric ischemia in elderly with pain out of proportion",
        "No surgical consultation for peritoneal signs",
        "Discharge without clear return precautions for worsening symptoms",
      ],
      expertWitnessPoints: [
        "ACEP Clinical Policy: Critical Issues in Evaluation of Adult ED Patients with Acute Abdominal Pain",
        "ACR Appropriateness Criteria for acute abdominal pain",
      ],
    },
    pediatricFever: {
      requiredWorkup: [
        "Age-specific workup (< 29 days: full sepsis workup; 29-60 days: risk stratification)",
        "Urinalysis/culture for all febrile infants < 24 months",
        "Blood culture for high-risk infants",
        "CSF analysis for neonates and high-risk infants",
        "Rochester/Philadelphia/Boston criteria or Step-by-Step approach documented",
      ],
      redFlags: [
        "Febrile neonate (< 28 days) without full sepsis workup",
        "No urine obtained in febrile infant < 24 months",
        "Ill-appearing infant without blood culture",
        "Discharge of febrile neonate without lumbar puncture",
      ],
      commonDeviations: [
        "Over-reliance on appearance (well-appearing neonates can be bacteremic)",
        "Failure to obtain LP in neonates before antibiotics",
        "Inadequate return precautions for caregivers",
        "No documented risk stratification tool applied",
      ],
      expertWitnessPoints: [
        "AAP Clinical Practice Guideline: Febrile Infants 8-60 Days (2021)",
        "PECARN rules for febrile infants",
      ],
    },
    fractures: {
      requiredWorkup: [
        "Neurovascular exam documented pre and post reduction",
        "Compartment syndrome assessment for high-risk fractures",
        "Ottawa ankle/knee rules documented if applied",
        "Open fracture identification and antibiotics within 1 hour",
        "Orthopedic consultation for operative fractures",
      ],
      redFlags: [
        "No neurovascular exam documented",
        "Compartment syndrome symptoms ignored (pain with passive stretch)",
        "Open fracture without antibiotics",
        "Displaced fracture without orthopedic consultation",
        "Scaphoid tenderness without thumb spica splint and follow-up",
      ],
      commonDeviations: [
        "Missed scaphoid fractures (negative initial X-ray)",
        "Delayed compartment syndrome recognition",
        "Inadequate splinting or immobilization",
        "No follow-up arranged for occult fractures",
      ],
      expertWitnessPoints: [
        "EAST Practice Management Guidelines for Extremity Compartment Syndrome",
        "Ottawa Rules validation studies",
      ],
    },
    pulmonaryEmbolism: {
      requiredWorkup: [
        "Wells score or Geneva score calculation and documentation",
        "D-dimer for low-probability patients (age-adjusted cutoff for > 50 years)",
        "CT pulmonary angiography (CTPA) for moderate-to-high probability",
        "Right heart strain assessment (troponin, BNP, CT findings, bedside echo)",
        "Anticoagulation initiated immediately upon high clinical suspicion (before imaging confirmation)",
        "Hemodynamic assessment and shock index calculation",
      ],
      redFlags: [
        "Pleuritic chest pain or dyspnea attributed to anxiety without PE workup",
        "Tachycardia unexplained and no PE considered in differential",
        "Post-surgical/immobilized patient with dyspnea and no D-dimer or CTPA",
        "Negative D-dimer used to rule out PE in high-probability patient",
        "Massive PE without thrombolysis or embolectomy consideration",
        "No risk stratification (sPESI or PESI) after diagnosis",
      ],
      commonDeviations: [
        "Failure to apply PERC rule before ordering D-dimer in low-risk patients",
        "Using non-age-adjusted D-dimer cutoffs in elderly patients",
        "Delayed anticoagulation while awaiting imaging in high-probability patients",
        "No echocardiography for submassive PE risk stratification",
        "Failure to consider subsegmental PE management controversies",
      ],
      expertWitnessPoints: [
        "ACEP Clinical Policy: Critical Issues in Evaluation of Adult Patients with Suspected PE (2018)",
        "AHA Scientific Statement on Management of Massive and Submassive PE (2011)",
        "ESC/ERS Guidelines on Diagnosis and Management of Acute PE (2019)",
        "YEARS algorithm and PERC rule validation studies",
      ],
    },
    toxicologyOverdose: {
      requiredWorkup: [
        "Fingerstick glucose immediately",
        "Acetaminophen and salicylate levels on all intentional ingestions",
        "ECG for QRS/QTc prolongation assessment",
        "Basic metabolic panel with anion gap calculation",
        "Serum osmolality and osmol gap if toxic alcohol suspected",
        "Urine drug screen (with understanding of limitations)",
        "Poison control center consultation documented",
        "Psychiatric evaluation for intentional ingestions once medically cleared",
      ],
      redFlags: [
        "Intentional ingestion without acetaminophen level",
        "Altered mental status without fingerstick glucose",
        "TCA ingestion without continuous cardiac monitoring",
        "No NAC protocol for acetaminophen ingestion above treatment line",
        "Premature psychiatric clearance with pending drug levels",
        "Methanol/ethylene glycol not considered in anion gap metabolic acidosis",
      ],
      commonDeviations: [
        "Reliance on urine drug screen for clinical decision-making (high false negative rate)",
        "Failure to use Rumack-Matthew nomogram for acetaminophen timing",
        "No repeat acetaminophen level for extended-release formulations",
        "Inadequate observation period for sustained-release medications",
        "Discharge before peak drug effect for delayed-toxicity agents",
      ],
      expertWitnessPoints: [
        "ACMT/AACT Position Statements on gastrointestinal decontamination",
        "Prescott nomogram / Rumack-Matthew nomogram for acetaminophen",
        "EXTRIP workgroup recommendations for extracorporeal treatment in poisoning",
      ],
    },
    aorticEmergencies: {
      requiredWorkup: [
        "CT angiography of chest/abdomen/pelvis for suspected dissection",
        "Bilateral blood pressures documented and compared",
        "Pain characteristics documented (tearing, ripping, maximal at onset)",
        "D-dimer (if ADD score < 1 and low pretest probability)",
        "Heart rate and blood pressure control initiated emergently",
        "Type A vs Type B classification with appropriate surgical vs medical management",
        "Bedside echocardiography for tamponade assessment if unstable",
      ],
      redFlags: [
        "Tearing chest/back pain without aortic imaging",
        "Blood pressure differential between arms not checked or documented",
        "Aortic dissection managed without emergent surgical consultation (Type A)",
        "Wide mediastinum on chest X-ray without further workup",
        "New aortic regurgitation murmur not investigated",
        "Marfan habitus or known aortic aneurysm with acute pain and no CT angiography",
      ],
      commonDeviations: [
        "Anchoring on ACS/MI in patients with chest pain without considering dissection",
        "Anticoagulation/antiplatelet therapy given before dissection excluded",
        "Delay in blood pressure control (target SBP < 120, HR < 60)",
        "Failure to image entire aorta (chest only, missing abdominal extension)",
        "Inadequate pain control delaying hemodynamic management",
      ],
      expertWitnessPoints: [
        "AHA/ACC Guidelines for Diagnosis and Management of Aortic Disease (2022)",
        "IRAD (International Registry of Acute Aortic Dissection) data",
        "ADvISED score and ADD (Aortic Dissection Detection) risk score",
      ],
    },
    ectopicPregnancy: {
      requiredWorkup: [
        "Quantitative beta-hCG level",
        "Transvaginal ultrasound for all first-trimester bleeding/pain with positive pregnancy test",
        "Rh status determination and RhoGAM if Rh-negative",
        "Type and screen for all suspected ectopic pregnancies",
        "Serial beta-hCG (48-hour) if indeterminate ultrasound and stable patient",
        "Hemodynamic assessment and IV access for unstable patients",
      ],
      redFlags: [
        "First trimester vaginal bleeding without beta-hCG level",
        "Positive pregnancy test with abdominal pain and no ultrasound",
        "Ruptured ectopic without emergent surgical consultation",
        "Discharge with indeterminate ultrasound and no follow-up plan for serial hCG",
        "Rh-negative patient without RhoGAM discussion/administration",
        "Hemodynamically unstable pregnant patient sent to ultrasound instead of OR",
      ],
      commonDeviations: [
        "Failure to consider ectopic in patients with IUD or tubal ligation",
        "Reliance on qualitative urine pregnancy test when quantitative hCG needed for management",
        "No discriminatory zone concept applied (hCG > 3,000-3,500 without IUP on TVUS)",
        "Inadequate return precautions for patients with pregnancy of unknown location",
        "Delayed OB/GYN consultation for confirmed ectopic",
      ],
      expertWitnessPoints: [
        "ACOG Practice Bulletin: Tubal Ectopic Pregnancy (2018)",
        "ACEP Clinical Policy: Critical Issues in Early Pregnancy",
        "hCG discriminatory zone evidence and institutional variation",
      ],
    },
    testicularTorsion: {
      requiredWorkup: [
        "Manual testicular exam with documentation of lie, swelling, cremasteric reflex",
        "Doppler ultrasound if clinical exam equivocal (but should NOT delay surgery if high suspicion)",
        "Urinalysis to evaluate for alternative diagnoses",
        "Urology consultation for all suspected torsion (emergent)",
        "Time of symptom onset documented (viability window: 6-8 hours)",
        "Pain assessment and management initiated immediately",
      ],
      redFlags: [
        "Acute scrotal pain in adolescent without torsion considered in differential",
        "Ultrasound delaying surgical exploration when clinical suspicion is high",
        "Cremasteric reflex not tested or documented",
        "Testicular pain attributed to UTI/epididymitis in prepubertal male without imaging",
        "Symptom onset > 6 hours with delayed urology consultation",
        "Neonatal testicular swelling without emergent evaluation",
      ],
      commonDeviations: [
        "Over-reliance on ultrasound (sensitivity ~88-100% but not perfect, especially early)",
        "Failure to consider intermittent torsion with resolved symptoms",
        "Delayed urological consultation while awaiting imaging",
        "Inadequate documentation of testicular exam findings",
        "Failure to counsel about contralateral fixation",
      ],
      expertWitnessPoints: [
        "AUA Position Statement on testicular torsion",
        "TWIST score (Testicular Workup for Ischemia and Suspected Torsion)",
        "Time-to-OR benchmarks and salvage rate data by duration of symptoms",
      ],
    },
    caudaEquina: {
      requiredWorkup: [
        "Complete neurological exam including perineal sensation and rectal tone",
        "Post-void residual (PVR) measurement or bladder scan",
        "Emergent MRI of lumbar spine",
        "Neurosurgical or orthopedic spine consultation",
        "Assessment of bilateral lower extremity strength, reflexes, and sensation",
        "Documentation of bowel and bladder function status",
      ],
      redFlags: [
        "Back pain with bilateral leg symptoms and no neurological exam documented",
        "Urinary retention or incontinence in back pain patient without MRI",
        "Saddle anesthesia not assessed or documented",
        "Rectal tone not checked in patient with back pain and leg weakness",
        "Back pain with progressive bilateral neurological deficits without emergent imaging",
        "New bowel or bladder dysfunction attributed to medication side effects without workup",
      ],
      commonDeviations: [
        "Delayed MRI due to imaging availability (must escalate to emergent)",
        "Incomplete neurological exam (missing perineal/rectal assessment)",
        "Failure to check post-void residual in patients with back pain and urinary symptoms",
        "Premature attribution of symptoms to musculoskeletal etiology",
        "Delayed surgical consultation after diagnosis (decompression within 48 hours affects outcomes)",
      ],
      expertWitnessPoints: [
        "AANS/CNS Guidelines on diagnosis and management of cauda equina syndrome",
        "Timing of surgical decompression and outcome correlation studies",
        "Todd et al. meta-analysis on surgical timing in CES",
      ],
    },
  },

  // EMTALA requirements
  emtala: {
    requirements: [
      "Medical screening exam for all who present",
      "Stabilizing treatment before transfer",
      "Physician certification that benefits of transfer outweigh risks",
      "Receiving facility acceptance confirmed and documented",
      "Appropriate transfer with qualified personnel and equipment",
      "Complete medical records sent with patient",
    ],
    commonViolations: [
      "Financial inquiry before medical screening exam",
      "Transfer without stabilization",
      "No physician certification for transfer",
      "Failure to document receiving facility acceptance",
      "Diversion of ambulances during ED overcrowding",
    ],
  },

  // Documentation standards
  documentation: {
    mdmRequirements: [
      "Number and complexity of problems addressed",
      "Amount and complexity of data reviewed",
      "Risk of complications, morbidity, and mortality",
    ],
    criticalCareRequirements: [
      "Nature of critical illness or injury",
      "Time spent in direct patient care (document start/stop times)",
      "Clinical decision-making documented",
      "Procedures documented separately",
    ],
    returnPrecautions: [
      "Specific warning signs to return for",
      "Timeframe for follow-up",
      "When to call 911 vs return to ED",
      "Patient verbalized understanding",
      "Interpreter used if language barrier",
    ],
  },

  // Defense-side analysis framework
  defenseFramework: {
    standardOfCareDefense: [
      "Was the physician's judgment reasonable given information available at the time?",
      "Did the clinical presentation differ from textbook presentation?",
      "Were there system-level factors (ED crowding, staffing, equipment)?",
      "Was shared decision-making documented with the patient?",
      "Did the patient contribute to the outcome (left AMA, non-compliance, delayed presentation)?",
    ],
    commonDefenseArguments: [
      "Hindsight bias -- outcome was not foreseeable with information available",
      "Atypical presentation -- patient did not present with classic symptoms",
      "Differential diagnosis was reasonable -- considered but appropriately ruled out",
      "Patient factors -- non-compliance, substance use, delayed presentation",
      "System factors -- not attributable to individual physician judgment",
      "Respectable minority -- physician followed an accepted alternative approach",
    ],
  },
} as const;

// ── Knowledge matching ──
// Detect which clinical categories are relevant to the text and return
// the matching knowledge sections for prompt injection.

const KEYWORD_MAP: Record<string, string[]> = {
  chestPain: [
    "chest pain", "chest tightness", "substernal", "troponin", "ecg", "ekg",
    "heart score", "acs", "acute coronary", "mi ", "myocardial", "stemi",
    "nstemi", "angina", "cardiac", "coronary",
  ],
  stroke: [
    "stroke", "tpa", "alteplase", "nihss", "hemiparesis", "hemiplegia",
    "aphasia", "slurred speech", "facial droop", "weakness one side",
    "thrombectomy", "cerebrovascular", "ischemic stroke", "hemorrhagic",
  ],
  sepsis: [
    "sepsis", "septic", "lactate", "sirs", "infection", "fever",
    "blood culture", "antibiotic", "hypotension", "tachycardia",
    "altered mental status", "qsofa", "bacteremia",
  ],
  abdominalPain: [
    "abdominal pain", "belly pain", "appendicitis", "appendix",
    "mesenteric ischemia", "bowel obstruction", "peritonitis",
    "rlq pain", "epigastric", "lipase", "pancreatitis",
  ],
  pediatricFever: [
    "pediatric", "infant", "neonate", "febrile", "pediatric fever",
    "lumbar puncture", "csf", "meningitis", "neonatal", "well baby",
  ],
  fractures: [
    "fracture", "dislocation", "compartment syndrome", "splint",
    "scaphoid", "orthopedic", "neurovascular", "open fracture",
    "ottawa rules", "reduction",
  ],
  pulmonaryEmbolism: [
    "pulmonary embolism", " pe ", "dvt", "deep vein thrombosis",
    "d-dimer", "ctpa", "ct pulmonary", "wells score", "pleuritic",
    "tachycardia", "shortness of breath", "dyspnea", "anticoagulation",
    "thrombolysis", "submassive",
  ],
  toxicologyOverdose: [
    "overdose", "ingestion", "toxicology", "poisoning", "acetaminophen",
    "tylenol", "nac ", "n-acetylcysteine", "salicylate", "aspirin",
    "drug screen", "suicidal", "intentional ingestion", "toxic alcohol",
    "methanol", "ethylene glycol", "opioid", "naloxone", "narcan",
  ],
  aorticEmergencies: [
    "aortic dissection", "aortic aneurysm", "tearing pain",
    "wide mediastinum", "blood pressure differential", "marfan",
    "aortic regurgitation", "type a dissection", "type b dissection",
    "ripping pain", "ct angiography",
  ],
  ectopicPregnancy: [
    "ectopic", "ectopic pregnancy", "beta-hcg", "hcg", "first trimester",
    "vaginal bleeding", "adnexal mass", "tubal", "pregnancy test",
    "ruptured ectopic", "rh negative", "rhogam",
  ],
  testicularTorsion: [
    "testicular torsion", "scrotal pain", "testicular pain",
    "cremasteric reflex", "doppler ultrasound", "bell clapper",
    "torsion", "acute scrotum",
  ],
  caudaEquina: [
    "cauda equina", "saddle anesthesia", "urinary retention",
    "bowel incontinence", "bladder dysfunction", "bilateral leg weakness",
    "post-void residual", "perineal", "rectal tone", "back pain",
    "lumbar", "disc herniation",
  ],
};

export type ClinicalCategory = keyof typeof CLINICAL_KNOWLEDGE.standardsOfCare;

/**
 * Detect relevant clinical categories from the text.
 * Returns an array of matching category keys.
 */
export function detectCategories(text: string): ClinicalCategory[] {
  const lower = text.toLowerCase();
  const matches = new Set<ClinicalCategory>();

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matches.add(category as ClinicalCategory);
        break;
      }
    }
  }

  return Array.from(matches);
}

/**
 * Build a clinical knowledge context string for the detected categories.
 * This gets injected into analysis and chat prompts.
 */
export function buildKnowledgeContext(categories: ClinicalCategory[]): string {
  if (categories.length === 0) {
    return "";
  }

  const sections: string[] = [];

  for (const cat of categories) {
    const data = CLINICAL_KNOWLEDGE.standardsOfCare[cat];
    if (!data) continue;

    const label = cat.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    sections.push(`
### ${label} — Standard of Care

**Required Workup:**
${data.requiredWorkup.map((r) => `- ${r}`).join("\n")}

**Red Flags (Deviations):**
${data.redFlags.map((r) => `- ${r}`).join("\n")}

**Common Deviations from Standard:**
${data.commonDeviations.map((r) => `- ${r}`).join("\n")}

**Expert Witness Reference Points:**
${data.expertWitnessPoints.map((r) => `- ${r}`).join("\n")}
`);
  }

  // Always include EMTALA and documentation standards
  sections.push(`
### EMTALA Requirements
${CLINICAL_KNOWLEDGE.emtala.requirements.map((r) => `- ${r}`).join("\n")}

**Common EMTALA Violations:**
${CLINICAL_KNOWLEDGE.emtala.commonViolations.map((r) => `- ${r}`).join("\n")}
`);

  sections.push(`
### Documentation Standards

**MDM Requirements:**
${CLINICAL_KNOWLEDGE.documentation.mdmRequirements.map((r) => `- ${r}`).join("\n")}

**Critical Care Documentation:**
${CLINICAL_KNOWLEDGE.documentation.criticalCareRequirements.map((r) => `- ${r}`).join("\n")}

**Return Precautions:**
${CLINICAL_KNOWLEDGE.documentation.returnPrecautions.map((r) => `- ${r}`).join("\n")}
`);

  sections.push(`
### Defense Framework

**Standard of Care Defense Questions:**
${CLINICAL_KNOWLEDGE.defenseFramework.standardOfCareDefense.map((r) => `- ${r}`).join("\n")}

**Common Defense Arguments:**
${CLINICAL_KNOWLEDGE.defenseFramework.commonDefenseArguments.map((r) => `- ${r}`).join("\n")}
`);

  return `\n## CLINICAL KNOWLEDGE BASE\nThe following clinical standards are relevant to this case. Use these when analyzing the records and formulating your response.\n${sections.join("\n")}`;
}

/**
 * Build the full knowledge context from raw clinical text.
 */
export function getKnowledgeForText(text: string): string {
  const categories = detectCategories(text);
  return buildKnowledgeContext(categories);
}
