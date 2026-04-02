I’m treating the regulatory section as the only part that needs verification. I’ll use official sources for FDA, FTC, HIPAA, and legal-practice boundaries, then give the business assessment from the product description only.
I’ve got the regulatory facts. I’m checking current market context now so the go-to-market and pricing sections aren’t fantasy or stale intuition.
Blunt version: this is three companies wearing one hoodie. Consumer legal triage, law-firm case intelligence, and clinician documentation QA are different products, different buyers, different liabilities, and different compliance regimes. If you keep selling it as one thing, sophisticated buyers will conclude you don’t understand your own risk surface.

1. **What Stops A Hospital From Buying This?**
- CIO: no enterprise readiness. `Next.js + SQLite + Vercel + solo founder` reads like prototype, not vendor.
- CIO: no proof of SSO/SAML, SCIM, RBAC, audit logs, tenant isolation, uptime SLA, disaster recovery, logging, retention controls, data export, incident response.
- CIO: no procurement patience for a one-person key-man vendor handling PHI and medicolegal workflows.
- CIO: if every subprocesser touching PHI is not under the right BAA and configuration, deal is dead on arrival.
- CIO: no EHR integration means the tool adds workflow friction instead of removing it.
- CIO: no SOC 2 Type II, no HITRUST, no third-party pen test, no formal security program, no vendor risk package.
- CMO/CMIO: no peer-reviewed validation, no prospective outcomes, no sensitivity/specificity, no false-negative analysis, no specialty-specific governance.
- CMO/CMIO: “pre-sign chart review” creates a hard question: if the tool flags something and the doctor ignores it, who owns the miss? If it misses something, why was it trusted?
- CMO/CMIO: if outputs are specific, time-sensitive, or directive, you’re drifting from workflow aid into regulated clinical decision support territory.
- CMO/CMIO: doctors will not trust black-box medicolegal logic, especially if they can’t independently inspect the basis.
- Risk management: you are creating discoverable breadcrumbs. Plaintiffs will ask what the tool saw, what it missed, and what the hospital ignored.
- Risk management: if the tool exists, plaintiff lawyers argue the hospital should have used it everywhere. Partial deployment can increase standard-of-care arguments.
- Risk management: “chart review for safety” sounds good until the first catastrophic miss. Then it becomes Exhibit A.
- General counsel: unclear FDA posture, unclear medical-practice posture, unclear product liability posture.
- General counsel: no hospital wants to be your regulatory test case.
- General counsel: if your knowledge base or state-law engine is wrong or stale, the hospital inherits downstream litigation risk.
- General counsel: they will demand indemnity, insurance, security reps, audit rights, and often a financial backstop you probably cannot provide.
- Commercial reality: hospitals do not buy “interesting physician-built AI.” They buy validated, integrated, boringly reliable systems.

2. **What Stops A Law Firm From Using This?**
- Plaintiff firm: hallucination risk. One fake causal link or missed record buries trust permanently.
- Plaintiff firm: med-mal is not PI-lite. Case acceptance errors are expensive. A bad “no-case” output loses contingency upside; a bad “take it” output burns expert fees and partner time.
- Plaintiff firm: one ER physician’s standards are not a substitute for retained experts, specialty review, or venue-specific jury reality.
- Plaintiff firm: if the 50-state engine is not continuously updated and attorney-reviewed, they won’t trust SOL, caps, cert-of-merit, or fault outputs.
- Plaintiff firm: post-scan Q&A chat can generate ugly internal work product they don’t want discoverable.
- Plaintiff firm: no integration with intake/case systems means more staff work, not less.
- Plaintiff firm: “AI merit analysis” sounds like malpractice bait unless every claim is source-linked and caveated.
- Defense firm: if the product feels plaintiff-coded or “prosecution playbook”-coded, defense firms will reject it immediately.
- Defense firm: insurers and hospital clients care about confidentiality, neutrality, privilege, and auditability more than novelty.
- Defense firm: they already have experts, nurses, and playbooks. Your tool has to be faster and safer, not just smarter-sounding.
- Defense firm: if the same platform serves plaintiffs and defense without strict separation of data, prompts, templates, and positioning, trust collapses.
- Managing partner, both sides: they do not want to be the lawyer sanctioned because your tool fabricated law, records, or citations.

3. **What Stops A Patient From Paying?**
- They don’t trust an unknown startup with trauma, records, and legal hopes.
- They assume a real lawyer will screen the case for free, so paying first feels backwards.
- They fear their data will be sold to lawyers, insurers, or marketers.
- They don’t know whether you are a doctor, a law firm, a referral service, or a software toy.
- “Medical-legal AI” is not a consumer category. It is confusing on first contact.
- Uploading records is hard. Most patients do not have clean PDFs ready.
- If they were harmed by a hospital, they are already distrustful of medical institutions and expert-sounding systems.
- They want certainty. You cannot give certainty. That gap kills conversion.
- A “no merit” answer from AI feels insulting; a “maybe” answer feels worthless.
- Dark, technical, high-stakes UX works against trust in DTC health/legal products.

4. **Regulatory And Legal Risks To The Company**
- FDA: as of **January 29, 2026**, FDA’s CDS guidance says patient/caregiver-directed functions do not fit the non-device CDS carveout, and software that gives specific outputs, directives, risk scores, or time-critical alerts may be a device. Patient screening plus pre-sign clinical review is exactly where you can accidentally cross the line. Sources: [FDA CDS Guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software), [FDA Policy Navigator](https://www.fda.gov/medical-devices/digital-health-center-excellence/step-6-software-function-intended-provide-clinical-decision-support).
- FTC: if you claim this performs like a lawyer, finds valid claims, reduces malpractice exposure, is “HIPAA compliant,” or is more accurate than human review without substantiation, you are exposed. The FTC’s 2025 DoNotPay order is the clean warning shot. Sources: [FTC DoNotPay order](https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-finalizes-order-donotpay-prohibits-deceptive-ai-lawyer-claims-imposes-monetary-relief-requires), [FTC health-data guidance](https://www.ftc.gov/business-guidance/resources/collecting-using-or-sharing-consumer-health-information-look-hipaa-ftc-act-health-breach).
- FTC health-app rule: if you collect consumer health data outside HIPAA and have a breach or unauthorized disclosure, FTC Health Breach Notification Rule exposure is real; FTC says the updated rule has applied to most health apps since **July 29, 2024**, with penalties up to `$51,744` per violation. Source: [FTC HBNR basics](https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business).
- HIPAA: if hospitals, groups, or law firms upload PHI, every cloud/vendor touching ePHI needs the right BAA and setup. HHS says using a cloud provider without a BAA is a HIPAA violation. Source: [HHS cloud + BAA guidance](https://www.hhs.gov/hipaa/for-professionals/faq/2079/what-if-a-hipaa-covered-entity-or-business-associate-uses-a-csp-to-maintain-ephi-without-first-executing-a-business-associate-agreement-with-that-csp/index.html).
- HIPAA subprocessers: HHS says cloud providers are business associates even if data is encrypted and they lack the key. Source: [HHS cloud computing guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html).
- Claude/Vercel: current public docs say Anthropic BAA coverage is limited to eligible HIPAA-ready services and typically requires zero-data-retention; Vercel currently supports HIPAA on Pro/Enterprise with specific BAA terms. If your deployment is outside those lanes, enterprise healthcare sales stop. Sources: [Anthropic BAA terms](https://support.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers), [Vercel HIPAA](https://vercel.com/kb/guide/is-vercel-hipaa-compliant).
- State medical board risk: inference from FDA posture plus state licensure rules. If you market individualized medical judgment to patients across states, or make it look like the founder is practicing medicine through software, you invite board complaints and unlicensed-practice theories.
- Unauthorized practice of law: if the patient-facing flow gives personalized legal advice instead of lawyer-supervised support, you are in UPL territory. ABA Rule 5.5 explicitly bars lawyers from helping nonlawyers perform UPL. Sources: [ABA Rule 5.5](https://www.americanbar.org/groups/professional_responsibility/policy/ethics_2000_commission/e2k_rule55/), [ABA Formal Opinion 512](https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf).
- Product liability / negligent misrepresentation: if a doctor, firm, or consumer relies on a bad output and gets hurt, you will be named even if disclaimers exist.
- Privacy claims risk: FTC explicitly warns not to imply “HIPAA compliant/secure/certified” unless your practices match the claim.

5. **What Must Be True Before You Can Charge Money?**
- Patients: free initial screen, plain-English output, obvious privacy posture, human lawyer handoff, and a result that feels more useful than “talk to a lawyer.”
- Attorneys: every conclusion linked to source pages, dated legal rules, exportable work product, defensible confidentiality posture, measurable time saved, and zero tolerance for fabricated law.
- Physicians: the tool must feel like QA assistance, not surveillance; it must show its work, fit workflow in seconds, and avoid increasing legal exposure.
- Hospitals: validated outcomes, compliance package, enterprise contracts, procurement maturity, and a clear answer to “why won’t this make our litigation posture worse?”
- Company-wide: pick one primary buyer. Until then, you don’t have product-market fit; you have product-market confusion.

6. **The 20 Things That Would Make This A Real Company**
1. Pick one wedge for 6 months. My choice: plaintiff med-mal firms.
2. Stop selling “one platform for everyone.” Split the positioning immediately.
3. Kill or demote patient pay as a core model. Use it as intake, not revenue.
4. Reframe outputs from “merit verdict” to “issue spotting with evidence.”
5. Put source citations behind every medical and legal claim.
6. Add “coverage as of date” to every state-law output.
7. Put a human QA layer on premium matters: physician or legal nurse review.
8. Build a documented update process for the 50-state engine.
9. Lock down PHI architecture, BAAs, deletion, audit logs, and vendor inventory.
10. Create attorney work-product mode with matter-level retention controls.
11. Get 3 design-partner firms on real cases and meet them weekly.
12. Measure one hard ROI metric: sign rate, hours saved, or time-to-demand.
13. Run retrospective validation on won/lost med-mal cases and publish the miss rate.
14. Build export formats firms already use: intake memo, med chron, expert brief.
15. Integrate with real law-firm workflow, not just PDF upload.
16. Separate plaintiff and defense templates, prompts, and GTM.
17. Sell physician workflow to individual EM docs or small groups, not hospitals, first.
18. Buy cyber, E&O, and product liability coverage before enterprise selling.
19. Hire outside regulatory/privacy counsel before scaling healthcare claims.
20. Turn the founder from “full-stack solo builder” into “domain expert with a process.” Solo heroics do not pass diligence.

7. **Revenue Model Reality Check**
- Patients: realistic price is `$0` for screen, maybe `$49-$99` for a records-ready packet. Realistic paid conversion is under `1%` from traffic unless you already have trust and referrals. Time to first dollar: `30-60 days`. Path to `$100k MRR`: ugly; you need roughly `1,000-2,000` monthly buyers and the CAC will likely kill you.
- Attorneys: realistic pilot is `$1.5k-$5k/mo` for small firms, `$8k-$20k/mo` for mid-size firms, or per-case pricing for intake. Qualified-demo close rate maybe `10-20%`; cold outbound to closed deal much lower. Time to first dollar: `30-90 days`. Path to `$100k MRR`: `20 firms at $5k` or `10 firms at $10k`. This is the most believable path.
- Physicians: realistic individual price is `$99-$299/mo`; small group pilot `$1k-$5k/mo`. Time to first dollar with individual docs: `14-45 days`. Path to `$100k MRR`: about `400 docs at $249` or `20 groups at $5k`. Hospital ARR could be bigger, but hospital time-to-close is usually `9-18 months`, not a first-dollar path.

8. **The Unfair Advantages That Actually Matter**
- Real: the founder can think like an ER doctor and translate records fast.
- Real: the founder can speak credibly to both clinicians and med-mal lawyers.
- Real: the founder can encode tacit chart-defense and missed-diagnosis heuristics that generic legal AI companies do not naturally have.
- Real: speed. A solo physician-founder can move faster than committee-built incumbents.
- Imagined: “I built the whole stack myself.” Buyers hear key-person risk.
- Imagined: “We have thousands of lines of knowledge base.” That is not a moat unless continuously validated and operationalized.
- Imagined: “We use Claude.” Everyone can use Claude.
- Imagined: “50-state law engine.” Without update discipline and attorney review, it is liability, not moat.
- Imagined: “dark theme / Vercel / Next.js.” Irrelevant to enterprise value.

9. **What Would Make A VC Write A Check?**
- They write a check if you show one wedge, fast adoption, real retained revenue, domain-labeled proprietary data, and outcomes better than generic AI.
- They get interested if you look like “EvenUp for med-mal intake/review” or “ChartWhisper for ED risk/documentation,” not both at once. Current market says vertical legal AI is fundable; EvenUp and Supio prove that. Sources: [EvenUp Series E](https://www.businesswire.com/news/home/20251007138957/en/EvenUp-Raises-%24150M-Series-E-at-%242B-Valuation-to-Redefine-Personal-Injury-Law-and-Level-the-Playing-Field-for-Injury-Victims), [Supio Series B](https://www.goodwinlaw.com/en/news-and-events/news/2025/05/announcements-technology-aiml-goodwin-guides-supio).
- They pass if this still looks like three unrelated products, no validation, no compliance path, no moat beyond prompting, and no repeatable distribution.
- They also pass if hospitals are the story. Hospital-first is where vertical AI startups go to die slowly.

10. **If I Had 90 Days And /bin/zsh Budget**
- Week 1: choose one primary wedge. I would choose plaintiff med-mal firms. Freeze everything else.
- Week 2: rewrite positioning into three separate landing pages. Remove “AI does merit analysis.” Replace with “evidence-grounded issue spotting.”
- Week 3: build 5 gold-standard sample reports with page-level citations and dated state-law notes.
- Week 4: make a manual concierge backend. Do not automate what no one has paid for.
- Week 5: outbound to 50 plaintiff med-mal firms. Offer paid pilot on 5-10 real cases at `$1.5k-$3k`.
- Week 6: close first attorney pilot. Founder handles onboarding personally.
- Week 7: ship only what pilot users ask for: better citations, exports, uncertainty flags, missing-record alerts.
- Week 8: outbound to 100 EM physicians for the clinician tool as a separate beta. Sell solo plans at `$149-$249/mo`.
- Week 9: close first physician subscriber or small-group pilot. Do not call on hospitals yet.
- Week 10: launch patient screen as free only. Capture intake, records status, state, incident date, and consent.
- Week 11: test one paid patient offer only if it helps attorney conversion: `$49-$99` for a lawyer-ready medical timeline or records pack.
- Week 12: publish one attorney case study and one physician case study.
- Week 13: review numbers brutally. If attorneys are converting, go all-in legal. If physicians are converting faster with lower support burden, spin legal into secondary. If patients are not paying, stop trying to make them pay.

If you want the shortest honest answer: hospitals won’t buy this now, patients probably won’t pay, and law firms are the only audience that can plausibly get you to real revenue fast. The company becomes real when you stop pretending all three audiences are one business.
