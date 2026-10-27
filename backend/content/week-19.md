> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 19 — Capstone Build Week + Mock NCA-GENL Exam

**Purpose:** Turn what you have learned into ==a working capstone application== and practise on ==a timed, 50-question mock exam== so you know where you stand.

**Term:** Final (Weeks 16–20) · **Month:** 5 · **Time:** about 30 minutes for this page, then your team's build time and the mock exam

```viz
{
  "type": "hook",
  "title": "Watch the capstone pipeline run",
  "caption": "The Structural Inspection Assistant takes a photo, labels the damage, finds the relevant checklist items and drafts a summary. The example below is made up for illustration. The last line is the rule that matters most: a licensed engineer decides.",
  "scenes": [
    { "name": "Pipeline", "kind": "text", "prompt": "Photo in: a long thin line on a concrete beam", "outputLabel": "Draft for the engineer (illustrative)",
      "output": "Class: crack. Checklist items: measure crack width; note location and length; photograph with a scale. Status: DRAFT. A licensed engineer makes the pass/fail decision." },
    { "name": "Criteria", "kind": "bars", "prompt": "How the capstone is marked", "outputLabel": "Weight of each criterion",
      "bars": [ { "label": "Problem and proposal (15%)", "value": 0.15 }, { "label": "Technical implementation (40%)", "value": 0.40 }, { "label": "Responsible AI (15%)", "value": 0.15 }, { "label": "Presentation (20%)", "value": 0.20 }, { "label": "Documentation (10%)", "value": 0.10 } ] },
    { "name": "Mock exam", "kind": "bars", "prompt": "Mock NCA-GENL: 50 questions, 60 minutes", "outputLabel": "Marks out of 50, as a share",
      "bars": [ { "label": "Exam-ready mark: 35 of 50 (70%)", "value": 0.70 }, { "label": "Full marks: 50 of 50", "value": 1.0 } ] }
  ]
}
```

## By the end, you can…

1. ==Build and integrate== the four parts of the Structural Inspection Assistant: vision classifier, RAG over checklists, guardrails and engineer sign-off.
2. ==Test the application== with a confusion matrix and a failure log, and fix the most serious failures first.
3. ==Compute== your exam timing and score: 35/50 = 70%, and 60 minutes / 50 questions = 72 seconds per question.
4. ==Map any question== to the course area it tests (learning, language, images and generation, apps and deployment).
5. ==Explain what NCA-GENL is== and who issues it, and say what a pass on the mock exam does and does not mean.

This week has no new lecture. Everything here revisits earlier weeks. Terms with a dotted underline open a short definition when you select them.

## Build plan for the Structural Inspection Assistant {rail=Build plan}

{lede} Your capstone is one pipeline: ==photo in → classify → find checklist items → draft summary for the engineer==. Each box is something you built in an earlier week, so this week is mostly about connecting them and making them reliable.

The [[capstone|The team project that runs from Week 13 to Week 20. Here it is the Structural Inspection Assistant, which triages inspection photos and drafts a summary for an engineer to review.]] has three roles: Team lead (plan and schedule), Technical lead (the code) and Responsible-AI lead (the safety rules). Read the figure, then step through it.

```viz
{
  "type": "pipeline",
  "title": "Capstone pipeline: where each course week fits",
  "intro": "Step through the pipeline. Each step names the weeks whose ideas it uses.",
  "nodes": [
    { "id": "photo", "label": "Photo", "sub": "inspection image" },
    { "id": "vision", "label": "Classifier", "sub": "ViT / CLIP" },
    { "id": "rag", "label": "RAG", "sub": "checklist retrieval" },
    { "id": "draft", "label": "Draft", "sub": "LLM summary" },
    { "id": "rails", "label": "Guardrails", "sub": "input and output rails" },
    { "id": "eng", "label": "Engineer", "sub": "pass / fail decision" }
  ],
  "steps": [
    { "title": "1. Photo and input rail", "body": "A photo arrives. An input rail checks it is a usable image for this task before anything runs (Week 17: input rails).", "active": ["photo", "rails"] },
    { "title": "2. Classify the image", "body": "A vision model labels the photo as crack, spalling, corrosion or none (Weeks 4, 11: convolution and Vision Transformers; CLIP-style image-text models).", "active": ["vision"], "example": "Photo of a thin line on concrete → crack" },
    { "title": "3. Retrieve checklist items", "body": "The label becomes a search query over the checklist documents. The retriever returns the most similar passages (Week 16: RAG).", "active": ["rag"], "example": "Query: crack → passage on measuring crack width and location" },
    { "title": "4. Draft a summary", "body": "A language model writes a short summary using only the retrieved checklist text, and says when the documents do not cover something (Weeks 9, 16: prompting, grounding).", "active": ["draft"] },
    { "title": "5. Output rail", "body": "An output rail checks the draft: it must be labelled DRAFT, must not claim the structure is safe, and must not leak private details (Week 17: output rails).", "active": ["rails"] },
    { "title": "6. The engineer decides", "body": "The draft goes to a licensed engineer. The assistant never signs off on safety; every pass/fail decision is human.", "active": ["eng"] }
  ]
}
```

Notice the engineer is the last box, and nothing flows past it. ==The assistant helps triage; a licensed engineer makes every pass/fail decision.==

### The integration checklist

Work through this list in order. Do not start the next item until the previous one runs end to end on at least three example photos.

1. **Classifier.** Loads, runs offline, returns one of the four labels and a score.
2. **Retrieval.** ([[RAG|Retrieval-augmented generation: find relevant passages first, add them to the prompt, then let the model write its answer.]]) Each label retrieves at least one sensible checklist passage. Use fictional or clearly marked sample checklist text, never real engineering guidance.
3. **Draft.** The prompt tells the model to use only the retrieved text and to say "not covered" when it is missing.
4. **Guardrails.** [[Guardrails|Checks placed around a model that block or reshape unsafe or off-topic inputs and outputs. NeMo Guardrails has input, dialog and output rails.]] Input, dialog and output checks run, and a failing check blocks the output.
5. **Sign-off.** The result screen says DRAFT and names the human decision step.
6. **Documentation.** A README says how to run it, what it cannot do and who is responsible for which part.

### A suggested week

Your team can adjust this; your instructor announces any fixed dates.

```viz
{
  "type": "timeline",
  "title": "A suggested build schedule",
  "events": [
    { "year": "Day 1", "title": "Plan and freeze scope", "text": "Team lead lists what already works and what is missing. Cut anything that is not needed for the demo. Agree who does what." },
    { "year": "Day 2", "title": "Connect the pipeline", "text": "Technical lead wires classifier, retrieval and draft together on three example photos. A rough version that runs end to end beats a perfect part that runs alone." },
    { "year": "Day 3", "title": "Add rails and sign-off", "text": "Add input and output checks and the DRAFT label. Responsible-AI lead writes the list of things the assistant must never do." },
    { "year": "Day 4", "title": "Test and log failures", "text": "Run at least twenty photos per class, build a confusion matrix, and write each failure in a log with what happened and the fix." },
    { "year": "Day 5", "title": "Document and rehearse", "text": "Finish the README, record the failure log, and rehearse the five-part demo you will give in Week 20." }
  ]
}
```

## Test it and log the failures {rail=Testing}

{lede} A demo that works on your best photo proves little. ==A confusion matrix shows which mistakes your classifier makes and how often==, and tells you which to fix first.

A [[confusion matrix|A table that counts how often each true class was predicted as each class. Correct predictions are on the diagonal; every other cell is a mistake.]] has one row per true class and one column per predicted class. The numbers below are made up for teaching, for 20 photos per class.

```viz
{
  "type": "heatmap",
  "title": "Example confusion matrix (illustrative)",
  "rows": ["crack", "spalling", "corrosion", "none"],
  "cols": ["crack", "spalling", "corrosion", "none"],
  "corner": "true ↓ predicted →",
  "showValues": true,
  "rowsSumToOne": false,
  "W": [ [16, 2, 1, 1], [3, 15, 1, 1], [1, 2, 16, 1], [0, 1, 1, 18] ],
  "note": "Illustrative counts authored for teaching, not from a trained model. Each row sums to 20 photos."
}
```

Add the diagonal: 16 + 15 + 16 + 18 = 65 correct out of 80, so the accuracy is 65 / 80 = ==81.25%==. But accuracy is not the whole story. Look at the first row, last cell: one real crack was labelled "none". In inspection work that is the most serious mistake, because a missed crack might never reach the engineer. ==Log every such case first, and fix it first.==

A good failure-log row has four parts: the input, what the system did, what it should have done, and the fix (more data for that class, a stricter prompt, a rail, or a warning on the result screen).

The Responsible-AI lead's checklist:
- The assistant never states that a structure is safe or approves anything.
- Every output is labelled DRAFT and names the human decision step.
- Photos with people, faces or private property are handled as private data.
- The documentation lists known limits (lighting, angle, blur, damage types not in the four classes).
- Any use of AI tools in building the project is disclosed, as the course rules require.

## The mock NCA-GENL exam {rail=Mock exam}

{lede} The mock exam is a rehearsal: ==50 multiple-choice questions, 60 minutes, closed book, and 35 out of 50 (70%) counts as exam-ready==. Its job is to show you which areas to revise before Week 20.

### Timing

Sixty minutes for 50 questions is 60 × 60 / 50 = ==72 seconds per question== on average. That is a tight, even pace, so do not spend it all on the first pass.

- First pass at about 55 seconds per question: 50 × 55 = 2,750 seconds, about 46 minutes. Answer what you know; mark the rest and move on.
- That leaves 3,600 - 2,750 = 850 seconds, about 14 minutes, to return to marked questions.
- Pass mark: 35 / 50 = 0.70 = 70%. If every question is worth one mark, each is 2% of the total, so one slow question is not worth five minutes.
- When stuck, remove options you know are wrong, then pick the best remaining answer. Do not leave a question blank.

### Know where each question comes from

The questions follow the course, so asking "which area is this?" tells you which notes to open. Sort these ideas into the four terms.

```viz
{
  "type": "sorter",
  "title": "Which term teaches it?",
  "intro": "Sort each idea into the term where you met it.",
  "bins": [
    { "id": "prelim", "label": "Prelim (1-5)" },
    { "id": "midterm", "label": "Midterm (6-10)" },
    { "id": "prefinal", "label": "Pre-final (11-15)" },
    { "id": "final", "label": "Final (16-20)" }
  ],
  "cards": [
    { "name": "Backpropagation and the chain rule", "answer": "prelim", "why": "Week 3: how gradients flow backward through a network." },
    { "name": "Convolution with a small kernel", "answer": "prelim", "why": "Week 4: local connectivity and weight sharing." },
    { "name": "Byte-pair encoding (BPE)", "answer": "midterm", "why": "Week 6: how text is split into sub-word tokens." },
    { "name": "Multi-head self-attention", "answer": "midterm", "why": "Weeks 7-8: the core of the Transformer block." },
    { "name": "Chinchilla scaling rule", "answer": "midterm", "why": "Week 9: about 20 training tokens per parameter." },
    { "name": "Vision Transformer patches", "answer": "prefinal", "why": "Week 11: an image is cut into patches that become tokens." },
    { "name": "Generator versus discriminator", "answer": "prefinal", "why": "Week 12: the two networks of a GAN." },
    { "name": "Forward noising and reverse denoising", "answer": "prefinal", "why": "Week 13: diffusion models." },
    { "name": "LoRA and RLHF", "answer": "prefinal", "why": "Week 14: parameter-efficient fine-tuning and learning from human feedback." },
    { "name": "Retrieval-augmented generation", "answer": "final", "why": "Week 16: retrieve passages, add them to the prompt, then generate." },
    { "name": "Input, dialog and output rails", "answer": "final", "why": "Week 17: NeMo Guardrails." },
    { "name": "Quantization and parallelism", "answer": "final", "why": "Week 18: scaling and deploying models." }
  ],
  "note": "Each idea has one home week here, but later weeks reuse earlier ideas."
}
```

### How to review

1. Take a practice module in [Mock Exam Prep](/mock-exam) (3-5 questions each, unlimited attempts, 70% pass mark). Answers unlock after you submit.
2. For every wrong answer, write one line: which idea it tested and why the right answer is right.
3. Group your wrong answers by term. The term with the most is your revision priority.
4. Redo the module until you can explain each answer without looking.

## About the NCA-GENL certification {rail=Certification}

{lede} The course aims at the ==NVIDIA-Certified Associate, Generative AI LLMs (NCA-GENL)==. It is a separate exam, and it is run by NVIDIA, not by Supervaise. [[Proctored|Supervised during the exam, so that a person or system checks that you take it alone and under the rules.]] means supervised in this way.

- **NCA-GENL** (Level 1, the target) is issued by NVIDIA after its own proctored exam. Supervaise cannot issue it or guarantee it.
- **Readiness mark.** Scoring 70% on the mock exam is the course's mark of being exam-ready. Instructors send exam discount codes privately once a student reaches it.
- **NCP-GENL** (Level 2) is an optional, advanced Professional level. The Associate is the recommended prerequisite.
- The mock exam is practice. Passing it does not mean you have passed, or will pass, the NVIDIA exam. This course does not publish the NVIDIA exam's blueprint, so use the NVIDIA exam information for what it covers.

See [Certification](/certification) for your progress.

## Key takeaways {rail=Takeaway}

- The capstone is one pipeline: ==photo → classify → retrieve checklist items → draft → rails → engineer==. A licensed engineer makes every pass/fail decision.
- ==Test with a confusion matrix and log failures==; fix the dangerous mistakes (a missed crack) before the common ones.
- The mock exam is ==50 questions in 60 minutes (72 seconds each), pass at 35/50 = 70%==. Do a fast first pass and keep time for review.
- ==NCA-GENL is issued by NVIDIA after its own proctored exam==; the mock exam shows readiness and nothing more.

## Study plan {rail=Study plan}

Tick these off in order. Adjust the time to your own schedule.

- [ ] Run the capstone pipeline end to end on three photos (Day 2 of the schedule above).
- [ ] Build your confusion matrix and failure log.
- [ ] Take one [Mock Exam Prep](/mock-exam) module per term and note your scores.
- [ ] Revise the term where you scored lowest, using the lesson pages from the [course map](/course-map).
- [ ] Redo the Week 3-4 calculations by hand: forward pass, convolution output size.
- [ ] Redo the Week 9 and Week 18 calculations: Chinchilla tokens, memory per precision.
- [ ] Take the 50-question, 60-minute mock exam under real conditions: closed book, one sitting.
- [ ] Compute your score out of 50 and compare it with 35.
- [ ] Write down your three weakest ideas and fix them before Week 20.

## Capstone: what to submit this week {rail=Capstone}

Open [Capstone](/capstone) for the project brief and your team's page. This week you need a pipeline that runs end to end, your test results and failure log, the Responsible-AI checklist and your README. The Week 20 Demo Day is where you present it. Your instructor announces what is submitted and when.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

A twelve-question mini mock across the whole course, with an explanation after each one.

```quiz
{
  "id": "week-19-check",
  "title": "Week 19 quiz: Mini mock across the course",
  "passMark": 70,
  "questions": [
    {
      "q": "On the full mock exam (50 questions), how many correct answers are needed to reach the exam-ready mark of 70%?",
      "options": ["30", "33", "35", "40"],
      "answer": 2,
      "why": "0.70 × 50 = 35. Thirty correct would be 60%, and 40 would be 80%."
    },
    {
      "q": "The mock exam allows 60 minutes for 50 questions. What is the average time per question?",
      "options": ["60 seconds", "72 seconds", "84 seconds", "50 seconds"],
      "answer": 1,
      "why": "60 minutes = 3,600 seconds, and 3,600 / 50 = 72 seconds."
    },
    {
      "q": "In the Structural Inspection Assistant, who makes the pass/fail decision on a structure?",
      "options": ["The vision classifier", "The language model", "The output rail", "A licensed engineer"],
      "answer": 3,
      "why": "The assistant only triages and drafts. Every pass/fail decision is made by a licensed engineer."
    },
    {
      "q": "A team scores 80% on Technical implementation, which carries 40% of the capstone mark. How many of the 100 capstone points does that criterion add?",
      "options": ["32", "40", "8", "80"],
      "answer": 0,
      "why": "0.80 × 40 = 32 points. 40 is the maximum for the criterion, not the team's score."
    },
    {
      "q": "A confusion matrix has 20 photos per class and 4 classes, and 65 photos are on the diagonal. What is the accuracy?",
      "options": ["65%", "75%", "85%", "81.25%"],
      "answer": 3,
      "why": "There are 4 × 20 = 80 photos, so 65 / 80 = 0.8125, which is 81.25%."
    },
    {
      "q": "An 8 × 8 input is convolved with a 3 × 3 kernel, stride 1 and no padding. What is the output size?",
      "options": ["6 × 6", "8 × 8", "5 × 5", "7 × 7"],
      "answer": 0,
      "why": "Output side = (8 + 2 × 0 - 3) / 1 + 1 = 6, so the output is 6 × 6."
    },
    {
      "q": "A 224 × 224 image is cut into 16 × 16 patches for a Vision Transformer. How many patches (tokens, not counting any extra class token) result?",
      "options": ["14", "56", "196", "784"],
      "answer": 2,
      "why": "224 / 16 = 14 patches per side, and 14 × 14 = 196. 14 is only one side."
    },
    {
      "q": "By the Chinchilla rule of thumb of about 20 training tokens per parameter, how many tokens suit a 10-billion-parameter model?",
      "options": ["20 billion", "100 billion", "2 trillion", "200 billion"],
      "answer": 3,
      "why": "10 × 10⁹ × 20 = 200 × 10⁹ = 200 billion tokens. This is a rule of thumb, not an exact law."
    },
    {
      "q": "A LoRA adapter for one 4096 × 4096 matrix uses rank r = 8, with matrices A (4096 × 8) and B (8 × 4096). How many trainable parameters is that?",
      "options": ["65,536", "16,777,216", "32,768", "4,096"],
      "answer": 0,
      "why": "2 × d × r = 2 × 4096 × 8 = 65,536, versus 4096 × 4096 = 16,777,216 for the full matrix: about 0.4%."
    },
    {
      "q": "How many gigabytes do the weights of a 7-billion-parameter model need in INT8 (1 byte per parameter)?",
      "options": ["14 GB", "28 GB", "3.5 GB", "7 GB"],
      "answer": 3,
      "why": "7 × 10⁹ × 1 byte = 7 GB. 14 GB is FP16, 28 GB is FP32 and 3.5 GB is INT4."
    },
    {
      "q": "Which step of RAG most directly reduces hallucination about your own documents?",
      "options": ["Making the model larger", "Retrieving relevant passages and adding them to the prompt", "Raising the temperature", "Shortening the answer"],
      "answer": 1,
      "why": "Putting retrieved passages in the prompt gives the model facts to base its answer on. A higher temperature makes output more varied, not more accurate."
    },
    {
      "q": "Who issues the NCA-GENL certification?",
      "options": ["Supervaise, after the mock exam", "Your instructor, after the Week 20 exam", "NVIDIA, after its own proctored exam", "The capstone panel"],
      "answer": 2,
      "why": "NCA-GENL is issued by NVIDIA after its own proctored exam. Supervaise cannot issue or guarantee it."
    }
  ]
}
```

## Exit ticket and homework

Answer these three questions in one or two sentences each:
1. What is the last step of the capstone pipeline, and why?
2. Which type of classifier mistake do you fix first, and why?
3. Which term was your weakest on the mock exam, and what will you do about it?

**Homework / self-study**
- Finish the failure log and the Responsible-AI checklist.
- Redo any Mock Exam Prep module below 70%.
- Preview Week 20: the final exam review and Demo Day.
