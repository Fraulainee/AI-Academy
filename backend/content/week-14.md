> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 14 — Training LLMs: Fine-tuning, RLHF, PEFT

**Purpose:** Learn the stages that turn a text predictor into a helpful chat model, and how ==LoRA lets you fine-tune a large model by training only a tiny add-on==.

**Term:** Pre-final (Weeks 11–15) · **Month:** 4 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a text predictor learn to help",
  "caption": "A model trained only to predict the next word does not answer questions; it just continues text. Training stages change that. The texts and scores here are made up for the animation, not from a real model.",
  "scenes": [
    { "name": "Base model", "kind": "text", "outputLabel": "What a base model may write (illustrative)", "prompt": "Q: How do I boil an egg?", "output": "Q: How do I peel an egg? Q: How long should I boil it? Q: Why do eggs crack in the pot?" },
    { "name": "Instruction-tuned", "kind": "text", "outputLabel": "After instruction tuning (illustrative)", "prompt": "Q: How do I boil an egg?", "output": "Place the egg in gently boiling water for about 10 minutes, then cool it in cold water." },
    { "name": "Human preference", "kind": "bars", "prompt": "A reward model scores three answers", "outputLabel": "Reward score, scaled 0 to 1 (illustrative)", "bars": [ { "label": "Clear and polite", "value": 0.9 }, { "label": "Rude", "value": 0.2 }, { "label": "Confident but wrong", "value": 0.35 } ] }
  ]
}
```

## By the end, you can…

1. ==Tell pre-training, continued pre-training and fine-tuning apart== by their data and goal.
2. Explain ==instruction tuning== and the three steps of ==RLHF==, and why chat models need them.
3. Explain ==how LoRA works== and compute the number of parameters it trains.
4. Estimate the ==memory== needed for the weights of a model in FP32, FP16, INT8 and INT4.
5. Fine-tune GPT-2 with LoRA in the lab and describe what happens when the training data are tiny.

Assessed in the Week 14 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## The stages of building a chat model {rail=Stages}

{lede} A chat model is not built in one go. It goes through ==a sequence of training stages, and each stage changes what the model is good at==. The first stage gives it knowledge of language. Later stages teach it to follow instructions and to be helpful.

### Stage 1: pre-training

Picture a model that has read a huge pile of text and learned one game: guess the next token. That is [[pre-training|The first, very expensive stage: training a model from random weights on a huge amount of general text to predict the next token. It gives the model its broad knowledge of language and the world.]]. The result is a *base model*. It is fluent but not obedient: ask it a question and it may continue with more questions, because that is what text on the web often does.

### Stage 2 (optional): continued pre-training

Suppose a hospital wants a model that knows medical language. [[Continued pre-training|Training an already pre-trained model further on a new body of text, usually from one domain such as law or medicine, with the same next-token goal.]] keeps the same next-token goal, but feeds the model domain text. It adds knowledge. It does not teach the model to follow instructions.

### Stage 3: fine-tuning and instruction tuning

[[Fine-tuning|Training a pre-trained model further on a smaller, labelled dataset so that it does one task or behaves in one way.]] uses examples that show the behaviour you want. One important kind is [[instruction tuning|Fine-tuning on many examples of an instruction paired with a good answer, so the model learns to follow instructions instead of just continuing text.]]: thousands of (instruction, ideal answer) pairs. After it, the model answers "How do I boil an egg?" instead of listing more questions.

### Stage 4: learning from preferences (RLHF)

Instruction tuning teaches the model to answer, but not which answer people prefer. [[RLHF|Reinforcement learning from human feedback: people compare model answers, a reward model learns their preferences, and the language model is then trained to produce answers the reward model scores highly.]] (Ouyang et al., 2022, the InstructGPT paper) fills that gap.

```viz
{
  "type": "pipeline",
  "title": "From raw text to a chat model",
  "intro": "Step through the stages. Stage 2 is optional.",
  "vertical": false,
  "nodes": [
    { "id": "pre", "label": "Pre-training", "sub": "huge general text" },
    { "id": "cont", "label": "Continued pre-training", "sub": "domain text (optional)" },
    { "id": "sft", "label": "Instruction tuning", "sub": "instruction → answer pairs" },
    { "id": "rlhf", "label": "RLHF", "sub": "human preferences" },
    { "id": "chat", "label": "Chat model", "sub": "helpful, follows instructions" }
  ],
  "steps": [
    { "title": "Pre-training", "body": "Train from random weights to predict the next token on a very large collection of text. This stage costs the most compute and gives the model its general knowledge of language.", "active": ["pre"], "example": "Output: a base model that continues text." },
    { "title": "Continued pre-training (optional)", "body": "Keep the same next-token goal but use text from one field, such as legal or medical documents. The model absorbs the vocabulary and facts of that domain.", "active": ["pre", "cont"], "example": "Output: a base model with domain knowledge." },
    { "title": "Instruction tuning", "body": "Train on pairs of an instruction and a good answer. The model learns the format of a conversation and to answer the question it was asked.", "active": ["cont", "sft"], "example": "Instruction: Summarise this email. Answer: a two-line summary." },
    { "title": "RLHF", "body": "People compare answers, a reward model learns to score them, and the model is trained to earn a high score without drifting far from its starting behaviour.", "active": ["sft", "rlhf"], "example": "Prefer the answer that is clear, polite and correct." },
    { "title": "Ready to chat", "body": "The result follows instructions and tends to be more helpful and safer than the base model. It still makes mistakes, so people check what it says.", "active": ["rlhf", "chat"], "example": "A chat assistant." }
  ]
}
```

Notice that each stage starts from the output of the stage before it. ==Only the first stage needs huge amounts of data and compute==; the later ones use far less.

### Which stage?

Sort each description into the stage it belongs to. One card is a method that fits more than one stage.

```viz
{
  "type": "sorter",
  "title": "Which training stage is this?",
  "intro": "Drag each description into a stage.",
  "bins": [
    { "id": "pretrain", "label": "Pre-training" },
    { "id": "continued", "label": "Continued pre-training" },
    { "id": "finetune", "label": "Fine-tuning / instruction tuning" },
    { "id": "rlhf", "label": "RLHF" }
  ],
  "cards": [
    { "name": "Start from random weights and predict the next token on a huge web-text collection", "answer": "pretrain", "why": "Training from scratch on general text is pre-training." },
    { "name": "Keep training a general model on a company's legal documents with the next-token goal", "answer": "continued", "why": "Same objective, new domain text, starting from a pre-trained model." },
    { "name": "Train on thousands of (instruction, ideal answer) pairs", "answer": "finetune", "why": "Labelled examples of the behaviour you want is instruction tuning, a kind of fine-tuning." },
    { "name": "Train a reward model from people ranking pairs of answers", "answer": "rlhf", "why": "Human comparisons turned into a reward model are step 2 of RLHF." },
    { "name": "Update the model with reinforcement learning while a penalty keeps it close to the starting model", "answer": "rlhf", "why": "This is step 3 of RLHF; the penalty stops the model from drifting into odd text that merely scores well." },
    { "name": "Teach a general model to label customer reviews as positive or negative using labelled reviews", "answer": "finetune", "why": "Labelled examples for one task is task-specific fine-tuning." },
    { "name": "Continue training on medical papers so the model learns medical vocabulary", "answer": "continued", "why": "Adds domain knowledge with the same next-token goal." },
    { "name": "LoRA adapters", "answer": "either", "why": "LoRA is a way of doing the training cheaply, not a stage. You can use it for continued pre-training, instruction tuning or preference training." }
  ]
}
```

## RLHF in three steps {rail=RLHF}

{lede} RLHF turns "people like this answer more than that one" into ==a training signal the model can follow==. It has three steps.

1. **Collect human preferences.** Show people a prompt and two or more model answers, and ask which is better. Collect many such comparisons.
2. **Train a reward model.** A [[reward model|A network trained on human comparisons to give a score to any answer, higher for answers people would prefer. It stands in for the human judge during training.]] learns to give higher scores to the answers people preferred. It is a stand-in for a human judge who never gets tired.
3. **Optimise the model.** Let the language model write answers, score them with the reward model, and update the language model with reinforcement learning (PPO is a common choice) to raise the score. A penalty keeps the new model close to the original, so it does not learn to produce strange text that tricks the reward model.

The third step has a real risk: the model may find ways to score highly that people do not actually like, which is often called reward hacking. That is why the penalty exists and why humans keep evaluating the final model.

## LoRA: fine-tune by training a small add-on {rail=LoRA}

{lede} Updating all the weights of a large model is slow and needs a lot of memory. [[Parameter-efficient fine-tuning (PEFT)|A family of methods that adapt a large model by training only a small number of extra or selected parameters while the original weights stay frozen.]] avoids that. The best-known method is [[LoRA|Low-Rank Adaptation (Hu et al., 2021): keep a weight matrix W frozen and learn a small change to it written as the product of two thin matrices B and A.]]: ==freeze the original weights and train a small low-rank add-on==.

### The idea with numbers

A weight matrix W in a layer might be 4096 × 4096, which is 4096 × 4096 = 16,777,216 numbers. Full fine-tuning would change all of them. LoRA keeps W frozen and learns the change as ΔW = B · A, where A has r rows and 4096 columns, B has 4096 rows and r columns, and r (the *rank*) is small, such as 8. That is only 2 × 4096 × 8 = 65,536 trainable numbers, ==about 0.39% of the matrix==. The layer's output becomes W·x + (α/r)·B·A·x, where α (`lora_alpha`) is a scaling number. B starts as zeros, so before training the model behaves exactly as the original.

Move the rank slider and watch the trainable share change. Per matrix it is 2r/d, so a larger rank costs more and can express more.

```viz
{
  "type": "calc",
  "title": "LoRA: full matrix versus adapter",
  "kind": "lora"
}
```

Notice that doubling the rank doubles the trainable numbers, while the frozen matrix stays the same. A small rank is often enough because the change needed for a new task tends to be simple.

### A real example: GPT-2

GPT-2 (small) has 12 layers. Its attention layer has one weight called `c_attn` that maps 768 numbers to 2304 (queries, keys and values together). With r = 8, one LoRA adapter on that weight has 8 × (768 + 2304) = 24,576 numbers. Over 12 layers that is 12 × 24,576 = 294,912 trainable numbers, against about 124.4 million in the whole model: roughly 0.24%. You will confirm this in the lab.

LoRA is also small to store. You save only the adapter and keep one copy of the big model for many tasks.

## Memory and cost {rail=Memory}

{lede} Before you train or even run a model, ask whether it fits. ==Weights take parameters × bytes per parameter==, and training needs several times more than that.

A 7-billion-parameter model has 7 × 10⁹ numbers. In FP32 each takes 4 bytes, so the weights are 28 GB; in FP16 or BF16, 2 bytes, 14 GB; in INT8, 1 byte, 7 GB; in INT4, half a byte, 3.5 GB. Training with the Adam optimiser needs far more, because it also stores gradients and optimiser values. A common mixed-precision estimate is about 16 bytes per parameter, so 7 billion parameters need about 112 GB before counting activations. That is why LoRA matters: only the small adapter needs gradients and optimiser values.

```viz
{
  "type": "calc",
  "title": "Memory for model weights",
  "kind": "memory"
}
```

Set the slider to 7 and read the rows, then to 70. Notice how quickly the training row grows. ==Full fine-tuning of a big model needs many GPUs; LoRA on a frozen model can need far less==, because the frozen weights still sit in memory but they carry no gradients or optimiser state.

### A warning about small datasets

Fine-tuning on a tiny dataset is quick, but a model can *memorise* the examples instead of learning the behaviour. That is [[overfitting|When a model fits its training examples very closely but performs worse on new examples, because it memorised details instead of the pattern.]]. A related risk is [[catastrophic forgetting|When fine-tuning on new data makes a model lose skills it had before.]]. In the lab you will measure the first one directly.

## Key takeaways {rail=Takeaway}

- A chat model is built in stages: ==pre-training, optional continued pre-training, instruction tuning, then preference training such as RLHF==. Only pre-training needs huge data and compute.
- ==Instruction tuning teaches the format of following instructions==; RLHF teaches which answers people prefer, using a reward model and reinforcement learning with a penalty that keeps the model near its start.
- ==LoRA freezes W and trains ΔW = B·A==, with 2 × d × r trainable numbers per square matrix. GPT-2 with r = 8 on `c_attn` trains 294,912 numbers.
- ==Memory for weights = parameters × bytes per parameter==; training with Adam needs about 16 bytes per parameter. Tiny datasets invite overfitting.

## Lab: LoRA fine-tuning of GPT-2 {rail=Laboratory}

Add a LoRA adapter to GPT-2, ==train only 0.24% of its parameters on a tiny instruction dataset you write, and compare the answers before and after==. Then see what happens when you train too long on too little data. Time: 3 hours. This is a self-contained lab; your instructor's lab notebook is the graded reference.

### Setup

1. Log in to the portal and start JupyterLab. Create a folder `week14` and a notebook `lora.ipynb`.
2. Do not install packages and do not use `!pip install`, Google Drive or Colab code. There is no internet. Confirm the `peft` library is installed by running `import peft; print(peft.__version__)` in the first cell. If it fails, tell your instructor.
3. The model loads from the offline Hugging Face cache (`HF_HOME` is set): `gpt2`. Confirm with your instructor that every model ID below is in the offline cache.
4. GPT-2 is small, so it runs on the CPU, but the code below uses the GPU if it is free. The GPU is shared by the whole class: free memory when you finish.

### Step-by-step tasks

1. *Parameter and memory arithmetic first (25 min).* Do this on paper before you run any model. (a) With d = 4096 and r = 8, how many LoRA numbers per matrix, and what percentage of the 4096 × 4096 matrix? (b) For GPT-2, compute 12 × 8 × (768 + 2304). (c) Memory of 124,439,808 weights in FP32 and FP16, and a 16-bytes-per-parameter Adam estimate. Check with code.
```python
d, r = 4096, 8
print("LoRA per matrix:", 2 * d * r, "fraction:", 2 * d * r / (d * d))
print("GPT-2 LoRA total:", 12 * r * (768 + 2304))
n = 124_439_808
print("FP32 MB:", n * 4 / 1e6, "FP16 MB:", n * 2 / 1e6, "Adam training GB:", n * 16 / 1e9)
```
   *Exercise 1:* write your paper answers and the printed ones. Then, for a 13-billion-parameter model, compute the FP16 weights in GB and the Adam training estimate in GB.
2. *Load the base model and write the data (25 min).* The task is simple on purpose: answer a capital-city question and always end with "Thanks for asking!". Eleven pairs are for training, two are held out.
```python
import torch, gc
from transformers import AutoTokenizer, AutoModelForCausalLM
device = "cuda" if torch.cuda.is_available() else "cpu"
tok = AutoTokenizer.from_pretrained("gpt2"); tok.pad_token = tok.eos_token
base = AutoModelForCausalLM.from_pretrained("gpt2").to(device)
pairs = [("France", "Paris"), ("Japan", "Tokyo"), ("Kenya", "Nairobi"), ("Brazil", "Brasília"),
         ("Egypt", "Cairo"), ("Canada", "Ottawa"), ("Australia", "Canberra"), ("India", "New Delhi"),
         ("Philippines", "Manila"), ("Germany", "Berlin"), ("Peru", "Lima")]
held = [("Spain", "Madrid"), ("Thailand", "Bangkok")]
fmt = lambda c, a: f"### Instruction:\nWhat is the capital of {c}?\n### Response:\nThe capital of {c} is {a}. Thanks for asking!"
train_texts = [fmt(c, a) + tok.eos_token for c, a in pairs]
held_texts = [fmt(c, a) + tok.eos_token for c, a in held]
print(len(train_texts), "train,", len(held_texts), "held out")
```
   *Exercise 2:* add three more training pairs of your own (keep the same format). Why is it a good idea to keep some examples out of training?
3. *Before: what the base model says (20 min).* Record the base model's answers now. Wrapping the model with LoRA changes it, so this must come first.
```python
def ask(m, country, n=30):
    prompt = f"### Instruction:\nWhat is the capital of {country}?\n### Response:\n"
    ids = tok(prompt, return_tensors="pt").to(device)
    out = m.generate(**ids, max_new_tokens=n, do_sample=False, pad_token_id=tok.eos_token_id)
    return tok.decode(out[0][ids["input_ids"].shape[1]:], skip_special_tokens=True)

tests = ["Spain", "Thailand", "Greece"]
before = {c: ask(base, c) for c in tests}
for c in tests: print(c, "->", repr(before[c]))
```
   *Exercise 3:* describe the base model's answers. Does it answer the question, end with "Thanks for asking!", or just ramble?
4. *Add the LoRA adapter (25 min).* Use the settings from the lesson, then count the trainable parameters.
```python
from peft import LoraConfig, get_peft_model
cfg = LoraConfig(task_type="CAUSAL_LM", r=8, lora_alpha=16, target_modules=["c_attn"], lora_dropout=0.05)
model = get_peft_model(base, cfg)
model.print_trainable_parameters()
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
total = sum(p.numel() for p in model.parameters())
print(trainable, total, f"{100 * trainable / total:.4f}%")
```
   *Exercise 4:* compare the numbers with Exercise 1 step (b). You may see a message that `fan_in_fan_out` was set to True: GPT-2 stores `c_attn` in a transposed layout and peft adjusts for it, so this is expected. Change `r` to 2 and 32 and record the trainable count each time (re-run from the load step so the base model is fresh).
5. *Train for a few steps (40 min).* A short manual loop with the whole tiny dataset as one batch. Padding tokens are ignored in the loss.
```python
def batch(texts):
    enc = tok(texts, return_tensors="pt", padding=True).to(device)
    labels = enc["input_ids"].clone()
    labels[enc["attention_mask"] == 0] = -100
    return enc, labels

def loss_on(texts):
    model.eval()
    enc, labels = batch(texts)
    with torch.no_grad():
        return model(**enc, labels=labels).loss.item()

opt = torch.optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=3e-4)
enc, labels = batch(train_texts)
log = []
for step in range(1, 61):
    model.train()
    loss = model(**enc, labels=labels).loss
    loss.backward(); opt.step(); opt.zero_grad()
    if step in (1, 10, 20, 40, 60):
        log.append((step, round(loss.item(), 3), round(loss_on(held_texts), 3)))
print(log)
```
   *Exercise 5:* record the training loss and the held-out loss in the printed log. Then call `ask(model, c)` for Spain, Thailand and Greece and compare with your "before" answers. Does the model add "Thanks for asking!"? Is it always right about the capital? (Greece was not in training or held-out text.)
6. *Train too long (30 min).* Continue the same loop for 300 more steps and log the same two losses every 50 steps.
```python
for step in range(61, 361):
    model.train()
    loss = model(**enc, labels=labels).loss
    loss.backward(); opt.step(); opt.zero_grad()
    if step % 50 == 0:
        print(step, round(loss.item(), 3), round(loss_on(held_texts), 3))
for c in tests: print(c, "->", repr(ask(model, c)))
model.save_pretrained("lora_gpt2")
```
   *Exercise 6:* what happens to the training loss and the held-out loss? Describe any sign of overfitting. The saved adapter folder contains only the adapter: look at its file size and compare it with the size of GPT-2 itself.
7. *Reflection (15 min).* In a markdown cell: (a) why a small adapter can change a model's behaviour; (b) why 11 examples are risky and what you would do with 10,000; (c) one risk of fine-tuning a model on private data.
8. *Cleanup.* `del model, base; gc.collect(); torch.cuda.empty_cache()` if you used the GPU, restart the kernel and save the notebook.

### What you should see

- Step 1: LoRA per matrix 65,536 and fraction about 0.0039; GPT-2 LoRA total 294,912; FP32 about 497.8 MB, FP16 about 248.9 MB and Adam training about 1.99 GB. For 13 billion parameters: 26 GB in FP16 and 208 GB for the Adam estimate.
- Step 3: the base model does not reliably answer in the target format and usually does not end with "Thanks for asking!". It may ramble or repeat the question.
- Step 4: `print_trainable_parameters` shows 294,912 trainable out of 124,734,720 total (about 0.2364%). With r = 2 you get 73,728 and with r = 32 you get 1,179,648 trainable numbers.
- Step 5: the training loss falls clearly in 60 steps. After training the model usually follows the format and ends with "Thanks for asking!" on the unseen countries. Whether its capital is correct depends on what GPT-2 already knew, so check each answer.
- Step 6: the training loss keeps falling to a small value; the held-out loss usually stops improving or gets worse. The saved adapter is only a little over 1 MB.

### Common mistakes

- Wrapping the model with `get_peft_model` before recording the "before" answers. The base model object is modified.
- Forgetting `tok.pad_token = tok.eos_token`. GPT-2 has no padding token, and batching fails.
- Not masking padding in the labels (`-100`), which teaches the model to predict padding.
- Re-running the load and `get_peft_model` cells in the wrong order, so the model gets two adapters and the trainable counts look wrong. Restart the kernel and run top to bottom.
- Judging success by the training loss alone. Always check outputs and the held-out loss.

### Deliverables

Submit through the portal the notebook with outputs visible, your answers to Exercises 1–6, and the reflection. Your instructor announces due dates and how this lab counts toward your grade.

| Criterion | Points |
|---|---|
| Parameter and memory arithmetic (Exercise 1) | 15 |
| Data and baseline (Exercises 2–3) | 15 |
| LoRA setup and ranks (Exercise 4) | 20 |
| Training and before/after comparison (Exercise 5) | 20 |
| Overfitting experiment (Exercise 6) | 15 |
| Reflection | 10 |
| Code quality and cleanup | 5 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. The graded knowledge check is on the portal.

```quiz
{
  "id": "week-14-check",
  "title": "Week 14 quiz: Training LLMs",
  "passMark": 70,
  "questions": [
    {
      "q": "What is the training goal in pre-training of a base language model?",
      "options": [
        "Following instructions from users",
        "Matching human preferences",
        "Predicting the next token on a very large amount of text",
        "Classifying each document into a topic"
      ],
      "answer": 2,
      "why": "Pre-training teaches next-token prediction on general text. Following instructions comes from instruction tuning, and preferences from RLHF."
    },
    {
      "q": "A company continues training a pre-trained model on its own legal documents with the usual next-token goal. What is this called?",
      "options": [
        "Instruction tuning",
        "Continued pre-training",
        "RLHF",
        "Pre-training from scratch"
      ],
      "answer": 1,
      "why": "Same objective, new domain text, starting from an existing model. Instruction tuning would use instruction and answer pairs instead."
    },
    {
      "q": "What data does instruction tuning use?",
      "options": [
        "Examples that pair an instruction with a good answer",
        "Unlabelled web pages only",
        "Random noise images",
        "Only the reward model's scores"
      ],
      "answer": 0,
      "why": "The pairs show the model what following an instruction looks like. The reward model belongs to RLHF."
    },
    {
      "q": "What is the reward model in RLHF trained on?",
      "options": [
        "The final chat answers of the language model, with no human input",
        "Human comparisons of which answer is better",
        "Raw pre-training text",
        "The GPU memory usage"
      ],
      "answer": 1,
      "why": "People rank or compare answers, and the reward model learns to give higher scores to the preferred ones."
    },
    {
      "q": "Why does the RLHF optimisation step include a penalty for moving far from the original model?",
      "options": [
        "To make training use less memory.",
        "To make the model larger.",
        "To avoid learning odd text that tricks the reward model while no longer being useful language.",
        "To remove the need for human feedback."
      ],
      "answer": 2,
      "why": "Without the penalty the model can drift into strange outputs that score well but are not good. The penalty keeps it close to sensible behaviour."
    },
    {
      "q": "A square weight matrix has d = 1024. LoRA adds an adapter with rank r = 4. How many trainable numbers does the adapter have?",
      "options": [
        "4,096",
        "1,048,576",
        "16,384",
        "8,192"
      ],
      "answer": 3,
      "why": "2 × d × r = 2 × 1024 × 4 = 8,192. The number 1,048,576 is the whole d × d matrix, which LoRA keeps frozen."
    },
    {
      "q": "In LoRA, which parts of the model are updated during training?",
      "options": [
        "The two small matrices A and B; the original W stays frozen.",
        "Every weight in the original model.",
        "Only the tokenizer.",
        "Only the output of the last layer, copied from W."
      ],
      "answer": 0,
      "why": "LoRA freezes W and learns ΔW = B·A. That is why so few parameters are trained and why the adapter is small to store."
    },
    {
      "q": "How much memory do the weights of a 13-billion-parameter model need in FP16 (2 bytes per parameter)?",
      "options": [
        "13 GB",
        "26 GB",
        "52 GB",
        "208 GB"
      ],
      "answer": 1,
      "why": "13 × 10⁹ × 2 bytes = 26 GB. 13 GB would be INT8, 52 GB is FP32, and 208 GB is a rough Adam training estimate at 16 bytes per parameter."
    },
    {
      "q": "You fine-tune on 11 examples for hundreds of steps. The training loss is close to 0 but answers to new prompts get worse. What is the best explanation?",
      "options": [
        "The model has overfitted the few examples.",
        "LoRA cannot be used with text.",
        "The learning rate was too low.",
        "The reward model failed."
      ],
      "answer": 0,
      "why": "A very small dataset lets the model memorise it. Low training loss with worse results on new data is the classic sign. No reward model is involved in this lab."
    },
    {
      "q": "Why can a base model that was only pre-trained answer \"Q: How do I boil an egg?\" with more questions?",
      "options": [
        "It was trained to follow instructions but forgot them.",
        "It was trained only to continue text, and lists of questions are common text.",
        "Its LoRA adapter has the wrong rank.",
        "It has too few parameters to read the question."
      ],
      "answer": 1,
      "why": "A base model predicts what text comes next; it has not been taught that a question expects an answer. Instruction tuning and RLHF add that."
    }
  ]
}
```

## How Week 14 is assessed

**Your lab (100 points).** The marking table is in the lab's Deliverables. Your instructor announces due dates and how labs, knowledge checks and exams are weighted.

**Knowledge check.** The graded knowledge check for this week is on the portal. Topics: pre-training versus fine-tuning, instruction tuning, RLHF, LoRA and memory estimates.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. Name the four stages in building a chat model and what each one adds.
2. LoRA with r = 16 on a 2048 × 2048 matrix: how many trainable numbers?
3. Why can a model trained only on next-token prediction fail to answer a question?

**Homework / self-study**
- Finish any unfinished lab exercises and the reflection.
- Prepare for the Week 15 exam, which covers Weeks 11 to 14: patches and tokens in a ViT, GANs and transpose convolution, the diffusion schedule, and LoRA arithmetic.
- Capstone: read the brief at [Capstone](/capstone) before your proposal session in Week 15.
