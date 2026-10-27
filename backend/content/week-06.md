> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 6 — NLP: Tokens & Word Embeddings

**Purpose:** See how text becomes numbers: ==split text into tokens, then give every token a vector== that a model can compute with.

**Term:** Midterm (Weeks 6–10) · **Month:** 2 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch text turn into pieces and numbers",
  "caption": "A language model never sees letters or whole sentences. It sees tokens, and it scores which token comes next. These splits and probabilities are examples made up for the animation; a real tokenizer and model give different ones.",
  "scenes": [
    { "name": "One word", "kind": "tokens", "outputLabel": "Tokens (an example split)", "prompt": "unbelievably", "tokens": ["un", "believ", "ably"] },
    { "name": "A sentence", "kind": "tokens", "outputLabel": "Tokens (an example split)", "prompt": "Tokenization is fun", "tokens": ["Token", "ization", " is", " fun"] },
    { "name": "Next word", "kind": "bars", "outputLabel": "Next-word probabilities (made up)", "prompt": "The cat sat on the", "bars": [ { "label": "mat", "value": 0.5 }, { "label": "floor", "value": 0.25 }, { "label": "roof", "value": 0.15 }, { "label": "moon", "value": 0.1 } ] },
    { "name": "Word maths", "kind": "text", "outputLabel": "Vector arithmetic", "prompt": "king − man + woman = ?", "output": "queen. This is the famous word-embedding example: words become vectors, and directions in the space carry meaning." }
  ]
}
```

## By the end, you can…

1. ==Describe how language models evolved== from hand-written rules to n-gram counts to neural models.
2. ==Build a bigram model== from counts and use it to find next-word probabilities and generate text.
3. ==Explain why modern models use sub-word tokens== and learn byte-pair-encoding (BPE) merges by hand.
4. ==Explain word embeddings==: words as vectors, cosine similarity, analogies, and their limits and biases.
5. Tokenise text with Hugging Face tokenizers and compare sentence embeddings in the lab.

Assessed in the Week 6 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## From rules to counts to neural models {rail=History}

{lede} Language models changed three times: first people wrote ==rules==, then computers ==counted word sequences==, and now ==neural networks learn== from huge amounts of text. Each step handled more of the messiness of language.

A [[language model|A model that gives a probability to the next word (or token) given the words so far. Writing text is repeating that step.]] answers one question: given the words so far, how likely is each possible next word? You met this in Week 1 when you moved the temperature slider. This week is about the two things underneath: how text is cut into pieces, and how those pieces become numbers.

Select each event on the timeline and notice what each step could not do.

```viz
{
  "type": "timeline",
  "title": "Language models, step by step",
  "events": [
    { "year": "1960s", "title": "Hand-written rules", "text": "Programs such as ELIZA (1966) matched keywords with patterns written by people and filled in a reply. They did not understand anything, and every new topic needed new rules." },
    { "year": "1980s–2000s", "title": "Statistical n-grams", "text": "Instead of rules, computers counted how often word sequences appeared in text and used the counts as probabilities. This worked for speech recognition and translation, but the models only looked a few words back." },
    { "year": "Early 2000s", "title": "First neural language models", "text": "Neural networks learned a vector for every word and used these vectors to predict the next word. Similar words ended up with similar vectors, so the model could generalise to word sequences it had never counted." },
    { "year": "2013", "title": "word2vec", "text": "Mikolov et al. showed that simple, fast training could give high-quality word vectors from large text collections, and that directions in the vector space carried meaning, such as the famous king − man + woman ≈ queen." },
    { "year": "2016", "title": "Sub-word tokens (BPE)", "text": "Sennrich et al. brought byte-pair encoding to neural machine translation. Words are split into frequent pieces, so a model can read rare or new words without a huge vocabulary." },
    { "year": "2017–2020", "title": "Transformers: BERT, GPT", "text": "The Transformer (Vaswani et al., 2017) let models read long text in parallel. BERT (2018) and GPT-2 (2019) used it with sub-word tokens and learned vectors. You study the Transformer in Weeks 7–8." }
  ]
}
```

==Every later model keeps the same job: predict the next token.== What changed is how much context it can use and how it represents words.

## N-gram models: counting what comes next {rail=N-grams}

{lede} An [[n-gram model|A language model that estimates the next word from counts of the last n−1 words in training text. A bigram model uses one previous word.]] is the simplest language model there is: ==count which word follows which==, and turn counts into probabilities.

Take the tiny text "the cat sat on the mat. the cat saw the dog. the dog sat on the rug. the dog chased the cat." The word "the" appears 8 times with a next word: followed by "cat" 3 times, "dog" 3 times, "mat" once and "rug" once. So P(cat | the) = 3/8 = 0.375 and P(mat | the) = 1/8 = 0.125. To score a sequence, multiply: P(cat | the) × P(sat | cat) = 3/8 × 1/2 = 3/16 = 0.1875.

Select a word below to see its next-word probabilities, then generate a few sentences.

```viz
{
  "type": "ngram",
  "title": "A bigram model from 22 words",
  "text": "the cat sat on the mat . the cat saw the dog . the dog sat on the rug . the dog chased the cat .",
  "start": "the",
  "note": "A tiny training text on purpose, so you can check every count by hand."
}
```

Notice that generated sentences sound plausible for a few words and then wander or loop, and that a word pair the text never contained gets probability zero. These are the n-gram limits: ==no memory beyond the last word or two, and no way to handle sequences it has never seen==. A bigger n helps a little but the number of possible sequences explodes. Neural models solve this by sharing information between similar words.

## Tokens and byte-pair encoding {rail=Tokens}

{lede} A [[token|One piece of text that a model reads as a single unit. It can be a word, part of a word, or a single character.]] is the unit a model reads. ==Modern models use sub-word tokens==: common words stay whole, rare words are split into pieces the model already knows.

Why not words or characters? Look at "unbelievably", which has 12 letters.

| Unit | Vocabulary size | Length of "unbelievably" | Problem |
|---|---|---|---|
| Whole words | Huge, and it never ends | 1 | A new or rare word is unknown |
| Characters | Tiny (letters and symbols) | 12 | Long sequences; each piece carries little meaning |
| Sub-words | A fixed budget, often tens of thousands | A few, such as un + believ + ably (an example split) | Sits between the two |

[[Byte-pair encoding (BPE)|A way to build a sub-word vocabulary. Start with single characters, then repeatedly merge the most frequent neighbouring pair into a new symbol.]] builds this vocabulary from text, with no linguistics needed. The recipe is: start with characters, count every neighbouring pair, merge the most frequent pair into one symbol, and repeat. Each merge adds one symbol to the vocabulary, so 30 starting symbols plus 100 merges give a vocabulary of 130. The classic example uses the words low (5 times), lower (2), newest (6) and widest (3). The first merge is e + s because "es" occurs 6 + 3 = 9 times, and the next two merges build "est</w>", where </w> marks the end of a word.

Drag the slider to replay the merges, then type a word the corpus never saw, such as "lowest".

```viz
{
  "type": "bpe",
  "title": "Learn BPE merges from four words",
  "corpus": [ ["low", 5], ["lower", 2], ["newest", 6], ["widest", 3] ],
  "maxMerges": 9,
  "tryWord": "lowest",
  "note": "A toy corpus of four words. Real tokenizers learn tens of thousands of merges from billions of words."
}
```

After the nine merges "lowest" becomes low + est</w>, although the corpus never contained the word "lowest": the pieces are known, so the word is not. That is the point of sub-words. Real models use variants of the same idea: GPT-2 uses byte-level BPE, and BERT uses a similar method called WordPiece. Tokenisers also treat languages unequally: a language that was rare in the training text is often split into more pieces, which makes it slower and more expensive to process.

## Word embeddings: meaning as direction {rail=Embeddings}

{lede} A token is just an ID number, and an ID says nothing about meaning. An [[embedding|A vector of numbers that represents a token. Tokens used in similar ways get similar vectors.]] fixes that: ==each token gets a vector, and similar words get nearby vectors==.

The model learns the vectors from text, using the idea that a word is known by the company it keeps. "Cat" and "dog" appear in similar contexts, so their vectors end up close. Real embeddings have hundreds of dimensions; the map below has two so you can see it. To measure "close" we use [[cosine similarity|A number between −1 and 1 that measures how much two vectors point the same way. It ignores length.]]: the dot product of the two vectors divided by the product of their lengths. For (3, 4) and (4, 3) the dot product is 24 and both lengths are 5, so the cosine is 24 / 25 = 0.96, almost the same direction.

Click a word to see its nearest neighbours. Then test an analogy: A − B + C lands near D.

```viz
{
  "type": "scatter",
  "title": "A 2-D map of word meaning",
  "metric": "cosine",
  "points": [
    { "label": "man", "x": 2, "y": 1, "group": "people" },
    { "label": "woman", "x": 2, "y": 3, "group": "people" },
    { "label": "king", "x": 6, "y": 1, "group": "royalty" },
    { "label": "queen", "x": 6, "y": 3, "group": "royalty" },
    { "label": "cat", "x": 3, "y": -5, "group": "animals" },
    { "label": "dog", "x": 4, "y": -4, "group": "animals" },
    { "label": "horse", "x": 5, "y": -6, "group": "animals" },
    { "label": "apple", "x": -2, "y": -6, "group": "fruits" },
    { "label": "banana", "x": -1, "y": -7, "group": "fruits" },
    { "label": "grape", "x": -3, "y": -5, "group": "fruits" },
    { "label": "france", "x": -5, "y": 4, "group": "places" },
    { "label": "paris", "x": -3, "y": 6, "group": "places" },
    { "label": "japan", "x": -7, "y": -2, "group": "places" },
    { "label": "tokyo", "x": -5, "y": 0, "group": "places" }
  ],
  "analogies": [
    { "a": "king", "b": "man", "c": "woman", "expect": "queen" },
    { "a": "paris", "b": "france", "c": "japan", "expect": "tokyo" }
  ],
  "note": "The coordinates are illustrative, drawn by hand so the analogies work. Real embeddings come from training, have hundreds of dimensions, and are messier."
}
```

Notice two things. Groups form clusters, and the step from man to king is the same arrow as the step from woman to queen. ==Vector arithmetic captures relations==: king − man + woman = (6, 1) − (2, 1) + (2, 3) = (6, 3), which is queen.

Be careful with analogies. In real embeddings they work for some relations and fail for many others, and the famous examples are chosen because they work. Embeddings also copy the patterns of the text they learned from, including stereotypes: a job word can sit closer to one gender word than another. ==An embedding is a mirror of its training data, so check it before you trust it.== This matters again in Week 11 when images and text share one space.

## Key takeaways {rail=Takeaway}

- ==Language models moved from rules to n-gram counts to neural networks==, but the job stayed the same: score the next token.
- A bigram model estimates P(next | previous) from counts. It cannot see far back and gives zero to sequences it never saw.
- ==Sub-word tokens (BPE) keep the vocabulary small and still read new words==: merge the most frequent neighbouring pair, repeat, and each merge adds one symbol.
- ==Embeddings turn tokens into vectors where similar meaning means a similar direction==. Cosine similarity measures it, and analogies and biases show both the power and the limits.

## Lab: n-grams, BPE, tokenizers and embeddings {rail=Laboratory}

Build a ==bigram model and a BPE tokenizer from scratch==, then compare them with real Hugging Face tokenizers and sentence embeddings. This is GA Lab 2. Time: 3 hours.

### Setup

1. Log in to the portal, start JupyterLab, and create a folder `week06` with a notebook `lab2.ipynb`.
2. Do not install packages and do not use the internet. Steps 1 and 2 use only the Python standard library.
3. Models and tokenizers load from the offline Hugging Face cache (`HF_HOME`). Confirm with your instructor that every model ID below is in the offline cache: `gpt2`, `bert-base-uncased` and `sentence-transformers/all-MiniLM-L6-v2`.
4. The GPU is shared. Everything this week runs well on the CPU, so leave the GPU alone.

### Step-by-step tasks

1. *A bigram model (35 min).* Use the same 22-word text as the figure, so you can check against it.
```python
import random
from collections import defaultdict, Counter
text = "the cat sat on the mat . the cat saw the dog . the dog sat on the rug . the dog chased the cat ."
words = text.replace(".", " ").split()
counts = defaultdict(Counter)
for a, b in zip(words, words[1:]):
    counts[a][b] += 1
print(counts["the"])
def prob(prev, nxt):
    return counts[prev][nxt] / sum(counts[prev].values())
print(prob("the", "cat"), prob("cat", "sat"), prob("the", "cat") * prob("cat", "sat"))
def generate(start, n=8, seed=0):
    random.seed(seed)
    out = [start]
    for _ in range(n):
        nxt = counts.get(out[-1])
        if not nxt:
            break
        out.append(random.choices(list(nxt), weights=list(nxt.values()))[0])
    return " ".join(out)
print(generate("the"))
```
   *Exercise 1:* paste a paragraph of 100+ words of your own choice, rebuild the counts, and generate five sentences. Write 3–4 sentences on where the output is fluent and where it breaks. Then add a trigram version (key = the last two words) and explain what it fixes and what it costs.
2. *BPE from scratch (45 min).*
```python
corpus = {"low": 5, "lower": 2, "newest": 6, "widest": 3}
vocab = {tuple(w) + ("</w>",): f for w, f in corpus.items()}
def pair_counts(vocab):
    pc = Counter()
    for sym, f in vocab.items():
        for a, b in zip(sym, sym[1:]):
            pc[(a, b)] += f
    return pc
def merge(vocab, pair):
    new = {}
    for sym, f in vocab.items():
        out, i = [], 0
        while i < len(sym):
            if i < len(sym) - 1 and sym[i] == pair[0] and sym[i + 1] == pair[1]:
                out.append(sym[i] + sym[i + 1]); i += 2
            else:
                out.append(sym[i]); i += 1
        new[tuple(out)] = f
    return new
merges = []
for step in range(9):
    best, n = pair_counts(vocab).most_common(1)[0]
    merges.append(best)
    vocab = merge(vocab, best)
    print(step + 1, best, n)
```
   *Exercise 2:* before running, work out the first three merges and their counts on paper. Then run and compare. Replace the corpus with six words of your own that share pieces (for example "walk", "walked", "walking", "talk", "talked", "talking") and list the merges.
3. *Encode new words and compare with real tokenizers (35 min).* First apply your merges to words the corpus never contained.
```python
def encode(word):
    v = {tuple(word) + ("</w>",): 1}
    for pair in merges:
        v = merge(v, pair)
    return list(next(iter(v)))
print(encode("lowest"), encode("newer"))

from transformers import AutoTokenizer
sentences = ["unbelievably good", "Mabilis ang tren.", "Tokenization matters."]
for name in ["gpt2", "bert-base-uncased"]:
    tok = AutoTokenizer.from_pretrained(name)
    for s in sentences:
        pieces = tok.tokenize(s)
        print(name, len(pieces), pieces)
```
   *Exercise 3:* record the pieces and counts. Which tokenizer splits "unbelievably" more? How does GPT-2 mark a leading space and how does BERT mark a word continuation? Which sentence needs the most tokens per word, and what might that cost a speaker of that language? Report only what you see; do not guess counts in advance.
4. *Sentence embeddings and cosine similarity (45 min).* Mean-pool the token vectors of the cached MiniLM model.
```python
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel
name = "sentence-transformers/all-MiniLM-L6-v2"
tok = AutoTokenizer.from_pretrained(name)
enc = AutoModel.from_pretrained(name).eval()
def embed(texts):
    batch = tok(texts, padding=True, truncation=True, return_tensors="pt")
    with torch.no_grad():
        h = enc(**batch).last_hidden_state
    mask = batch["attention_mask"].unsqueeze(-1).float()
    return F.normalize((h * mask).sum(1) / mask.sum(1), dim=1)
sents = ["A cat sat on the mat.", "A kitten rested on the rug.", "The stock market fell sharply today."]
E = embed(sents)
print(E.shape)
print((E @ E.T).numpy().round(2))
```
   *Exercise 4:* explain why the matrix diagonal is 1.0, which pair is most similar, and why. Add three sentence pairs of your own, including one with the same words in a different meaning, and predict the similarities before you run.
5. *Reflection (20 min).* In a markdown cell answer: (a) one thing a bigram model cannot do that BPE-plus-embeddings can, (b) one risk of embeddings learned from web text, (c) one limit of the king − man + woman example.

### What you should see

- Step 1: `Counter({'cat': 3, 'dog': 3, 'mat': 1, 'rug': 1})`, then `0.375 0.5 0.1875`. The generated text is plausible for a few words and then drifts or repeats.
- Step 2: nine merges, the first three being `('e', 's') 9`, `('es', 't') 9`, `('est', '</w>') 9`, then `('l', 'o') 7`, `('lo', 'w') 7`, `('n', 'e') 6`, `('ne', 'w') 6`, `('new', 'est</w>') 6`, `('low', '</w>') 5`.
- Step 3: `encode("lowest")` gives `['low', 'est</w>']` and `encode("newer")` gives `['new', 'e', 'r', '</w>']`. The real tokenizers print piece lists whose details differ between GPT-2 and BERT.
- Step 4: shape `torch.Size([3, 384])` and a 3×3 matrix with ones on the diagonal. The cat and kitten sentences should be more similar to each other than either is to the stock-market sentence.

### Common mistakes

- Starting from words instead of characters in BPE, or forgetting the end-of-word symbol `</w>`. The merges will not match the figure.
- Counting pairs without multiplying by the word frequency. "newest" occurs 6 times, so each of its pairs counts 6.
- Comparing embeddings with a raw dot product on unnormalised vectors. Use cosine similarity (the code above normalises first).
- Seeing "cannot connect to huggingface.co". The model ID is misspelled or not in the cache. Use the exact IDs and ask the instructor.
- Treating an analogy that worked once as proof that embeddings always capture relations.

### Deliverables

The completed notebook with outputs visible, answers to the four exercises and the reflection. Submit through the portal; your instructor announces due dates and weights.

| Criterion | Points |
|---|---|
| Bigram model + Exercise 1 | 25 |
| BPE from scratch + Exercise 2 | 25 |
| Real tokenizers + Exercise 3 | 20 |
| Embeddings + Exercise 4 | 20 |
| Reflection and code quality | 10 |

**Stretch goals.** Add smoothing so unseen word pairs get a small non-zero probability; try `bert-base-uncased` and `gpt2` on a sentence in a language you speak at home and compare the piece counts; build a small map of 10 words with MiniLM and plot them in 2-D with PCA from scikit-learn.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. Work the calculations on paper first.

```quiz
{
  "id": "week-06-check",
  "title": "Week 6 quiz: Tokens and word embeddings",
  "passMark": 70,
  "questions": [
    {
      "q": "Which list shows the history of language models in the right order?",
      "options": [
        "Neural models, n-grams, hand-written rules",
        "Hand-written rules, n-gram counts, neural models",
        "N-gram counts, hand-written rules, neural models",
        "Hand-written rules, neural models, n-gram counts"
      ],
      "answer": 1,
      "why": "Early programs used rules written by people, then computers counted word sequences (n-grams), and then neural networks learned vectors and predictions from large text."
    },
    {
      "q": "In a bigram model, the word \"the\" was followed by cat 3 times, dog 3 times, mat once and rug once. What is P(mat | the)?",
      "options": [
        "1/4",
        "3/8",
        "1/2",
        "1/8"
      ],
      "answer": 3,
      "why": "\"the\" has 3 + 3 + 1 + 1 = 8 followers, and mat is one of them, so the probability is 1/8 = 0.125."
    },
    {
      "q": "Using P(cat | the) = 3/8 and P(sat | cat) = 1/2, what is the probability of the sequence \"cat sat\" after \"the\"?",
      "options": [
        "3/16 = 0.1875",
        "7/8 = 0.875",
        "3/8 = 0.375",
        "1/2 = 0.5"
      ],
      "answer": 0,
      "why": "Probabilities of consecutive steps are multiplied: 3/8 × 1/2 = 3/16. Adding them (7/8) is a common mistake."
    },
    {
      "q": "Which is a real limit of an n-gram model?",
      "options": [
        "It cannot be built from any text",
        "It uses vectors that are too large",
        "It gives probability zero to word sequences that never appeared in its training text",
        "It can only handle one language at a time"
      ],
      "answer": 2,
      "why": "Counts only exist for sequences that were seen. Unseen but sensible sequences get zero, and a short window cannot see far back."
    },
    {
      "q": "Why do modern language models use sub-word tokens instead of whole words?",
      "options": [
        "Whole words cannot be stored on a computer",
        "A fixed vocabulary of pieces can still read rare or new words by splitting them",
        "Sub-words always make the text shorter than characters would",
        "Sub-words remove the need for embeddings"
      ],
      "answer": 1,
      "why": "Splitting into known pieces avoids unknown words with a manageable vocabulary. Embeddings are still needed afterwards, so the last option is wrong."
    },
    {
      "q": "In the corpus low ×5, lower ×2, newest ×6, widest ×3, how many times does the pair (e, s) occur?",
      "options": [
        "6",
        "11",
        "15",
        "9"
      ],
      "answer": 3,
      "why": "\"es\" appears in newest (6 times) and widest (3 times), so 6 + 3 = 9. Counting only newest gives 6."
    },
    {
      "q": "A BPE tokenizer starts with 30 symbols and learns 100 merges. How many symbols does its vocabulary have?",
      "options": [
        "100",
        "3000",
        "130",
        "70"
      ],
      "answer": 2,
      "why": "Every merge adds exactly one new symbol and keeps the old ones, so the vocabulary grows from 30 to 30 + 100 = 130."
    },
    {
      "q": "What is the cosine similarity of the vectors (3, 4) and (4, 3)?",
      "options": [
        "0.96",
        "24",
        "1.00",
        "0.50"
      ],
      "answer": 0,
      "why": "The dot product is 3×4 + 4×3 = 24 and both lengths are 5, so 24 / 25 = 0.96. The value 24 is the dot product before dividing by the lengths."
    },
    {
      "q": "In a 2-D embedding king = (5, 2), man = (2, 1) and woman = (2, 3). Where does king − man + woman land?",
      "options": [
        "(9, 6)",
        "(5, 4)",
        "(1, −2)",
        "(3, 1)"
      ],
      "answer": 1,
      "why": "(5 − 2 + 2, 2 − 1 + 3) = (5, 4). The point (9, 6) comes from adding all three vectors."
    },
    {
      "q": "A student finds that in a set of embeddings trained on web text, a job title sits closer to \"man\" than to \"woman\". What is the best conclusion?",
      "options": [
        "The embedding has discovered a fact about who is suited to the job",
        "The cosine formula is broken",
        "Embeddings can copy the stereotypes in their training text, so they should be checked for bias",
        "Larger vectors would remove the effect automatically"
      ],
      "answer": 2,
      "why": "Embeddings reflect patterns in the data they learned from, including unfair ones. Bigger vectors do not remove them, and the result is not a fact about people."
    }
  ]
}
```

## How Week 6 is assessed

**Your lab.** The portal marks the Week 6 lab against the rubric in the table above; your instructor announces due dates and weights.

**Across the course.** Laboratories and knowledge checks run through the term, with exams in Weeks 5, 10, 15 and 20 and a capstone. Your instructor announces the component weights in the syllabus. The Midterm in Week 10 is cumulative for Weeks 6–10, so BPE merges and cosine similarity can return as calculations.

**Knowledge check.** The graded weekly knowledge check is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. Why does a bigram model give probability zero to some sensible sentences?
2. What does BPE merge, and why does that help with a word the model has never seen?
3. What does it mean for two word vectors to have cosine similarity close to 1?

**Homework / self-study**
- Finish any unfinished lab exercises and the reflection.
- Re-do the BPE merges for your own six-word corpus by hand and check against your code.
- Preview Week 7: read about why a model that reads one word at a time forgets the beginning of a long sentence.
