> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 15 — Pre-final Exam + Capstone proposal

**Purpose:** Get ready for the Pre-final exam by ==reviewing Weeks 11–14 with worked calculations==, and turn the Capstone idea into a proposal your team can defend.

**Term:** Pre-final (Weeks 11–15) · **Month:** 4 · **Time:** about 30 minutes for the review, then your study plan and the Capstone proposal session

```viz
{
  "type": "hook",
  "title": "Four weeks in 20 seconds",
  "caption": "Each tab replays one idea from Weeks 11 to 14: an image cut into patches, a zero-shot guess, noise turning into a picture, and a loss curve going down during fine-tuning. The numbers are illustrative, made up for the animation, not taken from a trained model.",
  "scenes": [
    { "name": "Week 11: patches", "kind": "tokens", "outputLabel": "Image tokens", "prompt": "A 224×224 photo cut into 16×16 patches", "tokens": ["patch 1", "patch 2", "patch 3", "…", "patch 196"] },
    { "name": "Week 11: zero-shot", "kind": "bars", "outputLabel": "Similarity to each label (illustrative)", "prompt": "Photo of a dog, three text labels", "bars": [ { "label": "a photo of a dog", "value": 0.82 }, { "label": "a photo of a cat", "value": 0.13 }, { "label": "a photo of a car", "value": 0.05 } ] },
    { "name": "Week 13: denoise", "kind": "denoise", "outputLabel": "Reverse diffusion", "prompt": "Start from pure noise, remove a little at every step", "image": ["000009900000", "000990099000", "009000000900", "090000000090", "090090090090", "900000000009", "900000000009", "090000000090", "090900009090", "009099990900", "000990099000", "000009900000"] },
    { "name": "Week 14: fine-tune", "kind": "loss", "outputLabel": "Training loss", "prompt": "Supervised fine-tuning on instruction examples" }
  ]
}
```

## By the end, you can…

1. ==Compute the number of patch tokens== a ViT makes from an image, and explain how CLIP does zero-shot classification (Week 11).
2. ==Explain generator versus discriminator== and compute the output size of a transpose convolution (Week 12).
3. ==Use ᾱ to describe the forward noising step==, and say why the denoiser is a UNet with a time embedding (Week 13).
4. ==Place each technique on the training pipeline== (pre-training, continued pre-training, fine-tuning, RLHF) and compute LoRA parameter counts (Week 14).
5. ==Draft a Capstone proposal== for the Structural Inspection Assistant that fits the marking criteria.

Assessed in the Pre-final exam, which is cumulative for the term, and in the Capstone proposal session. There is no new concept this week. Read each review section, try the figure under it, then work through the study plan. Terms with a dotted underline open a short definition when you select them. Your instructor announces the date, room and format of the exam.

## Week 11 review: images become tokens {rail=Week 11}

{lede} A [[multimodal model|A model that handles more than one kind of data, such as text and images, in the same system.]] needs a way to turn each kind of data into the same thing: ==a sequence of vectors the Transformer can read==. A [[Vision Transformer (ViT)|A Transformer that reads an image as a sequence of patches. Each patch is flattened, projected to a vector and treated like a word token.]] does this by cutting the image into patches.

### Counting patch tokens

Example first. A 224×224 image cut into 16×16 patches gives 224 ÷ 16 = 14 patches along each side, so 14 × 14 = ==196 patch tokens==. Each patch holds 16 × 16 × 3 = 768 numbers (3 colour channels), which a linear layer projects to the model dimension. A learned CLS token is added in front, so the Transformer reads 197 tokens. Position embeddings tell it where each patch came from.

Try the figure with the small 8×8 picture. The patch size controls how many tokens you get: smaller patches mean more tokens and more computation.

```viz
{
  "type": "patch",
  "title": "Patch size decides the token count",
  "intro": "Switch the patch size and count the tokens. Then repeat the calculation for a 224×224 image.",
  "image": [ [0, 9, 4, 0, 0, 0, 0, 0], [0, 0, 9, 4, 0, 0, 0, 0], [0, 0, 9, 4, 0, 0, 0, 0], [0, 0, 0, 9, 4, 0, 0, 0], [0, 0, 0, 0, 9, 4, 0, 0], [0, 0, 0, 0, 9, 4, 0, 0], [0, 0, 0, 0, 0, 9, 4, 0], [0, 0, 0, 0, 0, 0, 9, 4]],
  "channels": 1,
  "patchSizes": [2, 4, 8],
  "note": "A tiny illustrative 8×8 picture (a thin diagonal line, like a crack on a wall). Real ViTs use colour images such as 224×224."
}
```

Notice: with patch size 2 the 8×8 image gives 16 tokens, with 4 it gives 4, with 8 it gives 1. The rule is always (side ÷ patch)². Tokens grow quickly as patches shrink, which is why ViTs on large images are expensive.

### CLIP and zero-shot classification

[[CLIP|A model trained on image–caption pairs so that an image and its caption land close together in one shared embedding space.]] trains an image encoder and a text encoder together so that a photo and its caption get similar vectors. For ==zero-shot classification== you write one text prompt per class ("a photo of a dog"), embed the photo, and pick the label whose text vector is most similar. No extra training on those classes is needed.

```viz
{
  "type": "scatter",
  "title": "A shared image–text space",
  "metric": "cosine",
  "points": [
    { "label": "photo: cat", "x": 3.0, "y": 1.2, "group": "image" },
    { "label": "photo: dog", "x": 2.0, "y": 3.2, "group": "image" },
    { "label": "photo: car", "x": -1.0, "y": 3.0, "group": "image" },
    { "label": "text: a cat", "x": 4.0, "y": 1.6, "group": "text" },
    { "label": "text: a dog", "x": 2.4, "y": 4.0, "group": "text" },
    { "label": "text: a car", "x": -1.4, "y": 4.0, "group": "text" }
  ],
  "note": "Illustrative 2-D coordinates authored for teaching. Real CLIP embeddings have hundreds of dimensions."
}
```

Select "photo: dog" and look at its nearest neighbours: the text "a dog" is closest by cosine similarity. That nearest text label is the zero-shot answer. This is the idea you will reuse in the Capstone to classify inspection photos.

## Week 12 review: GANs and transpose convolution {rail=Week 12}

{lede} A [[GAN|A Generative Adversarial Network: two networks trained against each other, a generator that makes fake samples and a discriminator that tries to tell fakes from real data.]] is a game between two networks. The ==generator turns random noise into a sample; the discriminator says real or fake==. Training pushes the generator to fool the discriminator and the discriminator to catch it. Failure modes to remember: [[mode collapse|When the generator keeps producing only a few kinds of output, ignoring the variety in the real data.]] and unstable training when one network gets far ahead of the other.

```viz
{
  "type": "sorter",
  "title": "Generator or discriminator?",
  "intro": "Decide which network each description belongs to.",
  "bins": [ { "id": "generator", "label": "Generator" }, { "id": "discriminator", "label": "Discriminator" } ],
  "cards": [
    { "name": "Takes a random noise vector z as input", "answer": "generator", "why": "The generator starts from noise and shapes it into a sample." },
    { "name": "Outputs the probability that an input is real", "answer": "discriminator", "why": "That is the discriminator's job: a real-or-fake score." },
    { "name": "Uses transpose convolutions to upsample", "answer": "generator", "why": "The generator has to grow a small noise vector into a full image, so it upsamples." },
    { "name": "Sees both real images and fakes during training", "answer": "discriminator", "why": "It needs real examples and fakes to learn the difference. The generator never sees real images directly." },
    { "name": "Produces the image you use after training", "answer": "generator", "why": "After training you usually keep the generator and discard the discriminator." },
    { "name": "Is trained to classify its input", "answer": "discriminator", "why": "It is a classifier: real or fake." },
    { "name": "Its loss rises when its fakes are spotted", "answer": "generator", "why": "The generator is rewarded when the discriminator is fooled and penalised when its fakes are caught." },
    { "name": "Is trained with backpropagation", "answer": "either", "why": "Both are ordinary neural networks updated by gradient descent, taking turns." }
  ]
}
```

### Transpose convolution by hand

A [[transpose convolution|A layer that upsamples: each input value is multiplied by the kernel and the results are placed on a larger output grid, overlapping where they meet. The kernel values are learned.]] is learnable upsampling. Without padding, the output side is (n − 1) × stride + k, where n is the input side and k the kernel side. A 2×2 input with a 3×3 kernel and stride 2 gives (2 − 1) × 2 + 3 = 5, so a 5×5 output.

```viz
{
  "type": "conv",
  "title": "Transpose convolution: 2×2 to 5×5",
  "mode": "transpose",
  "stride": 2,
  "padding": 0,
  "input": [ [1, 2], [3, 4] ],
  "kernel": [ [1, 0, 1], [0, 1, 0], [1, 0, 1] ]
}
```

Notice: each input number stamps a scaled copy of the kernel on the output, and copies overlap where stride 2 is smaller than the kernel size 3. The kernel is a learned set of weights, which is why this upsampling is "learnable".

## Week 13 review: diffusion {rail=Week 13}

{lede} A [[diffusion model|A generative model trained to remove noise. It learns to undo a process that gradually adds noise to images, then makes new images by starting from pure noise and denoising step by step.]] has two directions. The ==forward process adds noise== until the image is gone; the ==reverse process removes it== step by step to create a new image. The forward step has a closed form: x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε, where x₀ is the clean image, ε is random noise and ᾱ_t is a number between 0 and 1 that shrinks as t grows.

Example with the usual linear schedule over 1000 steps: ᾱ at t = 300 is about 0.396, so the signal is multiplied by √0.396 ≈ 0.63 and the noise by √0.604 ≈ 0.78. At t = 1000, ᾱ is about 4 × 10⁻⁵, so almost nothing of x₀ is left.

```viz
{
  "type": "diffusion",
  "title": "Forward noising and idealised reverse",
  "image": ["000009900000", "000990099000", "009000000900", "090000000090", "090090090090", "900000000009", "900000000009", "090000000090", "090900009090", "009099990900", "000990099000", "000009900000"],
  "t": 300,
  "note": "A 12×12 illustrative picture. The reverse direction is idealised; a real model must predict the noise at every step."
}
```

Move t from 0 to the maximum and notice how the picture dissolves; at t = 300 you can still see the shape. During training the network sees a noisy image and ==learns to predict the noise that was added== (an MSE loss). The denoiser is a [[UNet|A network with a shrinking encoder path, a growing decoder path and skip connections between matching sizes, so fine detail survives. It is the usual denoiser in diffusion models.]] with a time embedding, because the same network must denoise at every noise level: the time embedding tells it how noisy the input is. Stable Diffusion works in a compressed latent space, which makes sampling cheaper than working on full pixels.

## Week 14 review: training LLMs {rail=Week 14}

{lede} A chat model is built in stages: ==pre-training on huge amounts of raw text, then fine-tuning on examples of good answers, then preference training== such as RLHF. Each stage changes what the model is good at.

- **Pre-training:** predict the next token on a very large text collection. The model learns language and facts. **Continued pre-training** uses the same objective on extra domain text.
- **Fine-tuning and instruction tuning:** train on prompt–answer pairs so the model follows instructions.
- **[[RLHF|Reinforcement Learning from Human Feedback. Humans rank answers, a reward model learns those rankings, and the language model is then optimised to earn higher reward while staying close to its original behaviour.]]:** (1) collect human preferences between answers, (2) train a reward model on them, (3) optimise the model against the reward, for example with PPO, while keeping it close to the original model.

```viz
{
  "type": "sorter",
  "title": "Which training stage is this?",
  "intro": "Place each activity on the training pipeline.",
  "bins": [ { "id": "pretrain", "label": "Pre-training (incl. continued)" }, { "id": "sft", "label": "Fine-tuning / instruction tuning" }, { "id": "rlhf", "label": "Preference training (RLHF)" } ],
  "cards": [
    { "name": "Predict the next token over a huge web-scale text collection", "answer": "pretrain", "why": "That is the pre-training objective." },
    { "name": "Keep training on a company's own legal documents with the same next-token goal", "answer": "pretrain", "why": "Continued pre-training uses the same objective on extra domain text." },
    { "name": "Train on 10,000 prompt–answer pairs written by people", "answer": "sft", "why": "Supervised examples of good answers: instruction tuning." },
    { "name": "Teach the base model to follow commands like 'Summarise this'", "answer": "sft", "why": "Following instructions is what instruction tuning adds." },
    { "name": "Train a reward model from human rankings of two answers", "answer": "rlhf", "why": "This is step 2 of RLHF: learn a score from human rankings." },
    { "name": "Optimise with PPO while staying close to the original model", "answer": "rlhf", "why": "Step 3 of RLHF: raise the reward without drifting too far." },
    { "name": "Learn grammar and general facts from raw text", "answer": "pretrain", "why": "General knowledge comes from pre-training." },
    { "name": "Train only small adapter matrices A and B on 15 examples", "answer": "sft", "why": "LoRA is a cheap way of doing fine-tuning. It is a method, and the stage is fine-tuning." }
  ]
}
```

### LoRA and memory

Full fine-tuning updates every weight. [[LoRA|Low-Rank Adaptation. It freezes the original weight matrix W and trains a small update ΔW = B·A made of two thin matrices.]] freezes W and trains B and A. For a d × d matrix with rank r, LoRA trains 2 × d × r numbers instead of d × d. With d = 4096 and r = 8: 2 × 4096 × 8 = ==65,536 trainable numbers== versus 4096 × 4096 = 16,777,216, about 0.39%. Memory is the other limit: weights take (parameters × bytes per number). A 7-billion-parameter model needs about 14 GB in 16-bit weights and about 3.5 GB in 4-bit.

```viz
{
  "type": "calc",
  "title": "LoRA versus full fine-tuning",
  "kind": "lora"
}
```

Set d to 4096 and r to 8 and check that you get 65.5 K versus 16.78 M. Notice that the saving is a fraction of 2r ÷ d, so it improves as the matrix gets larger.

## Key takeaways {rail=Takeaway}

- A ViT turns an image into ==(side ÷ patch)² tokens==, and CLIP classifies by ==picking the text label closest to the image in a shared space==.
- A GAN is a ==generator versus discriminator game==; a transpose convolution upsamples with output side (n − 1) × stride + k.
- Diffusion adds noise with x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε and trains a ==UNet with a time embedding to predict the noise==.
- A chat model goes through ==pre-training, fine-tuning and preference training==; LoRA cuts trainable parameters to 2 × d × r per matrix.

## Study plan {rail=Study plan}

Work through this list in order. It is a suggestion, not a rule, and the time per item is a guide for about two to three hours in total.

- [ ] **Redo the four calculations** from the review (patch count, transpose-conv size, ᾱ coefficients, LoRA count) without looking, then check. (30 min)
- [ ] **Re-sort the cards** in the two sorter figures until you can explain each answer. (15 min)
- [ ] **Re-read your lab notebooks** for Weeks 11 to 14 and note one thing that surprised you in each. (45 min)
- [ ] **Take the quiz below** and read the explanation for every question you missed. (20 min)
- [ ] **Practise on [Mock Exam Prep](/mock-exam)**: timed modules, unlimited attempts, 70% pass mark. Redo any module under 70%. (45 min)
- [ ] **Skim earlier weeks** with the course map ([Course map](/course-map)). The exam is cumulative for the term, so Weeks 1 to 10 are fair game as well.

Your instructor announces the date, room and format of the Pre-final exam. Bring your questions to the session.

## Capstone proposal: the Structural Inspection Assistant {rail=Capstone}

{lede} The Capstone is a team project: a ==Structural Inspection Assistant that triages inspection photos and drafts a summary for an engineer to review==. This week your team writes its proposal. Full details are on the [Capstone](/capstone) page.

The pipeline is: photo in, classify (crack, spalling, corrosion or none), find checklist items with RAG, then draft a summary for the engineer. You will use a Vision model (ViT or CLIP, from Week 11), retrieval over checklists (Week 16) and NeMo Guardrails (Week 17). The ==AI-use rule is fixed: a licensed engineer makes every pass/fail decision; the assistant never signs off on safety.==

```viz
{
  "type": "pipeline",
  "title": "The Structural Inspection Assistant",
  "intro": "Step through one photo.",
  "nodes": [
    { "id": "photo", "label": "Photo", "sub": "inspection image" },
    { "id": "classify", "label": "Classify", "sub": "crack / spalling / corrosion / none" },
    { "id": "retrieve", "label": "Find checklist items", "sub": "RAG" },
    { "id": "draft", "label": "Draft summary", "sub": "LLM + guardrails" },
    { "id": "engineer", "label": "Engineer decides", "sub": "human review" }
  ],
  "steps": [
    { "title": "A photo comes in", "body": "A team member uploads an inspection photo. The system never decides anything at this point; it only receives the image.", "active": ["photo"], "example": "photo_017.jpg" },
    { "title": "Classify the damage", "body": "A vision model (a ViT or CLIP zero-shot) labels the photo as crack, spalling, corrosion or none, with a confidence score.", "active": ["classify"], "example": "Label: crack (confidence 0.81, illustrative)" },
    { "title": "Find checklist items", "body": "The label and a short description become a search query over the team's checklist passages. The best matches are retrieved.", "active": ["retrieve"], "example": "FICTIONAL SAMPLE TEXT: 'Item C-3: record where the crack is and how far it runs.'" },
    { "title": "Draft a summary", "body": "A language model writes a short summary from the label and the retrieved items. Guardrails check the reply, for example blocking any wording that says the structure is safe.", "active": ["draft"], "example": "Draft for review: crack observed; see checklist item C-3." },
    { "title": "The engineer decides", "body": "A licensed engineer reads the draft and makes the pass or fail decision. The assistant never signs off on safety.", "active": ["engineer"], "example": "Decision recorded by the engineer, not by the model." }
  ],
  "note": "Illustrative flow. The example checklist text is fictional sample text, not real engineering guidance."
}
```

Notice that the engineer is the last node: every other box helps them, none replaces them.

### How the Capstone is marked

| Criterion | Weight |
|---|---|
| Problem and proposal | 15% |
| Technical implementation | 40% |
| Responsible AI | 15% |
| Presentation | 20% |
| Documentation | 10% |

The Capstone is 20% of the final grade according to the demo schedule. Roles in each team: ==Team lead, Technical lead and Responsible-AI lead==.

### Proposal checklist

Your instructor announces the proposal format, length and deadline. A strong proposal answers these questions:

- [ ] **Problem:** who has the problem, and what slows them down today?
- [ ] **Users and the human in the loop:** who is the engineer, and what exactly do they review?
- [ ] **Pipeline:** which model does each step, and what goes in and out of it?
- [ ] **Data plan:** where will your test photos and checklist text come from, and are they allowed to be used? Mark any sample text as fictional.
- [ ] **Evaluation:** how will you know the classifier and the retrieval work (for example accuracy on photos you labelled, and checking that the right checklist item is found)?
- [ ] **Responsible AI:** what can go wrong (a wrong label, an overconfident summary), and which guardrail or human check prevents each?
- [ ] **Roles and plan:** who is Team lead, Technical lead and Responsible-AI lead, and what is done by Week 19?

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Twelve cumulative questions on Weeks 11 to 14, with an explanation after each one, including calculations.

```quiz
{
  "id": "week-15-check",
  "title": "Week 15 quiz: Weeks 11–14 review",
  "passMark": 70,
  "questions": [
    {
      "q": "A ViT reads a 224×224 image with 16×16 patches. How many patch tokens does it create (not counting the CLS token)?",
      "options": ["14", "196", "256", "768"],
      "answer": 1,
      "why": "224 ÷ 16 = 14 patches per side, and 14 × 14 = 196. The number 14 is only one side, and 768 is the number of values in a single 16×16×3 patch."
    },
    {
      "q": "Each 16×16 patch of a colour (3-channel) image is flattened before the linear projection. How many numbers is that?",
      "options": ["256", "48", "512", "768"],
      "answer": 3,
      "why": "16 × 16 × 3 = 768. The value 256 forgets the colour channels."
    },
    {
      "q": "How does CLIP do zero-shot classification of a photo?",
      "options": [
        "It embeds the photo and one text prompt per class, then picks the class whose text is most similar.",
        "It retrains the image encoder on labelled photos of each class.",
        "It asks a language model to describe the photo and reads the first word.",
        "It counts how many patches look like each class."
      ],
      "answer": 0,
      "why": "CLIP puts images and text in one shared space, so the nearest text label is the answer, with no extra training. Retraining on labelled photos would be fine-tuning, not zero-shot."
    },
    {
      "q": "A transpose convolution has a 4×4 input, a 3×3 kernel, stride 2 and no padding. What is the output size?",
      "options": ["6×6", "8×8", "9×9", "10×10"],
      "answer": 2,
      "why": "(n − 1) × stride + k = (4 − 1) × 2 + 3 = 9, so 9×9. The value 10×10 would come from using a 4×4 kernel."
    },
    {
      "q": "A GAN's generator keeps producing only one or two kinds of image, although the real data has many. What is this called?",
      "options": ["Overfitting", "Mode collapse", "Vanishing gradients", "Underfitting"],
      "answer": 1,
      "why": "Mode collapse means the generator covers only a few modes of the real data. It often happens when the discriminator is easy to fool with a narrow set of outputs."
    },
    {
      "q": "In the forward diffusion step x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε, suppose ᾱ_t = 0.25. How much of the clean image x₀ is kept (the multiplier on x₀)?",
      "options": ["0.5", "0.25", "0.75", "0.87"],
      "answer": 0,
      "why": "The multiplier is √0.25 = 0.5. The noise multiplier is √0.75 ≈ 0.87. The value 0.25 is ᾱ itself, not its square root."
    },
    {
      "q": "Why does a diffusion UNet receive a time embedding?",
      "options": [
        "To make the image sharper at the end.",
        "To add the colour channels back to the image.",
        "To make the UNet smaller.",
        "To tell one network how noisy the input is, so it can denoise at every step."
      ],
      "answer": 3,
      "why": "The same network is used at all noise levels, and the time embedding tells it the current step. It does not change image size or colour."
    },
    {
      "q": "What does a diffusion model learn to predict during training?",
      "options": [
        "The class of the image.",
        "Whether the image is real or fake.",
        "The noise that was added to the image.",
        "The next word in a caption."
      ],
      "answer": 2,
      "why": "The common training goal is to predict the noise added at a random step, using an MSE loss. Real-or-fake is the discriminator's job in a GAN."
    },
    {
      "q": "LoRA is applied to a 4096 × 4096 weight matrix with rank r = 8. How many trainable numbers does it add for that matrix?",
      "options": ["32,768", "65,536", "262,144", "16,777,216"],
      "answer": 1,
      "why": "LoRA trains two matrices, A (r × d) and B (d × r), so 2 × 4096 × 8 = 65,536. The value 16,777,216 is the full 4096 × 4096 matrix."
    },
    {
      "q": "What is the purpose of the reward model in RLHF?",
      "options": [
        "To score answers the way humans ranked them, so the language model can be optimised toward higher scores.",
        "To translate prompts into other languages.",
        "To store the training data for pre-training.",
        "To compress the model into 4-bit numbers."
      ],
      "answer": 0,
      "why": "The reward model is trained on human preference rankings and then gives a score that the language model is optimised to raise. It does not store data or compress weights."
    },
    {
      "q": "How much memory do the weights of a 7-billion-parameter model need in 16-bit (2-byte) format?",
      "options": ["7 GB", "3.5 GB", "14 GB", "28 GB"],
      "answer": 2,
      "why": "7 × 10⁹ numbers × 2 bytes = 14 × 10⁹ bytes, about 14 GB. In 32-bit it would be 28 GB and in 4-bit about 3.5 GB."
    },
    {
      "q": "In the Capstone Structural Inspection Assistant, who makes the pass or fail decision?",
      "options": [
        "The vision classifier, if its confidence is high enough.",
        "The language model that drafts the summary.",
        "The Team lead.",
        "A licensed engineer; the assistant never signs off on safety."
      ],
      "answer": 3,
      "why": "The AI-use rule is that a licensed engineer decides. The assistant only triages photos and drafts a summary for review."
    }
  ]
}
```

## How Week 15 is assessed

The Pre-final exam is cumulative for the term. Your instructor announces the date, room, format and weights, and the Capstone proposal requirements. The Capstone marking criteria are in the table above. Laboratories and knowledge checks run through the term. The long-term goal is the NVIDIA-Certified Associate exam (NCA-GENL), which NVIDIA issues after its own proctored exam; Supervaise cannot issue or guarantee it.

## Exit ticket and homework

Answer these three questions in one or two sentences each:
1. Which of the four calculations (patches, transpose conv, ᾱ, LoRA) do you still find hardest, and why?
2. Name one way the Structural Inspection Assistant could go wrong and one check that would catch it.
3. Who is your Team lead, Technical lead and Responsible-AI lead?

**Homework / self-study**
- Finish the study plan and redo any [Mock Exam Prep](/mock-exam) module under 70%.
- Agree your team's proposal and roles.
- Preview Week 16: LLM components and RAG, which you will use in the Capstone to find checklist items.
