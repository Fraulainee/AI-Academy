> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 3 — Deep Learning & Backpropagation

**Purpose:** Understand how a deep network ==passes the blame for its mistake backwards, one layer at a time, using the chain rule==, and why that signal can fade away or blow up when there are many layers.

**Term:** Prelim (Weeks 1–5) · **Month:** 1 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch the blame travel backwards",
  "caption": "Backpropagation multiplies small local slopes together, layer by layer. The chain-rule numbers in the first scene are exact; the loss curve is a made-up animation. The bars show what happens when each of several layers can pass on at most one quarter of the signal.",
  "scenes": [
    { "name": "Chain rule", "kind": "text", "outputLabel": "Gradient of the loss with respect to w", "prompt": "L = (y − t)², y = sigmoid(z), z = w·x + b", "output": "dL/dw = dL/dy × dy/dz × dz/dw = −0.620 × 0.214 × 1.5 = −0.199" },
    { "name": "Fading signal", "kind": "bars", "outputLabel": "Largest possible gradient reaching each layer", "prompt": "Four sigmoid layers, each passing on at most ×0.25", "bars": [ { "label": "Output layer", "value": 1 }, { "label": "1 layer back", "value": 0.25 }, { "label": "2 layers back", "value": 0.0625 }, { "label": "3 layers back", "value": 0.0156 } ] },
    { "name": "Training", "kind": "loss", "outputLabel": "Loss while training", "prompt": "Repeat: forward pass, backward pass, update" }
  ]
}
```

## By the end, you can…

1. ==Explain why depth helps==: each layer builds on the features of the one before it.
2. Run a ==forward pass== through a tiny network and write down every intermediate value.
3. Use the ==chain rule== to compute the gradient of the loss with respect to a weight and a bias, and check it with autograd.
4. Explain ==vanishing and exploding gradients== with numbers, and say why sigmoid makes the first one worse.
5. Name the standard fixes (ReLU, careful initialisation, residual connections, normalisation, gradient clipping) and say which problem each one helps.

Assessed in the Week 3 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## Why depth helps {rail=Depth}

{lede} In [[deep learning|Machine learning with neural networks that have many layers. Each layer transforms the output of the layer before it.]] the layers are stacked so that ==each layer builds on the features found by the layer before it==. Simple pieces combine into more complex ones.

In Week 2 you saw that one hidden layer can solve XOR. So why use many layers? Think about recognising a face in a photo. You do not jump from raw pixels to "face" in one step. A natural path is: pixels, then small edges, then corners and curves, then parts such as an eye or a nose, then a face. Many trained image networks show a rough version of this: early layers respond to simple patterns, later layers to more complex ones. A deep network lets the model learn each stage and *reuse* the stages. There are also functions that a deep network can represent with far fewer neurons than a network with one hidden layer would need.

Switch between the two examples below. Notice how the output of one layer is the input of the next.

```viz
{
  "type": "flow",
  "title": "Features build on features",
  "modes": [
    {
      "name": "Image of a face",
      "tagline": "Each layer takes the previous layer's features and combines them into something bigger.",
      "inputLabel": "Layer input",
      "modelLabel": "one layer of neurons",
      "outputLabel": "What it tends to detect",
      "examples": [
        { "label": "Layer 1", "input": "Raw pixel values", "output": "Edges and small blobs of colour" },
        { "label": "Layer 2", "input": "Edges and blobs", "output": "Corners, curves and textures" },
        { "label": "Layer 3", "input": "Corners, curves and textures", "output": "Parts: an eye, a nose, an ear" },
        { "label": "Layer 4", "input": "Parts", "output": "A whole face" }
      ],
      "note": "A common way to describe what trained image networks learn. Real networks are messier than this tidy story, and what each layer learns is found by training, not designed."
    },
    {
      "name": "A sentence",
      "tagline": "The same idea for text: smaller units combine into larger meaning.",
      "inputLabel": "Layer input",
      "modelLabel": "one layer of neurons",
      "outputLabel": "What it might represent",
      "examples": [
        { "label": "Layer 1", "input": "Word pieces", "output": "Which words are present" },
        { "label": "Layer 2", "input": "Words", "output": "Short phrases such as “not good”" },
        { "label": "Layer 3", "input": "Phrases", "output": "The sentiment of the sentence" }
      ],
      "note": "An illustration of the idea, not a measurement of any specific model."
    }
  ]
}
```

Depth has a price. A signal must travel through every layer on the way forward, and the learning signal must travel back through every layer. That is what the rest of this lesson is about.

## Forward pass and backward pass by hand {rail=Backprop}

{lede} A network learns in two sweeps. The [[forward pass|Running the inputs through the network, layer by layer, to get a prediction and then the loss.]] computes the prediction and the loss. The [[backward pass|Going from the loss back toward the inputs, using the chain rule to find how much each parameter contributed to the loss.]] ==finds how much each weight is to blame for the loss==. This second sweep is [[backpropagation|The algorithm that computes the gradient of the loss with respect to every parameter by applying the chain rule backwards through the network (Rumelhart, Hinton and Williams, 1986).]].

### The chain rule with real numbers

Use the smallest network that shows everything: one neuron with one input.

- z = w·x + b, then y = sigmoid(z), then loss L = (y − t)², where t is the target.
- Numbers: x = 1.5, w = 0.8, b = −0.4, t = 1.

The [[chain rule|If a quantity depends on another through a chain of steps, the overall rate of change is the product of the rates of change of each step.]] says that to find how L changes when w changes, multiply the slopes along the path: **dL/dw = dL/dy × dy/dz × dz/dw**.

Each piece is simple. dL/dy = 2(y − t). The slope of the sigmoid is dy/dz = y(1 − y). And dz/dw = x. Step through the computation below and keep the numbers in view.

```viz
{
  "type": "pipeline",
  "title": "One neuron: forward, then backward",
  "intro": "Press Next. The first three steps go forward; the next three go backward.",
  "nodes": [
    { "id": "in", "label": "x, w, b", "sub": "1.5, 0.8, −0.4" },
    { "id": "lin", "label": "z = w·x + b", "sub": "linear part" },
    { "id": "act", "label": "y = σ(z)", "sub": "activation" },
    { "id": "loss", "label": "L = (y − t)²", "sub": "t = 1" }
  ],
  "steps": [
    { "title": "Forward: the linear part", "body": "Multiply and add: z = 0.8 × 1.5 + (−0.4) = 1.2 − 0.4 = 0.8.", "active": ["in", "lin"], "example": "z = 0.8" },
    { "title": "Forward: the activation", "body": "Apply the sigmoid: y = 1 / (1 + e^(−0.8)) = 0.6900. The neuron says 69% for class 1.", "active": ["lin", "act"], "example": "y = 0.6900" },
    { "title": "Forward: the loss", "body": "Compare with the target t = 1: L = (0.6900 − 1)² = 0.0961. This ends the forward pass.", "active": ["act", "loss"], "example": "L = 0.0961" },
    { "title": "Backward: start at the loss", "body": "The slope of the loss with respect to the prediction is dL/dy = 2(y − t) = 2 × (0.6900 − 1) = −0.6201. The negative sign says that raising y would lower the loss.", "active": ["loss", "act"], "example": "dL/dy = −0.6201" },
    { "title": "Backward: through the sigmoid", "body": "The sigmoid's own slope is dy/dz = y(1 − y) = 0.6900 × 0.3100 = 0.2139. Chain rule: dL/dz = −0.6201 × 0.2139 = −0.1326.", "active": ["act", "lin"], "example": "dL/dz = −0.1326" },
    { "title": "Backward: to the parameters", "body": "Since z = w·x + b, dz/dw = x = 1.5 and dz/db = 1. So dL/dw = −0.1326 × 1.5 = −0.1990 and dL/db = −0.1326.", "active": ["lin", "in"], "example": "dL/dw = −0.1990, dL/db = −0.1326" },
    { "title": "Update", "body": "With learning rate 0.5: w = 0.8 − 0.5 × (−0.1990) = 0.8995 and b = −0.4 − 0.5 × (−0.1326) = −0.3337. The loss drops from 0.0961 to 0.0707.", "active": ["in", "lin", "act", "loss"], "example": "w = 0.8995, b = −0.3337, L = 0.0707" }
  ]
}
```

Both gradients are negative, so gradient descent *increases* w and b, which pushes y towards 1. The numbers were computed with Python and checked with finite differences (nudging w by a tiny amount and watching L). You will confirm them again with PyTorch in the lab.

In a real network the same pattern repeats for every layer: each layer receives the gradient from the layer above, multiplies it by its own local slopes, and passes the result down. ==Backpropagation is the chain rule applied efficiently, from the loss back to the first layer.== PyTorch records the forward pass as a [[computation graph|A record of every operation done in the forward pass, so that the backward pass can retrace them in reverse order.]] and does the backward pass for you when you call `loss.backward()`.

## Vanishing and exploding gradients {rail=Gradients}

{lede} Because the backward pass *multiplies* one factor per layer, a deep network is in danger: if the factors are mostly smaller than 1 the signal shrinks to nothing, and if they are larger than 1 it grows without limit. These two failures are the [[vanishing gradient|When the gradient shrinks layer by layer on the way back, so the early layers barely learn.]] and the [[exploding gradient|When the gradient grows layer by layer on the way back, so updates become huge and training becomes unstable.]].

### Where the shrinking comes from

Look at the slope of each activation function. The sigmoid's slope never exceeds 0.25 (its maximum, at z = 0), and it falls to 0.018 at z = 4, where the sigmoid is nearly flat. ReLU's slope is exactly 1 for positive inputs and 0 for negative ones.

```viz
{
  "type": "curve",
  "title": "Slopes of three activation functions",
  "xRange": [-6, 6],
  "yRange": [-0.1, 1.2],
  "series": [
    { "fn": "sigmoid_grad", "label": "Sigmoid slope" },
    { "fn": "tanh_grad", "label": "Tanh slope" },
    { "fn": "relu_grad", "label": "ReLU slope" }
  ],
  "alt": "Sigmoid slope is a bell shape with a peak of 0.25 at zero. Tanh slope is a bell shape with a peak of 1 at zero. ReLU slope is 0 for negative inputs and 1 for positive inputs.",
  "note": "Plotted from the exact formulas."
}
```

If every layer used a sigmoid and passed on at most 0.25 of the gradient, the gradient reaching the first of 10 layers would be at most 0.25¹⁰ ≈ 0.00000095, about one millionth. (This ignores the weights, which matter too, but it shows the trend.) ==With sigmoid activations in a deep network, the early layers get almost no learning signal.== Move the slider below. It plots the log of the gradient left after n layers when each layer multiplies it by a factor.

```viz
{
  "type": "curve",
  "title": "Gradient left after n layers",
  "xRange": [0, 20],
  "yRange": [-8, 0],
  "logY": true,
  "series": [ { "fn": "decay", "label": "Gradient after n layers" } ],
  "param": { "label": "Factor per layer", "min": 0.1, "max": 1, "step": 0.01, "value": 0.25 },
  "alt": "A straight line on a log scale falling steeply for a factor of 0.25 and staying flat at the top for a factor of 1.",
  "note": "The vertical axis is log10 of the remaining gradient. The slider stops at 1; factors above 1 explode instead, for example 1.5 per layer over 20 layers multiplies the gradient by about 3,300."
}
```

At a factor of 0.25, after 10 layers the line is near −6 on the log axis (one millionth). At a factor of 1 it stays flat: the signal survives. Above 1 the opposite happens. A factor of 1.5 across 20 layers gives 1.5²⁰ ≈ 3,325, so the gradient is thousands of times too big and a single update can throw the weights far away.

### What helps

- **ReLU and its relatives.** Slope 1 for positive inputs means the factor does not shrink. A neuron that always gets a negative input has slope 0 forever (a "dead" ReLU); Leaky ReLU avoids that with a small slope for negative inputs.
- **Careful initialisation.** Choose the starting weights so that signals neither shrink nor grow from layer to layer. Xavier initialisation suits sigmoid and tanh; [[Kaiming initialisation|A way to choose the starting weights for ReLU networks: random values with variance 2 divided by the number of inputs to the layer. It keeps the signal size roughly constant from layer to layer.]] suits ReLU.
- **Residual connections.** A [[residual connection|A shortcut that adds a layer's input to its output, output = x + F(x), so the gradient has a direct path back around the layer.]] gives the gradient a direct path around a layer. The slope of x + F(x) is 1 + F′(x), which does not shrink to 0. This is the idea behind ResNet (He et al., 2015).
- **Normalisation layers** keep each layer's values in a reasonable range.
- **Gradient clipping.** If the gradient's overall size exceeds a limit, rescale it down to the limit. For example, a gradient of size 50 clipped at 5 is multiplied by 0.1. It guards against exploding gradients.

Which problem does each fix mainly help? Decide, then read the explanations.

```viz
{
  "type": "sorter",
  "title": "Which problem does the fix help?",
  "intro": "Sort each technique. A few help with both problems, and one is an edge case.",
  "bins": [
    { "id": "vanishing", "label": "Mainly vanishing gradients" },
    { "id": "exploding", "label": "Mainly exploding gradients" },
    { "id": "both", "label": "Helps with both" }
  ],
  "cards": [
    { "name": "Switch from sigmoid to ReLU", "answer": "vanishing", "why": "ReLU's slope is 1 for positive inputs, so the gradient is not multiplied by 0.25 at each layer." },
    { "name": "Leaky ReLU", "answer": "vanishing", "why": "It keeps a small non-zero slope for negative inputs, so neurons do not go dead and stop passing gradient." },
    { "name": "Residual connections", "answer": "vanishing", "why": "The shortcut gives the gradient a direct path back around each block, so it can reach early layers." },
    { "name": "Gradient clipping", "answer": "exploding", "why": "It rescales a too-large gradient down to a limit, so one update cannot throw the weights far away. It does nothing for a gradient that is too small." },
    { "name": "Kaiming or Xavier initialisation", "answer": "both", "why": "It chooses starting weights so the signal size stays about the same layer after layer, preventing both shrinking and growing at the start." },
    { "name": "Normalisation layers", "answer": "both", "why": "They keep each layer's values in a stable range, which helps the forward signal and the backward gradient." },
    { "name": "Lowering the learning rate", "answer": "either", "why": "Edge case. It makes each update smaller, which can calm training when gradients are large, but it does not bring back a gradient that has already faded to nothing. Either answer is fine if you can defend it." }
  ]
}
```

## Key takeaways {rail=Takeaway}

- ==Depth lets a network build complex features from simple ones==, but it makes the learning signal travel through many layers.
- ==Backpropagation is the chain rule from the loss back to each weight.== In the worked example dL/dw = −0.620 × 0.214 × 1.5 = −0.199.
- ==Gradients are products of per-layer factors.== Sigmoid slopes are at most 0.25, so ten layers can shrink the gradient by a factor of about a million. Factors above 1 make it explode instead.
- ==The standard fixes are ReLU, careful initialisation, residual connections, normalisation and gradient clipping==, each aimed at one or both problems.

## Lab: check backprop and watch gradients fade {rail=Laboratory}

Verify a hand-computed backward pass with autograd and finite differences, then ==measure the gradient size in every layer of a 10-layer network== with different activations and initialisations. Time: 3 hours. This is DL Lab 2B.

### Setup

1. Log in to the portal, start JupyterLab, and create `week03/lab3.ipynb`.
2. No internet and no `pip install`. This lab needs only `torch`, `numpy`, `math` and `matplotlib`, and it runs on the CPU, so you do not need the shared GPU.
3. No models or datasets are downloaded. Your instructor's lab notebook is the graded version of DL Lab 2B; use this page to prepare.

### Step-by-step tasks

1. *Backprop on paper (20 min).* For x = 1.5, w = 0.8, b = −0.4, t = 1, compute z, y, L, dL/dy, dy/dz, dL/dz, dL/dw and dL/db on paper, four decimals.
   *Exercise 1:* now repeat for x = −1 and t = 0 (w and b unchanged). Write your answers; you will check them in Step 2.
2. *Autograd check (15 min).*
```python
import torch, torch.nn as nn, math
import numpy as np, matplotlib.pyplot as plt

def grads(x, t, w0=0.8, b0=-0.4):
    w = torch.tensor(w0, requires_grad=True); b = torch.tensor(b0, requires_grad=True)
    z = w * x + b; y = torch.sigmoid(z); L = (y - t) ** 2
    L.backward()
    return [round(v, 4) for v in (z.item(), y.item(), L.item(), w.grad.item(), b.grad.item())]

print(grads(1.5, 1.0))     # z, y, L, dL/dw, dL/db
print(grads(-1.0, 0.0))
```
   *Exercise 2:* do your Step 1 values match? Where they do not, find your arithmetic slip. Then apply one gradient-descent update with learning rate 0.5 to the first case and compute the new loss by hand.
3. *Finite differences (15 min).* A second, independent check that needs no framework.
```python
def loss(w, b, x=1.5, t=1.0):
    y = 1 / (1 + math.exp(-(w * x + b)))
    return (y - t) ** 2

eps = 1e-6
dw = (loss(0.8 + eps, -0.4) - loss(0.8 - eps, -0.4)) / (2 * eps)
db = (loss(0.8, -0.4 + eps) - loss(0.8, -0.4 - eps)) / (2 * eps)
print(dw, db)
```
   *Exercise 3:* compare with autograd. Why is this method too slow to train a network with a million parameters? (Count the forward passes it needs for one gradient.)
4. *Build a 10-layer network and measure gradients (40 min).*
```python
def make_mlp(act, init="default", depth=10, width=32):
    layers = []
    for _ in range(depth):
        layers += [nn.Linear(width, width), act()]
    net = nn.Sequential(*layers, nn.Linear(width, 1))
    for m in net:
        if isinstance(m, nn.Linear) and init != "default":
            if isinstance(init, str): nn.init.kaiming_normal_(m.weight, nonlinearity="relu")
            else: nn.init.normal_(m.weight, std=init)       # otherwise init is a number: the std
            nn.init.zeros_(m.bias)
    return net

def grad_norms(net, seed=0):
    torch.manual_seed(seed)
    x, t = torch.randn(64, 32), torch.randn(64, 1)
    net.zero_grad()
    ((net(x) - t) ** 2).mean().backward()
    return [m.weight.grad.norm().item() for m in net if isinstance(m, nn.Linear)]
```
   *Exercise 4:* explain in your own words what each function returns, and why there are 11 numbers in the list.
5. *Compare activations and initialisations (30 min).*
```python
torch.manual_seed(0)
cases = {"sigmoid, default": make_mlp(nn.Sigmoid), "ReLU, default": make_mlp(nn.ReLU),
         "ReLU, Kaiming": make_mlp(nn.ReLU, "kaiming"),
         "ReLU, std 0.01": make_mlp(nn.ReLU, 0.01), "ReLU, std 0.5": make_mlp(nn.ReLU, 0.5)}
for name, net in cases.items():
    g = grad_norms(net)
    plt.semilogy(range(1, 12), g, marker="o", label=name)
    print(name, "first layer %.1e, last layer %.1e" % (g[0], g[-1]))
plt.xlabel("layer (1 = closest to the input)"); plt.ylabel("gradient norm"); plt.legend(); plt.show()
```
   *Exercise 5:* sort the five cases into "vanishing", "healthy" and "exploding". Explain each using the numbers on the plot.
6. *How does depth matter? (20 min).*
```python
for depth in [2, 5, 10, 20]:
    g = grad_norms(make_mlp(nn.Sigmoid, depth=depth))
    print(depth, "first/last = %.1e" % (g[0] / g[-1]))
```
   *Exercise 6:* describe the trend. Roughly by what factor does the ratio change for each extra layer?
7. *Gradient clipping (20 min).*
```python
net = make_mlp(nn.ReLU, 0.5)
x, t = torch.randn(64, 32), torch.randn(64, 1)
((net(x) - t) ** 2).mean().backward()
before = nn.utils.clip_grad_norm_(net.parameters(), max_norm=1.0)
after = torch.sqrt(sum((p.grad ** 2).sum() for p in net.parameters()))
print(before.item(), after.item())
```
   *Exercise 7:* what do `before` and `after` tell you? Why would you clip the gradient instead of just using a smaller learning rate?
8. *Reflection (10 min).* In a markdown cell, explain to a classmate in 4–5 sentences why a very deep sigmoid network is hard to train, and name two fixes.

### What you should see

- Step 2: `[0.8, 0.69, 0.0961, -0.199, -0.1326]` for the first call. For x = −1 and t = 0 you should get z = −1.2, y = 0.2315, L = 0.0536, dL/dw = −0.0824 and dL/db = 0.0824.
- Step 3: about `-0.19895` and `-0.13263`, matching autograd to four or five decimals.
- Step 2, Exercise 2: with lr 0.5, w becomes 0.8995, b becomes −0.3337, and the new loss is 0.0707.
- Step 5 (exact values change with the seed, but the orders of magnitude should not): sigmoid with default initialisation has a first-layer gradient norm many orders of magnitude (at least five) below its last-layer norm. ReLU with Kaiming initialisation keeps all eleven norms within about one order of magnitude of each other. Standard deviation 0.01 makes every norm tiny (vanishing), and standard deviation 0.5 makes the norms enormous (exploding); both are far from the Kaiming case. With PyTorch's default initialisation, a ReLU network's gradient norms are small throughout, because the default starting weights are a little too small for ReLU; Kaiming fixes that.
- Step 6: the ratio falls dramatically as depth grows (in a check of the same setup it went from about 10⁻² at 2 layers to about 10⁻⁹ at 10 layers).
- Step 7: `before` is a large number (far above 1) and `after` is 1.0.

### Common mistakes

- Forgetting `net.zero_grad()` or building a fresh network before each call; gradients from earlier calls add up in `.grad`.
- Forgetting that `.backward()` needs a scalar. Take the mean of the squared errors first.
- Using `requires_grad=True` on a tensor that is not a float (it must be a float).
- Comparing plots drawn on a linear axis. Gradient sizes span many orders of magnitude, so use `plt.semilogy`.
- Reading one random seed as proof. Rerun with another seed and check that the trend stays.

### Go further: UvA notebooks

Two notebooks go further. [Tutorial 3, Activation functions](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial3/Activation_Functions.html) plots sigmoid, tanh, ReLU, LeakyReLU, ELU and Swish with their gradients, shows how gradients flow in a network right after initialisation (sigmoid gradients are tiny in the early layers), trains on FashionMNIST, and looks at dead ReLU neurons. [Tutorial 4, Optimization and initialization](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial4/Optimization_and_Initialization.html) explains why the weight variance should be about 1/d, compares Xavier and Kaiming initialisation, and implements SGD, momentum and Adam from scratch. Both download FashionMNIST, so read them on your laptop or ask your instructor to pre-download the data for the Spark. Tutorials 3 and 4 by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence).

### Deliverables

Submit your notebook through the portal with outputs visible: the hand calculations (a photo or typed), the autograd and finite-difference results, the gradient-norm plot, and the answers to Exercises 1–7 and the reflection. Your instructor announces the due date.

| Criterion | Points |
|---|---|
| Hand-computed forward and backward values correct (Steps 1–2) | 20 |
| Autograd and finite-difference check, with comparison (Steps 2–3) | 20 |
| Working 10-layer network and gradient-norm plot (Steps 4–5) | 25 |
| Interpretation of the five cases (Exercise 5) | 15 |
| Depth trend and gradient clipping (Steps 6–7) | 10 |
| Reflection and code quality | 10 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. Three of them ask you to compute something, so keep paper handy.

```quiz
{
  "id": "week-03-check",
  "title": "Week 3 quiz: Deep learning and backpropagation",
  "passMark": 70,
  "questions": [
    {
      "q": "What is the main reason a deep network can recognise complex things such as faces?",
      "options": [
        "Each neuron is individually more powerful than a shallow network's neuron.",
        "It needs far less training data than a shallow network.",
        "Each layer builds on the features of the previous layer, combining simple patterns into complex ones.",
        "Deeper networks never suffer from gradient problems."
      ],
      "answer": 2,
      "why": "Layered feature building (edges, then parts, then objects) is the key idea. Depth does not reduce the data needed, and it actually brings gradient problems."
    },
    {
      "q": "A sigmoid neuron outputs y = 0.69. What is the slope of the sigmoid at that point, y(1 − y)?",
      "options": [
        "0.31",
        "0.21",
        "0.69",
        "0.48"
      ],
      "answer": 1,
      "why": "0.69 × 0.31 = 0.2139, about 0.21. The value 0.31 is 1 − y, 0.69 is y itself, and 0.48 is y squared."
    },
    {
      "q": "In the worked example dL/dz = −0.1326 and the input is x = 1.5, with z = w·x + b. What is dL/dw?",
      "options": [
        "−0.199",
        "−0.133",
        "0.199",
        "−0.0884"
      ],
      "answer": 0,
      "why": "dz/dw = x, so dL/dw = dL/dz × x = −0.1326 × 1.5 = −0.199. The value −0.0884 comes from dividing by x instead of multiplying, and −0.133 is dL/db, which has dz/db = 1."
    },
    {
      "q": "What does the chain rule say about backpropagation?",
      "options": [
        "The gradient at each layer is the sum of the gradients of all other layers.",
        "The gradient is the same at every layer.",
        "Gradients must be calculated by nudging each weight in turn.",
        "The gradient with respect to an early parameter is a product of the local slopes along the path from the loss back to it."
      ],
      "answer": 3,
      "why": "The chain rule multiplies the slopes of each step along the path. That product is also why gradients can shrink or grow layer by layer."
    },
    {
      "q": "What is the largest value the slope of the sigmoid function can take?",
      "options": [
        "1",
        "0.25",
        "0.5",
        "0.1"
      ],
      "answer": 1,
      "why": "The sigmoid's slope y(1 − y) is largest when y = 0.5, where it equals 0.25. That is why many sigmoid layers shrink the gradient."
    },
    {
      "q": "If each of 10 layers passes on at most 0.25 of the gradient, about how large can the gradient at the first layer be, relative to the output layer?",
      "options": [
        "About 2.5",
        "About 0.001",
        "About 0.000001",
        "Exactly 0.25"
      ],
      "answer": 2,
      "why": "0.25¹⁰ ≈ 9.5 × 10⁻⁷, about one millionth. The value 0.001 is 0.25⁵, and 2.5 is 10 × 0.25."
    },
    {
      "q": "Each layer multiplies the backward gradient by 1.5. About how much bigger is the gradient after 20 layers?",
      "options": [
        "About 30",
        "About 1.5",
        "About 0.0003",
        "About 3,300"
      ],
      "answer": 3,
      "why": "1.5²⁰ ≈ 3,325. The value 30 is 1.5 × 20, which adds instead of multiplying. This growth is an exploding gradient."
    },
    {
      "q": "Which technique mainly protects against exploding gradients?",
      "options": [
        "Gradient clipping",
        "Switching from ReLU to sigmoid",
        "Adding more layers",
        "Using a Leaky ReLU"
      ],
      "answer": 0,
      "why": "Clipping rescales a too-large gradient down to a limit. Leaky ReLU helps against dead neurons and vanishing gradients, and sigmoid makes vanishing worse."
    },
    {
      "q": "Why does ReLU help against vanishing gradients compared with sigmoid?",
      "options": [
        "Its output is always between 0 and 1.",
        "It has no parameters to train.",
        "Its slope is exactly 1 for positive inputs, so it does not shrink the gradient.",
        "It makes the loss function equal to zero."
      ],
      "answer": 2,
      "why": "A slope of 1 means the backward signal passes through unchanged for active neurons, whereas the sigmoid multiplies it by at most 0.25."
    },
    {
      "q": "A residual block outputs x + F(x). Why does this make very deep networks easier to train?",
      "options": [
        "It removes the need for a loss function.",
        "The slope is 1 + F′(x), so the gradient has a direct path that does not shrink to zero.",
        "It makes each layer twice as wide.",
        "It replaces backpropagation with a different algorithm."
      ],
      "answer": 1,
      "why": "The added x gives a shortcut with slope 1, so gradient reaches early layers even if F′(x) is small. Backpropagation is still used."
    }
  ]
}
```

## How Week 3 is assessed

Your lab is marked out of 100 using the table in the lab section. Laboratories and knowledge checks run through the term, with the Prelim exam in Week 5. Your instructor announces the component weights and due dates. The graded knowledge check for this week is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave (your instructor will use them to open Week 4):
1. What are the forward pass and the backward pass?
2. Why does a deep sigmoid network have trouble learning in its early layers?
3. Name two fixes for gradient problems and say what each does.

**Homework / self-study**
- Finish any unfinished lab exercises. Redo the chain-rule calculation by hand with numbers of your own (change t or w) and check it with autograd.
- Rerun Step 5 with a different seed and with width 64 instead of 32. Does the story change?
- Preview Week 4: look at a digital photo as numbers. How many numbers are in a 28×28 greyscale image? (784.)
