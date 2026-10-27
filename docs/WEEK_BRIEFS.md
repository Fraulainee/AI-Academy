# Per-week briefs

Use with `docs/LESSON_FORMAT.md` (format, figures, quiz, accuracy rules) and `COURSE_OUTLINE.md` (the authoritative list of weeks, labs and outcomes). Week 1 is `backend/content/week-01.md` (reference). Week 7 keeps its hand-built lesson and has no file. "Figures" below are suggestions of *types*; choose the ones that teach the week best (≥ 3 besides the hook, ≥ 2 different types). Where a figure needs data, **you** author it and verify any number with Python.

Common to every week: the lab runs offline on the shared DGX Spark (PyTorch, `transformers`, scikit-learn, NumPy, matplotlib available; no `pip install`; no internet; Hugging Face models only from the offline cache, so confirm IDs with the instructor). Prefer datasets that need no download: generate synthetic data, or `sklearn.datasets.load_digits` (8×8 handwritten digits, ships with scikit-learn), `load_iris`, `make_moons`, `make_blobs`.

## Prelim (Weeks 1–5): How machines learn

### Week 2 — Machine Learning & Neural Networks · DL Lab 1
Outcomes (outline): supervised learning (data, labels, loss, training, generalization); artificial neurons and layers.
- Concept sections: what supervised learning is (features, labels, model, loss, training loop, generalisation, train/validation/test split, overfitting: describe in words and a small table, there is no train-vs-validation figure); one neuron (weights, bias, activation) and why one neuron cannot do XOR; layers and a hidden layer; training = gradient descent on a loss.
- Figures: `neuron` (a separable set and an XOR set; the XOR tab must show that no line gets all four points), `descent` (learning-rate slider; `quad`), `sorter` (e.g. supervised vs unsupervised vs "generation" tasks, or regression vs classification examples), optionally `curve` (activation functions: sigmoid, tanh, ReLU) and `pipeline` (the training loop: batch → predict → loss → backprop → update).
- Hook ideas: `loss` scene (training loss falls), `bars` (class probabilities after training), `tokens` not suitable.
- Lab: a small PyTorch classifier on a noisy XOR or `make_moons` dataset: `nn.Sequential(Linear, Tanh, Linear)`, `BCEWithLogitsLoss`, SGD, the five-step loop, accuracy, decision boundary plot; exercises on learning rate and hidden size. Go further: UvA Tutorial 2 (Introduction to PyTorch).
- Quiz must include one neuron-output calculation and one mean-squared-error calculation (compute them).

### Week 3 — Deep Learning & Backpropagation · DL Lab 2B
Outcomes: why depth helps; vanishing/exploding gradients; forward/backward pass and the chain rule.
- Concept sections: why depth (hierarchy of features); forward pass on a tiny network; backward pass and the chain rule with real numbers; vanishing and exploding gradients and what helps (ReLU-family activations, careful initialisation, residual connections, normalisation, gradient clipping).
- Figures: `pipeline` stepping through a tiny computation graph with **verified numbers** (e.g. y = σ(w·x + b), loss = (y − t)²; state each intermediate value and the gradient of the loss with respect to w and b; check with PyTorch autograd or finite differences in Python), `curve` (sigmoid and its gradient, which peaks at 0.25; ReLU and its gradient), `curve` with `decay` and `logY` (gradient after n layers when each layer multiplies it by 0.25 vs 1.0 vs 1.5 → use a slider for the factor; 1.5 explodes so use a linear y range or explain that the plot is for factors ≤ 1), `descent` optional, `sorter` (which fix addresses vanishing vs exploding gradients).
- Hook ideas: `loss`, `bars`, a custom `text` scene describing a chain rule.
- Lab: verify the hand-computed gradients with `torch.autograd`; build a 10-layer MLP with sigmoid vs ReLU and plot per-layer gradient norms (`matplotlib`); try Kaiming vs tiny initialisation. Go further: UvA Tutorial 3 (Activation functions) and Tutorial 4 (Optimization and initialization).

### Week 4 — Convolutional Neural Networks · DL Lab 4B Part 1
Outcomes: why fully connected layers fit images poorly; local connectivity and weight sharing; computing a convolution by hand.
- Concept sections: images as grids of numbers; the parameter problem of fully connected layers; the convolution operation (kernel, stride, padding, output size = ⌊(n + 2p − k)/s⌋ + 1); feature maps, pooling, and a small CNN stack (conv → ReLU → pool → flatten → fully connected) with shape bookkeeping; (briefly) residual connections as the idea behind ResNet.
- Figures: `conv` (by hand with a vertical-edge kernel on a small input; a second one with stride 2 or padding 1), `calc` `fc_vs_conv`, `pipeline` (the CNN stack with the tensor shape at each stage for a 28×28×1 input; compute the shapes), `sorter` (layer types vs the job they do), `patch` is NOT for this week.
- Hook ideas: `conv` scene (filter sliding), `bars`.
- Lab: compute a convolution by hand and verify with `torch.nn.functional.conv2d`; output-size formula checks; train a small CNN on `sklearn.datasets.load_digits` (8×8) vs a fully connected net with a similar parameter count; count parameters with `sum(p.numel())`. Go further: UvA Tutorial 5 (Inception, ResNet, DenseNet).

### Week 5 — Prelim Exam (Weeks 1–4 content)
Exam-week format (see LESSON_FORMAT §7). Review sections by theme: what generative vs discriminative models are and the AI timeline (Week 1); supervised learning, the neuron, gradient descent (Week 2); backpropagation, vanishing gradients (Week 3); convolution and CNNs (Week 4).
- Figures: `sorter` (mixed concepts across weeks, 3 bins e.g. "Week 1–2 idea", "Week 3 idea", "Week 4 idea" or by concept family), `timeline` or `pipeline` (the training loop), `heatmap`/`conv` for a retrieval-practice calculation, `curve`.
- Study plan: a prioritised review checklist and how to use [Mock Exam Prep](/mock-exam). Quiz: 10–12 cumulative questions, several requiring a calculation from Weeks 2–4.

## Midterm (Weeks 6–10): Language and Transformers

### Week 6 — NLP: Tokens & Word Embeddings · GA Lab 2
Outcomes: history of language models (rules → n-grams → neural); tokenization and sub-word BPE.
- Concept sections: from rules to statistics to neural models (timeline); n-gram language models and their limits; tokens and vocabularies, why sub-words (BPE) rather than words or characters; embeddings: words as vectors, similarity, analogies (and their limits and biases).
- Figures: `timeline` (LM history), `ngram` (a text of ≥ 25 words), `bpe` (use the classic low/lower/newest/widest corpus or a better one with repeated word pieces), `scatter` (illustrative 2-D embeddings with one analogy that the validator confirms; groups such as animals, fruits, royalty, cities/countries), `calc`? no.
- Hook: `tokens` scene ("unbelievably" → un · believ · ably style; use a split you are sure is plausible and say "an example split"), `bars` (next-word probabilities).
- Lab: pure-Python bigram counts + sampling; implement BPE merges for a tiny corpus and compare with the figure; tokenise a few sentences (English and Filipino/Cebuano if you wish, report what the tokenizer gives without claiming specific counts) with a Hugging Face tokenizer such as `gpt2` and `bert-base-uncased`; embeddings with `sentence-transformers/all-MiniLM-L6-v2` (confirm cached) and cosine similarity. No UvA notebook this week.

### Week 8 — The Transformer & Autoregressive Training · GA Lab 3 Part 2
Outcomes: parts of a Transformer block; positional encoding (sinusoidal); multi-head self-attention. (Week 7, with its hand-built lesson, covered attention itself: scaled dot-product attention, soft vs hard attention, the √d_k scaling, queries/keys/values. Recap it in two sentences and do not repeat it.)
- Concept sections: why order must be injected (attention is permutation-equivariant) and sinusoidal positional encoding; multi-head self-attention (heads, concatenation and output projection); the block (self-attention → add & layer-norm → feed-forward → add & layer-norm) and stacking; autoregressive (decoder) training: next-token prediction, shifting targets by one, the causal mask, teacher forcing.
- Figures: `posenc`, `pipeline` (the Transformer block, 6+ nodes), `heatmap` (a causal mask where visible = 1, hidden = 0, with a second tab of two illustrative heads; mark illustrative), `flow` (encoder block vs decoder block) or `sorter`, optionally `calc`? no.
- Hook: `bars` (next-token probabilities after a prompt), `tokens`, `loss`.
- Lab: implement sinusoidal positional encoding in NumPy and compare with the figure's formula; implement multi-head attention and the causal mask in PyTorch (shapes `(batch, heads, seq, d_head)`); a tiny next-token model on a repeated toy string; check that the loss falls. **Go further: UvA Tutorial 6 (Transformers and Multi-Head Attention)**: Multi-Head Attention, Transformer Encoder, Positional encoding and the sequence-reversal experiment (classes `MultiheadAttention`, `EncoderBlock`, `PositionalEncoding`). Mention that Tutorial 6's first sections recap Week 7's scaled dot-product attention.

### Week 9 — LLM Families, Scaling Laws & Prompt Engineering · GA Lab 4 (+ Prompt Lab)
Outcomes: BERT vs GPT vs T5 vs Mixture-of-Experts; Chinchilla scaling; emergent abilities; prompting.
- Concept sections: three Transformer families (encoder-only/BERT, decoder-only/GPT, encoder-decoder/T5) and mixture-of-experts (a router sends each token to a few expert networks); scaling laws and Chinchilla's compute-optimal rule (~20 tokens per parameter) and "emergent abilities" (described as reported, with the debate that some apparent emergence depends on how it is measured); prompt engineering: zero-shot, few-shot, role, chain-of-thought, structured output (JSON) and prompt injection.
- Figures: `sorter` with 3 bins (encoder / decoder / encoder-decoder; cards: BERT, GPT-2, T5, RoBERTa? only if sure, …), `calc` `scaling`, `pipeline` (MoE routing for one token) , `flow` (zero-shot vs few-shot vs chain-of-thought on the same question; hand-written illustrative outputs flagged as illustrative), `temperature` optional.
- Hook: `bars`, `text`.
- Lab: the outline's **Prompt Lab** is a 90-minute lab on Llama-3.1-8B-Instruct (NVIDIA DGX Spark) graded out of 34 points plus a 4-point bonus (Setup 4; zero-shot, few-shot, role 8; chain-of-thought 6; JSON and validation 6; injection 5; temperature and top-p 5; evaluation 6; extension: templates and prompt card +4). Link to [Prompt Workshop](/prompt-workshop) for the guided practice and describe how to prepare. Add a short GA Lab 4 style activity comparing an encoder-only and a decoder-only model with `transformers` pipelines (`fill-mask` with `bert-base-uncased`, `text-generation` with `gpt2`; confirm cached). Do not invent Prompt Lab questions beyond the table above.

### Week 10 — Midterm Exam
Covers the Midterm term: Weeks 6–9 content (tokens and embeddings, attention, Transformers, LLM families, scaling, prompting). Exam-week format. Figures: `sorter` (concept → week family), `pipeline` (attention to Transformer block recap), `heatmap` (a small attention or mask calculation), `scatter`/`bpe` as retrieval practice. Quiz: 10–12 cumulative questions with 3–4 calculations (BPE merge, attention scores with scaling, number of parameters, positional-encoding value).

## Pre-final (Weeks 11–15): Images and generation

### Week 11 — Multimodal AI · GA Lab 5
Outcomes: what multimodal models are; how a Vision Transformer (ViT) turns images into tokens.
- Concept sections: multimodal models and three real applications (e.g. image captioning, visual question answering, text-to-image, speech/video); a ViT: patches → linear projection → position embeddings → Transformer → CLS token; contrastive vision-language training (CLIP): a shared embedding space, similarity between image and text, zero-shot classification.
- Figures: `patch` (8×8 or 16×16 digit image), `pipeline` (ViT stages with shapes for a 224×224 image and 16×16 patches: 196 patches), `scatter` (illustrative shared image/text space; nearest text label = zero-shot answer), `flow` (unimodal vs multimodal) or `sorter` (task → modality).
- Hook: `denoise`? no; use `tokens`-like chips for "patches" (kind `tokens`: "patch 1", …) or `bars` (zero-shot probabilities).
- Lab: patchify an image with `reshape`/`unfold`, count tokens; CLIP zero-shot with `openai/clip-vit-base-patch32` (confirm cached) on a few images the student takes or generates; compare label prompts ("a photo of a …"). Go further: **UvA Tutorial 15 (Vision Transformers)** and **Tutorial 17 (SimCLR)** for the contrastive idea behind CLIP.

### Week 12 — Image Generation & GANs · GA demo 6.1
Outcomes: generator vs discriminator; transpose convolution as learnable upsampling.
- Concept sections: generative models for images (autoencoders vs GANs, briefly); the GAN game (generator G maps noise z to samples; discriminator D tells real from fake; the minimax objective in words); training dynamics and failure modes (mode collapse, instability, balance of G and D); transpose convolution as learnable upsampling.
- Figures: `pipeline` (one GAN training iteration), `conv` with `"mode": "transpose"`, `flow` (GAN vs autoencoder, or generator vs discriminator input/output), `sorter` (which network does what / real or fake outputs), optional `curve`.
- Hook: `denoise` (noise → image) or `bars` (D's "real" probability).
- Lab: a toy GAN on a 1-D or 2-D Gaussian mixture (CPU is fine) with small MLP G and D, plot samples every N steps, observe mode collapse with a deliberately mismatched learning rate; compute transpose-conv output sizes by hand and verify with `nn.ConvTranspose2d`. Go further: **UvA Tutorial 9 (Autoencoders)**, noting that its decoder uses `ConvTranspose2d` and that a vanilla autoencoder is not a generative model.

### Week 13 — Diffusion Models · GA Lab 6 (Capstone opens)
Outcomes: forward (add noise) and reverse (denoise) processes; why a UNet with time embedding is the denoiser.
- Concept sections: the forward process x_t = √ᾱ_t · x₀ + √(1−ᾱ_t) · ε and the noise schedule; training = predict the noise (MSE) at a random step; sampling = start from noise and denoise step by step; the denoiser: a UNet (encoder-decoder with skip connections) conditioned on the time step through a time embedding; text conditioning and guidance (briefly); latent diffusion (Stable Diffusion works in a compressed latent space).
- Figures: `diffusion` (use a simple 12×12 shape), `pipeline` (training step; and/or the sampling loop), `curve` (could plot √ᾱ_t: not available as an `fn`; skip unless you reuse `decay`), `flow` (GAN vs diffusion) or `sorter`.
- Hook: `denoise`.
- Lab: implement the linear β schedule and ᾱ_t in NumPy and check ᾱ at t = 300 and 1000 against the figure (0.396 and about 4×10⁻⁵); noise an image of your own at several t; use `diffusers` `StableDiffusionPipeline` (`runwayml/stable-diffusion-v1-5`, confirm cached) to vary `num_inference_steps` (e.g. 5, 15, 30) and `guidance_scale` and compare. Add a short **Capstone opens** note (a section "Capstone opens this week" with a link to [Capstone](/capstone) and the Structural Inspection Assistant summary from the outline). No UvA notebook.

### Week 14 — Training LLMs: Fine-tuning, RLHF, PEFT · GA Lab 7
Outcomes: pre-training vs continued pre-training vs task-specific fine-tuning; instruction tuning and RLHF; why chat models need them.
- Concept sections: the training stages of a chat model (pre-training → optional continued pre-training → supervised fine-tuning / instruction tuning → preference training such as RLHF); RLHF in three steps (collect human preferences, train a reward model, optimise the policy with RL such as PPO while staying close to the original model); parameter-efficient fine-tuning (LoRA: freeze W, learn low-rank ΔW = BA); memory and cost.
- Figures: `pipeline` (stages of building a chat model), `calc` `lora`, `calc` `memory`, `sorter` (technique → stage: pre-training, continued pre-training, fine-tuning, instruction tuning, RLHF/preference), optionally `flow`.
- Hook: `bars` (preference scores) or `text`.
- Lab: LoRA with the `peft` library on a small causal LM such as `distilgpt2`/`gpt2` (target module `c_attn` for GPT-2; confirm the model is cached and `peft` is installed); print trainable vs total parameters; fine-tune a few steps on a tiny instruction dataset you write (10–20 examples) and compare before/after outputs; discuss overfitting with tiny data. Be careful with code: use `LoraConfig(task_type="CAUSAL_LM", r=8, lora_alpha=16, target_modules=["c_attn"], lora_dropout=0.05)` and `get_peft_model`.

### Week 15 — Pre-final Exam + Capstone proposal (Weeks 11–14 content)
Exam-week format plus a **Capstone proposal** section (rail "Capstone"): the Structural Inspection Assistant (pipeline: photo → classify crack/spalling/corrosion/none → find checklist items with RAG → draft summary for the engineer; tech: ViT/CLIP, RAG over checklists, NeMo Guardrails; AI-use rule: a licensed engineer makes every pass/fail decision, the assistant never signs off on safety; roles: Team lead, Technical lead, Responsible-AI lead; criteria and weights: problem and proposal 15%, technical implementation 40%, responsible AI 15%, presentation 20%, documentation 10%), a proposal checklist, and a `pipeline` figure of the system. Link to [Capstone](/capstone). Review sections for Weeks 11–14 with figures (`sorter`, `pipeline`, `patch`/`scatter`, `calc`). Quiz: 10–12 cumulative questions with calculations (patch count for a given image/patch size, LoRA parameter count, ᾱ reasoning, transpose-conv output size).

## Final (Weeks 16–20): Apps, agents and deployment

### Week 16 — LLM Components & RAG · GA Lab 8 Part 1
Outcomes: building blocks of an LLM application (template, tokenizer, model, parser, chain); why LLMs hallucinate and how RAG reduces it.
- Concept sections: the components of an LLM application and how a chain connects them; why a plain LLM hallucinates (it predicts plausible text, has a training cut-off, and no access to your documents); RAG: index (chunk, embed, store), retrieve (similarity search), augment the prompt, generate; limits of RAG (bad retrieval, chunking, outdated documents) and how to evaluate it.
- Figures: `pipeline` (a chain: template → tokenizer → model → parser, and/or the RAG flow with an example query), `retrieval` (4–6 short passages about one coherent fictional-but-plausible topic such as a school or a fictional bridge inspection checklist; `checks` required; one example where keyword search fails and `note` says so), `flow` (plain LLM vs RAG for one question; illustrative), `sorter` (hallucination cause vs mitigation, or "retrieve / augment / generate" stage).
- Hook: `text` (question → grounded answer) and `bars`.
- Lab: build a tiny RAG pipeline: chunk a few documents, embed with `sentence-transformers/all-MiniLM-L6-v2` (confirm cached) or TF-IDF from scikit-learn, retrieve top-k by cosine similarity, build the prompt, and call a cached instruct model with `transformers`; compare answers with and without retrieval on questions the documents can and cannot answer. Include the "say you do not know" instruction and test it. If you use sample inspection-checklist text, mark it clearly as fictional sample text, not real engineering guidance.

### Week 17 — AI Agents, Guardrails & Trustworthy AI · GA Lab 8 Part 2
Outcomes: an LLM agent = model + tools + a reasoning loop + memory; apply input, dialog and output rails with NeMo Guardrails.
- Concept sections: what an agent is (the loop: reason → act with a tool → observe → repeat; short-term memory), tools and their risks; guardrails (NVIDIA NeMo Guardrails: input rails check the user message, dialog rails steer the conversation, output rails check the model's reply; retrieval and execution rails also exist); trustworthy AI revisited (fairness, transparency, privacy, safety, accountability), human oversight, the capstone rule that a licensed engineer decides; adversarial robustness (FGSM and patches fool image classifiers: describe at concept level).
- Figures: `pipeline` (the agent loop with a concrete example), `pipeline` or `flow` (where input/dialog/output rails sit around the model), `sorter` (which rail catches this? bins input / dialog / output, e.g. a prompt-injection attempt, an off-topic request, a reply leaking an email address), `timeline`? no.
- Hook: `text` (a short agent trace) and `bars`.
- Lab: build a minimal agent loop in pure Python with a **stub** model function (rule-based) and two tools (calculator, lookup table) so it runs offline; add simple input, dialog and output rail functions (regex/keyword checks); test with adversarial inputs and record failures; then describe how the same rails would be configured in NeMo Guardrails **without inventing configuration syntax you are not sure of** (say "see the NeMo Guardrails documentation and the instructor's lab notebook"). Go further: **UvA Tutorial 10 (Adversarial attacks)** for FGSM and adversarial patches.

### Week 18 — Scaling & Deploying AI · GA Lab 9
Outcomes: data, tensor and pipeline parallelism and when each is used; mixed precision and quantization and their effect on speed and memory.
- Concept sections: why one GPU is not enough (memory and time); data parallelism (copy the model, split the batch, average gradients), tensor/model parallelism (split a layer's matrices across GPUs), pipeline parallelism (split layers into stages, micro-batches to keep GPUs busy); precision: FP32, FP16/BF16, INT8/INT4, mixed-precision training and quantization for inference; serving (latency vs throughput, batching, the KV cache).
- Figures: `calc` `memory`, `calc` `scaling`, `pipeline` ×2 (one per parallelism idea, or one stepping through all three), `sorter` (situation → parallelism type, or technique → what it saves: memory/time/both), optional `flow` (FP32 vs INT8).
- Hook: `bars` (memory per precision) and `loss`.
- Lab: measure matrix-multiply time and `torch.cuda.max_memory_allocated()` in FP32 vs FP16/BF16 (`torch.autocast`); quantise a small `nn.Linear` model with `torch.ao.quantization.quantize_dynamic` on CPU and compare size and speed; estimate memory for a 7B-parameter model at each precision by hand and check against the figure. No UvA notebook.

### Week 19 — Capstone Build Week + Mock NCA-GENL Exam
Outcomes (outline): apply course skills to build a working application for a real problem; complete a 50-question, 60-minute mock certification exam (70% = exam-ready).
- Exam-week-like format. Sections: a build plan for the Structural Inspection Assistant (milestones across the week, integration checklist: vision classifier, RAG over checklists, guardrails, human-in-the-loop sign-off; testing and failure logging; the Responsible-AI lead's checklist; documentation) with a `pipeline` figure and the criteria table from the outline; the mock exam: format (50 multiple-choice questions, 60 minutes, closed book, pass at 35/50 = 70%), time management (about 70 seconds per question: compute 60 × 60 / 50 = 72), how to review, link to [Mock Exam Prep](/mock-exam); about NCA-GENL (issued by NVIDIA after its own proctored exam; Supervaise cannot issue or guarantee it; instructors send discount codes privately once a student reaches the readiness mark; NCP-GENL is the optional advanced level). Do not invent the NCA-GENL blueprint or domain weights.
- Figures: `pipeline` (capstone build), `sorter` (course area → week family), `calc`/`curve` optional, `scatter`? no. Quiz: 12 mixed questions across the course (a mini mock), covering each term.

### Week 20 — Final Exam & Demo Day
Cumulative final exam for the whole course plus capstone demos. Exam-week format with review sections by term (Prelim, Midterm, Pre-final, Final), a `timeline` or `sorter` that maps ideas to weeks, a Demo Day section (a 5-part demo structure you propose: problem, live demo, how it works, responsible-AI choices, what you would do next; use the capstone criteria weights from the outline; link to [Capstone](/capstone)), and a closing "what next" section covering NCA-GENL and optional NCP-GENL facts from the outline. Quiz: 12 cumulative questions, one or two from each term, several with calculations.
