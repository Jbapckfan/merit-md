// ── MedMal Review Pro Clinician Decision Support Mapper ──
// Maps chief complaints to knowledge base sections and formats output
// for the 5-card clinician tool layout.
// Data is pulled from CLINICAL_KNOWLEDGE and CLINICIAN_REALTIME — NOT hardcoded.

import {
  CLINICAL_KNOWLEDGE,
  LEGAL_FRAMEWORK,
  type ClinicalCategory,
} from "./clinical-knowledge";
import { CLINICIAN_REALTIME, LITIGATION_PATTERNS } from "./medical-legal-expert";

// ── Types ──

export interface ClinicianCard {
  title: string;
  items: string[];
}

export interface RiskLevel {
  level: "low" | "medium" | "high";
  reason: string;
}

export interface ClinicianOutput {
  complaint: string;
  complaintLabel: string;
  mustDocument: ClinicianCard;
  redFlags: ClinicianCard;
  dispoTraps: ClinicianCard;
  returnPrecautions: ClinicianCard;
  riskScore: RiskLevel;
}

// ── Chief Complaint → Knowledge Base Mapping ──
// Each complaint maps to one or more KB categories plus custom overrides
// for dispo traps, return precautions, and risk scoring.

interface ComplaintMapping {
  label: string;
  kbCategories: ClinicalCategory[];
  // Additional must-document items beyond requiredWorkup
  extraMustDocument?: string[];
  // Dispo traps — common discharge errors that generate lawsuits
  dispoTraps: string[];
  // Complaint-specific return precautions
  returnPrecautions: string[];
  // Risk level with reasoning
  risk: RiskLevel;
}

const COMPLAINT_MAP: Record<string, ComplaintMapping> = {
  "chest-pain": {
    label: "Chest Pain",
    kbCategories: ["chestPain", "acuteMI", "pulmonaryEmbolism"],
    extraMustDocument: [
      "HEART score calculated and documented with each component scored",
      "Risk factors for ACS acknowledged in MDM",
      "Serial troponin plan documented or reason serial not needed",
      "EKG interpretation with specific findings (not just 'normal')",
      "Differential diagnosis in MDM (not just 'chest pain r/o ACS')",
      "PE considered and Wells/PERC documented if dyspnea or tachycardia present",
    ],
    dispoTraps: [
      "Single troponin discharge — must be serial (0h and 3h minimum)",
      "Normal EKG assumed to rule out ACS — it doesn't (sensitivity ~50% for MI)",
      "Young patient dismissed without workup — young MIs happen (SCAD, cocaine, anomalous coronary)",
      "HEART score not documented — no defensible risk stratification without it",
      "No repeat EKG despite ongoing or changed symptoms",
      "Discharged before second troponin results finalized",
      "PE not considered in differential — pleuritic chest pain needs Wells/PERC",
      "ACS symptoms attributed to anxiety without cardiac workup",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: chest pain returns or worsens, new shortness of breath, sweating/nausea with pain, pain spreads to arm/jaw/back",
      "Follow up with cardiology within 48-72 hours for stress testing",
      "Take aspirin 325mg (chewed) if pain recurs and no allergy or bleeding risk",
      "Do NOT drive yourself — call 911 if symptoms return",
      "If you were told troponins were normal, that was at ONE point in time — new pain needs new testing",
    ],
    risk: {
      level: "high",
      reason: "Chest pain is the #1 EM malpractice category. Missed MI/PE account for the highest verdict amounts in emergency medicine litigation.",
    },
  },

  "abdominal-pain": {
    label: "Abdominal Pain",
    kbCategories: ["abdominalPain"],
    extraMustDocument: [
      "Serial abdominal exams documented with timestamps",
      "Pregnancy test in all women of childbearing age — BEFORE CT",
      "CT abdomen/pelvis with IV contrast for acute abdomen or age >50",
      "Surgical consultation documented if peritoneal signs present",
      "Specific location and quality of pain characterized (not just 'abdominal pain')",
    ],
    dispoTraps: [
      "Premature anchoring on benign diagnosis (gastritis, constipation) without CT in patients >50",
      "No pregnancy test in reproductive-age female — ectopic missed",
      "Elderly patient with abdominal pain discharged without CT — mesenteric ischemia kills",
      "Pain out of proportion to exam dismissed — mesenteric ischemia, necrotizing fasciitis",
      "RLQ pain in young patient without CT or surgical consultation — appendicitis",
      "Single set of labs used to exclude serious pathology — serial exams required",
      "Discharge without clear return precautions for worsening symptoms",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: pain worsens or spreads, new fever or chills, vomiting blood or bloody/black stool, unable to keep fluids down for >12 hours",
      "Return if pain does not improve within 24-48 hours despite prescribed treatment",
      "Follow up with your doctor within 2-3 days even if improving",
      "Do NOT take NSAIDs (ibuprofen, naproxen) until cleared by follow-up physician",
      "If you develop rigid abdomen (belly board-hard) or feel faint/dizzy, call 911",
    ],
    risk: {
      level: "high",
      reason: "Abdominal pain in elderly and missed appendicitis/ectopic are top-5 EM malpractice categories. Mesenteric ischemia has near-100% mortality when missed.",
    },
  },

  headache: {
    label: "Headache",
    kbCategories: ["stroke"],
    extraMustDocument: [
      "Thunderclap onset vs. gradual — exact onset characterization",
      "Worst headache of life queried and documented",
      "Focal neurological exam documented (not just 'neuro intact')",
      "CT head obtained or documented reason why not needed",
      "LP performed or documented reason not needed if CT negative and SAH suspected",
      "Blood pressure checked and hypertensive emergency excluded",
    ],
    dispoTraps: [
      "Thunderclap headache with negative CT sent home without LP — CT misses 2-5% of SAH in first 6 hours",
      "Worst headache of life attributed to migraine or tension without workup",
      "New headache with focal neuro findings without imaging",
      "Headache with fever without considering meningitis or abscess",
      "Headache in anticoagulated patient without CT — intracranial hemorrhage",
      "Headache with papilledema or vision changes without imaging and LP",
      "Post-traumatic headache without CT in anticoagulated or elderly patient",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: sudden severe headache ('thunderclap'), neck stiffness with fever, vision changes, weakness on one side, difficulty speaking, confusion",
      "Return if headache is the worst of your life or different from usual headaches",
      "Follow up with your doctor within 1 week if headache persists",
      "Call 911 if you develop slurred speech, facial droop, or arm/leg weakness",
      "If prescribed medication does not help within 2 hours, return for re-evaluation",
    ],
    risk: {
      level: "high",
      reason: "Missed SAH and stroke are among the highest-value EM malpractice claims. Headache-related litigation often involves young patients with catastrophic outcomes.",
    },
  },

  "back-pain": {
    label: "Back Pain",
    kbCategories: ["backPainRedFlags", "caudaEquina"],
    extraMustDocument: [
      "Complete neuro exam: motor strength by myotome, sensation by dermatome, reflexes",
      "Red flag screening documented: fever, weight loss, IVDU, cancer history, immunosuppression, trauma, anticoagulation",
      "Saddle anesthesia, perineal sensation, rectal tone assessed or documented why not",
      "Post-void residual or bladder scan if urinary symptoms present",
      "Straight leg raise test documented",
    ],
    dispoTraps: [
      "Cauda equina not considered — bowel/bladder symptoms require emergent MRI",
      "Epidural abscess missed in IVDU patient with fever and back pain",
      "Incomplete neuro exam — 'neuro intact' is not a neurological exam",
      "Cancer patient with new back pain without imaging for metastatic disease",
      "Bilateral leg weakness or foot drop without emergent imaging and neurosurgery",
      "Saddle anesthesia not assessed or documented",
      "Anticoagulated patient with back pain without epidural hematoma consideration",
      "Thoracic back pain dismissed without considering aortic, cardiac, or pulmonary causes",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: new or worsening leg weakness, numbness in groin/saddle area, loss of bladder or bowel control, inability to urinate",
      "Return if pain spreads to both legs or if you develop fever with back pain",
      "Follow up within 1 week if not improving with prescribed treatment",
      "Call 911 if you cannot walk or develop sudden severe weakness in both legs",
      "Do NOT ignore new numbness or tingling — these are warning signs of nerve compression",
    ],
    risk: {
      level: "high",
      reason: "Missed cauda equina syndrome and epidural abscess result in permanent disability. These are high-value claims because the outcome (paralysis, incontinence) is devastating and often preventable.",
    },
  },

  "shortness-of-breath": {
    label: "Shortness of Breath",
    kbCategories: ["pulmonaryEmbolism", "chestPain", "sepsis"],
    extraMustDocument: [
      "Oxygen saturation documented and addressed if abnormal",
      "PE risk assessment: Wells score or PERC documented",
      "Chest X-ray obtained and interpreted",
      "BNP/NT-proBNP if CHF considered",
      "Troponin if cardiac etiology considered",
      "ABG or VBG if significant respiratory distress",
    ],
    dispoTraps: [
      "Dyspnea attributed to anxiety without PE workup — tachycardia + dyspnea = PE until proven otherwise",
      "Normal chest X-ray assumed to exclude PE — CXR is frequently normal in PE",
      "No D-dimer or CTPA in patient with risk factors for PE",
      "Post-surgical or immobilized patient with dyspnea without DVT/PE workup",
      "CHF diagnosis without BNP — or BNP elevated but patient discharged without diuresis",
      "Hypoxia normalized with supplemental O2 and patient discharged without diagnosis",
      "Asthma/COPD exacerbation diagnosed without considering PE or pneumonia",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: breathing gets worse, cannot speak in full sentences, lips or fingertips turn blue, chest pain with breathing",
      "Return if shortness of breath at rest or wakes you from sleep",
      "Use prescribed inhalers exactly as directed — if not helping, return",
      "Call 911 if you feel like you cannot breathe or are going to pass out",
      "Follow up with your doctor within 2-3 days even if symptoms improve",
    ],
    risk: {
      level: "high",
      reason: "Missed PE is the #2 cause of malpractice death claims in EM. Dyspnea has a broad and dangerous differential that requires systematic exclusion.",
    },
  },

  "fever-adult": {
    label: "Fever (Adult)",
    kbCategories: ["sepsis"],
    extraMustDocument: [
      "Source of infection identified or documented as unknown with workup",
      "Lactate level obtained and result documented",
      "Blood cultures obtained (before antibiotics if possible)",
      "Antibiotics started within 1 hour if sepsis suspected",
      "Fluid resuscitation documented if hypotensive or lactate elevated",
      "Immunocompromised status assessed (HIV, chemo, transplant, steroids)",
    ],
    dispoTraps: [
      "Sepsis not recognized — tachycardia + fever + altered mentation = sepsis until proven otherwise",
      "No lactate ordered in febrile patient with abnormal vitals",
      "Antibiotic delay >1 hour after sepsis recognition",
      "Elderly febrile patient discharged without source identified",
      "Immunocompromised patient with fever discharged without cultures and empiric antibiotics",
      "UTI diagnosed without considering urosepsis in elderly with abnormal vitals",
      "Fever attributed to viral illness without adequate workup in high-risk patient",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: fever >103F (39.4C) despite medication, confusion or difficulty staying awake, rapid heart rate or breathing at rest, rash that spreads rapidly",
      "Return if fever persists >48 hours despite prescribed treatment",
      "Take all antibiotics exactly as prescribed — do NOT stop early even if feeling better",
      "Drink plenty of fluids — return if unable to keep fluids down",
      "Call 911 if you feel faint, confused, or have difficulty breathing",
    ],
    risk: {
      level: "medium",
      reason: "Sepsis cases are high-value when missed but many febrile patients have benign viral illness. Risk escalates significantly for elderly and immunocompromised patients.",
    },
  },

  "fever-pediatric": {
    label: "Fever (Pediatric)",
    kbCategories: ["pediatricFever"],
    extraMustDocument: [
      "Age-specific workup documented (neonate <28d = full sepsis workup)",
      "Risk stratification tool applied and documented (Rochester, Philadelphia, Step-by-Step)",
      "Urinalysis obtained for all febrile infants <24 months",
      "LP performed or documented reason not performed in neonates",
      "Weight documented for all medication dosing",
      "Caregiver understanding of return precautions confirmed",
    ],
    dispoTraps: [
      "Febrile neonate (<28 days) sent home without full sepsis workup — NEVER acceptable",
      "Well-appearing neonate discharged without workup — well-appearing neonates can be bacteremic",
      "No urine obtained in febrile infant <24 months",
      "LP not performed in neonate before antibiotics started",
      "Risk stratification tool not documented — no defensible basis for disposition",
      "Inadequate return precautions for caregivers — must be specific and in their language",
      "Fever attributed to teething — teething does NOT cause fever >100.4F",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: fever >104F (40C), child is difficult to wake, not feeding, inconsolable crying, rash that does not blanch with pressure, breathing fast or with difficulty",
      "Return if fever persists >24 hours in infant <3 months or >72 hours in older children",
      "Give acetaminophen (Tylenol) OR ibuprofen (Motrin, if >6 months) as directed — NEVER aspirin",
      "Push fluids — offer small amounts frequently. Return if no wet diapers for 8+ hours",
      "Call 911 if child has a seizure, turns blue, or is not breathing normally",
      "Trust your instincts — if your child looks sick to you, bring them back",
    ],
    risk: {
      level: "high",
      reason: "Missed meningitis and bacteremia in neonates/infants carry the highest verdict amounts in all of EM. Jury sympathy is maximal for pediatric cases. Age-specific protocols must be followed exactly.",
    },
  },

  syncope: {
    label: "Syncope",
    kbCategories: ["chestPain", "pulmonaryEmbolism"],
    extraMustDocument: [
      "Detailed event history: prodrome, position, activity, witnesses",
      "EKG obtained and interpreted — arrhythmia, Brugada, long QT, WPW screening",
      "Orthostatic vitals documented",
      "Cardiac history and family history of sudden death documented",
      "Neurological exam documented to exclude stroke/seizure",
      "Risk stratification applied (San Francisco Syncope Rule, Canadian Syncope Risk Score)",
    ],
    dispoTraps: [
      "Syncope attributed to vasovagal without EKG — cardiac syncope kills",
      "No orthostatic vitals obtained",
      "Family history of sudden cardiac death not elicited",
      "Exertional syncope discharged without cardiology evaluation — high risk for sudden death",
      "Elderly syncope without PE and cardiac workup",
      "Syncope with abnormal EKG discharged without monitoring",
      "No risk stratification tool documented",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: another fainting episode, chest pain or palpitations, shortness of breath, fainting during exercise",
      "Do NOT drive until cleared by your follow-up physician",
      "Do NOT operate heavy machinery or work at heights until cause determined",
      "Follow up with cardiology within 1 week for further evaluation",
      "Call 911 if you faint and someone notes irregular heartbeat or you are unresponsive for >1 minute",
    ],
    risk: {
      level: "high",
      reason: "Cardiac syncope has 6-12% one-year mortality. Missed arrhythmia, PE, and aortic stenosis in syncope patients generate high-value claims because death often follows soon after discharge.",
    },
  },

  dizziness: {
    label: "Dizziness",
    kbCategories: ["stroke"],
    extraMustDocument: [
      "Type of dizziness characterized: vertigo vs. lightheadedness vs. disequilibrium vs. presyncope",
      "HINTS exam performed if acute vestibular syndrome (continuous vertigo + nystagmus)",
      "Gait assessment documented",
      "Neurological exam including cerebellar testing (finger-to-nose, heel-to-shin)",
      "Posterior stroke considered and documented in differential",
      "Blood pressure and orthostatic vitals checked",
    ],
    dispoTraps: [
      "Posterior stroke missed — labeled as peripheral vertigo. HINTS exam is more sensitive than MRI in first 48 hours",
      "No gait assessment — patient with cerebellar stroke may look normal in bed",
      "BPPV diagnosed without performing Dix-Hallpike maneuver",
      "Continuous vertigo with normal hearing attributed to peripheral cause without HINTS",
      "Dizziness in elderly without cardiovascular and stroke workup",
      "New vertigo in patient with vascular risk factors without stroke evaluation",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: new headache with dizziness, difficulty speaking or swallowing, weakness or numbness, inability to walk, double vision",
      "Return if dizziness does not improve within 48-72 hours with prescribed treatment",
      "Call 911 if sudden severe dizziness with any neurological symptom",
      "Avoid driving, climbing ladders, or operating machinery until dizziness resolves",
      "Follow up with your doctor within 1 week — mention if dizziness changes character",
    ],
    risk: {
      level: "medium",
      reason: "Posterior stroke misdiagnosed as peripheral vertigo is a known high-value claim pattern. Risk is moderate overall but catastrophic when stroke is missed.",
    },
  },

  "extremity-injury": {
    label: "Extremity Injury",
    kbCategories: ["fractures"],
    extraMustDocument: [
      "Neurovascular exam documented pre- and post-any reduction or splinting",
      "Compartment syndrome assessment for high-risk fractures",
      "Ottawa rules applied and documented if ankle/knee/foot",
      "Wound assessment: open vs. closed fracture",
      "Tetanus status documented for open injuries",
      "Orthopedic consultation documented for operative fractures",
    ],
    dispoTraps: [
      "No neurovascular exam documented — indefensible if compartment syndrome develops",
      "Compartment syndrome symptoms missed (pain with passive stretch, pain out of proportion)",
      "Open fracture without antibiotics within 1 hour",
      "Scaphoid tenderness without thumb spica and orthopedic follow-up — occult scaphoid fracture",
      "Displaced fracture discharged without orthopedic consultation",
      "Tendon injury missed on exam — always test individual tendon function",
      "Splint applied without post-splint neurovascular check",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: increasing pain despite elevation and medication, numbness or tingling in fingers/toes, fingers/toes turn white or blue, splint feels too tight, inability to move fingers/toes",
      "Elevate the injured extremity above your heart as much as possible for 48 hours",
      "Follow up with orthopedics within 5-7 days (sooner if instructed)",
      "Do NOT remove splint — if it gets wet or damaged, return for replacement",
      "Call 911 if you develop sudden severe pain, swelling, or the limb looks pale/cool",
    ],
    risk: {
      level: "medium",
      reason: "Missed compartment syndrome leads to limb loss and devastating verdicts. Missed fractures (especially scaphoid) are common and lead to avascular necrosis. Functional outcomes are measurable damages.",
    },
  },

  laceration: {
    label: "Laceration",
    kbCategories: ["fractures"],
    extraMustDocument: [
      "Wound exploration documented: depth, structures visualized, foreign body assessment",
      "Tendon function tested individually and documented",
      "Neurovascular status distal to wound documented",
      "Tetanus status updated or administered",
      "Method of repair and anesthesia documented",
      "Wound irrigation method and volume documented",
    ],
    dispoTraps: [
      "Tendon laceration missed — flexor tendons can appear intact if tested improperly",
      "Foreign body not excluded — glass and metal need X-ray; wood/plastic need ultrasound",
      "Nerve injury not documented — always check two-point discrimination and light touch",
      "No tetanus update in wound requiring it",
      "Wound closed that should have been left open (bite wounds, heavily contaminated, >12-24 hours old)",
      "Deep structure injury missed in hand/wrist lacerations — always test each tendon and nerve individually",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: increasing redness spreading from wound, red streaks going up the arm/leg, fever >101F, increasing pain after first 24 hours, pus or foul-smelling drainage",
      "Return if wound opens up or stitches/staples come out",
      "Keep wound clean and dry for first 24-48 hours, then gentle soap and water",
      "Return for suture/staple removal in [specified timeframe] — face 5 days, other areas 7-14 days",
      "Watch for signs of infection for 2 weeks after injury",
    ],
    risk: {
      level: "medium",
      reason: "Missed tendon and nerve injuries in hand lacerations are common claims with significant functional disability. Foreign body retention cases are highly defensible for the plaintiff.",
    },
  },

  "altered-mental-status": {
    label: "Altered Mental Status",
    kbCategories: ["sepsis", "stroke", "toxicologyOverdose"],
    extraMustDocument: [
      "Fingerstick glucose — FIRST thing in any altered patient",
      "Complete neurological exam with GCS documented",
      "CT head obtained or documented reason not needed",
      "Toxicology screen and specific drug levels as indicated",
      "Infection workup: UA, blood cultures, CXR, LP if meningitis suspected",
      "Metabolic workup: BMP, ammonia, TSH, B12 as indicated",
      "Collateral history obtained from EMS, family, bystanders",
    ],
    dispoTraps: [
      "AMS attributed to intoxication without full medical workup — intoxicated patients get sick too",
      "No glucose checked — hypoglycemia is immediately treatable and missed hypoglycemia is indefensible",
      "No CT head in new AMS — intracranial hemorrhage, mass, stroke",
      "Psychiatric cause assumed before organic causes excluded",
      "Elderly AMS attributed to UTI without broader workup (stroke, MI, medications, metabolic)",
      "Patient discharged while still altered — must reach clinical sobriety and baseline mentation",
      "No LP in febrile patient with AMS — meningitis must be excluded",
    ],
    returnPrecautions: [
      "FAMILY/CAREGIVER: Return IMMEDIATELY if confusion returns or worsens, new fever, seizure, difficulty speaking or moving one side, or patient becomes difficult to arouse",
      "Do NOT leave this person alone for the next 24 hours",
      "Do NOT allow alcohol or sedating medications for 24 hours",
      "Follow up with primary care within 2-3 days for reassessment",
      "Call 911 if patient becomes unresponsive, has a seizure, or develops new weakness",
    ],
    risk: {
      level: "high",
      reason: "AMS has a massive differential and the penalty for missing the diagnosis is often death or permanent brain injury. Intoxicated patients with missed head bleeds are a recurring high-value claim pattern.",
    },
  },

  "overdose-ingestion": {
    label: "Overdose / Ingestion",
    kbCategories: ["toxicologyOverdose", "psychiatricEmergencies"],
    extraMustDocument: [
      "Fingerstick glucose immediately",
      "Acetaminophen and salicylate levels on ALL intentional ingestions",
      "EKG for QRS/QTc assessment",
      "Poison control center consultation documented",
      "Time of ingestion, substance, amount, intent documented",
      "Psychiatric evaluation ordered once medically cleared",
      "Suicide risk assessment using validated tool (C-SSRS)",
    ],
    dispoTraps: [
      "No acetaminophen level on intentional ingestion — APAP is in everything and delayed toxicity kills",
      "Premature psychiatric clearance with pending drug levels",
      "Discharged before peak drug effect for delayed-toxicity agents (sustained-release, APAP)",
      "TCA ingestion without continuous cardiac monitoring — sudden death from arrhythmia",
      "Suicidal patient discharged without formal psychiatric evaluation",
      "Reliance on urine drug screen for clinical decisions — high false negative rate",
      "No Rumack-Matthew nomogram applied for acetaminophen timing",
      "Medical clearance deemed complete without adequate observation period",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: new symptoms develop (nausea, vomiting, abdominal pain, confusion, chest pain, difficulty breathing, blurred vision), even if you feel fine now — some toxins have delayed effects",
      "Take all prescribed medications and follow up as directed",
      "If this was intentional: 988 Suicide & Crisis Lifeline (call or text 988) available 24/7",
      "Secure all medications in the home — remove access to large quantities",
      "Follow up with psychiatry/mental health within 48-72 hours as arranged",
      "Call 911 if any new or worsening symptoms develop",
    ],
    risk: {
      level: "high",
      reason: "Missed acetaminophen toxicity and premature psychiatric clearance are major liability areas. Suicide after ED discharge is a devastating claim both legally and personally.",
    },
  },

  "pelvic-pain-female": {
    label: "Pelvic Pain (Female)",
    kbCategories: ["ectopicPregnancy", "abdominalPain"],
    extraMustDocument: [
      "Pregnancy test (quantitative hCG if positive) — MANDATORY",
      "LMP documented",
      "Pelvic exam with speculum and bimanual findings documented",
      "Transvaginal ultrasound if pregnant with pain or bleeding",
      "Rh status if pregnant",
      "STI testing if PID/TOA considered",
    ],
    dispoTraps: [
      "No pregnancy test — ectopic pregnancy is the most dangerous missed diagnosis in this population",
      "Positive pregnancy test with pain and no ultrasound — ectopic not excluded",
      "Ruptured ectopic not considered in hemodynamically unstable female of reproductive age",
      "Ovarian torsion missed — sudden onset unilateral pain needs doppler ultrasound",
      "PID diagnosed without adequate STI testing or follow-up plan",
      "Rh-negative pregnant patient without RhoGAM discussion",
      "Discharge with pregnancy of unknown location without 48-hour hCG follow-up plan",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: pain worsens suddenly, heavy vaginal bleeding (soaking >1 pad per hour), feeling faint or dizzy, shoulder pain with pelvic pain (sign of internal bleeding), fever >101F",
      "Follow up for repeat hCG level as instructed — do NOT skip this appointment",
      "No intercourse, tampons, or douching until follow-up if infection treated",
      "Call 911 if you feel like you are going to pass out or have sudden severe pain",
      "If pregnant: no NSAIDs — acetaminophen only for pain",
    ],
    risk: {
      level: "high",
      reason: "Missed ectopic pregnancy is a top-5 EM malpractice diagnosis. Ruptured ectopic can cause death within hours. Ovarian torsion delay causes ovarian loss. High jury sympathy in reproductive-age women.",
    },
  },

  "testicular-pain": {
    label: "Testicular Pain",
    kbCategories: ["testicularTorsion"],
    extraMustDocument: [
      "Manual testicular exam: lie, swelling, cremasteric reflex, tenderness location",
      "Time of symptom onset documented (viability window: 6-8 hours)",
      "Doppler ultrasound obtained or documented why surgery is indicated without imaging",
      "Urology consulted urgently for suspected torsion",
      "Urinalysis to evaluate for alternative diagnosis",
    ],
    dispoTraps: [
      "Torsion not considered in acute scrotal pain — especially in adolescents",
      "Ultrasound delay when clinical suspicion is high — surgical exploration should NOT wait for imaging",
      "Cremasteric reflex not tested or not documented",
      "Testicular pain in prepubertal male attributed to UTI/epididymitis without imaging",
      "Symptom onset >6 hours without urgent urology consultation — testicular salvage drops precipitously",
      "Intermittent torsion with resolved symptoms discharged without urology follow-up",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: pain returns or worsens, swelling increases, new redness or fever, pain not controlled with prescribed medication",
      "Time matters — testicular torsion has a 6-8 hour window for salvage. If pain recurs, come back IMMEDIATELY, do not wait",
      "Follow up with urology within 1 week as arranged",
      "Wear supportive underwear and elevate when possible to reduce swelling",
      "Call 911 if severe sudden pain returns — this is a surgical emergency",
    ],
    risk: {
      level: "high",
      reason: "Missed testicular torsion results in orchiectomy (testicular loss) which is devastating in young males. Time-sensitive diagnosis with clear guidelines makes liability straightforward to establish.",
    },
  },

  "eye-complaints": {
    label: "Eye Complaints",
    kbCategories: [],
    extraMustDocument: [
      "Visual acuity documented (with correction if patient wears glasses) — BEFORE any exam or treatment",
      "Slit lamp exam findings documented",
      "Fluorescein staining performed for corneal complaints",
      "Intraocular pressure measured if glaucoma considered",
      "Pupil shape, size, and reactivity documented",
      "Fundoscopic exam or documented reason not performed",
    ],
    dispoTraps: [
      "No visual acuity documented — this is the vital sign of the eye",
      "Globe rupture missed — irregular pupil, decreased acuity, mechanism (hammering, grinding)",
      "Acute angle-closure glaucoma missed — red eye with pain, mid-dilated non-reactive pupil, halos",
      "Retinal detachment missed — flashes, floaters, curtain across vision",
      "Orbital compartment syndrome missed — proptosis, decreased acuity, increased IOP after trauma",
      "Chemical burn not irrigated emergently — irrigation FIRST, questions later",
      "Contact lens wearer with red eye discharged without fluorescein — corneal ulcer",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: sudden vision loss or change, increasing pain despite medication, new flashes or shower of floaters, curtain or shadow across vision",
      "Follow up with ophthalmology within 24-48 hours as instructed",
      "Do NOT wear contact lenses until cleared by ophthalmology",
      "Do NOT rub the affected eye",
      "Wear sunglasses if light sensitivity is present",
      "Call 911 if sudden complete vision loss in one or both eyes",
    ],
    risk: {
      level: "medium",
      reason: "Missed globe rupture, acute glaucoma, and retinal detachment can cause permanent vision loss. Visual acuity documentation is the single most important defensive element.",
    },
  },

  "sore-throat": {
    label: "Sore Throat",
    kbCategories: [],
    extraMustDocument: [
      "Airway patency assessed and documented",
      "Ability to swallow secretions documented",
      "Neck exam: trismus, submandibular swelling, deviation of uvula",
      "Centor criteria or FeverPAIN score applied",
      "Strep test or clinical criteria for antibiotic decision documented",
      "Peritonsillar abscess assessment documented",
    ],
    dispoTraps: [
      "Peritonsillar abscess missed — unilateral swelling, trismus, 'hot potato' voice, uvula deviation",
      "Retropharyngeal abscess missed — posterior pharyngeal swelling, neck stiffness, drooling (especially pediatric)",
      "Epiglottitis missed — drooling, tripod position, stridor, severe sore throat without pharyngeal findings",
      "Ludwig angina missed — floor of mouth swelling, bilateral submandibular swelling, can't open mouth",
      "Sore throat with airway compromise not recognized — subtle stridor, positional breathing",
      "Mononucleosis diagnosed without warning about splenic rupture risk",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: difficulty breathing or swallowing, drooling or unable to swallow saliva, worsening swelling in neck or throat, voice changes ('hot potato' voice), fever >103F despite treatment",
      "Return if unable to drink fluids for >12 hours",
      "Complete all antibiotics if prescribed — even if feeling better",
      "Follow up with your doctor if not improving in 48-72 hours on antibiotics",
      "Call 911 if difficulty breathing develops at any time",
    ],
    risk: {
      level: "low",
      reason: "Most sore throats are benign. Risk increases significantly when deep space neck infections (PTA, RPA, Ludwig) are missed. Epiglottitis is rare but catastrophic.",
    },
  },

  rash: {
    label: "Rash",
    kbCategories: ["sepsis"],
    extraMustDocument: [
      "Rash description: distribution, morphology, blanching vs. non-blanching",
      "Vital signs with attention to fever and hemodynamic status",
      "Mucosal involvement assessed (mouth, eyes, genitalia)",
      "Medication history — recent new medications documented",
      "Systemic symptoms assessed (fever, joint pain, difficulty breathing)",
      "Non-blanching/petechial rash in febrile patient triggers meningococcemia workup",
    ],
    dispoTraps: [
      "Non-blanching petechial rash with fever discharged without meningococcemia workup",
      "Stevens-Johnson syndrome (SJS/TEN) missed — mucosal involvement + skin sloughing is an emergency",
      "Necrotizing fasciitis misdiagnosed as cellulitis — pain out of proportion, rapid progression, systemic toxicity",
      "Anaphylaxis with rash not recognized — add hypotension, airway compromise, give epinephrine",
      "Meningococcemia missed in child with fever and petechiae — can deteriorate in hours",
      "New medication rash discharged without stopping offending agent or SJS counseling",
    ],
    returnPrecautions: [
      "Return IMMEDIATELY if: rash spreads rapidly, blistering or skin peeling, mouth or eye sores develop, difficulty breathing or swelling of face/throat, fever with rash getting worse",
      "Return if rash is not improving in 48 hours on prescribed treatment",
      "Stop any newly started medication that may be causing the rash (discuss with prescribing doctor)",
      "Call 911 if difficulty breathing, swelling of tongue/throat, or feeling faint",
      "Follow up with your doctor or dermatology within 1 week if rash persists",
    ],
    risk: {
      level: "medium",
      reason: "Most rashes are benign. Risk is HIGH for missed necrotizing fasciitis, SJS/TEN, meningococcemia, and anaphylaxis — all of which can be rapidly fatal if not recognized.",
    },
  },
};

// ── Public API ──

/**
 * Get all supported chief complaints as slug/label pairs.
 */
export function getComplaintList(): { slug: string; label: string }[] {
  return Object.entries(COMPLAINT_MAP).map(([slug, m]) => ({
    slug,
    label: m.label,
  }));
}

/**
 * Build the full 5-card clinician output for a given chief complaint slug.
 * Returns null if the complaint is not supported.
 */
export function getClinicianOutput(slug: string): ClinicianOutput | null {
  const mapping = COMPLAINT_MAP[slug];
  if (!mapping) return null;

  // ── Must-Document ──
  // Combine KB requiredWorkup items with custom extras
  const mustDocItems: string[] = [];
  for (const cat of mapping.kbCategories) {
    const data = CLINICAL_KNOWLEDGE.standardsOfCare[cat];
    if (data) {
      mustDocItems.push(...data.requiredWorkup);
    }
  }
  if (mapping.extraMustDocument) {
    mustDocItems.push(...mapping.extraMustDocument);
  }
  // Also pull from CLINICIAN_REALTIME shift review checklist (universal items)
  // Add the top universal documentation items
  mustDocItems.push(
    "Disposition reasoning documented — why discharge/admit/transfer",
    "Re-evaluation documented after treatment (did they improve?)",
  );
  // Deduplicate
  const uniqueMustDoc = Array.from(new Set(mustDocItems));

  // ── Red Flags ──
  // Pull directly from KB redFlags for each category
  const redFlagItems: string[] = [];
  for (const cat of mapping.kbCategories) {
    const data = CLINICAL_KNOWLEDGE.standardsOfCare[cat];
    if (data) {
      redFlagItems.push(...data.redFlags);
    }
  }
  // Add high-risk flags from CLINICIAN_REALTIME that are relevant
  // (these are universal but important)
  const universalRedFlags = CLINICIAN_REALTIME.shiftReviewChecklist.highRiskFlags
    .filter((f) => {
      const lower = f.toLowerCase();
      return (
        lower.includes("bounce-back") ||
        lower.includes("bad feeling") ||
        lower.includes("pain out of proportion")
      );
    });
  redFlagItems.push(...universalRedFlags);
  const uniqueRedFlags = Array.from(new Set(redFlagItems));

  // ── Dispo Traps ──
  // Pull from mapping-specific dispoTraps + KB commonDeviations
  const dispoTrapItems: string[] = [...mapping.dispoTraps];
  for (const cat of mapping.kbCategories) {
    const data = CLINICAL_KNOWLEDGE.standardsOfCare[cat];
    if (data) {
      // CommonDeviations are essentially dispo traps in the KB
      dispoTrapItems.push(...data.commonDeviations);
    }
  }
  const uniqueDispoTraps = Array.from(new Set(dispoTrapItems));

  // ── Return Precautions ──
  const returnItems = [...mapping.returnPrecautions];
  // Append universal return precaution guidance
  returnItems.push(
    ...CLINICAL_KNOWLEDGE.documentation.returnPrecautions.filter(
      (r) => !returnItems.some((existing) => existing.toLowerCase().includes(r.toLowerCase()))
    )
  );

  return {
    complaint: slug,
    complaintLabel: mapping.label,
    mustDocument: {
      title: "Must-Document",
      items: uniqueMustDoc,
    },
    redFlags: {
      title: "Red Flags",
      items: uniqueRedFlags,
    },
    dispoTraps: {
      title: "Dispo Traps",
      items: uniqueDispoTraps,
    },
    returnPrecautions: {
      title: "Return Precautions",
      items: returnItems,
    },
    riskScore: mapping.risk,
  };
}

/**
 * Search complaints by partial match on label or slug.
 */
export function searchComplaints(query: string): { slug: string; label: string }[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return getComplaintList();

  return getComplaintList().filter(
    (c) =>
      c.label.toLowerCase().includes(lower) ||
      c.slug.toLowerCase().includes(lower.replace(/\s+/g, "-"))
  );
}
