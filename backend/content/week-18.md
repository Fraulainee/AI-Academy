> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 18 — Scaling & Deploying AI

**Purpose:** Learn why big models do not fit on one GPU, and how ==splitting the work (parallelism) and using fewer bits per number (precision)== make them train and run.

**Term:** Final (Weeks 16–20) · **Month:** 5 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a model shrink",
  "caption": "The same 7-billion-parameter model needs 28 GB of memory for its weights in FP32, but only 3.5 GB in INT4. The bar lengths are computed from parameters times bytes per parameter. The loss curve is a made-up example of a training run.",
  "scenes": [
    { "name": "Memory", "kind": "bars", "prompt": "7B model: memory for the weights", "outputLabel": "GB, relative to FP32 (28 GB)",
      "bars": [ { "label": "FP32 (28 GB)", "value": 1.0 }, { "label": "FP16 (14 GB)", "value": 0.5 }, { "label": "INT8 (7 GB)", "value": 0.25 }, { "label": "INT4 (3.5 GB)", "value": 0.125 } ] },
    { "name": "Sum", "kind": "text", "prompt": "7B model, 4 bytes per weight: how much memory?", "outputLabel": "The arithmetic", "output": "7 × 10⁹ weights × 4 bytes = 28 × 10⁹ bytes = 28 GB" },
    { "name": "Idle time", "kind": "bars", "prompt": "4-stage pipeline: share of time a GPU sits idle", "outputLabel": "Idle share by number of micro-batches",
      "bars": [ { "label": "1 micro-batch (75%)", "value": 0.75 }, { "label": "4 micro-batches (43%)", "value": 0.43 }, { "label": "16 micro-batches (16%)", "value": 0.16 } ] },
    { "name": "Training", "kind": "loss", "prompt": "Training a large model takes many GPUs and many days", "outputLabel": "Training loss" }
  ]
}
```

## By the end, you can…

1. ==Explain why one GPU is not enough== for large models, using a weights-plus-training memory estimate.
2. ==Compare data, tensor and pipeline parallelism== and say when each is used.
3. ==Describe mixed-precision training== and ==quantization for inference==, and their effect on memory and speed.
4. Estimate the memory for a model at FP32, FP16, INT8 and INT4, and the compute-optimal size for a training budget.
5. Measure the effect of precision on a GPU and of INT8 quantization on a CPU in the lab.

Assessed in the Week 18 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## Why one GPU is not enough {rail=Why scale}

{lede} A model must keep its numbers in GPU memory. A model with 7 billion parameters stored in 4 bytes each needs ==7 × 10⁹ × 4 bytes = 28 GB just for its weights==, before you train or run anything.

### Memory: parameters times bytes

A [[parameter|One learned number inside a model, usually a weight. A model with 7 billion parameters stores 7 billion such numbers.]] is stored in a number format called a [[precision|The number format used to store a value. FP32 uses 4 bytes per number, FP16 and BF16 use 2, INT8 uses 1 and INT4 uses half a byte.]]. So weight memory is simply parameters × bytes per parameter. At 2 bytes (FP16) the 7B model needs 14 GB. At 1 byte (INT8) it needs 7 GB.

**Training needs far more than the weights.** With the Adam optimizer in mixed precision, a common estimate is ==about 16 bytes per parameter==: the weights, their gradients, an FP32 master copy and two Adam moments. For 7 billion parameters that is 7 × 16 = 112 GB. Activations and other overhead come on top.

In the figure, set the slider to 7 and read the five bars. Then slide up to 70.

```viz
{
  "type": "calc",
  "title": "How much memory does a model need?",
  "kind": "memory",
  "intro": "Drag the model size. The first four bars are weights only; the last bar is a training estimate.",
  "note": "Weights only, plus the common 16-bytes-per-parameter estimate for mixed-precision Adam training. Activations, the KV cache and framework overhead are not included."
}
```

Notice that the training bar is 4× the FP32 weights bar. At 70 B the FP16 weights alone are 140 GB, more than a single GPU holds, so the model must be split across several GPUs.

### Why bigger? The scaling rule

Why build such large models at all? The [[scaling law|An empirical rule that model quality improves smoothly as you increase model size, training data and compute. Chinchilla (Hoffmann et al., 2022) suggested about 20 training tokens per parameter for a fixed compute budget.]] work (Kaplan et al., 2020; Hoffmann et al., 2022) found that quality improves predictably with size, data and compute. A rough rule of thumb: training costs C ≈ 6 × N × D FLOPs for N parameters and D tokens, and the best use of a fixed budget is about ==20 training tokens per parameter==. A 70 B model is therefore trained on about 70 × 20 = 1,400 B = 1.4 trillion tokens.

```viz
{
  "type": "calc",
  "title": "Compute-optimal size for a budget",
  "kind": "scaling",
  "intro": "Move the compute slider and watch N and D change together. At 10^22 FLOPs you should see about 9.1 B parameters and 183 B tokens.",
  "note": "A rule of thumb, not an exact law. With C = 6 N D and D = 20 N, we get N = sqrt(C / 120)."
}
```

Ten times more compute does not give a ten-times-bigger model: N grows by only √10 ≈ 3.2×. That is why even a modest jump in model size needs a large jump in hardware.

## Three ways to split the work {rail=Parallelism}

{lede} When one GPU is too small or too slow, you use many. There are three standard ways to share the job: ==split the data, split each layer, or split the layers into stages==.

### Data parallelism

Imagine four students marking one big pile of exams, each with the same answer key. That is [[data parallelism|Every GPU holds a full copy of the model. Each one processes a different slice of the batch, then the GPUs average their gradients so all copies stay identical.]]. It is the simplest method, and it speeds up training, but ==each GPU must still hold the whole model==.

```viz
{
  "type": "pipeline",
  "title": "One data-parallel training step",
  "intro": "Step through the four stages. Notice that the model is copied, not divided.",
  "nodes": [
    { "id": "split", "label": "Split batch", "sub": "each GPU gets a slice" },
    { "id": "grad", "label": "Local gradients", "sub": "forward + backward on each GPU" },
    { "id": "sync", "label": "Average gradients", "sub": "all GPUs exchange" },
    { "id": "upd", "label": "Update", "sub": "identical on every GPU" }
  ],
  "steps": [
    { "title": "Copy the model, split the batch", "body": "Every GPU starts with the same weights. A batch of 64 examples is cut into slices, so with 4 GPUs each one gets 16.", "active": ["split"], "example": "GPU 0: examples 1-16 · GPU 1: 17-32 · GPU 2: 33-48 · GPU 3: 49-64" },
    { "title": "Each GPU computes its own gradients", "body": "Each GPU runs the forward and backward pass on its slice only. At this point the four gradients are different.", "active": ["grad"] },
    { "title": "Average the gradients", "body": "The GPUs share their gradients and average them. With equal slices this equals the gradient of the full batch, so nothing is lost.", "active": ["sync"] },
    { "title": "Every copy makes the same update", "body": "Each GPU applies the same averaged gradient, so all four copies stay identical for the next step.", "active": ["upd"] }
  ]
}
```

The averaging step is why data parallelism needs a fast link between GPUs: gradients the size of the model are exchanged every step. You will check in the lab that averaging half-batch gradients equals the full-batch gradient.

### Tensor and pipeline parallelism

If the model itself does not fit on one GPU, you must divide it. In [[tensor parallelism|A large weight matrix inside one layer is cut into pieces, each GPU computes its piece of the result, and the pieces are joined. It splits the work inside every layer.]] one layer's matrix is cut up. Cut a 4096 × 4096 matrix into two 4096 × 2048 halves: each GPU multiplies the input by its half, and the two results are joined side by side. It needs GPUs that exchange data constantly, so it is normally used between GPUs in one machine. (Shoeybi et al., 2019, describe this for Transformers in Megatron-LM.)

In [[pipeline parallelism|Consecutive layers are grouped into stages and each stage runs on a different GPU. The batch is cut into micro-batches so that all stages can work at the same time.]] you cut the model by layers instead: GPU 0 holds layers 1-8, GPU 1 holds layers 9-16, and so on. If you push one batch through, GPU 1 waits while GPU 0 works. The fix is to cut the batch into small [[micro-batches|Small slices of a batch fed one after another into a pipeline, so that later stages can start working before the first stage has finished the whole batch.]].

```viz
{
  "type": "pipeline",
  "title": "Pipeline parallelism with micro-batches",
  "intro": "Step through to see the stages fill up. The idle slots at the start and end are called the bubble.",
  "nodes": [
    { "id": "s1", "label": "Stage 1", "sub": "GPU 0 · layers 1-8" },
    { "id": "s2", "label": "Stage 2", "sub": "GPU 1 · layers 9-16" },
    { "id": "s3", "label": "Stage 3", "sub": "GPU 2 · layers 17-24" },
    { "id": "s4", "label": "Stage 4", "sub": "GPU 3 · layers 25-32" }
  ],
  "steps": [
    { "title": "Time 1: only stage 1 works", "body": "Micro-batch 1 enters stage 1. The other three GPUs have nothing to do yet, so they sit idle.", "active": ["s1"] },
    { "title": "Time 2: two stages work", "body": "Micro-batch 1 moves to stage 2 while micro-batch 2 enters stage 1.", "active": ["s1", "s2"] },
    { "title": "Time 4: the pipeline is full", "body": "Each stage holds a different micro-batch, so all four GPUs are busy at once. This is the useful part of the schedule.", "active": ["s1", "s2", "s3", "s4"] },
    { "title": "At the end the pipeline drains", "body": "When the last micro-batch enters, stage 1 finishes first and goes idle, then stage 2, and so on. In the simplest schedule the idle share is (p - 1) / (m + p - 1) for p stages and m micro-batches: with p = 4 and m = 4 that is 3/7, about 43%; with m = 16 it is 3/19, about 16%.", "active": ["s4"], "example": "More micro-batches means a smaller idle share." }
  ]
}
```

Notice how more micro-batches shrink the idle share. Real systems combine all three methods: for example tensor parallelism inside a machine, pipeline parallelism across machines and data parallelism on top.

### Which one fits?

```viz
{
  "type": "sorter",
  "title": "Choose the parallelism",
  "intro": "Decide which method each situation points to. Where two ideas fit, the explanation says which is the main one.",
  "bins": [
    { "id": "data", "label": "Data parallelism" },
    { "id": "tensor", "label": "Tensor parallelism" },
    { "id": "pipeline", "label": "Pipeline parallelism" }
  ],
  "cards": [
    { "name": "A 300M-parameter model fits easily on one GPU, but training on one GPU takes too long.", "answer": "data", "why": "The model fits, so copy it to every GPU and split the batch to finish sooner." },
    { "name": "Each GPU receives a different slice of the batch and the gradients are averaged.", "answer": "data", "why": "That is the defining step of data parallelism." },
    { "name": "A single weight matrix is too big for one GPU, so its columns are divided between GPUs.", "answer": "tensor", "why": "Cutting one layer's matrix into pieces is tensor (intra-layer) parallelism." },
    { "name": "GPUs inside one server exchange partial results at every layer.", "answer": "tensor", "why": "Tensor parallelism communicates inside every layer, so it needs fast links such as those within one machine." },
    { "name": "Layers 1-8 run on GPU 0 and layers 9-16 run on GPU 1, with micro-batches flowing through.", "answer": "pipeline", "why": "Grouping consecutive layers into stages is pipeline parallelism." },
    { "name": "GPU 3 sits idle while the first micro-batch is still travelling through earlier stages.", "answer": "pipeline", "why": "This idle time is the pipeline bubble." }
  ],
  "note": "Real large-model training usually combines all three."
}
```

## Fewer bits per number: precision {rail=Precision}

{lede} Most of what a model stores does not need 32 bits of detail. ==Using 16 or 8 bits halves or quarters the memory and often speeds things up==, at a small cost in accuracy.

### Mixed-precision training

In [[mixed-precision training|Training in which most of the arithmetic is done in 16-bit numbers (FP16 or BF16) for speed and memory, while a master copy of the weights and some sensitive operations stay in FP32.]] (Micikevicius et al., 2017) the matrix multiplications run in FP16 or BF16, while an FP32 copy of the weights is kept so that tiny updates are not lost. FP16 has a narrow range, so FP16 training usually adds loss scaling; BF16 keeps FP32's range with less detail, so it usually does not need it. In PyTorch you wrap the forward pass in `torch.autocast`, which chooses the precision per operation for you.

### Quantization for inference

[[Quantization|Storing a model's weights as low-bit integers (such as INT8) plus a scale factor, so the model is smaller and often faster to run, with a small loss of accuracy.]] goes further after training. Take four weights 0.62, -1.27, 0.05 and 0.904. The biggest absolute value is 1.27, so choose the scale 1.27 / 127 = 0.01. Each weight becomes a whole number between -127 and 127 by dividing by the scale and rounding.

```viz
{
  "type": "flow",
  "title": "FP32 versus INT8 storage",
  "modes": [
    {
      "name": "FP32 weights",
      "tagline": "Each weight is stored with 4 bytes. This is the format most models are trained in.",
      "inputLabel": "Weights",
      "modelLabel": "stored as 32-bit floats",
      "outputLabel": "Stored values",
      "examples": [
        { "label": "Four weights", "input": "0.62, -1.27, 0.05, 0.904", "output": "16 bytes (4 weights × 4 bytes), exact" },
        { "label": "A 7B model", "input": "7 × 10⁹ weights", "output": "28 GB" }
      ],
      "note": "Exact numbers, but the biggest memory cost."
    },
    {
      "name": "INT8 weights",
      "tagline": "Each weight is rounded to a whole number from -127 to 127 and stored in 1 byte, plus one scale (here 0.01) for the group.",
      "inputLabel": "Weights",
      "modelLabel": "scale = 1.27 / 127 = 0.01, then round",
      "outputLabel": "Stored values",
      "examples": [
        { "label": "Four weights", "input": "0.62, -1.27, 0.05, 0.904", "output": "62, -127, 5, 90 (4 bytes plus the scale); read back as 0.62, -1.27, 0.05, 0.90" },
        { "label": "A 7B model", "input": "7 × 10⁹ weights", "output": "7 GB (about a quarter of FP32)" }
      ],
      "note": "The last weight is read back as 0.90 instead of 0.904: a rounding error of 0.004. Real quantizers add refinements, but the idea is the same."
    }
  ]
}
```

Notice the small rounding error and the 4× saving. In practice quantization is used for ==inference==, running a trained model, while mixed precision is used for ==training==. INT4 saves even more but loses more accuracy, so it is checked carefully.

## Serving a model {rail=Serving}

{lede} Deploying means answering real requests. Two numbers matter: ==latency (how long one user waits) and throughput (how many requests or tokens per second the system handles)==.

- **Batching.** Handling several requests together keeps the GPU busy, which raises throughput. A bigger batch can make each single request wait longer, so you trade latency for throughput.
- **KV cache.** A language model generates one token at a time. The [[KV cache|Stored attention keys and values of the tokens already processed, so each new token reuses them instead of recomputing the whole prompt.]] saves them so earlier tokens are not recomputed. The cost is memory: for a model with 32 layers and hidden size 4096 in FP16 (illustrative, similar to a 7B model with standard attention), each token stores 2 × 32 × 4096 × 2 bytes = 524,288 bytes. A 4,096-token conversation then needs about 2.1 GB, and 8 such conversations about 17 GB.
- **Quantization** also helps here: a smaller model leaves more GPU memory for batches and the KV cache.

| Technique | Saves memory? | Saves time? | Mainly used in |
|---|---|---|---|
| Data parallelism | No (every GPU holds the model) | Yes, for training | Training |
| Tensor / pipeline parallelism | Yes (model is divided) | Allows models that otherwise do not fit | Training and serving |
| Mixed precision | Yes | Yes | Training |
| Quantization | Yes | Often | Inference |
| KV cache | Costs memory | Yes, avoids recomputation | Inference |

## Key takeaways {rail=Takeaway}

- Weight memory = ==parameters × bytes per parameter==. A 7B model is 28 GB in FP32, 14 GB in FP16, 7 GB in INT8 and 3.5 GB in INT4; Adam training needs about ==16 bytes per parameter==.
- ==Data parallelism copies the model and splits the batch; tensor parallelism splits each layer; pipeline parallelism splits the layers into stages== fed with micro-batches.
- ==Mixed precision speeds up training; quantization shrinks a trained model for inference==, both at a small cost in accuracy.
- Serving is a trade-off between ==latency and throughput==; the KV cache saves compute but uses memory.

## Lab: measure scaling and precision {rail=Laboratory}

In this lab you ==measure how precision changes GPU memory and speed, and how INT8 quantization changes model size on a CPU==, and you check data and tensor parallelism with small calculations. Time: 3 hours.

### Setup

1. Create a folder `week18` and a notebook `lab9.ipynb`. Do not install packages; there is no internet.
2. All code below uses only `torch`. No Hugging Face model is needed, so there are no model IDs to confirm.
3. The GPU is shared by the whole class. Free memory after each part with `del` and `torch.cuda.empty_cache()`.
4. Your instructor's lab notebook is the graded version; this activity is a self-contained practice version.

### Step-by-step tasks

1. *Memory by hand (20 min).* Compute weight memory for a 7B model at each precision, then check it against the memory figure.
```python
params = 7e9
for name, b in [("FP32", 4), ("FP16", 2), ("INT8", 1), ("INT4", 0.5)]:
    print(name, params * b / 1e9, "GB")
print("Adam training estimate:", params * 16 / 1e9, "GB")
```
   *Exercise 1:* repeat for 13 B and 70 B parameters. Which of the three sizes fit in the GPU memory shown by `nvidia-smi` at FP16, and for training?
2. *Matrix multiply, FP32 versus FP16 (40 min).* Time a 4096 × 4096 multiply and record peak memory.
```python
import torch, time
def bench(dtype, n=4096, reps=20):
    torch.cuda.empty_cache(); torch.cuda.reset_peak_memory_stats()
    a = torch.randn(n, n, device="cuda", dtype=dtype)
    b = torch.randn(n, n, device="cuda", dtype=dtype)
    c = torch.empty(n, n, device="cuda", dtype=dtype)
    for _ in range(3): torch.matmul(a, b, out=c)
    torch.cuda.synchronize(); t0 = time.perf_counter()
    for _ in range(reps): torch.matmul(a, b, out=c)
    torch.cuda.synchronize(); sec = (time.perf_counter() - t0) / reps
    mem = torch.cuda.max_memory_allocated() / 1e6
    del a, b, c; torch.cuda.empty_cache()
    return sec * 1000, 2 * n**3 / sec / 1e12, mem
for dt in (torch.float32, torch.float16, torch.bfloat16):
    ms, tf, mem = bench(dt)
    print(f"{str(dt):16s} {ms:7.2f} ms  {tf:6.1f} TFLOP/s  peak {mem:7.1f} MB")
```
   *Exercise 2:* three n × n matrices at n = 4096 hold 3 × 16,777,216 numbers. Compute the expected MB for 4 bytes and 2 bytes per number and compare with your measured peak. Explain any difference.
3. *Mixed precision with `torch.autocast` (40 min).* See which operations change precision.
```python
import torch.nn as nn
model = nn.Sequential(nn.Linear(2048, 2048), nn.ReLU(), nn.Linear(2048, 2048)).cuda()
x = torch.randn(256, 2048, device="cuda")
print("weights:", model[0].weight.dtype)
with torch.autocast("cuda", dtype=torch.bfloat16):
    y = model(x)
    loss = y.float().pow(2).mean()
print("output:", y.dtype, "| loss:", loss.dtype)
loss.backward()
print("grad dtype:", model[0].weight.grad.dtype)

def peak(use_autocast):
    torch.cuda.empty_cache(); torch.cuda.reset_peak_memory_stats()
    with torch.autocast("cuda", dtype=torch.bfloat16, enabled=use_autocast):
        out = model(x)
    out.float().pow(2).mean().backward()
    return torch.cuda.max_memory_allocated() / 1e6
print("peak MB fp32:", peak(False), "| autocast:", peak(True))
```
   *Exercise 3:* explain why the weights and gradients stay FP32 while the layer output is BF16. Does autocast reduce the peak here? Record the numbers, and explain what would change with a bigger batch.
4. *Dynamic INT8 quantization on CPU (40 min).* Quantize the Linear layers of a small network and compare size, speed and output.
```python
import io, time, torch, torch.nn as nn
from torch.ao.quantization import quantize_dynamic
torch.manual_seed(0)
fp = nn.Sequential(nn.Linear(1024, 1024), nn.ReLU(), nn.Linear(1024, 1024),
                   nn.ReLU(), nn.Linear(1024, 10)).eval()
q = quantize_dynamic(fp, {nn.Linear}, dtype=torch.qint8)
def size_mb(m):
    buf = io.BytesIO(); torch.save(m.state_dict(), buf); return buf.getbuffer().nbytes / 1e6
x = torch.randn(64, 1024)
def ms(m, reps=50):
    with torch.no_grad():
        m(x); t0 = time.perf_counter()
        for _ in range(reps): m(x)
    return (time.perf_counter() - t0) / reps * 1000
print("size MB:", size_mb(fp), "->", size_mb(q))
print("time ms:", ms(fp), "->", ms(q))
with torch.no_grad():
    print("max |difference|:", (fp(x) - q(x)).abs().max().item())
```
   *Exercise 4:* the network has 2,109,450 parameters. Compute its FP32 size in MB (4 bytes each) and compare with the printed size. Report the size ratio, the speed ratio and the output difference. Is the speed-up as large as the size saving? Why might it not be?
5. *Check data and tensor parallelism on one CPU (30 min).* Simulate two "GPUs" with tensors.
```python
import torch
torch.manual_seed(0)
w = torch.randn(5, requires_grad=True)
X, y = torch.randn(8, 5), torch.randn(8)
def grad(Xb, yb):
    w.grad = None
    ((Xb @ w - yb) ** 2).mean().backward()
    return w.grad.clone()
full = grad(X, y)
avg = (grad(X[:4], y[:4]) + grad(X[4:], y[4:])) / 2
print("data parallel matches:", torch.allclose(full, avg, atol=1e-6))

W, inp = torch.randn(6, 8), torch.randn(3, 6)
left, right = inp @ W[:, :4], inp @ W[:, 4:]
print("tensor parallel matches:", torch.allclose(inp @ W, torch.cat([left, right], dim=1), atol=1e-6))
```
   *Exercise 5:* explain in two sentences why averaging gradients works only because the two slices are the same size and the loss is a mean. Then use the formula (p - 1) / (m + p - 1) to compute the idle share for p = 4 stages with m = 8 micro-batches.
6. *Reflection (10 min).* A hospital must serve a 13 B assistant to 50 users on two GPUs with 24 GB each. In five sentences choose a precision and a parallelism strategy and justify them with your numbers.

### What you should see

- Step 1: 28.0, 14.0, 7.0 and 3.5 GB, and 112.0 GB for training.
- Step 2: peak memory close to 201 MB for FP32 and 101 MB for FP16 and BF16 (a small extra for a library workspace is possible). On a recent NVIDIA GPU the FP16 and BF16 multiplies are usually clearly faster than FP32; exact times depend on the GPU and on what others are running.
- Step 3: weights `torch.float32`, output `torch.bfloat16`, loss `torch.float32`, gradient `torch.float32`.
- Step 4: size about 8.44 MB falling to about 2.1 MB (roughly 4×); the output difference is small compared with the output values; the CPU speed-up varies.
- Step 5: `True` and `True`. For Exercise 5 the idle share is 3/11, about 27%.

### Common mistakes

- Timing GPU code without `torch.cuda.synchronize()`. The GPU runs asynchronously, so you measure only the launch time.
- Comparing the first call, which includes start-up work, with later calls. Always warm up first.
- Running `quantize_dynamic` on a GPU model. It targets CPU inference, so keep the model on the CPU.
- Forgetting `.eval()` before quantizing or timing.
- Forgetting to free tensors, so the shared GPU runs out of memory for classmates.

### Deliverables

The completed notebook with outputs, your answers to the five exercises and the reflection. Submit through the portal. Your instructor announces due dates and marking details.

| Criterion | Points |
|---|---|
| Memory calculations correct (Steps 1-2) | 3 |
| Autocast experiment and explanation (Step 3) | 2 |
| Quantization experiment and analysis (Step 4) | 2 |
| Parallelism checks and explanation (Step 5) | 2 |
| Reflection with numbers | 1 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one.

```quiz
{
  "id": "week-18-check",
  "title": "Week 18 quiz: Scaling and deploying AI",
  "passMark": 70,
  "questions": [
    {
      "q": "How much memory do the weights of a 13-billion-parameter model need in FP16 (2 bytes each)?",
      "options": ["13 GB", "26 GB", "52 GB", "6.5 GB"],
      "answer": 1,
      "why": "13 × 10⁹ × 2 bytes = 26 GB. 13 GB would be INT8, 52 GB would be FP32 and 6.5 GB would be INT4."
    },
    {
      "q": "Using the 16-bytes-per-parameter Adam estimate, about how much memory does training a 7B-parameter model need, before activations?",
      "options": ["28 GB", "56 GB", "112 GB", "14 GB"],
      "answer": 2,
      "why": "7 × 10⁹ × 16 = 112 GB. 28 GB is only the FP32 weights, and 14 GB only the FP16 weights."
    },
    {
      "q": "Four GPUs each hold a full copy of the model and process a quarter of the batch, then average their gradients. Which method is this?",
      "options": ["Data parallelism", "Tensor parallelism", "Pipeline parallelism", "Quantization"],
      "answer": 0,
      "why": "Copying the model and splitting the batch is data parallelism. The other two divide the model itself."
    },
    {
      "q": "One layer's weight matrix is too large for a single GPU. Which method divides that matrix between GPUs?",
      "options": ["Data parallelism", "Pipeline parallelism", "Mixed precision", "Tensor parallelism"],
      "answer": 3,
      "why": "Tensor parallelism cuts a layer's matrix into pieces. Pipeline parallelism cuts between layers, so a single huge layer would still not fit."
    },
    {
      "q": "A pipeline has p = 4 stages and m = 4 micro-batches. In the simplest schedule, the idle share is (p - 1) / (m + p - 1). What is it?",
      "options": ["3/7, about 43%", "3/4, 75%", "1/4, 25%", "4/7, about 57%"],
      "answer": 0,
      "why": "(4 - 1) / (4 + 4 - 1) = 3/7 ≈ 0.43. Using more micro-batches makes the share smaller."
    },
    {
      "q": "In mixed-precision training, why is an FP32 master copy of the weights usually kept?",
      "options": ["It makes the matrix multiplies faster.", "It lets the model use INT4 at inference.", "Very small weight updates would be lost in 16-bit numbers.", "It removes the need for gradients."],
      "answer": 2,
      "why": "Tiny updates can vanish when added to a 16-bit weight, so the update is accumulated in FP32. The copy costs memory rather than speed, and gradients are still needed."
    },
    {
      "q": "You quantize a trained FP32 model to INT8 for inference. What is the expected result?",
      "options": ["The model becomes about 4 times larger.", "The weights take about a quarter of the memory, with a small loss of accuracy.", "Training becomes 4 times faster.", "Accuracy is guaranteed to be identical."],
      "answer": 1,
      "why": "INT8 uses 1 byte instead of 4, so weights shrink to about a quarter. Rounding adds a small error. Quantization here is applied after training, for inference."
    },
    {
      "q": "What is the KV cache used for when a language model generates text?",
      "options": ["It averages gradients between GPUs.", "It stores the training data.", "It compresses the weights to INT8.", "It keeps the attention keys and values of earlier tokens so they are not recomputed."],
      "answer": 3,
      "why": "Storing keys and values saves recomputation for every new token, but it costs memory that grows with sequence length and batch size."
    },
    {
      "q": "A service increases its batch size from 1 to 32 requests. What is the usual effect?",
      "options": ["Throughput rises, and each request may wait longer.", "Latency always falls.", "Memory use falls.", "The model needs fewer parameters."],
      "answer": 0,
      "why": "Larger batches keep the GPU busier, which raises throughput, but individual requests may wait for the batch. Memory use for activations and the KV cache usually goes up, not down."
    },
    {
      "q": "By the 20-tokens-per-parameter rule of thumb, about how many training tokens suit a 70-billion-parameter model?",
      "options": ["70 billion", "700 billion", "1.4 trillion", "14 trillion"],
      "answer": 2,
      "why": "70 × 10⁹ × 20 = 1.4 × 10¹². This is a rule of thumb from the Chinchilla paper, not an exact law."
    }
  ]
}
```

## How Week 18 is assessed

**Your lab.** Marked from the table above. The Week 18 knowledge check is on the portal. Your instructor announces dates and component weights in the syllabus.

## Exit ticket and homework

Answer these three questions in one or two sentences each:
1. Why does a 70B model not fit on one GPU at FP16?
2. When would you choose data parallelism, and when pipeline parallelism?
3. Name one benefit and one cost of quantizing a model.

**Homework / self-study**
- Finish the lab exercises and the reflection.
- Preview Week 19: bring your capstone team's current status and a list of what is left to build.
- Revise Weeks 16 and 17 (RAG, agents and guardrails): the capstone combines them.
