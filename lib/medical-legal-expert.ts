// ── Merit-MD Medical-Legal Expert Knowledge Base ──
// Comprehensive medical-legal knowledge for med-mal attorneys and ER physicians.
// SUPPLEMENTS clinical-knowledge.ts — do not duplicate, only extend.
// This is THE moat. Built from the intersection of emergency medicine and litigation.

// ── SECTION 1: ANATOMY OF A MEDICAL CHART ──
// Every chart element, its legal significance, and what plaintiff/defense look for.

export const CHART_ANATOMY = {
  edChart: {
    components: {
      triageNote: {
        contains: [
          "chief complaint",
          "vital signs",
          "ESI acuity level",
          "pain score",
          "allergies",
          "medications",
          "arrival mode",
          "last oral intake",
          "immunization status (pediatrics)",
          "pregnancy status (reproductive age females)",
        ],
        legalSignificance:
          "Establishes the first documented clinical impression. Triage acuity level determines expected response time. Discrepancies between triage assessment and final diagnosis are a common plaintiff argument.",
        redFlags: [
          "Under-triaged patient (ESI 4 who should have been ESI 2)",
          "Vital sign abnormalities not flagged (tachycardia, hypotension, fever)",
          "Chief complaint minimized or reworded from patient's actual words",
          "No reassessment after prolonged wait time",
          "Triage nurse failed to initiate standing orders (e.g., ECG for chest pain)",
          "Pain score inconsistent with chief complaint (10/10 pain but ESI 4)",
          "Arrival by EMS but triaged as low acuity",
          "No allergy documentation before medication administration",
        ],
        esiLevels: {
          1: "Resuscitation — immediate life-saving intervention required. Examples: cardiac arrest, intubation needed, major trauma.",
          2: "Emergent — high risk situation, confused/lethargic/disoriented, or severe pain/distress. Examples: chest pain with cardiac history, stroke symptoms, acute abdomen. Target: seen within 10 minutes.",
          3: "Urgent — requires two or more resources (labs, imaging, IV meds, specialty consult). Stable vitals. Target: seen within 30 minutes.",
          4: "Less urgent — requires one resource. Examples: simple laceration, prescription refill with mild symptoms. Target: seen within 60 minutes.",
          5: "Non-urgent — requires no resources. Examples: medication refill, minor complaint. Target: seen within 120 minutes.",
        },
      },
      nursingNotes: {
        contains: [
          "ongoing assessments",
          "medication administration times",
          "vital sign trends",
          "patient complaints",
          "interventions",
          "communication with providers",
          "fall risk assessment",
          "skin assessment",
          "restraint documentation",
          "patient education",
          "IV access and fluid administration",
        ],
        legalSignificance:
          "Often more granular and time-stamped than physician notes. Nursing documentation frequently contradicts or fills gaps in physician documentation. Plaintiff attorneys love nursing notes because they capture real-time observations the physician may have missed or not documented.",
        redFlags: [
          "Nursing notes documenting patient complaints that physician note doesn't address",
          "Vital sign trends showing deterioration not communicated to physician",
          "Time gaps in nursing documentation (what happened during those hours?)",
          "Nursing notes showing physician notification but no documented physician response",
          "Late entries or amendments (suggests after-the-fact documentation)",
          "Templated assessments that don't match clinical context (e.g., 'patient resting comfortably' while vitals show tachycardia)",
          "Medication administration times that don't align with order times",
          "Nursing concern about patient condition not escalated through chain of command",
          "Pain reassessment not documented after analgesic administration",
          "Fall risk identified but no fall precautions implemented",
        ],
        nursingStandards: [
          "Vital signs at minimum q4h for admitted patients, more frequently for higher acuity",
          "Reassessment within 30 minutes of any intervention (pain medication, fluid bolus, etc.)",
          "Documentation of physician notification for any change in condition",
          "Chain of command escalation when concerns are not addressed by primary physician",
          "Two-patient-identifier verification before medication administration",
          "Skin and fall risk assessment on admission and per protocol",
          "Intake and output documentation for patients on fluid management",
        ],
      },
      physicianNote: {
        components: {
          hpi: "History of Present Illness — the narrative. Legal reviewers look for: completeness of symptom characterization (OPQRST), pertinent negatives documented, risk factors acknowledged. A thorough HPI should address: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Timing. Missing any of these for a high-acuity complaint is a documentation failure.",
          ros: "Review of Systems — must reflect what was actually asked. A templated all-negative ROS in a critically ill patient raises red flags. An overly brief ROS in a patient with multisystem complaints suggests inadequate history-taking. The ROS should have pertinent positives and negatives relevant to the differential diagnosis.",
          physicalExam: "Must be consistent with the clinical picture. A 'normal' cardiac exam in a patient with acute MI is problematic. Examiner should document pertinent positives AND negatives. A focused exam is acceptable for minor complaints, but major presentations require comprehensive exam of relevant systems. Copy-pasted normal exams across different patients are a credibility destroyer at deposition.",
          mdm: "Medical Decision Making — the MOST IMPORTANT section for legal review. This is where the physician documents their thought process. It should include: differential diagnosis considered, what was ruled out and why, risk assessment, data reviewed (labs, imaging, ECGs), consultations obtained, why the disposition was chosen. Weak MDM is the #1 documentation failure in med-mal cases. A good MDM reads like a conversation with a colleague explaining your reasoning.",
          assessmentPlan: "Must address every problem identified. A chief complaint of 'chest pain' with an assessment of 'musculoskeletal pain' needs clear documentation of why cardiac causes were excluded. Each assessment should have a corresponding plan. 'Chest pain — discharge home' without explanation is indefensible.",
          reEvaluation: "Documentation of clinical reassessment after treatment. Did the patient improve? Were vitals rechecked? Was the diagnosis reconsidered in light of test results or clinical trajectory? Absence of re-evaluation documentation before disposition is a major gap.",
        },
        legalSignificance:
          "This is the physician's legal defense document. Every word matters. What ISN'T documented is assumed not to have happened. The physician note is usually written from memory, sometimes hours after the encounter, and may be completed at shift change. Timestamp of note completion vs. time of actual encounter is always scrutinized.",
        templatePitfalls: [
          "All-normal physical exam in a critically ill patient (template not customized)",
          "ROS showing 14 systems reviewed in a patient who presented obtunded",
          "Identical MDM language across multiple patients on same shift",
          "Physical exam findings that are anatomically impossible given the complaint",
          "Auto-populated medication reconciliation not actually reviewed",
          "Chief complaint in note differs from triage chief complaint",
        ],
      },
      orders: {
        contains: [
          "lab orders with timestamps",
          "imaging orders with timestamps",
          "medication orders",
          "consultation requests",
          "disposition orders",
          "nursing orders (monitoring frequency, diet, activity)",
          "restraint orders",
          "blood product orders",
        ],
        legalSignificance:
          "Time-stamped orders create an irrefutable timeline. The gap between order time and result time matters. Orders that were placed but cancelled are discoverable. STAT orders that weren't acted on urgently are problematic.",
        redFlags: [
          "Prolonged time between order and execution",
          "Critical results not acknowledged in documented timeframe",
          "Orders inconsistent with documented clinical concern (chest pain but no troponin ordered)",
          "Cancelled orders without documented reason",
          "STAT orders with non-STAT execution times",
          "Verbal orders not co-signed within required timeframe",
          "Orders placed after results were already available (backdating suspicion)",
          "Antibiotic orders with prolonged time to administration",
          "Imaging ordered but patient discharged before results finalized",
          "Medication orders without weight-based dosing in pediatric patients",
        ],
        criticalTimeMetrics: {
          ecgForChestPain: "Within 10 minutes of arrival",
          antibioticsForSepsis: "Within 1 hour of recognition (ideally within 30 minutes)",
          tpaForStroke: "Door-to-needle < 60 minutes",
          ctForStroke: "Door-to-CT < 25 minutes",
          bloodCulturesBeforeAntibiotics: "Before first dose (but never delay antibiotics for cultures)",
          troponinForChestPain: "On arrival, repeated at 3 hours (high-sensitivity: 0 and 1-3 hours)",
          surgicalConsultForAppendcitis: "Within 60 minutes of diagnosis",
          tetanusForWounds: "Before discharge",
          rhogamForRhNegative: "Within 72 hours of sensitizing event",
        },
      },
      results: {
        legalSignificance:
          "Abnormal results that aren't addressed in the physician note are the strongest evidence of negligence. The 'failure to follow up on results' is a distinct and common cause of action.",
        redFlags: [
          "Abnormal lab values not mentioned in MDM",
          "Critical values without documented physician notification",
          "Imaging reads that conflict with ED physician interpretation",
          "Pending results at time of discharge without follow-up plan",
          "Preliminary radiology read differs from final read (and final read is worse)",
          "Pathology results returned after discharge with no callback documented",
          "Incidental findings on imaging not addressed or communicated to patient",
          "Abnormal EKG findings not acknowledged in physician note",
          "Uptrending inflammatory markers dismissed without further workup",
          "Worsening lab values between initial and repeat draws not addressed",
        ],
        criticalValueProtocols: {
          description: "Critical lab values require immediate physician notification. Most hospitals have a critical value policy with mandatory read-back and documentation.",
          commonCriticalValues: [
            "Potassium < 2.5 or > 6.5 mEq/L",
            "Sodium < 120 or > 160 mEq/L",
            "Glucose < 40 or > 500 mg/dL",
            "Troponin above institutional threshold for MI",
            "INR > 5.0 (or > 4.0 in some institutions)",
            "Hemoglobin < 7.0 g/dL",
            "Platelet count < 50,000 or > 1,000,000",
            "WBC < 2,000 or > 30,000",
            "Blood cultures positive (any organism)",
            "CSF with organisms on gram stain",
            "New pulmonary embolism on CTPA",
            "Intracranial hemorrhage on CT",
            "Tension pneumothorax on imaging",
            "Aortic dissection on CTA",
          ],
        },
      },
      disposition: {
        legalSignificance:
          "The discharge decision is the most legally scrutinized moment. Was the patient stable? Were return precautions adequate and specific? Was follow-up arranged? Was the patient capable of understanding instructions?",
        criticalElements: [
          "Discharge condition documented (stable, improved, etc.)",
          "Specific return precautions (not generic handouts)",
          "Follow-up provider and timeframe specified",
          "Patient verbalized understanding (or interpreter used)",
          "Medications reconciled at discharge",
          "Pending results addressed with callback plan",
          "Work/school note if requested",
          "Prescriptions actually called in or provided (not just listed)",
          "Specialist referral with actual appointment or clear instructions",
          "Transportation addressed (safe to drive? safe home environment?)",
        ],
        dispositionTypes: {
          discharge: "Must document clinical stability, adequate oral intake (if relevant), ability to ambulate, understanding of instructions, safe disposition environment",
          admission: "Must document why admission is needed, anticipated level of care, admitting physician notified and accepts, transfer of care communication",
          transfer: "Must meet EMTALA requirements: stabilized to extent possible, receiving facility accepts, appropriate transport arranged, risks/benefits of transfer documented, medical records sent with patient",
          ama: "Against Medical Advice — must document: decision-making capacity assessed, specific risks communicated (including death if applicable), patient verbalizes understanding, patient informed they can return at any time, attempt to determine and address reason for wanting to leave",
          lwbs: "Left Without Being Seen — document: time of departure if known, attempts to locate patient, triage acuity level at time of departure, notification of attending physician",
          elopement: "Left against medical advice without informing staff — document: when absence noted, search efforts, notification of attending, police if safety concern",
        },
      },
    },
    negativeSpaceAnalysis: {
      description:
        "What's MISSING from the chart is often more important than what's there. A medical-legal expert reviews for absence of expected documentation.",
      commonAbsences: [
        "No documented reassessment after treatment",
        "No repeat vitals before discharge",
        "No documentation of shared decision-making for early discharge",
        "No pain reassessment after analgesics",
        "No documented discussion of risks/benefits of leaving AMA",
        "No documented consideration of dangerous diagnoses on the differential",
        "No explanation for why a test was NOT ordered",
        "No nursing reassessment during prolonged ED stay",
        "No documentation of communication with consultants",
        "No documentation of communication with primary care provider",
        "No documentation that patient received and understood discharge instructions",
        "No documentation of interpreter use for non-English-speaking patients",
        "No documented pregnancy test in reproductive-age female before CT or medications",
        "No documented weight for pediatric medication dosing",
        "No documented reassessment of intoxicated patient to clinical sobriety",
        "No documentation of who accompanied the patient or their involvement in care decisions",
        "No documentation of tetanus status in wound patients",
        "No documentation of anticoagulation status in bleeding patients",
      ],
    },
    timestampAnalysis: {
      description:
        "Every timestamp tells a story. Gaps, inconsistencies, and impossible timelines are litigation gold.",
      keyTimestamps: [
        "Arrival to triage time",
        "Triage to physician evaluation time",
        "Time of critical orders (labs, imaging)",
        "Time results available vs time results reviewed",
        "Time of disposition decision",
        "Total ED length of stay",
        "Time of critical interventions (antibiotics, tPA, etc.)",
        "Time between physician note entry and actual encounter",
        "Time between nursing assessments",
        "Time from consultation request to consultant response",
        "Time from abnormal result to documented acknowledgment",
      ],
      suspiciousPatterns: [
        "Physician note documented at shift change (suggests delayed documentation)",
        "Identical timestamps on multiple chart elements (copy-forward or template)",
        "Results available hours before documented physician review",
        "Very short physician evaluation time for complex patient",
        "Addendums or late entries (what prompted the addition?)",
        "Note completed after malpractice claim filed (spoliation concern)",
        "Timestamps showing physician documentation during a procedure they were performing",
        "Nursing vital signs documented at exact hourly intervals (suggests estimation, not measurement)",
        "Medication administration time logged before the medication was dispensed from pharmacy",
        "Discharge instructions signed before physician note completed",
      ],
    },
  },

  surgicalChart: {
    components: {
      preOpAssessment: {
        required: [
          "History and physical within 30 days (updated within 24h of surgery)",
          "Informed consent with specific risks discussed",
          "Surgical site marking (per Universal Protocol)",
          "Pre-op verification checklist completed",
          "Anesthesia pre-op evaluation",
          "Relevant imaging and labs reviewed and documented",
          "Antibiotic prophylaxis timing documented",
          "VTE prophylaxis plan documented",
          "NPO status verified",
          "Type and screen or crossmatch if applicable",
          "Allergies verified and displayed",
          "Prior anesthesia history reviewed (family history of MH)",
        ],
        legalSignificance:
          "Informed consent failures are among the most common surgical malpractice claims. The consent must document specific risks of the procedure, alternatives discussed, and that the patient had opportunity to ask questions. A signed consent form alone is not sufficient — the chart must reflect a meaningful consent discussion.",
        informedConsentElements: [
          "Nature of the procedure explained in lay terms",
          "Specific risks of this procedure (not generic surgical risks)",
          "Benefits and expected outcomes",
          "Alternatives to the procedure (including no treatment)",
          "Risks of alternatives and no treatment",
          "Patient's questions addressed",
          "Patient demonstrates understanding (or interpreter used)",
          "Signed by patient (or legal surrogate with documented authority)",
          "Signed by surgeon who will perform the procedure (not a resident, not a nurse)",
          "Date and time of consent conversation documented",
        ],
      },
      operativeReport: {
        required: [
          "Pre-op and post-op diagnosis",
          "Procedure performed (with laterality)",
          "Surgeon and assistants named",
          "Anesthesia type",
          "Findings described in detail",
          "Specimens sent to pathology",
          "Estimated blood loss",
          "Complications noted (or explicitly 'no complications')",
          "Drains, implants, or foreign materials documented",
          "Sponge/instrument/needle counts verified correct",
          "Condition of patient at end of procedure",
          "Disposition from OR (PACU, ICU, floor)",
        ],
        legalSignificance:
          "The operative report is the definitive legal document for what happened during surgery. It must be dictated promptly (ideally within 24h). Late dictation raises questions about accuracy. Inconsistencies between the op report and anesthesia record regarding timing of events are a significant red flag.",
        redFlags: [
          "Op report dictated days or weeks after surgery",
          "Vague description of findings or technique",
          "No mention of complications that are documented in anesthesia or nursing records",
          "EBL of 'minimal' when blood products were ordered",
          "Discrepancy between op report and pathology findings",
          "Count discrepancy noted but resolved without imaging",
          "No documentation of laterality verification (Universal Protocol)",
          "Attending listed as surgeon but operative details suggest resident performed",
        ],
      },
      anesthesiaRecord: {
        legalSignificance:
          "Provides minute-by-minute vital signs during surgery. Discrepancies between the anesthesia record and the op report regarding timing of events are a significant red flag. Periods of hypotension, hypoxia, or hemodynamic instability must be correlated with surgical events.",
        criticalElements: [
          "Pre-induction vital signs and airway assessment",
          "Induction medications and times",
          "Airway management details (grade of view, number of attempts)",
          "Hemodynamic trends throughout the procedure",
          "Fluid administration and blood product use",
          "Vasopressor or inotrope administration",
          "Temperature monitoring",
          "Emergence and extubation details",
          "Total anesthesia time vs surgical time",
        ],
        redFlags: [
          "Periods of hypotension not explained by surgical events",
          "Hypoxia episodes not correlated with airway management documentation",
          "Gaps in vital sign recording during critical portions of surgery",
          "Multiple intubation attempts not documented in anesthesia note",
          "Awareness complaints post-operatively not addressed in chart",
          "Positioning not documented (nerve injury cases)",
        ],
      },
      postOpCare: {
        required: [
          "Post-op orders with monitoring frequency specified",
          "Post-op assessment within defined timeframe",
          "Pain management plan",
          "DVT prophylaxis continued",
          "Wound care instructions",
          "Activity restrictions",
          "Return precautions specific to the procedure",
          "Follow-up scheduled",
          "Diet advancement protocol",
          "Drain management orders",
          "Antibiotic continuation if indicated",
        ],
        legalSignificance:
          "Failure to rescue — not recognizing post-operative complications — is a major source of surgical malpractice claims. Nursing monitoring frequency, vital sign documentation, and escalation of concerns are critical. The surgeon's post-op assessment timing and thoroughness are heavily scrutinized.",
        failureToRescueIndicators: [
          "Progressive tachycardia not investigated",
          "Increasing pain out of proportion not evaluated for compartment syndrome or anastomotic leak",
          "Fever on POD 3-5 not worked up (surgical site infection, anastomotic leak, PE)",
          "Decreasing urine output not addressed",
          "Nursing concerns documented but not escalated",
          "Rapid Response or code called — were warning signs present earlier?",
          "Return to OR delayed despite signs of surgical complication",
          "Hematocrit drop without repeat or investigation",
        ],
      },
    },
  },

  inpatientChart: {
    components: {
      admissionNote: {
        legalSignificance: "Establishes the initial assessment, differential, and plan of care for the hospitalization. Discrepancies between the ED note and admission note about the patient's condition raise questions about communication at handoff.",
        required: [
          "Reason for admission",
          "Complete H&P or reference to ED note with updates",
          "Admission diagnoses with differential",
          "Plan for each diagnosis",
          "Code status discussed and documented",
          "DVT prophylaxis ordered",
          "Medication reconciliation completed",
          "Communication with primary care provider",
        ],
      },
      progressNotes: {
        legalSignificance: "Daily progress notes should reflect active management. Notes that are copy-forwarded without meaningful updates suggest lack of engagement. Absence of progress notes on weekends or holidays is problematic for deteriorating patients.",
        redFlags: [
          "Identical progress notes day after day (copy-forward)",
          "No weekend or holiday notes during clinical changes",
          "Notes that don't address nursing or ancillary staff concerns",
          "No documented response to abnormal results",
          "Consultations requested but not followed up",
          "Escalation in level of care not reflected in notes",
        ],
      },
      dischargeSum: {
        required: [
          "Principal and secondary diagnoses",
          "Procedures performed during hospitalization",
          "Hospital course summarized",
          "Condition at discharge",
          "Discharge medications with changes from admission noted",
          "Follow-up appointments scheduled",
          "Pending tests and results with responsible follow-up provider",
          "Patient and family education documented",
          "Diet, activity, and wound care instructions",
        ],
        legalSignificance: "The discharge summary is often the only document the PCP receives. Incomplete or delayed discharge summaries contribute to post-discharge adverse events. Pending results not communicated are a significant liability.",
      },
    },
  },
} as const;

// ── SECTION 2: PROSECUTION AND DEFENSE PLAYBOOKS ──
// Strategic knowledge for both sides of medical malpractice litigation.

export const PROSECUTION_PLAYBOOK = {
  caseScreening: {
    initialAssessment: [
      "Is there a clear deviation from standard of care?",
      "Did the patient suffer significant damages (death, permanent injury, substantial economic loss)?",
      "Is causation provable — would proper care have likely prevented the harm?",
      "Is the statute of limitations satisfied?",
      "Is the venue favorable (plaintiff-friendly jurisdiction)?",
      "Are there collectible defendants (insured physicians, hospital system)?",
      "Is the case economically viable (damages must justify litigation costs of $50K-$500K+)?",
      "Is there a credible expert witness available in the relevant specialty?",
      "Will the medical records survive scrutiny (no evidence of tampering)?",
      "Is the patient/family a sympathetic plaintiff?",
    ],
    casesNOTWorthTaking: [
      "Minor injuries even with clear negligence (damages too low to justify costs)",
      "Bad outcome without clear deviation (medicine has inherent risks — bad outcome does not equal malpractice)",
      "Sympathetic defendant (kind physician who made an honest mistake in impossible circumstances)",
      "Contributory negligence by patient (non-compliance, substance abuse, leaving AMA)",
      "Statute of limitations expired with no tolling argument",
      "Expert witnesses won't support the claim (if you can't find an expert, drop the case)",
      "Extremely complex causation (multiple comorbidities, unclear whether earlier intervention would have changed outcome)",
      "Small damages in a state with Certificate of Merit requirement (cost of expert opinion exceeds likely recovery)",
      "Patient with significant credibility issues (extensive litigation history, inconsistent statements)",
      "Cases where the physician clearly documented their reasoning, even if the outcome was poor",
    ],
    discoveryStrategy: {
      recordsToRequest: [
        "Complete hospital medical record (not just the summary — specify electronic and paper)",
        "EMS/ambulance run records (often separate from hospital record)",
        "Triage records and nursing flow sheets",
        "All diagnostic imaging with radiologist reports (preliminary AND final)",
        "Laboratory results with timestamps (including pending results at discharge)",
        "Pharmacy records (medication administration times, dispensing records)",
        "Transfer records and communication logs",
        "Prior medical records from other facilities (establishes baseline)",
        "Hospital policies and protocols relevant to the condition (often the most damning evidence)",
        "Staffing records for the relevant time period (nurse-to-patient ratios, physician coverage)",
        "Equipment maintenance records (if equipment failure alleged)",
        "Peer review and quality assurance records (may be privileged — fight for them, argue not peer review but business records)",
        "Incident reports (often discoverable despite hospital claims of privilege — varies by state)",
        "Billing records (show what was coded vs what was documented — discrepancies are illuminating)",
        "Electronic health record audit trail (who accessed the chart, when, what was modified)",
        "Communication records (secure messaging, pages, phone logs between providers)",
        "Credentialing files of involved physicians (training, prior complaints, restrictions)",
        "Similar incident history (prior similar events at the facility — pattern evidence)",
        "Risk management files related to the event",
        "National Practitioner Data Bank query results (prior malpractice history)",
      ],
      depositionsToTake: [
        "Treating physician(s) — focus on documentation gaps and decision-making rationale",
        "Triage nurse — establish initial presentation, acuity determination, and what patient actually said",
        "Primary nurse — document what was observed vs documented, communications with physician",
        "Consulting physicians — establish communication, recommendations, and whether they were followed",
        "Charge nurse / supervisor — establish staffing, system issues, and chain of command escalation",
        "Hospital risk manager — may reveal prior similar incidents and system problems",
        "Medical records custodian — establish completeness, amendments, and audit trail",
        "Radiology technician — establish timing of studies and any re-takes",
        "Pharmacist — establish medication dispensing times and any flagged interactions",
        "EMS crew — establish pre-hospital condition and field impressions",
        "Residents/trainees involved — establish supervision and attending involvement",
        "Quality/safety officer — establish whether protocols were in place and followed",
      ],
      depositionTechniques: [
        "Start with open-ended questions to let the witness talk (they often reveal more than they intend)",
        "Use the chart as a guide but ask about what's NOT in the chart",
        "Ask about routine practice ('What do you usually do when...') then compare to what was actually done",
        "Pin down the standard of care before showing the deviation",
        "Use hospital's own protocols against them — 'Is this your hospital's policy? Was it followed?'",
        "Ask about training on the specific condition — establishes they should have known better",
        "Explore time pressures, staffing, and fatigue — humanizes the error but establishes system failure",
        "Get the physician to agree with basic clinical principles before showing they didn't follow them",
        "Never ask a question you don't know the answer to (in deposition, unlike trial)",
        "Save the knockout punch for trial — deposition is for locking in testimony",
      ],
    },
    expertWitnessSelection: {
      criteria: [
        "Board certified in the same specialty as the defendant",
        "Active clinical practice (not retired, not purely academic)",
        "Practices in a similar clinical setting (community ED vs academic center)",
        "Credible publication history (but not a professional witness)",
        "Testifies for both plaintiffs and defendants (credibility)",
        "No more than 20% of income from expert witness work",
        "No prior disciplinary actions or malpractice history",
        "Compelling communicator who can explain medicine to laypeople",
      ],
      pitfalls: [
        "Professional witness who testifies 100+ times per year (credibility destroyed on cross)",
        "Expert from a different specialty opining on standard of care",
        "Expert from academic ivory tower who has never worked in a community ED",
        "Expert with prior inconsistent opinions in other cases",
        "Expert who has been excluded by a court in prior litigation (Daubert challenge)",
        "Expert who is personally acquainted with the defendant or plaintiff",
      ],
    },
  },

  plaintiffTheoriesBySpecialty: {
    emergencyMedicine: [
      {
        theory: "Failure to diagnose MI/ACS",
        frequency: "Most common EM claim",
        approach: "Serial troponin protocol violation, premature discharge, inadequate risk stratification. Challenge: was HEART score calculated? Were serial troponins obtained? Was risk stratification documented?",
        keyEvidence: ["Troponin timing and values", "ECG interpretation", "HEART score documentation", "Discharge timing relative to troponin results"],
      },
      {
        theory: "Failure to diagnose stroke",
        frequency: "Second most common, highest average verdict",
        approach: "Delayed tPA, missed NIHSS, symptoms attributed to other causes. Key time windows: tPA within 4.5h, thrombectomy within 24h for select patients.",
        keyEvidence: ["Last known well time", "NIHSS score", "Door-to-CT time", "Door-to-needle time", "Stroke team activation time"],
      },
      {
        theory: "Failure to diagnose PE",
        frequency: "High severity claims, often fatal",
        approach: "Wells/PERC criteria not applied, D-dimer not ordered, CTPA delayed. Focus on risk stratification and whether PE was on the differential.",
        keyEvidence: ["Wells score documentation", "D-dimer timing", "CTPA timing", "Anticoagulation timing", "Risk factor documentation"],
      },
      {
        theory: "Missed fractures",
        frequency: "High volume, lower severity per case",
        approach: "Inadequate imaging, failure to compare with prior studies, missed subtle findings. Scaphoid, posterior malleolus, and C-spine injuries most commonly missed.",
        keyEvidence: ["Imaging obtained", "Comparison with prior studies", "Radiology read vs ED read", "Follow-up imaging results"],
      },
      {
        theory: "Failure to diagnose sepsis",
        frequency: "Increasing frequency, CMS scrutiny",
        approach: "SEP-1 bundle non-compliance, delayed antibiotics, lactate not ordered. CMS bundles create a quasi-regulatory standard of care.",
        keyEvidence: ["Time to antibiotics", "Lactate ordered and timing", "Blood cultures before antibiotics", "Fluid resuscitation volume and timing", "SEP-1 bundle compliance"],
      },
      {
        theory: "Failure to diagnose appendicitis",
        frequency: "Common, especially in women and elderly",
        approach: "Premature diagnosis of gastroenteritis, no CT in appropriate patients. Atypical presentations in elderly, pregnant, and immunocompromised patients are the danger zone.",
        keyEvidence: ["CT obtained", "WBC and differential", "Surgical consultation timing", "Serial abdominal exams", "Return visit data"],
      },
      {
        theory: "Failure to diagnose ectopic pregnancy",
        frequency: "High severity — hemorrhage and death",
        approach: "Pregnancy test not ordered in reproductive-age female, quantitative hCG not trended, ultrasound delayed. Any reproductive-age female with abdominal pain, vaginal bleeding, or syncope needs a pregnancy test.",
        keyEvidence: ["Pregnancy test ordered", "Quantitative hCG value and trending", "Ultrasound timing and findings", "Rh status documented", "OB consultation timing"],
      },
      {
        theory: "Failure to diagnose meningitis",
        frequency: "Catastrophic outcomes when missed",
        approach: "LP not performed, antibiotics delayed, symptoms attributed to viral illness. The classic triad (fever, neck stiffness, AMS) is present in only 44% of cases.",
        keyEvidence: ["LP performed and timing", "Antibiotic timing", "CT before LP if indicated", "Blood cultures", "Jolt accentuation or Kernig/Brudzinski documented"],
      },
      {
        theory: "EMTALA violations",
        frequency: "Growing area of litigation",
        approach: "Inadequate medical screening examination, transfer without stabilization, financial motivation for transfer. Applies to all patients regardless of ability to pay.",
        keyEvidence: ["Screening exam documentation", "Transfer documentation and consent", "Stabilization before transfer", "Receiving facility acceptance", "Financial screening timing relative to medical screening"],
      },
      {
        theory: "Medication errors",
        frequency: "Preventable harm — strong plaintiff cases",
        approach: "Wrong drug, wrong dose, failure to check allergies, weight-based dosing errors in pediatrics. Electronic prescribing has reduced but not eliminated these errors.",
        keyEvidence: ["Allergy documentation", "Weight documentation (pediatrics)", "Pharmacy verification records", "Adverse reaction documentation", "Medication reconciliation"],
      },
      {
        theory: "Procedural complications",
        frequency: "Moderate frequency",
        approach: "Inadequate informed consent, technique errors, failure to recognize complications. Consent must document specific risks of the specific procedure.",
        keyEvidence: ["Informed consent documentation", "Procedural note details", "Complication recognition timing", "Supervision documentation for trainees"],
      },
      {
        theory: "Failure to act on critical results",
        frequency: "Highly favorable for plaintiff",
        approach: "Documented abnormal result with no documented response. The electronic health record timestamp proves when the result was available. If the physician didn't act, the chart speaks for itself.",
        keyEvidence: ["Result timestamp", "Physician acknowledgment timestamp", "Documentation of response to result", "Discharge timing relative to result availability"],
      },
      {
        theory: "Inadequate discharge instructions",
        frequency: "Moderate — but strengthens other claims",
        approach: "Generic instructions, no specific return precautions, no follow-up arranged. Strongest when combined with a missed diagnosis — patient didn't know what to watch for.",
        keyEvidence: ["Discharge instruction specificity", "Return precaution documentation", "Follow-up arrangements", "Patient comprehension documented", "Language barrier addressed"],
      },
      {
        theory: "Delayed treatment due to ED crowding",
        frequency: "Growing — system liability",
        approach: "Prolonged wait times, boarding delays, inadequate reassessment. The hospital has a duty to provide adequate staffing and resources.",
        keyEvidence: ["Wait times", "Staffing levels", "Boarding times", "Reassessment frequency during delays", "Diversion or overcapacity documentation"],
      },
      {
        theory: "Failure to diagnose aortic emergency",
        frequency: "High severity — often fatal",
        approach: "Aortic dissection/AAA missed, chest pain attributed to other causes. The 'classic' presentation of tearing pain to the back is present in only 50% of cases.",
        keyEvidence: ["Chest X-ray findings", "Blood pressure differential between arms", "CT angiography timing", "D-dimer (if used for screening)", "Surgical consultation timing"],
      },
      {
        theory: "Missed testicular torsion",
        frequency: "Young males — time-sensitive",
        approach: "No ultrasound ordered, symptoms attributed to epididymitis. Salvage rate drops dramatically after 6 hours. Under age 25, torsion should be the presumed diagnosis until proven otherwise.",
        keyEvidence: ["Ultrasound with Doppler timing", "Urology consultation timing", "Time from symptom onset to OR", "Cremasteric reflex documentation", "Testicular salvage or orchiectomy outcome"],
      },
      {
        theory: "Missed compartment syndrome",
        frequency: "Orthopedic — devastating outcomes",
        approach: "No serial neurovascular exams, delayed fasciotomy. Pain out of proportion, pain with passive stretch, and tight compartment are early signs. Late signs (pulselessness, paralysis) mean irreversible damage.",
        keyEvidence: ["Serial neurovascular exam documentation", "Compartment pressure measurements", "Time to fasciotomy", "Orthopedic consultation timing", "Functional outcome"],
      },
      {
        theory: "Failure to diagnose cauda equina syndrome",
        frequency: "Catastrophic — permanent incontinence and weakness",
        approach: "Back pain red flags ignored, no MRI, delayed surgical consultation. Any combination of bowel/bladder dysfunction, saddle anesthesia, or bilateral leg weakness requires emergent MRI.",
        keyEvidence: ["Red flag documentation", "MRI timing", "Neurosurgery/spine consultation timing", "Rectal exam documented", "Post-void residual measured", "Time to surgical decompression"],
      },
      {
        theory: "Pediatric fever mismanagement",
        frequency: "Neonatal cases highest severity",
        approach: "Under-investigation of febrile neonates, missed bacterial infections. Neonates (0-28 days) with fever require full sepsis workup including LP. Infants 29-60 days require risk stratification per current guidelines.",
        keyEvidence: ["Age-appropriate workup performed", "LP performed in neonates", "Antibiotic timing", "Rochester/Philadelphia/Boston criteria applied", "Follow-up arranged for well-appearing febrile infants"],
      },
      {
        theory: "Psychiatric patient medical clearance failures",
        frequency: "Growing area of litigation",
        approach: "Medical conditions missed in psychiatric patients, inadequate workup attributed to psychiatric diagnosis. Altered mental status should be medical until proven otherwise.",
        keyEvidence: ["Medical workup performed", "Vital signs normalized", "Toxicology screening", "Metabolic panel reviewed", "Physical exam documented (not just 'medical clearance')"],
      },
    ],
    surgery: [
      {
        theory: "Wrong-site surgery",
        frequency: "Sentinel event — near-automatic liability",
        approach: "Universal Protocol failure, site marking failure. TJC Sentinel Event data shows persistent occurrence despite checklists.",
        keyEvidence: ["Pre-op verification documentation", "Site marking documentation", "Time-out documentation", "WHO checklist completion"],
      },
      {
        theory: "Retained foreign body",
        frequency: "Preventable — strong plaintiff cases",
        approach: "Count discrepancy not resolved, no intraop imaging when indicated. Sponges, instruments, and needles are all discoverable on imaging.",
        keyEvidence: ["Count documentation", "Count discrepancy resolution", "Intraoperative imaging", "Post-op imaging", "Reporting and disclosure documentation"],
      },
      {
        theory: "Failure to obtain informed consent",
        frequency: "Very common — often added to other claims",
        approach: "Specific risks not discussed, alternatives not presented, rushed consent. The legal standard is what a reasonable patient would want to know, not what the physician thinks is important.",
        keyEvidence: ["Consent form specificity", "Timing of consent discussion", "Documentation of alternatives discussed", "Documentation of patient questions", "Who obtained consent (should be operating surgeon)"],
      },
      {
        theory: "Failure to rescue",
        frequency: "Highest severity surgical claims",
        approach: "Post-op complications not recognized, delayed return to OR, nursing concerns not escalated. The complication itself may not be negligence — but failure to recognize and respond to it is.",
        keyEvidence: ["Vital sign trends post-op", "Nursing escalation documentation", "Physician response to nursing concerns", "Time to return to OR", "Early warning score trends"],
      },
      {
        theory: "Surgical technique error",
        frequency: "Difficult to prove without expert testimony",
        approach: "Injury to adjacent structures, excessive blood loss, deviation from standard technique. Often proved through operative report inconsistencies and outcome data.",
        keyEvidence: ["Operative report detail", "EBL documentation", "Intraoperative complications", "Comparison to anatomical norms", "Pathology results vs operative findings"],
      },
      {
        theory: "Delayed surgical intervention",
        frequency: "Common — often combined with EM claims",
        approach: "Appendicitis progressing to perforation, delayed fracture fixation with neurovascular compromise. Timing benchmarks well-established in surgical literature.",
        keyEvidence: ["Time from diagnosis to OR", "Clinical deterioration during delay", "Reason for delay documented", "Consultation response time"],
      },
      {
        theory: "Anesthesia complications",
        frequency: "Separate defendant — separate standard of care",
        approach: "Difficult airway management, medication errors, awareness during surgery, positioning injuries. The anesthesia record provides minute-by-minute accountability.",
        keyEvidence: ["Airway assessment documentation", "Intubation attempts documented", "BIS monitor data (awareness cases)", "Positioning documentation", "Neuromuscular blockade monitoring"],
      },
      {
        theory: "Post-operative infection",
        frequency: "Common — preventability is the issue",
        approach: "Antibiotic prophylaxis timing, sterile technique, wound care protocols. SCIP measures create a regulatory standard.",
        keyEvidence: ["Antibiotic timing relative to incision", "Appropriate antibiotic selection", "Hair removal method", "Glucose control (diabetic patients)", "Wound classification documentation"],
      },
    ],
    obstetrics: [
      {
        theory: "Birth injury — failure to perform timely C-section",
        frequency: "Highest average verdict in all of medical malpractice",
        approach: "Fetal monitoring strip interpretation, delayed decision-to-incision time. Category III tracings require immediate intervention.",
        keyEvidence: ["Fetal monitoring strips (entire labor)", "Strip interpretation documentation", "Decision-to-incision time", "Neonatal outcomes (Apgar, cord gases, NICU admission)", "Communication between nursing and physician about strip concerns"],
      },
      {
        theory: "Shoulder dystocia management",
        frequency: "High severity — brachial plexus injury",
        approach: "Failure to anticipate (macrosomia, gestational diabetes), failure to perform appropriate maneuvers, excessive traction. McRoberts and suprapubic pressure should be first-line.",
        keyEvidence: ["Estimated fetal weight documented", "Risk factors identified", "Maneuvers performed and documented", "Duration of dystocia", "Head-to-body delivery time"],
      },
      {
        theory: "Failure to diagnose preeclampsia/eclampsia",
        frequency: "Preventable maternal mortality",
        approach: "Blood pressure not trended, proteinuria not evaluated, symptoms dismissed. HELLP syndrome can present without classic preeclampsia findings.",
        keyEvidence: ["Blood pressure trends throughout pregnancy", "Urine protein monitoring", "Lab monitoring (platelets, LFTs, creatinine)", "Magnesium sulfate administration timing", "Delivery timing decision"],
      },
    ],
    radiology: [
      {
        theory: "Missed finding on imaging",
        frequency: "Common — often delayed diagnosis cases",
        approach: "Radiologist failed to identify finding visible in retrospect. Prior comparison images not reviewed. Subtle findings not commented on.",
        keyEvidence: ["Original imaging with finding visible", "Comparison studies available but not reviewed", "Report completeness", "Communication of critical findings to ordering physician"],
      },
      {
        theory: "Failure to recommend follow-up imaging",
        frequency: "Incidental findings — growing area",
        approach: "Incidental finding noted but no follow-up recommendation given. Lung nodule, adrenal mass, renal cyst — all have follow-up guidelines.",
        keyEvidence: ["Report language regarding incidental finding", "Follow-up recommendation presence or absence", "ACR guidelines for the specific finding", "Communication to ordering physician"],
      },
    ],
  },

  damagesPresentation: {
    maximizingDamages: [
      "Day-in-the-life video showing patient's current functional limitations",
      "Life care plan from certified life care planner (present value of future medical needs)",
      "Vocational rehabilitation expert (lost earning capacity, especially in young patients)",
      "Economist to calculate present value of future losses with appropriate discount rate",
      "Before-and-after witnesses (family, friends, coworkers describing the change)",
      "Medical illustrations showing the injury mechanism",
      "Timeline graphic showing the deviation from care and its consequences",
      "Patient's own testimony about impact on daily life, relationships, and mental health",
    ],
    psychologicalDamages: [
      "PTSD from the medical experience (especially ICU survivors)",
      "Depression and anxiety from permanent disability",
      "Loss of independence and dignity",
      "Impact on intimate relationships and family dynamics",
      "Fear of future medical care (medical PTSD)",
      "Chronic pain and its psychological toll",
      "Loss of career identity and purpose",
    ],
  },
} as const;

export const DEFENSE_PLAYBOOK = {
  strategies: {
    standardOfCareCompliance: {
      description: "Demonstrate that the physician's actions met the standard of care",
      tactics: [
        "Show documentation supports reasoned clinical judgment",
        "Identify guidelines that support the approach taken",
        "Establish that the physician considered and ruled out dangerous diagnoses",
        "Show that the standard of care was met even if the outcome was poor — bad outcomes happen in medicine",
        "Distinguish between an error in judgment (not malpractice) and deviation from standard (malpractice)",
        "Present published literature supporting the clinical approach taken",
        "Show compliance with hospital protocols and national guidelines",
        "Demonstrate appropriate use of clinical decision rules (HEART, Wells, PERC, Ottawa, etc.)",
      ],
    },
    causationChallenge: {
      description: "Break the chain between alleged breach and patient harm",
      tactics: [
        "Show patient's outcome would have been the same even with 'proper' care (inevitable outcome)",
        "Identify pre-existing conditions that caused or contributed to the outcome",
        "Challenge the temporal relationship between the alleged error and the harm",
        "Show intervening causes that supersede the alleged negligence",
        "Challenge loss-of-chance claims with outcome statistics (e.g., the disease had a 90% mortality regardless)",
        "Present epidemiological data showing the condition's natural history",
        "Argue that the delay (if any) did not change the outcome — timing windows not exceeded",
        "Show that the patient's non-compliance was the proximate cause of harm",
      ],
    },
    comparativeFault: {
      description: "Establish that the patient contributed to their own harm",
      tactics: [
        "Patient non-compliance with treatment plan",
        "Patient left against medical advice",
        "Patient failed to follow up as instructed",
        "Patient provided inaccurate or incomplete history",
        "Patient substance abuse affecting presentation or outcome",
        "Patient delayed seeking care (symptoms present for days before presentation)",
        "Patient failed to fill prescriptions",
        "Patient did not disclose prior medical history or medications",
        "Patient ignored return precautions and did not seek care when symptoms worsened",
      ],
    },
    hindsightBiasDefense: {
      description: "Prevent the jury from judging decisions with the benefit of hindsight",
      tactics: [
        "Emphasize what information was available at the time of decision — not what we know now",
        "Show that the diagnosis only became clear with later information not available to the physician",
        "Present statistics on how often the condition presents atypically",
        "Demonstrate the breadth of differential diagnosis that was reasonable for the presentation",
        "Use 'clinical reasoning' experts to explain decision-making under uncertainty",
        "Show that the plaintiff's expert is using retrospective diagnosis — 'of course it's obvious when you know the answer'",
        "Present literature on diagnostic error rates even among expert physicians",
        "Demonstrate the cognitive load and time pressures of ED practice",
      ],
    },
    documentationDefenses: {
      strongDocumentation: [
        "Detailed MDM showing thought process and differential consideration",
        "Documented reassessments showing clinical improvement before discharge",
        "Specific return precautions with patient comprehension confirmed",
        "Shared decision-making documented with patient preferences noted",
        "Consultants contacted and recommendations followed (or reasons for disagreement documented)",
        "Abnormal results acknowledged and addressed in the plan",
        "Risk factors identified and documented in the clinical reasoning",
        "Pertinent negatives documented showing thorough evaluation",
        "Clinical decision rules applied and documented (HEART score, Wells criteria, etc.)",
      ],
      documentationPhrases: {
        protective: [
          "Discussed with patient the risks of [leaving/declining treatment] including [specific risks]",
          "Patient verbalizes understanding of return precautions",
          "Considered [dangerous diagnosis] — ruled out based on [specific findings]",
          "Reviewed all laboratory and imaging results prior to disposition",
          "Risk-benefit discussion documented: risks of [intervention] vs risks of [observation]",
          "Clinical reassessment performed prior to discharge — patient improved/stable",
          "Discussed case with [consultant] who agrees with plan for [disposition]",
          "Pending results will be followed up by [specific plan — ED callback, PCP, return]",
          "Differential diagnosis includes [X, Y, Z]. Working diagnosis is [A] based on [specific reasoning]",
          "Patient understands that while the current evaluation does not show [dangerous diagnosis], they should return immediately if [specific symptoms] develop",
          "Shared decision-making: discussed observation vs discharge. Patient prefers discharge with close follow-up after understanding risks including [specific risks]",
          "Consulted clinical decision rule [name] — score of [X] places patient in [risk category]",
        ],
        dangerous: [
          "Patient looks fine (subjective, not clinical — destroyed at deposition)",
          "Diagnosis: pain (fails to address underlying cause — what caused the pain?)",
          "No complaints (should document what was specifically assessed)",
          "Cleared for discharge (by whom? based on what criteria?)",
          "Will follow up with PCP (too vague — when? for what? how soon?)",
          "Benign exam (doesn't describe what was examined or what was normal)",
          "Low suspicion for [serious diagnosis] (documents that you thought about it but didn't work it up — worst of both worlds)",
          "Flu-like symptoms (in a patient who could have meningitis, PE, or sepsis)",
          "Anxiety (as a diagnosis in a patient with chest pain who didn't get a cardiac workup)",
          "Musculoskeletal (as a diagnosis without documenting why cardiac/pulmonary causes were excluded)",
          "Patient is a poor historian (blame the patient for your inadequate history-taking?)",
          "Stable for discharge (without documenting what 'stable' means — stable vitals? stable symptoms?)",
        ],
      },
    },
    juryAppealStrategies: {
      humanizingThePhysician: [
        "Show the physician's training, qualifications, and dedication to medicine",
        "Demonstrate the volume and complexity of patients seen that shift",
        "Explain the inherent uncertainty in emergency medicine — it's not a textbook",
        "Show the physician's empathy and concern for the patient",
        "Present the physician as someone who, like the jury, makes difficult decisions under pressure",
        "If error is undeniable, show it was honest mistake in chaotic environment — not carelessness",
      ],
      educatingTheJury: [
        "Use simple analogies to explain medical concepts",
        "Explain that emergency medicine is a 'snapshot in time' — the physician sees one moment of the patient's illness",
        "Explain that symptoms evolve — what looks like the flu at 8am can be meningitis at 8pm",
        "Explain diagnostic uncertainty and the 'test of time' concept",
        "Explain that not every patient with chest pain needs admission (but document why not)",
        "Explain that medical guidelines are guidelines, not mandates — clinical judgment matters",
      ],
    },
    depositionPrep: {
      rules: [
        "Listen to the entire question before answering",
        "Answer only the question asked — do not volunteer information",
        "If you don't remember, say so — don't guess or reconstruct from the chart",
        "Don't argue with the plaintiff attorney — stay calm and professional",
        "Explain your reasoning, not just your actions",
        "Refer to the chart but don't be enslaved by it — 'I routinely do X even if not documented'",
        "Acknowledge the bad outcome empathetically without admitting fault",
        "Never criticize other providers (undermines team defense and opens new theories)",
        "Prepare for the 'Would you do anything differently?' question — the answer is nuanced",
        "Don't use absolute terms ('always', 'never') — they will be used against you",
        "If shown a textbook or guideline, don't agree it's 'the standard of care' — say it's 'a reference'",
        "Take your time. There is no prize for fast answers. Pause, think, then respond.",
        "If attorney mischaracterizes your prior answer, correct them immediately",
        "Review your chart thoroughly before deposition — know every entry and timestamp",
      ],
      commonTrapQuestions: [
        "'Isn't it true that the standard of care requires X?' — Don't agree to an oversimplification. Standard of care depends on clinical context.",
        "'You would agree that [textbook] is an authoritative source?' — 'It's one of many references I use in practice.'",
        "'If you had known the patient had [diagnosis], would you have done anything differently?' — This is a hindsight trap. 'Based on the information available to me at the time, my evaluation was appropriate.'",
        "'Is there anything you wish you had done differently?' — 'I provided appropriate care based on the clinical information available. Of course, with the benefit of hindsight, everyone wishes for a different outcome.'",
        "'Do you see any deviations from the standard of care in this chart?' — 'I believe the care provided met the standard of care. I'd be happy to explain my clinical reasoning.'",
      ],
    },
  },
} as const;

// ── SECTION 3: CLINICIAN REAL-TIME REVIEW ──
// Tools for physicians reviewing their own documentation and managing risk.

export const CLINICIAN_REALTIME = {
  shiftReviewChecklist: {
    perEncounter: [
      "Chief complaint fully characterized (OPQRST for pain, full symptom exploration for non-pain)",
      "Pertinent negatives documented in HPI (not just ROS)",
      "Vital signs reviewed and abnormalities addressed in note",
      "Physical exam findings consistent with clinical picture and chief complaint",
      "MDM documents differential diagnosis explicitly — what you considered and why",
      "Dangerous diagnoses considered and documented (even if ruled out — ESPECIALLY if ruled out)",
      "All results reviewed and abnormalities addressed in note before disposition",
      "Disposition reasoning documented — why discharge/admit/transfer",
      "Return precautions specific to the condition (not generic handout language)",
      "Follow-up provider and timeframe specified",
      "Pending results addressed with specific callback plan and responsible party",
      "Re-evaluation documented after treatment (did they improve?)",
      "Medications reconciled — new prescriptions, changes, interactions checked",
    ],
    highRiskFlags: [
      "Patient left without being seen (LWBS) — document circumstances, triage acuity, attempts to locate",
      "AMA discharge — document capacity, specific risks discussed including death, patient verbalizes understanding",
      "Bounce-back (return within 72h) — heightened scrutiny on this visit. Review prior visit. Consider what was missed.",
      "Intoxicated patient — document serial reassessment and clinical sobriety before any clinical decision-making",
      "Psychiatric hold — document medical clearance was adequate (not just 'medically cleared')",
      "Pediatric patient — lower threshold for investigation, document weight, use weight-based dosing",
      "Elderly patient with vague complaints — broader differential required. Atypical presentations are typical in the elderly.",
      "Patient who called back with concerns — document response, advice given, and reassessment if needed",
      "Any patient you have a 'bad feeling' about — trust clinical instinct and document extra evaluation. Your gut has clinical data you haven't processed yet.",
      "Immunocompromised patient — broader differential, lower threshold for imaging, labs, and admission",
      "Pregnant patient — every medication, imaging study, and procedure needs pregnancy consideration documented",
      "Non-English speaking patient — interpreter use documented. Family member interpretation is NOT adequate for medical decisions.",
      "Frequent flyer — fresh evaluation every time. Prior negative workups do not guarantee current negative workup.",
      "Handoff patient (evaluated by another physician) — document your independent assessment, not just 'agree with prior plan'",
      "Patient with pain out of proportion to exam — investigate further. This is a red flag for compartment syndrome, mesenteric ischemia, necrotizing fasciitis, and other surgical emergencies.",
    ],
  },

  dispositionSafetyNet: {
    dischargeChecklist: [
      "All critical results finalized and reviewed",
      "Patient clinically reassessed immediately prior to discharge",
      "Vital signs stable and trending in right direction (not just 'within normal limits')",
      "Pain adequately controlled (or clearly documented why pain management is ongoing outpatient)",
      "Patient able to ambulate (if relevant to chief complaint)",
      "Patient has transportation and safe environment",
      "Patient understands diagnosis, treatment plan, and medications",
      "Return precautions delivered in patient's language (interpreter if needed)",
      "Follow-up scheduled and patient knows when/where/with whom",
      "Prescription called in or provided (confirmed accessible — pharmacy open, patient can get there)",
      "If pending results: callback plan documented with specific responsible party and timeline",
      "Work/school note provided if needed",
      "Old medications reconciled with new prescriptions (interaction check done)",
    ],
    bounceBackRiskFactors: [
      "Elderly (>65) with abdominal pain or dyspnea — high-risk chief complaints in an age group with atypical presentations",
      "Chest pain with normal initial workup — ACS can present with normal initial troponin and ECG",
      "Abdominal pain without CT in patients >50 — mesenteric ischemia, AAA, and malignancy are the dangers",
      "Headache with any neurological symptom — SAH, mass lesion, venous sinus thrombosis on the differential",
      "Back pain with any red flag (bowel/bladder changes, saddle anesthesia, bilateral symptoms, fever, IV drug use, history of cancer)",
      "Febrile child <3 months — must have age-appropriate workup or documented risk stratification",
      "Any patient discharged with abnormal vital signs (tachycardia, hypotension, fever, tachypnea, hypoxia)",
      "Intoxicated patient whose clinical picture couldn't be fully assessed at time of discharge",
      "Patient with poor social support, questionable compliance, or inability to return if worsened",
      "First-trimester pregnancy with abdominal pain or vaginal bleeding — ectopic not excluded",
      "Syncope without clear benign etiology (vasovagal with prodrome) — cardiac syncope is a killer",
      "Recent surgery or procedure — post-op complications may present subtly",
      "Patient on anticoagulation with any complaint suggesting bleeding",
      "Diabetic with foot complaint — infection can progress rapidly, vascular compromise may be present",
    ],
  },

  cognitiveDebiasing: {
    commonBiases: [
      {
        bias: "Anchoring",
        description: "Fixating on initial diagnosis despite contradictory evidence",
        prevention: "Explicitly reconsider differential when new data arrives. Ask: what else could this be? What data would change my mind?",
        example: "Patient presents with 'anxiety' per triage. Physician anchors on anxiety and doesn't order troponin despite chest pain and diaphoresis.",
      },
      {
        bias: "Premature closure",
        description: "Accepting a diagnosis before it's fully verified",
        prevention: "Before disposition, ask: have I ruled out the worst-case scenarios? What would make me wrong?",
        example: "Patient with abdominal pain. WBC is 12. Diagnosis: gastroenteritis. No CT ordered. Ruptured appendicitis found 2 days later.",
      },
      {
        bias: "Availability bias",
        description: "Overweighting diagnoses you've seen recently or that are cognitively 'available'",
        prevention: "Use structured decision tools (HEART score, Wells criteria) rather than gestalt alone. Gestalt is refined pattern recognition, but it has blind spots.",
        example: "Three prior chest pain patients this shift were all musculoskeletal. Fourth patient also diagnosed MSK — but this one had an MI.",
      },
      {
        bias: "Confirmation bias",
        description: "Seeking evidence that confirms your diagnosis while ignoring contradictory evidence",
        prevention: "Actively look for data that contradicts your working diagnosis. Ask: what finding would prove me wrong? Do I have that data?",
        example: "Working diagnosis is pneumonia. CXR shows infiltrate (confirms). Ignoring the elevated troponin and ST changes on ECG (contradicts).",
      },
      {
        bias: "Diagnostic momentum",
        description: "Accepting a prior provider's diagnosis without independent assessment",
        prevention: "Always do your own assessment. Prior labels can be wrong. The EMS impression, triage assessment, and outside hospital diagnosis are starting points, not conclusions.",
        example: "Transfer patient labeled 'CHF exacerbation' by outside hospital. Admitting team continues CHF treatment without considering PE, which was the actual diagnosis.",
      },
      {
        bias: "Triage cueing",
        description: "Letting triage acuity level anchor your assessment before seeing the patient",
        prevention: "Re-evaluate the patient independently of the triage level. Triage is a screening tool, not a diagnosis.",
        example: "Patient triaged as ESI 4 for 'back pain.' Physician does cursory exam. Cauda equina syndrome diagnosed 3 days later at return visit.",
      },
      {
        bias: "Psych-out errors",
        description: "Attributing physical symptoms to psychiatric diagnosis, especially in patients with psychiatric history",
        prevention: "Always complete medical clearance before psychiatric attribution. Altered mental status is medical until proven otherwise.",
        example: "Frequent psych patient presents with 'agitation.' Assumed psychiatric. Actually septic from UTI with AMS.",
      },
      {
        bias: "Gender/race bias",
        description: "Under-investigating certain demographics for serious conditions",
        prevention: "Apply the same workup criteria regardless of demographics. Use clinical decision rules which are objective. Women with MI present atypically more often — they need MORE investigation, not less.",
        example: "Young woman with chest pain assumed to have anxiety. No ECG or troponin. Spontaneous coronary artery dissection missed.",
      },
      {
        bias: "Overconfidence bias",
        description: "Excessive confidence in one's own clinical judgment, especially among experienced physicians",
        prevention: "Maintain intellectual humility. The most dangerous physician is the one who never considers they could be wrong. Calibrate confidence to data, not experience alone.",
        example: "Senior attending dismisses resident's suggestion to get a CT. 'I've seen thousands of these — it's not appendicitis.' It was appendicitis.",
      },
      {
        bias: "Sunk cost bias",
        description: "Continuing a clinical path because of resources already invested rather than because it's the right course",
        prevention: "Be willing to change the plan when new information arrives, regardless of what's already been done or ordered.",
        example: "Already admitted the patient for 'observation.' New data suggests they need emergent surgery, but the team delays because they 'just admitted to the floor.'",
      },
      {
        bias: "Visceral bias",
        description: "Emotional reaction to the patient (positive or negative) affecting clinical judgment",
        prevention: "Recognize when you have strong feelings about a patient. The drug-seeking patient still deserves a thorough workup. The pleasant patient still needs objective evaluation.",
        example: "Patient is rude, demanding, and has a history of drug-seeking. Physician does minimal workup. Patient has epidural abscess from IV drug use.",
      },
    ],
  },

  documentationPowerMoves: {
    uncertainty: [
      "The presentation is atypical for [condition] but I cannot exclude it. I have discussed with the patient the importance of return/follow-up for repeat evaluation if symptoms persist or worsen.",
      "Given the diagnostic uncertainty, I have arranged close follow-up in [timeframe] with [provider] for reassessment.",
      "While the current workup does not confirm [diagnosis], the clinical picture warrants observation/admission for serial evaluation.",
      "I have a low but non-zero suspicion for [dangerous diagnosis]. The patient's current stability allows for outpatient evaluation. I have provided specific return precautions including [symptoms that should prompt immediate return].",
      "The differential remains broad. Most likely diagnosis is [X] but I have not excluded [Y, Z]. Plan: [specific follow-up and contingency].",
    ],
    sharedDecisionMaking: [
      "Discussed with patient the options of [admission vs. discharge with close follow-up]. Reviewed risks of each approach including [specific risks]. Patient expresses preference for [choice] after understanding the risks. Patient demonstrates understanding and is making an informed decision.",
      "Informed patient that while [test/treatment] is recommended, they have the right to decline. Risks of declining include [specific risks including worst-case scenario]. Patient declines and accepts these risks. I have documented this discussion and will arrange [alternative plan].",
      "Patient and I have discussed the uncertainty of the current diagnosis. Options include [A] with risks [X] or [B] with risks [Y]. Patient prefers [choice]. I agree this is a reasonable approach given [clinical reasoning].",
    ],
    amaDischarge: [
      "Patient has decision-making capacity (alert, oriented, able to articulate understanding of diagnosis, proposed treatment, and consequences of refusal). Patient informed of diagnosis of [X], recommended treatment of [Y], and specific risks of leaving including [death, permanent disability, worsening condition requiring emergency surgery, etc.]. Patient verbalizes understanding of these risks but chooses to leave. Patient informed they may return at any time. Prescriptions for [medications] provided. Follow-up with [provider] in [timeframe] recommended.",
      "Capacity assessment: Patient is alert and oriented x4, able to repeat back the diagnosis, recommended treatment, and consequences of refusal in their own words. Patient is not intoxicated. Patient does not appear to be in acute psychiatric distress. Patient demonstrates understanding of the serious nature of their condition.",
    ],
    criticalResultFollowUp: [
      "Pending results at discharge: [specific tests]. Plan: Results will be reviewed by [ED attending/callback system/PCP — name the specific person or system]. Patient instructed to call [number] if not contacted within [timeframe]. If results are significantly abnormal, patient will be contacted by [method] and instructed to [return to ED/go to office/etc.].",
      "The following results are pending at time of discharge: [list]. I have placed a flag in [system] for follow-up. The patient has been informed that pending results exist and has been given the callback number [X]. If results reveal [specific concern], the plan is [specific action].",
    ],
    consultantDisagreement: [
      "Consulted [specialty] regarding [indication]. Consultant recommends [plan]. I [agree/disagree] because [specific clinical reasoning]. Plan: [what will actually be done]. Discussed my reasoning with the consultant.",
      "Spoke with Dr. [name] in [specialty] at [time]. Consultant does not recommend admission/procedure. I have independently assessed the patient and [agree/disagree] with this recommendation. My reasoning: [explanation]. Plan: [action taken].",
    ],
    systemIssues: [
      "CT scanner down/unavailable. Patient requires CT for [indication]. Plan: [transfer to facility with working CT/observation with serial exams/etc.]. Patient informed of limitation.",
      "Specialist consultation unavailable at this facility. Patient requires [specialty] evaluation. Plan: transfer to [facility] per EMTALA. Risks and benefits of transfer discussed with patient.",
      "ED at capacity with [X] patients boarding. Patient in hallway bed. Reassessed at [times]. Unable to perform [specific intervention] due to resource limitation. Documented workaround: [plan].",
    ],
  },

  riskStratificationTools: {
    description: "Clinical decision rules that, when properly applied and documented, provide strong legal protection",
    tools: {
      heartScore: {
        name: "HEART Score — Chest Pain Risk Stratification",
        components: ["History (0-2)", "ECG (0-2)", "Age (0-2)", "Risk Factors (0-2)", "Troponin (0-2)"],
        interpretation: {
          "0-3": "Low risk (1.7% MACE) — discharge with follow-up is reasonable",
          "4-6": "Moderate risk (12% MACE) — observation and serial troponins",
          "7-10": "High risk (65% MACE) — admission and aggressive management",
        },
        legalValue: "Documented HEART score showing systematic risk assessment is one of the strongest defenses in chest pain cases. Failure to document any risk stratification is one of the biggest vulnerabilities.",
      },
      wellsPE: {
        name: "Wells Criteria — Pulmonary Embolism",
        components: ["Clinical signs of DVT (3)", "PE most likely diagnosis (3)", "Heart rate >100 (1.5)", "Immobilization/surgery (1.5)", "Prior DVT/PE (1.5)", "Hemoptysis (1)", "Malignancy (1)"],
        interpretation: {
          "0-1 with PERC negative": "PE can be excluded without D-dimer (PERC rule must be applied at bedside, not retrospectively)",
          "0-4": "Low probability — D-dimer to exclude",
          "5+": "High probability — CTPA indicated",
        },
        legalValue: "Structured application of Wells + PERC demonstrates systematic evaluation. Failure to consider PE in appropriate patients is a common claim.",
      },
      pecRule: {
        name: "PERC Rule — PE Rule-Out Criteria",
        components: ["Age <50", "HR <100", "O2 sat >=95%", "No unilateral leg swelling", "No hemoptysis", "No surgery/trauma within 4 weeks", "No prior DVT/PE", "No estrogen use"],
        interpretation: "All 8 criteria must be met. If all met AND pre-test probability is low (Wells <=4), PE is excluded without further testing.",
        legalValue: "Properly applied and documented PERC rule is a strong defense against failure-to-diagnose-PE claims. But it must be applied at bedside, prospectively, not retrospectively to justify not testing.",
      },
      ottawaAnkle: {
        name: "Ottawa Ankle Rules",
        components: ["Bone tenderness at posterior edge of distal 6cm of fibula/tibia", "Bone tenderness at navicular or base of 5th metatarsal", "Inability to bear weight (4 steps) immediately and in ED"],
        interpretation: "If none positive, fracture is excluded with near 100% sensitivity. X-ray not needed.",
        legalValue: "Documented application of Ottawa rules protects against missed fracture claims. But the exam must be properly performed — palpating the right anatomical landmarks.",
      },
      canadianCSpine: {
        name: "Canadian C-Spine Rule",
        components: ["High-risk factor present? (age >65, dangerous mechanism, paresthesias)", "Low-risk factor allowing safe ROM assessment? (simple rear-end MVC, sitting in ED, ambulatory, delayed onset pain, no midline tenderness)", "Able to actively rotate neck 45 degrees?"],
        interpretation: "Validated decision tool to determine need for C-spine imaging in alert, stable trauma patients.",
        legalValue: "Documented application reduces unnecessary imaging while providing legal cover for clinical decision not to image.",
      },
      nihss: {
        name: "NIH Stroke Scale",
        components: ["Consciousness", "Best gaze", "Visual fields", "Facial palsy", "Motor arm/leg", "Limb ataxia", "Sensory", "Best language", "Dysarthria", "Extinction/inattention"],
        legalValue: "NIHSS must be documented for stroke patients. Failure to perform NIHSS in a patient with neurological symptoms is difficult to defend. The score drives treatment decisions including tPA and thrombectomy eligibility.",
      },
    },
  },
} as const;

// ── SECTION 4: HIGH-VALUE LITIGATION PATTERNS ──
// Recurring patterns in successful medical malpractice litigation.

export const LITIGATION_PATTERNS = {
  highValueCasePatterns: [
    {
      pattern: "The 'almost right' workup",
      description: "Physician did most of the right things but missed one critical step. Example: serial troponins ordered but patient discharged before third troponin resulted. The near-completeness of the workup actually makes the gap more damning — it shows the physician knew what to do.",
      frequency: "Very common in EM claims",
      plaintiffAdvantage: "Hard for the defense to argue they didn't know the standard when they partially followed it",
    },
    {
      pattern: "The documented-but-not-acted-upon result",
      description: "Abnormal result is in the chart, may even be in the physician's note, but no action was taken. Example: elevated lactate in a sepsis workup without repeat lactate or clinical response.",
      frequency: "Common — strongest plaintiff evidence",
      plaintiffAdvantage: "The chart itself is the evidence. No expert testimony needed to show the result was abnormal and ignored.",
    },
    {
      pattern: "The handoff failure",
      description: "Critical information lost during shift change, transfer, or admission. The outgoing team knew something the incoming team didn't. Example: ED physician verbally told consulting service about a concerning finding but it wasn't documented, and the consultant never addressed it.",
      frequency: "Common in complex cases",
      plaintiffAdvantage: "Multiple defendants means multiple insurance policies and finger-pointing among defendants benefits the plaintiff.",
    },
    {
      pattern: "The system failure disguised as individual error",
      description: "The physician made an error, but the error was predictable given the system design. Example: no read-back system for critical results, no forcing function for follow-up of pending results.",
      frequency: "Increasing — hospital system liability",
      plaintiffAdvantage: "Adds the hospital as a deep-pocket defendant. Corporate negligence theory.",
    },
    {
      pattern: "The return visit",
      description: "Patient returns to the ED within 72 hours with the diagnosis the first visit missed. The second visit chart often contains evidence that the condition was present on the first visit.",
      frequency: "Very common — easy for plaintiff to identify",
      plaintiffAdvantage: "Dramatic timeline. 'They sent her home and she came back dying.' Powerful jury narrative.",
    },
    {
      pattern: "The ignored nurse",
      description: "Nursing notes document concern about a patient's condition or explicit notification to the physician, but the physician's note doesn't reflect any response.",
      frequency: "Common — devastating at trial",
      plaintiffAdvantage: "Nurse often testifies as a sympathetic witness. 'I told the doctor I was worried and nothing changed.'",
    },
    {
      pattern: "The template testimony",
      description: "Physician's note is clearly a template with minimal customization. At deposition, when asked about specific clinical findings, the physician can't distinguish this patient from any other.",
      frequency: "Common in high-volume EDs",
      plaintiffAdvantage: "Destroys physician credibility. 'You don't actually remember examining this patient, do you, Doctor?'",
    },
    {
      pattern: "The after-hours amendment",
      description: "Chart note is amended or addended after an adverse event or malpractice claim is filed. Even if the amendment is clinically accurate, the timing makes it appear self-serving.",
      frequency: "Moderate — but devastating when found",
      plaintiffAdvantage: "Suggests consciousness of guilt. Jury instruction on spoliation of evidence possible.",
    },
  ],

  jurisdictionalConsiderations: {
    plaintiffFriendlyJurisdictions: [
      "Cook County, IL — historically large verdicts, sympathetic juries",
      "Philadelphia County, PA — high verdict range, sophisticated plaintiff bar",
      "Bronx County, NY — consistently high verdicts for medical malpractice",
      "Miami-Dade County, FL — no caps (repealed 2023), diverse jury pool",
      "Los Angeles County, CA — MICRA limits non-economic but economic damages can be enormous",
    ],
    defenseFriendlyJurisdictions: [
      "Texas — caps on non-economic damages, Certificate of Merit requirement, expert qualifications strict",
      "Many rural jurisdictions — jury sympathy with local physicians",
      "States with strong tort reform — caps, shortened SOL, expert requirements",
    ],
    keyVariations: [
      "Certificate of Merit: Required pre-filing in ~25 states. Merit-MD addresses this directly.",
      "Damage caps: Range from no cap (NY, FL post-2023) to strict limits (TX: $250K non-economic per physician)",
      "Collateral source rule: Some states allow jury to hear about insurance payments; most don't",
      "Joint and several liability: Varies — some states allow recovery from any defendant for full amount",
      "Comparative fault: Modified (plaintiff recovers only if less than 50% at fault) vs pure (plaintiff recovers even if mostly at fault, reduced by their percentage)",
      "Expert witness locality rule: Some states require expert from same community; trend is toward national standard",
    ],
  },

  settlementDynamics: {
    factorsInfluencingSettlement: [
      "Strength of liability evidence (clear breach vs judgment call)",
      "Severity of injury (catastrophic injuries settle for more even with weaker liability)",
      "Insurance policy limits (most claims settle within policy limits)",
      "Defendant willingness to settle (some physicians refuse on principle)",
      "Jurisdiction median verdict data",
      "Quality of plaintiff attorney (firms with trial reputation get better settlements)",
      "Quality of defense attorney and expert witnesses",
      "Pre-trial rulings (Daubert challenges, motion to exclude evidence)",
      "Defendant's deposition performance (a bad deposition multiplies settlement value)",
      "Sympathy factors (young patient, preventable death, egregious facts)",
    ],
    typicalTimeline: [
      "Pre-suit investigation: 3-12 months (record review, expert consultation)",
      "Filing and service: varies by SOL pressure",
      "Written discovery: 6-12 months",
      "Depositions: 3-6 months after discovery begins",
      "Expert reports: per scheduling order, usually after depositions",
      "Mediation: often required before trial, typically 1-2 years after filing",
      "Trial: 2-4 years after filing (varies enormously by jurisdiction)",
    ],
    verdictRanges: {
      note: "Ranges are approximate and vary enormously by jurisdiction, severity, and liability strength",
      categories: {
        wrongfulDeath: "$500K - $20M+ (higher for young patients, preventable deaths)",
        catastrophicInjury: "$1M - $30M+ (brain injury, paralysis, severe birth injury)",
        permanentDisability: "$500K - $5M",
        temporarySignificantInjury: "$100K - $1M",
        minorInjury: "$25K - $250K (often not economically viable to litigate)",
      },
    },
  },
} as const;

// ── SECTION 5: MEDICAL-LEGAL KEYWORD DETECTION ──
// Extended keyword map for detecting medical-legal contexts beyond clinical categories.

export const MEDLEGAL_KEYWORD_MAP = {
  chartIntegrity: [
    "amendment", "addendum", "late entry", "correction", "modified",
    "audit trail", "copy forward", "template", "attestation",
    "co-signature", "verbal order", "telephone order",
  ],
  dispositionIssues: [
    "ama", "against medical advice", "left without being seen", "lwbs",
    "elopement", "discharge", "return precautions", "follow-up",
    "bounce back", "return visit", "readmission", "callback",
  ],
  communicationFailures: [
    "handoff", "hand-off", "sign out", "sign-out", "transfer of care",
    "consultation", "callback", "notification", "read back",
    "critical value", "pending result", "miscommunication",
  ],
  systemFailures: [
    "staffing", "overcrowding", "boarding", "diversion",
    "equipment failure", "IT downtime", "system error",
    "nurse-to-patient ratio", "wait time", "delay",
  ],
  proceduralConcerns: [
    "informed consent", "consent", "time-out", "universal protocol",
    "surgical site", "wrong site", "retained", "count discrepancy",
    "complication", "procedural note", "sedation",
  ],
  highRiskPopulations: [
    "pediatric", "neonatal", "infant", "geriatric", "elderly",
    "pregnant", "immunocompromised", "psychiatric", "intoxicated",
    "non-english", "interpreter", "homeless", "uninsured",
  ],
} as const;

// ── SECTION 6: KNOWLEDGE CONTEXT BUILDER ──
// Builds supplemental medical-legal context for analysis prompts.

type MedLegalCategory = keyof typeof MEDLEGAL_KEYWORD_MAP;

function detectMedLegalCategories(text: string): MedLegalCategory[] {
  const lower = text.toLowerCase();
  const matches = new Set<MedLegalCategory>();

  for (const [category, keywords] of Object.entries(MEDLEGAL_KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matches.add(category as MedLegalCategory);
        break;
      }
    }
  }

  return Array.from(matches);
}

function buildChartAnatomyContext(text: string): string {
  const lower = text.toLowerCase();
  const sections: string[] = [];

  // Always include negative space analysis and timestamp analysis
  sections.push(`
### Chart Negative Space Analysis
Review for the following commonly absent documentation:
${CHART_ANATOMY.edChart.negativeSpaceAnalysis.commonAbsences.map((a) => `- ${a}`).join("\n")}
`);

  sections.push(`
### Timestamp Analysis
Examine the timeline for these suspicious patterns:
${CHART_ANATOMY.edChart.timestampAnalysis.suspiciousPatterns.map((p) => `- ${p}`).join("\n")}
`);

  // Include triage analysis if triage-related terms present
  if (lower.includes("triage") || lower.includes("esi") || lower.includes("acuity")) {
    sections.push(`
### Triage Red Flags
${CHART_ANATOMY.edChart.components.triageNote.redFlags.map((r) => `- ${r}`).join("\n")}
`);
  }

  // Include nursing analysis if nursing terms present
  if (lower.includes("nurs") || lower.includes("vital sign") || lower.includes("assessment")) {
    sections.push(`
### Nursing Documentation Red Flags
${CHART_ANATOMY.edChart.components.nursingNotes.redFlags.map((r) => `- ${r}`).join("\n")}
`);
  }

  // Include disposition analysis for discharge/transfer cases
  if (lower.includes("discharge") || lower.includes("disposition") || lower.includes("transfer") || lower.includes("ama")) {
    sections.push(`
### Disposition Documentation Requirements
${CHART_ANATOMY.edChart.components.disposition.criticalElements.map((e) => `- ${e}`).join("\n")}
`);
  }

  // Include surgical chart anatomy if surgical terms present
  if (lower.includes("surgery") || lower.includes("surgical") || lower.includes("operative") || lower.includes("post-op") || lower.includes("preop") || lower.includes("anesthesia")) {
    sections.push(`
### Surgical Chart — Informed Consent Requirements
${CHART_ANATOMY.surgicalChart.components.preOpAssessment.informedConsentElements.map((e) => `- ${e}`).join("\n")}

### Surgical Chart — Failure to Rescue Indicators
${CHART_ANATOMY.surgicalChart.components.postOpCare.failureToRescueIndicators.map((i) => `- ${i}`).join("\n")}
`);
  }

  return sections.join("\n");
}

function buildPlaybookContext(text: string): string {
  const lower = text.toLowerCase();
  const sections: string[] = [];

  // Always include prosecution screening criteria
  sections.push(`
### Case Screening Criteria
The following factors determine whether a case is worth pursuing:
${PROSECUTION_PLAYBOOK.caseScreening.initialAssessment.map((a) => `- ${a}`).join("\n")}

Cases NOT worth taking:
${PROSECUTION_PLAYBOOK.caseScreening.casesNOTWorthTaking.map((c) => `- ${c}`).join("\n")}
`);

  // Include defense documentation phrases
  sections.push(`
### Protective Documentation Phrases (Defense Perspective)
The following phrases in the chart STRENGTHEN the defense:
${DEFENSE_PLAYBOOK.strategies.documentationDefenses.documentationPhrases.protective.map((p) => `- ${p}`).join("\n")}

### Dangerous Documentation Phrases
The following phrases WEAKEN the defense:
${DEFENSE_PLAYBOOK.strategies.documentationDefenses.documentationPhrases.dangerous.map((d) => `- ${d}`).join("\n")}
`);

  // Include causation challenge strategies if causation-related terms present
  if (lower.includes("causation") || lower.includes("cause") || lower.includes("outcome") || lower.includes("prognosis")) {
    sections.push(`
### Causation Challenge Strategies (Defense)
${DEFENSE_PLAYBOOK.strategies.causationChallenge.tactics.map((t) => `- ${t}`).join("\n")}
`);
  }

  // Include cognitive debiasing if diagnostic error terms present
  if (lower.includes("missed") || lower.includes("failure to diagnose") || lower.includes("delayed") || lower.includes("misdiagnos")) {
    sections.push(`
### Cognitive Biases in Diagnostic Error
${CLINICIAN_REALTIME.cognitiveDebiasing.commonBiases.map((b) => `- **${b.bias}**: ${b.description}. Prevention: ${b.prevention}`).join("\n")}
`);
  }

  return sections.join("\n");
}

function buildLitigationPatternContext(): string {
  return `
### High-Value Litigation Patterns
${LITIGATION_PATTERNS.highValueCasePatterns.map((p) => `- **${p.pattern}**: ${p.description}`).join("\n")}
`;
}

/**
 * Build supplemental medical-legal context from the text.
 * This is injected alongside the clinical knowledge context.
 */
export function getMedLegalContext(text: string): string {
  const medLegalCategories = detectMedLegalCategories(text);

  const sections: string[] = [];

  // Chart anatomy context (always relevant)
  sections.push(buildChartAnatomyContext(text));

  // Playbook context (always relevant)
  sections.push(buildPlaybookContext(text));

  // Litigation patterns (always relevant)
  sections.push(buildLitigationPatternContext());

  // Risk stratification tools if clinical decision rules are mentioned
  const lower = text.toLowerCase();
  if (lower.includes("heart score") || lower.includes("wells") || lower.includes("perc") || lower.includes("ottawa") || lower.includes("nihss") || lower.includes("risk stratif")) {
    const tools = CLINICIAN_REALTIME.riskStratificationTools.tools;
    sections.push(`
### Clinical Decision Rules Referenced
${Object.values(tools).map((t) => `- **${t.name}**: Legal value: ${t.legalValue}`).join("\n")}
`);
  }

  // Disposition safety net if discharge-related
  if (lower.includes("discharge") || lower.includes("disposition") || lower.includes("sent home") || lower.includes("released")) {
    sections.push(`
### Bounce-Back Risk Factors
${CLINICIAN_REALTIME.dispositionSafetyNet.bounceBackRiskFactors.map((r) => `- ${r}`).join("\n")}
`);
  }

  // High-risk population context
  if (medLegalCategories.includes("highRiskPopulations")) {
    sections.push(`
### High-Risk Population Considerations
${CLINICIAN_REALTIME.shiftReviewChecklist.highRiskFlags.map((f) => `- ${f}`).join("\n")}
`);
  }

  // System failure context
  if (medLegalCategories.includes("systemFailures")) {
    sections.push(`
### System Failure Litigation Pattern
When system failures contribute to harm, the hospital is a co-defendant under corporate negligence theory. Look for:
- Inadequate staffing during the relevant shift
- Equipment failures or IT downtime
- Boarding patients in inappropriate locations
- Diversion status or overcapacity conditions
- Protocol or policy failures (the system failed, not just the individual)
`);
  }

  const contextStr = sections.join("\n");
  if (!contextStr.trim()) return "";

  return `\n## MEDICAL-LEGAL EXPERT KNOWLEDGE BASE\nThe following medical-legal analysis framework supplements the clinical knowledge base. Use it to evaluate chart integrity, litigation viability, documentation quality, and risk patterns.\n${contextStr}`;
}
