# Generative AI & LLMs with NVIDIA — Course Outline

A Supervaise × NVIDIA programme. **20 weeks · 4 terms · 15 lab weeks · 1 capstone.**
The goal is a working AI application at the end, and readiness for the NVIDIA-Certified Associate exam (NCA-GENL).

## By the end, you can

1. Train and explain neural networks and CNNs
2. Build the core of a Transformer
3. Compare LLMs, prompt and fine-tune them
4. Explain multimodal, GAN and diffusion models
5. Design a RAG pipeline with guardrails
6. Ship a capstone and pass the mock NCA-GENL exam (70% = exam-ready)

## Term overview

| Term | Weeks | Theme |
|---|---|---|
| Prelim | 1–5 | How machines learn |
| Midterm | 6–10 | Language and Transformers |
| Pre-final | 11–15 | Images and generation |
| Final | 16–20 | Apps, agents and deployment |

---

## Term 1 — Prelim: How machines learn

| Week | Topic | Lab | Key outcomes |
|---|---|---|---|
| 1 | Course orientation & Intro to Generative AI | GA Lab 1 | Describe what GenAI is and how it differs from classification/regression; place key events in AI history (Dartmouth 1956, Perceptron 1958, deep learning, GPT-3, ChatGPT) |
| 2 | Machine Learning & Neural Networks | DL Lab 1 | Supervised learning (data, labels, loss, training, generalization); artificial neurons and layers |
| 3 | Deep Learning & Backpropagation | DL Lab 2B | Why depth helps; vanishing/exploding gradients; forward/backward pass and the chain rule |
| 4 | Convolutional Neural Networks | DL Lab 4B Part 1 | Why fully connected layers fit images poorly; local connectivity and weight sharing; computing a convolution by hand |
| 5 | **Prelim Exam** | — | Cumulative exam for the term |

## Term 2 — Midterm: Language and Transformers

| Week | Topic | Lab | Key outcomes |
|---|---|---|---|
| 6 | NLP: Tokens & Word Embeddings | GA Lab 2 | History of language models (rules → n-grams → neural); tokenization and sub-word BPE |
| 7 | Language Models & Attention | GA Lab 3 Part 1 | Why RNN/LSTM struggle with long sequences; why attention replaced them; hard vs soft attention |
| 8 | The Transformer & Autoregressive Training | GA Lab 3 Part 2 | Parts of a Transformer block; positional encoding (sinusoidal); multi-head self-attention |
| 9 | LLM Families, Scaling Laws & Prompt Engineering | GA Lab 4 | BERT vs GPT vs T5 vs Mixture-of-Experts; Chinchilla scaling; emergent abilities; prompting |
| 10 | **Midterm Exam** | — | Cumulative exam for the term |

## Term 3 — Pre-final: Images and generation

| Week | Topic | Lab | Key outcomes |
|---|---|---|---|
| 11 | Multimodal AI | GA Lab 5 | What multimodal models are; how a Vision Transformer (ViT) turns images into tokens |
| 12 | Image Generation & GANs | GA demo 6.1 | Generator vs discriminator; transpose convolution as learnable upsampling |
| 13 | Diffusion Models | GA Lab 6 | Forward (add noise) and reverse (denoise) processes; why a UNet with time embedding is the denoiser. **Capstone opens** |
| 14 | Training LLMs: Fine-tuning, RLHF, PEFT | GA Lab 7 | Pre-training vs continued pre-training vs fine-tuning; instruction tuning and RLHF |
| 15 | **Pre-final Exam + Capstone proposal** | — | Cumulative exam plus capstone proposal session |

## Term 4 — Final: Apps, agents and deployment

| Week | Topic | Lab | Key outcomes |
|---|---|---|---|
| 16 | LLM Components & RAG | GA Lab 8 Part 1 | Template, tokenizer, model, parser, chain; why LLMs hallucinate and how RAG reduces it |
| 17 | AI Agents, Guardrails & Trustworthy AI | GA Lab 8 Part 2 | Agent = model + tools + reasoning loop + memory; input, dialog and output rails with NeMo Guardrails |
| 18 | Scaling & Deploying AI | GA Lab 9 | Data, tensor and pipeline parallelism; mixed precision and quantization |
| 19 | Capstone Build Week + Mock NCA-GENL Exam | — | Build a working application; 50-question, 60-minute mock exam (70% = exam-ready) |
| 20 | **Final Exam & Demo Day** | — | Cumulative final exam, then capstone demos |

---

## Assessment scheme

| Component | Timing |
|---|---|
| Hands-on laboratories (GA Lab and DL Lab series) | Weeks 1–18, except exam weeks |
| Weekly knowledge checks | Weeks 1–4, 6–9, 11–14, 16–18 |
| Prelim examination | Week 5 |
| Midterm examination | Week 10 |
| Pre-final examination and capstone proposal | Week 15 |
| Capstone build and mock NCA-GENL examination | Week 19 |
| Final examination and Demo Day | Week 20 |

Component weights are not stated in the course outline. The demo schedule shows the capstone at 20% of the final grade, Laboratory 3 at 10%, Quiz 4 at 5% and the Midterm at 25%.

**Course rules:** attendance is required at laboratories and examinations; submitted work must be your own, with any AI assistance disclosed; late work is marked Overdue and handled under the course policy.

## Capstone project (Weeks 13–20)

**Structural Inspection Assistant** — a team project (20% of final grade) that triages inspection photos and drafts a summary for an engineer to review.

- **Pipeline:** photo in → classify (crack / spalling / corrosion / none) → find checklist items (RAG) → draft summary for the engineer
- **Tech:** Vision (ViT/CLIP), RAG over checklists, NeMo Guardrails
- **AI-use rule:** a licensed engineer makes every pass/fail decision; the assistant never signs off on safety
- **Roles:** Team lead · Technical lead · Responsible-AI lead

| Criterion | Weight |
|---|---|
| Problem and proposal | 15% |
| Technical implementation | 40% |
| Responsible AI | 15% |
| Presentation | 20% |
| Documentation | 10% |

## Prompt Lab (Week 9)

A 90-minute lab on Llama-3.1-8B-Instruct (NVIDIA DGX Spark), graded out of 34 points plus a 4-point bonus.

| Exercise | Points |
|---|---|
| Setup (Ex. 0) | 4 |
| Zero-shot, few-shot, role (Ex. 1–3) | 8 |
| Chain-of-thought (Ex. 4) | 6 |
| JSON and validation (Ex. 5) | 6 |
| Injection (Ex. 6) | 5 |
| Temperature and top-p (Ex. 7) | 5 |
| Evaluation (Ex. 8) | 6 |
| Extension: templates and prompt card (Ex. 9–10) | +4 bonus |

## Exam preparation and certification

- **Mock Exam Prep:** timed practice modules (3–5 questions each, unlimited attempts, 70% pass mark, answers unlock after submission).
- **Full mock (Week 19):** 50 multiple-choice questions, 60 minutes, closed book, pass at 35/50 (70%).
- **NCA-GENL** (Level 1, the target): NVIDIA-Certified Associate, Generative AI LLMs. Issued by NVIDIA after its own proctored exam. Supervaise cannot issue or guarantee it. Instructors send exam discount codes privately once a student reaches the readiness mark.
- **NCP-GENL** (Level 2, optional): the advanced Professional level. The Associate is the recommended prerequisite.

## Application screens

| Route | Screen |
|---|---|
| `/` | Landing page |
| `/dashboard` | Student overview |
| `/course-map` | Course map (20 weeks, 4 terms) |
| `/lesson/:week` | Lesson workspace |
| `/prompt-workshop` | Prompt engineering workshop |
| `/capstone` | Capstone project |
| `/mock-exam` | Mock exam prep |
| `/certification` | Achievements & certification |
| `/educator` | Faculty console (educators only) |

> Source: the Course Map data in `frontend/src/pages/CourseMap.jsx` and the Capstone, Certificates, Mock Exam and Prompt Workshop designs. Only Week 1 and Week 7 have full lesson content so far (`backend/content/`).
