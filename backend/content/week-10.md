> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 10 — Midterm Exam

**Purpose:** Prepare for the Midterm by ==reviewing Weeks 6–9 and practising the calculations== that can appear, with no new concepts this week.

**Term:** Midterm (Weeks 6–10) · **Month:** 3 · **Time:** about 30 minutes for the review, then your own study time

```viz
{
  "type": "hook",
  "title": "Four weeks in four moves",
  "caption": "Each scene is one idea from Weeks 6 to 9 in a few seconds: split text into tokens, let tokens look at each other, train by predicting the next token, then prompt. The numbers shown are illustrative, made up for the animation.",
  "scenes": [
    { "name": "Tokens (Week 6)", "kind": "tokens", "outputLabel": "An example split into sub-words", "prompt": "unbelievably", "tokens": ["un", "believ", "ably"] },
    { "name": "Attention (Weeks 7–8)", "kind": "bars", "outputLabel": "Illustrative attention weights from “sat”", "prompt": "The cat sat on the mat", "bars": [ { "label": "cat", "value": 0.55 }, { "label": "The", "value": 0.2 }, { "label": "sat", "value": 0.15 }, { "label": "on", "value": 0.1 } ] },
    { "name": "Training (Week 8)", "kind": "loss", "outputLabel": "Loss while predicting the next token", "prompt": "Show the model text and score its guess for each next token" },
    { "name": "Prompting (Week 9)", "kind": "text", "outputLabel": "Model reply (illustrative)", "prompt": "3 pens cost ₱45. How much do 7 pens cost? Think step by step.", "output": "1 pen costs 45 ÷ 3 = 15. So 7 pens cost 7 × 15 = ₱105." }
  ]
}
```

## By the end, you can…

1. ==Compute by hand== a BPE merge, a cosine similarity and a bigram probability (Week 6).
2. ==Compute scaled dot-product attention== for a small example, apply a causal mask and evaluate a sinusoidal positional-encoding value (Weeks 7–8).
3. ==Explain the parts of a Transformer block== and count the parameters in its attention projections (Week 8).
4. ==Choose the right model family== (BERT, GPT, T5, mixture-of-experts) and ==apply the Chinchilla rule== (Week 9).
5. ==Pick a prompting technique== for a problem and explain prompt injection (Week 9).

The Midterm is cumulative for the term, so it covers Weeks 6 to 9. Your instructor announces the date, room and format. Read each review section, use the figure under it, make your study plan, then take the quiz. This week introduces no new concepts, and each new term is a reminder of an old one. Terms with a dotted underline open a short definition when you select them.

## What the Midterm covers {rail=Map}

{lede} Weeks 6–9 form one story: ==text becomes tokens, tokens become vectors, attention mixes the vectors, the Transformer stacks the idea, and prompts steer the result==. Knowing which week an idea comes from helps you find it in your notes.

Test yourself: place each idea in the week that taught it.

```viz
{
  "type": "sorter",
  "title": "Which week taught it?",
  "intro": "Put each idea in the week where you met it.",
  "bins": [
    { "id": "w6", "label": "Week 6: Tokens and embeddings" },
    { "id": "w7", "label": "Week 7: Attention" },
    { "id": "w8", "label": "Week 8: The Transformer" },
    { "id": "w9", "label": "Week 9: LLM families and prompting" }
  ],
  "cards": [
    { "name": "Byte-pair encoding merges", "answer": "w6", "why": "BPE builds a sub-word vocabulary by merging the most frequent pair of symbols. It is part of tokenization in Week 6." },
    { "name": "Cosine similarity of word vectors", "answer": "w6", "why": "Embeddings are compared by the angle between vectors. This belongs to Week 6." },
    { "name": "Bigram language model", "answer": "w6", "why": "Counting which word follows which is the n-gram stage in the history of language models, in Week 6." },
    { "name": "softmax(QKᵀ / √d_k) V", "answer": "w7", "why": "Scaled dot-product attention was the core of Week 7." },
    { "name": "Why RNNs struggle with long sequences", "answer": "w7", "why": "The recurrent bottleneck, and why attention replaced it, is Week 7." },
    { "name": "Soft versus hard attention", "answer": "w7", "why": "Soft attention uses weights over all tokens and can be trained with gradient descent. This is Week 7." },
    { "name": "Sinusoidal positional encoding", "answer": "w8", "why": "Attention alone ignores order, so Week 8 adds position information with sine and cosine waves." },
    { "name": "Causal mask", "answer": "w8", "why": "The mask that hides future tokens during next-token training is part of the Transformer in Week 8." },
    { "name": "Multi-head attention and the output projection", "answer": "w8", "why": "Several attention heads run in parallel and are concatenated. This is the Transformer block in Week 8." },
    { "name": "Encoder-only versus decoder-only", "answer": "w9", "why": "BERT, GPT and T5 are the three families of Week 9." },
    { "name": "About 20 tokens per parameter", "answer": "w9", "why": "The Chinchilla rule of thumb for compute-optimal training is from Week 9." },
    { "name": "Few-shot and chain-of-thought prompts", "answer": "w9", "why": "Prompt engineering techniques are from Week 9." }
  ]
}
```

If you placed three or more cards wrongly, start your review with the week of those cards.

## Review: tokens and embeddings (Week 6) {rail=Week 6}

{lede} A model never sees letters or words; it sees [[tokens|The pieces a text is split into before a model reads it. A token can be a word, part of a word or a single character.]]. ==BPE builds a vocabulary of sub-word pieces by repeatedly merging the most frequent pair== of neighbouring symbols.

### Calculation: one BPE merge

Take a small corpus with word counts: hug (10), pug (5), pun (12), bun (4), hugs (5). Count every pair of neighbours, weighted by word count. Then ug appears 10 + 5 + 5 = 20 times (hug, pug, hugs), pu 5 + 12 = 17, un 12 + 4 = 16, hu 10 + 5 = 15. So the first merge is **u + g → ug**. Slide the merge counter in the figure and try the word “bugs”.

```viz
{
  "type": "bpe",
  "title": "Learn merges and tokenize a new word",
  "corpus": [ ["hug", 10], ["pug", 5], ["pun", 12], ["bun", 4], ["hugs", 5] ],
  "maxMerges": 6,
  "tryWord": "bugs",
  "note": "The figure also adds an end-of-word marker, so you may see it in the pieces. The first merge is still u + g."
}
```

Notice that the new word “bugs” was never in the corpus, but it can still be written with pieces learned from other words. ==Sub-words let a fixed vocabulary cover words it has never seen.==

### Embeddings and similarity

An [[embedding|A list of numbers that represents a token or word, placed so that similar meanings are close together.]] turns a token into a vector. You compare vectors with [[cosine similarity|A score from -1 to 1 for how closely two vectors point in the same direction: cos = (a·b) / (|a| |b|).]]. For a = (3, 4) and b = (4, 3): a·b = 12 + 12 = 24 and |a| = |b| = 5, so cos = 24 / 25 = **0.96**, which means almost the same direction.

The classic analogy is king − man + woman ≈ queen. Select a point to see its nearest neighbours.

```viz
{
  "type": "scatter",
  "title": "A tiny embedding map",
  "metric": "cosine",
  "points": [
    { "label": "man", "x": 1, "y": 1, "group": "people" },
    { "label": "woman", "x": 1, "y": 3, "group": "people" },
    { "label": "king", "x": 4, "y": 1, "group": "royalty" },
    { "label": "queen", "x": 4, "y": 3, "group": "royalty" },
    { "label": "apple", "x": 0.5, "y": 5, "group": "fruit" },
    { "label": "paris", "x": 5, "y": 0.5, "group": "places" },
    { "label": "france", "x": 6, "y": 1.5, "group": "places" }
  ],
  "analogies": [ { "a": "king", "b": "man", "c": "woman", "expect": "queen" } ],
  "note": "The coordinates are illustrative, authored for teaching. Real embeddings have hundreds of dimensions, and analogies in real models are only approximate and can reflect biases in the training text."
}
```

Notice the analogy works here because the “royal” offset is the same for both pairs. Real embeddings are messier, and they can carry biases from the text they were trained on.

## Review: attention and the Transformer (Weeks 7–8) {rail=Weeks 7–8}

{lede} ==Attention lets every token look at every other token and take a weighted average of what it finds==, so far-apart words connect in one step. The Transformer wraps attention in a repeatable block.

### Calculation: scaled dot-product attention

[[Scaled dot-product attention|The attention score between a query and each key is the dot product divided by √d_k. Softmax turns the scores into weights, and the output is the weighted sum of the values.]] works in four moves: score, scale, softmax, mix. Example: query q = (1, 1) and three keys k1 = (1, 0), k2 = (0, 1), k3 = (1, 1). The key size is d_k = 2.

1. Scores q·k: 1, 1, 2.
2. Scale by √2 ≈ 1.414: 0.71, 0.71, 1.41.
3. Softmax: e^0.71 = 2.03, 2.03 and e^1.41 = 4.11. Their sum is 8.17, so the weights are 0.25, 0.25, 0.50.
4. Output = 0.25·v1 + 0.25·v2 + 0.50·v3.

```viz
{
  "type": "heatmap",
  "title": "The worked example step by step",
  "corner": "step ↓ key →",
  "rows": ["Score q·k", "Scaled (÷ √2)", "Weight (softmax)"],
  "cols": ["k1 = (1,0)", "k2 = (0,1)", "k3 = (1,1)"],
  "showValues": true,
  "rowsSumToOne": false,
  "W": [ [1, 1, 2], [0.71, 0.71, 1.41], [0.25, 0.25, 0.5] ],
  "note": "Values rounded to two decimals. Without the scaling step the weights would be 0.21, 0.21 and 0.58."
}
```

Notice that the third key wins, because it matches the query best, but without the √d_k scaling it would win by more. ==The scaling keeps the scores small so the softmax does not become a nearly one-hot spike with tiny gradients==; the effect grows with d_k.

### The Transformer block and order

Attention alone ignores word order, so the model adds [[positional encoding|A vector that tells the model where in the sequence a token sits, added to the token embedding.]]. In the sinusoidal version, PE(pos, 2i) = sin(pos / 10000^(2i/d)) and PE(pos, 2i+1) = cos(pos / 10000^(2i/d)). For position 2 and dimensions 0 and 1 (so i = 0 and the divisor is 1): sin(2) = **0.91** and cos(2) = **−0.42**.

```viz
{
  "type": "posenc",
  "title": "Sinusoidal positional encoding",
  "dModel": 16,
  "positions": 24
}
```

Select a row and read the first two columns: they are the fast-oscillating dimensions, so position 2 shows 0.91 and −0.42 there. Columns on the right change slowly. Together they give every position a unique pattern.

Now the block itself. Step through it for a five-token input. The sizes are an example with d_model = 64 and 8 heads.

```viz
{
  "type": "pipeline",
  "title": "One Transformer block",
  "intro": "Step through the block. The shapes use 5 tokens, d_model = 64 and 8 heads (so each head has 8 dimensions).",
  "nodes": [
    { "id": "emb", "label": "Embeddings + position", "sub": "5 × 64" },
    { "id": "attn", "label": "Multi-head self-attention", "sub": "8 heads" },
    { "id": "add1", "label": "Add & layer norm", "sub": "residual" },
    { "id": "ffn", "label": "Feed-forward", "sub": "per token" },
    { "id": "add2", "label": "Add & layer norm", "sub": "residual" },
    { "id": "out", "label": "Next-token scores", "sub": "after the last block" }
  ],
  "steps": [
    { "title": "Inputs", "body": "Each token embedding is added to its positional encoding. The block receives a matrix with one row per token.", "active": ["emb"], "example": "Shape 5 × 64." },
    { "title": "Multi-head self-attention", "body": "Each head projects the input to queries, keys and values of size 8 and computes scaled dot-product attention. A causal mask hides later tokens in a decoder. The heads are concatenated and mixed by an output projection.", "active": ["emb", "attn"], "example": "Per head: scores 5 × 5. After concatenating 8 heads: 5 × 64. Projections: W_Q, W_K, W_V, W_O, each 64 × 64, so 4 × 64² = 16,384 weights (ignoring biases)." },
    { "title": "Add and normalise", "body": "The attention result is added back to the input (a residual connection) and normalised. Residual paths help gradients flow in deep stacks.", "active": ["attn", "add1"], "example": "Shape stays 5 × 64." },
    { "title": "Feed-forward network", "body": "The same small two-layer network processes every token separately. It usually expands the vector and then shrinks it back.", "active": ["add1", "ffn"], "example": "For example 64 → 256 → 64." },
    { "title": "Add, normalise, repeat", "body": "Another residual and layer norm finish the block. Blocks are stacked many times. After the last one, a final layer turns each vector into scores over the vocabulary.", "active": ["ffn", "add2", "out"], "example": "The score at the last position is used to pick the next token." }
  ]
}
```

### Causal mask and next-token training

A decoder trains by predicting each next token, with targets shifted by one. To stop token 3 from peeking at token 4, a [[causal mask|A triangular mask that sets the attention to later tokens to zero, so each token can only attend to itself and earlier tokens.]] is applied. For 5 tokens the mask has 1 + 2 + 3 + 4 + 5 = **15** visible entries out of 25. Click through the tabs to see a 4-token mask and what the weights look like after it.

```viz
{
  "type": "heatmap",
  "title": "Causal mask and masked attention",
  "corner": "query ↓ key →",
  "rows": ["The", "cat", "sat", "down"],
  "cols": ["The", "cat", "sat", "down"],
  "showValues": true,
  "rowsSumToOne": false,
  "tabs": [
    { "name": "Mask (1 = visible)", "caption": "Row i can see columns 1 to i only.", "W": [ [1,0,0,0], [1,1,0,0], [1,1,1,0], [1,1,1,1] ] },
    { "name": "Weights after masking", "caption": "Hidden entries get weight 0, and each row still sums to 1.", "W": [ [1,0,0,0], [0.4,0.6,0,0], [0.2,0.3,0.5,0], [0.1,0.2,0.3,0.4] ] }
  ],
  "note": "The weights are illustrative, authored for teaching, not from a trained model."
}
```

## Review: families, scaling and prompting (Week 9) {rail=Week 9}

{lede} ==Encoder-only models (BERT) understand, decoder-only models (GPT, Llama) generate, and encoder-decoder models (T5) turn one text into another.== Mixture-of-experts adds a router so each token uses only a few experts.

### Calculation: Chinchilla

Two approximations: compute C ≈ 6·N·D, and the compute-optimal data D ≈ 20·N (Hoffmann et al., 2022). Therefore C = 120·N² and N = √(C / 120). For C = 4.8 × 10²²: N = √(4 × 10²⁰) = 2 × 10¹⁰, so 20 billion parameters and D = 400 billion tokens. Check: 6 × 2×10¹⁰ × 4×10¹¹ = 4.8×10²².

```viz
{
  "type": "calc",
  "title": "Compute-optimal size for a budget",
  "kind": "scaling",
  "intro": "Set the slider near 10^22.7 and read N and D. Then work the example above by hand."
}
```

Notice that doubling the model size means four times the compute, because N depends on the square root of C. Also keep the emergent-abilities caveat: some papers report abilities that appear suddenly with size, and later work argues part of that depends on the metric used.

### Prompting in one paragraph

Zero-shot is instructions only; few-shot adds worked examples (good for fixing a format); a role sets tone; chain-of-thought asks for the steps (good for multi-step problems). When a program reads the reply, ask for JSON and validate it in code. Text from outside, such as an email, may contain a prompt injection, so treat it as untrusted data and never as instructions. Top-p and temperature control how much variety the output has.

## Key takeaways {rail=Takeaway}

- ==Know the formulas and be able to run them on small numbers==: BPE pair counts, cosine similarity, softmax(QKᵀ/√d_k)V, sin/cos positional encoding, causal-mask counts, 4·d² attention weights, and N = √(C/120).
- ==Know why each design exists==: sub-words for unseen words, attention for long-range links, √d_k to avoid saturation, position encoding because attention ignores order, a causal mask so training cannot peek.
- ==Match the model to the job==: encoder for understanding, decoder for writing, encoder-decoder for text to text.
- ==Match the prompt to the problem== and always check model output yourself.

## Study plan {rail=Study plan}

Work through this list in order. Tick each item only when you can do it without your notes.

1. **Sort first (15 min).** Redo the “Which week taught it?” figure. Note which week caused errors and start there.
2. **Week 6 (30 min).** Redo the BPE merge and the cosine similarity by hand. Explain why sub-words beat whole words. State one limit of a bigram model.
3. **Weeks 7–8 (60 min).** Recompute the attention example with and without scaling. Draw a 5-token causal mask and count the visible entries. Explain every box of the Transformer block and say what a residual connection does.
4. **Positional encoding (10 min).** Compute sin(2) and cos(2) and say why different dimensions use different frequencies.
5. **Week 9 (30 min).** Redo the Chinchilla calculation for a new budget. Match BERT, GPT and T5 to a job each. Write one prompt for each technique and one example of prompt injection.
6. **Practice (as long as you need).** Use [Mock Exam Prep](/mock-exam) for timed practice modules. They have unlimited attempts, and answers unlock after you submit. Then take the quiz below.
7. **Last day.** Review your mistakes only. Sleep. Do not start new topics.

Bring what your instructor tells you to bring. Your instructor announces the date, room and format of the Midterm, so check the portal for them.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Twelve questions across Weeks 6–9, with an explanation after each one. Work the calculations on paper first.

```quiz
{
  "id": "week-10-check",
  "title": "Week 10 quiz: Midterm review (Weeks 6–9)",
  "passMark": 70,
  "questions": [
    {
      "q": "A corpus has these word counts: hug 10, pug 5, pun 12, bun 4, hugs 5. Ignoring end-of-word markers, which pair does BPE merge first?",
      "options": [
        "pu (17)",
        "un (16)",
        "ug (20)",
        "hu (15)"
      ],
      "answer": 2,
      "why": "ug appears in hug (10), pug (5) and hugs (5): 20 times. The next best pair is pu with 5 + 12 = 17."
    },
    {
      "q": "Two word vectors are a = (3, 4) and b = (4, 3). What is their cosine similarity?",
      "options": [
        "0.25",
        "0.75",
        "1.00",
        "0.96"
      ],
      "answer": 3,
      "why": "a·b = 3×4 + 4×3 = 24 and |a| = |b| = 5, so cos = 24/25 = 0.96. They are not identical, so it is not 1."
    },
    {
      "q": "Why do modern language models use sub-word tokens rather than whole words?",
      "options": [
        "A fixed vocabulary can still write words it never saw, by combining known pieces",
        "Sub-words make the model faster than characters in every case",
        "Whole words cannot be turned into vectors",
        "Sub-words remove the need for embeddings"
      ],
      "answer": 0,
      "why": "Splitting into pieces lets a fixed-size vocabulary cover new words. Whole words can be embedded, but unseen ones would have no token, and sub-words still use embeddings."
    },
    {
      "q": "What is the main reason attention replaced RNNs for long sequences?",
      "options": [
        "Attention uses fewer parameters than any RNN",
        "Attention can connect two distant tokens in one step, instead of passing information through every step in between",
        "Attention removes the need for training data",
        "Attention works only on short sentences"
      ],
      "answer": 1,
      "why": "In an RNN information must travel through every step, so far-apart words are hard to link. Attention links any pair directly and can be computed in parallel."
    },
    {
      "q": "Query q = (1, 1), keys k1 = (1, 0), k2 = (0, 1), k3 = (1, 1), and d_k = 2. After scaling by √d_k and softmax, what weight does k3 receive?",
      "options": [
        "About 0.21",
        "About 0.33",
        "About 0.50",
        "About 0.58"
      ],
      "answer": 2,
      "why": "Scores 1, 1, 2 become 0.71, 0.71, 1.41 after dividing by √2. Softmax gives 0.25, 0.25, 0.50. The value 0.58 is what you get without scaling, and 0.21 is the weight k1 gets without scaling."
    },
    {
      "q": "What problem does dividing the dot products by √d_k help to avoid?",
      "options": [
        "Dot products being negative",
        "Tokens attending to themselves",
        "Forgetting the order of words",
        "Large scores that push the softmax to a nearly one-hot output with very small gradients"
      ],
      "answer": 3,
      "why": "As d_k grows, dot products tend to grow, which saturates the softmax and slows learning. Order is handled by positional encoding, and self-attention to the token itself is allowed."
    },
    {
      "q": "In sinusoidal positional encoding, what is PE(pos = 2, dimension 0), where PE(pos, 2i) = sin(pos / 10000^(2i/d))?",
      "options": [
        "About 0.91",
        "About −0.42",
        "About 0.84",
        "Exactly 0"
      ],
      "answer": 0,
      "why": "For dimension 0 the divisor is 10000⁰ = 1, so the value is sin(2) = 0.909. cos(2) = −0.42 would be dimension 1, and sin(1) = 0.84 would be position 1."
    },
    {
      "q": "A decoder processes 5 tokens with a causal mask. How many entries of the 5 × 5 attention matrix are visible (not masked)?",
      "options": [
        "10",
        "15",
        "20",
        "25"
      ],
      "answer": 1,
      "why": "Row i sees i entries, so 1 + 2 + 3 + 4 + 5 = 15. All 25 would mean no mask. 10 forgets the diagonal, where each token sees itself."
    },
    {
      "q": "A multi-head attention layer has d_model = 512 and uses four 512 × 512 projections (W_Q, W_K, W_V, W_O), ignoring biases. How many weights is that?",
      "options": [
        "262,144",
        "524,288",
        "1,048,576",
        "2,097,152"
      ],
      "answer": 2,
      "why": "512 × 512 = 262,144 for one projection, and four of them give 1,048,576. The number of heads does not change the total, because each head uses a slice of the same matrices."
    },
    {
      "q": "You want to label thousands of product reviews as positive or negative. Which family is the most natural choice?",
      "options": [
        "Encoder-decoder, because the output is a second text",
        "Mixture-of-experts, because it is a separate family",
        "Decoder-only, because every task needs free-form writing",
        "Encoder-only, because it reads the whole review in both directions"
      ],
      "answer": 3,
      "why": "Understanding a full input is the encoder's job (for example BERT with a classifier on top). Mixture-of-experts is a layer design used inside other families, not a fourth family."
    },
    {
      "q": "A budget is C = 4.8 × 10²² FLOPs. Using C ≈ 6·N·D and D = 20·N, what is the compute-optimal N?",
      "options": [
        "About 20 billion parameters",
        "About 10 billion parameters",
        "About 40 billion parameters",
        "About 200 billion parameters"
      ],
      "answer": 0,
      "why": "C = 120·N², so N = √(4.8×10²² / 120) = √(4×10²⁰) = 2×10¹⁰, which is 20 billion. Then D = 400 billion tokens."
    },
    {
      "q": "Your program must read a model's reply, and the reply sometimes has extra words around the data. What is the best practice?",
      "options": [
        "Raise the temperature so the format varies less",
        "Ask for JSON with exact keys, then parse and validate the reply in code and retry if it fails",
        "Trust the model, because it follows formats perfectly",
        "Add a role such as “You are a pirate”"
      ],
      "answer": 1,
      "why": "Models can break a format, so validation in code is needed. Higher temperature makes output more random, and a role changes tone, not reliability."
    }
  ]
}
```

## How Week 10 is assessed

The Midterm examination is in Week 10 and covers the content of Weeks 6–9. Your instructor announces the date, room, format and weights. The practice quiz above is formative and unlimited.

## Exit ticket and homework

Answer these before the Midterm:
1. Which topic from Weeks 6–9 do you feel least sure about?
2. Which calculation would you most like to practise again?
3. Write one question you would ask your instructor.

**Homework / self-study**
- Complete the study plan above and note anything you still cannot do.
- Do at least one practice module in [Mock Exam Prep](/mock-exam).
- Rest well before the exam. After the Midterm, Week 11 starts multimodal AI (images with text).
