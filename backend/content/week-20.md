> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 20 — Final Exam & Demo Day

**Purpose:** Prepare for the cumulative final exam by ==reviewing the whole course as one connected story==, then show your capstone on Demo Day.

**Term:** Final (Weeks 16–20) · **Month:** 5 · **Time:** about 30 minutes for this page; your instructor announces the exam and Demo Day schedule

```viz
{
  "type": "hook",
  "title": "Watch the course in four moves",
  "caption": "The whole course in a few seconds: text is split into tokens, a model scores the next token, training lowers the loss, and retrieval grounds the answer in your documents. The probabilities and the answer are made up for illustration.",
  "scenes": [
    { "name": "Tokens", "kind": "tokens", "prompt": "unbelievably", "outputLabel": "Sub-word tokens (Week 6)", "tokens": ["un", "believ", "ably"] },
    { "name": "Next token", "kind": "bars", "prompt": "The capital of France is …", "outputLabel": "Probability of the next token (Weeks 7–9)",
      "bars": [ { "label": "Paris", "value": 0.72 }, { "label": "Lyon", "value": 0.12 }, { "label": "France", "value": 0.08 }, { "label": "pizza", "value": 0.08 } ] },
    { "name": "Training", "kind": "loss", "prompt": "Training lowers the loss (Weeks 2–3)", "outputLabel": "Training loss" },
    { "name": "Grounded answer", "kind": "text", "prompt": "Question about a document the model never saw", "outputLabel": "RAG answer (Week 16)",
      "output": "Retrieved: the loan policy passage. Answer: 14 days, according to that passage. If the passage were missing: I do not know." }
  ]
}
```

## By the end, you can…

1. ==Compute== the standard quantities from each term: a convolution output size, a gradient after several layers, an attention scale, tokens from the Chinchilla rule, a memory estimate.
2. ==Explain== the main ideas of each term in your own words: how machines learn, Transformers, image generation and fine-tuning, RAG, agents and deployment.
3. ==Map any exam topic== to the week where you met it, so you know what to revise.
4. ==Present your capstone== in five parts and connect each part to the marking criteria.
5. ==Say what comes next==: the NVIDIA-Certified Associate exam (NCA-GENL) and the optional NCP-GENL.

This week has no new lecture. The final exam is cumulative, so it can draw on any week. Your instructor announces the date, room and format of the exam and of Demo Day. Terms with a dotted underline open a short definition when you select them.

## Prelim: how machines learn (Weeks 1–5) {rail=Prelim}

{lede} A model is a function with adjustable numbers. ==Training adjusts those numbers to lower a loss, using gradients from backpropagation==, and a CNN saves parameters by sliding a small kernel over an image.

Key ideas to be able to explain:
- **Generative vs discriminative** (Week 1): one makes new content, the other labels or scores existing data.
- **Supervised learning** (Week 2): data and labels, a loss that measures error, training that lowers it, and generalization to data the model has not seen.
- **Backpropagation** (Week 3): the chain rule carries the gradient from the loss back to every weight. A [[vanishing gradient|A gradient that shrinks toward zero as it passes back through many layers, so early layers learn very slowly.]] is the main trouble with sigmoid layers in a deep network.
- **Convolution** (Week 4): a small kernel slides over the input, with weights shared at every position.

### Convolution by hand

Output side = (n + 2p - k) / s + 1 for input n, padding p, kernel k and stride s. For a 4 × 4 input, a 2 × 2 kernel, stride 1 and no padding: (4 + 0 - 2) / 1 + 1 = 3, so the output is 3 × 3. Check it in the figure.

```viz
{
  "type": "conv",
  "title": "Check the output size",
  "mode": "conv",
  "stride": 1,
  "padding": 0,
  "input": [ [1, 2, 0, 1], [0, 1, 3, 1], [2, 1, 0, 0], [1, 0, 1, 2] ],
  "kernel": [ [1, 0], [0, -1] ]
}
```

Change nothing yet: confirm the 3 × 3 result and recompute one output cell by hand. Each output is the sum of kernel × the 2 × 2 patch under it.

### Why sigmoid struggles in deep networks

The slope of a sigmoid is at most 0.25. Backpropagation multiplies the gradient by a slope at each layer, so even at best the gradient after 5 sigmoid layers is 0.25⁵ = 1/1024, about 0.001. A ReLU has slope 1 for positive inputs.

```viz
{
  "type": "curve",
  "title": "Gradient of sigmoid versus ReLU",
  "xRange": [-6, 6],
  "yRange": [-0.1, 1.2],
  "series": [ { "fn": "sigmoid_grad", "label": "Sigmoid gradient" }, { "fn": "relu_grad", "label": "ReLU gradient" } ],
  "alt": "The sigmoid gradient is a small bump with a peak of 0.25 at x = 0 that falls to nearly zero on both sides. The ReLU gradient is 0 for negative x and 1 for positive x.",
  "note": "Plots of the two derivative functions. The 0.25 peak of the sigmoid gradient is its maximum."
}
```

Notice that the sigmoid bump never rises above 0.25 and is nearly zero for large positive or negative inputs, while ReLU stays at 1 on the right.

## Midterm: language and Transformers (Weeks 6–10) {rail=Midterm}

{lede} Language models turn ==text into tokens, tokens into vectors, and then use attention to let every token look at the others==. Scale and prompting then decide how well the model behaves.

Key ideas to be able to explain:
- **Tokenization and BPE** (Week 6): frequent character pairs are merged into sub-word tokens, so "unbelievably" can become un + believ + ably.
- **Attention** (Weeks 7-8): the weights are softmax(QKᵀ / √d_k), then used to average the values V. With d_k = 64 the scale is √64 = 8. [[Positional encoding|Extra numbers added to token vectors so the model knows word order, because attention by itself ignores order.]] puts order back in.
- **Decoder-only training** (Week 8): the model predicts the next token, and a causal mask stops each token from seeing the future.
- **Families and scaling** (Week 9): BERT (encoder), GPT (decoder), T5 (encoder-decoder), Mixture-of-Experts; about 20 training tokens per parameter in the Chinchilla rule, so a 30-billion-parameter model suits 30 × 20 = 600 billion tokens. Prompting techniques: zero-shot, few-shot, role, chain-of-thought.

### The causal mask

Each row is a token that is looking; a 1 means it may look at that column. The word "sat" (row 3) can see "The", "cat" and itself: three tokens.

```viz
{
  "type": "heatmap",
  "title": "Causal mask for a 4-token sentence",
  "rows": ["The", "cat", "sat", "down"],
  "cols": ["The", "cat", "sat", "down"],
  "corner": "looking token ↓ visible token →",
  "showValues": true,
  "rowsSumToOne": false,
  "W": [ [1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1] ],
  "note": "1 = visible, 0 = hidden. A mask, not learned weights."
}
```

Notice that everything above the diagonal is hidden. That is what lets the model train on all positions at once while still learning to predict only from the past.

## Pre-final: images and generation (Weeks 11–15) {rail=Pre-final}

{lede} The same ideas extend to images. ==A Vision Transformer turns an image into patch tokens; GANs and diffusion models generate images; fine-tuning and RLHF shape what a pre-trained LLM does==.

Key ideas to be able to explain:
- **Multimodal and ViT** (Week 11): a 224 × 224 image cut into 16 × 16 patches gives 14 × 14 = 196 patch tokens.
- **GANs** (Week 12): a generator makes fakes and a discriminator tries to tell them from real data; transpose convolution upsamples.
- **Diffusion** (Week 13): the forward process adds noise step by step; a UNet with a time embedding learns the reverse, removing a little noise each step.
- **Training LLMs** (Week 14): pre-training, continued pre-training and fine-tuning; instruction tuning and RLHF (Ouyang et al., 2022); [[PEFT|Parameter-efficient fine-tuning: train a small number of added or selected parameters instead of the whole model.]] such as LoRA (Hu et al., 2021).

### LoRA arithmetic

A LoRA adapter on one d × d matrix adds A (d × r) and B (r × d), so 2 × d × r trainable numbers. For d = 4096 and r = 8 that is 2 × 4096 × 8 = 65,536, against 4096 × 4096 = 16,777,216 for the full matrix: about 0.39%. Set the sliders to check.

```viz
{
  "type": "calc",
  "title": "Full matrix versus LoRA adapter",
  "kind": "lora",
  "intro": "Set d to 4096 and the rank r to 8, then compare the two counts."
}
```

Notice that the adapter grows with d × r, not with d × d. Here it is 16,777,216 / 65,536 = 256 times fewer numbers to train.

## Final: apps, agents and deployment (Weeks 16–20) {rail=Final}

{lede} An LLM application is ==a chain of parts around the model==. RAG gives it facts, agents give it tools, guardrails keep it safe, and parallelism and precision let it run at scale.

- **Chain and RAG** (Week 16): template → tokenizer → model → parser. A plain LLM can hallucinate; RAG [[retrieves|Finds the stored passages most similar to the question so they can be added to the prompt.]] passages first, adds them to the prompt, then generates.
- **Agents and guardrails** (Week 17): agent = model + tools + a reasoning loop + memory. Input, dialog and output rails (NeMo Guardrails) check what goes in, steer the conversation and check what comes out. A human stays responsible.
- **Scaling and deployment** (Week 18): weights memory is parameters × bytes per parameter, so a 13-billion-parameter model is 13 × 0.5 = 6.5 GB in INT4. Data, tensor and pipeline parallelism split the work; mixed precision speeds training and quantization shrinks a model for inference.

```viz
{
  "type": "pipeline",
  "title": "A RAG application end to end",
  "intro": "Step through one question and watch the guardrails and the retrieval work together.",
  "nodes": [
    { "id": "in", "label": "Input rail", "sub": "check the question" },
    { "id": "ret", "label": "Retrieve", "sub": "find passages" },
    { "id": "aug", "label": "Augment", "sub": "build the prompt" },
    { "id": "gen", "label": "Generate", "sub": "LLM writes" },
    { "id": "out", "label": "Output rail", "sub": "check the reply" }
  ],
  "steps": [
    { "title": "Check the question", "body": "An input rail screens the user's message, for example for an attempt to override the instructions.", "active": ["in"], "example": "How many days do I have to return a book?" },
    { "title": "Retrieve passages", "body": "The question is compared with the stored passages and the most similar ones are returned.", "active": ["ret"], "example": "Passage: Books may be borrowed for 14 days. (a made-up policy)" },
    { "title": "Augment the prompt", "body": "The retrieved text is put in the prompt, with an instruction to answer only from it and to say when it does not know.", "active": ["aug"] },
    { "title": "Generate", "body": "The model writes an answer grounded in the passage, which reduces hallucination about your documents.", "active": ["gen"] },
    { "title": "Check the reply", "body": "An output rail checks the reply before the user sees it, for example for private details or unsupported claims.", "active": ["out"] }
  ]
}
```

Notice the order: rail, retrieve, augment, generate, rail. Remember where each step sits, because exam questions often ask which stage fixes which problem.

### Which tool fixes which problem?

```viz
{
  "type": "sorter",
  "title": "Match the problem to the fix",
  "intro": "Decide which approach is the main fix for each problem.",
  "bins": [
    { "id": "rag", "label": "RAG" },
    { "id": "rails", "label": "Guardrails" },
    { "id": "scale", "label": "Quantization or parallelism" }
  ],
  "cards": [
    { "name": "The assistant must answer from this week's checklist documents, which the model never saw in training.", "answer": "rag", "why": "Retrieving the documents and adding them to the prompt gives the model the facts." },
    { "name": "The model gives out facts that are newer than its training data.", "answer": "rag", "why": "Retrieval from up-to-date documents works around the training cut-off." },
    { "name": "A user tries to make the assistant ignore its instructions.", "answer": "rails", "why": "An input rail is built to catch this kind of message." },
    { "name": "The reply must never include a private email address.", "answer": "rails", "why": "An output rail checks the reply before it is shown." },
    { "name": "A 70-billion-parameter model's weights do not fit on a single GPU.", "answer": "scale", "why": "Tensor or pipeline parallelism splits the model, and quantization shrinks it." },
    { "name": "The same model must run in less memory on a small server.", "answer": "scale", "why": "Quantizing to INT8 or INT4 reduces weight memory by 2 to 4 times." }
  ]
}
```

### The course on one line

```viz
{
  "type": "timeline",
  "title": "The course in four steps",
  "events": [
    { "year": "Weeks 1-5", "title": "How machines learn", "text": "Generative AI, neural networks, backpropagation, convolution. Everything later is built from these." },
    { "year": "Weeks 6-10", "title": "Language and Transformers", "text": "Tokens, embeddings, attention, the Transformer, LLM families, scaling laws and prompting." },
    { "year": "Weeks 11-15", "title": "Images and generation", "text": "Multimodal models and ViT, GANs, diffusion, fine-tuning, RLHF and PEFT. The capstone opens in Week 13." },
    { "year": "Weeks 16-20", "title": "Apps, agents and deployment", "text": "Components and RAG, agents and guardrails, scaling and deployment, capstone and exams." }
  ]
}
```

## Key takeaways {rail=Takeaway}

- ==The final exam is cumulative==, so revise by term and by calculation: convolution size, gradient shrinkage, attention scale, Chinchilla tokens, patch counts, LoRA parameters, memory per precision.
- ==Each term builds on the previous one==: learning → Transformers → images and generation → applications and deployment.
- On Demo Day, ==show the problem, a live demo, how it works, your responsible-AI choices and what you would do next==.
- ==NCA-GENL is a separate exam issued by NVIDIA==; Supervaise cannot issue or guarantee it.

## Study plan {rail=Study plan}

- [ ] Take a [Mock Exam Prep](/mock-exam) module for each term and note your scores.
- [ ] Read the review sections above and list every idea you could not explain in two sentences.
- [ ] Redo the calculations: convolution size, gradient after five sigmoid layers, attention scale, Chinchilla tokens, ViT patches, LoRA parameters, memory per precision.
- [ ] Reopen the lab notebooks for the weeks you found hardest.
- [ ] Take a full timed practice, as in Week 19, and check your score against 70%.
- [ ] Rehearse your Demo Day talk once out loud.

Your instructor announces the exam date, room and format; this page does not give them.

## Capstone Demo Day {rail=Demo Day}

{lede} A demo is not a tour of your code. It is ==a short story: the problem, a live demo, how it works, your responsible-AI choices and what you would do next==. Open [Capstone](/capstone) for the brief. Your instructor announces the length of each slot and the order of teams.

| Part | What to show | Marking criterion it supports |
|---|---|---|
| 1. The problem | Who inspects structures, what is slow or risky today, and what your assistant does (and does not do) | Problem and proposal (15%) |
| 2. Live demo | One photo through the whole pipeline: classify, retrieve checklist items, draft summary | Technical implementation (40%) |
| 3. How it works | The pipeline diagram, the vision model, the RAG index, the rails; one test result such as your confusion matrix | Technical implementation (40%), Documentation (10%) |
| 4. Responsible-AI choices | The DRAFT label, the engineer's sign-off, your rails, a failure you found and how you handled it | Responsible AI (15%) |
| 5. What next | Known limits and the next improvement | Presentation (20%) |

The weights add up: 15 + 40 + 15 + 20 + 10 = 100%. If a team earns 60% on Responsible AI, which is worth 15% of the capstone, that is 0.60 × 15 = 9 points. The largest share, 40%, is technical implementation, so make sure the live demo works. Have a backup, such as a recorded run or screenshots, in case it does not.

Tips: rehearse with a timer, let each team member speak, show a failure honestly, and say clearly that a licensed engineer makes every pass/fail decision. Disclose any AI assistance, as the course rules require.

## What next: NCA-GENL and beyond

- **NCA-GENL** (Level 1, the target) is the NVIDIA-Certified Associate, Generative AI LLMs. It is issued by NVIDIA after its own proctored exam. Supervaise cannot issue it or guarantee it.
- Instructors send exam discount codes privately once a student reaches the readiness mark (70% on the mock exam).
- **NCP-GENL** (Level 2) is the optional, advanced Professional level. The Associate is the recommended prerequisite.
- See [Certification](/certification) for your progress. Keep building: your capstone is the start of a portfolio.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Twelve cumulative questions, with an explanation after each one.

```quiz
{
  "id": "week-20-check",
  "title": "Week 20 quiz: Cumulative review",
  "passMark": 70,
  "questions": [
    {
      "q": "A 4 × 4 input is convolved with a 2 × 2 kernel, stride 1 and no padding. What is the output size?",
      "options": ["4 × 4", "3 × 3", "2 × 2", "5 × 5"],
      "answer": 1,
      "why": "(4 + 0 - 2) / 1 + 1 = 3, so the output is 3 × 3."
    },
    {
      "q": "The slope of a sigmoid is at most 0.25. At best, what is the gradient factor after passing back through 5 sigmoid layers?",
      "options": ["About 1.25", "About 0.25", "About 0.001", "Exactly 0"],
      "answer": 2,
      "why": "0.25⁵ = 1/1024 ≈ 0.00098. This shrinkage is the vanishing-gradient problem. It is small but not exactly 0."
    },
    {
      "q": "In scaled dot-product attention with d_k = 64, by what number are the dot products QKᵀ divided before the softmax?",
      "options": ["8", "64", "4,096", "0.125"],
      "answer": 0,
      "why": "The scale is √d_k = √64 = 8. Dividing by 0.125 would multiply by 8 instead."
    },
    {
      "q": "In a causal mask for a 4-token sentence, how many tokens (including itself) can the third token attend to?",
      "options": ["1", "2", "4", "3"],
      "answer": 3,
      "why": "A causal mask hides the future: token 3 sees tokens 1, 2 and 3. Seeing all 4 would be the unmasked case."
    },
    {
      "q": "By the Chinchilla rule of thumb (about 20 tokens per parameter), how many training tokens suit a 30-billion-parameter model?",
      "options": ["60 billion", "600 billion", "6 trillion", "30 billion"],
      "answer": 1,
      "why": "30 × 10⁹ × 20 = 600 × 10⁹ = 600 billion tokens. It is a rule of thumb, not an exact law."
    },
    {
      "q": "A 32 × 32 image is cut into 8 × 8 patches for a Vision Transformer. How many patches result?",
      "options": ["4", "8", "16", "64"],
      "answer": 2,
      "why": "32 / 8 = 4 patches per side, and 4 × 4 = 16. Four is only one side of the grid."
    },
    {
      "q": "A LoRA adapter on a 1024 × 1024 matrix uses rank r = 4. How many trainable parameters does it add?",
      "options": ["8,192", "4,096", "1,048,576", "2,048"],
      "answer": 0,
      "why": "2 × d × r = 2 × 1024 × 4 = 8,192, compared with 1,048,576 in the full matrix."
    },
    {
      "q": "In a diffusion model, what does the trained network do in the reverse process?",
      "options": ["It adds a little more noise at each step.", "It compares real and fake images.", "It cuts the image into patches.", "It removes a little noise at each step to move toward an image."],
      "answer": 3,
      "why": "The forward process adds noise; the reverse process, done by a UNet with a time embedding, removes it step by step. Comparing real and fake images is the GAN discriminator."
    },
    {
      "q": "How much memory do the weights of a 13-billion-parameter model need in INT4 (half a byte per parameter)?",
      "options": ["26 GB", "13 GB", "6.5 GB", "3.25 GB"],
      "answer": 2,
      "why": "13 × 10⁹ × 0.5 bytes = 6.5 GB. 26 GB would be FP16 and 13 GB INT8."
    },
    {
      "q": "Which rail checks the model's reply before the user sees it?",
      "options": ["Input rail", "Output rail", "Dialog rail", "Retrieval index"],
      "answer": 1,
      "why": "An output rail checks the reply. An input rail checks the user's message, and a dialog rail steers the conversation."
    },
    {
      "q": "What is the loop that an LLM agent repeats?",
      "options": ["Reason, act with a tool, observe the result, repeat", "Tokenize, embed, decode, stop", "Retrieve, rank, discard, retrain", "Generate, translate, summarize, stop"],
      "answer": 0,
      "why": "An agent is a model with tools, memory and a reasoning loop: it decides on an action, uses a tool, observes the outcome and continues. The other options are not the agent loop."
    },
    {
      "q": "A team earns 60% of the available marks on Responsible AI, which carries 15% of the capstone grade. How many of the 100 capstone points is that?",
      "options": ["15", "60", "6", "9"],
      "answer": 3,
      "why": "0.60 × 15 = 9 points. The 15 is the criterion's maximum and 60 is the percentage earned."
    }
  ]
}
```

## Exit ticket and homework

Answer these three questions in one or two sentences each:
1. Pick one idea from each term and say how it connects to your capstone.
2. Which calculation do you still find hardest, and what will you do about it?
3. What is the one limit of your assistant you will state clearly on Demo Day?

**Homework / self-study**
- Finish your study plan and your Demo Day rehearsal.
- Redo any Mock Exam Prep module below 70%.
- If you have reached the readiness mark, watch for your instructor's message about NCA-GENL.
