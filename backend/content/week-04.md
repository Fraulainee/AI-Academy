> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 4 — Convolutional Neural Networks

**Purpose:** See why a network for pictures should ==slide one small shared filter across the whole image== instead of connecting every pixel to every neuron, and learn to compute that operation by hand.

**Term:** Prelim (Weeks 1–5) · **Month:** 1 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a filter slide over a picture",
  "caption": "A small filter slides over an image and writes one number at each position. The grid and the filter in the first scene are real arithmetic. The bars in the last scene are made up to show what a trained network might output.",
  "scenes": [
    { "name": "Sliding filter", "kind": "conv", "outputLabel": "Edge map", "prompt": "A 3×3 vertical-edge filter moves over a tiny image", "grid": [ [0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9]] },
    { "name": "Why share", "kind": "text", "outputLabel": "Parameters needed", "prompt": "A 28×28 picture has 784 pixel values. How many weights to look at it?", "output": "A fully connected layer with 100 units: 78,500. A 3×3 convolution with 8 filters: 80." },
    { "name": "After training", "kind": "bars", "outputLabel": "Probability for each class", "prompt": "A photo shown to a trained CNN (illustrative)", "bars": [ { "label": "cat", "value": 0.81 }, { "label": "dog", "value": 0.13 }, { "label": "fox", "value": 0.06 } ] }
  ]
}
```

## By the end, you can…

1. Explain ==why fully connected layers fit images poorly==: too many parameters and no use of the picture's layout.
2. Explain ==local connectivity and weight sharing== and why they let a CNN find the same pattern anywhere in an image.
3. ==Compute a convolution by hand==, including stride and padding, and use the output-size formula.
4. Follow the shape of a tensor through a small CNN (convolution, ReLU, pooling, flatten, fully connected) and count its parameters.
5. Build and train a small CNN in PyTorch and compare it with a fully connected network of similar size.

Assessed in the Week 4 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## Images are grids of numbers {rail=Images}

{lede} A computer sees a picture as a grid of numbers, and a network that ignores this layout wastes its parameters. A [[convolutional neural network (CNN)|A neural network that uses convolution layers: small filters slid across the image with the same weights at every position. CNNs are the standard design for image tasks.]] ==reuses one small filter at every position==, so it needs far fewer parameters and finds a pattern wherever it appears.

### From pixels to numbers

A greyscale picture 28 pixels wide and 28 tall holds 28 × 28 = 784 numbers, one brightness per [[pixel|One small square of an image. In a greyscale image it holds one number for brightness; in a colour image it holds three (red, green, blue).]]. A colour photo of 224 × 224 pixels has three [[channels|The layers of numbers that make up an image or a feature map. A colour image has 3 channels (red, green, blue).]], so it holds 224 × 224 × 3 = 150,528 numbers.

### Why fully connected layers fit images poorly

In Week 2 every neuron in a layer connected to every input. Try that on a 28 × 28 image with a hidden layer of 100 neurons. Each neuron needs 784 weights and a bias, so the layer has 784 × 100 + 100 = **78,500 parameters**. For the 224 × 224 × 3 photo the same layer needs 150,528 × 100 + 100 = **15,052,900 parameters**, just for one layer. There are two problems:

- **Too many parameters.** More parameters need more data and more memory, and they overfit more easily.
- **No sense of layout.** The layer treats pixel 1 and pixel 500 as unrelated numbers in a list. If a cat's ear moves two pixels to the left, a fully connected layer sees almost a different input and has to learn the ear again for every position.

A CNN uses two ideas. With [[local connectivity|Each neuron looks only at a small patch of the input, such as 3×3 pixels, instead of at every pixel.]], each neuron looks only at a small patch. With [[weight sharing|Using the same weights at every position in the image, so a pattern learned in one place is recognised everywhere.]], the same small set of weights, called a [[kernel|A small grid of weights (for example 3×3) that slides over the input. Also called a filter. It acts as a pattern detector.]], is applied at every position. Drag the sliders and compare.

```viz
{
  "type": "calc",
  "title": "Parameters: fully connected or convolution?",
  "kind": "fc_vs_conv",
  "channels": 1,
  "filters": 8,
  "kernel": 3
}
```

At 28 × 28 with 100 units, the fully connected layer has 78,500 parameters and the convolution with eight 3 × 3 filters has only 3 × 3 × 1 × 8 + 8 = **80**, about 980 times fewer. Slide the image size up: the fully connected count explodes, but the convolution stays at 80, because the same kernels are reused everywhere. ==The convolution's parameter count does not depend on the image size.==

## The convolution operation {rail=Convolution}

{lede} A [[convolution|The operation of sliding a kernel over an image; at each position, multiply the kernel with the patch under it and add up the results to get one output number.]] is simple arithmetic: ==place the kernel on a patch of the image, multiply matching numbers, add them up, write the result, then slide one step==. (Deep-learning libraries compute this without flipping the kernel, which is what the figures below do; strictly this is called cross-correlation, but everyone calls it convolution.)

### A worked example

Take a 5 × 5 image whose left three columns are bright (9) and right two columns are dark (0), and this 3 × 3 kernel:

| 1 | 0 | −1 |
|---|---|---|
| 1 | 0 | −1 |
| 1 | 0 | −1 |

The kernel adds the left column of the patch and subtracts the right column, so it responds to a bright-to-dark vertical edge. The first position (top-left) covers columns 1–3, which are all 9. Left column sums to 27, right column sums to 27, so the output is 27 − 27 = **0**: no edge. One step right, the patch covers columns 2–4: the left column is 9, 9, 9 = 27, the right column is 0, so the output is **27**: an edge. Use the figure to slide the kernel over every position and see the 3 × 3 result.

```viz
{
  "type": "conv",
  "title": "Convolution by hand: a vertical-edge filter",
  "mode": "conv",
  "stride": 1,
  "padding": 0,
  "input": [ [9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0],[9,9,9,0,0]],
  "kernel": [ [1,0,-1],[1,0,-1],[1,0,-1]]
}
```

The result is [0, 27, 27] in each row. The output is 0 where the patch is flat and large where the patch contains the edge. The filter *detected* the edge. ==A trained CNN learns its kernel values from data instead of having them written by hand.== The output grid is a [[feature map|The grid of numbers a kernel produces as it slides over the input. It shows where in the image that kernel's pattern was found.]]. A layer with 8 kernels produces 8 feature maps, which are stacked as 8 channels.

### Stride, padding and output size

The [[stride|How many pixels the kernel moves between positions. Stride 1 moves one pixel; stride 2 skips every other position and halves the output size.]] is how far the kernel moves each time. [[Padding|Adding a border of zeros around the image so the kernel can also be centred on edge pixels. It lets the output keep the input's size.]] adds a border of zeros. For an input of size n, kernel k, padding p and stride s:

**output size = ⌊(n + 2p − k) / s⌋ + 1** (⌊ ⌋ means rounding down)

Check it: the 5 × 5 image above, k = 3, p = 0, s = 1 gives ⌊2/1⌋ + 1 = 3, a 3 × 3 output. A 28 × 28 image with k = 3, p = 1, s = 1 gives ⌊(28 + 2 − 3)/1⌋ + 1 = 28, so padding 1 keeps the size. With k = 5, p = 2, s = 2 you get ⌊(28 + 4 − 5)/2⌋ + 1 = 13 + 1 = 14: half the size. Now use stride 2 and padding 1 on a 6 × 6 image whose left half is dark and right half bright.

```viz
{
  "type": "conv",
  "title": "Stride 2 and padding 1",
  "mode": "conv",
  "stride": 2,
  "padding": 1,
  "input": [ [0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9],[0,0,0,9,9,9]],
  "kernel": [ [1,0,-1],[1,0,-1],[1,0,-1]]
}
```

The size is ⌊(6 + 2 − 3)/2⌋ + 1 = 3, so a 3 × 3 output. Two things to notice. The numbers are negative: this image goes dark-to-bright, the opposite of what the kernel looks for, so the response flips sign. And the top row shows −18 instead of −27 because the padding row of zeros replaced one row of real pixels (two rows × 9 = 18). ==Padding adds zeros, so edge outputs see less of the image.==

For a colour image the kernel is 3-dimensional: a 3 × 3 kernel over 3 channels has 3 × 3 × 3 = 27 weights plus 1 bias. In general a convolution layer with C_in input channels and C_out filters of size k × k has **k × k × C_in × C_out + C_out** parameters.

## Stacking layers into a CNN {rail=CNN stack}

{lede} A typical CNN repeats a small block, ==convolution, then ReLU, then pooling==, and ends with a fully connected layer that turns the features into class scores. Each block makes the picture smaller and the number of channels bigger.

[[Pooling|A step that shrinks a feature map by replacing each small block with one number. Max pooling keeps the largest value in the block.]] shrinks the feature map. In 2 × 2 max pooling with stride 2, split the map into 2 × 2 blocks and keep the biggest number in each. For the 4 × 4 map [ [1,3,2,0],[4,2,1,5],[0,1,3,2],[2,6,1,1]], the four blocks give 4, 5, 6 and 3, so the result is the 2 × 2 map [ [4,5],[6,3]]. Pooling has no weights to learn. It halves the width and height, and it makes the network a little less sensitive to small shifts of a pattern.

Follow a 28 × 28 greyscale image through a small CNN. The two numbers in each step are the tensor shape (height × width × channels) and the number of parameters.

```viz
{
  "type": "pipeline",
  "title": "Shapes through a small CNN",
  "intro": "Press Next to follow one image through the network. Watch the height and width shrink while the channels grow.",
  "nodes": [
    { "id": "in", "label": "Input", "sub": "28×28×1" },
    { "id": "c1", "label": "Conv 3×3, 8", "sub": "28×28×8" },
    { "id": "p1", "label": "Max pool 2×2", "sub": "14×14×8" },
    { "id": "c2", "label": "Conv 3×3, 16", "sub": "14×14×16" },
    { "id": "p2", "label": "Max pool 2×2", "sub": "7×7×16" },
    { "id": "fl", "label": "Flatten", "sub": "784" },
    { "id": "fc", "label": "Fully connected", "sub": "10 scores" }
  ],
  "steps": [
    { "title": "Input image", "body": "A greyscale digit, 28 pixels by 28, with 1 channel: 784 numbers.", "active": ["in"], "example": "28 × 28 × 1" },
    { "title": "Convolution 1 + ReLU", "body": "Eight 3×3 kernels, padding 1, stride 1. Output size is ⌊(28 + 2 − 3)/1⌋ + 1 = 28, with 8 channels. Parameters: 3×3×1×8 + 8 = 80. ReLU keeps the shape.", "active": ["in", "c1"], "example": "28 × 28 × 8, 80 parameters" },
    { "title": "Max pooling 1", "body": "2×2 max pooling with stride 2 halves height and width: 28 / 2 = 14. The channels stay at 8. No parameters.", "active": ["c1", "p1"], "example": "14 × 14 × 8, 0 parameters" },
    { "title": "Convolution 2 + ReLU", "body": "Sixteen 3×3 kernels, each spanning all 8 input channels, padding 1. Output 14×14 with 16 channels. Parameters: 3×3×8×16 + 16 = 1,168.", "active": ["p1", "c2"], "example": "14 × 14 × 16, 1,168 parameters" },
    { "title": "Max pooling 2", "body": "Halve again: 14 / 2 = 7. The feature maps are now 7 × 7 with 16 channels.", "active": ["c2", "p2"], "example": "7 × 7 × 16, 0 parameters" },
    { "title": "Flatten", "body": "Unroll the 7 × 7 × 16 feature maps into one long vector: 7 × 7 × 16 = 784 numbers.", "active": ["p2", "fl"], "example": "784 numbers" },
    { "title": "Fully connected layer", "body": "One layer turns 784 numbers into 10 class scores. Parameters: 784×10 + 10 = 7,850. The whole network has 80 + 1,168 + 7,850 = 9,098 parameters.", "active": ["fl", "fc"], "example": "10 scores, 7,850 parameters" }
  ]
}
```

The whole network has **9,098 parameters**. A fully connected network with one hidden layer of 100 units on the same 784 inputs and 10 outputs has 784 × 100 + 100 + 100 × 10 + 10 = 79,510 parameters, about 9 times more. Early convolutions find simple patterns such as edges. Later ones combine them, and each neuron in a later layer effectively sees a bigger part of the picture. Sort the jobs below to check that you can tell the three layer types apart.

```viz
{
  "type": "sorter",
  "title": "Which layer does this job?",
  "intro": "Sort each description into a layer type.",
  "bins": [
    { "id": "conv", "label": "Convolution" },
    { "id": "pool", "label": "Pooling" },
    { "id": "fc", "label": "Fully connected" }
  ],
  "cards": [
    { "name": "Slides a small kernel over the image to detect patterns such as edges", "answer": "conv", "why": "Sliding learned kernels is the definition of a convolution layer." },
    { "name": "Keeps the largest number in each 2×2 block", "answer": "pool", "why": "That is max pooling. It halves height and width." },
    { "name": "Turns the final features into class scores", "answer": "fc", "why": "Usually the last layers: every feature connects to every class score." },
    { "name": "Uses the same weights at every position in the image", "answer": "conv", "why": "Weight sharing is what makes convolutions cheap and lets them find a pattern anywhere." },
    { "name": "Has no learnable weights at all", "answer": "pool", "why": "Max pooling only takes a maximum. There is nothing to train." },
    { "name": "Every output is connected to every input", "answer": "fc", "why": "That is what fully connected means, and why its parameter count is large." },
    { "name": "Increases the number of channels (for example 8 to 16)", "answer": "conv", "why": "The number of filters chooses the number of output channels." },
    { "name": "Makes the network a little tolerant to small shifts of a pattern", "answer": "pool", "why": "Keeping only the maximum in a block means a small shift often leaves the output unchanged." }
  ]
}
```

### Going deeper: residual connections

Early CNNs such as LeNet (LeCun et al., 1998), which read handwritten digits, had a handful of layers. In 2012, AlexNet (Krizhevsky et al.) showed that a deep CNN trained on GPUs could win a large image-recognition contest. Making CNNs much deeper ran into the gradient problems from Week 3. ResNet (He et al., 2015) added the shortcut you met last week: each block outputs x + F(x), so the gradient has a direct path back and very deep networks train. You can try this in the UvA notebook linked in the lab.

## Key takeaways {rail=Takeaway}

- ==A fully connected layer on an image needs huge numbers of parameters and ignores layout.== A 28×28 image with 100 units already needs 78,500.
- ==Local connectivity and weight sharing== let a small kernel be reused at every position: 80 parameters instead of 78,500, and the same pattern is found wherever it appears.
- ==A convolution is multiply-and-add under a sliding kernel.== The output size is ⌊(n + 2p − k) / s⌋ + 1, and a layer has k × k × C_in × C_out + C_out parameters.
- A CNN stacks ==convolution, ReLU and pooling blocks, then flattens and uses a fully connected layer==. Height and width shrink, channels grow.

## Lab: build and train a small CNN {rail=Laboratory}

Compute a convolution by hand and ==verify it with PyTorch==, check the output-size formula, then train a small CNN and a similar-sized fully connected network on 8×8 handwritten digits and compare them. Time: 3 hours. This is DL Lab 4B, Part 1.

### Setup

1. Log in to the portal, start JupyterLab, and create `week04/lab4.ipynb`.
2. No internet and no `pip install`. This lab needs `torch`, `numpy`, `matplotlib` and `scikit-learn`. It runs on the CPU, so you do not need the shared GPU.
3. The dataset is `sklearn.datasets.load_digits`, which ships inside scikit-learn: 1,797 greyscale images of digits, each 8 × 8 pixels with values 0 to 16. Nothing is downloaded. Your instructor's lab notebook is the graded version of DL Lab 4B Part 1; use this page to prepare.

### Step-by-step tasks

1. *Convolution by hand and with PyTorch (30 min).*
```python
import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np, matplotlib.pyplot as plt

A = torch.tensor([ [9, 9, 9, 0, 0]] * 5, dtype=torch.float32).reshape(1, 1, 5, 5)
K = torch.tensor([ [1, 0, -1]] * 3, dtype=torch.float32).reshape(1, 1, 3, 3)
print(F.conv2d(A, K).squeeze())            # three rows of [0, 27, 27]

def conv2d_manual(img, ker, stride=1, pad=0):
    img = np.pad(img, pad); k = ker.shape[0]
    n = (img.shape[0] - k) // stride + 1
    out = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            out[i, j] = (img[i*stride:i*stride+k, j*stride:j*stride+k] * ker).sum()
    return out

a2 = np.array([ [0, 0, 0, 9, 9, 9]] * 6, dtype=float); k2 = np.array([ [1, 0, -1]] * 3, dtype=float)
print(conv2d_manual(a2, k2, stride=2, pad=1))
print(F.conv2d(torch.tensor(a2).reshape(1, 1, 6, 6).float(), torch.tensor(k2).reshape(1, 1, 3, 3).float(), stride=2, padding=1).squeeze())
```
   *Exercise 1:* change the image so every row reads 0, 0, 9, 9, 9 (dark on the left, bright on the right). Compute the first output row by hand, then check your prediction with `F.conv2d`. Why did the sign change?
2. *The output-size formula (20 min).*
```python
def out_size(n, k, p=0, s=1):
    return (n + 2 * p - k) // s + 1

for n, k, p, s in [(28, 3, 0, 1), (28, 3, 1, 1), (28, 5, 2, 2), (7, 3, 0, 2), (32, 3, 1, 2), (224, 7, 3, 2)]:
    real = nn.Conv2d(1, 1, k, stride=s, padding=p)(torch.zeros(1, 1, n, n)).shape[-1]
    print(n, k, p, s, "formula:", out_size(n, k, p, s), "PyTorch:", real)
```
   *Exercise 2:* predict by hand the output size for (n = 50, k = 5, p = 0, s = 1) and for (n = 10, k = 3, p = 0, s = 2), then add them to the list. Explain why `//` (rounding down) is needed in the second case.
3. *Load the digits, build both networks, count parameters (30 min).*
```python
from sklearn.datasets import load_digits
d = load_digits()
X = torch.tensor(d.images / 16.0, dtype=torch.float32).unsqueeze(1)   # (1797, 1, 8, 8)
y = torch.tensor(d.target)
torch.manual_seed(0)
idx = torch.randperm(len(X)); tr, va = idx[:1400], idx[1400:]

def make_cnn():
    return nn.Sequential(nn.Conv2d(1, 8, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
                         nn.Conv2d(8, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
                         nn.Flatten(), nn.Linear(64, 10))
def make_fc():
    return nn.Sequential(nn.Flatten(), nn.Linear(64, 25), nn.ReLU(), nn.Linear(25, 10))

count = lambda m: sum(p.numel() for p in m.parameters())
print(X.shape, count(make_cnn()), count(make_fc()))      # 1898 and 1885
```
   *Exercise 3:* show by hand where 1,898 comes from (conv 1: 80, conv 2: 1,168, linear: 650). Why do we choose a fully connected network with 25 hidden units?
4. *Train and compare (40 min).*
```python
def fit(model, epochs=30, lr=0.01):
    opt = torch.optim.Adam(model.parameters(), lr=lr); loss_fn = nn.CrossEntropyLoss()
    for ep in range(epochs):
        perm = tr[torch.randperm(len(tr))]
        for i in range(0, len(perm), 64):
            b = perm[i:i + 64]
            loss = loss_fn(model(X[b]), y[b])
            opt.zero_grad(); loss.backward(); opt.step()
    return model

def acc(model, Xs, ys):
    with torch.no_grad():
        return model(Xs).argmax(1).eq(ys).float().mean().item()

torch.manual_seed(0); cnn = fit(make_cnn())
torch.manual_seed(0); fc = fit(make_fc())
print("CNN", acc(cnn, X[va], y[va]), "FC", acc(fc, X[va], y[va]))
```
   *Exercise 4:* record both validation accuracies. Which won, and by how much? Adam is a variant of gradient descent that adapts the step size of each parameter; the training loop is the same five steps as in Week 2.
5. *What did the first layer learn? (15 min).*
```python
fig, axes = plt.subplots(1, 8, figsize=(12, 2))
for a, w in zip(axes, cnn[0].weight.detach()):
    a.imshow(w[0].numpy(), cmap="gray"); a.axis("off")
plt.show()
```
   *Exercise 5:* describe the eight 3 × 3 kernels. Do any look like edge detectors similar to the one you used in Step 1?
6. *Shifted images (25 min).* Shift every validation image one pixel to the right (wrapping around) and test both networks.
```python
Xs = torch.roll(X[va], shifts=1, dims=3)
print("shifted: CNN", acc(cnn, Xs, y[va]), "FC", acc(fc, Xs, y[va]))
```
   *Exercise 6:* before you run it, predict which network will lose more accuracy and why (think about weight sharing). Then report what you see. Run it with a second seed too.
7. *Shapes through the CNN (15 min).*
```python
x = torch.zeros(1, 1, 8, 8)
for layer in make_cnn():
    x = layer(x); print(type(layer).__name__, tuple(x.shape))
```
   *Exercise 7:* match each printed shape to the pipeline figure in the lesson. Why is the input to the final `Linear` layer 64 numbers?
8. *Reflection (10 min).* In a markdown cell: (a) one advantage of convolution over a fully connected layer for images, (b) why you should not read too much into a single run on a small dataset like this one.

### What you should see

- Step 1: three rows of `[0, 27, 27]`. For the stride 2, padding 1 case, a 3 × 3 result `[ [0, -18, 0], [0, -27, 0], [0, -27, 0]]` from both your function and PyTorch. For Exercise 1 the first output row is `[-27, -27, 0]`, negative because the pattern now goes from dark to bright.
- Step 2: formula and PyTorch agree on every row: 26, 28, 14, 3, 16, 112. Your own two predictions should be 46 and 4.
- Step 3: `torch.Size([1797, 1, 8, 8])`, then `1898 1885`.
- Step 4: both networks reach a high validation accuracy. Digits is an easy dataset, so expect the mid-to-high 90s for both, and a gap of only a few points between them (exact values vary with the seed).
- Step 6: both networks lose accuracy on shifted images. CNNs usually lose less than fully connected networks, but with tiny images and one run the result can be noisy, so report your own numbers.
- Step 7: `Conv2d (1, 8, 8, 8)`, `ReLU (1, 8, 8, 8)`, `MaxPool2d (1, 8, 4, 4)`, `Conv2d (1, 16, 4, 4)`, `ReLU (1, 16, 4, 4)`, `MaxPool2d (1, 16, 2, 2)`, `Flatten (1, 64)`, `Linear (1, 10)`.

### Common mistakes

- Forgetting the channel dimension. A conv layer expects `(batch, channels, height, width)`, so the digits need `.unsqueeze(1)`.
- Not scaling the pixels. The digits have values 0 to 16; dividing by 16 keeps inputs in a friendly range.
- Changing the padding or pooling and then leaving `nn.Linear(64, 10)` unchanged. Run Step 7 to find the new flattened size.
- Forgetting that PyTorch does not flip the kernel (it computes cross-correlation), so your hand calculation must not flip it either.
- Mixing up the class labels' type: `CrossEntropyLoss` needs integer labels (`long`), not floats.

### Go further: UvA notebook

[Tutorial 5, Inception, ResNet, DenseNet](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial5/Inception_ResNet_DenseNet.html) builds three well-known CNN designs in PyTorch: parallel 1×1, 3×3 and 5×5 branches with 1×1 reductions (Inception), residual connections x_{l+1} = x_l + F(x_l) (ResNet) and dense connectivity (DenseNet), and compares parameters and accuracy on CIFAR10. It downloads CIFAR10 and checkpoints from the internet, so read it on your laptop or ask your instructor to pre-download the data for the Spark. Tutorial 5 by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence).

### Deliverables

Submit your notebook through the portal with outputs visible: the hand calculation, the verification, the output-size table, the parameter counts, the accuracy comparison, the kernel plot, and the answers to Exercises 1–7 and the reflection. Your instructor announces the due date.

| Criterion | Points |
|---|---|
| Convolution by hand matches PyTorch (Step 1) | 20 |
| Output-size formula table and two predictions (Step 2) | 10 |
| Both networks built, parameter counts explained (Step 3) | 15 |
| Training and accuracy comparison (Step 4) | 20 |
| Kernel plot and shifted-image experiment with reasoning (Steps 5–6) | 15 |
| Shapes matched to the pipeline figure (Step 7) | 10 |
| Reflection and code quality | 10 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. Five of them ask you to compute something, so keep paper handy.

```quiz
{
  "id": "week-04-check",
  "title": "Week 4 quiz: Convolutional neural networks",
  "passMark": 70,
  "questions": [
    {
      "q": "Why is a fully connected layer a poor fit for images?",
      "options": [
        "It cannot use ReLU.",
        "It can only handle black-and-white images.",
        "It cannot be trained with gradient descent.",
        "It needs very many parameters and ignores how nearby pixels relate to each other."
      ],
      "answer": 3,
      "why": "Every pixel connects to every neuron, so parameters explode with image size, and the layer treats pixels as an unordered list instead of using the grid layout."
    },
    {
      "q": "How many parameters does a fully connected layer with 100 units have on a 28 × 28 greyscale image?",
      "options": [
        "78,400",
        "78,500",
        "7,850",
        "784"
      ],
      "answer": 1,
      "why": "784 × 100 weights plus 100 biases gives 78,500. The value 78,400 forgets the biases, 7,850 is the count for 10 units, and 784 is just the number of pixels."
    },
    {
      "q": "A convolution layer has eight 3 × 3 filters on a 1-channel input. How many parameters does it have?",
      "options": [
        "9",
        "72",
        "80",
        "640"
      ],
      "answer": 2,
      "why": "3 × 3 × 1 × 8 = 72 weights plus 8 biases = 80. The value 72 forgets the biases, and 9 is the weights of a single kernel."
    },
    {
      "q": "A 28 × 28 image goes through a convolution with kernel 5, padding 2 and stride 2. What is the output height?",
      "options": [
        "14",
        "28",
        "13",
        "12"
      ],
      "answer": 0,
      "why": "⌊(28 + 4 − 5) / 2⌋ + 1 = ⌊13.5⌋ + 1 = 13 + 1 = 14. The value 13 forgets the +1."
    },
    {
      "q": "The kernel [ [1,0,−1],[1,0,−1],[1,0,−1]] is placed on the patch [ [2,5,1],[2,5,1],[2,5,1]]. What number does the convolution write?",
      "options": [
        "0",
        "15",
        "9",
        "3"
      ],
      "answer": 3,
      "why": "Each row gives 1×2 + 0×5 + (−1)×1 = 1, and the three rows add up to 3. The middle column is multiplied by 0, so the 5s do not matter."
    },
    {
      "q": "What does weight sharing mean in a convolution layer?",
      "options": [
        "Several networks share the same data set.",
        "The same kernel weights are used at every position in the image.",
        "All the layers of the network have the same weights.",
        "The weights are copied from the previous epoch."
      ],
      "answer": 1,
      "why": "One small kernel is reused everywhere, which is why the parameter count does not grow with image size and a pattern can be found wherever it is."
    },
    {
      "q": "A feature map of shape 28 × 28 × 8 goes through 2 × 2 max pooling with stride 2. What is the new shape?",
      "options": [
        "14 × 14 × 8",
        "14 × 14 × 16",
        "28 × 28 × 4",
        "7 × 7 × 8"
      ],
      "answer": 0,
      "why": "Pooling halves height and width (28 / 2 = 14) and leaves the channels at 8. It has no parameters and does not change the number of channels."
    },
    {
      "q": "In the lesson's CNN, the last pooling gives a 7 × 7 × 16 map. How many numbers does the flatten step produce?",
      "options": [
        "112",
        "49",
        "784",
        "16"
      ],
      "answer": 2,
      "why": "7 × 7 × 16 = 784. Flatten just unrolls the map into one vector, which then feeds the fully connected layer."
    },
    {
      "q": "What is one benefit of max pooling?",
      "options": [
        "It adds learnable weights that make the network more accurate.",
        "It shrinks the feature map and makes the output a little less sensitive to small shifts.",
        "It increases the number of channels.",
        "It removes the need for activation functions."
      ],
      "answer": 1,
      "why": "Keeping only the largest value in each block reduces size and tolerates small shifts. Pooling has no weights and does not change the channels."
    },
    {
      "q": "What does the residual connection x + F(x) in ResNet help with?",
      "options": [
        "It makes the images larger.",
        "It lets the network skip the loss function.",
        "It reduces the number of colour channels.",
        "It gives the gradient a direct path back, so very deep networks can be trained."
      ],
      "answer": 3,
      "why": "The shortcut has slope 1, so gradient reaches early layers even if the block's own slope is small. This addresses the vanishing-gradient problem from Week 3."
    }
  ]
}
```

## How Week 4 is assessed

Your lab is marked out of 100 using the table in the lab section. Laboratories and knowledge checks run through the term, and the Prelim exam in Week 5 covers Weeks 1–4. Your instructor announces the component weights and due dates. The graded knowledge check for this week is on the portal.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave (your instructor will use them to open Week 5):
1. Why does a CNN need fewer parameters than a fully connected network on the same image?
2. What is the output size for n = 32, k = 3, p = 1, s = 2?
3. What does max pooling do to a feature map?

**Homework / self-study**
- Finish any unfinished lab exercises. Redo the by-hand convolution with a kernel of your own choice (for example a horizontal-edge kernel) and check it with `F.conv2d`.
- Review Weeks 1–4 for the Prelim exam in Week 5. Make a one-page sheet with the key formulas: neuron output, MSE, gradient-descent step, the chain rule, the output-size formula and the parameter counts.
- Try the practice questions in [Mock Exam Prep](/mock-exam).
