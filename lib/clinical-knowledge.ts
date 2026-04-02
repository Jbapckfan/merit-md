// ── Merit-MD Clinical Knowledge Base ──
// Structured clinical knowledge injected into analysis and chat prompts.
// This is the moat — impossible to replicate without an ER physician.

// ── Legal Framework ──
// Elements of medical malpractice, statute of limitations, expert witness
// requirements, damages assessment, and hospital risk management.
// Authoritative for both plaintiff and defense counsel pre-screening.

export const LEGAL_FRAMEWORK = {
  // SOURCE: hard-law | JURISDICTION: universal (elements vary by state) | LAST VERIFIED: 2026-04
  // Elements of medical malpractice
  elementsOfMalpractice: {
    // SOURCE: hard-law | JURISDICTION: universal | LAST VERIFIED: 2026-04
    duty: {
      description:
        "A physician-patient relationship existed, creating a duty of care",
      keyQuestions: [
        "Was there a documented physician-patient encounter?",
        "Did the physician assume care (even informally, e.g., phone orders)?",
        "Was there an on-call obligation that created duty?",
        "Does vicarious liability apply (hospital vs. independent contractor)?",
      ],
      caseReferences: [
        "Manlove v. Wilmington General Hospital (1961) — hospital's duty to provide emergency care",
      ],
      // NOTE: Ybarra v. Spangard and Canterbury v. Spence were previously listed here
      // but belong under more specific doctrines. See:
      //   - informedConsent.caseReferences for Canterbury v. Spence
      //   - breach.resIpsaLoquitur for Ybarra v. Spangard
    },
    breach: {
      description:
        "The physician deviated from the accepted standard of care",
      standardDefinition:
        "The level of care, skill, and treatment that a reasonably competent physician in the same specialty would provide under similar circumstances",
      keyQuestions: [
        "What would a reasonable ER physician have done in this situation?",
        "Were national guidelines or hospital protocols violated?",
        "Was the deviation a judgment call or a clear protocol failure?",
        "Is there a 'respectable minority' defense for the approach taken?",
      ],
      // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
      standardSources: [
        "ACEP Clinical Policies (influential but NOT the legal standard of care by themselves — the legal standard is what a reasonably competent physician would do under similar circumstances, informed by but not defined by published guidelines; courts consider guidelines as evidence of the standard, not the standard itself)",
        "AHA/ACC Guidelines (cardiac)",
        "Surviving Sepsis Campaign (sepsis)",
        "ATLS (trauma)",
        "Hospital-specific protocols and order sets",
        "CMS Conditions of Participation",
        "Joint Commission standards",
        "State medical board regulations",
      ],
      // SOURCE: hard-law | JURISDICTION: universal | LAST VERIFIED: 2026-04
      resIpsaLoquitur: {
        description:
          "Doctrine allowing inference of negligence when the specific negligent act is unknown, but the injury would not ordinarily occur without negligence",
        caseReferences: [
          "Ybarra v. Spangard (1944) — established that res ipsa loquitur applies in medical cases where the patient was unconscious and multiple defendants had control; shifts the burden to each defendant to prove they were not negligent, even when the plaintiff cannot identify which specific provider caused the harm",
        ],
      },
    },
    // SOURCE: hard-law | JURISDICTION: universal (standard varies: patient-rule vs physician-rule by state) | LAST VERIFIED: 2026-04
    informedConsent: {
      description:
        "A subset of duty — the physician's obligation to disclose material risks, alternatives, and expected outcomes so the patient can make an informed decision about treatment",
      keyQuestions: [
        "Were the material risks of the procedure/treatment disclosed?",
        "Were reasonable alternatives (including no treatment) discussed?",
        "Did the patient have capacity to consent?",
        "Would a reasonable patient have declined had they been fully informed?",
      ],
      caseReferences: [
        "Canterbury v. Spence (1972) — landmark case establishing the 'reasonable patient' standard for informed consent disclosure; held that a physician must disclose all risks that a reasonable patient would consider material to the decision, replacing the older 'professional standard' (what physicians customarily disclose) in many jurisdictions",
      ],
    },
    // SOURCE: hard-law | JURISDICTION: universal (loss-of-chance varies by state) | LAST VERIFIED: 2026-04
    causation: {
      description:
        "The breach directly caused or substantially contributed to the patient's injury",
      types: [
        "Cause-in-fact (but-for causation): but for the physician's action/inaction, the injury would not have occurred",
        "Proximate cause: the injury was a foreseeable consequence of the breach",
        "Loss of chance doctrine: even if outcome uncertain, the breach reduced the probability of a better outcome (varies by state)",
        "Substantial factor test: the breach was a substantial factor in causing harm (some jurisdictions)",
      ],
      keyQuestions: [
        "Would the patient have survived/recovered with proper care?",
        "What is the statistical difference in outcomes with vs. without proper treatment?",
        "Were there intervening causes that broke the chain of causation?",
        "Does the loss-of-chance doctrine apply in this jurisdiction?",
      ],
      challenges: [
        "Pre-existing conditions that complicate causation",
        "Multiple treating physicians — apportioning fault",
        "Delayed diagnosis — proving earlier detection would have changed outcome",
        "Patient non-compliance contributing to outcome",
      ],
    },
    // SOURCE: hard-law | JURISDICTION: state-specific (caps and types vary) | LAST VERIFIED: 2026-04
    damages: {
      types: {
        economic: [
          "Past and future medical expenses",
          "Lost wages and earning capacity",
          "Life care plan costs (catastrophic injury)",
          "Home modification and adaptive equipment",
          "Cost of future surgeries or treatments",
        ],
        nonEconomic: [
          "Pain and suffering",
          "Loss of enjoyment of life",
          "Emotional distress",
          "Loss of consortium (spouse's claim)",
          "Disfigurement",
        ],
        punitive:
          "Available in egregious cases — gross negligence, recklessness, or intentional misconduct. Varies significantly by state. Most med-mal cases do not support punitive damages.",
        wrongfulDeath: [
          "Survival action (patient's pain/suffering before death)",
          "Wrongful death action (family's losses — support, companionship, funeral costs)",
          "Beneficiaries defined by state statute",
        ],
      },
      // SOURCE: hard-law | JURISDICTION: state-specific | LAST VERIFIED: 2026-04
      capsByState: {
        note: "Use getStateLaw() for current, jurisdiction-specific data. See lib/state-law-engine.ts.",
        engine: "state-law-engine" as const,
      },
    },
  },

  // SOURCE: hard-law | JURISDICTION: state-specific | LAST VERIFIED: 2026-04
  // Statute of limitations (critical screening question)
  statuteOfLimitations: {
    general:
      "Typically 1-3 years from date of injury or discovery. Varies by state.",
    discoveryRule:
      "Clock starts when the patient knew or should have known about the injury — not necessarily the date of treatment.",
    tolling: [
      "Minor patients: clock may not start until age of majority",
      "Continuing treatment doctrine: clock paused while same provider treats same condition",
      "Fraudulent concealment: clock paused if provider hid the error",
      "Mental incapacity: may toll the statute",
    ],
    absoluteRepose:
      "Many states have an absolute statute of repose (5-10 years) regardless of discovery. Check state law.",
    screeningQuestions: [
      "When did the alleged malpractice occur?",
      "When did you first become aware something went wrong?",
      "Have you been receiving ongoing treatment from the same provider?",
      "Is the patient a minor?",
      "What state did the treatment occur in?",
    ],
  },

  // SOURCE: hard-law | JURISDICTION: state-specific | LAST VERIFIED: 2026-04
  // Expert witness requirements
  expertWitness: {
    requirements: [
      "Most states require a qualified medical expert to establish standard of care and breach",
      "Expert must typically be in same or similar specialty",
      "Many states require a Certificate of Merit or Affidavit of Merit before filing",
      "Some states allow the case to proceed without expert if res ipsa loquitur applies",
    ],
    qualifications: [
      "Board certified in same or related specialty",
      "Active clinical practice (not just academic — varies by state)",
      "Familiar with standard of care at the time of the incident",
      "No excessive testimony history (credibility concern)",
    ],
    certificateOfMerit: {
      description:
        "Many states require a physician's affidavit that the case has merit BEFORE the lawsuit can proceed",
      states:
        "Required in: CA, CT, FL, GA, IL, MD, MI, NJ, NY, OH, PA, TX, and others",
      timing: "Usually must be filed with or shortly after the complaint",
      significance:
        "This is exactly what Merit-MD provides — the pre-filing clinical assessment",
    },
  },

  // SOURCE: expert-heuristic | JURISDICTION: universal | LAST VERIFIED: 2026-04
  // Damages assessment framework
  damagesAssessment: {
    severityScale: {
      1: "Temporary minor injury, full recovery expected",
      2: "Temporary significant injury requiring treatment",
      3: "Temporary major injury, extended treatment needed",
      4: "Permanent minor disability or disfigurement",
      5: "Permanent significant disability",
      6: "Permanent major disability, loss of independence",
      7: "Catastrophic injury (brain damage, paralysis)",
      8: "Near-fatal, requires lifelong care",
      9: "Death of patient",
    } as Record<number, string>,
    valuationFactors: [
      "Patient age (younger = higher lifetime damages)",
      "Patient earning capacity (documented income history)",
      "Severity and permanence of injury",
      "Impact on daily activities and quality of life",
      "Jurisdiction (verdict ranges vary enormously by county)",
      "Strength of liability evidence",
      "Sympathy factor (jury appeal of plaintiff)",
      "Defendant's conduct (egregious vs. honest mistake)",
    ],
  },

  // SOURCE: expert-heuristic | JURISDICTION: universal | LAST VERIFIED: 2026-04
  // Hospital risk management specific
  hospitalRiskManagement: {
    proactiveReviewTriggers: [
      "Unexpected death or serious harm (sentinel event)",
      "Rapid response or code blue activation",
      "Transfer to higher level of care within 24 hours",
      "Unplanned return to ED within 72 hours",
      "Patient complaint about clinical care",
      "Against medical advice (AMA) discharge",
      "Medication error or adverse drug event",
      "Fall with injury",
      "Surgical site infection or wrong-site surgery",
      "Blood product reaction",
      "Delay in treatment > 1 hour for emergent conditions",
    ],
    riskScoring: {
      highRisk: [
        "Missed MI, stroke, PE, or ectopic pregnancy",
        "Delayed sepsis recognition with poor outcome",
        "EMTALA violation",
        "Medication error causing harm",
        "Failure to act on critical lab/imaging results",
        "Patient death within 24 hours of ED discharge",
      ],
      moderateRisk: [
        "Delayed diagnosis with eventual recovery",
        "Documentation gaps in high-acuity encounters",
        "Inadequate informed consent documentation",
        "Communication failures at handoff",
        "Missed fracture requiring delayed surgery",
      ],
      lowRisk: [
        "Minor documentation deficiencies",
        "Delayed non-urgent follow-up",
        "Patient satisfaction concerns without clinical impact",
        "Process deviations without patient harm",
      ],
    },
    rootCauseCategories: [
      "Diagnostic error (cognitive: anchoring, premature closure, availability bias)",
      "Communication failure (handoff, specialist consultation, patient communication)",
      "System failure (staffing, equipment, IT, process design)",
      "Medication error (wrong drug, dose, route, timing, patient)",
      "Procedural error (technique, wrong site, retained foreign body)",
      "Monitoring failure (delayed recognition of deterioration)",
      "Disposition error (premature discharge, inappropriate admission level)",
    ],
  },
} as const;

export const CLINICAL_KNOWLEDGE = {
  // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
  // Standard of care references by chief complaint
  standardsOfCare: {
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: federal (CMS SEP-1) + universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
    acuteMI: {
      requiredWorkup: [
        "12-lead ECG within 10 minutes of arrival",
        "Immediate cardiology/cath lab notification for STEMI",
        "Door-to-balloon time < 90 minutes (PCI-capable facility)",
        "Door-to-needle time < 30 minutes if fibrinolysis chosen (non-PCI facility)",
        "Door-in-door-out time < 120 minutes for transfer to PCI center",
        "Aspirin 325 mg (chewed) immediately unless true allergy",
        "P2Y12 inhibitor loading dose (clopidogrel, ticagrelor, or prasugrel)",
        "Anticoagulation (heparin) initiated per STEMI protocol",
        "Serial troponins (high-sensitivity: 0/1h or 0/3h protocol)",
        "Continuous cardiac monitoring from time of recognition",
        "Assessment for cardiogenic shock (Killip classification)",
        "Repeat ECG if initial non-diagnostic but clinical suspicion remains",
        "Right-sided ECG leads (V4R) for inferior STEMI to assess RV involvement",
        "Echocardiography for wall motion abnormalities and EF assessment",
      ],
      redFlags: [
        "Door-to-balloon time > 90 minutes without documented justification",
        "STEMI on ECG without immediate cath lab activation",
        "No aspirin given (or delay > 10 minutes) without documented allergy",
        "Single troponin used to rule out ACS in a patient with ongoing symptoms",
        "Inferior STEMI without right-sided leads obtained",
        "STEMI patient transferred without pre-activation of receiving cath lab",
        "NSTEMI with high-risk features (TIMI >= 5) without admission to monitored bed",
        "Cardiogenic shock not recognized or treated with vasopressors/mechanical support",
        "Beta-blocker given to patient in cardiogenic shock or decompensated HF",
        "Failure to activate cath lab for new LBBB with acute ischemic symptoms",
      ],
      commonDeviations: [
        "Delayed ECG beyond 10-minute benchmark",
        "Cath lab activation delays due to communication failures or off-hours staffing",
        "Failure to recognize STEMI equivalents (de Winter T-waves, Wellens syndrome, posterior MI)",
        "Inadequate antiplatelet loading before PCI",
        "No risk stratification tool documented (TIMI, GRACE, or HEART score)",
        "Delay in transfer decision for patients at non-PCI-capable facilities",
        "Failure to recognize and treat right ventricular infarction appropriately (avoid nitrates, volume-dependent)",
        "Discharge of NSTEMI without stress testing or cardiology follow-up arranged",
      ],
      expertWitnessPoints: [
        "AHA/ACC Guidelines for Management of STEMI (2013, focused update 2015)",
        "AHA/ACC Guidelines for Management of NSTE-ACS (2014)",
        "ACC/AHA Door-to-Balloon Alliance benchmarks",
        "ACEP Clinical Policy on Acute Coronary Syndromes (2018)",
        "Mission: Lifeline program standards",
        "Fourth Universal Definition of Myocardial Infarction (2018)",
      ],
    },
    // SOURCE: guideline | JURISDICTION: universal | LAST VERIFIED: 2026-04
    backPainRedFlags: {
      requiredWorkup: [
        "Complete neurological exam: motor strength (L2-S1 myotomes), sensation (dermatomes), reflexes (patellar L3-4, Achilles S1-2)",
        "Straight leg raise and crossed straight leg raise testing",
        "Assessment for saddle anesthesia, perineal sensation, rectal tone",
        "Post-void residual or bladder scan if urinary symptoms present",
        "Red flag screening documented: fever, weight loss, IV drug use, cancer history, immunosuppression, trauma, anticoagulation, age > 50 with new onset",
        "Emergent MRI for suspected cauda equina, epidural abscess, or cord compression",
        "CT or MRI for trauma patients with neurological deficits",
        "ESR/CRP if infectious or inflammatory etiology suspected",
        "Blood cultures if epidural abscess suspected",
        "Assessment for abdominal aortic aneurysm in patients > 50 with back pain and vascular risk factors",
      ],
      redFlags: [
        "Progressive bilateral neurological deficits without emergent imaging",
        "Bowel or bladder dysfunction in back pain patient without urgent evaluation",
        "IV drug user with back pain and fever without MRI and blood cultures",
        "Known cancer patient with new back pain without imaging for metastatic disease",
        "Saddle anesthesia or perineal numbness not assessed",
        "Severe back pain with fever attributed to musculoskeletal strain without infection workup",
        "Back pain with pulse deficit or hemodynamic instability without vascular assessment",
        "Thoracic back pain dismissed without considering thoracic disc, aneurysm, or visceral causes",
        "Immunocompromised patient with back pain discharged without imaging",
        "Anticoagulated patient with acute back pain without epidural hematoma consideration",
      ],
      commonDeviations: [
        "Incomplete neurological exam (documenting only 'neuro intact' without specifics)",
        "Failure to perform rectal exam when cauda equina is in the differential",
        "Premature diagnosis of musculoskeletal back pain without red flag screening",
        "Discharging patients with unilateral foot drop without urgent MRI and neurosurgery referral",
        "Not checking post-void residual when patient reports urinary difficulty",
        "Anchoring on prior back pain history and missing new pathology",
        "Attributing thoracic back pain to MSK without considering pulmonary, cardiac, or aortic causes",
        "Failure to reassess patient after pain medication — improvement does not exclude serious pathology",
        "No return precautions specific to neurological warning signs",
      ],
      expertWitnessPoints: [
        "AANS/CNS Guidelines on cauda equina syndrome",
        "ACEP Clinical Policy: Critical Issues in Evaluation of Adult Patients with Non-traumatic Back Pain",
        "ACR Appropriateness Criteria for Low Back Pain",
        "NICE Guidelines: Low Back Pain and Sciatica (NG59)",
        "IDSA Guidelines for Diagnosis and Management of Vertebral Osteomyelitis and Spinal Epidural Abscess",
      ],
    },
    // SOURCE: guideline + facility-dependent | JURISDICTION: federal (CMS/TJC) + facility | LAST VERIFIED: 2026-04
    medicationErrors: {
      requiredWorkup: [
        "Medication reconciliation documented at admission and discharge",
        "Allergy history verified and prominently documented in chart",
        "Weight-based dosing calculation documented for pediatric and weight-dependent medications",
        "Renal function checked before nephrotoxic or renally-cleared medications",
        "Hepatic function checked before hepatically-metabolized medications",
        "Drug-drug interaction screening performed and documented",
        "High-alert medication double-check process followed (insulin, heparin, opioids, chemotherapy, paralytics)",
        "Independent double-check for high-alert IV drips (two-nurse verification)",
        "Patient identity verification (two identifiers) before medication administration",
        "Verbal/telephone order read-back documented",
      ],
      redFlags: [
        "Wrong drug administered (name confusion: hydromorphone/morphine, metoprolol/methotrexate)",
        "10x dosing error (decimal point errors, especially pediatric dosing)",
        "Medication given despite documented allergy",
        "No weight documented for weight-based dosing",
        "Paralytic agent administered without sedation and ventilation",
        "Anticoagulant overdose without INR/aPTT monitoring",
        "Insulin dose without glucose monitoring protocol",
        "Known drug interaction not addressed (warfarin + fluoroquinolone, methotrexate + trimethoprim)",
        "Potassium chloride IV push (never appropriate — always dilute and infuse)",
        "Wrong route of administration (intrathecal vincristine = universally fatal)",
        "Medication administered to wrong patient",
        "Discharge without reconciling pre-admission medications",
      ],
      commonDeviations: [
        "Failure to adjust doses for renal insufficiency (especially vancomycin, gentamicin, enoxaparin)",
        "No monitoring after high-alert medication administration",
        "Verbal orders not documented or read back",
        "Pre-printed order sets used without patient-specific modification",
        "Failure to check drug levels when indicated (vancomycin trough, digoxin, phenytoin)",
        "Inadequate pain reassessment after opioid administration",
        "Failure to hold or adjust anticoagulation for procedures",
        "No allergy band or allergy field incomplete in EHR",
        "Nurse-to-nurse handoff not including active drip rates and recent medication timing",
        "Discharge prescriptions conflicting with inpatient medication changes",
      ],
      expertWitnessPoints: [
        "ISMP (Institute for Safe Medication Practices) High-Alert Medications List",
        "Joint Commission National Patient Safety Goals (NPSG) — medication safety",
        "ISMP Guidelines for Standard Order Sets",
        "FDA MedWatch safety reporting data on implicated medications",
        "AHRQ Patient Safety Network — Medication Errors",
        "CMS Conditions of Participation — Pharmaceutical Services",
      ],
    },
    // SOURCE: guideline + facility-dependent | JURISDICTION: federal (CMS/TJC) + facility | LAST VERIFIED: 2026-04
    fallsInED: {
      requiredWorkup: [
        "Fall risk assessment on arrival (Morse Fall Scale or equivalent)",
        "Reassessment after sedation, opioid administration, or change in mental status",
        "Non-skid footwear provided and documented",
        "Bed in lowest position, side rails up when appropriate",
        "Call bell within reach and patient instructed on use",
        "Continuous observation or 1:1 sitter for high-risk patients",
        "Post-fall neurological assessment and imaging as indicated",
        "Post-fall vital signs and injury assessment documented",
        "Incident report filed for any fall event",
        "Restraint assessment and alternatives documented before restraint use",
      ],
      redFlags: [
        "No fall risk assessment documented for elderly, sedated, or altered patients",
        "Fall from stretcher in patient who received sedating medications without precautions",
        "Restraints applied without physician order or without documented reassessment",
        "Anticoagulated patient fall without CT head and coagulation studies",
        "No post-fall neurological checks for patient with head strike",
        "Patient found on floor with no documentation of preceding assessment",
        "Side rails not addressed in documentation for confused or sedated patients",
        "Fall in patient left unattended on a procedure table or during transport",
      ],
      commonDeviations: [
        "Fall risk assessment done but not acted upon (risk identified, no interventions documented)",
        "Failure to reassess fall risk after administering sedating medications",
        "Restraint documentation incomplete — missing time checks, circulation checks, release attempts",
        "Sitter ordered but not available, and no alternative precautions implemented",
        "Bed alarm not activated for patients at risk",
        "No standard fall prevention protocol in the department",
        "Post-fall assessment delayed or incomplete",
        "Staff not trained on proper restraint application and monitoring",
      ],
      expertWitnessPoints: [
        "Joint Commission National Patient Safety Goals (Falls Prevention)",
        "CMS Conditions of Participation — Restraint and Seclusion",
        "AHRQ Fall Prevention Toolkit (Preventing Falls in Hospitals)",
        "ANA Position Statement on Reduction of Patient Restraint",
        "State-specific restraint regulations and reporting requirements",
      ],
    },
    // SOURCE: guideline + hard-law (involuntary holds) | JURISDICTION: state-specific (hold statutes) + universal | LAST VERIFIED: 2026-04
    psychiatricEmergencies: {
      requiredWorkup: [
        "Suicide risk assessment using validated tool (Columbia Suicide Severity Rating Scale — C-SSRS, PHQ-9 Item 9, ASQ)",
        "Medical clearance: vital signs, glucose, mental status exam, toxicology screen, pregnancy test if applicable",
        "Assessment for organic causes of psychiatric symptoms (infection, metabolic, endocrine, neurological, toxic)",
        "Collateral history obtained from family/friends/EMS when possible",
        "Safety assessment: access to lethal means (firearms, medications), plan specificity, prior attempts",
        "1:1 observation for actively suicidal or homicidal patients",
        "Search for weapons or harmful objects, belongings secured",
        "Involuntary hold documentation per state statute (5150, Baker Act, etc.)",
        "Psychiatric consultation or crisis team evaluation",
        "Safe disposition plan: inpatient psychiatric admission, crisis stabilization unit, or safe discharge with crisis plan",
        "Medication reconciliation including psychiatric medications (abrupt SSRI/benzo discontinuation assessment)",
      ],
      redFlags: [
        "Suicidal patient discharged without documented safety assessment and plan",
        "No 1:1 observation for patient expressing active suicidal ideation with plan",
        "Medical clearance not performed before psychiatric evaluation",
        "Patient with altered mental status attributed solely to psychiatric illness without organic workup",
        "Involuntary hold not initiated for patient meeting criteria (imminent danger to self or others)",
        "Patient with prior suicide attempt and current ideation discharged home without psychiatry evaluation",
        "No lethal means assessment documented",
        "Patient left ED against medical advice without psychiatry assessment when on hold",
        "Seclusion or restraint without documented de-escalation attempts",
        "Intoxicated patient discharged before sober re-evaluation of mental status",
      ],
      commonDeviations: [
        "Abbreviated or absent suicide risk assessment (documenting only 'denies SI' without structured assessment)",
        "Failure to obtain collateral information from family or outpatient providers",
        "Prolonged ED boarding of psychiatric patients without reassessment",
        "Inadequate medical clearance (no vitals, no glucose, no basic labs)",
        "Premature discharge of suicidal patient because they 'contracted for safety' (safety contracts have no evidence base)",
        "Failure to assess for and document access to firearms",
        "No crisis safety plan created for patients discharged with passive suicidal ideation",
        "Medications with lethal overdose potential prescribed at discharge without limiting quantity",
        "No communication with outpatient mental health provider at discharge",
        "Chemical restraint (intramuscular medication) without monitoring vitals and airway adequacy",
      ],
      expertWitnessPoints: [
        "The Joint Commission Sentinel Event Alert #56: Detecting and Treating Suicide Ideation in All Settings",
        "APA Practice Guidelines for Assessment and Treatment of Suicidal Behaviors",
        "ACEP Clinical Policy: Critical Issues in Diagnosis and Management of Adult Psychiatric Patients in the ED",
        "Columbia Suicide Severity Rating Scale (C-SSRS) validation studies",
        "CMS Conditions of Participation — Patients' Rights (restraint and seclusion requirements)",
        "State-specific involuntary hold statutes and procedures",
        "SAMHSA National Strategy for Suicide Prevention",
      ],
    },
    // SOURCE: guideline + facility-dependent | JURISDICTION: universal | LAST VERIFIED: 2026-04
    proceduralComplications: {
      requiredWorkup: [
        "Informed consent documented: risks, benefits, alternatives, and patient questions addressed",
        "Pre-procedure timeout: correct patient, correct procedure, correct site, correct laterality",
        "Conscious sedation: pre-sedation assessment (ASA class, airway evaluation, fasting status)",
        "Continuous monitoring during sedation: pulse oximetry, capnography, cardiac monitor, BP at minimum every 5 minutes",
        "Dedicated sedation provider (not performing the procedure) for moderate-to-deep sedation",
        "Resuscitation equipment at bedside: suction, bag-valve-mask, intubation equipment, reversal agents",
        "Post-procedure monitoring until patient meets discharge criteria (Aldrete score or equivalent)",
        "Central line placement: ultrasound guidance documented, sterile technique with full barrier precautions, post-procedure chest X-ray",
        "Intubation: pre-oxygenation, plan A/B/C documented, confirmation by ETCO2 (gold standard), post-intubation imaging",
        "Chest tube: imaging confirmation of placement, monitoring for complications (bleeding, re-expansion pulmonary edema)",
        "Procedural note: indication, consent, technique, complications, specimens, and disposition",
      ],
      redFlags: [
        "No informed consent documented for elective procedure",
        "Conscious sedation without continuous capnography or pulse oximetry",
        "Single operator performing both sedation and procedure for moderate/deep sedation",
        "Central line placed without ultrasound guidance (unless emergent)",
        "No post-procedure chest X-ray after central line or chest tube placement",
        "ETT confirmation by auscultation alone without ETCO2",
        "Procedural sedation in unfasted patient for non-emergent procedure without risk documentation",
        "No timeout documented before procedure",
        "Retained foreign body (sponge, wire, catheter fragment) not discovered",
        "Nerve block without documented neurovascular assessment before and after",
        "Deep sedation achieved without airway-trained provider and reversal agents present",
      ],
      commonDeviations: [
        "Consent obtained but risks/alternatives not specifically documented",
        "Sedation depth exceeding intended level without appropriate monitoring escalation",
        "Post-sedation discharge before meeting objective criteria (patient walking, alert, tolerating PO)",
        "Central line complications (pneumothorax, arterial puncture) not recognized promptly",
        "Failure to use ultrasound for peripheral IV access in difficult-access patients (increases complications, delays care)",
        "Incomplete procedural note — missing complication documentation or patient tolerance",
        "No documentation of sterile technique compliance for central lines",
        "Inadequate post-procedure pain management plan",
        "Failure to document failed attempts and escalation to more experienced provider",
        "Lumbar puncture performed without documenting opening pressure when indicated",
        "Chest tube removed without clamping trial or post-removal imaging",
      ],
      expertWitnessPoints: [
        "ASA Practice Guidelines for Sedation and Analgesia by Non-Anesthesiologists (2018)",
        "ACEP Clinical Policy on Procedural Sedation and Analgesia in the ED",
        "Society of Hospital Medicine — Central Line Bundle compliance",
        "CDC Guidelines for Prevention of Intravascular Catheter-Related Infections",
        "ACS Statement on Use of Checklists (Surgical Safety Checklist / WHO model)",
        "Difficult Airway Society Guidelines for Unanticipated Difficult Intubation",
        "EAST Practice Management Guidelines — Tube Thoracostomy",
        "AHRQ Toolkit for Preventing Central Line-Associated Bloodstream Infections",
      ],
    },
  },

  // SOURCE: hard-law | JURISDICTION: federal | LAST VERIFIED: 2026-04
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

  // SOURCE: guideline + facility-dependent | JURISDICTION: federal (CMS) + facility | LAST VERIFIED: 2026-04
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

  // SOURCE: expert-heuristic | JURISDICTION: universal | LAST VERIFIED: 2026-04
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
  acuteMI: [
    "stemi", "nstemi", "st elevation", "door-to-balloon", "cath lab",
    "percutaneous coronary", "pci", "fibrinolysis", "killip",
    "cardiogenic shock", "right ventricular", "rv infarct", "de winter",
    "wellens", "posterior mi", "acute mi", "myocardial infarction",
    "left bundle branch", "lbbb", "cardiac catheterization",
  ],
  backPainRedFlags: [
    "back pain red flag", "epidural abscess", "spinal infection",
    "vertebral osteomyelitis", "discitis", "iv drug use back pain",
    "cancer back pain", "metastatic spine", "spinal cord compression",
    "foot drop", "thoracic back pain", "myelopathy", "cord compression",
    "epidural hematoma", "anticoagulation back pain",
  ],
  medicationErrors: [
    "medication error", "wrong drug", "wrong dose", "wrong medication",
    "drug allergy", "allergic reaction", "anaphylaxis", "dosing error",
    "high alert medication", "insulin error", "heparin error",
    "overdose", "drug interaction", "renal dosing", "weight-based dosing",
    "medication reconciliation", "look-alike sound-alike",
    "wrong patient", "wrong route",
  ],
  fallsInED: [
    "fall in ed", "fall from stretcher", "patient fall", "fell in hospital",
    "fall risk", "restraint", "side rails", "sitter", "bed alarm",
    "unwitnessed fall", "fall with injury", "fell off bed",
    "fell off gurney",
  ],
  psychiatricEmergencies: [
    "suicide", "suicidal", "psychiatric emergency", "psych hold",
    "5150", "baker act", "involuntary hold", "self harm",
    "homicidal", "psychosis", "psychiatric evaluation",
    "mental health crisis", "crisis", "suicide risk",
    "overdose", "intentional ingestion", "self-inflicted",
    "psychiatric clearance", "medical clearance psych",
    "seclusion", "chemical restraint",
  ],
  proceduralComplications: [
    "procedural complication", "conscious sedation", "sedation",
    "central line", "intubation", "chest tube", "thoracostomy",
    "lumbar puncture", "nerve block", "procedural sedation",
    "informed consent", "wrong site", "retained foreign body",
    "pneumothorax", "arterial puncture", "esophageal intubation",
    "failed airway", "aspiration during sedation", "timeout",
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

  // Always include legal framework context
  sections.push(`
### Legal Framework — Elements of Malpractice

**Duty:** ${LEGAL_FRAMEWORK.elementsOfMalpractice.duty.description}
Key questions:
${LEGAL_FRAMEWORK.elementsOfMalpractice.duty.keyQuestions.map((q) => `- ${q}`).join("\n")}

**Breach:** ${LEGAL_FRAMEWORK.elementsOfMalpractice.breach.description}
Definition: ${LEGAL_FRAMEWORK.elementsOfMalpractice.breach.standardDefinition}
Key questions:
${LEGAL_FRAMEWORK.elementsOfMalpractice.breach.keyQuestions.map((q) => `- ${q}`).join("\n")}

Standard sources:
${LEGAL_FRAMEWORK.elementsOfMalpractice.breach.standardSources.map((s) => `- ${s}`).join("\n")}

**Causation:** ${LEGAL_FRAMEWORK.elementsOfMalpractice.causation.description}
Types:
${LEGAL_FRAMEWORK.elementsOfMalpractice.causation.types.map((t) => `- ${t}`).join("\n")}

Key questions:
${LEGAL_FRAMEWORK.elementsOfMalpractice.causation.keyQuestions.map((q) => `- ${q}`).join("\n")}

Challenges:
${LEGAL_FRAMEWORK.elementsOfMalpractice.causation.challenges.map((c) => `- ${c}`).join("\n")}

**Damages:**
Economic: ${LEGAL_FRAMEWORK.elementsOfMalpractice.damages.types.economic.map((d) => `${d}`).join(", ")}
Non-economic: ${LEGAL_FRAMEWORK.elementsOfMalpractice.damages.types.nonEconomic.map((d) => `${d}`).join(", ")}
Punitive: ${LEGAL_FRAMEWORK.elementsOfMalpractice.damages.types.punitive}
Note on caps: ${LEGAL_FRAMEWORK.elementsOfMalpractice.damages.capsByState.note}

### Damages Severity Scale
${Object.entries(LEGAL_FRAMEWORK.damagesAssessment.severityScale).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

**Valuation Factors:**
${LEGAL_FRAMEWORK.damagesAssessment.valuationFactors.map((f) => `- ${f}`).join("\n")}

### Expert Witness Requirements
${LEGAL_FRAMEWORK.expertWitness.requirements.map((r) => `- ${r}`).join("\n")}

**Certificate of Merit:** ${LEGAL_FRAMEWORK.expertWitness.certificateOfMerit.description}
States requiring: ${LEGAL_FRAMEWORK.expertWitness.certificateOfMerit.states}

### Hospital Risk Management
**Proactive Review Triggers:**
${LEGAL_FRAMEWORK.hospitalRiskManagement.proactiveReviewTriggers.map((t) => `- ${t}`).join("\n")}

**Root Cause Categories:**
${LEGAL_FRAMEWORK.hospitalRiskManagement.rootCauseCategories.map((c) => `- ${c}`).join("\n")}
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
