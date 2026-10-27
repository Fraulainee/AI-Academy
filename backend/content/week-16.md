> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 16 — LLM Components & RAG

**Purpose:** Learn the parts of an LLM application and see why ==retrieval-augmented generation (RAG) reduces hallucination by giving the model the right text to read== before it answers.

**Term:** Final (Weeks 16–20) · **Month:** 4 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "The same question, with and without the document",
  "caption": "A plain model answers from memory and can sound sure while being wrong. A RAG system first looks up the right passage, then answers from it. All text and scores here are made up for the animation, using a fictional checklist.",
  "scenes": [
    { "name": "Plain LLM", "kind": "text", "outputLabel": "Answer from memory", "prompt": "What does our team checklist say to record for corrosion?", "output": "Usually you record the percentage of the surface covered by rust and its colour. (Sounds confident, but the model never saw your checklist. This is a made-up example of a hallucination.)" },
    { "name": "Retrieve", "kind": "bars", "outputLabel": "Passage match scores (illustrative)", "prompt": "Search the checklist for: record corrosion", "bars": [ { "label": "Corrosion", "value": 0.78 }, { "label": "Cracks", "value": 0.12 }, { "label": "Drainage", "value": 0.06 }, { "label": "Reporting", "value": 0.04 } ] },
    { "name": "RAG answer", "kind": "text", "outputLabel": "Answer from the passage", "prompt": "Question + the 'Corrosion' passage", "output": "Look at bolts, railings and exposed reinforcing bars, note rust stains running down the surface, photograph each rusted part and mark its position on the sketch. [Source: Corrosion passage]" }
  ]
}
```

## By the end, you can…

1. ==Name the building blocks of an LLM application== (prompt template, tokenizer, model, output parser) and say how a chain connects them.
2. ==Explain why LLMs hallucinate==: they predict plausible text, have a training cut-off and cannot see your documents.
3. ==Describe the RAG steps== (index, retrieve, augment, generate) and run a similarity search by hand.
4. ==Name the limits of RAG== (bad retrieval, bad chunking, outdated documents) and how to check them.
5. Build and test a small RAG pipeline that says "I do not know" when the documents do not contain the answer.

Assessed in the Week 16 lab and quiz. Read each section, then play with the figure under it. Terms with a dotted underline open a short definition when you select them.

## The parts of an LLM application {rail=Components}

{lede} A chatbot is not just a model. It is a small assembly line: a [[prompt template|A fixed piece of text with blanks, such as "Answer the question: {question}", that is filled in for each request.]] builds the input, a [[tokenizer|The component that cuts text into tokens and turns them into numbers the model can read.]] converts it to token IDs, the model produces new tokens, and an [[output parser|Code that turns the model's raw text into something a program can use, such as a number, a list or JSON.]] shapes the answer. ==Connecting these in order is a chain.==

Example. Your app receives the question "What does the checklist say about cracks?". The template wraps it in instructions, the tokenizer turns the whole prompt into maybe 40 token IDs, the model generates the answer tokens, the tokenizer turns them back to text, and the parser pulls out the part your app needs. Step through it below.

```viz
{
  "type": "pipeline",
  "title": "A chain: template to parser",
  "intro": "Step through one request.",
  "nodes": [
    { "id": "tmpl", "label": "Prompt template", "sub": "fill in the blanks" },
    { "id": "tok", "label": "Tokenizer", "sub": "text → token IDs" },
    { "id": "model", "label": "Model", "sub": "predict new tokens" },
    { "id": "parse", "label": "Output parser", "sub": "text → usable data" }
  ],
  "steps": [
    { "title": "Fill the template", "body": "The template combines fixed instructions with the user's question, so every request is worded in the same reliable way.", "active": ["tmpl"], "example": "You are a helpful assistant. Question: What does the checklist say about cracks?" },
    { "title": "Tokenize", "body": "The tokenizer cuts the prompt into tokens and maps each to an integer ID. The model only ever sees numbers.", "active": ["tok"], "example": "[2675, 527, 264, 11190, ...]  (illustrative IDs)" },
    { "title": "Generate", "body": "The model predicts one token at a time, feeding each new token back in, until it stops. The tokenizer then turns the IDs back into text.", "active": ["model", "tok"], "example": "Record where each crack is, measure its length and width ..." },
    { "title": "Parse", "body": "The parser extracts what the program needs, for example a short answer or a JSON object, and can reject output that is in the wrong shape.", "active": ["parse"], "example": "{\"answer\": \"Record location, length, width\"}" }
  ],
  "note": "Illustrative token IDs and wording. Libraries such as LangChain package these parts, but the lab builds them by hand so you see each one."
}
```

Notice that the model is only one box. The template and the parser are where you control the shape of what goes in and what comes out.

## Why LLMs hallucinate {rail=Hallucination}

{lede} A [[hallucination|Text from a language model that sounds fluent and confident but is wrong or made up.]] is not a bug in the usual sense. ==An LLM is trained to predict plausible next tokens, not to check facts==, so when it lacks the knowledge it still produces something plausible.

Three causes matter for this course:
- **It predicts plausible text.** A fluent sentence and a true sentence look the same to the model.
- **It has a training cut-off.** It knows nothing that happened after its data was collected.
- **It has never seen your documents.** Your team checklist, your company policy or last week's report were not in its training data.

RAG attacks the third cause directly, and helps with the second: you hand the model the up-to-date text and ask it to answer from that text.

```viz
{
  "type": "flow",
  "title": "Plain LLM versus RAG",
  "modes": [
    {
      "name": "Plain LLM",
      "tagline": "Answers only from what it memorised in training. It cannot look anything up.",
      "inputLabel": "Input: the question",
      "modelLabel": "memory of training data",
      "outputLabel": "Output: a fluent answer",
      "examples": [
        { "label": "Your own document", "input": "What does our checklist say to record for corrosion?", "output": "Usually the percentage of the surface covered by rust. (Plausible, but not from your checklist.)" },
        { "label": "Recent event", "input": "What changed in the checklist this month?", "output": "A confident guess, because the model has no way to know." }
      ],
      "note": "Both outputs are illustrative. Real models vary, but without the document they can only guess."
    },
    {
      "name": "RAG",
      "tagline": "Searches your documents first, then answers from the passages it found.",
      "inputLabel": "Input: the question + retrieved passages",
      "modelLabel": "reads the passages, then writes",
      "outputLabel": "Output: an answer tied to a source",
      "examples": [
        { "label": "Your own document", "input": "What does our checklist say to record for corrosion?", "output": "Bolts, railings, exposed bars and rust stains; photograph each part and mark its position. [Corrosion passage]" },
        { "label": "Not in the documents", "input": "What is the maximum allowed crack width?", "output": "I do not know. The passages do not give a maximum." }
      ],
      "note": "The checklist is fictional sample text. The second answer works only if the prompt tells the model to say it does not know."
    }
  ]
}
```

## How RAG works {rail=RAG}

{lede} [[Retrieval-augmented generation (RAG)|A way to answer using your own documents. The system finds the passages most relevant to the question, adds them to the prompt, and the model answers from them.]] was introduced by Lewis et al. (2020). ==It has two phases: build an index once, then retrieve and generate for every question.==

1. **Index (once).** Split documents into [[chunks|Short pieces of a document, often a few hundred words, small enough to embed and fit into a prompt.]], turn each chunk into an [[embedding|A list of numbers that represents the meaning of a text, so similar texts get similar lists.]] and store them.
2. **Retrieve.** Embed the question and find the chunks most similar to it, using [[cosine similarity|A score from -1 to 1 that measures how closely two vectors point in the same direction. Higher means more similar.]]. Keep the top k.
3. **Augment.** Paste those chunks into the prompt, together with the question and an instruction such as "answer only from these passages".
4. **Generate.** The model writes an answer from the prompt.

Worked example of step 2. Query vector (1, 0). Chunk A = (3, 4), chunk B = (1, 1), chunk C = (0, 2). Cosine similarity is the dot product divided by the two lengths: A gives 3 ÷ 5 = 0.60, B gives 1 ÷ 1.414 = 0.71, C gives 0. So B comes first, even though A has bigger numbers, because cosine looks only at direction.

```viz
{
  "type": "pipeline",
  "title": "The RAG flow",
  "intro": "Step through one question.",
  "vertical": false,
  "nodes": [
    { "id": "index", "label": "Index", "sub": "chunk, embed, store" },
    { "id": "query", "label": "Question", "sub": "embed the query" },
    { "id": "retrieve", "label": "Retrieve", "sub": "top-k similar chunks" },
    { "id": "augment", "label": "Augment", "sub": "build the prompt" },
    { "id": "generate", "label": "Generate", "sub": "LLM answers" }
  ],
  "steps": [
    { "title": "Build the index", "body": "Before any question, the documents are split into chunks, each chunk is embedded, and the vectors are stored. This is done once and updated when documents change.", "active": ["index"], "example": "5 passages become 10 chunks, 10 stored vectors." },
    { "title": "Embed the question", "body": "The question is turned into a vector with the same method used for the chunks, so the two can be compared.", "active": ["query"], "example": "Question: How do I measure a crack?" },
    { "title": "Retrieve top-k", "body": "The system scores every chunk against the question and keeps the k best. This is a search, not a language-model step.", "active": ["retrieve", "index"], "example": "k = 2: the two Cracks chunks score highest." },
    { "title": "Augment the prompt", "body": "The chunks are pasted into the prompt along with the question and the rule to answer only from them, or to say 'I do not know'.", "active": ["augment"], "example": "Answer using ONLY the passages below ... Passages: [1] ... Question: ..." },
    { "title": "Generate", "body": "The LLM reads the prompt and writes the answer. You can ask it to quote the passage number so a person can check the source.", "active": ["generate"], "example": "Record the crack's location, length and width, and photograph it with a scale. [1]" }
  ],
  "note": "Illustrative counts for the five-passage fictional checklist used in the next figure and in the lab."
}
```

Now try a real search. The five passages below are ==fictional sample text for teaching, not real engineering guidance==. The figure ranks them with TF-IDF, which scores shared keywords. Try the example queries, then try your own.

```viz
{
  "type": "retrieval",
  "title": "Keyword search over a fictional checklist",
  "query": "How do I measure a crack?",
  "topK": 2,
  "examples": ["How do I measure a crack?", "rust stains on bolts", "Who makes the pass or fail decision?", "Are the gutters blocked?", "The wall is shedding pieces and metal shows through"],
  "docs": [
    { "id": "crack", "title": "Cracks", "text": "Record the location of each crack, measure its length and width with a ruler, and photograph it with a scale next to it." },
    { "id": "spall", "title": "Spalling", "text": "Spalling is when concrete breaks off in flakes or chunks. Note the area affected and whether steel bars are visible underneath." },
    { "id": "rust", "title": "Corrosion", "text": "Corrosion is rust on steel parts. Look at bolts, railings and exposed reinforcing bars, and note rust stains running down the surface." },
    { "id": "drain", "title": "Drainage", "text": "Check that gutters and drain holes are clear, because standing water speeds up damage." },
    { "id": "report", "title": "Reporting", "text": "Every finding goes to the supervising engineer, who makes the pass or fail decision. The assistant must not declare any structure safe." }
  ],
  "checks": [
    { "query": "How do I measure a crack?", "top": "crack" },
    { "query": "rust stains on bolts", "top": "rust" },
    { "query": "Who makes the pass or fail decision?", "top": "report" },
    { "query": "Are the gutters blocked?", "top": "drain" },
    { "query": "What if concrete flakes off and steel bars are visible?", "top": "spall" }
  ],
  "note": "All passages are FICTIONAL SAMPLE TEXT. The last example query describes spalling in different words, so no keyword matches and every score is 0: keyword search fails on paraphrases, which is why real RAG uses embeddings."
}
```

Notice the last example. "Shedding pieces" and "metal shows through" mean spalling and exposed steel, but none of those words appear in the passage, so keyword search finds nothing. An embedding model would place the question near the Spalling passage because the meaning is close.

## Where RAG goes wrong {rail=Limits}

{lede} RAG ==reduces hallucination but does not remove it==. Each stage can fail on its own, so when an answer is wrong you need to find which stage broke.

Three common problems:
- **Bad retrieval.** The right chunk is not in the top k, as in the paraphrase example.
- **Bad chunking.** Chunks that are too big bury the key sentence; chunks that are too small lose context. Overlapping chunks (for example 50 words shared between neighbours) stop a sentence being cut in half.
- **Outdated or missing documents.** If the index holds an old policy, the model will answer confidently from it.

Even with perfect passages, the model can ignore them and answer from memory. To check a RAG system, test retrieval and generation separately: does the right chunk appear in the top k, and does the answer stay within the passages? Always also ask a question the documents cannot answer, and check that the system says "I do not know".

```viz
{
  "type": "sorter",
  "title": "Which stage is at fault?",
  "intro": "Place each symptom at the stage of RAG that most likely caused it.",
  "bins": [ { "id": "index", "label": "Index (chunk, embed, store)" }, { "id": "retrieve", "label": "Retrieve" }, { "id": "generate", "label": "Augment and generate" } ],
  "cards": [
    { "name": "Chunks are so long that the key sentence is buried", "answer": "index", "why": "Chunk size is decided when you build the index." },
    { "name": "The stored policy is two years old", "answer": "index", "why": "The index holds outdated documents; refresh it when sources change." },
    { "name": "The question uses different words from the passage, so the right chunk ranks low", "answer": "retrieve", "why": "The search step missed the right chunk; embeddings and a larger k can help." },
    { "name": "k is 1 but the answer needs two passages", "answer": "retrieve", "why": "Too few chunks were retrieved. Raising k gives the model both." },
    { "name": "The right passage is in the prompt but the model answers from memory", "answer": "generate", "why": "The model ignored the context. Make the instruction explicit: answer only from the passages." },
    { "name": "The prompt never says what to do when the answer is missing", "answer": "generate", "why": "Without an 'I do not know' rule, the model tends to guess." }
  ]
}
```

## Key takeaways {rail=Takeaway}

- An LLM application is a ==chain: prompt template, tokenizer, model, output parser==. You control what goes in and what comes out.
- LLMs hallucinate because they ==predict plausible text, have a training cut-off and have not seen your documents==.
- RAG = ==index, retrieve, augment, generate==. Retrieval uses similarity (such as cosine) to find the best chunks.
- RAG reduces hallucination but ==can still fail at any stage==, so test retrieval and generation separately, and test questions the documents cannot answer.

## Lab: build a tiny RAG pipeline {rail=Laboratory}

Build a small question-answering system over a few documents, and ==show that retrieval changes the answers and that the system says "I do not know" when it should==. This is GA Lab 8 Part 1. Time: 3 hours.

### Setup

1. Create a folder `week16` and a notebook `lab8a.ipynb` in JupyterLab.
2. No internet and no `pip install`. Use only `numpy`, `scikit-learn`, `torch` and `transformers`.
3. Steps 1 to 4 need no GPU. Step 5 loads a language model from the offline Hugging Face cache (`HF_HOME`) with the ID `meta-llama/Llama-3.1-8B-Instruct`, the model used in the Prompt Lab. Confirm with your instructor that every model ID below is in the offline cache, and use any cached instruct model if it is not.
4. The GPU is shared. Free memory after Step 5 (`del lm; torch.cuda.empty_cache()`).
5. All sample documents below are FICTIONAL SAMPLE TEXT for practice. They are not real engineering guidance.

### Step-by-step tasks

1. *Documents and chunking (20 min).*
```python
docs = {
 "cracks": "FICTIONAL SAMPLE TEXT. Cracks: record where each crack is on the structure, measure its length and its width with a ruler, and take a photo with a scale next to the crack. Note whether the crack is dry or wet. Cracks that cross a joint should be marked in the report with their own label.",
 "spalling": "FICTIONAL SAMPLE TEXT. Spalling: spalling is when concrete breaks off in flakes or chunks. Note the area that is affected, estimate how deep the missing layer is, and write down whether steel bars are visible underneath. Take photos from two angles.",
 "corrosion": "FICTIONAL SAMPLE TEXT. Corrosion: corrosion is rust on steel parts. Look at bolts, railings and exposed reinforcing bars, and note rust stains that run down the surface. Photograph each rusted part and record its position on the sketch.",
 "drainage": "FICTIONAL SAMPLE TEXT. Drainage: check that gutters and drain holes are clear of leaves and dirt. Standing water speeds up damage, so record any place where water collects after rain.",
 "reporting": "FICTIONAL SAMPLE TEXT. Reporting: every finding goes to the supervising engineer, who makes the pass or fail decision. The assistant only drafts a summary and must never declare a structure safe.",
}
def chunk(text, size=30, overlap=10):
    words = text.split(); step = size - overlap; out = []
    for start in range(0, len(words), step):
        out.append(" ".join(words[start:start + size]))
        if start + size >= len(words): break
    return out
chunks = [(name, c) for name, t in docs.items() for c in chunk(t)]
print(len(chunks))
```
   *Exercise 1:* the code prints 10. Explain in two sentences why `cracks` makes 3 chunks and `drainage` makes 1. Then change `size` to 20 and `overlap` to 0 and record the new chunk count.
2. *TF-IDF retrieval (30 min).*
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
vec = TfidfVectorizer(stop_words="english")
M = vec.fit_transform([c for _, c in chunks])

def retrieve(question, k=2):
    sims = cosine_similarity(vec.transform([question]), M)[0]
    top = sims.argsort()[::-1][:k]
    return [(chunks[i][0], chunks[i][1], float(sims[i])) for i in top]

for name, text, s in retrieve("How do I measure a crack?"):
    print(round(s, 3), name, "|", text[:60])
```
   *Exercise 2:* run five questions of your own (two the documents can answer, one paraphrase with no shared keywords, two they cannot). For each, record the top source and its score. Which question gets a score of 0?
3. *Measure retrieval (20 min).* Check retrieval alone, before any language model is involved.
```python
tests = [("How do I measure a crack?", "cracks"),
         ("What should I note about rust on bolts?", "corrosion"),
         ("Who makes the pass or fail decision?", "reporting"),
         ("Where does water collect?", "drainage"),
         ("What does a spalling inspection record?", "spalling")]
hits = sum(want in [retrieve(q, k=1)[0][0]] for q, want in tests)
print(f"top-1 accuracy: {hits}/{len(tests)}")
```
   *Exercise 3:* add two paraphrased questions to `tests` and report the new top-1 accuracy. Compare k=1 with k=3: does the right source appear anywhere in the top 3?
4. *Build the prompt (20 min).*
```python
def build_prompt(question, hits):
    context = "\n".join(f"[{i + 1}] ({name}) {text}" for i, (name, text, _) in enumerate(hits))
    return ("Answer using ONLY the passages below. Quote the passage number. "
            'If the answer is not in the passages, reply exactly: "I do not know."\n\n'
            f"Passages:\n{context}\n\nQuestion: {question}\nAnswer:")

q = "What should I record for corrosion?"
print(build_prompt(q, retrieve(q, k=2)))
```
   *Exercise 4:* explain what each of the three instructions in the prompt is for (only the passages, quote the number, say "I do not know").
5. *Generate, with and without retrieval (60 min).*
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
name = "meta-llama/Llama-3.1-8B-Instruct"
tok = AutoTokenizer.from_pretrained(name)
lm = AutoModelForCausalLM.from_pretrained(name, torch_dtype=torch.bfloat16).to("cuda")

def ask(prompt, max_new_tokens=120):
    msgs = [{"role": "user", "content": prompt}]
    enc = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(lm.device)
    with torch.no_grad():
        out = lm.generate(**enc, max_new_tokens=max_new_tokens, do_sample=False, pad_token_id=tok.eos_token_id)
    return tok.decode(out[0][enc["input_ids"].shape[1]:], skip_special_tokens=True).strip()

for q in ["What should I record for corrosion?", "What is the maximum allowed crack width in millimetres?"]:
    print("PLAIN:", ask(q)); print("RAG:  ", ask(build_prompt(q, retrieve(q, k=2)))); print()
```
   *Exercise 5:* for each of the two questions write down the plain answer and the RAG answer. Which one is grounded in the documents? What did the system do with the question the documents cannot answer, and was that correct?
6. *Break it on purpose (30 min).* Change one thing at a time and re-run the two questions: (a) remove the "I do not know" instruction, (b) set `k=1` for a question that needs two chunks, (c) delete the `corrosion` document. Record what changes.
   *Exercise 6:* for each change, say which stage of RAG you broke (index, retrieve or generate) and what the symptom was.
7. *Cleanup (5 min).* `del lm; torch.cuda.empty_cache()`, save the notebook.

### What you should see

- Step 1: `10` chunks. With `size=20, overlap=0`, the same loop gives `12` chunks (3, 3, 2, 2 and 2 per document).
- Step 2: the top source for "How do I measure a crack?" is `cracks`. A paraphrase with no shared keywords gets a score of 0.
- Step 3: top-1 accuracy of 5/5 on the five starter questions. The exact scores may differ slightly from other TF-IDF tools, but the order should not.
- Step 5: the plain model gives a fluent answer from memory. The RAG answer quotes the corrosion passage. For the crack-width question the prompt asks the model to reply "I do not know."; a small model may still guess, which is itself a finding to report.

### Common mistakes

- Forgetting `overlap < size`. If overlap is not smaller than size, `step` is zero or negative and `range` fails or loops oddly.
- Re-fitting the vectorizer on the question. Use `vec.transform`, not `fit_transform`, for questions, otherwise the vocabulary changes.
- Pasting too many chunks. A long prompt can push out the question or exceed the model's context window.
- Judging only the final answer. Check retrieval separately first, otherwise you cannot tell which stage failed.
- Leaving the model in GPU memory. The GPU is shared.

### Deliverables

The notebook with outputs visible, answers to the six exercises, and a short paragraph: when did RAG help, and when did it not? Submit through the portal. Your instructor announces the deadline and weights.

| Criterion | Points (of 100) |
|---|---|
| Chunking and retrieval work (Steps 1 to 3) | 30 |
| Prompt and generation, with and without retrieval (Steps 4 and 5) | 30 |
| Break-it experiments and stage diagnosis (Step 6) | 20 |
| Written exercises and the closing paragraph | 15 |
| Code quality and GPU etiquette | 5 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one.

```quiz
{
  "id": "week-16-check",
  "title": "Week 16 quiz: LLM components and RAG",
  "passMark": 70,
  "questions": [
    {
      "q": "Which order matches a simple LLM chain?",
      "options": [
        "Prompt template, tokenizer, model, output parser",
        "Output parser, model, tokenizer, prompt template",
        "Tokenizer, output parser, prompt template, model",
        "Model, prompt template, output parser, tokenizer"
      ],
      "answer": 0,
      "why": "The template builds the prompt, the tokenizer turns it into IDs, the model generates, and the parser shapes the output. The other orders put a step before its input exists."
    },
    {
      "q": "What does an output parser do?",
      "options": [
        "It cuts text into tokens.",
        "It trains the model on new data.",
        "It turns the model's text into a form a program can use, such as JSON or a number.",
        "It searches the documents for the best chunk."
      ],
      "answer": 2,
      "why": "The parser works after the model. Cutting text into tokens is the tokenizer's job and searching chunks is retrieval."
    },
    {
      "q": "Why can an LLM state a wrong fact in a confident, fluent way?",
      "options": [
        "It is trained to predict plausible next tokens, and plausible is not the same as true.",
        "It always copies its answers from the web.",
        "Its temperature is always set to zero.",
        "It checks every fact but sometimes makes arithmetic mistakes."
      ],
      "answer": 0,
      "why": "The training goal is plausible text. The model has no built-in fact check, so a made-up answer can read just like a true one."
    },
    {
      "q": "A company asks a plain LLM about last week's internal policy change. Which cause of hallucination is this?",
      "options": [
        "Too high a learning rate",
        "A tokenizer error",
        "Too many chunks in the prompt",
        "The model has a training cut-off and never saw the company's documents"
      ],
      "answer": 3,
      "why": "The policy is newer than the training data and private, so the model cannot know it. RAG fixes this by supplying the current text."
    },
    {
      "q": "Which is the correct order of the RAG steps?",
      "options": [
        "Generate, retrieve, index, augment",
        "Index, retrieve, augment, generate",
        "Retrieve, generate, augment, index",
        "Augment, index, generate, retrieve"
      ],
      "answer": 1,
      "why": "You index the documents first, then for each question retrieve chunks, augment the prompt with them and finally generate the answer."
    },
    {
      "q": "A query vector is (1, 0). Chunk A = (3, 4), chunk B = (1, 1), chunk C = (0, 2). Which chunk does cosine similarity rank first?",
      "options": [
        "Chunk A, with similarity 0.60",
        "Chunk B, with similarity 0.71",
        "Chunk C, with similarity 1.00",
        "Chunk A, because its numbers are largest"
      ],
      "answer": 1,
      "why": "Cosine = dot product ÷ lengths. A: 3 ÷ 5 = 0.60. B: 1 ÷ 1.414 = 0.71. C: 0 ÷ 2 = 0. Cosine ignores size and compares direction only."
    },
    {
      "q": "A 1,000-word document is split into chunks of 200 words, and each new chunk starts 150 words after the previous one (so neighbours overlap by 50). The last chunk may be shorter. How many chunks are there?",
      "options": ["5", "6", "8", "7"],
      "answer": 3,
      "why": "Chunks start at words 0, 150, 300, 450, 600, 750 and 900, which is 7 starts. The last one (900 to 1000) is shorter. The value 5 ignores the overlap."
    },
    {
      "q": "Your RAG app has a 4,096-token prompt budget. The question and instructions use 300 tokens, you reserve 400 tokens for the answer, and each retrieved chunk is 500 tokens. What is the largest k that fits?",
      "options": ["5", "7", "6", "8"],
      "answer": 2,
      "why": "4,096 − 300 − 400 = 3,396 tokens left for chunks. 3,396 ÷ 500 = 6.79, so 6 whole chunks fit. Seven chunks would need 3,500 tokens."
    },
    {
      "q": "The right passage is in the prompt, yet the model answers from its own memory and gets it wrong. Which stage most likely needs fixing?",
      "options": [
        "The index, because the chunks are too long.",
        "The generation prompt, which should say to answer only from the passages.",
        "The retrieval step, because the passage ranked first.",
        "The tokenizer, because it lost the passage."
      ],
      "answer": 1,
      "why": "Retrieval succeeded, since the passage is in the prompt. The model ignored it, so a stricter instruction (answer only from the passages, otherwise say you do not know) is the fix."
    },
    {
      "q": "Which statement about RAG is most accurate?",
      "options": [
        "It removes hallucination completely.",
        "It only works with TF-IDF search.",
        "It reduces hallucination by giving the model relevant text, but retrieval or generation can still fail.",
        "It needs the model to be retrained on your documents."
      ],
      "answer": 2,
      "why": "RAG supplies evidence at question time, with no retraining, but a missed passage or an ignored instruction can still produce a wrong answer."
    }
  ]
}
```

## How Week 16 is assessed

**Your lab (100 points)** is marked with the table in the lab section. The graded version is your instructor's lab notebook, so follow their instructions if they differ. **Across the course.** Laboratories and knowledge checks run through the term, with exams in Weeks 5, 10, 15 and 20 and a capstone. Your instructor announces the component weights in the syllabus. **Knowledge check.** The graded knowledge check for this week is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each:
1. Why does a plain LLM sometimes invent an answer?
2. Name the four RAG steps in order.
3. Name one way a RAG system can still give a wrong answer.

**Homework / self-study**
- Finish the lab exercises and write the closing paragraph.
- For your Capstone team: list three questions your inspection checklist should be able to answer, and one it should refuse to answer. Mark any sample text as fictional.
- Preview Week 17: agents, guardrails and trustworthy AI.
