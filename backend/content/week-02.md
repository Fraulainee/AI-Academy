> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 2 — Machine Learning & Neural Networks

**Purpose:** See how a machine ==learns a rule from labelled examples==: a neuron makes a guess, a loss measures the mistake, and gradient descent nudges the weights to make the mistake smaller.

**Term:** Prelim (Weeks 1–5) · **Month:** 1 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a network learn",
  "caption": "Three views of the same idea: one neuron turning numbers into a score, the loss falling as training goes on, and the probabilities a trained network gives for a picture. The numbers are made up for the animation, but the arithmetic in the first scene is exact.",
  "scenes": [
    { "name": "One neuron", "kind": "text", "outputLabel": "The neuron's output", "prompt": "inputs x = (2, 1), weights w = (0.5, −1), bias b = 0.25", "output": "z = 0.5×2 + (−1)×1 + 0.25 = 0.25, then sigmoid(0.25) = 0.56" },
    { "name": "Training", "kind": "loss", "outputLabel": "Loss while training", "prompt": "Show the network 1,000 labelled examples, again and again" },
    { "name": "After training", "kind": "bars", "outputLabel": "Probability for each digit", "prompt": "A new handwritten digit the network has never seen", "bars": [ { "label": "7", "value": 0.86 }, { "label": "1", "value": 0.09 }, { "label": "9", "value": 0.05 } ] }
  ]
}
```

## By the end, you can…

1. ==Explain supervised learning==: features, labels, a model, a loss, training, and why we keep a validation and a test set.
2. ==Compute the output of an artificial neuron== by hand (weighted sum, bias, activation) and compute a mean squared error.
3. Explain why ==one neuron cannot solve XOR but a hidden layer can==, and count the parameters of a small network.
4. Do ==one step of gradient descent== by hand and say what happens when the learning rate is too small or too large.
5. ==Train a small PyTorch network== on a noisy XOR dataset, plot its loss and decision boundary, and read the results.

Assessed in the Week 2 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## Supervised learning: learning from labelled examples {rail=Supervised}

{lede} In [[supervised learning|Learning from examples where every input comes with the correct answer. The model learns a rule that maps inputs to answers.]] you give the computer many examples *with the right answer attached*, and it ==learns a rule that maps inputs to answers==. Then you use the rule on inputs it has never seen.

### An example before the words

Suppose you want to predict the price of a flat from its size. You collect 500 flats. For each flat you write down its size in square metres and the price it sold for. The size is the input, called a [[feature|One measurable property of an example that the model is given as input, such as the size of a flat or the brightness of one pixel.]]. The price is the answer, called the [[label|The correct answer attached to a training example, such as the price of a flat or the word "spam". The model is trained to predict it.]]. Your table of 500 rows is the training data.

A [[model|A function with adjustable numbers inside (its parameters). Given features it returns a prediction.]] is a function with adjustable numbers inside, called [[parameters|The adjustable numbers inside a model, such as weights and biases. Training changes them.]]. Training means finding parameter values that make the predictions close to the labels. You measure "close" with a [[loss function|A number that says how wrong the model's predictions are on the training data. Training tries to make it small.]]. A popular one for numbers is the [[mean squared error (MSE)|The average of the squared differences between predictions and true values.]]: take each prediction's error, square it, and average.

Here is a tiny case with three flats. True prices are 3, 5 and 2 million, the model predicts 2.5, 5.5 and 4. The errors are −0.5, +0.5 and +2. Squared they are 0.25, 0.25 and 4. The mean is (0.25 + 0.25 + 4) / 3 = 1.5. ==Squaring makes every error positive and punishes big mistakes much more than small ones==: the one error of 2 contributes 4 of the 4.5 total.

### Two kinds of supervised task

- **Regression:** the label is a number (a price, tomorrow's temperature, a bus arrival time).
- **Classification:** the label is a category (spam or not spam, which digit 0–9). The model usually outputs a probability for each class. For classification we usually use [[cross-entropy|A loss for classification. It is small when the model gives a high probability to the true class and large when it gives a low one.]] instead of MSE. If the true class is "spam" and the model says 0.9, the loss is −ln 0.9 = 0.105. If it says 0.1, the loss is −ln 0.1 = 2.303. A confident wrong answer costs a lot.

If there are no labels at all and the model only looks for structure, such as groups of similar customers, that is *unsupervised* learning. Sort the examples below.

```viz
{
  "type": "sorter",
  "title": "What kind of learning task is it?",
  "intro": "Put each task in a bin. You get an explanation either way. One card is an edge case on purpose.",
  "bins": [
    { "id": "regression", "label": "Supervised: regression" },
    { "id": "classification", "label": "Supervised: classification" },
    { "id": "unsupervised", "label": "Unsupervised (no labels)" }
  ],
  "cards": [
    { "name": "Predict a flat's price from its size", "answer": "regression", "why": "The label is a number (a price), so this is regression." },
    { "name": "Predict tomorrow's rainfall in millimetres", "answer": "regression", "why": "The label is a number, so it is regression even though many days will be 0." },
    { "name": "Decide if an email is spam", "answer": "classification", "why": "The label is a category: spam or not spam." },
    { "name": "Recognise which digit 0–9 is in a photo", "answer": "classification", "why": "Ten possible categories, each training image labelled with its digit." },
    { "name": "Group shop customers by buying habits, with no labels", "answer": "unsupervised", "why": "Nobody told the model the right groups. It looks for structure on its own." },
    { "name": "Find topics in thousands of unlabelled news articles", "answer": "unsupervised", "why": "There is no label to predict. The model looks for patterns in the text itself." },
    { "name": "Predict how many minutes a bus will be late", "answer": "regression", "why": "The answer is a number of minutes." },
    { "name": "Predict the next word of a sentence (a language model)", "answer": "either", "why": "Edge case. Each next word is a category chosen from a vocabulary, so it looks like classification, and the labels come from the text itself rather than from people, which is often called self-supervised learning. You met this in Week 1; either answer is fine if you can defend it." }
  ]
}
```

### Generalisation: doing well on data it has not seen

The goal is not to do well on the training rows. A model could simply memorise them. The goal is [[generalisation|How well a trained model does on new data it was not trained on. It is the real goal of machine learning.]]. To measure it, split your data before training:

| Part | Typical share | Used for |
|---|---|---|
| Training set | about 70% | Adjusting the parameters |
| Validation set | about 15% | Choosing settings (learning rate, network size) and watching for trouble |
| Test set | about 15% | One final, honest score at the very end |

When the model scores much better on training data than on validation data, it has [[overfitting|When a model fits the training examples, including their noise, so closely that it does worse on new data.]]. When it scores badly on both, it is *underfitting*. These numbers are made up to show the pattern:

| Model | Training accuracy | Validation accuracy | What happened |
|---|---|---|---|
| Too simple | 62% | 60% | Underfitting: it cannot capture the pattern |
| About right | 91% | 89% | Good fit: small gap |
| Too flexible | 100% | 74% | Overfitting: it memorised the training set |

==Never tune your model on the test set.== If you do, the test score is no longer an honest estimate of how it will do on new data.

## One artificial neuron {rail=Neuron}

{lede} An [[artificial neuron|The basic unit of a neural network. It multiplies each input by a weight, adds the results and a bias, and passes the sum through an activation function.]] does three small things: it ==multiplies each input by a weight, adds a bias, then squashes the sum with an activation function==. That is all.

### Worked example

Take two inputs x = (2, 1), weights w = (0.5, −1) and bias b = 0.25. A [[weight|A number that says how strongly one input influences a neuron. Training adjusts weights.]] can be positive or negative. The [[bias|A number added to a neuron's weighted sum. It shifts the point at which the neuron switches on.]] shifts the result.

1. Weighted sum: z = 0.5×2 + (−1)×1 + 0.25 = 1 − 1 + 0.25 = **0.25**
2. Activation: a [[sigmoid|A smooth S-shaped function, 1 / (1 + e^(−z)). It turns any number into a value between 0 and 1, which can be read as a probability.]] turns z into a number between 0 and 1: sigmoid(0.25) = 1 / (1 + e^(−0.25)) = **0.562**

So the neuron says "56% likely to be class 1". If we use 0.5 as the cut-off, it answers "class 1".

### What a neuron can and cannot separate

With two inputs, the line w₁x + w₂y + b = 0 is the neuron's decision line: one side gives class 1, the other class 0. Training moves that line. Below, drag the three sliders. First, on the "Separable" data, find weights that get all 8 points right. Then switch to "XOR" and try to get all 4.

```viz
{
  "type": "neuron",
  "title": "One neuron draws one straight line",
  "intro": "Move w₁, w₂ and b until the score reaches 8 of 8 on Separable. Then try to reach 4 of 4 on XOR.",
  "w": [0.5, -0.5],
  "b": 0,
  "range": [-3, 3],
  "datasets": [
    { "name": "Separable", "points": [
      { "x": 1.5, "y": 1, "c": 1 }, { "x": 2, "y": 0.5, "c": 1 }, { "x": 1, "y": 2, "c": 1 }, { "x": 0.5, "y": 1.5, "c": 1 },
      { "x": -1.5, "y": -1, "c": 0 }, { "x": -2, "y": -0.5, "c": 0 }, { "x": -1, "y": -2, "c": 0 }, { "x": -0.5, "y": -1.5, "c": 0 } ] },
    { "name": "XOR", "points": [
      { "x": 1, "y": 1, "c": 0 }, { "x": -1, "y": -1, "c": 0 }, { "x": -1, "y": 1, "c": 1 }, { "x": 1, "y": -1, "c": 1 } ] }
  ]
}
```

On Separable, w₁ = 1, w₂ = 1, b = 0 gets 8 of 8. On XOR you will never get past 3 of 4: the two class-1 points sit on opposite corners and the two class-0 points on the other corners, so no single straight line can split them. This was a real problem: ==a single neuron can only separate classes with a straight line==, and it held back neural networks in the 1960s. The fix is to use more than one neuron.

## Layers and hidden units {rail=Layers}

{lede} Stack neurons in layers and the network can bend its decision boundary. A [[hidden layer|A layer of neurons between the input and the output. Its outputs are not the final answer; they are new features the next layer uses.]] ==creates new features from the inputs==, and the output layer combines them.

### XOR solved with two hidden neurons

Use ReLU, which outputs the number if it is positive and 0 otherwise. Let hidden neuron 1 compute h₁ = ReLU(x₁ + x₂), hidden neuron 2 compute h₂ = ReLU(x₁ + x₂ − 1), and the output compute y = h₁ − 2·h₂. Check all four XOR inputs:

| x₁ | x₂ | h₁ | h₂ | y = h₁ − 2h₂ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 2 | 1 | 0 |

The hidden layer turned a problem no line can solve into one a line can. The activation function matters: without one, stacked layers collapse into a single line again. Here are the three classic activations. Notice that all three bend, and that sigmoid and tanh flatten out at both ends.

```viz
{
  "type": "curve",
  "title": "Three activation functions",
  "xRange": [-4, 4],
  "yRange": [-1.5, 4.5],
  "series": [
    { "fn": "sigmoid", "label": "Sigmoid (0 to 1)" },
    { "fn": "tanh", "label": "Tanh (−1 to 1)" },
    { "fn": "relu", "label": "ReLU" }
  ],
  "alt": "Three curves. Sigmoid rises smoothly from 0 to 1. Tanh rises smoothly from minus 1 to 1. ReLU is 0 for negative inputs and equal to the input for positive inputs.",
  "note": "Plotted from the exact formulas."
}
```

### Counting parameters

A [[layer|A group of neurons that all receive the same inputs. A fully connected layer with n inputs and m neurons has n×m weights plus m biases.]] with n inputs and m neurons has n×m weights and m biases. A network with 2 inputs, 4 hidden neurons and 1 output has (2×4 + 4) + (4×1 + 1) = 12 + 5 = **17 parameters**. This is the network you train in the lab. Making the hidden layer wider, say 16 neurons, gives 2×16 + 16 + 16 + 1 = 65 parameters. More parameters means more flexibility, and more risk of overfitting.

## Training: gradient descent on a loss {rail=Training}

{lede} Training is a loop: ==guess, measure the mistake, nudge every parameter slightly in the direction that reduces the mistake, repeat==. The nudge comes from [[gradient descent|An algorithm that repeatedly moves each parameter a small step in the direction that lowers the loss. The step direction comes from the gradient, the slope of the loss.]].

### One step by hand

Imagine one parameter w and a loss L(w) = (w − 3)². The best value is w = 3, but the computer does not know that. It only knows the slope, the [[gradient|The slope of the loss with respect to a parameter. It tells you which way the loss rises, so you step the opposite way.]], which here is 2(w − 3). Start at w = 0:

- gradient = 2(0 − 3) = −6 (the loss falls as w increases)
- new w = w − lr × gradient = 0 − 0.1 × (−6) = **0.6**

Here lr = 0.1 is the [[learning rate|How big a step gradient descent takes. Too small and training is slow; too large and it overshoots or diverges.]]. Next step: gradient = 2(0.6 − 3) = −4.8, new w = 0.6 + 0.48 = **1.08**. Each step closes 20% of the remaining distance to 3 (that is 1 − 2×0.1 = 0.8 of it is left). Try different learning rates below. Press play or step through, and watch what happens at 0.01, 0.5, 1.0 and 1.1.

```viz
{
  "type": "descent",
  "title": "Gradient descent and the learning rate",
  "fn": "quad",
  "lr": 0.1,
  "start": -0.5
}
```

With a tiny learning rate the point creeps. At 1.0 it bounces back and forth between two values forever, and above 1.0 it jumps further away each step and the loss explodes. ==The learning rate is the first setting to check when training misbehaves.==

### The training loop

Real networks have thousands to billions of parameters, and the gradient of the loss with respect to each one is found by [[backpropagation|The method that computes the gradient of the loss with respect to every parameter by passing information backwards through the network. You will work through it by hand in Week 3.]]. You do not need to compute it by hand yet: PyTorch does it when you call `loss.backward()`. Step through the five stages below.

```viz
{
  "type": "pipeline",
  "title": "The training loop",
  "intro": "Press Next to follow one pass of the loop. The loop repeats hundreds of times.",
  "nodes": [
    { "id": "batch", "label": "1. Data", "sub": "features + labels" },
    { "id": "predict", "label": "2. Predict", "sub": "forward pass" },
    { "id": "loss", "label": "3. Loss", "sub": "how wrong?" },
    { "id": "back", "label": "4. Backward", "sub": "gradients" },
    { "id": "update", "label": "5. Update", "sub": "w ← w − lr × g" }
  ],
  "steps": [
    { "title": "Take the training data", "body": "Feed the model the features of some training examples (a batch). The labels are kept aside to be used in step 3.", "active": ["batch"], "example": "Features of 300 training points, each with two numbers." },
    { "title": "Predict", "body": "Run the features through the network (the forward pass) to get a prediction for each example.", "active": ["predict"], "example": "The network outputs a score for each point; a positive score means class 1." },
    { "title": "Measure the loss", "body": "Compare predictions with the labels using the loss function. One number says how wrong the model is right now.", "active": ["loss"], "example": "At the start, a model that always says 50% gives a cross-entropy loss of ln 2 = 0.693." },
    { "title": "Backward pass", "body": "Compute the gradient of the loss with respect to every parameter. Each gradient says how that parameter should change to reduce the loss.", "active": ["back"], "example": "In PyTorch: loss.backward() fills in every parameter's gradient." },
    { "title": "Update and repeat", "body": "Move every parameter a small step against its gradient, clear the gradients, and go back to step 1. The loss should drift down.", "active": ["update", "batch"], "example": "w ← 0 − 0.1 × (−6) = 0.6. In PyTorch: optimizer.step()." }
  ]
}
```

Most beginner bugs are in this loop: forgetting to clear the gradients (`opt.zero_grad()`), or evaluating without turning gradients off. You will write it yourself in the lab.

## Key takeaways {rail=Takeaway}

- ==Supervised learning uses labelled examples.== A model with adjustable parameters is trained to make a loss small, and then judged on data it has not seen.
- ==A neuron is a weighted sum plus a bias, passed through an activation.== One neuron draws one straight line, so it cannot solve XOR.
- ==A hidden layer builds new features==, which lets a network solve problems no single line can. Parameters in a layer: inputs × neurons + neurons.
- ==Training is gradient descent==: step each parameter against its gradient. The learning rate sets the step size, and too large a rate makes training diverge.

## Lab: train a small neural network on noisy XOR {rail=Laboratory}

Build the five-step training loop yourself and ==train a two-layer network in PyTorch that solves a noisy XOR problem==, then explore how learning rate and hidden size change the result. Time: 3 hours. This is DL Lab 1.

### Setup

1. Log in to the portal, start JupyterLab, and create `week02/lab2.ipynb`.
2. No internet and no `pip install`. This lab needs only `torch`, `numpy` and `matplotlib`, and it runs on the CPU, so you do not need to touch the shared GPU.
3. No models or datasets are downloaded: you generate the data yourself. Your instructor's lab notebook is the graded version of DL Lab 1; use this page to prepare.

### Step-by-step tasks

1. *One neuron by hand and in code (15 min).*
```python
import torch, torch.nn as nn
import numpy as np, matplotlib.pyplot as plt

x = torch.tensor([2.0, 1.0]); w = torch.tensor([0.5, -1.0]); b = torch.tensor(0.25)
z = (w * x).sum() + b
print(z.item(), torch.sigmoid(z).item())      # 0.25 and about 0.5622
y = torch.tensor([3.0, 5.0, 2.0]); p = torch.tensor([2.5, 5.5, 4.0])
print(((y - p) ** 2).mean().item())            # 1.5
```
   *Exercise 1:* change the bias to −0.25 and the first weight to 1.5 and predict the new output on paper before you run it.
2. *Make and split the data (20 min).* Points in the square from −1 to 1; the label is 1 when x₁ and x₂ have opposite signs. Noise is added to the positions, so some labels end up on the wrong side.
```python
torch.manual_seed(0)
n = 400
X = torch.rand(n, 2) * 2 - 1
y = ((X[:, 0] * X[:, 1]) < 0).float()          # label 1 when the signs differ
X = X + 0.1 * torch.randn(n, 2)                 # noisy positions
idx = torch.randperm(n)
tr, va = idx[:300], idx[300:]
Xtr, ytr, Xva, yva = X[tr], y[tr], X[va], y[va]
plt.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=12); plt.show()
```
   *Exercise 2:* the four quadrants form an XOR pattern. Why should a model with no hidden layer score about 50%?
3. *The model and the training loop (40 min).*
```python
def train(H=4, lr=0.1, epochs=2000, seed=0, X=Xtr, y=ytr):
    torch.manual_seed(seed)
    model = nn.Sequential(nn.Linear(2, H), nn.Tanh(), nn.Linear(H, 1))
    opt = torch.optim.SGD(model.parameters(), lr=lr)
    loss_fn = nn.BCEWithLogitsLoss()
    losses = []
    for epoch in range(epochs):
        logits = model(X).squeeze(1)            # 1. predict
        loss = loss_fn(logits, y)               # 2. loss
        opt.zero_grad(); loss.backward()        # 3. clear old gradients, 4. backward
        opt.step()                              # 5. update
        losses.append(loss.item())
    return model, losses

def accuracy(model, X, y):
    with torch.no_grad():
        return (model(X).squeeze(1) > 0).float().eq(y).float().mean().item()

model, losses = train()
print(sum(p.numel() for p in model.parameters()))      # 17
print(losses[0], losses[-1], accuracy(model, Xtr, ytr), accuracy(model, Xva, yva))
plt.plot(losses); plt.xlabel("epoch"); plt.ylabel("loss"); plt.show()
```
   *Exercise 3:* label each line of the loop with the stage (1–5) in the training-loop figure. Why does `BCEWithLogitsLoss` take raw scores rather than probabilities?
4. *Plot the decision boundary (30 min).*
```python
def plot_boundary(model, X, y):
    g = torch.linspace(-1.5, 1.5, 200)
    gx, gy = torch.meshgrid(g, g, indexing="xy")
    grid = torch.stack([gx.reshape(-1), gy.reshape(-1)], dim=1)
    with torch.no_grad():
        prob = torch.sigmoid(model(grid)).reshape(200, 200)
    plt.contourf(gx.numpy(), gy.numpy(), prob.numpy(), levels=[0, 0.5, 1], alpha=0.3, cmap="coolwarm")
    plt.scatter(X[:, 0], X[:, 1], c=y, cmap="coolwarm", s=12); plt.show()

plot_boundary(model, Xva, yva)
```
   *Exercise 4:* describe the shape of the boundary. How many of the four quadrants does the network get right? Where do the mistakes cluster, and why?
5. *Experiments: hidden size and learning rate (45 min).*
```python
for H in [1, 2, 4, 16]:
    m, l = train(H=H)
    print("H =", H, "loss", round(l[-1], 3), "train", round(accuracy(m, Xtr, ytr), 3), "val", round(accuracy(m, Xva, yva), 3))

for lr in [0.01, 0.1, 1.0]:
    m, l = train(lr=lr)
    print("lr =", lr, "loss", round(l[-1], 3), "val", round(accuracy(m, Xva, yva), 3))
```
   *Exercise 5:* write a short table of the results. Which hidden size is the smallest that works well? What happens with lr = 0.01 after 2000 epochs, and why?
6. *Overfitting on purpose (20 min).* Train on only 20 points with a wide network and compare training and validation accuracy.
```python
m, l = train(H=64, epochs=3000, X=Xtr[:20], y=ytr[:20])
print("train", accuracy(m, Xtr[:20], ytr[:20]), "val", accuracy(m, Xva, yva))
plot_boundary(m, Xva, yva)
```
   *Exercise 6:* explain in two or three sentences what you see, using the words overfitting and generalisation. Does the boundary look sensible?
7. *Reflection (10 min).* In a markdown cell: (a) the one setting you would check first if a loss curve did not fall, (b) why we measure accuracy on the validation set, not the training set.

### What you should see

- Step 1: `0.25` and about `0.5622`, then `1.5`.
- Step 3: 17 parameters. The first loss is near 0.7 (about ln 2 = 0.693, because the untrained network is close to guessing 50%). After 2000 epochs the loss is clearly lower, roughly 0.15 to 0.3, and validation accuracy is roughly 85% to 95%. Because the labels are noisy near the axes, do not expect 100%.
- Step 5: with H = 1 the accuracy stays low (about 55% to 70%), because one hidden neuron can only build one line. H = 4 and H = 16 reach roughly 85% to 95%. With lr = 0.01 the loss is still close to 0.65 or higher after 2000 epochs: the steps are too small. Exact values change with the seed.
- Step 6: training accuracy at or near 100% (20 points are easy to memorise), validation accuracy lower, often somewhere in the 80s, with a wobblier boundary. The gap is smaller than in the table above, because this problem is simple; the pattern is what matters.

### Common mistakes

- Forgetting `opt.zero_grad()`. Gradients add up between iterations, so the updates go wrong.
- Giving `BCEWithLogitsLoss` targets of shape `(n, 1)` while the model output is squeezed to `(n,)` (or the other way round). Here both are 1-D.
- Calling `accuracy` without `torch.no_grad()` or comparing probabilities with 0 instead of scores with 0. A score above 0 means a probability above 0.5.
- Judging the model by training accuracy only. Always look at validation accuracy as well.
- Changing several settings at once, so you cannot tell which one caused the change.

### Go further: UvA notebook

If you want more practice with PyTorch tensors, autograd (the automatic gradient computation behind `loss.backward()`) and training a small network on noisy XOR, work through [Tutorial 2, Introduction to PyTorch](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial2/Introduction_to_PyTorch.html). It covers tensors, the computation graph, running on a GPU, a small network (linear, tanh, linear) trained with `BCEWithLogitsLoss` and SGD, the `DataLoader`, saving a model and TensorBoard. It is a web page and notebook you can read online, so read it on your laptop; ask your instructor which of its packages are installed on the Spark before you try to run it there. Tutorial 2 by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence).

### Deliverables

Submit your notebook through the portal with outputs visible: the loss curve, two decision-boundary plots, the table from Exercise 5, and the answers to Exercises 1–6 and the reflection. Your instructor announces the due date.

| Criterion | Points |
|---|---|
| Neuron and MSE computed correctly (Step 1) | 10 |
| Data and split correct, plot shown (Step 2) | 10 |
| Working training loop, loss falls (Step 3) | 25 |
| Decision boundary plot and explanation (Step 4) | 15 |
| Hidden size and learning-rate experiments with a results table (Step 5) | 20 |
| Overfitting experiment and explanation (Step 6) | 10 |
| Reflection and code quality | 10 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. Two of them ask you to compute something, so keep paper handy.

```quiz
{
  "id": "week-02-check",
  "title": "Week 2 quiz: Machine learning and neural networks",
  "passMark": 70,
  "questions": [
    {
      "q": "In supervised learning, what is a label?",
      "options": [
        "A column of numbers the model computes inside a hidden layer.",
        "The correct answer attached to a training example, which the model learns to predict.",
        "The name of the Python variable that holds the data.",
        "A setting such as the learning rate."
      ],
      "answer": 1,
      "why": "The label is the right answer for an example (a price, a category). The model's inputs are the features, and settings like the learning rate are chosen by you, not learned."
    },
    {
      "q": "A neuron has inputs x = (2, 1), weights w = (0.5, −1), bias b = 0.25 and a sigmoid activation. What is its output, to two decimals?",
      "options": [
        "0.25",
        "0.44",
        "0.91",
        "0.56"
      ],
      "answer": 3,
      "why": "z = 0.5×2 + (−1)×1 + 0.25 = 0.25 and sigmoid(0.25) = 0.562. The value 0.25 is z before the activation; 0.91 comes from forgetting the minus sign on the second weight; 0.44 is 1 − 0.56."
    },
    {
      "q": "A model predicts (2.5, 5.5, 4) for true values (3, 5, 2). What is the mean squared error?",
      "options": [
        "1.5",
        "1.0",
        "4.5",
        "1.22"
      ],
      "answer": 0,
      "why": "The squared errors are 0.25, 0.25 and 4, which sum to 4.5; divide by 3 to get 1.5. The value 1.0 is the mean absolute error, 4.5 forgets to average, and 1.22 is the square root of the MSE."
    },
    {
      "q": "Why can a single neuron not solve XOR?",
      "options": [
        "XOR needs more than two inputs.",
        "A neuron cannot have a bias.",
        "The sigmoid function does not work with two inputs.",
        "A neuron separates classes with one straight line, and no straight line splits the XOR classes."
      ],
      "answer": 3,
      "why": "The decision boundary of one neuron is a line w₁x + w₂y + b = 0. For XOR the best line gets only 3 of 4 points right. A hidden layer fixes this."
    },
    {
      "q": "A model scores 99% on the training set and 71% on the validation set. What is the best description?",
      "options": [
        "Underfitting: the model is too simple.",
        "The learning rate is exactly right.",
        "Overfitting: it has fitted the training data too closely and generalises poorly.",
        "The validation labels must be wrong."
      ],
      "answer": 2,
      "why": "A large gap between training and validation scores is the sign of overfitting. Underfitting would show low scores on both sets."
    },
    {
      "q": "Why do we keep a test set that is never used during training or tuning?",
      "options": [
        "So that training runs faster.",
        "To make the training loss smaller.",
        "Because the model needs a second copy of the data.",
        "To get an honest final estimate of how the model does on new data."
      ],
      "answer": 3,
      "why": "If you tune your settings using the test set, its score is no longer a fair estimate. Keeping it untouched until the end protects that."
    },
    {
      "q": "For L(w) = (w − 3)², you start at w = 0 with learning rate 0.1. What is w after one gradient-descent step?",
      "options": [
        "0.6",
        "−0.6",
        "6.0",
        "0.06"
      ],
      "answer": 0,
      "why": "The gradient is 2(0 − 3) = −6, so new w = 0 − 0.1×(−6) = 0.6. The sign is positive because the loss falls as w increases; 0.06 and 6.0 mix up the learning rate."
    },
    {
      "q": "With the same loss L(w) = (w − 3)² and learning rate 1.0, starting at w = 0, what happens?",
      "options": [
        "It reaches w = 3 in one step.",
        "It stays at w = 0.",
        "It bounces between w = 0 and w = 6 and never settles.",
        "It converges slowly to w = 3."
      ],
      "answer": 2,
      "why": "The first step goes 0 − 1×(−6) = 6. There the gradient is +6, so the next step goes 6 − 6 = 0, and so on. The step multiplier is 1 − 2×lr = −1, so the distance to 3 never shrinks."
    },
    {
      "q": "How many parameters (weights and biases) does a network with 2 inputs, one hidden layer of 4 neurons and 1 output neuron have?",
      "options": [
        "13",
        "17",
        "12",
        "9"
      ],
      "answer": 1,
      "why": "Hidden layer: 2×4 weights + 4 biases = 12. Output: 4×1 weights + 1 bias = 5. Total 17. The value 12 counts only the first layer, and 13 forgets the 4 hidden biases."
    },
    {
      "q": "You want to predict tomorrow's rainfall in millimetres from today's weather measurements. What kind of task is it?",
      "options": [
        "Regression: the label is a number.",
        "Classification: the label is a category.",
        "Unsupervised learning: there are no labels.",
        "Generation: the model must create an image."
      ],
      "answer": 0,
      "why": "The answer is a number, so this is regression. Past days have known rainfall, so the data are labelled and it is not unsupervised."
    }
  ]
}
```

## How Week 2 is assessed

Your lab is marked out of 100 using the table in the lab section. Laboratories and knowledge checks run through the term, with the Prelim exam in Week 5. Your instructor announces the component weights and due dates. The graded knowledge check for this week is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave (your instructor will use them to open Week 3):
1. What are a feature, a label and a loss?
2. Why can a single neuron not solve XOR, and what fixes it?
3. What happens if the learning rate is too large?

**Homework / self-study**
- Finish any unfinished lab exercises, including the overfitting experiment.
- Redo the neuron calculation and the gradient-descent step by hand with different numbers of your own, and check them in Python.
- Preview Week 3: revise the derivative of x² and the idea of the chain rule from your maths course.
