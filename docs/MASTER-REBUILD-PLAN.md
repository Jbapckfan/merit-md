I’m treating this as a real rebuild brief, not a brainstorm. I’m pulling current primary-source regulatory guidance first so the plan is specific and doesn’t drift into stale or hand-wavy advice.
The regulatory picture is clearer now: FDA’s January 2026 CDS guidance is stricter about HCP-only, non-directive outputs; Anthropic’s consumer Max/Pro surfaces are not BAA-covered; and Vercel can support HIPAA only with a paid BAA add-on, which breaks the current zero-cash constraint. I’m turning that into a rebuild plan that assumes no PHI on Vercel, no patient-facing legal analysis, and concierge/local processing first.
Rebuild it as a physician-founded, citation-first workbench for plaintiff med-mal firms. Kill everything else in v1: no patient case evaluator, no bedside CDS, no merit score, no valuation, no expert replacement, and no raw-record PHI flowing through Vercel or consumer Claude surfaces.

**Part 1: Regulatory And Legal Cleanup**

**A. FDA Clinical Decision Support**
- For the plaintiff-firm product, remove the FDA problem entirely by not positioning it as clinical decision support. It is a litigation record-review tool, not software for diagnosis, treatment, triage, or patient management.
- For the later physician product, keep it HCP-only, retrospective, and non-time-critical. FDA’s January 2026 CDS guidance says non-device CDS must meet all four criteria: no image/signal/pattern analysis; only medical information normally communicated among HCPs; recommendations as information/options rather than directives; and enough basis so the HCP does not primarily rely on it. FDA also flags risk scores, probabilities, and time-critical outputs as device-like.
- Product structure for the physician tool: no patient/caregiver accounts; no real-time ED use; no alerts, alarms, or urgency flags; no probabilities; no “recommended treatment”; no image interpretation; no ECG/waveform/signal analysis; only retrospective chart review, documentation support, guideline lookup, and question-generation.
- Use language like: “surfaces relevant record facts,” “links potentially relevant guidelines,” “questions for clinician review,” “for licensed health professionals only,” “not for emergency or time-critical use.”
- Avoid language like: “diagnoses,” “detects,” “predicts,” “catches,” “flags sepsis/stroke,” “recommends treatment,” “risk score,” “probability,” “autonomous review,” “reduces missed diagnoses.”
- Output format for the physician tool must be non-directive: `Relevant record facts`; `Potentially relevant guidance`; `Questions to consider`; `Missing information`; `Known uncertainties`. Do not include `Assessment`, `Diagnosis likely`, `Recommended next step`, or `% likelihood`.

**B. Unauthorized Practice of Law**
- The strongest fix is architectural, not rhetorical: remove all patient-facing case analysis. No “Do I have a case?” flow. No individualized statute/deadline output. No claim-strength output. No settlement/value estimates.
- Public-facing patient flow in v1 should only collect logistics: name, contact info, state, incident year, facility type, broad event type, whether records exist, and preferred callback time. No record upload from the public. No case opinion.
- If you insist on patient-facing text, frame it only as neutral information: “Plaintiff med-mal firms typically review records, timeline, injury, and state-specific filing rules.” Never answer “Should I sue?”, “Do I have a claim?”, or “What is my deadline?”
- Effective disclaimers are proximate, plain, and matched to behavior. Performative disclaimers are footer text attached to a flow that still gives individualized legal recommendations.
- Use this language on all public intake surfaces: “This form collects information for possible attorney review. It does not evaluate your legal rights, tell you whether you have a claim, estimate case value, or create an attorney-client relationship.”
- Use this language on all attorney outputs: “This report is a draft research and issue-spotting aid for attorney review. It does not determine legal merit, filing strategy, damages, or likelihood of success.”
- No lawyer cofounder is required if you remove consumer legal outputs. A practicing plaintiff med-mal lawyer advisor is still worth getting before launch. Best structure: 0.25% to 0.5% advisor equity, 12-month vesting, monthly review of launch states, output rubric, and pilot memos.

**C. HIPAA / PHI Architecture**
- Important nuance: for the plaintiff-firm wedge, you usually are not operating as a HIPAA business associate merely because a plaintiff firm uploads records it lawfully obtained. Plaintiff firms are generally not covered entities. But you are still handling highly sensitive health data, and the FTC Act still applies even where HIPAA does not. Architect to HIPAA-grade standards anyway.
- Current zero-cash answer: no PHI on Vercel. As of April 2, 2026, Vercel offers HIPAA support with a BAA, but its pricing page lists HIPAA BAA as a `$350/month` Pro add-on. That breaks the current budget.
- Current zero-cash answer: no PHI through Claude Max / consumer Claude Code. Anthropic’s current docs say Free/Pro/Max are consumer terms, are not BAA-covered, and consumer Claude Code data can be retained 30 days, or longer if model-improvement is enabled. Anthropic also says Max/Pro OAuth credentials cannot be used to route third-party product traffic.
- Therefore raw patient records can go only to local processing on the Mac Mini in v1. Use local OCR, local text extraction, local retrieval, local storage, local generation if possible. Claude Max can be used only on de-identified excerpts or synthetic test data.
- SQLite is acceptable only as a local encrypted database on the Mac Mini. It is not acceptable as a remotely exposed PHI store on Vercel. Use FileVault plus a separate encrypted APFS volume or SQLCipher, matter IDs instead of patient names, and encrypted local backups.
- Public Vercel site should contain only marketing pages, demo request forms, and non-health metadata. No uploads. No patient names in URLs. No document filenames with PHI. No analytics/session replay on any health-data surface.
- Pilot data flow:
  1. Firm signs pilot terms.
  2. Firm sends records through its existing secure channel or encrypted transfer.
  3. Founder downloads to encrypted Mac Mini workspace.
  4. Local OCR/indexing/review happens on Mac Mini.
  5. Draft memo is human-reviewed.
  6. Final PDF/DOCX is returned via the firm’s secure channel.
  7. Temp artifacts deleted in 7 days; raw files deleted in 30 days unless contract says otherwise.
- Do not build public patient uploads in v1. That creates unnecessary FTC and possibly state consumer-health-data exposure. It also risks turning you into a health-record app from a regulator’s point of view.
- If later you need PHI-capable cloud AI, only use a commercial Anthropic API/Claude Code arrangement with BAA plus zero data retention. Consumer Max is out.
- BAAs needed in the future if you sell to providers or ingest from covered entities/business associates: hosting, storage, OCR, auth, email, logging, backups, and LLM vendor if any of them create, receive, maintain, or transmit ePHI. HHS says even “no-view” encrypted cloud providers still count as business associates.

**D. FTC Compliance**
- Claims you can make now: “draft issue-spotting memo,” “evidence citations to uploaded records,” “medical guideline references,” “state-law research appendix with as-of dates,” “built for attorney review,” “board-certified ER physician founder.”
- Claims you cannot make now: “finds malpractice,” “proves breach,” “accurately predicts merit,” “replaces experts,” “reduces missed claims,” “clinically validated,” “HIPAA compliant,” “HIPAA certified,” “FDA-cleared,” “works in all 50 states” unless you have validated all 50.
- Do not say “HIPAA compliant.” FTC and HHS both warn against blanket “HIPAA compliant / secure / certified” claims. If later you have BAA-backed infrastructure, use precise operational statements instead: “available on BAA-covered infrastructure for eligible deployments” and describe the actual controls.
- Any accuracy or time-savings claim needs substantiation before publication. For this product, that means a documented internal benchmark with defined test set, blinded review, scoring rubric, and retained records of the analysis.
- Testimonials must be truthful, typical, and disclosed properly. If a pilot was discounted, free, or advisory-equity based, say so. Do not use “results not typical” as a cure. If one firm says “found two winning cases,” do not publish that unless you can substantiate that outcome as typical.

**E. Product Liability / Professional Liability**
- Disclaimers help only if the product behavior is restrained. They will not save you if the system still outputs definitive medical or legal conclusions.
- Put three disclaimer layers in place:
  1. Website: “For law firms only. Not medical advice, not legal advice to consumers, not emergency use.”
  2. Contract: “Outputs are draft internal aids; customer must independently verify all factual, medical, and legal statements before use.”
  3. Memo header: “Not an expert report, not a standard-of-care determination, not a merit decision.”
- Add one more contract rule: customer may not present outputs as physician expert opinion or final legal research without independent attorney review.
- Form a home-state LLC now, not a sole proprietorship. With zero cash and no financing process underway, an LLC is the right tradeoff. Convert to a Delaware C-corp only when you actually need outside capital, option grants, or venture structure.
- Keep the physician product separate later. Best path is separate branding immediately and separate entity when it starts generating revenue. Do not blend physician-facing and law-firm-facing claims under one product.
- Insurance once you have first paying customers: tech E&O, cyber liability, and general liability. My cost range here is an inference from current small-business market averages, adjusted upward because you handle sensitive health data: expect roughly `$2,000 to $6,000/year` for tech E&O plus cyber at low limits, and roughly `$500 to $1,200/year` for general liability. Ask specifically about AI exclusions, privacy exclusions, and exclusions for medical/legal services.
- Never sign reports as a physician opinion. If you do that, you are drifting toward expert-consulting risk and personal professional-liability exposure.
- Knowledge-base staleness risk is controlled by source dating, versioning, re-review deadlines, and suppression rules. If a statement has no approved source, it does not ship.

**Part 2: Product Rebuild Plan For Plaintiff Firms Only**

**A. What the product actually does**
- Input: PDFs, scanned records, text exports, and record inventories from plaintiff med-mal firms.
- Output: one draft issue-spotting memo with evidence citations, medical source appendix, state-law appendix, defense counterpoints, and missing-record checklist.
- It does not output: merit yes/no, legal advice to a consumer, case value, settlement range, filing recommendation, or expert-witness replacement.

**B. Output format specification**
1. Matter header: matter ID; firm; jurisdiction; report version; record cutoff date; source coverage summary; medical-source “as of” date; legal-source “as of” date; disclaimer.
2. Record inventory: every uploaded document listed with stable document ID, type, date span, page count, OCR quality flag, and completeness notes.
3. Chronology: dated timeline of encounter, orders, test results, consults, transfers, deterioration, and outcome. Every line has record citations.
4. Potential issue cards: each card uses the same schema: `Issue title`; `Why it may matter`; `Supporting facts`; `Relevant medical guidance`; `Possible plaintiff framing`; `Possible defense framing`; `Missing evidence`; `Uncertainty statement`.
5. Injury/outcome facts: factual summary only, not damages valuation.
6. Missing-record checklist: what is absent and how absence changes confidence.
7. State-law appendix: limitation period; pre-suit requirements; expert affidavit/certificate rules; caps; defendant-specific rules; all cited to statute/rule/case with effective or access date.
8. Medical-source appendix: issuing body; title; publication/reaffirmation date; section; applicability note.
9. Limitations section: legibility, missing records, unsupported states, and any source freshness warnings.
- Citation rule: no sentence ships without at least one record or source citation. If a sentence synthesizes multiple records, it gets multiple citations.
- Record citation format: `[Doc R12, p. 34]` or Bates if provided. The UI should let the user click the citation and open the source page plus OCR snippet.
- Medical citation format: `[ACOG Practice Bulletin No. X, 2024, §3]`. Do not label a guideline as “the standard of care.” Label it “relevant guidance” or “relevant literature for attorney/expert review.”
- Legal citation format: `[Tex. Civ. Prac. & Rem. Code § 74.251, as accessed 2026-04-02]`.
- Required uncertainty language: “may support,” “is consistent with,” “on the current record,” “assuming the records are complete,” “requires attorney and expert review.”
- Forbidden conclusion language: “breach occurred,” “negligence established,” “clear malpractice,” “meritorious claim,” “likely win,” “worth $X.”

**C. Architecture decisions**
- Recommendation: local-first, concierge-first. Reason: zero cash, highest confidentiality, simplest compliance story, no Vercel PHI, no consumer Claude PHI.
- Phase 1 architecture: Vercel hosts marketing only; Mac Mini handles all document processing; no external multi-tenant upload app; firms use their own secure transfer tools.
- Data retention policy: temp OCR files 7 days; raw uploaded files 30 days after final delivery; final memo 90 days; document hashes/manifests 1 year for audit; immediate deletion available on request. If a firm wants long retention, they keep the authoritative record set.
- Authentication in phase 1: none for PHI because there is no external portal. In phase 2: firm admin, matter-scoped roles, MFA mandatory, no shared logins, no patient accounts.
- Multi-matter management: one workspace per firm; one matter ID per case; fields for state, venue, defendant type, medical specialty, records received, report version, and deletion deadline.
- Export formats: DOCX first, PDF second, CSV timeline third. Firms edit in Word, archive in PDF, and sometimes import timeline rows elsewhere.

**D. Knowledge base hardening**
- Convert every medical assertion into a structured source-backed entry: `claim_id`; `claim_text`; `source_type`; `issuer`; `publication_date`; `reaffirmed_or_superseded_date`; `section`; `applicability`; `evidence_grade`; `access_date`; `approved_by`.
- Convert every legal rule into a structured rule entry: `state`; `topic`; `citation`; `effective_date`; `amendment_date`; `as_of_date`; `plain_language_summary`; `quote_excerpt`; `reviewed_by`.
- Build an approved-source ladder for medicine: national specialty society guidelines first; federal guidance second; peer-reviewed reviews or major texts third. Anything below that gets a lower-confidence label or stays internal only.
- Build an approved-source ladder for law: statute/rule first; controlling appellate case second; official court materials third. Secondary commentary is for internal research only.
- Do not launch “all 50 states.” Use support tiers.
- Tier 1 launch states: pick 5 to 7 states you can actually sell and review now.
- Tier 2: internal-only states not yet customer-facing.
- Tier 3: unsupported states with explicit suppression in the UI.
- Update process: legal sources reviewed monthly for supported states and immediately after a pilot in that state; medical sources reviewed monthly and at each specialty expansion.
- Validation methodology:
  1. Build a gold set of 30 to 50 historical matters or heavily redacted closed matters.
  2. Have a physician and a plaintiff med-mal attorney independently annotate key issues and missing records.
  3. Score the system on major-issue recall, false-positive rate, citation correctness, unsupported-claim rate, and attorney edit time.
  4. Refuse launch until unsupported-claim rate is effectively zero and citation correctness is near-perfect.
- Internal release thresholds I would use: citation correctness at or above 98%; unsupported claim rate at 0 in reviewed outputs; major-issue recall at or above 85% against gold annotations; attorney edit time under 20 minutes for a standard memo.

**E. Trust and credibility**
- Firms try it if the first artifact looks like real work product, not AI mush. That means exact page cites, dates, defense arguments, and explicit unknowns.
- Firms pay if it saves partner time before expert review without embarrassing them. That means editable Word output, not a chatbot transcript.
- Firms recommend it if it is conservative, source-dated, and transparent about limits. Over-claiming kills referrals.
- First 90-day proof points to build:
  1. Three redacted sample memos.
  2. One public methodology page.
  3. One source-update log.
  4. One supported-state coverage table.
  5. Three pilot case studies framed around process, not verdicts.
  6. One attorney advisor and one physician founder QA signature on pilot outputs.

**Part 3: Go-To-Market Plan For The First 10 Paying Firms**

- Target firms in only your launch states. Build a list of 100 plaintiff firms with med-mal pages, not general PI mills.
- Contact the partner who screens cases, the senior intake lawyer, or the nurse-consultant-equivalent if they have one.
- Start with email and follow with LinkedIn. The pitch is not “AI legal platform.” The pitch is “physician-built, citation-backed first-pass record memo in 72 hours.”
- Exact outreach template:

```text
Subject: Physician-built med-mal intake memo from records in 72 hours

I built a physician-founded review workflow for plaintiff medical-malpractice firms.

You send records. I return a draft issue-spotting memo with page citations, relevant medical guidance, defense counterpoints, and a dated state-law appendix.

It does not give merit verdicts, case value, or replace your expert. It is a faster first pass for intake and case screening.

I’m onboarding 5 founding firms for a paid pilot: $1,500 for one live matter, up to 1,000 pages, 72-hour turnaround, direct founder review, no long-term contract.

Worth a 15-minute look?
```

- Pilot offer: `$1,500` for one matter; up to `1,000 pages`; 72-hour turnaround after complete upload; one revision round; direct founder walkthrough; 100% credit toward the first month of subscription if they convert within 14 days.
- Post-pilot subscription: `Starter $2,500/month` for 4 matters; `$400` extra matter; 12-month founder price lock for first 10 firms. Do not start with enterprise pricing games.
- First 5 cases should be handled manually even if the software is half-built. Use the firm’s secure transfer method, do local processing, and edit every memo personally.
- Manual first-case workflow:
  1. 15-minute scoping call.
  2. Confirm represented client or lawful record possession.
  3. Receive records through firm-secure channel.
  4. Run local OCR and completeness check.
  5. Produce draft memo.
  6. Founder edits every issue card.
  7. Deliver DOCX plus PDF plus 15-minute walkthrough.
  8. Ask exactly what they deleted, changed, or added.
- Success metrics:
  1. Meetings booked per 20 outbound touches.
  2. Paid-pilot conversion rate.
  3. Turnaround time from complete records to memo.
  4. Attorney edit time.
  5. Repeat matter rate by firm.
  6. Unsupported claim count.
  7. Citation click accuracy.
  8. Percentage of memos that lead to “send another matter.”
- Stay manual until you have at least 20 real matters and know the failure modes.
- Automate in this order: OCR and document inventory first; citation linking second; timeline extraction third; issue drafting fourth; never automate final signoff early.
- Conversion script from pilot to subscription: if they send a second matter or ask for turnaround reliability, pitch the monthly plan immediately. If they only have sporadic volume, let them stay per-matter for now. Do not force subscription before repeat usage exists.

**Week-by-week GTM cadence**
- Week 1: build 100-firm target list, 20 personalized emails, 10 LinkedIn connects, book 3 demos.
- Week 2: run 5 demos, send redacted sample memo, close first 2 paid pilots.
- Week 3: deliver first 2 pilot matters manually, collect edit notes, ask for second matter.
- Week 4: close 2 more pilots, refine sample memo and FAQ from objections.
- Week 5: publish one case-study-style process story, push 20 more targeted emails.
- Week 6: convert first 2 firms to subscription or repeat paid matters.
- Week 7: close firms 5 through 7, using pilot outputs as proof.
- Week 8: close firms 8 through 10, tighten supported-state positioning, raise pilot price if demand is real.

**Part 4: Physician Tool As Secondary Wedge**

- Make ChartReview Pro a separate product, separate site, separate positioning, and eventually separate entity.
- Sell to individual physicians first because hospitals are procurement, security review, integration, committee approval, and often BAA hell. Individuals can self-buy if the tool is local, retrospective, and useful immediately.
- Best initial physician use case: retrospective chart review, documentation QA, or board-prep-style case reflection. Not bedside decisions.
- Free tier: 2 local chart reviews per month; timeline plus relevant guidance pack; no cloud storage; no team features.
- Paid tier: `$79/month` solo physician; unlimited local chart reviews; specialty templates; exportable note package. Group tier: `$299/month` for 5 clinicians.
- FDA avoidance for this wedge: HCP-only; retrospective; no risk scores; no probabilities; no patient-facing outputs; no time-critical use; no images/signals; no treatment directives.
- 30-day plan to first paying physician:
  1. Recruit 20 physician colleagues in one specialty.
  2. Demo 3 sample chart-review outputs.
  3. Offer 10 founding users a 30-day beta.
  4. Convert first 2 at `$79/month` with a founder-price lock.
  5. Use their edits to harden the output schema before expanding.

**Part 5: What To Build First**

**Week 1**
1. Freeze the charter to one buyer and one output: plaintiff med-mal firms; draft issue-spotting memo only. Dependencies: none. Complexity: S.
2. Remove all patient-facing case-evaluation, diagnosis, merit, and valuation language from product scope and website copy. Dependencies: 1. Complexity: M.
3. Create a forbidden-claims list for marketing and UI. Dependencies: 1. Complexity: S.
4. Draft four disclaimer blocks: website, intake, contract, memo header. Dependencies: 1. Complexity: S.
5. Decide that v1 has no public patient upload and no PHI on Vercel. Dependencies: 1. Complexity: S.
6. Define the manual secure-intake SOP using firm-provided transfer tools and local processing on the Mac Mini. Dependencies: 5. Complexity: M.
7. Configure local-only data handling rules: matter IDs, no PHI filenames, encrypted local storage, deletion timers, offline backup plan. Dependencies: 5. Complexity: M.
8. Define the exact memo schema and citation grammar. Dependencies: 1. Complexity: M.
9. Choose 5 to 7 launch states and mark all others unsupported. Dependencies: 1. Complexity: M.
10. Start recruiting one plaintiff med-mal attorney advisor. Dependencies: 1. Complexity: M.

**Week 2**
11. Convert the medical KB into source-backed entries with publication dates and applicability notes. Dependencies: 8. Complexity: L.
12. Convert the legal engine into state-specific rule entries with effective dates and “as of” dates. Dependencies: 9. Complexity: L.
13. Build the source-freshness register and review cadence for supported states and specialties. Dependencies: 11, 12. Complexity: M.
14. Create the document inventory and completeness checklist used before every memo. Dependencies: 8. Complexity: M.
15. Create the issue-card rubric with required plaintiff argument, defense argument, missing evidence, and uncertainty language. Dependencies: 8. Complexity: M.
16. Create one fully redacted sample memo in DOCX and PDF. Dependencies: 11, 12, 15. Complexity: M.
17. Build the first outbound list of 100 target firms in the launch states. Dependencies: 9. Complexity: S.
18. Draft pilot terms and customer-facing FAQ. Dependencies: 4, 6. Complexity: M.

**Week 3**
19. Run 5 internal dry runs on historical or redacted matters. Dependencies: 11 through 16. Complexity: L.
20. Score those dry runs for citation accuracy, unsupported claims, issue recall, and edit time. Dependencies: 19. Complexity: M.
21. Fix the highest-risk failure modes: unsupported statements, weak citations, one-sided issue framing, stale legal rules. Dependencies: 20. Complexity: M.
22. Finalize pilot pricing, turnaround, and founder-review promise. Dependencies: 18, 21. Complexity: S.
23. Publish the landing page, sample output, supported-state list, and methods page. Dependencies: 16, 22. Complexity: M.
24. Start outbound: 20 personalized emails per day, 5 follow-ups per day, 5 LinkedIn messages per day. Dependencies: 17, 23. Complexity: M.
25. Draft the incident-response and deletion-response playbook. Dependencies: 6, 7. Complexity: M.
26. Get insurance quotes and confirm no AI/privacy exclusions that would gut coverage. Dependencies: 18. Complexity: M.

**Week 4**
27. Close the first 2 paid pilots. Dependencies: 24. Complexity: M.
28. Process the first 2 live matters manually from intake through delivery. Dependencies: 22, 25. Complexity: L.
29. Hold 15-minute debrief calls after delivery and log every attorney edit. Dependencies: 28. Complexity: S.
30. Tighten the memo rubric and KB based on actual edits, not intuition. Dependencies: 29. Complexity: M.
31. Close pilots 3 and 4 using the refined sample memo and real debrief language. Dependencies: 29, 30. Complexity: M.
32. Attempt conversion of the first pilot firm into subscription or repeat paid matter. Dependencies: 29. Complexity: M.
33. Publish one redacted process case study and one source-update log entry. Dependencies: 28, 30. Complexity: M.
34. Decide the first automation targets strictly from real failure rates and bottlenecks. Dependencies: 28 through 30. Complexity: S.

**Sources**
- FDA Clinical Decision Support Software guidance, January 2026: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
- FDA CDS FAQ summary criteria and device/non-device examples: https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs
- Anthropic Claude Code data usage and retention: https://code.claude.com/docs/en/data-usage
- Anthropic BAA coverage article: https://support.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers
- Anthropic Claude Code legal/compliance and consumer-vs-commercial usage: https://code.claude.com/docs/en/legal-and-compliance
- HHS HIPAA cloud computing guidance: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html
- HHS sample BAA provisions: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions
- FTC consumer health information guidance: https://www.ftc.gov/business-guidance/resources/collecting-using-or-sharing-consumer-health-information-look-hipaa-ftc-act-health-breach
- FTC health claims substantiation guidance: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance
- Vercel HIPAA guide: https://vercel.com/kb/guide/hipaa-compliance-guide-vercel
- Vercel pricing page: https://vercel.com/pricing
- HHS warning that HHS/OCR do not certify “HIPAA compliant” products: https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/be-aware-misleading-marketing-claims/index.html

If you want, I can turn this into a founder operating document next: `decision memo`, `30-day execution checklist`, or `pilot sales deck outline`.
