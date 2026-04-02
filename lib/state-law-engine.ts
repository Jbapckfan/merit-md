// ═══════════════════════════════════════════════════════════
// MedMal Review Pro — State Law Engine
// Dynamic medical malpractice law lookups by jurisdiction.
// Replaces static examples with comprehensive 50-state data.
//
// IMPORTANT: Laws change. Each entry includes lastVerified date.
// This is informational — always verify with current statutes.
// ═══════════════════════════════════════════════════════════

export type DamageCapType = "none" | "non_economic" | "total" | "per_defendant" | "tiered";

export interface StateMedMalLaw {
  state: string;
  stateCode: string;

  // Damage caps
  damageCaps: {
    nonEconomic: { cap: number | null; notes: string };
    total: { cap: number | null; notes: string };
    punitive: { cap: number | null; notes: string };
    wrongfulDeath: { cap: number | null; notes: string };
    adjustsAnnually: boolean;
    statute: string;
    lastVerified: string;
  };

  // Statute of limitations
  sol: {
    generalYears: number;
    discoveryRule: boolean;
    discoveryRuleDetails: string;
    minorTolling: string;
    absoluteRepose: number | null;
    statute: string;
    lastVerified: string;
  };

  // Certificate of Merit
  certificateOfMerit: {
    required: boolean;
    details: string;
    deadline: string;
    statute: string;
  };

  // Expert witness
  expertWitness: {
    sameSpecialtyRequired: boolean;
    activePracticeRequired: boolean;
    details: string;
    statute: string;
  };

  // Comparative fault
  faultRule: {
    type: "pure_comparative" | "modified_50" | "modified_51" | "contributory" | "slight_gross";
    description: string;
    statute: string;
  };
}

// ═══════════════════════════════════════════════════════════
// 50-State + DC Data
// ═══════════════════════════════════════════════════════════

const STATE_LAWS: Record<string, StateMedMalLaw> = {
  // ── Alabama ──
  AL: {
    state: "Alabama",
    stateCode: "AL",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages in medical malpractice." },
      total: { cap: null, notes: "No cap on total compensatory damages." },
      punitive: { cap: null, notes: "No fixed statutory cap. Punitive damages subject to due process review. Legislature has not enacted a specific med-mal punitive cap." },
      wrongfulDeath: { cap: null, notes: "Wrongful death is a punitive-only action in Alabama (no compensatory damages). Jury has discretion." },
      adjustsAnnually: false,
      statute: "Ala. Code § 6-5-410 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the act or omission, or 6 months from discovery, whichever is later.",
      minorTolling: "Tolled until age 4 for minors under 4 at time of act; 2 years from the act for minors over 4.",
      absoluteRepose: 4,
      statute: "Ala. Code § 6-5-482",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "Alabama does not require a certificate or affidavit of merit for medical malpractice claims.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be a 'similarly situated health care provider' — same specialty or a specialty that includes the procedure at issue.",
      statute: "Ala. Code § 6-5-548",
    },
    faultRule: {
      type: "contributory",
      description: "Alabama follows pure contributory negligence. Any fault by the plaintiff bars recovery entirely.",
      statute: "Common law; not codified.",
    },
  },

  // ── Alaska ──
  AK: {
    state: "Alaska",
    stateCode: "AK",
    damageCaps: {
      nonEconomic: { cap: 400000, notes: "$400K non-economic cap, or $8K per year of life expectancy, whichever is greater." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Greater of 3x compensatory damages or $500K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies. No separate wrongful death cap." },
      adjustsAnnually: false,
      statute: "Alaska Stat. § 09.17.010",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from discovery or when injury should have been discovered.",
      minorTolling: "Tolled until age 8 for minors under 8. Otherwise minor must bring claim within 2 years.",
      absoluteRepose: null,
      statute: "Alaska Stat. § 09.10.070",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit from a qualified expert must accompany the complaint.",
      deadline: "Filed with the initial complaint.",
      statute: "Alaska Stat. § 09.55.536",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must practice or have practiced in the same specialty or a related field.",
      statute: "Alaska Stat. § 09.20.185",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's damages reduced by percentage of fault, regardless of amount.",
      statute: "Alaska Stat. § 09.17.060",
    },
  },

  // ── Arizona ──
  AZ: {
    state: "Arizona",
    stateCode: "AZ",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Arizona Constitution Art. 2, § 31 prohibits statutory caps on damages." },
      total: { cap: null, notes: "No cap. Constitutional prohibition." },
      punitive: { cap: null, notes: "No statutory cap. Subject to due process limits." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Ariz. Const. Art. 2, § 31",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date the injury is discovered or should have been discovered with reasonable diligence.",
      minorTolling: "Minors have until age 18 + the applicable SOL period.",
      absoluteRepose: null,
      statute: "A.R.S. § 12-542",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Preliminary expert opinion affidavit required. Must state the expert reviewed the records, the standard of care, how it was breached, and how the breach caused injury.",
      deadline: "Must be served with the initial disclosure or within the court's scheduling order.",
      statute: "A.R.S. § 12-2603",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must specialize in the same specialty or a related field and must have been actively practicing or teaching in that specialty during the year preceding the incident.",
      statute: "A.R.S. § 12-2604",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Damages reduced proportionally; plaintiff can recover even if 99% at fault.",
      statute: "A.R.S. § 12-2505",
    },
  },

  // ── Arkansas ──
  AR: {
    state: "Arkansas",
    stateCode: "AR",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No statutory cap on non-economic damages." },
      total: { cap: null, notes: "No cap on total damages." },
      punitive: { cap: null, notes: "Punitive damages limited to 3x compensatory or $250K, whichever is greater. Does not apply to intentional torts." },
      wrongfulDeath: { cap: null, notes: "No specific cap." },
      adjustsAnnually: false,
      statute: "Ark. Code § 16-55-208",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the wrongful act. Discovery rule applies for foreign objects or fraud/concealment.",
      minorTolling: "Tolled during minority. Minor has 2 years after reaching age 18.",
      absoluteRepose: null,
      statute: "Ark. Code § 16-114-203",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit or affidavit of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert testimony required to establish standard of care. Expert should practice or have recently practiced in same or similar specialty.",
      statute: "Ark. Code § 16-114-206",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred if their fault is equal to or greater than defendant's.",
      statute: "Ark. Code § 16-64-122",
    },
  },

  // ── California ──
  CA: {
    state: "California",
    stateCode: "CA",
    damageCaps: {
      nonEconomic: { cap: 350000, notes: "MICRA (Medical Injury Compensation Reform Act). Cap increased from $250K to $350K effective Jan 1, 2023 (AB 35). Rises $40K/year for wrongful death cases and $40K/year for non-death cases until reaching $750K (death) and $750K (non-death) in 2033, then adjusts for inflation 2% annually." },
      total: { cap: null, notes: "No cap on economic damages." },
      punitive: { cap: null, notes: "Available under Cal. Civ. Code § 3294 for malice, oppression, or fraud. No statutory cap but must be proportional to compensatory damages." },
      wrongfulDeath: { cap: 500000, notes: "MICRA wrongful death non-economic cap started at $500K in 2023, increasing $50K/year until $750K in 2028, then 2% inflation adjustment." },
      adjustsAnnually: true,
      statute: "Cal. Civ. Code § 3333.2 (as amended by AB 35, 2022)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 1,
      discoveryRule: true,
      discoveryRuleDetails: "1 year from discovery or when the patient should have discovered the injury, OR 3 years from the date of injury, whichever comes first. This is one of the shortest SOLs in the country.",
      minorTolling: "For minors under 6: 3 years or until age 8, whichever is later. For minors 6+: standard rules apply.",
      absoluteRepose: 3,
      statute: "Cal. Civ. Proc. Code § 340.5",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Attorney must consult with at least one health care professional with appropriate expertise who has reviewed the records and provided a written opinion that there is reasonable and meritorious cause for filing. Attorney certifies this consultation under penalty of perjury.",
      deadline: "Must be completed before filing the complaint. Certificate filed with the court.",
      statute: "Cal. Civ. Proc. Code § 411.30",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed, have substantial professional experience in the relevant area, and must have been practicing or teaching in the specialty at the time of the alleged malpractice. Board certification preferred but not required.",
      statute: "Cal. Evid. Code § 720; Cal. Civ. Proc. Code § 411.30",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Li v. Yellow Cab Co. (1975). Plaintiff's recovery reduced by their percentage of fault. No threshold — even a 99% at-fault plaintiff recovers 1%.",
      statute: "Li v. Yellow Cab Co. (1975) 13 Cal.3d 804; Cal. Civ. Code § 1431.2",
    },
  },

  // ── Colorado ──
  CO: {
    state: "Colorado",
    stateCode: "CO",
    damageCaps: {
      nonEconomic: { cap: 300000, notes: "$300K non-economic cap, adjustable by court for good cause up to $600K. Adjusted for inflation per CPI — verify current amount." },
      total: { cap: 1000000, notes: "$1M total cap on all damages (economic + non-economic). Court may increase for just cause. Also inflation-adjusted." },
      punitive: { cap: null, notes: "Equal to compensatory damages. May not exceed actual damages amount." },
      wrongfulDeath: { cap: null, notes: "Subject to the total damages cap unless court finds just cause." },
      adjustsAnnually: true,
      statute: "C.R.S. § 13-64-302",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from discovery or when injury should have been discovered. Cannot exceed 3-year repose for most claims.",
      minorTolling: "For minors under 6: tolled until age 8. For minors 6+: standard 2-year rule applies.",
      absoluteRepose: 3,
      statute: "C.R.S. § 13-80-102.5",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of review required within 60 days of filing. Attorney must have consulted with a qualified expert who reviewed the case and found it meritorious.",
      deadline: "60 days after service of the complaint.",
      statute: "C.R.S. § 13-20-602",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be substantially familiar with applicable standard of care. Must be in same or similar specialty and have actively practiced within 5 years preceding the claim.",
      statute: "C.R.S. § 13-64-401",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff's recovery reduced by fault percentage; barred entirely if 50% or more at fault.",
      statute: "C.R.S. § 13-21-111",
    },
  },

  // ── Connecticut ──
  CT: {
    state: "Connecticut",
    stateCode: "CT",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No cap on total damages." },
      punitive: { cap: null, notes: "Punitive damages generally not available in medical malpractice in Connecticut. Only compensatory damages recoverable." },
      wrongfulDeath: { cap: null, notes: "No cap. Punitive damages may be awarded in wrongful death actions." },
      adjustsAnnually: false,
      statute: "Conn. Gen. Stat. § 52-572h",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date the injury is discovered or should have been discovered.",
      minorTolling: "Tolled during minority. Minor has until age 20 (or 2 years from discovery, whichever is later).",
      absoluteRepose: 3,
      statute: "Conn. Gen. Stat. § 52-584",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Good faith certificate and written opinion from a similar health care provider must be obtained before filing. Attorney certifies the opinion was received.",
      deadline: "Before filing the complaint.",
      statute: "Conn. Gen. Stat. § 52-190a",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a 'similar health care provider' — same specialty, board certification, and active practice in that specialty at the time the opinion is given.",
      statute: "Conn. Gen. Stat. § 52-184c",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff recovers if their fault is less than 51%.",
      statute: "Conn. Gen. Stat. § 52-572h",
    },
  },

  // ── Delaware ──
  DE: {
    state: "Delaware",
    stateCode: "DE",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "No specific statutory cap on punitive damages in med-mal." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Del. Code tit. 18, § 6853",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from injury or discovery. Discovery rule applies when injury is inherently unknowable.",
      minorTolling: "Minors under 6 have until age 6 to file. Minors over 6 subject to standard 2-year rule.",
      absoluteRepose: 3,
      statute: "Del. Code tit. 18, § 6856",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit from a qualified expert must be filed. Expert must state there are reasonable grounds to believe the applicable standard of care was breached.",
      deadline: "Within 90 days after filing the complaint.",
      statute: "Del. Code tit. 18, § 6853",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be licensed to practice medicine or another applicable profession. Must be substantially familiar with the applicable standard of care.",
      statute: "Del. Code tit. 18, § 6854",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff recovers only if their negligence is less than defendant's.",
      statute: "Del. Code tit. 10, § 8132",
    },
  },

  // ── District of Columbia ──
  DC: {
    state: "District of Columbia",
    stateCode: "DC",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "No statutory cap. Subject to constitutional due process limits." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "D.C. Code § 16-2801 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the act or omission. Discovery rule may extend when injury not immediately apparent.",
      minorTolling: "Tolled during minority. Minor has until age 21 (18 + 3 years).",
      absoluteRepose: null,
      statute: "D.C. Code § 12-301(8)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert opinion must be obtained certifying that there is a good-faith basis for the claim.",
      deadline: "Within 90 days of filing the complaint.",
      statute: "D.C. Code § 16-2802",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant field of medicine.",
      statute: "D.C. Code § 16-2802",
    },
    faultRule: {
      type: "contributory",
      description: "Pure contributory negligence. Any fault by the plaintiff completely bars recovery. One of only 4 jurisdictions + DC with this rule.",
      statute: "Common law; not codified.",
    },
  },

  // ── Florida ──
  FL: {
    state: "Florida",
    stateCode: "FL",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Florida's non-economic damage caps (previously $500K-$1M for practitioners, $750K-$1.5M for non-practitioners) were ruled unconstitutional by the Florida Supreme Court in Estate of McCall v. United States (2014) for wrongful death and North Broward Hospital District v. Kalitan (2017) for personal injury. NO CAPS CURRENTLY IN EFFECT." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Greater of 3x compensatory damages or $500K. For intentional misconduct: greater of 4x compensatory or $2M." },
      wrongfulDeath: { cap: null, notes: "Caps declared unconstitutional in Estate of McCall v. United States (2014)." },
      adjustsAnnually: false,
      statute: "Fla. Stat. § 766.118 (declared unconstitutional); Fla. Stat. § 768.73 (punitive)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from when the incident was or should have been discovered. Presuit investigation period (90 days) may toll the SOL.",
      minorTolling: "For minors under 8: tolled until age 8. Standard SOL applies from that date.",
      absoluteRepose: 4,
      statute: "Fla. Stat. § 95.11(4)(b)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Florida has a MANDATORY presuit investigation. Before filing suit, plaintiff must conduct presuit screening: (1) corroborate claim with qualified medical expert, (2) notify defendant via certified mail of intent to initiate litigation (90-day notice), (3) provide expert's verified written opinion. This is one of the most rigorous presuit requirements nationally.",
      deadline: "90-day presuit notice period before filing complaint. Expert affidavit accompanies the notice of intent.",
      statute: "Fla. Stat. §§ 766.104, 766.106, 766.203",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed, have active clinical practice or teaching in the same or similar specialty, and must have practiced or taught in the 3 years preceding the date of the occurrence. For specialists, expert must be board-certified or have equivalent training and experience.",
      statute: "Fla. Stat. § 766.102",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar) as of 2023 tort reform (HB 837). Previously pure comparative. Plaintiff barred if more than 50% at fault. MAJOR CHANGE from prior law.",
      statute: "Fla. Stat. § 768.81 (amended 2023)",
    },
  },

  // ── Georgia ──
  GA: {
    state: "Georgia",
    stateCode: "GA",
    damageCaps: {
      nonEconomic: { cap: 350000, notes: "$350K per plaintiff against all health care providers combined. $700K aggregate cap in cases involving multiple plaintiffs. However, the Georgia Supreme Court struck down the cap in Atlanta Oculoplastic Surgery v. Nestlehutt (2010). THE CAP IS CURRENTLY UNCONSTITUTIONAL." },
      total: { cap: null, notes: "No total cap. The non-economic cap was struck down." },
      punitive: { cap: 250000, notes: "$250K cap unless defendant acted with specific intent to harm or was under influence of drugs/alcohol." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap struck down. No current cap." },
      adjustsAnnually: false,
      statute: "O.C.G.A. § 51-13-1 (struck down); O.C.G.A. § 51-12-5.1 (punitive)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the negligent act. Discovery rule applies when injury is not immediately ascertainable — SOL runs from when injury is discovered or should have been discovered.",
      minorTolling: "Tolled during minority. Minor has until age 7 or 2 years from the act, whichever is later (for children under 5).",
      absoluteRepose: 5,
      statute: "O.C.G.A. § 9-3-71",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert affidavit must be filed with the complaint. At least one competent expert must attest that at least one negligent act occurred and was the proximate cause of the injury. Failure to file results in dismissal.",
      deadline: "Filed simultaneously with the complaint.",
      statute: "O.C.G.A. § 9-11-9.1",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must have practiced in the same or similar specialty as the defendant at the time the opinion is given. Must have sufficient experience to testify about the standard of care.",
      statute: "O.C.G.A. § 24-7-702",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred from recovery if 50% or more at fault.",
      statute: "O.C.G.A. § 51-12-33",
    },
  },

  // ── Hawaii ──
  HI: {
    state: "Hawaii",
    stateCode: "HI",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Hawaii's $375K non-economic cap was declared unconstitutional in 2007." },
      total: { cap: null, notes: "No cap." },
      punitive: { cap: null, notes: "Punitive damages not generally available in Hawaii." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Haw. Rev. Stat. § 663-8.7 (unconstitutional)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from discovery or when injury should have been discovered.",
      minorTolling: "Tolled during minority. SOL starts at age 18.",
      absoluteRepose: 6,
      statute: "Haw. Rev. Stat. § 657-7.3",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required. Hawaii requires medical inquiry and conciliation panel review before filing suit.",
      deadline: "N/A",
      statute: "Haw. Rev. Stat. § 671-12",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified by knowledge, skill, experience, training, or education.",
      statute: "Haw. Rev. Stat. § 671-3",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff's recovery barred if their negligence is greater than defendant's.",
      statute: "Haw. Rev. Stat. § 663-31",
    },
  },

  // ── Idaho ──
  ID: {
    state: "Idaho",
    stateCode: "ID",
    damageCaps: {
      nonEconomic: { cap: 463849, notes: "Non-economic cap of approximately $463K (adjusted annually for inflation since the base of $250K in 2003)." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "Greater of $250K or 3x compensatory damages." },
      wrongfulDeath: { cap: null, notes: "Subject to non-economic cap." },
      adjustsAnnually: true,
      statute: "Idaho Code § 6-1603",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the occurrence or from the date of discovery, or when it should have been discovered.",
      minorTolling: "Minors under 6 have until age 8. Minors 6 and older: standard 2-year rule.",
      absoluteRepose: null,
      statute: "Idaho Code § 5-219(4)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "Must submit to prelitigation screening panel before filing suit, but no certificate of merit affidavit required.",
      deadline: "N/A",
      statute: "Idaho Code § 6-1001",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be knowledgeable about the applicable local standard of care for the health care professional being sued.",
      statute: "Idaho Code § 6-1012",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred if their negligence is equal to or greater than the combined fault of all defendants.",
      statute: "Idaho Code § 6-801",
    },
  },

  // ── Illinois ──
  IL: {
    state: "Illinois",
    stateCode: "IL",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Illinois Supreme Court struck down ALL med-mal damage caps as unconstitutional in Lebron v. Gottlieb Memorial Hospital (2010). Prior caps were $500K/$1M. NO CAPS IN EFFECT." },
      total: { cap: null, notes: "No cap. Caps unconstitutional per Lebron (2010)." },
      punitive: { cap: null, notes: "Punitive damages generally not available in medical malpractice in Illinois." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "735 ILCS 5/2-1706.5 (struck down); Lebron v. Gottlieb Memorial Hospital, 237 Ill.2d 217 (2010)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date the claimant knew or should have known of the injury and that it was wrongfully caused.",
      minorTolling: "For minors under 18: 8 years from the date of the act, but no later than the minor's 22nd birthday.",
      absoluteRepose: 4,
      statute: "735 ILCS 5/13-212",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Plaintiff's attorney must file an affidavit with the complaint stating that a qualified health professional has reviewed the case and determined there is a reasonable and meritorious cause for filing. A written report from the reviewing health professional must be attached.",
      deadline: "Filed with or within 90 days of filing the complaint.",
      statute: "735 ILCS 5/2-622",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a licensed physician who is board-certified or has comparable experience in the same or substantially similar specialty. Must have devoted a majority of time to clinical practice or teaching in the 6 years preceding the testimony.",
      statute: "735 ILCS 5/8-2501",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred from recovery if more than 50% at fault. Damages reduced by fault percentage otherwise.",
      statute: "735 ILCS 5/2-1116",
    },
  },

  // ── Indiana ──
  IN: {
    state: "Indiana",
    stateCode: "IN",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Indiana does not separately cap non-economic damages. The total damages cap controls." },
      total: { cap: 1800000, notes: "$1.8M total cap for all damages (increased from $1.65M in 2019). Applies to claims filed under the Indiana Medical Malpractice Act. Provider pays first $500K; Patient's Compensation Fund covers the remainder up to $1.8M." },
      punitive: { cap: null, notes: "Punitive damages not recoverable under the Medical Malpractice Act. Potentially available outside the Act in extreme cases, but rare." },
      wrongfulDeath: { cap: null, notes: "Subject to the $1.8M total cap." },
      adjustsAnnually: false,
      statute: "Ind. Code § 34-18-14-3",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act, omission, or neglect. Discovery rule tolls the SOL when injury not immediately discernible.",
      minorTolling: "Minors under 6 have until their 8th birthday.",
      absoluteRepose: null,
      statute: "Ind. Code § 34-18-7-1",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Mandatory review by a medical review panel before filing lawsuit. Proposed complaint must be filed with the Indiana Department of Insurance. Panel issues opinion on whether provider deviated from standard of care.",
      deadline: "Proposed complaint filed within SOL period. Panel review must complete before filing in court.",
      statute: "Ind. Code § 34-18-8 et seq.",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be qualified by knowledge, skill, experience, training, or education. Must be in same or similar specialty. Medical review panel members serve as initial expert reviewers.",
      statute: "Ind. Code § 34-18-10-22",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff recovers only if their fault does not exceed 50%.",
      statute: "Ind. Code § 34-51-2-6",
    },
  },

  // ── Iowa ──
  IA: {
    state: "Iowa",
    stateCode: "IA",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No statutory cap on non-economic damages in medical malpractice (cap was ruled unconstitutional in Rose v. Physicians Ins. Co., though the Iowa legislature may revisit)." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Cap of 2x compensatory damages or $250K, whichever is greater." },
      wrongfulDeath: { cap: null, notes: "No separate cap." },
      adjustsAnnually: false,
      statute: "Iowa Code § 147.136 (struck down); Iowa Code § 668A.1 (punitive)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date the claimant knew or should have known of the injury and its cause.",
      minorTolling: "Minors under 8 have until their 10th birthday.",
      absoluteRepose: 6,
      statute: "Iowa Code § 614.1(9)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit affidavit must be filed by an expert who has reviewed the case and believes there is a genuine issue of negligence.",
      deadline: "Within 60 days of filing the petition.",
      statute: "Iowa Code § 147.140",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be familiar with the applicable standard of care and qualified in a relevant specialty.",
      statute: "Iowa Code § 147.139",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if their fault is greater than 50%.",
      statute: "Iowa Code § 668.3",
    },
  },

  // ── Kansas ──
  KS: {
    state: "Kansas",
    stateCode: "KS",
    damageCaps: {
      nonEconomic: { cap: 325000, notes: "$325K cap on non-economic damages (increased from $250K). Applies to personal injury med-mal claims." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Lesser of defendant's annual gross income or $5M. Not available against a healthcare provider acting in good faith." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "K.S.A. § 60-19a02",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the act or when injury was reasonably discoverable.",
      minorTolling: "Minors have until their 10th birthday or within the standard SOL period, whichever is later.",
      absoluteRepose: 4,
      statute: "K.S.A. § 60-513",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "Kansas requires pre-suit screening panels in some districts but no statewide certificate of merit requirement.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be competent to testify about the standard of care in the same or similar specialty.",
      statute: "K.S.A. § 60-3412",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred if their fault equals or exceeds 50%.",
      statute: "K.S.A. § 60-258a",
    },
  },

  // ── Kentucky ──
  KY: {
    state: "Kentucky",
    stateCode: "KY",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "No statutory cap specific to med-mal. General punitive damages subject to due process review." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Ky. Rev. Stat. § 411.184",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 1,
      discoveryRule: true,
      discoveryRuleDetails: "1 year from the date of the act, omission, or neglect, or from the date of discovery. One of the shortest SOLs.",
      minorTolling: "Tolled during minority. SOL runs from age 18.",
      absoluteRepose: 5,
      statute: "Ky. Rev. Stat. § 413.140(1)(e)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit from a qualified expert must be filed with the complaint.",
      deadline: "Filed with the complaint.",
      statute: "Ky. Rev. Stat. § 411.167",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be licensed and have knowledge of the standard of care applicable to the defendant.",
      statute: "Ky. Rev. Stat. § 411.167",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff can recover even if more than 50% at fault. Damages reduced proportionally.",
      statute: "Ky. Rev. Stat. § 411.182",
    },
  },

  // ── Louisiana ──
  LA: {
    state: "Louisiana",
    stateCode: "LA",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Louisiana does not separately cap non-economic damages. The total cap applies." },
      total: { cap: 500000, notes: "$500K total cap on damages (plus future medical expenses). The Patient's Compensation Fund covers amounts above $100K (provider's responsibility) up to $500K. Medical expenses are unlimited and paid from the Fund." },
      punitive: { cap: null, notes: "Punitive damages not available in Louisiana medical malpractice." },
      wrongfulDeath: { cap: null, notes: "Subject to $500K total cap plus unlimited future medical." },
      adjustsAnnually: false,
      statute: "La. R.S. § 40:1231.2",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 1,
      discoveryRule: true,
      discoveryRuleDetails: "1 year from discovery or when injury should have been discovered (prescriptive period, not technically SOL).",
      minorTolling: "Minors: prescriptive period tolled during minority.",
      absoluteRepose: 3,
      statute: "La. R.S. § 9:5628",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Mandatory medical review panel. Complaint filed with the Division of Administration. Panel of 3 physicians reviews and issues opinion before suit can be filed in court.",
      deadline: "Complaint filed with review panel within the prescriptive period.",
      statute: "La. R.S. § 40:1231.8",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be practicing in the same specialty and familiar with the degree of care ordinarily practiced by physicians in the same specialty under similar circumstances.",
      statute: "La. R.S. § 9:2794",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's recovery reduced by their percentage of fault.",
      statute: "La. Civ. Code Art. 2323",
    },
  },

  // ── Maine ──
  ME: {
    state: "Maine",
    stateCode: "ME",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages generally not available in Maine." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Me. Rev. Stat. tit. 24, § 2851 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or omission, or from the date of discovery.",
      minorTolling: "Minors under 6 have until age 8 to file.",
      absoluteRepose: null,
      statute: "Me. Rev. Stat. tit. 24, § 2902",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Pre-litigation screening panel required. Plaintiff must submit case to a prelitigation panel before filing in court.",
      deadline: "Before filing suit.",
      statute: "Me. Rev. Stat. tit. 24, § 2851",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert testimony required. Expert must be qualified in the same or similar field.",
      statute: "Me. Rev. Stat. tit. 24, § 2854",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff cannot recover if equally or more at fault.",
      statute: "Me. Rev. Stat. tit. 14, § 156",
    },
  },

  // ── Maryland ──
  MD: {
    state: "Maryland",
    stateCode: "MD",
    damageCaps: {
      nonEconomic: { cap: 920000, notes: "Non-economic cap is approximately $920K (2025 adjusted). Increases by $15K per year. For wrongful death with multiple beneficiaries, cap is 150% of the single plaintiff cap." },
      total: { cap: null, notes: "No cap on economic damages." },
      punitive: { cap: null, notes: "Punitive damages in personal injury capped at the greater of $500K or actual damages. Not commonly awarded in med-mal." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap is 150% of the personal injury cap when there are 2+ claimants (approx $1.38M in 2025)." },
      adjustsAnnually: true,
      statute: "Md. Code, Cts. & Jud. Proc. § 3-2A-09",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "Earlier of: 5 years from the date of injury, or 3 years from discovery of the injury.",
      minorTolling: "Minors under 11 have until age 14. Minors 11+: standard rules apply but SOL extended to age 16 for foreign objects.",
      absoluteRepose: 5,
      statute: "Md. Code, Cts. & Jud. Proc. § 5-109",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of qualified expert required. Expert must attest departure from standard of care and proximate causation. Attorney must file certificate and report with the complaint.",
      deadline: "Filed with the complaint. 90-day extension available for good cause.",
      statute: "Md. Code, Cts. & Jud. Proc. § 3-2A-04",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a licensed health care provider who has clinical experience, actively practices, or actively teaches in the same or a related specialty within 5 years preceding the expert's testimony.",
      statute: "Md. Code, Cts. & Jud. Proc. § 3-2A-04(b)",
    },
    faultRule: {
      type: "contributory",
      description: "Pure contributory negligence. Any fault by the plaintiff completely bars recovery. Maryland is one of only 4 states + DC to follow this harsh rule.",
      statute: "Common law; Harrison v. Montgomery County Bd. of Educ., 295 Md. 442 (1983).",
    },
  },

  // ── Massachusetts ──
  MA: {
    state: "Massachusetts",
    stateCode: "MA",
    damageCaps: {
      nonEconomic: { cap: 500000, notes: "$500K cap on non-economic damages UNLESS there is a substantial or permanent loss or impairment of bodily function, significant disfigurement, or other special circumstances. In practice, serious injuries often exceed the cap through the exception." },
      total: { cap: null, notes: "No total cap. Economic damages uncapped." },
      punitive: { cap: null, notes: "Punitive damages not available in medical malpractice in Massachusetts." },
      wrongfulDeath: { cap: null, notes: "No damages cap on wrongful death claims. Separate statute: G.L. c. 229 § 2." },
      adjustsAnnually: false,
      statute: "Mass. Gen. Laws ch. 231, § 60H",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or omission, or 3 years from the date of discovery.",
      minorTolling: "Minors under 6 have until age 9. Standard SOL for minors 6 and older.",
      absoluteRepose: 7,
      statute: "Mass. Gen. Laws ch. 260, § 4",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Offer of proof required. Plaintiff must make an 'offer of proof' to the tribunal (judge, physician, attorney panel) demonstrating that the evidence raises a legitimate question of liability. If tribunal finds insufficient evidence, plaintiff must post a bond to proceed.",
      deadline: "Heard by tribunal early in the case. Not a pre-filing requirement but an early gatekeeping mechanism.",
      statute: "Mass. Gen. Laws ch. 231, § 60B",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a qualified health care professional with experience in the same or similar area of medicine. Must be actively practicing or teaching in the relevant field.",
      statute: "Mass. Gen. Laws ch. 231, § 60B",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "Mass. Gen. Laws ch. 231, § 85",
    },
  },

  // ── Michigan ──
  MI: {
    state: "Michigan",
    stateCode: "MI",
    damageCaps: {
      nonEconomic: { cap: 497600, notes: "Non-economic cap approximately $497K (2025 adjusted). Higher cap of approximately $895K for specific serious injuries (death, permanent loss of vital function, paralysis, loss of organ, permanent injury to reproductive function). Adjusted annually." },
      total: { cap: null, notes: "No total cap. Economic damages uncapped." },
      punitive: { cap: null, notes: "Punitive damages generally not available in Michigan medical malpractice." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies. Higher cap may apply for qualifying injuries." },
      adjustsAnnually: true,
      statute: "M.C.L. § 600.1483",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or omission, or 6 months from discovery (whichever is later).",
      minorTolling: "Minors under 8 have until age 10. Minors 8 and older: standard rules.",
      absoluteRepose: 6,
      statute: "M.C.L. § 600.5838a",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit from a qualified health professional must accompany the complaint or be filed within 91 days. Affidavit must specify the standard of care, how it was breached, proximate causation, and damages.",
      deadline: "Filed with the complaint or within 91 days after filing.",
      statute: "M.C.L. § 600.2912d",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed in the same specialty, board-certified if defendant is board-certified, and must have devoted the majority of professional time to active clinical practice or teaching in the same specialty during the 3 years immediately preceding the occurrence. One of the most stringent expert requirements nationally.",
      statute: "M.C.L. § 600.2169",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "M.C.L. § 600.2959",
    },
  },

  // ── Minnesota ──
  MN: {
    state: "Minnesota",
    stateCode: "MN",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "No specific cap. Punitive damages require clear and convincing evidence of deliberate disregard." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Minn. Stat. § 549.20",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 4,
      discoveryRule: true,
      discoveryRuleDetails: "4 years from the date of the act or omission. Discovery rule may extend this for latent injuries.",
      minorTolling: "Minors under 18: SOL tolled until age 18, then standard 4-year SOL applies.",
      absoluteRepose: null,
      statute: "Minn. Stat. § 541.076",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert affidavit must be served with the summons and complaint identifying the expert and the facts supporting the claim.",
      deadline: "Served with the initial complaint.",
      statute: "Minn. Stat. § 145.682",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the same or similar specialty as the defendant.",
      statute: "Minn. Stat. § 145.682",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff's fault must be less than the combined fault of defendants.",
      statute: "Minn. Stat. § 604.01",
    },
  },

  // ── Mississippi ──
  MS: {
    state: "Mississippi",
    stateCode: "MS",
    damageCaps: {
      nonEconomic: { cap: 500000, notes: "$500K non-economic cap for non-catastrophic cases. $1M for catastrophic cases." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Cap at the greater of $20M or 2% of defendant's net worth." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "Miss. Code § 11-1-60",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or omission, with discovery rule for latent injuries.",
      minorTolling: "Minors under 18 have tolling. SOL runs from age 18.",
      absoluteRepose: 7,
      statute: "Miss. Code § 15-1-36",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert certification required. Must file certificate of consultation with expert and expert's opinion that claim has merit.",
      deadline: "Filed with the complaint.",
      statute: "Miss. Code § 11-1-58",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must have specialized training and experience in the same specialty as the defendant.",
      statute: "Miss. Code § 11-1-58",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's recovery reduced by their percentage of fault, regardless of amount.",
      statute: "Miss. Code § 11-7-15",
    },
  },

  // ── Missouri ──
  MO: {
    state: "Missouri",
    stateCode: "MO",
    damageCaps: {
      nonEconomic: { cap: 400000, notes: "$400K non-economic cap for non-catastrophic injury. $700K for catastrophic injury or death. Adjusted periodically (caps originally set in 2005 reform)." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "No specific med-mal punitive cap. General punitive damages subject to due process limits." },
      wrongfulDeath: { cap: null, notes: "Catastrophic/$700K cap may apply. Economic damages uncapped." },
      adjustsAnnually: false,
      statute: "Mo. Rev. Stat. § 538.210",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act of neglect, or from the date of discovery (or when injury should have been discovered).",
      minorTolling: "Minors under 18 at time of injury: SOL tolled until age 20.",
      absoluteRepose: 10,
      statute: "Mo. Rev. Stat. § 516.105",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit from a legally qualified health care provider required. Must state the provider reviewed the facts and has a good faith belief that defendant's care fell below the standard of care and caused injury.",
      deadline: "Within 90 days of filing the petition.",
      statute: "Mo. Rev. Stat. § 538.225",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a qualified health care provider in the same or similar specialty. Must have active clinical practice experience or teaching within 5 years preceding the occurrence.",
      statute: "Mo. Rev. Stat. § 538.210",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's recovery reduced by fault percentage; can recover even if primarily at fault.",
      statute: "Mo. Rev. Stat. § 537.765",
    },
  },

  // ── Montana ──
  MT: {
    state: "Montana",
    stateCode: "MT",
    damageCaps: {
      nonEconomic: { cap: 250000, notes: "$250K non-economic cap." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "$10M or 3% of defendant's net worth, whichever is less." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "Mont. Code § 25-9-411",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the act or omission, or from discovery.",
      minorTolling: "Minors: tolled during minority. SOL runs from age 18.",
      absoluteRepose: 5,
      statute: "Mont. Code § 27-2-205",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant field.",
      statute: "Mont. Code § 26-10-401",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more at fault than defendant.",
      statute: "Mont. Code § 27-1-702",
    },
  },

  // ── Nebraska ──
  NE: {
    state: "Nebraska",
    stateCode: "NE",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Nebraska does not separately cap non-economic damages. Total cap controls." },
      total: { cap: 2250000, notes: "$2.25M total cap (increased from $1.75M effective 2015). Provider is liable for first $500K; Excess Liability Fund covers the remainder." },
      punitive: { cap: null, notes: "Punitive damages not available in Nebraska." },
      wrongfulDeath: { cap: null, notes: "Subject to $2.25M total cap." },
      adjustsAnnually: false,
      statute: "Neb. Rev. Stat. § 44-2825",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the alleged act or omission. Discovery rule: 1 year from discovery, subject to the 10-year repose.",
      minorTolling: "Minors under 6: until age 8 or within the standard SOL, whichever is later.",
      absoluteRepose: 10,
      statute: "Neb. Rev. Stat. § 44-2828",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No formal certificate of merit. Claims must be filed with the Excess Liability Fund for medical review panel.",
      deadline: "N/A",
      statute: "Neb. Rev. Stat. § 44-2840",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in same or similar specialty.",
      statute: "Neb. Rev. Stat. § 44-2824",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred if their negligence is equal to or greater than defendant's.",
      statute: "Neb. Rev. Stat. § 25-21,185.09",
    },
  },

  // ── Nevada ──
  NV: {
    state: "Nevada",
    stateCode: "NV",
    damageCaps: {
      nonEconomic: { cap: 350000, notes: "$350K non-economic cap." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "3x compensatory damages if compensatory is $100K+. $300K if compensatory is less than $100K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "Nev. Rev. Stat. § 42.005 (punitive); Nev. Rev. Stat. § 41A.035 (non-economic)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the act or 1 year from discovery, whichever is earlier. Tolled for concealment or continuing treatment.",
      minorTolling: "Minors under 10: until age 10 or within the SOL, whichever is later.",
      absoluteRepose: null,
      statute: "Nev. Rev. Stat. § 41A.097",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit from a medical expert must support the claim. Expert must have reviewed records and found a medical provider's negligence likely caused injury.",
      deadline: "Filed with or shortly after the complaint.",
      statute: "Nev. Rev. Stat. § 41A.071",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must hold the same or similar specialty and have practiced in the specialty 3 of the 5 years preceding the incident.",
      statute: "Nev. Rev. Stat. § 41A.015",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if 51% or more at fault.",
      statute: "Nev. Rev. Stat. § 41.141",
    },
  },

  // ── New Hampshire ──
  NH: {
    state: "New Hampshire",
    stateCode: "NH",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages generally not available in New Hampshire tort law." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "N.H. Rev. Stat. § 507-E",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the act or omission, or 3 years from discovery.",
      minorTolling: "Minors under 18: tolled until age 18, then standard SOL.",
      absoluteRepose: null,
      statute: "N.H. Rev. Stat. § 507-C:4",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "Screening panel required before trial but no certificate of merit affidavit.",
      deadline: "N/A",
      statute: "N.H. Rev. Stat. § 519-B",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant medical specialty.",
      statute: "N.H. Rev. Stat. § 507-E:2",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if 51% or more at fault.",
      statute: "N.H. Rev. Stat. § 507:7-d",
    },
  },

  // ── New Jersey ──
  NJ: {
    state: "New Jersey",
    stateCode: "NJ",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages in medical malpractice." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "Punitive damages capped at 5x compensatory damages or $350K, whichever is greater (applies generally, including med-mal)." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "N.J. Stat. § 2A:15-5.14 (punitive cap)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or from discovery. New Jersey has a robust discovery rule — SOL does not begin until patient knows or has reason to know of the injury and its cause.",
      minorTolling: "Minors: tolled until age 18. Then standard 2-year SOL applies (claim must be filed by age 20).",
      absoluteRepose: null,
      statute: "N.J. Stat. § 2A:14-2",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit required within 60 days of defendant's answer. Must be from a qualified physician who has reviewed the records and concluded there is a reasonable probability that the care fell outside acceptable professional standards.",
      deadline: "Within 60 days after the answer is filed by each defendant.",
      statute: "N.J. Stat. § 2A:53A-27",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must have the same specialty or subspecialty as the defendant and must have practiced or taught within the 5 years preceding the alleged act of malpractice. For board-certified defendants, expert must also be board-certified or board-eligible in the same specialty.",
      statute: "N.J. Stat. § 2A:53A-41",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff's recovery reduced by fault percentage; barred if more than 50% at fault.",
      statute: "N.J. Stat. § 2A:15-5.1",
    },
  },

  // ── New Mexico ──
  NM: {
    state: "New Mexico",
    stateCode: "NM",
    damageCaps: {
      nonEconomic: { cap: null, notes: "New Mexico does not separately cap non-economic damages. Total cap controls for claims under the Medical Malpractice Act." },
      total: { cap: 750000, notes: "$750K total cap (increased from $600K in 2021). Applies to claims under the Medical Malpractice Act. Provider pays first $200K; Patient's Compensation Fund covers the remainder." },
      punitive: { cap: null, notes: "Punitive damages not available under the Medical Malpractice Act." },
      wrongfulDeath: { cap: null, notes: "Subject to the $750K total cap." },
      adjustsAnnually: false,
      statute: "N.M. Stat. § 41-5-6",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or from when the injury was or should have been discovered.",
      minorTolling: "Minors under 6: tolled until age 9. Minors 6+: standard SOL.",
      absoluteRepose: null,
      statute: "N.M. Stat. § 41-5-13",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit requirement. Claims under the Malpractice Act must be submitted to a medical review panel.",
      deadline: "N/A",
      statute: "N.M. Stat. § 41-5-15",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant field and familiar with the standard of care.",
      statute: "N.M. Stat. § 41-5-6",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's recovery reduced by percentage of fault; no threshold for bar.",
      statute: "N.M. Stat. § 41-3A-1",
    },
  },

  // ── New York ──
  NY: {
    state: "New York",
    stateCode: "NY",
    damageCaps: {
      nonEconomic: { cap: null, notes: "NO cap on non-economic damages. New York has never enacted med-mal damage caps. This makes New York one of the most plaintiff-friendly states for large verdicts." },
      total: { cap: null, notes: "No total damages cap." },
      punitive: { cap: null, notes: "No statutory cap on punitive damages. Subject to due process proportionality review." },
      wrongfulDeath: { cap: null, notes: "No cap. Wrongful death damages include pecuniary losses to distributees." },
      adjustsAnnually: false,
      statute: "N.Y. CPLR § 4111 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2.5,
      discoveryRule: true,
      discoveryRuleDetails: "2 years 6 months from the date of the act or omission. Foreign object discovery rule: 1 year from discovery of a foreign object left in the body. Continuous treatment doctrine extends SOL while patient continues treatment with same provider for same condition.",
      minorTolling: "Minors under 18: SOL tolled until age 18, then standard 2.5-year period. But total time from the act cannot exceed 10 years.",
      absoluteRepose: 10,
      statute: "N.Y. CPLR § 214-a",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit required. Attorney must file a certificate at time of filing stating that the attorney has reviewed the facts and consulted with at least one physician who is knowledgeable in the relevant area and that there is a reasonable basis for the commencement of the action.",
      deadline: "Filed with the complaint.",
      statute: "N.Y. CPLR § 3012-a",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be a physician or other qualified professional. Must demonstrate familiarity with the standard of care applicable to the defendant. Same specialty preferred but not strictly required if expert demonstrates requisite knowledge.",
      statute: "N.Y. CPLR § 3012-a; Case law: Behar v. Coren (2008).",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault (CPLR Art. 14-A). Plaintiff's recovery reduced by fault percentage. Can recover even if 99% at fault.",
      statute: "N.Y. CPLR § 1411",
    },
  },

  // ── North Carolina ──
  NC: {
    state: "North Carolina",
    stateCode: "NC",
    damageCaps: {
      nonEconomic: { cap: 500000, notes: "$500K cap on non-economic damages. Does NOT apply to wrongful death or claims involving permanent vegetative state." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Greater of 3x compensatory damages or $250K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap does NOT apply to wrongful death claims." },
      adjustsAnnually: false,
      statute: "N.C. Gen. Stat. § 90-21.19",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the last act giving rise to the claim. Discovery rule extends for foreign objects (1 year from discovery).",
      minorTolling: "Minors under 18: tolled until age 19 (or standard SOL, whichever is longer).",
      absoluteRepose: 4,
      statute: "N.C. Gen. Stat. § 1-15(c)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Rule 9(j) certification required. Complaint must assert that medical records have been reviewed by a person reasonably expected to qualify as an expert and that the expert is willing to testify that the medical care did not meet the standard of care.",
      deadline: "Included in the complaint at time of filing.",
      statute: "N.C. R. Civ. P. 9(j)",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must practice or have practiced in the same or similar specialty as the defendant. Must be familiar with the standard of care at the time of the alleged malpractice.",
      statute: "N.C. Gen. Stat. § 90-21.12",
    },
    faultRule: {
      type: "contributory",
      description: "Pure contributory negligence. Any fault by the plaintiff completely bars recovery. North Carolina is one of only 4 states + DC with this rule. Harsh for plaintiffs.",
      statute: "Common law; N.C. Gen. Stat. § 99B-4 (products); general common law for med-mal.",
    },
  },

  // ── North Dakota ──
  ND: {
    state: "North Dakota",
    stateCode: "ND",
    damageCaps: {
      nonEconomic: { cap: 500000, notes: "$500K non-economic cap." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Greater of 2x compensatory or $250K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "N.D. Cent. Code § 32-42-02",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the act or from discovery.",
      minorTolling: "Minors under 18: tolled until age 18, then standard SOL.",
      absoluteRepose: 6,
      statute: "N.D. Cent. Code § 28-01-18(3)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be familiar with the standard of care in the relevant specialty.",
      statute: "N.D. Cent. Code § 28-01-46",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if their fault is as great as the combined fault of all persons against whom recovery is sought.",
      statute: "N.D. Cent. Code § 32-03.2-02",
    },
  },

  // ── Ohio ──
  OH: {
    state: "Ohio",
    stateCode: "OH",
    damageCaps: {
      nonEconomic: { cap: 250000, notes: "$250K or 3x economic damages, whichever is greater (up to $500K maximum per plaintiff). For catastrophic injury (permanent vegetative state, death, permanent physical deformity, permanent loss of use of organ or limb), NO cap applies." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "2x compensatory damages. Small employers: lesser of 2x compensatory or 10% of net worth up to $350K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap may apply unless catastrophic injury exception met." },
      adjustsAnnually: false,
      statute: "Ohio Rev. Code § 2323.43",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 1,
      discoveryRule: true,
      discoveryRuleDetails: "1 year from the date of the act or omission, or from when the patient discovered or should have discovered the injury. One of the shortest SOLs in the country.",
      minorTolling: "Minors under 18: tolled during minority. Must file within 1 year of reaching age 18.",
      absoluteRepose: 4,
      statute: "Ohio Rev. Code § 2305.113",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit from a qualified expert must accompany the complaint. Expert must state the standard of care, how it was breached, and how the breach caused injury.",
      deadline: "Filed with the complaint.",
      statute: "Ohio Rev. Code § 2305.113(B)(1)",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed to practice medicine, have devoted at least 50% of professional time to active clinical practice in the same or similar specialty within 3 years preceding the occurrence. If defendant is board-certified, expert should ideally be board-certified in the same specialty.",
      statute: "Ohio Rev. Code § 2743.43",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "Ohio Rev. Code § 2315.33",
    },
  },

  // ── Oklahoma ──
  OK: {
    state: "Oklahoma",
    stateCode: "OK",
    damageCaps: {
      nonEconomic: { cap: 400000, notes: "$400K non-economic cap. Adjusted for inflation." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Greater of $100K or actual damages. $500K for reckless disregard. $1M for intentional conduct." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: true,
      statute: "Okla. Stat. tit. 63, § 1-1708.1F",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or from discovery of the injury.",
      minorTolling: "Minors under 12: tolled until age 12, then standard SOL. Minors 12+: standard SOL.",
      absoluteRepose: null,
      statute: "Okla. Stat. tit. 76, § 18",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Affidavit of merit required with complaint. Expert must attest that standard of care was breached and caused injury.",
      deadline: "Filed with the complaint.",
      statute: "Okla. Stat. tit. 12, § 19.1",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed and actively practicing in the same or similar specialty.",
      statute: "Okla. Stat. tit. 63, § 1-1708.1E",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "Okla. Stat. tit. 23, § 14",
    },
  },

  // ── Oregon ──
  OR: {
    state: "Oregon",
    stateCode: "OR",
    damageCaps: {
      nonEconomic: { cap: 500000, notes: "$500K non-economic cap. However, the Oregon Supreme Court struck down the cap as unconstitutional in Horton v. Oregon Health & Science University (2016) for claims against public bodies. Status is complex — cap may still apply against private providers." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "No specific statutory cap. Subject to constitutional limits." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap status uncertain per Horton ruling." },
      adjustsAnnually: false,
      statute: "ORS § 31.710 (partially struck down)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from discovery of the injury or when injury should have been discovered.",
      minorTolling: "Minors under 18: tolled until age 18, then standard SOL.",
      absoluteRepose: 5,
      statute: "ORS § 12.110(4)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit requirement.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified by knowledge, skill, experience, training, or education.",
      statute: "ORS § 677.095",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more at fault than the combined fault of all defendants.",
      statute: "ORS § 31.600",
    },
  },

  // ── Pennsylvania ──
  PA: {
    state: "Pennsylvania",
    stateCode: "PA",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages. Pennsylvania does not limit pain and suffering or other non-economic damages in medical malpractice." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages available for outrageous conduct. No statutory cap but subject to due process proportionality." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "40 Pa. Stat. § 1301.101 et seq. (MCARE Act)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or from when the injury was or should have been discovered. Pennsylvania's discovery rule is well-established — the SOL starts when the plaintiff knows or should know of the injury.",
      minorTolling: "Minors under 18: tolled until age 18, then standard 2-year SOL (must file by age 20). For minors under 18 at the time of the injury.",
      absoluteRepose: 7,
      statute: "42 Pa. C.S. § 5524(2)",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit required within 60 days of filing the complaint. An appropriate licensed professional must provide a written statement that there is a reasonable probability that the care fell outside acceptable professional standards and caused the harm.",
      deadline: "Within 60 days of filing the complaint.",
      statute: "Pa. R.C.P. 1042.3",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be an appropriate licensed professional who actively practices in the same subspecialty as the defendant or has experience in the specific area of care at issue.",
      statute: "Pa. R.C.P. 1042.3; 40 Pa. Stat. § 1303.512",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff's recovery barred if their negligence is greater than the defendant's. Damages reduced by fault percentage otherwise.",
      statute: "42 Pa. C.S. § 7102",
    },
  },

  // ── Rhode Island ──
  RI: {
    state: "Rhode Island",
    stateCode: "RI",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages generally not available in Rhode Island medical malpractice." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "R.I. Gen. Laws § 9-19-34 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or from discovery.",
      minorTolling: "Minors under 18: tolled until age 18.",
      absoluteRepose: null,
      statute: "R.I. Gen. Laws § 9-1-14.1",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant field of practice.",
      statute: "R.I. Gen. Laws § 9-19-41",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's recovery reduced by fault percentage with no bar threshold.",
      statute: "R.I. Gen. Laws § 9-20-4",
    },
  },

  // ── South Carolina ──
  SC: {
    state: "South Carolina",
    stateCode: "SC",
    damageCaps: {
      nonEconomic: { cap: 350000, notes: "$350K non-economic cap per defendant. Does not apply to cases involving death or permanent disfigurement." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Greater of 3x compensatory or $500K." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap may not apply to wrongful death." },
      adjustsAnnually: false,
      statute: "S.C. Code § 15-32-220",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or omission, or from discovery.",
      minorTolling: "Minors under 18: tolled until age 18, but subject to the 6-year statute of repose.",
      absoluteRepose: 6,
      statute: "S.C. Code § 15-3-545",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert affidavit required with filing. Expert must verify that a breach of standard of care caused the claimed injuries.",
      deadline: "Filed with the complaint. 45-day extension available.",
      statute: "S.C. Code § 15-36-100",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be qualified and practicing in the same or similar field as the defendant.",
      statute: "S.C. Code § 15-36-100",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "S.C. Code § 15-1-300",
    },
  },

  // ── South Dakota ──
  SD: {
    state: "South Dakota",
    stateCode: "SD",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages. South Dakota Constitution prohibits caps." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "No specific cap. Subject to constitutional review." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "S.D. Const. Art. VI, § 20",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the act or omission, or from discovery.",
      minorTolling: "Minors under 18: tolled until age 18.",
      absoluteRepose: null,
      statute: "S.D. Codified Laws § 15-2-14.1",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit required. Expert must provide opinion that there is reasonable cause for the claim.",
      deadline: "Filed with the complaint.",
      statute: "S.D. Codified Laws § 21-3-30",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant specialty.",
      statute: "S.D. Codified Laws § 19-15-2",
    },
    faultRule: {
      type: "slight_gross",
      description: "Slight/gross comparative negligence. Plaintiff's contributory negligence must be 'slight' compared to defendant's 'gross' negligence to recover. Unique to South Dakota. Very defense-favorable.",
      statute: "S.D. Codified Laws § 20-9-2",
    },
  },

  // ── Tennessee ──
  TN: {
    state: "Tennessee",
    stateCode: "TN",
    damageCaps: {
      nonEconomic: { cap: 750000, notes: "$750K non-economic cap. Increased to $1M for catastrophic injury (spinal cord, amputation of two or more limbs, third-degree burns over 40% of body, or wrongful death of a parent leaving minor children)." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Greater of 2x compensatory damages or $500K." },
      wrongfulDeath: { cap: null, notes: "Subject to the non-economic cap ($750K standard, $1M catastrophic)." },
      adjustsAnnually: false,
      statute: "Tenn. Code § 29-39-102",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 1,
      discoveryRule: true,
      discoveryRuleDetails: "1 year from the date of the negligent act or from when injury was or should have been discovered. One of the shortest SOLs.",
      minorTolling: "Minors: tolled until age of majority. Must file within 1 year after reaching age 18.",
      absoluteRepose: 3,
      statute: "Tenn. Code § 29-26-116",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of good faith required. Before filing, plaintiff's attorney must consult with one or more experts and determine there is a good faith basis to maintain the action. Written statement to this effect is filed with the complaint.",
      deadline: "Filed with the complaint.",
      statute: "Tenn. Code § 29-26-122",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed in the same state or a contiguous state, practice in the same specialty, and have been practicing in the specialty during the year preceding the date the alleged injury occurred.",
      statute: "Tenn. Code § 29-26-115",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff's negligence must be less than defendant's to recover. Barred at 50% or more.",
      statute: "Tenn. Code § 29-11-103",
    },
  },

  // ── Texas ──
  TX: {
    state: "Texas",
    stateCode: "TX",
    damageCaps: {
      nonEconomic: { cap: 250000, notes: "$250K per claimant against each physician/individual provider. $250K against each healthcare institution, with a maximum of $500K against all institutions combined. These caps apply to ALL non-economic damages including pain and suffering, mental anguish, disfigurement, physical impairment, and loss of companionship." },
      total: { cap: null, notes: "No cap on economic damages (medical expenses, lost wages)." },
      punitive: { cap: null, notes: "Greater of 2x economic damages + $750K, or $200K. Cap does not apply to certain intentional acts." },
      wrongfulDeath: { cap: null, notes: "Same non-economic cap structure: $250K per provider, $500K max against institutions." },
      adjustsAnnually: false,
      statute: "Tex. Civ. Prac. & Rem. Code § 74.301-303",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the occurrence of the breach or tort, or from the last date of relevant treatment/hospitalization. Discovery rule is narrow in Texas — generally the clock starts from the date of the act, not discovery, though exceptions exist for fraudulent concealment.",
      minorTolling: "Minors under 12: tolled until age 14 (essentially 2 years after turning 12). Minors 12+: standard 2-year SOL.",
      absoluteRepose: 10,
      statute: "Tex. Civ. Prac. & Rem. Code § 74.251",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Expert report required within 120 days of filing. A qualified expert must provide a written report describing: (1) the applicable standard of care, (2) the manner in which the care failed to meet the standard, and (3) the causal relationship between the failure and the claimed injury. Failure to serve the expert report on time results in MANDATORY dismissal with prejudice.",
      deadline: "120 days after the petition is filed. 30-day grace period may be granted.",
      statute: "Tex. Civ. Prac. & Rem. Code § 74.351",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be practicing or teaching medicine at the time of testimony. Must be actively practicing in the same or similar specialty. Must be board-certified in the relevant specialty or have comparable training and experience. Must have dedicated the majority of clinical time to the same area of practice. Texas expert requirements are among the most stringent nationally.",
      statute: "Tex. Civ. Prac. & Rem. Code § 74.401-403",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if their percentage of responsibility is greater than 50%. Damages reduced by fault percentage.",
      statute: "Tex. Civ. Prac. & Rem. Code § 33.001",
    },
  },

  // ── Utah ──
  UT: {
    state: "Utah",
    stateCode: "UT",
    damageCaps: {
      nonEconomic: { cap: 450000, notes: "$450K non-economic cap." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "No specific statutory cap. Must be proportional to actual harm." },
      wrongfulDeath: { cap: null, notes: "Non-economic cap applies." },
      adjustsAnnually: false,
      statute: "Utah Code § 78B-3-410",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or from discovery. Foreign objects: 1 year from discovery.",
      minorTolling: "Minors: tolled until age 18.",
      absoluteRepose: 4,
      statute: "Utah Code § 78B-3-404",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Pre-litigation panel review required. Plaintiff must submit to a pre-litigation review by a medical panel before filing suit.",
      deadline: "Before filing a lawsuit.",
      statute: "Utah Code § 78B-3-416",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the relevant field. Testimony must establish the standard of care, breach, and causation.",
      statute: "Utah Code § 78B-3-406",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff barred if fault equals or exceeds defendant's.",
      statute: "Utah Code § 78B-5-818",
    },
  },

  // ── Vermont ──
  VT: {
    state: "Vermont",
    stateCode: "VT",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages generally not available in Vermont medical malpractice." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Vt. Stat. tit. 12, § 1908 et seq.",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the act or from discovery.",
      minorTolling: "Minors: tolled until age 18.",
      absoluteRepose: 7,
      statute: "Vt. Stat. tit. 12, § 521",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the same or similar field.",
      statute: "Vt. Stat. tit. 12, § 1908",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if their fault exceeds 50%.",
      statute: "Vt. Stat. tit. 12, § 1036",
    },
  },

  // ── Virginia ──
  VA: {
    state: "Virginia",
    stateCode: "VA",
    damageCaps: {
      nonEconomic: { cap: null, notes: "Virginia does not separately cap non-economic damages. The total cap controls." },
      total: { cap: 2550000, notes: "$2.55M total cap on all damages (as of 2025). Increases by $50K per year. This is one of the most significant caps nationally as it limits TOTAL recovery including economic damages." },
      punitive: { cap: 350000, notes: "$350K cap on punitive damages." },
      wrongfulDeath: { cap: null, notes: "Subject to the total damages cap." },
      adjustsAnnually: true,
      statute: "Va. Code § 8.01-581.15",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act or omission. Discovery rule applies: SOL runs from when plaintiff knew or should have known of the injury.",
      minorTolling: "Minors under 18: tolled until age 18, then standard 2-year SOL. For minors under 8: additional protections may extend time.",
      absoluteRepose: 10,
      statute: "Va. Code § 8.01-243",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certification required. Before filing, plaintiff's counsel must obtain a written opinion from an expert that the defendant deviated from the standard of care and the deviation was a proximate cause of the injuries.",
      deadline: "Before filing. Certificate filed with the complaint.",
      statute: "Va. Code § 8.01-20.1",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must have expertise in the same specialty or a related field. Must have active clinical experience or teaching in the field within the last several years.",
      statute: "Va. Code § 8.01-581.20",
    },
    faultRule: {
      type: "contributory",
      description: "Pure contributory negligence. ANY fault by the plaintiff completely bars recovery. Virginia is one of only 4 states + DC with this extremely defense-favorable rule.",
      statute: "Common law; not codified.",
    },
  },

  // ── Washington ──
  WA: {
    state: "Washington",
    stateCode: "WA",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages. Washington has no statutory caps on medical malpractice damages." },
      total: { cap: null, notes: "No total cap." },
      punitive: { cap: null, notes: "Punitive damages not available in Washington (not recognized in tort law)." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Wash. Rev. Code § 7.70 (Medical Malpractice Act)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the act or omission, or 1 year from when the patient discovered or should have discovered the injury, whichever is later.",
      minorTolling: "Minors under 18: tolled until age 18, then standard SOL. But subject to 8-year statute of repose.",
      absoluteRepose: 8,
      statute: "Wash. Rev. Code § 4.16.350",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Certificate of merit required. Before filing, plaintiff must obtain a certificate from a qualified expert stating there is a reasonable probability that the defendant's conduct fell below the applicable standard of care.",
      deadline: "Before filing suit. Must be produced during discovery.",
      statute: "Wash. Rev. Code § 7.70.150",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be a competent practitioner in the same or similar field, who practices or has recently practiced in the relevant area of medicine.",
      statute: "Wash. Rev. Code § 7.70.040",
    },
    faultRule: {
      type: "pure_comparative",
      description: "Pure comparative fault. Plaintiff's damages reduced by their percentage of fault. No bar at any percentage.",
      statute: "Wash. Rev. Code § 4.22.005",
    },
  },

  // ── West Virginia ──
  WV: {
    state: "West Virginia",
    stateCode: "WV",
    damageCaps: {
      nonEconomic: { cap: 250000, notes: "$250K non-economic cap. $500K for cases involving death, permanent and substantial physical deformity, or loss of use of a hand, foot, arm, or leg." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Generally not available in med-mal. Available only for willful, wanton, or malicious conduct." },
      wrongfulDeath: { cap: null, notes: "Higher $500K non-economic cap may apply." },
      adjustsAnnually: false,
      statute: "W. Va. Code § 55-7B-8",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the injury or from the date the injury was discovered or should have been discovered.",
      minorTolling: "Minors under 10: tolled until age 12. Otherwise standard SOL.",
      absoluteRepose: 10,
      statute: "W. Va. Code § 55-7B-4",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: true,
      details: "Screening certificate of merit required. Before filing, plaintiff must obtain a screening certificate from a qualified health care provider stating that the claim has merit. Pre-suit notice of claim also required.",
      deadline: "30-day pre-suit notice to defendant before filing. Certificate obtained before filing.",
      statute: "W. Va. Code § 55-7B-6",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: true,
      details: "Expert must be licensed and experienced in the same or similar specialty as the defendant and have practiced in the specialty within 3 years of the incident.",
      statute: "W. Va. Code § 55-7B-7",
    },
    faultRule: {
      type: "modified_50",
      description: "Modified comparative fault (50% bar). Plaintiff's recovery barred if their fault is equal to or exceeds the combined negligence of all other parties.",
      statute: "W. Va. Code § 55-7-13a",
    },
  },

  // ── Wisconsin ──
  WI: {
    state: "Wisconsin",
    stateCode: "WI",
    damageCaps: {
      nonEconomic: { cap: 750000, notes: "$750K non-economic cap. This cap was upheld by the Wisconsin Supreme Court in Mayo v. Wisconsin Injured Patients and Families Compensation Fund (2018)." },
      total: { cap: null, notes: "No total cap on economic damages." },
      punitive: { cap: null, notes: "Punitive damages generally not available in Wisconsin medical malpractice." },
      wrongfulDeath: { cap: null, notes: "Subject to the $750K non-economic cap." },
      adjustsAnnually: false,
      statute: "Wis. Stat. § 893.55(4)(d)",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 3,
      discoveryRule: true,
      discoveryRuleDetails: "3 years from the date of the injury or from discovery. Discovery rule applies for latent injuries.",
      minorTolling: "Minors under 18: tolled until age 18, then standard SOL.",
      absoluteRepose: 5,
      statute: "Wis. Stat. § 893.55",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit or affidavit of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified by knowledge, skill, experience, training, or education to testify about the standard of care.",
      statute: "Wis. Stat. § 907.02",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if their negligence is greater than the causal negligence of the defendant.",
      statute: "Wis. Stat. § 895.045",
    },
  },

  // ── Wyoming ──
  WY: {
    state: "Wyoming",
    stateCode: "WY",
    damageCaps: {
      nonEconomic: { cap: null, notes: "No cap on non-economic damages. Wyoming Constitution Art. 10, § 4 prohibits legislative limitation on damages." },
      total: { cap: null, notes: "No total cap. Constitutional protection." },
      punitive: { cap: null, notes: "No specific cap. Due process limits apply." },
      wrongfulDeath: { cap: null, notes: "No cap." },
      adjustsAnnually: false,
      statute: "Wyo. Const. Art. 10, § 4",
      lastVerified: "2025-01",
    },
    sol: {
      generalYears: 2,
      discoveryRule: true,
      discoveryRuleDetails: "2 years from the date of the act, error, or omission, or from discovery.",
      minorTolling: "Minors under 18: tolled until age 18.",
      absoluteRepose: null,
      statute: "Wyo. Stat. § 1-3-107",
      lastVerified: "2025-01",
    },
    certificateOfMerit: {
      required: false,
      details: "No certificate of merit required.",
      deadline: "N/A",
      statute: "N/A",
    },
    expertWitness: {
      sameSpecialtyRequired: true,
      activePracticeRequired: false,
      details: "Expert must be qualified in the same or similar area of practice.",
      statute: "Wyo. Stat. § 1-12-601",
    },
    faultRule: {
      type: "modified_51",
      description: "Modified comparative fault (51% bar). Plaintiff barred if more than 50% at fault.",
      statute: "Wyo. Stat. § 1-1-109",
    },
  },
};

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

/**
 * Look up state medical malpractice law by state code (e.g., "CA", "TX").
 * Also accepts full state names (case-insensitive).
 */
export function getStateLaw(stateCode: string): StateMedMalLaw | null {
  const normalized = stateCode.trim().toUpperCase();

  // Direct code lookup
  if (STATE_LAWS[normalized]) {
    return STATE_LAWS[normalized];
  }

  // Full name lookup
  const byName = Object.values(STATE_LAWS).find(
    (s) => s.state.toUpperCase() === normalized
  );
  return byName ?? null;
}

/**
 * Human-readable summary of a state's med-mal law for injection into analysis prompts.
 */
export function getStateLawSummary(stateCode: string): string {
  const law = getStateLaw(stateCode);
  if (!law) return "";

  const lines: string[] = [];
  lines.push(`## ${law.state} (${law.stateCode}) — Medical Malpractice Law Summary`);
  lines.push("");

  // Damage caps
  lines.push("### Damage Caps");
  if (law.damageCaps.nonEconomic.cap !== null) {
    lines.push(`- Non-economic: $${law.damageCaps.nonEconomic.cap.toLocaleString()} — ${law.damageCaps.nonEconomic.notes}`);
  } else {
    lines.push(`- Non-economic: ${law.damageCaps.nonEconomic.notes}`);
  }
  if (law.damageCaps.total.cap !== null) {
    lines.push(`- Total: $${law.damageCaps.total.cap.toLocaleString()} — ${law.damageCaps.total.notes}`);
  } else {
    lines.push(`- Total: ${law.damageCaps.total.notes}`);
  }
  if (law.damageCaps.punitive.cap !== null) {
    lines.push(`- Punitive: $${law.damageCaps.punitive.cap.toLocaleString()} — ${law.damageCaps.punitive.notes}`);
  } else {
    lines.push(`- Punitive: ${law.damageCaps.punitive.notes}`);
  }
  lines.push(`- Wrongful death: ${law.damageCaps.wrongfulDeath.notes}`);
  if (law.damageCaps.adjustsAnnually) {
    lines.push("- **Caps adjust annually for inflation — verify current amounts.**");
  }
  lines.push(`- Statute: ${law.damageCaps.statute}`);
  lines.push("");

  // SOL
  lines.push("### Statute of Limitations");
  lines.push(`- General: ${law.sol.generalYears} year(s) from the date of the act/omission`);
  lines.push(`- Discovery rule: ${law.sol.discoveryRule ? "Yes" : "No"} — ${law.sol.discoveryRuleDetails}`);
  lines.push(`- Minor tolling: ${law.sol.minorTolling}`);
  if (law.sol.absoluteRepose !== null) {
    lines.push(`- Absolute statute of repose: ${law.sol.absoluteRepose} years`);
  } else {
    lines.push("- Absolute statute of repose: None");
  }
  lines.push(`- Statute: ${law.sol.statute}`);
  lines.push("");

  // Certificate of merit
  lines.push("### Certificate of Merit / Affidavit of Merit");
  lines.push(`- Required: ${law.certificateOfMerit.required ? "YES" : "No"}`);
  lines.push(`- Details: ${law.certificateOfMerit.details}`);
  if (law.certificateOfMerit.required) {
    lines.push(`- Deadline: ${law.certificateOfMerit.deadline}`);
    lines.push(`- Statute: ${law.certificateOfMerit.statute}`);
  }
  lines.push("");

  // Expert witness
  lines.push("### Expert Witness Requirements");
  lines.push(`- Same specialty required: ${law.expertWitness.sameSpecialtyRequired ? "Yes" : "No"}`);
  lines.push(`- Active practice required: ${law.expertWitness.activePracticeRequired ? "Yes" : "No"}`);
  lines.push(`- Details: ${law.expertWitness.details}`);
  lines.push(`- Statute: ${law.expertWitness.statute}`);
  lines.push("");

  // Fault rule
  lines.push("### Comparative Fault Rule");
  lines.push(`- Type: ${formatFaultType(law.faultRule.type)}`);
  lines.push(`- ${law.faultRule.description}`);
  lines.push(`- Statute: ${law.faultRule.statute}`);

  return lines.join("\n");
}

/**
 * Compare two states' med-mal laws side-by-side for venue shopping analysis.
 */
export function compareStates(state1: string, state2: string): string {
  const law1 = getStateLaw(state1);
  const law2 = getStateLaw(state2);

  if (!law1 || !law2) {
    const missing = !law1 ? state1 : state2;
    return `State not found: ${missing}. Use a 2-letter state code (e.g., CA, TX) or full state name.`;
  }

  const lines: string[] = [];
  lines.push(`## Venue Comparison: ${law1.state} vs. ${law2.state}`);
  lines.push("");

  // Damage caps comparison
  lines.push("### Damage Caps");
  lines.push(`| Factor | ${law1.stateCode} | ${law2.stateCode} |`);
  lines.push("|--------|-----|-----|");
  lines.push(`| Non-economic cap | ${formatCap(law1.damageCaps.nonEconomic.cap)} | ${formatCap(law2.damageCaps.nonEconomic.cap)} |`);
  lines.push(`| Total cap | ${formatCap(law1.damageCaps.total.cap)} | ${formatCap(law2.damageCaps.total.cap)} |`);
  lines.push(`| Punitive cap | ${formatCap(law1.damageCaps.punitive.cap)} | ${formatCap(law2.damageCaps.punitive.cap)} |`);
  lines.push(`| Annual adjustment | ${law1.damageCaps.adjustsAnnually ? "Yes" : "No"} | ${law2.damageCaps.adjustsAnnually ? "Yes" : "No"} |`);
  lines.push("");

  // SOL comparison
  lines.push("### Statute of Limitations");
  lines.push(`| Factor | ${law1.stateCode} | ${law2.stateCode} |`);
  lines.push("|--------|-----|-----|");
  lines.push(`| General SOL | ${law1.sol.generalYears}yr | ${law2.sol.generalYears}yr |`);
  lines.push(`| Discovery rule | ${law1.sol.discoveryRule ? "Yes" : "No"} | ${law2.sol.discoveryRule ? "Yes" : "No"} |`);
  lines.push(`| Repose | ${law1.sol.absoluteRepose ? law1.sol.absoluteRepose + "yr" : "None"} | ${law2.sol.absoluteRepose ? law2.sol.absoluteRepose + "yr" : "None"} |`);
  lines.push("");

  // Key differences
  lines.push("### Key Procedural Differences");
  lines.push(`| Factor | ${law1.stateCode} | ${law2.stateCode} |`);
  lines.push("|--------|-----|-----|");
  lines.push(`| Cert of merit | ${law1.certificateOfMerit.required ? "Required" : "Not required"} | ${law2.certificateOfMerit.required ? "Required" : "Not required"} |`);
  lines.push(`| Same-specialty expert | ${law1.expertWitness.sameSpecialtyRequired ? "Yes" : "No"} | ${law2.expertWitness.sameSpecialtyRequired ? "Yes" : "No"} |`);
  lines.push(`| Active practice req | ${law1.expertWitness.activePracticeRequired ? "Yes" : "No"} | ${law2.expertWitness.activePracticeRequired ? "Yes" : "No"} |`);
  lines.push(`| Fault rule | ${formatFaultType(law1.faultRule.type)} | ${formatFaultType(law2.faultRule.type)} |`);
  lines.push("");

  // Analysis
  lines.push("### Venue Analysis");
  const p1 = plaintiffScore(law1);
  const p2 = plaintiffScore(law2);
  if (p1 > p2) {
    lines.push(`**${law1.state}** is generally more favorable to the plaintiff (score: ${p1} vs ${p2}).`);
  } else if (p2 > p1) {
    lines.push(`**${law2.state}** is generally more favorable to the plaintiff (score: ${p2} vs ${p1}).`);
  } else {
    lines.push(`Both states are roughly equivalent for the plaintiff (score: ${p1}).`);
  }

  const reasons: string[] = [];
  if (law1.faultRule.type === "contributory" && law2.faultRule.type !== "contributory") {
    reasons.push(`${law1.stateCode} uses contributory negligence, which bars recovery for ANY plaintiff fault`);
  }
  if (law2.faultRule.type === "contributory" && law1.faultRule.type !== "contributory") {
    reasons.push(`${law2.stateCode} uses contributory negligence, which bars recovery for ANY plaintiff fault`);
  }
  if (law1.damageCaps.nonEconomic.cap === null && law2.damageCaps.nonEconomic.cap !== null) {
    reasons.push(`${law1.stateCode} has no non-economic cap; ${law2.stateCode} caps at $${law2.damageCaps.nonEconomic.cap.toLocaleString()}`);
  }
  if (law2.damageCaps.nonEconomic.cap === null && law1.damageCaps.nonEconomic.cap !== null) {
    reasons.push(`${law2.stateCode} has no non-economic cap; ${law1.stateCode} caps at $${law1.damageCaps.nonEconomic.cap.toLocaleString()}`);
  }
  if (law1.sol.generalYears !== law2.sol.generalYears) {
    const longer = law1.sol.generalYears > law2.sol.generalYears ? law1 : law2;
    reasons.push(`${longer.stateCode} has a longer SOL (${longer.sol.generalYears}yr vs ${longer === law1 ? law2.sol.generalYears : law1.sol.generalYears}yr)`);
  }
  if (reasons.length > 0) {
    lines.push("Key factors:");
    reasons.forEach((r) => lines.push(`- ${r}`));
  }

  return lines.join("\n");
}

/**
 * Returns state codes that are generally favorable to plaintiffs:
 * no non-economic caps AND pure comparative fault.
 */
export function getFavorablePlaintiffStates(): string[] {
  return Object.values(STATE_LAWS)
    .filter((s) =>
      s.damageCaps.nonEconomic.cap === null &&
      s.damageCaps.total.cap === null &&
      s.faultRule.type === "pure_comparative"
    )
    .map((s) => s.stateCode)
    .sort();
}

/**
 * Returns state codes that are generally favorable to defense:
 * have non-economic or total caps AND use contributory negligence.
 */
export function getFavorableDefenseStates(): string[] {
  return Object.values(STATE_LAWS)
    .filter((s) =>
      s.faultRule.type === "contributory" ||
      (s.damageCaps.nonEconomic.cap !== null && s.damageCaps.total.cap !== null)
    )
    .map((s) => s.stateCode)
    .sort();
}

/**
 * Get all available state codes.
 */
export function getAvailableStates(): string[] {
  return Object.keys(STATE_LAWS).sort();
}

/**
 * Detect state references in text and return matching state laws.
 * Scans for 2-letter codes and full state names.
 */
export function detectStatesInText(text: string): StateMedMalLaw[] {
  const found = new Set<string>();
  const upper = text.toUpperCase();

  // Check 2-letter codes (surrounded by word boundaries)
  for (const code of Object.keys(STATE_LAWS)) {
    const regex = new RegExp(`\\b${code}\\b`);
    if (regex.test(upper)) {
      found.add(code);
    }
  }

  // Check full state names
  for (const law of Object.values(STATE_LAWS)) {
    if (upper.includes(law.state.toUpperCase())) {
      found.add(law.stateCode);
    }
  }

  return Array.from(found)
    .sort()
    .map((code) => STATE_LAWS[code]);
}

// ═══════════════════════════════════════════════════════════
// Internal helpers
// ═══════════════════════════════════════════════════════════

function formatCap(cap: number | null): string {
  if (cap === null) return "No cap";
  return `$${cap.toLocaleString()}`;
}

function formatFaultType(type: StateMedMalLaw["faultRule"]["type"]): string {
  switch (type) {
    case "pure_comparative": return "Pure Comparative";
    case "modified_50": return "Modified (50% bar)";
    case "modified_51": return "Modified (51% bar)";
    case "contributory": return "Contributory Negligence";
    case "slight_gross": return "Slight/Gross";
  }
}

/**
 * Simple plaintiff-favorability score for comparison purposes.
 * Higher = more plaintiff-friendly.
 */
function plaintiffScore(law: StateMedMalLaw): number {
  let score = 0;

  // No non-economic cap: +3
  if (law.damageCaps.nonEconomic.cap === null) score += 3;
  // No total cap: +2
  if (law.damageCaps.total.cap === null) score += 2;

  // Fault rule
  switch (law.faultRule.type) {
    case "pure_comparative": score += 3; break;
    case "modified_51": score += 2; break;
    case "modified_50": score += 1; break;
    case "slight_gross": score += 0; break;
    case "contributory": score -= 3; break;
  }

  // Longer SOL: +1 per year over 1
  score += Math.max(0, law.sol.generalYears - 1);

  // Discovery rule: +1
  if (law.sol.discoveryRule) score += 1;

  // No absolute repose: +1
  if (law.sol.absoluteRepose === null) score += 1;

  // No cert of merit requirement: +1 (easier to file)
  if (!law.certificateOfMerit.required) score += 1;

  return score;
}
