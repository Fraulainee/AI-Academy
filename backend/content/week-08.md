> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 8 — The Transformer & Autoregressive Training

**Purpose:** Put attention together into a ==Transformer block==, add the order information it lacks, and train it to ==predict the next token==.

**Term:** Midterm (Weeks 6–10) · **Month:** 2 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a Transformer learn to continue text",
  "caption": "A Transformer reads tokens plus their positions and learns to score the next token at every position at once. These probabilities and the loss curve are illustrative, not from a trained model.",
  "scenes": [
    { "name": "Add positions", "kind": "tokens", "outputLabel": "Token plus position (illustrative)", "prompt": "The cat sat", "tokens": ["The + position 0", "cat + position 1", "sat + position 2"] },
    { "name": "Predict next", "kind": "bars", "outputLabel": "Next-token probabilities (made up)", "prompt": "Attention is all you", "bars": [ { "label": "need", "value": 0.78 }, { "label": "want", "value": 0.1 }, { "label": "see", "value": 0.07 }, { "label": "have", "value": 0.05 } ] },
    { "name": "Shift by one", "kind": "text", "outputLabel": "Targets are the input shifted by one", "prompt": "Input: the cat sat on", "output": "Target: cat sat on the. Each position learns to predict the token that comes after it, all positions at the same time." },
    { "name": "Training", "kind": "loss", "outputLabel": "Training loss", "prompt": "Train a tiny Transformer: the loss falls as it learns the pattern" }
  ]
}
```

## By the end, you can…

1. ==Explain why a Transformer needs positional encoding== and compute a sinusoidal encoding value.
2. ==Describe multi-head self-attention==: heads, concatenation, the output projection, and the tensor shapes.
3. ==Name the parts of a Transformer block== in order and say what each does.
4. ==Explain autoregressive training==: next-token prediction, targets shifted by one, the causal mask and teacher forcing.
5. Implement a causal multi-head attention layer in PyTorch and train a tiny next-token model whose loss falls.

Assessed in the Week 8 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

Quick recap from Week 7: attention takes queries, keys and values and returns a weighted average of the values, with weights softmax(QKᵀ/√d_k). This week we use that as a building block and do not derive it again.

## Positional encoding: telling attention the order {rail=Positions}

{lede} Attention treats its input like a bag: ==if you shuffle the tokens, it returns the same results, just shuffled==. But word order matters: "dog bites man" is not "man bites dog". A [[positional encoding|A vector added to each token's embedding that tells the model where in the sequence the token sits.]] fixes this by adding position information to every token before the first layer.

The original Transformer paper (Vaswani et al., 2017) uses fixed sine and cosine waves. For position pos and a model width of d_model dimensions, the pair of dimensions 2i and 2i+1 use

PE(pos, 2i) = sin(pos / 10000^(2i/d_model))  and  PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)).

Work one example with d_model = 4. Position 0 gives (0, 1, 0, 1), because sin 0 = 0 and cos 0 = 1. Position 1 has two pairs. The first pair uses the angle 1, giving sin 1 = 0.841 and cos 1 = 0.540. The second pair uses the angle 1/10000^(2/4) = 1/100 = 0.01, giving sin = 0.010 and cos = 1.000 (more precisely 0.99995). So position 1 is (0.841, 0.540, 0.010, 1.000).

In the figure, each row is a position and each column a dimension. Slide through the positions and notice the pattern.

```viz
{
  "type": "posenc",
  "title": "Sinusoidal positional encoding",
  "dModel": 16,
  "positions": 24
}
```

Early dimensions flip quickly from position to position, like the second hand of a clock, while later dimensions change slowly, like the hour hand. Together they give each position its own pattern. In the paper the wavelengths form a geometric progression from 2π up to 10000 × 2π. A pleasant property is that the encoding for a position a fixed distance away can be written as a linear function of the current one, which may make relative positions easy to learn. The encoding is added to the token embedding, so the model's input is embedding + position, with the same shape as the embedding. Many later models learn their position vectors instead; the principle is the same.

## Multi-head self-attention {rail=Multi-head}

{lede} One attention pattern per layer would be limiting. ==Multi-head attention runs several attention patterns side by side, each with its own query, key and value projections==, then joins the results. One head might watch the previous word, another the subject of the sentence.

[[Multi-head attention|Several attention operations (heads) run in parallel on different learned projections of the same input, and their outputs are concatenated and mixed by a final matrix.]] works in four steps. Use d_model = 512 and 8 heads, as in the base model of the original paper.

1. Project the input into queries, keys and values with matrices W_Q, W_K, W_V, each 512 × 512 in total.
2. Split the 512 dimensions into 8 heads of d_head = 512 / 8 = 64 dimensions. Each head does its own scaled dot-product attention. The shapes become (batch, heads, sequence, d_head).
3. Concatenate the 8 outputs back into 512 dimensions.
4. Multiply by an output matrix W_O (512 × 512) so the heads can mix their findings.

Without biases the layer has 4 × 512 × 512 = 1,048,576 weights. Splitting into heads costs no extra parameters: 8 heads of 64 do about the same work as one head of 512.

Compare the two heads below for the sentence "The cat sat on". Each row is a query token and each row sums to 1, as softmax requires. The matrix is lower-triangular because this is a decoder: a token may not look ahead.

```viz
{
  "type": "heatmap",
  "title": "Two heads, two attention patterns",
  "rows": ["The", "cat", "sat", "on"],
  "cols": ["The", "cat", "sat", "on"],
  "corner": "query ↓ key →",
  "showValues": true,
  "rowsSumToOne": true,
  "tabs": [
    { "name": "Head A", "caption": "A previous-token head: each word mostly looks at the word just before it.", "W": [ [1, 0, 0, 0], [0.8, 0.2, 0, 0], [0, 0.8, 0.2, 0], [0, 0, 0.8, 0.2] ] },
    { "name": "Head B", "caption": "A content head: each word looks mostly at itself and a little at the start.", "W": [ [1, 0, 0, 0], [0.1, 0.9, 0, 0], [0.1, 0.3, 0.6, 0], [0.1, 0.1, 0.7, 0.1] ] }
  ],
  "note": "These attention weights are illustrative, authored for teaching and not taken from a trained model. Real heads are usually messier."
}
```

Switch between the tabs. ==Different heads can learn different relations between the same words==, and the output projection W_O combines them.

## The Transformer block {rail=The block}

{lede} A Transformer is a ==stack of identical blocks==. Each block has two sub-layers, attention and a small feed-forward network, and each sub-layer is wrapped by a skip connection and a normalisation step.

The parts, in order:
- [[Self-attention|Attention where the queries, keys and values all come from the same sequence, so every token looks at the others in its own text.]] mixes information between tokens.
- A [[residual connection|A shortcut that adds a layer's input to its output, x + F(x). It keeps the signal and gradient flowing through many layers.]] adds the sub-layer's input to its output, as in ResNet from Week 4.
- [[Layer normalisation|Rescaling each token's vector to have mean 0 and variance 1 across its own dimensions (then a learned scale and shift), which keeps training stable.]] keeps the numbers in a stable range.
- The [[feed-forward network|A small two-layer network applied to each token separately: expand, apply a non-linearity, shrink back.]] works on each token separately. In the original paper it expands 512 to 2048 and shrinks back to 512.

In the original design the block is: x → LayerNorm(x + MultiHeadAttention(x)) → LayerNorm(· + FeedForward(·)). Many modern models normalise before each sub-layer instead, but the ingredients are the same. Step through one block below.

```viz
{
  "type": "pipeline",
  "title": "One Transformer block, step by step",
  "intro": "Press next. The example is one sequence of 4 tokens with d_model = 512 and 8 heads; the shape at each step is shown.",
  "nodes": [
    { "id": "emb", "label": "Embeddings + position", "sub": "token → vector" },
    { "id": "mha", "label": "Multi-head attention", "sub": "mix tokens" },
    { "id": "n1", "label": "Add & LayerNorm", "sub": "x + attention" },
    { "id": "ffn", "label": "Feed-forward", "sub": "per token" },
    { "id": "n2", "label": "Add & LayerNorm", "sub": "x + feed-forward" },
    { "id": "out", "label": "Next block / output", "sub": "stack N times" }
  ],
  "steps": [
    { "title": "Input: embeddings plus positions", "body": "Each token ID becomes an embedding and the positional encoding is added. The result is one row per token.", "active": ["emb"], "example": "Shape (4, 512): 4 tokens, 512 dimensions each" },
    { "title": "Multi-head attention", "body": "The input is projected to queries, keys and values and split into 8 heads of 64 dimensions. Each head attends, then the heads are joined and mixed by W_O.", "active": ["emb", "mha"], "example": "Per head: queries (4, 64), scores (4, 4) with the causal mask in a decoder; joined output back to (4, 512)" },
    { "title": "Add and normalise", "body": "The attention output is added to the block's input (the residual connection) and each token vector is layer-normalised.", "active": ["mha", "n1"], "example": "x + attention(x), still (4, 512)" },
    { "title": "Feed-forward network", "body": "Each token is passed through the same two-layer network, expanding to a wider hidden size and then shrinking back. No mixing between tokens happens here.", "active": ["n1", "ffn"], "example": "(4, 512) → (4, 2048) → (4, 512)" },
    { "title": "Add and normalise again", "body": "A second residual connection and layer normalisation close the block. The output has the same shape as the input, so blocks can be stacked.", "active": ["ffn", "n2"], "example": "Output (4, 512)" },
    { "title": "Stack the blocks", "body": "The output feeds the next identical block. After the last block, a final linear layer turns each token vector into a score for every token in the vocabulary.", "active": ["n2", "out"], "example": "The original base model stacked 6 blocks; a final layer gives (4, vocabulary size) scores" }
  ]
}
```

Notice that the shape never changes inside the block: ==(tokens, d_model) goes in and (tokens, d_model) comes out==. That is what makes stacking dozens of blocks possible. Attention is the only place tokens exchange information.

## Autoregressive training and the causal mask {rail=Training}

{lede} A text-generating Transformer is trained with one simple goal: ==given the tokens so far, predict the next one==. Because the answer for every position is just the next token in the text, no human labels are needed.

A model that generates text one token at a time is called [[autoregressive|A model that produces a sequence one item at a time, feeding each new item back in as input for the next step.]]. To train it, take a sentence, use it as the input, and use the same sentence shifted left by one token as the target. For "the cat sat on" the input tokens are the, cat, sat, on, and the targets are cat, sat, on, the (the next token in the text). The loss is the [[cross-entropy loss|The average of −ln(p), where p is the probability the model gave to the correct token. It is small when the model is confident and right.]]. If the model gives the correct next token a probability of 0.25, the loss is −ln 0.25 = 1.386. An untrained model that spreads probability evenly over 50 tokens has loss ln 50 = 3.91, a handy sanity check at step 0.

Feeding the true previous tokens during training, rather than the model's own guesses, is called [[teacher forcing|Training with the correct previous tokens as input at every position, so all positions can be learned in parallel.]]. It lets one forward pass train every position at once.

There is a trap: during training the whole sentence is visible, so position 2 could simply read token 3, which is its target. The fix is the [[causal mask|A matrix that hides future tokens from attention, so token t can only attend to tokens at positions up to t.]]: before the softmax, the scores for future positions are set to −∞, so their weights are exactly 0.

```viz
{
  "type": "heatmap",
  "title": "The causal mask",
  "rows": ["The", "cat", "sat", "on", "mat"],
  "cols": ["The", "cat", "sat", "on", "mat"],
  "corner": "query ↓ key →",
  "showValues": true,
  "tabs": [
    { "name": "Mask", "caption": "1 means the query can see that key, 0 means it is hidden. Only the lower triangle is visible.", "W": [ [1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 1, 0, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 1] ] },
    { "name": "Weights", "caption": "If all visible scores were equal, softmax would spread weight evenly over the visible tokens (rounded to two decimals).", "W": [ [1, 0, 0, 0, 0], [0.5, 0.5, 0, 0, 0], [0.33, 0.33, 0.33, 0, 0], [0.25, 0.25, 0.25, 0.25, 0], [0.2, 0.2, 0.2, 0.2, 0.2] ] }
  ],
  "note": "An illustration of the mask shape and of equal scores, not real attention weights."
}
```

For a sequence of n tokens, the number of visible cells is n(n + 1)/2, so with 5 tokens 15 are visible and 10 are hidden. At generation time you run the model, take the probabilities for the last position, pick a token (Week 1's temperature controls how), append it and repeat. ==The mask makes training match generation: each position only ever sees its past.==

Not every Transformer is a decoder. Compare the two block types.

```viz
{
  "type": "flow",
  "title": "Encoder block and decoder block",
  "modes": [
    {
      "name": "Encoder block",
      "tagline": "Every token may attend to every other token, left and right. It builds a rich vector for each token of the input.",
      "inputLabel": "Input tokens",
      "modelLabel": "self-attention without a causal mask",
      "outputLabel": "Output: one context-aware vector per token",
      "examples": [
        { "label": "Word meaning", "input": "“I sat on the river bank”", "output": "A vector for “bank” that uses “river” on its left and the whole sentence" },
        { "label": "Classify text", "input": "“The film was wonderful”", "output": "Vectors that a small head turns into the label positive" }
      ],
      "note": "Good for understanding and classifying text. BERT is built from encoder blocks (Week 9)."
    },
    {
      "name": "Decoder block",
      "tagline": "Each token may attend only to itself and earlier tokens, because of the causal mask. It is trained to predict the next token.",
      "inputLabel": "Tokens so far",
      "modelLabel": "masked self-attention (causal mask)",
      "outputLabel": "Output: scores for the next token",
      "examples": [
        { "label": "Continue text", "input": "“The cat sat on”", "output": "Probabilities for the next token, such as “the”" },
        { "label": "Chat or code", "input": "“Write a function that adds two numbers”", "output": "One token at a time, each fed back as new input" }
      ],
      "note": "Good for generating text. GPT-style models are built from decoder blocks (Week 9)."
    }
  ]
}
```

The only structural difference is the mask. Week 9 compares model families built from each.

## Key takeaways {rail=Takeaway}

- Attention ignores order, so a ==positional encoding is added to the embeddings==. The sinusoidal version uses sin and cos waves of different wavelengths; position 1 with d_model = 4 is (0.841, 0.540, 0.010, 1.000).
- ==Multi-head attention runs several attention patterns in parallel== (d_head = d_model / heads), concatenates them and mixes them with W_O. Splitting into heads adds no parameters.
- A block is attention, add and normalise, feed-forward, add and normalise. ==Shapes in equal shapes out==, so blocks can be stacked.
- Autoregressive training uses ==targets shifted by one token and a causal mask==, so every position learns to predict its next token from its past only, all in one pass.

## Lab: build a tiny Transformer and train it {rail=Laboratory}

Implement ==sinusoidal positional encoding and causal multi-head attention==, then train a small next-token model on a repeated string and watch its loss fall. This is GA Lab 3 Part 2. Time: 3 hours.

### Setup

1. Log in to the portal, start JupyterLab, and create a folder `week08` with a notebook `lab3b.ipynb`.
2. Do not install packages and do not use the internet. Everything in this lab uses only NumPy and PyTorch, and no pretrained model is needed, so there are no Hugging Face model IDs this week.
3. The model is tiny, so it runs fast on the CPU. If you use the GPU, remember that it is shared: free memory when you finish, and run `nvidia-smi` if you see an out-of-memory error.

### Step-by-step tasks

1. *Sinusoidal positional encoding in NumPy (20 min).*
```python
import numpy as np
def positional_encoding(n_pos, d_model):
    pos = np.arange(n_pos)[:, None]
    i = np.arange(0, d_model, 2)[None, :]
    angle = pos / (10000 ** (i / d_model))
    pe = np.zeros((n_pos, d_model))
    pe[:, 0::2] = np.sin(angle)
    pe[:, 1::2] = np.cos(angle)
    return pe
pe = positional_encoding(24, 16)
print(pe.shape, pe[0, :4], pe[1, :4].round(4))
```
   *Exercise 1:* work out PE(position 1) for d_model = 4 by hand, then check with `positional_encoding(3, 4).round(4)`. Compare row 1 with the figure above (use d_model = 16 and 24 positions) and describe in two sentences how the columns change from left to right.
2. *Causal multi-head attention in PyTorch (40 min).*
```python
import math, torch, torch.nn as nn
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        if d_model % n_heads:
            raise ValueError("d_model must be divisible by n_heads")
        self.h, self.dh = n_heads, d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)
        self.out = nn.Linear(d_model, d_model)
    def forward(self, x, causal=True):
        B, T, D = x.shape
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        q, k, v = [t.reshape(B, T, self.h, self.dh).transpose(1, 2) for t in (q, k, v)]
        scores = q @ k.transpose(-2, -1) / math.sqrt(self.dh)
        if causal:
            keep = torch.tril(torch.ones(T, T, device=x.device)).bool()
            scores = scores.masked_fill(~keep, float("-inf"))
        w = scores.softmax(dim=-1)
        y = (w @ v).transpose(1, 2).reshape(B, T, D)
        return self.out(y), w
mha = MultiHeadAttention(d_model=32, n_heads=4)
y, w = mha(torch.randn(2, 5, 32))
print(y.shape, w.shape, w.sum(-1)[0, 0], w[0, 0].triu(1).abs().sum())
print(sum(p.numel() for p in mha.parameters()))
```
   *Exercise 2:* write the shape of q, k, v, scores and w at each step in (batch, heads, seq, d_head) form. Then compute the parameter count by formula for d_model = 32 with biases (4 × 32² + 4 × 32) and for d_model = 512, and confirm the first against the printed number.
3. *A Transformer block and a tiny language model (30 min).*
```python
class Block(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.attn = MultiHeadAttention(d, h)
        self.ln1, self.ln2 = nn.LayerNorm(d), nn.LayerNorm(d)
        self.ff = nn.Sequential(nn.Linear(d, 4 * d), nn.GELU(), nn.Linear(4 * d, d))
    def forward(self, x):
        x = self.ln1(x + self.attn(x)[0])
        return self.ln2(x + self.ff(x))
class TinyLM(nn.Module):
    def __init__(self, vocab, d=64, h=4, n_ctx=16):
        super().__init__()
        self.emb = nn.Embedding(vocab, d)
        pe = torch.tensor(positional_encoding(n_ctx, d), dtype=torch.float32)
        self.register_buffer("pe", pe)
        self.block = Block(d, h)
        self.head = nn.Linear(d, vocab)
    def forward(self, idx):
        x = self.emb(idx) + self.pe[: idx.size(1)]
        return self.head(self.block(x))
```
   *Exercise 3:* draw the block as boxes and arrows and label each box with the corresponding line of code. Say where the residual connections are.
4. *Train on a repeated string (40 min).*
```python
text = "the cat sat on the mat. " * 40
chars = sorted(set(text))
stoi = {c: i for i, c in enumerate(chars)}
data = torch.tensor([stoi[c] for c in text])
T = 16
def get_batch(bs=32):
    ix = torch.randint(0, len(data) - T - 1, (bs,))
    x = torch.stack([data[i:i + T] for i in ix])
    y = torch.stack([data[i + 1:i + T + 1] for i in ix])
    return x, y
torch.manual_seed(0)
model = TinyLM(len(chars), n_ctx=T)
opt = torch.optim.Adam(model.parameters(), lr=3e-3)
for step in range(401):
    x, y = get_batch()
    loss = nn.functional.cross_entropy(model(x).reshape(-1, len(chars)), y.reshape(-1))
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 50 == 0:
        print(step, round(loss.item(), 3))
```
   *Exercise 4:* the string has 11 different characters. Compute ln 11 and compare with the loss at step 0. Plot the loss curve if you store the values. Why is the targets tensor `y` the input shifted by one?
5. *Generate and break it (25 min).* First generate from a prompt.
```python
model.eval()
prompt = [stoi[c] for c in "the cat s"]
ids = torch.tensor([prompt])
with torch.no_grad():
    for _ in range(30):
        nxt = model(ids[:, -T:])[:, -1].argmax(-1, keepdim=True)
        ids = torch.cat([ids, nxt], dim=1)
print("".join(chars[i] for i in ids[0]))
```
   *Exercise 5:* now remove the mask by changing `self.attn(x)[0]` to `self.attn(x, causal=False)[0]` in `Block`, rebuild and retrain the model, and compare the loss curve and the generated text. Explain what the model learned to do instead of predicting.
6. *Reflection (15 min).* In a markdown cell answer: (a) why the feed-forward network sees each token separately, (b) what would happen to sequence order if you removed the positional encoding, (c) why the mask is needed in training but is automatic in generation.

### What you should see

- Step 1: shape `(24, 16)`, row 0 starts `[0. 1. 0. 1.]`, row 1 starts `[0.8415 0.5403 0.311 0.9504]`. For d_model = 4, row 1 is `[0.8415 0.5403 0.01 1.]`.
- Step 2: `torch.Size([2, 5, 32]) torch.Size([2, 4, 5, 5])`, then a row of ones, then `tensor(0.)`, and a parameter count of 4224. Formula: 4 × 32² + 4 × 32 = 4096 + 128 = 4224.
- Step 4: the loss at step 0 is near ln 11 = 2.40 (it can be somewhat higher or lower) and falls steadily towards zero because the string repeats exactly. The exact numbers depend on the seed; if it is not low after 400 steps, run more.
- Step 5: the generated text usually continues the pattern "the cat sat on the mat. ". Without the mask, the loss usually drops almost immediately but the generated text is poor, because the model reads the answer from the next position instead of learning to predict it.

### Common mistakes

- Using `.view` after `.transpose`; PyTorch needs `.reshape` (or `.contiguous()`), as in the code above.
- Forgetting the mask, or masking after the softmax. The scores must be set to −∞ before the softmax so the weights become exactly 0.
- Dividing by the wrong size. Scale by the square root of the head size `self.dh`, not of `d_model`.
- Making the input and target the same tensor. The target must be shifted by one token.
- Feeding a sequence longer than the positional table (`n_ctx`). Cut the prompt to the last `T` tokens as in Step 5.

### Go further: UvA notebook

For a longer, more complete implementation, work through Tutorial 6, Transformers and Multi-Head Attention, by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence): [Transformers and Multi-Head Attention](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial6/Transformers_and_MHAttention.html). Its first sections recap Week 7's scaled dot-product attention. It then builds the `MultiheadAttention`, `EncoderBlock` and `PositionalEncoding` classes and trains a Transformer on sequence reversal, where the heads learn to attend to the flipped position. The notebook downloads data and checkpoints from the internet and normally uses PyTorch Lightning, so run it on a laptop or ask your instructor to pre-download it for the Spark.

### Deliverables

The completed notebook with outputs visible, the loss curves with and without the mask, answers to the five exercises and the reflection. Submit through the portal; your instructor announces due dates and weights.

| Criterion | Points |
|---|---|
| Positional encoding + Exercise 1 | 15 |
| Multi-head attention and shapes + Exercise 2 | 25 |
| Block and model + Exercise 3 | 15 |
| Training and loss curve + Exercise 4 | 20 |
| Mask experiment + Exercise 5 | 15 |
| Reflection and code quality | 10 |

**Stretch goals.** Stack three blocks; add a second string and train on both; sample with temperature instead of `argmax`; change `n_heads` from 4 to 1 and compare the final loss.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. Work the calculations on paper first.

```quiz
{
  "id": "week-08-check",
  "title": "Week 8 quiz: The Transformer and autoregressive training",
  "passMark": 70,
  "questions": [
    {
      "q": "Why does a Transformer need positional encoding?",
      "options": [
        "To make the vectors shorter",
        "To replace the embeddings",
        "Attention alone does not know the order of tokens, so position information must be added",
        "To make the softmax faster"
      ],
      "answer": 2,
      "why": "Attention gives the same results for shuffled tokens, apart from the shuffling itself. Adding a position vector to each embedding lets the model tell \"dog bites man\" from \"man bites dog\". It adds to the embeddings and does not replace them."
    },
    {
      "q": "With d_model = 4, what are the first two values of the sinusoidal encoding at position 1, (sin 1, cos 1)?",
      "options": [
        "(0.841, 0.540)",
        "(0.010, 1.000)",
        "(0.540, 0.841)",
        "(1.000, 0.000)"
      ],
      "answer": 0,
      "why": "The first pair uses angle pos / 10000⁰ = 1, so sin 1 = 0.841 and cos 1 = 0.540. The values (0.010, 1.000) belong to the second pair, where the angle is 0.01."
    },
    {
      "q": "A model has d_model = 512 and 8 attention heads. How many dimensions does each head use?",
      "options": [
        "512",
        "64",
        "8",
        "4096"
      ],
      "answer": 1,
      "why": "The dimensions are split between the heads: 512 / 8 = 64. The heads' outputs are concatenated back to 512."
    },
    {
      "q": "Ignoring biases, how many weights are in a multi-head attention layer with d_model = 512 (W_Q, W_K, W_V and W_O, each 512 × 512)?",
      "options": [
        "262,144",
        "524,288",
        "2,097,152",
        "1,048,576"
      ],
      "answer": 3,
      "why": "Four matrices of 512 × 512 = 262,144 weights each give 4 × 262,144 = 1,048,576. The number of heads does not change this count."
    },
    {
      "q": "Which order describes the original Transformer encoder block?",
      "options": [
        "Self-attention, add and normalise, feed-forward, add and normalise",
        "Feed-forward, self-attention, add and normalise, add and normalise",
        "Self-attention, feed-forward, add and normalise, add and normalise",
        "Add and normalise, self-attention, add and normalise, feed-forward"
      ],
      "answer": 0,
      "why": "Each sub-layer (first attention, then feed-forward) is followed by its own residual connection and layer normalisation."
    },
    {
      "q": "A causal mask is applied to a sequence of 6 tokens. How many entries of the 6 × 6 attention matrix are visible (not hidden)?",
      "options": [
        "15",
        "36",
        "21",
        "30"
      ],
      "answer": 2,
      "why": "Token t sees t positions, so 1 + 2 + 3 + 4 + 5 + 6 = 21, which is 6 × 7 / 2. The other 15 are hidden."
    },
    {
      "q": "A decoder is trained on the tokens [the, cat, sat, on]. The input at the position of \"sat\" has which target?",
      "options": [
        "sat",
        "on",
        "cat",
        "the"
      ],
      "answer": 1,
      "why": "Targets are the input shifted by one, so at the position of \"sat\" the target is the next token, \"on\". The target \"sat\" would mean copying the input."
    },
    {
      "q": "A model gives the correct next token a probability of 0.25. What is the cross-entropy loss −ln(p) for that token?",
      "options": [
        "0.25",
        "0.693",
        "4.00",
        "1.386"
      ],
      "answer": 3,
      "why": "−ln 0.25 = ln 4 = 1.386. The value 4 is 1/p and not its logarithm."
    },
    {
      "q": "During training on whole sequences, why is a causal mask needed?",
      "options": [
        "Otherwise a position could read the next token, which is its target, and the loss would be trivially small without real learning",
        "Otherwise the softmax would not sum to 1",
        "Otherwise the positional encoding would be lost",
        "Otherwise the feed-forward network would see every token"
      ],
      "answer": 0,
      "why": "Without the mask the model can copy the answer from the future. Softmax still sums to 1 either way, and the feed-forward network works per token regardless."
    },
    {
      "q": "A new untrained model predicts almost uniformly over a vocabulary of 50 tokens. What loss should you expect at step 0?",
      "options": [
        "About 0",
        "About 50",
        "About 3.91 (ln 50)",
        "About 0.02 (1/50)"
      ],
      "answer": 2,
      "why": "Uniform probabilities give p = 1/50 for the correct token, so the loss is −ln(1/50) = ln 50 = 3.91. This is a useful sanity check at the start of training."
    }
  ]
}
```

## How Week 8 is assessed

**Your lab.** The portal marks the Week 8 lab against the rubric in the table above; your instructor announces due dates and weights.

**Across the course.** Laboratories and knowledge checks run through the term, with exams in Weeks 5, 10, 15 and 20 and a capstone. Your instructor announces the component weights in the syllabus. The Midterm in Week 10 is cumulative for Weeks 6–10, so positional-encoding values, head sizes and mask counts can return as calculations.

**Knowledge check.** The graded weekly knowledge check is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. What problem does positional encoding solve?
2. What does the causal mask hide, and why does training need it?
3. Why are the targets the inputs shifted by one token?

**Homework / self-study**
- Finish any unfinished lab exercises and the reflection.
- Redo the d_model = 4 positional-encoding example for position 2 by hand (sin 2 = 0.909, cos 2 = −0.416 for the first pair) and check with your NumPy function.
- Preview Week 9: BERT, GPT and T5 all use the blocks from this week. Which of them uses the causal mask?
