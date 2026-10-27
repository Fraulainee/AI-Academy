> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 7 — Language Models & Attention

**Term:** Midterm (Weeks 6–10) · **Month:** 2 · **Posted schedule:** Wed 14 Oct 2026 — 08:00 Lecture 7.1 *Attention mechanisms* (Room CS‑204) · 10:30 Laboratory 3 *Scaled dot‑product attention* (Computing Laboratory 2) · 14:00 consultation hours · **Unit:** GA‑3.1 · **Student lesson:** `/lesson/7` (Lesson Workspace) · **Lab:** GA Lab 3 Part 1 (Part 2 is Week 8)

**Kit sources:** none were supplied with this plan, so no file paths are listed. Before class, add the slide deck, demo notebook, lab notebook, articles and knowledge-check CSV for GA‑3.1 from the Teaching Kit, and confirm them against the checklist below.

**Papers used in the lesson (cite them on your slides):**
- [1] Vaswani et al. (2017), *Attention is all you need*, NeurIPS 30, pp. 5998–6008, arXiv:1706.03762. Required reading: section 3.2.
- [2] Bahdanau, Cho & Bengio (2015), *Neural machine translation by jointly learning to align and translate*, ICLR, arXiv:1409.0473.
- [3] Olah & Carter (2016), *Attention and augmented recurrent neural networks*, Distill 1(9), doi:10.23915/distill.00001.

## Learning outcomes (from course plan and student lesson)
By the end of the week students can:
1. Explain why sequence models (RNN, LSTM) struggle with long sequences, and why attention replaced them.
2. Distinguish hard attention from soft attention.
3. Read an attention-weight matrix: each row is one query token's distribution over the tokens of a sentence.
4. Compute scaled dot-product attention by hand for one query, three keys and three values.
5. Implement it in PyTorch and evaluate the effect of the √d<sub>k</sub> scaling term.

Prerequisites from earlier weeks: tokens and embeddings (Week 6), vectors, dot products, and the softmax function.

## Before class (instructor prep checklist, ~45–60 min)
- [ ] Read the student lesson at `/lesson/7` end to end and play with Figures 1–3. Its weights are **illustrative, authored for teaching, not taken from a trained model**. Say so on your slides.
- [ ] **Fix or warn about the lab's "Expected output" block** (see Instructor notes, *Known issues*). The correct values are scores `[0.7071, 0.0000, 0.7071]`, weights `[0.4011, 0.1978, 0.4011]`, output `[1.2033, 1.0000]`.
- [ ] Run `attention_lab.py` (the code in the lab sheet) in a fresh portal session. The lab is tiny and runs on CPU or GPU; confirm `torch.cuda.is_available()` anyway so students are not surprised.
- [ ] Prepare the worked-example table for Activity 2 (one blank copy per pair) and the pronoun sentences for Activity 1 on a slide.
- [ ] Confirm the Laboratory 3 notebook, the marking rubric and the AI-disclosure policy are published. This plan proposes a rubric below; replace it with the published one if one exists.
- [ ] Check the dates students see: **Lab 3 report due Sat 17 Oct 2026, 11:59 PM PHT (10% of final grade); Quiz 4 on Sat 24 Oct (5%, two attempts, Transformer architecture); Midterm exam 7 Nov (25%, Weeks 6–10).** Confirm these against the syllabus (see *Known issues*).
- [ ] Open the Week 7 knowledge check (GA‑3.1, 20 questions on the portal) and verify it loads. The lesson page shows the first four, Q01–Q04, as a formative check.
- [ ] Bring a spare device login for any student whose portal session fails (test two accounts from a non-admin laptop).

## Lecture plan (2 hrs 30 min, 08:00–10:30)

| Time | Segment | Activity | Materials |
|---|---|---|---|
| 0:00–0:10 | Hook and recap | Play the lesson's hook ("Watch one word read its sentence"). Recall Week 1: a language model picks one next word at a time | Lesson hook figure; Week 1 temperature figure |
| 0:10–0:35 | Mini-lecture 1: Language models and the recurrent bottleneck | Autoregressive objective (predict the next token); RNN/LSTM hidden state; why far-apart words are hard to connect | Slides; lesson section *The bottleneck in recurrent networks*; [2], [3] |
| 0:35–0:50 | Class activity 1 | "Human attention": resolve a pronoun and name the clues you used (pairs) | Sentence slide (Activity 1) |
| 0:50–1:15 | Mini-lecture 2: Queries, keys, values | Score → softmax → weighted average; attention heads. Use Figures 1 and 2 | Lesson Figures 1–2; [1] §3.2 |
| 1:15–1:25 | Break | | |
| 1:25–1:55 | Worked example + class activity 2 | Figure 3 on the board, then pairs compute the same example with and without √d<sub>k</sub> | Lesson Figure 3; worked-example table |
| 1:55–2:15 | Class activity 3 | Soft vs hard attention: why only one can be trained by gradient descent; why attention can run in parallel | Lesson section *Soft weights and parallel computation* |
| 2:15–2:30 | Check + exit ticket | Students do GA‑3.1‑Q01–Q04 on the lesson page, then answer the exit ticket | Lesson *Check for understanding* |

## Class activities

### Activity 1 — Human attention: who does "it" mean? (15 min, pairs)
**Goal:** show that language needs long-range links, and that the right link depends on meaning, not on distance.
**Steps:**
1. Show two sentences on a slide:
   - "The animal didn't cross the street because **it** was too tired."
   - "The animal didn't cross the street because **it** was too wide."
2. (3 min) Each student writes what "it" refers to in each sentence and the word that told them.
3. (5 min) Compare with a partner. Then ask: which words did you look at? How far back did you look?
4. (7 min) Class discussion. Open Figure 1 in the lesson, query "it", Head A, and compare.
**Expected answers:** first sentence → *animal* (clue: *tired*). Second sentence → *street* (clue: *wide*). Students looked back several words, and the clue word *after* "it" changed the answer. Takeaway: a model needs a direct route from "it" to a word far away. The recurrent hidden state gives only a faint trace of early words.
**Say clearly:** the lesson's Head A weights for "it" (animal 0.46) are hand-made for teaching. Real models do not always show such tidy patterns.

### Activity 2 — Compute attention by hand (30 min, pairs)
**Goal:** do the four steps once with numbers so the formula is not magic.
**Setup (from lesson Figure 3):** one query q = (1, 0); three keys k₁ = (1, 0), k₂ = (0, 1), k₃ = (1, 1); three values v₁ = (1, 0), v₂ = (0, 1), v₃ = (2, 2); d<sub>k</sub> = 2.
**Steps:**
1. (8 min) Dot products q·kᵢ.
2. (5 min) Divide by √d<sub>k</sub> = √2.
3. (7 min) Apply softmax to get three weights that sum to 1.
4. (5 min) Output = weighted sum of the values.
5. (5 min) Repeat steps 2–4 **without** the division. Compare the two weight vectors.
**Answer key:**

| Step | With √d<sub>k</sub> scaling | Without scaling |
|---|---|---|
| Scores | 0.7071, 0.0000, 0.7071 | 1, 0, 1 |
| Weights | 0.4011, 0.1978, 0.4011 | 0.4223, 0.1554, 0.4223 |
| Output | (1.2033, 1.0000) | (1.2670, 1.0000) |

**Discussion questions:** Why are weights 1 and 3 equal? (Their scores are equal, so softmax treats them equally.) What happened to the weights when scaling was removed? (They moved further apart: the large scores got more of the weight.) What would happen if the key vectors were 64 long instead of 2? (See the Part C answer key: dot products grow with d<sub>k</sub> and the softmax saturates.)
**Common error:** students apply softmax to the *values* instead of the *scores*, or forget that the weights must sum to 1. Have them check their sum.

### Activity 3 — Why soft? Why parallel? (20 min, groups of 3–4)
**Goal:** connect the maths to the two reasons attention won.
**Steps:**
1. (8 min) Give each group the prompt: "Our attention picks only the highest-scoring key (hard attention). Sketch what the output looks like as a score changes slightly. Can we train it with gradient descent?"
2. (7 min) Groups report. Then show the soft version from Figure 3 and contrast.
3. (5 min) Ask: for a 12-word sentence, which steps must wait for the previous word in an RNN? In attention?
**Expected answers:** with hard attention the output *jumps* when a different key becomes the maximum and is flat otherwise, so the gradient is zero almost everywhere and there is nothing useful to learn from. Soft attention is a smooth weighted average, so it can be differentiated and trained. An RNN must process word 5 before word 6; attention computes every word's output at once, which is what let the Transformer replace recurrent models in practice.
**Edge case to raise:** in the lab example keys 1 and 3 tie for the highest score. `argmax` returns the first maximal index in PyTorch, which picks key 1. Ask students whether that feels arbitrary (it is), and what soft attention does instead (it splits the weight equally).

### Exit ticket (5 min)
1. Why does an RNN struggle to connect "it" to a noun many words earlier?
2. In one sentence, what does a query compare itself with, and what does the result become?
3. Why do we divide the scores by √d<sub>k</sub>?
Collect the answers and use them to open Week 8.

## Lab activity sheet (3 hrs) — student-facing

**Laboratory 3, Part 1: Scaled dot-product attention.** Due **Sat 17 Oct 2026, 11:59 PM PHT** (10% of final grade).
**Objective.** Compute the attention output by hand, then implement and verify it in PyTorch.

**Setup.**
1. Open the Laboratory 3 notebook from the course workspace. The required libraries are pre-installed; there is no internet. Do not use `!pip install` or Colab-only code.
2. Select the device: `device = "cuda" if torch.cuda.is_available() else "cpu"`. This lab is small and runs on either.
3. Put your own work in the notebook. Disclose any AI assistance as set out in the course policy.

**Step-by-step tasks.**

1. *Part A: Concepts (20 min).* In a short written answer, explain why soft attention can be trained by gradient descent and hard attention cannot.
2. *Part B: By hand, then in code (60 min).* Using the query, keys and values from Figure 3, compute the scores, apply softmax and form the weighted sum **by hand first**. Then confirm each intermediate result in PyTorch:
```python
# Laboratory 3, Part 1: scaled dot-product attention
import torch, torch.nn.functional as F
q = torch.tensor([[1., 0.]])                       # 1 query
K = torch.tensor([[1., 0.], [0., 1.], [1., 1.]])   # 3 keys
V = torch.tensor([[1., 0.], [0., 1.], [2., 2.]])   # 3 values
scores = q @ K.T / (2 ** 0.5)
w = F.softmax(scores, dim=-1)
out = w @ V
print(scores, w, out)

# reusable version for Part C
def scaled_dot_product_attention(query, key, value):
    d_k = query.shape[-1]
    scores = torch.matmul(query, key.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, value), weights
```
3. *Part C: Experiments (80 min).*
   - *Scaling ablation:* remove the √d<sub>k</sub> term, increase d<sub>k</sub> to 64, and report how the weights change.
   - *Hard and soft attention:* compare `argmax` selection with the softmax blend on the same inputs.
4. *Reflection (10 min).* In a markdown cell: (a) what surprised you, (b) one thing attention can do that a plain RNN cannot.
5. *Cleanup.* Run the notebook top to bottom (Kernel → Restart and run all), then save.

**Checkpoints with expected outputs.** For Part B your numbers should be close to:
```
scores:  tensor([[0.7071, 0.0000, 0.7071]])
weights: tensor([[0.4011, 0.1978, 0.4011]])
output:  tensor([[1.2033, 1.0000]])
```
Weights close to `[0.401, 0.198, 0.401]` and output close to `[1.203, 1.000]` are correct. Run the notebook to reproduce these values before starting Part C.

**Deliverables.** The notebook with Parts A to C executed in order, your written answers, and the reflection. Submit through the portal. Marked against the Laboratory 3 rubric.

**Stretch goals.** Introduce a temperature parameter and plot its effect on the weight distribution. Extend the function to take batches of queries and verify the output shape. Try two heads with different random projections and compare their weight patterns.

## Lab grading rubric (100 pts) — proposed, replace with the published rubric

| Criterion | Points | Excellent | Satisfactory | Needs work |
|---|---|---|---|---|
| Setup and device selection; notebook runs top to bottom | 10 | Runs in order; device handled; no stray code | Minor fixes needed | Does not run, or Colab/pip code left in |
| Part A: soft vs hard attention explanation | 15 | Clear: soft is a smooth average with gradients; hard is a selection with none | Mostly right, vague on gradients | Missing or incorrect |
| Part B: scores, weights, output (by hand and in code) | 30 | All three correct; hand and code agree; working shown | Two correct, or no working shown | One or none correct |
| Part C: scaling ablation (d<sub>k</sub> = 64) | 20 | Weights compared with and without scaling; saturation explained | Observation correct, explanation weak | Missing or wrong direction |
| Part C: hard vs soft comparison | 15 | Both run on the same inputs; the tie and the lost gradient noted | Both run; shallow comment | Incomplete |
| Reflection, clarity and AI-use disclosure | 10 | Specific, honest disclosure stated | General statements | Missing |

## Instructor notes

**Common mistakes**
- Softmax over the wrong axis. It must be `dim=-1` (over the keys). With `dim=0` the weights over *queries* sum to 1 instead.
- Integer tensors. `torch.tensor([[1, 0]])` is integer and `softmax` fails. Use floats (`1.`).
- Shape errors from forgetting to transpose the keys (`key.transpose(-2, -1)`).
- Dividing by `d_k` instead of `sqrt(d_k)`. Using `d_k` here gives weights that look "right" for d<sub>k</sub> = 2 only by accident.
- Applying softmax to the values, or forgetting that each row of weights sums to 1.
- Mixing CPU and GPU tensors in one operation (device mismatch).

**Misconceptions to address**
- *"Attention weights explain what the model is thinking."* They show where information flows in one head. They are not a complete or reliable explanation. The lesson's weights are illustrative, so avoid presenting them as real behaviour.
- *"Attention won because it is more accurate."* The lesson's point is that **direct links and parallel computation** are what let it replace recurrence in practice.
- *"LSTMs solved the problem."* LSTM gates help information last longer, but the computation is still step by step and the history still passes through a single hidden state. Attention was first added on top of RNNs ([2]); the Transformer ([1]) removed recurrence.
- *"Query, key and value are three different inputs."* In self-attention they are three learned projections of the same token representations. Week 8 covers the full block.
- *"Scaling changes which key wins."* Scaling does not change the ranking of the scores. It changes how peaked the softmax is.

**Known issues in the Week 7 student lesson (fix before class)**
- **Wrong "Expected output" in the lab sheet.** It prints weights `0.4001, 0.1998, 0.4001` and output `1.2003`. The correct values, computed from the given q, K and V, are weights `0.4011, 0.1978, 0.4011` and output `1.2033`. The "What to submit" checkpoint in the same lesson (`[0.401, 0.198, 0.401]`, `[1.203, 1.000]`) is correct, so the page contradicts itself. Students who match the printed block exactly will think they are wrong.
- **Different illustrative numbers.** The hook caption says "it" gives 55% to *animal* and 20% to *tired*. Figure 1, Head A, gives *animal* 0.46. Both are hand-authored. Tell students they are examples, not measurements.
- **Grade weights to confirm.** The dashboard shows Lab 3 = 10%, Quiz 4 = 5%, Midterm = 25% of the final grade. The Week 1 plan lists labs 30%, knowledge checks 10%, exams 35%, capstone 20%, DLI certificates 5%. If exams total 35% and the Midterm alone is 25%, only 10% is left for the other three exams, which is unlikely. Confirm the syllabus before announcing weights.
- **Rubric link.** The lesson links to a "marking rubric" that is not part of this plan's source material. The rubric above is a proposal.

**Answer key / reference solution outline**
- *Part A:* soft attention is a weighted average of all the values with weights from softmax. It is smooth, so the gradient of the output with respect to the scores exists everywhere and training can follow it. Hard attention selects one key. The output is piecewise constant in the scores, so the gradient is zero almost everywhere (and undefined at ties), which gives no learning signal.
- *Part B:* see the Activity 2 table. Scores `[0.7071, 0, 0.7071]` → weights `[0.4011, 0.1978, 0.4011]` → output `[1.2033, 1.0000]`.
- *Part C, scaling ablation.* Reference code:
```python
torch.manual_seed(0)
def max_weight(dk, scale, trials=2000, n_keys=3):
    tot = 0.0
    for _ in range(trials):
        q = torch.randn(1, dk); K = torch.randn(n_keys, dk)
        s = q @ K.T
        if scale: s = s / dk ** 0.5
        tot += F.softmax(s, dim=-1).max().item()
    return tot / trials
for dk in (2, 8, 64, 512):
    print(dk, round(max_weight(dk, False), 3), round(max_weight(dk, True), 3))
```
  Expected pattern (my own simulation with standard-normal q and K, three keys; your numbers should agree within a few hundredths):

  | d<sub>k</sub> | Mean largest weight, no scaling | With √d<sub>k</sub> |
  |---|---|---|
  | 2 | about 0.62 | about 0.55 |
  | 8 | about 0.79 | about 0.58 |
  | 64 | about 0.92 | about 0.59 |
  | 512 | about 0.97 | about 0.60 |

  Explanation: for random components with unit variance, a dot product has variance d<sub>k</sub>, so its typical size grows like √d<sub>k</sub>. Large scores make softmax almost one-hot (saturated), where gradients are tiny. Dividing by √d<sub>k</sub> restores unit variance and keeps the weights spread out. This is a trend: a single random draw can differ.
- *Part C, hard vs soft:* with the given inputs, `argmax` over `[0.7071, 0, 0.7071]` returns index 0 (first of the tied maxima), so the hard output is `v₁ = [1, 0]`, while the soft output is `[1.2033, 1.0]`. Expect students to note the tie and that hard selection ignores key 3 entirely.

## Knowledge check
Assign **GA‑3.1** (20 questions on the portal). The lesson page shows the first four as a formative, ungraded check (unlimited attempts):

| ID | Question (short) | Answer |
|---|---|---|
| GA‑3.1‑Q01 | What does an autoregressive language model optimise in pre-training? | Predicting the next token given the preceding tokens |
| GA‑3.1‑Q02 | Why does a recurrent network struggle with words far apart? | Information about early tokens passes through every hidden state and degrades; attention lets any token consult any other directly |
| GA‑3.1‑Q03 | Soft vs hard attention? | Soft is a differentiable weighted average of all values; hard selects one token and gives no useful gradient |
| GA‑3.1‑Q04 | Why divide scores by √d<sub>k</sub>? | To stop dot products growing with the key dimension and saturating the softmax (softmax alone already makes rows sum to one) |

Topics for the rest of the bank: language-model history and sub-word tokens (Week 6 carry-over), query/key/value, attention heads, parallelism. **Quiz 4** (Sat 24 Oct, graded, two attempts) covers Transformer architecture, so remind students that Week 8 content is included.

## Homework / self-study
- Read Vaswani et al. (2017), section 3.2 (required). Skim Olah & Carter (2016) for pictures of attention.
- Finish **Laboratory 3, Part 1** and submit by **Sat 17 Oct, 11:59 PM PHT**.
- Do the formative check GA‑3.1‑Q01–Q04 again until all four are correct, then review the *Key terms* list in the lesson.
- Preview Week 8: the Transformer block (embeddings, positional encoding, multi-head self-attention, feed-forward, residual connections, layer norm), autoregressive training, and Laboratory 3 Part 2 (implement sinusoidal positional encoding).
- Midterm reminder: **7 Nov**, Weeks 6–10.
