> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 12 — Image Generation & GANs

**Purpose:** Learn how two networks that compete, a ==generator that fakes and a discriminator that catches fakes==, can teach a model to make new images, and how transpose convolution lets the generator grow a picture from a small code.

**Term:** Pre-final (Weeks 11–15) · **Month:** 3 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a generator turn noise into a picture",
  "caption": "A generator starts from random numbers and produces an image. A discriminator scores how real it looks. The pictures and scores here are made up for the animation, not from a trained model, but the loop is the one you build in the lab.",
  "scenes": [
    { "name": "Generator", "kind": "denoise", "prompt": "Random numbers z go in", "outputLabel": "A fake image (a simple smiley)", "image": ["000099990000","009900009900","090000000090","090990099090","090990099090","090000000090","090000000090","090900009090","090099990090","009900009900","000099990000","000000000000"] },
    { "name": "Discriminator", "kind": "bars", "prompt": "Which of these look real?", "outputLabel": "Discriminator's P(real), illustrative", "bars": [ { "label": "Real photo", "value": 0.94 }, { "label": "Early fake", "value": 0.05 }, { "label": "Better fake", "value": 0.4 } ] },
    { "name": "Training", "kind": "bars", "prompt": "Score the generator's fakes as training goes on", "outputLabel": "P(real) given to fakes, illustrative", "bars": [ { "label": "Step 0", "value": 0.03 }, { "label": "Step 500", "value": 0.3 }, { "label": "Step 5000", "value": 0.5 } ] }
  ]
}
```

## By the end, you can…

1. ==Explain the roles of the generator and the discriminator== in a GAN and what each one is trained to do.
2. Describe one ==GAN training iteration== step by step, and say why the two networks must stay in balance.
3. Recognise ==mode collapse== and an over-strong discriminator from their symptoms.
4. ==Compute the output size of a transpose convolution== by hand and explain why it acts as learnable upsampling.
5. Train a tiny GAN on a two-hump distribution and check your transpose-convolution sizes against PyTorch.

Assessed in the Week 12 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## Two ways to make images {rail=Concept}

{lede} To make a new image, a model needs a way to turn a short list of numbers into a picture. An [[autoencoder|A network with two halves: an encoder squeezes an image into a small code, and a decoder rebuilds the image from that code. It is trained to make the rebuilt image match the original.]] learns that by copying its input. A [[GAN|A generative adversarial network: two networks trained against each other, one making fake samples and one judging them. Introduced by Goodfellow et al. in 2014.]] learns it by ==trying to fool a judge==.

### Autoencoder: squeeze, then rebuild

Picture a 28×28 photo of a digit. An autoencoder's encoder shrinks it to, say, 32 numbers (the *latent code*). The decoder grows those 32 numbers back into 28×28 pixels. The loss is how far the rebuilt picture is from the original. Nothing in this loss asks "does a random code give a sensible image?", so a plain autoencoder is a good compressor but ==not a reliable generator==. Pick a random code and you often get a smear.

### GAN: forger and detective

A GAN has no encoder. It has two networks. The [[generator|The network G in a GAN. It takes random noise z and outputs a fake sample, such as an image. It is trained to make samples the discriminator accepts as real.]] turns random noise into a fake image. The [[discriminator|The network D in a GAN. It takes a sample and outputs the probability that it is real rather than made by the generator. It is a classifier.]] looks at an image and says "real" or "fake". They train together: ==the generator improves by fooling the discriminator, the discriminator improves by catching the generator==.

```viz
{
  "type": "flow",
  "title": "Autoencoder or GAN",
  "modes": [
    {
      "name": "Autoencoder",
      "tagline": "Learns to copy. Input and target are the same image, so the loss is a pixel-by-pixel difference.",
      "inputLabel": "Input: a real image",
      "modelLabel": "encoder → small code → decoder",
      "outputLabel": "Output: a rebuilt copy",
      "examples": [
        { "label": "Digit 7", "input": "A 28×28 picture of a handwritten 7", "output": "A slightly blurry 7, rebuilt from the small code" },
        { "label": "Random code", "input": "A code picked at random, not from any image", "output": "Often a smear: nothing taught the decoder to handle codes it never saw" }
      ],
      "note": "Good for compression and denoising. By itself it is not a dependable way to create new images."
    },
    {
      "name": "GAN",
      "tagline": "Learns to fool. The generator sees only noise, and gets its feedback from the discriminator's verdict.",
      "inputLabel": "Input: random noise z",
      "modelLabel": "generator (judged by a discriminator)",
      "outputLabel": "Output: a brand-new image",
      "examples": [
        { "label": "Noise to digit", "input": "z: 100 random numbers from a normal distribution", "output": "A new handwritten-looking digit that matches no training image" },
        { "label": "Judge's job", "input": "A real image and a generated image, one at a time", "output": "P(real) for each, for example 0.93 and 0.07 early in training" }
      ],
      "note": "The example numbers are illustrative. The generator never sees a real image directly; it only receives gradients that pass back through the discriminator."
    }
  ]
}
```

Switch between the two tabs and compare the inputs. The autoencoder is shown the image it must copy. The GAN generator is shown nothing but noise, and still learns to make images.

## The GAN game {rail=GAN game}

{lede} Training a GAN alternates two small jobs on every iteration: ==first teach D to tell real from fake, then teach G to fool the improved D==. Each network gets a loss that is the opposite of the other's.

Write G(z) for the image the generator makes from noise z, and D(x) for the discriminator's probability that x is real. D is trained to push D(real) towards 1 and D(G(z)) towards 0. G is trained to push D(G(z)) towards 1. In words, this is the [[minimax game|A two-player game in which one player tries to maximise a score and the other tries to minimise it. The GAN objective has this form: D tries to classify well, G tries to make D wrong.]] from the original GAN paper. If it works out perfectly, G's fakes match the real data so closely that ==D can only guess, outputting 0.5 for everything==.

Step through one iteration below.

```viz
{
  "type": "pipeline",
  "title": "One GAN training iteration",
  "intro": "Press the steps in order. The highlighted boxes are the parts that are active.",
  "nodes": [
    { "id": "z", "label": "Noise z", "sub": "random numbers" },
    { "id": "g", "label": "Generator G", "sub": "noise → image" },
    { "id": "fake", "label": "Fake batch", "sub": "G(z)" },
    { "id": "real", "label": "Real batch", "sub": "from the dataset" },
    { "id": "d", "label": "Discriminator D", "sub": "image → P(real)" },
    { "id": "loss", "label": "Loss", "sub": "BCE with labels" }
  ],
  "steps": [
    { "title": "Make fakes", "body": "Draw a batch of random noise z and pass it through G to get a batch of fake images. At this point G is not being trained.", "active": ["z", "g", "fake"], "example": "Batch of 128 noise vectors → 128 fake samples." },
    { "title": "Train D on real and fake", "body": "Show D the real batch with label 1 and the fake batch with label 0. Compute the loss and update only D. The fakes are detached so no gradient flows into G in this step.", "active": ["real", "fake", "d", "loss"], "example": "Target: D(real) near 1, D(fake) near 0." },
    { "title": "Train G to fool D", "body": "Make a new batch of fakes and pass it through D, but this time label it 1 (\"real\"). The loss is high when D spots the fakes. Update only G; the gradient flows back through D into G.", "active": ["z", "g", "fake", "d", "loss"], "example": "Target: D(G(z)) pushed towards 1." },
    { "title": "Repeat and watch the balance", "body": "Do this thousands of times. If D becomes far better than G, G stops getting useful feedback. If G beats D, D stops teaching. Both losses wobble rather than falling smoothly, so you judge progress by looking at samples.", "active": ["g", "d", "loss"], "example": "A healthy run ends with D(fake) hovering around 0.5." }
  ]
}
```

Notice that D is updated first on real and fake images, but G is updated through D. ==G never sees a real image==; it learns only from the direction D says would look more real.

### Who does what?

Test your picture of the two networks. Some cards belong to both.

```viz
{
  "type": "sorter",
  "title": "Generator or discriminator?",
  "intro": "Drag each statement into the right bin. One card is true of both networks.",
  "bins": [ { "id": "generator", "label": "Generator" }, { "id": "discriminator", "label": "Discriminator" } ],
  "cards": [
    { "name": "Takes random noise z as input", "answer": "generator", "why": "G starts from noise. D starts from an image." },
    { "name": "Outputs one number: the probability that its input is real", "answer": "discriminator", "why": "D is a classifier with a single output between 0 and 1." },
    { "name": "Its loss is lowest when the other network is fooled", "answer": "generator", "why": "G wins when D(G(z)) is close to 1." },
    { "name": "Is shown real images from the dataset", "answer": "discriminator", "why": "Only D sees real data. G learns from D's feedback." },
    { "name": "You keep it after training to create new images", "answer": "generator", "why": "At the end you throw away D, feed new noise to G and get new samples." },
    { "name": "In an image GAN it often uses transpose convolutions to grow the picture", "answer": "generator", "why": "G must go from a small noise vector to a large image, so it upsamples. D usually uses ordinary strided convolutions that shrink the image." },
    { "name": "Is a neural network trained with gradient descent", "answer": "either", "why": "Both are ordinary networks with their own optimiser." }
  ]
}
```

## When training goes wrong {rail=Training}

{lede} A GAN is two networks chasing each other, so it is harder to train than a normal classifier. ==Both losses can look fine while the pictures are poor==, so you must look at samples, not only at numbers.

The two failures to recognise are below. [[Mode collapse|A GAN failure where the generator keeps producing a few outputs that fool the discriminator and ignores the rest of the variety in the real data.]] means G found one or a few images that D accepts and keeps repeating them. A discriminator that is too strong gives G almost no useful gradient, because every fake is rejected with confidence and G has no hint which direction would improve.

| Symptom | Likely cause | What people try |
|---|---|---|
| Every sample looks nearly the same | Mode collapse | Lower the learning rate; train D a little less or more evenly; use a different loss or architecture |
| D(fake) is near 0 and stays there; samples are noise | D far ahead of G | Weaken D (fewer layers or steps); lower D's learning rate |
| Samples look good then suddenly worsen | Unstable back-and-forth between G and D | Smaller learning rates; Adam with beta1 about 0.5 is a common choice in GAN code |
| D(fake) hovers around 0.5, samples are varied | Healthy | Keep training and keep checking samples |

The fixes are things people often try, not guarantees. In the lab you will change the learning rates yourself and see what happens.

## Transpose convolution: learnable upsampling {rail=Upsampling}

{lede} A convolution usually makes an image smaller. The generator needs the opposite: start from a small grid and end with a big image. A [[transpose convolution|A layer that goes from a small grid to a larger one. Each input value multiplies the whole kernel and the scaled kernel copies are added into the output, spaced by the stride. The kernel values are learned.]] does this, and because its kernel is learned, it is ==upsampling that the network can tune to the task==.

### How it works, with numbers

Take a 2×2 input and a 3×3 kernel of all ones, stride 2. Each input value is multiplied by the kernel to give a 3×3 patch. The patches are placed 2 steps apart and ==added where they overlap==. The output is 5×5, because (2 − 1) × 2 + 3 = 5. The patches from the four inputs 1, 2, 3, 4 meet in the centre cell, so it holds 1 + 2 + 3 + 4 = 10. Check this in the figure.

```viz
{
  "type": "conv",
  "title": "Transpose convolution by hand",
  "mode": "transpose",
  "stride": 2,
  "input": [ [1, 2], [3, 4] ],
  "kernel": [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ]
}
```

Notice the overlaps: the centre cell is 10, the middle row has cells such as 4 and 6, and the corners come from one input only. Overlap that is uneven is why some generators show a checkerboard pattern in their images, and it often appears when the kernel size is not a multiple of the stride.

### The size formula

With input size n, kernel size k, stride s and padding p (PyTorch's `ConvTranspose2d`, no dilation), the output side is ==(n − 1) × s − 2p + k==, plus `output_padding` if you set it. A very common generator layer uses k = 4, s = 2, p = 1, which gives (n − 1) × 2 − 2 + 4 = 2n, so ==it exactly doubles the size==.

| Input n | Kernel k | Stride s | Padding p | Output side |
|---|---|---|---|---|
| 2 | 3 | 2 | 0 | 5 |
| 4 | 4 | 2 | 1 | 8 |
| 8 | 4 | 2 | 1 | 16 |
| 7 | 3 | 2 | 1 | 13 |

Three doubling layers take a 4×4 grid to 8×8, 16×16 and 32×32. This is the same idea as the decoder in UvA's Tutorial 9, which you meet in the lab.

## Key takeaways {rail=Takeaway}

- A GAN is two networks. The ==generator makes fakes from noise; the discriminator scores real versus fake==. The generator never sees real images, only the discriminator's feedback.
- Each iteration trains D first, then G through D. When it works, ==D ends up outputting about 0.5 for everything==.
- ==Look at samples, not only losses.== Mode collapse (few repeated outputs) and a too-strong discriminator (no useful gradient) are the common failures.
- A transpose convolution has output side ==(n − 1) × s − 2p + k==. It is ==learnable upsampling==, and k = 4, s = 2, p = 1 doubles the size.

## Lab: a toy GAN and transpose convolution {rail=Laboratory}

Build the smallest GAN that shows the whole story: ==train a generator and discriminator on a two-hump distribution, watch the samples improve, and see what changes when the networks fall out of balance==. Then check your transpose-convolution sizes with PyTorch. Time: 3 hours. This is a self-contained version of the week's demo; your instructor's demo or notebook is the graded reference.

### Setup

1. Log in to the portal and start JupyterLab. Create a folder `week12` and a notebook `gan.ipynb`.
2. Do not install packages and do not use `!pip install`, Google Drive or Colab code. There is no internet.
3. This lab needs no pretrained model and no dataset download, so no Hugging Face IDs are used. The toy GAN is small and runs on the CPU in well under a minute per run. If you use the GPU, remember it is shared by the class: free memory when you finish.
4. Put `torch.manual_seed(0)` at the top of each run so you can compare changes fairly.

### Step-by-step tasks

1. *Transpose-convolution sizes by hand, then check (30 min).* Predict each output side with the formula (n − 1) × s − 2p + k first, then compare with PyTorch.
```python
import torch, torch.nn as nn

def out_size(n, k, s, p=0, op=0):
    return (n - 1) * s - 2 * p + k + op

for n, k, s, p in [(2, 3, 2, 0), (4, 4, 2, 1), (7, 3, 2, 1)]:
    layer = nn.ConvTranspose2d(1, 1, kernel_size=k, stride=s, padding=p)
    y = layer(torch.zeros(1, 1, n, n))
    print(n, k, s, p, "formula:", out_size(n, k, s, p), "PyTorch:", y.shape[-1])
```
   *Exercise 1:* add two more settings of your own (include one with `output_padding=1`, which you pass as `output_padding=1` to the layer). Write your prediction before you run it. Then reproduce by hand the 5×5 output of the figure above and check the centre cell is 10.
2. *A small image generator, shapes only (25 min).* A generator that grows a 16-number noise vector into a 32×32 image.
```python
gen = nn.Sequential(
    nn.Linear(16, 64 * 4 * 4), nn.ReLU(),
    nn.Unflatten(1, (64, 4, 4)),
    nn.ConvTranspose2d(64, 32, 4, 2, 1), nn.ReLU(),
    nn.ConvTranspose2d(32, 16, 4, 2, 1), nn.ReLU(),
    nn.ConvTranspose2d(16, 1, 4, 2, 1), nn.Tanh(),
)
x = torch.randn(5, 16)
for layer in gen:
    x = layer(x)
    print(layer.__class__.__name__, tuple(x.shape))
print("trainable parameters:", sum(p.numel() for p in gen.parameters()))
```
   *Exercise 2:* before running, write the shape after every layer. Then count the parameters of the last layer by hand (16 × 1 × 4 × 4 weights plus 1 bias) and compare with `gen[-2]`.
3. *Set up the toy GAN (20 min).* Real data are two Gaussian humps centred at −2 and +2 with standard deviation 0.5, so half of the real samples are positive.
```python
import numpy as np, matplotlib.pyplot as plt
Z = 8

def real_batch(n):
    centers = torch.randint(0, 2, (n, 1)).float() * 4 - 2
    return centers + 0.5 * torch.randn(n, 1)

def make_G():
    return nn.Sequential(nn.Linear(Z, 32), nn.ReLU(), nn.Linear(32, 32), nn.ReLU(), nn.Linear(32, 1))

def make_D():
    return nn.Sequential(nn.Linear(1, 32), nn.LeakyReLU(0.2), nn.Linear(32, 32), nn.LeakyReLU(0.2), nn.Linear(32, 1))

r = real_batch(5000)
print("real mean", r.mean().item(), "fraction > 0:", (r > 0).float().mean().item())
```
   *Exercise 3:* explain in one sentence why the output of `D` has no sigmoid (hint: look at the loss in the next step).
4. *Train it (45 min).* This is the loop from the lesson: update D on real and fake, then update G through D.
```python
def train(steps=3000, lr_g=1e-3, lr_d=1e-3, batch=128, snaps=(1, 300, 1000, 3000)):
    torch.manual_seed(0)
    G, D = make_G(), make_D()
    opt_g = torch.optim.Adam(G.parameters(), lr=lr_g, betas=(0.5, 0.999))
    opt_d = torch.optim.Adam(D.parameters(), lr=lr_d, betas=(0.5, 0.999))
    bce = nn.BCEWithLogitsLoss()
    ones, zeros = torch.ones(batch, 1), torch.zeros(batch, 1)
    out, dfake = {}, []
    for step in range(1, steps + 1):
        fake = G(torch.randn(batch, Z)).detach()
        loss_d = bce(D(real_batch(batch)), ones) + bce(D(fake), zeros)
        opt_d.zero_grad(); loss_d.backward(); opt_d.step()
        fake = G(torch.randn(batch, Z))
        loss_g = bce(D(fake), ones)
        opt_g.zero_grad(); loss_g.backward(); opt_g.step()
        dfake.append(torch.sigmoid(D(fake)).mean().item())
        if step in snaps:
            with torch.no_grad():
                out[step] = G(torch.randn(2000, Z)).squeeze().numpy()
    return out, dfake

samples, dfake = train()
fig, ax = plt.subplots(1, len(samples), figsize=(14, 2.5), sharex=True)
for a, (step, s) in zip(ax, samples.items()):
    a.hist(s, bins=40, range=(-4, 4)); a.set_title(f"step {step}")
plt.show()
print("D(fake) over the last 200 steps:", np.mean(dfake[-200:]))
```
   *Exercise 4:* describe how the histogram changes from step 1 to step 3000. Is both hump covered? Give the final average D(fake) and say what 0.5 would mean.
5. *Break the balance (40 min).* Run `train` again with these settings and plot each result as above. Keep every other setting the same.
```python
for name, kw in [("D much stronger", dict(lr_d=1e-2, lr_g=1e-4)),
                 ("G much stronger", dict(lr_d=1e-4, lr_g=1e-2)),
                 ("Baseline", dict())]:
    s, d = train(**kw)
    last = s[3000]
    print(name, "fraction > 0:", round(float((last > 0).mean()), 2), "mean D(fake):", round(float(np.mean(d[-200:])), 2))
```
   *Exercise 5:* for each run, record the fraction of samples above 0 (the real value is about 0.5), the final D(fake) and a one-line description of the histogram. Say which, if any, shows mode collapse (everything in one hump) or a too-strong discriminator (D(fake) near 0), and propose one change. Results vary, so report what you observe, not what you expect.
6. *Reflection (20 min).* In a markdown cell: (a) why does the generator need transpose convolutions but the discriminator does not; (b) why can a GAN with good-looking losses still be a poor generator; (c) one risk of realistic generated images and one mitigation.
7. *Cleanup.* If you used the GPU, free it. Restart the kernel and save the notebook.

### What you should see

- Step 1: sizes 5, 8 and 13 from both the formula and PyTorch, matching the table above.
- Step 2: shapes (5, 1024), (5, 1024), (5, 64, 4, 4), (5, 32, 8, 8), (5, 16, 16, 16) and (5, 1, 32, 32), with the activation layers in between repeating the previous shape. The last transpose layer has 16 × 1 × 4 × 4 + 1 = 257 parameters.
- Step 3: a real mean near 0 and a fraction above 0 near 0.5.
- Step 4: at step 1 the samples sit near 0; by step 3000 they usually spread over two humps near −2 and +2, with D(fake) averaging in the neighbourhood of 0.5. GAN runs are noisy, so yours may look slightly different.
- Step 5: the imbalanced runs often look clearly worse than the baseline, but the exact failure (collapse, noise, wobble) varies from run to run.

### Common mistakes

- Forgetting `.detach()` on the fake batch in the D step. Without it the D loss sends gradients into G as well.
- Updating G with label 0 for fakes. G's loss uses label 1, because G wants D to say "real".
- Judging the GAN only by loss values. Both losses can look fine while the samples are poor; always plot samples.
- Mixing up the formula for convolution (output gets smaller) with the transpose formula (output gets larger).
- Leaving a sigmoid on D when using `BCEWithLogitsLoss`, which applies the sigmoid itself.

### Go further: UvA notebook

If you want to see transpose convolution in a real image decoder, read UvA Tutorial 9, [Autoencoders](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial9/AE_CIFAR10.html), by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence). It builds an encoder with strided convolutions and a decoder with `ConvTranspose2d` that grows a 4×4 grid back to 32×32 on CIFAR10, studies the effect of the latent size, and shows why a vanilla autoencoder is not a generative model. It downloads data and checkpoints from the internet, so run it on a laptop or ask your instructor to pre-download it for the Spark.

### Deliverables

Submit through the portal the notebook with outputs visible, your answers to Exercises 1–5, and the reflection. Your instructor announces due dates and how this lab counts toward your grade.

| Criterion | Points |
|---|---|
| Transpose-convolution sizes and Exercise 1 | 20 |
| Generator shapes and Exercise 2 | 15 |
| Working GAN with sample histograms (Exercises 3–4) | 25 |
| Imbalance experiment and analysis (Exercise 5) | 25 |
| Reflection | 10 |
| Code quality and cleanup | 5 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. The graded knowledge check is on the portal.

```quiz
{
  "id": "week-12-check",
  "title": "Week 12 quiz: Image generation and GANs",
  "passMark": 70,
  "questions": [
    {
      "q": "What does the generator in a GAN take as input and produce as output?",
      "options": [
        "A real image in, a label out",
        "Random noise in, a fake sample out",
        "A fake sample in, a probability out",
        "A caption in, a real photo out"
      ],
      "answer": 1,
      "why": "The generator maps random noise z to a fake sample. Producing a probability is the discriminator's job."
    },
    {
      "q": "What does the discriminator output?",
      "options": [
        "A new image",
        "The noise vector z",
        "The loss of the generator",
        "The probability that its input is real"
      ],
      "answer": 3,
      "why": "D is a classifier: it scores an input between 0 (fake) and 1 (real). It does not create images."
    },
    {
      "q": "In an ideal, fully trained GAN, what does the discriminator output on both real and generated samples?",
      "options": [
        "About 0.5, because it can no longer tell them apart",
        "Exactly 1 for real and 0 for fake",
        "Always 0 for everything",
        "Always 1 for everything"
      ],
      "answer": 0,
      "why": "If the generator's samples match the real data, D has nothing to separate them with and can only guess, giving about 0.5. In practice runs only approach this."
    },
    {
      "q": "A decoder layer is ConvTranspose2d with kernel 4, stride 2, padding 1. It receives an 8×8 feature map. What size comes out?",
      "options": [
        "9×9",
        "14×14",
        "16×16",
        "32×32"
      ],
      "answer": 2,
      "why": "(8 − 1) × 2 − 2 × 1 + 4 = 14 − 2 + 4 = 16. This kernel-4, stride-2, padding-1 layer doubles the side, which is why generators use it."
    },
    {
      "q": "A ConvTranspose2d layer has a 4×4 input, kernel 3, stride 2 and padding 0. What is the output side?",
      "options": [
        "7",
        "9",
        "6",
        "8"
      ],
      "answer": 1,
      "why": "(4 − 1) × 2 − 0 + 3 = 9. Using 7 forgets the extra kernel overhang, and 8 would need a different kernel or padding."
    },
    {
      "q": "A generator keeps producing nearly the same image for every noise vector, even though the real data are varied. What is this called?",
      "options": [
        "Vanishing gradients in the discriminator",
        "Overfitting the validation set",
        "Mode collapse",
        "Data augmentation"
      ],
      "answer": 2,
      "why": "Mode collapse means G finds a few outputs that fool D and repeats them instead of covering the variety in the data."
    },
    {
      "q": "Why is a transpose convolution described as learnable upsampling?",
      "options": [
        "It enlarges the grid and its kernel values are trained, unlike fixed interpolation.",
        "It always copies pixels without any weights.",
        "It makes the grid smaller by learning which pixels to drop.",
        "It only works on the discriminator."
      ],
      "answer": 0,
      "why": "A transpose convolution grows the grid and has trainable kernel weights, so the network can learn how to fill in detail. Fixed interpolation has nothing to learn."
    },
    {
      "q": "Early in a GAN run, D(fake) stays near 0 and the generated images are pure noise. What is the most likely issue and a sensible first change?",
      "options": [
        "The generator is too strong; raise its learning rate.",
        "The discriminator is far ahead; weaken it or lower its learning rate.",
        "The dataset has too many images; remove half of them.",
        "The sigmoid is missing from the generator."
      ],
      "answer": 1,
      "why": "A very confident discriminator gives the generator little useful feedback. Making D weaker or slower is a common first fix. Raising G's rate treats the wrong side."
    },
    {
      "q": "Why can a plain autoencoder not be relied on as an image generator, while a GAN can?",
      "options": [
        "Autoencoders cannot use convolutions.",
        "Autoencoders only work on text.",
        "A random latent code may not resemble any code the decoder was trained on, whereas the GAN is trained on exactly such random noise.",
        "GANs need no training data."
      ],
      "answer": 2,
      "why": "An autoencoder is trained only to rebuild real images from their own codes. A GAN generator is trained on noise inputs and judged by the discriminator. GANs still need real data."
    },
    {
      "q": "In your training loop, why do you call .detach() on the fake batch when updating the discriminator?",
      "options": [
        "To make D see real images instead of fakes.",
        "To stop the loss from changing G's weights during the D step.",
        "To speed up the real batch.",
        "To turn the labels from 0 into 1."
      ],
      "answer": 1,
      "why": "detach stops gradients flowing back into the generator, so this step trains only D. G is updated in its own step."
    }
  ]
}
```

## How Week 12 is assessed

**Your lab (100 points).** The marking table is in the lab's Deliverables. Your instructor announces due dates and how labs, knowledge checks and exams are weighted.

**Knowledge check.** The graded knowledge check for this week is on the portal. Topics: generator versus discriminator, one training iteration, mode collapse, and transpose-convolution output sizes.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. What is the generator trained to do, and what is the discriminator trained to do?
2. A transpose convolution has n = 5, k = 4, s = 2, p = 1. What is the output side?
3. Name one sign that a GAN run has gone wrong.

**Homework / self-study**
- Finish any unfinished lab exercises and the reflection.
- Optional: read UvA Tutorial 9 (linked above) and note how its decoder upsamples.
- Preview Week 13: you will meet diffusion models, which make images by removing noise step by step.
