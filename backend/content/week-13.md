> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 13 — Diffusion Models

**Purpose:** Learn how a model can make an image by ==starting from pure noise and removing a little noise at a time==, and why a UNet that knows the current step is the right network for the job.

**Term:** Pre-final (Weeks 11–15) · **Month:** 4 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch noise turn into a picture",
  "caption": "A diffusion model starts from random static and removes a little noise at each step until an image appears. The picture here is a simple shape drawn for the animation, not model output. The signal numbers in the second tab are computed from the real noise schedule you will use in the lab.",
  "scenes": [
    { "name": "Denoise", "kind": "denoise", "prompt": "Start from pure noise", "outputLabel": "An image, step by step (illustrative)", "image": ["000000000000","000009900000","000099990000","000999999000","009990099900","000009900000","000009900000","000009900000","000009900000","000009900000","000009900000","000000000000"] },
    { "name": "Noising", "kind": "bars", "prompt": "How much of the original image is left after t noising steps?", "outputLabel": "Signal kept, sqrt of alpha-bar", "bars": [ { "label": "t = 100", "value": 0.95 }, { "label": "t = 300", "value": 0.63 }, { "label": "t = 500", "value": 0.28 }, { "label": "t = 1000", "value": 0.01 } ] },
    { "name": "Training", "kind": "loss", "prompt": "Teach the network to predict the noise that was added", "outputLabel": "Noise-prediction loss (illustrative)" }
  ]
}
```

## By the end, you can…

1. ==Describe the forward process== that adds noise and the reverse process that removes it.
2. ==Compute x_t== from x₀ and noise using ᾱ_t, and read how much signal is left at a given step.
3. Explain what the network is trained to predict and why that makes ==training a simple regression==.
4. Explain ==why the denoiser is a UNet with a time embedding==.
5. Use Stable Diffusion in the lab and describe how the number of steps and the guidance scale change the image.

Assessed in the Week 13 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## The forward process: adding noise {rail=Forward}

{lede} A [[diffusion model|A generative model that learns to reverse a slow noising process. It makes new data by starting from random noise and removing a little noise at each step.]] begins with something easy: ==ruin an image on purpose, a little at a time==. Add a pinch of random noise to a photo, then another, and after enough steps nothing is left but static. That ruining process needs no learning. The learning is in running it backwards.

### The recipe

Call the clean image x₀. At each step t, add a small amount of Gaussian noise. You do not need to loop through every step, because there is a shortcut that jumps straight to step t:

**x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε**

Here ε is a fresh sample of random Gaussian noise (mean 0, spread 1), and ᾱ_t ("alpha-bar") is a number between 1 and 0 that says how much of the original is kept. It comes from a [[noise schedule|A list of numbers β₁ … β_T that sets how much noise is added at each step. Here β grows in a straight line from 0.0001 to 0.02 over T = 1000 steps. Alpha-bar at step t is the product of (1 − β) from step 1 to t.]]. With β running from 0.0001 to 0.02 over T = 1000 steps, ᾱ_t is the running product of (1 − β_i).

| Step t | ᾱ_t | √ᾱ_t (signal kept) | √(1 − ᾱ_t) (noise added) |
|---|---|---|---|
| 1 | 0.9999 | 0.9999 | 0.0100 |
| 100 | 0.8970 | 0.9471 | 0.3209 |
| 300 | 0.3964 | 0.6296 | 0.7769 |
| 500 | 0.0786 | 0.2803 | 0.9599 |
| 1000 | 0.00004 | 0.0064 | 1.0000 |

Look at t = 300. The image is multiplied by 0.63 and noise is added with weight 0.78, so noise already outweighs the picture. By t = 1000 only 0.6% of the picture remains and the result is practically pure noise. That matters later: ==the generator can start from pure noise because the forward process ends there==.

Drag the slider and watch the picture dissolve.

```viz
{
  "type": "diffusion",
  "title": "Forward noising",
  "image": ["000000000000","000009900000","000099990000","000999999000","009990099900","000009900000","000009900000","000009900000","000009900000","000009900000","000009900000","000000000000"],
  "t": 300,
  "note": "A small illustrative shape drawn for teaching; the noise in the figure is random."
}
```

Notice that small t barely changes the picture and large t leaves almost nothing. The schedule is gentle at first on purpose, so each reverse step has an easy job: undo a little noise.

## Training: predict the noise {rail=Training}

{lede} The network is not asked to draw a picture. It is shown a noisy image and asked ==which noise was added==. Because we made that noise ourselves, we know the right answer, so training is plain supervised learning with a mean squared error loss.

Think of a student who sees a smudged photo and has to circle the smudge. A [[denoiser|The network ε_θ that takes a noisy image and the step number t and outputs its estimate of the noise that was added. Subtracting that estimate gives a slightly cleaner image.]] learns this for every noise level, from barely smudged to fully hidden.

```viz
{
  "type": "pipeline",
  "title": "One training step",
  "intro": "Step through what happens for one training image.",
  "nodes": [
    { "id": "x0", "label": "Clean image x₀", "sub": "from the dataset" },
    { "id": "t", "label": "Random step t", "sub": "1 … 1000" },
    { "id": "eps", "label": "Noise ε", "sub": "Gaussian" },
    { "id": "xt", "label": "Noisy image x_t", "sub": "√ᾱ·x₀ + √(1−ᾱ)·ε" },
    { "id": "net", "label": "Denoiser", "sub": "UNet(x_t, t)" },
    { "id": "loss", "label": "MSE loss", "sub": "ε vs prediction" }
  ],
  "steps": [
    { "title": "Pick an image and a step", "body": "Take a clean image from the dataset and pick a random step t between 1 and T. Different images get different t, so the network sees every noise level.", "active": ["x0", "t"], "example": "x₀ = a digit, t = 300." },
    { "title": "Add that much noise", "body": "Sample Gaussian noise ε and form x_t with the shortcut formula. Keep ε, because it is the answer the network must find.", "active": ["x0", "t", "eps", "xt"], "example": "At t = 300: x_t = 0.63 · x₀ + 0.78 · ε." },
    { "title": "Predict the noise", "body": "Feed x_t and the step number t into the denoiser. It outputs a guess ε_θ(x_t, t) with the same shape as the image.", "active": ["xt", "t", "net"], "example": "Input and output are both images of the same size." },
    { "title": "Compare and update", "body": "The loss is the mean squared error between the real ε and the guess. Backpropagate and update the network, then repeat with another image and another t.", "active": ["eps", "net", "loss"], "example": "loss = mean((ε − ε_θ(x_t, t))²)" }
  ]
}
```

Notice there is no second network and no game, unlike a GAN. ==Training is one network, one MSE loss and many random noise levels==, which is a big reason diffusion training is usually more stable than GAN training.

## Sampling: from noise to image {rail=Sampling}

{lede} To make a new image, ==start from pure noise and run the denoiser backwards, one step at a time==, from t = T down to 1. Each step subtracts the noise the network thinks is there, so the picture sharpens gradually.

At each step the network estimates ε from the current x_t. The standard DDPM update (Ho et al., 2020) is x_{t−1} = (1/√α_t) · (x_t − (β_t / √(1 − ᾱ_t)) · ε_θ(x_t, t)) + σ_t · z, where α_t = 1 − β_t and z is a little fresh noise added at every step except the last. You do not need to memorise this. The idea is: remove the predicted noise, then add a small amount of new randomness so the result can differ every run.

```viz
{
  "type": "pipeline",
  "title": "The sampling loop",
  "intro": "Step through one trip from noise to image.",
  "nodes": [
    { "id": "noise", "label": "Pure noise x_T", "sub": "random static" },
    { "id": "net", "label": "Denoiser", "sub": "predict ε at step t" },
    { "id": "sub", "label": "Remove noise", "sub": "x_t → x_{t−1}" },
    { "id": "loop", "label": "Step t − 1", "sub": "repeat" },
    { "id": "img", "label": "Image x₀", "sub": "the result" }
  ],
  "steps": [
    { "title": "Start with static", "body": "Draw x_T from a standard Gaussian. Different starting noise gives a different final image, so the starting noise acts like a seed.", "active": ["noise"], "example": "A 64×64 grid of random numbers." },
    { "title": "Predict the noise", "body": "Give the denoiser the current image x_t and the step number t. It estimates the noise that is hiding the picture.", "active": ["noise", "net"], "example": "At t = 1000 the guess is rough; at t = 10 it is precise." },
    { "title": "Take one step back", "body": "Use the update rule to remove part of the predicted noise and add a little fresh noise. The result x_{t−1} is slightly less noisy.", "active": ["net", "sub", "loop"], "example": "x₁₀₀₀ → x₉₉₉ → x₉₉₈ → …" },
    { "title": "Repeat until t = 0", "body": "Loop until the noise is gone. The original DDPM used about a thousand steps. Newer samplers get good images in far fewer, which is why the number of steps is a setting you can change.", "active": ["loop", "sub", "img"], "example": "In the lab you will try 5, 15 and 30 steps." }
  ]
}
```

Notice that sampling is a loop of many network calls, while a GAN makes an image in one pass. That is the main price of diffusion: ==high quality, but slower generation==.

## The denoiser: a UNet with a time embedding {rail=UNet}

{lede} The network ε_θ must take an image and return something the same size, and it must behave differently at step 10 and step 900. A [[UNet|An encoder-decoder network shaped like a U. The encoder shrinks the image while adding channels; the decoder grows it back; skip connections copy detail from encoder to decoder.]] with a time embedding does both.

### Why a UNet

The encoder half shrinks the image (for example 32×32 to 16×16 to 8×8 to 4×4), so each layer sees a wider area and can understand the large-scale structure. The decoder half grows it back with upsampling, such as the transpose convolutions from Week 12. A [[skip connection|A direct link that copies feature maps from an early layer to a later layer of the same size, so fine detail lost by shrinking can be used again.]] joins each encoder level to the decoder level of the same size, so the output keeps the fine edges that shrinking would lose. The output has the same shape as the input, which is exactly what noise prediction needs.

| Stage | Feature map (illustrative 32×32 image) | Job |
|---|---|---|
| Encoder level 1 | 32×32 | Local edges and texture |
| Encoder level 2 | 16×16 | Parts of objects |
| Bottleneck | 8×8 | Global layout |
| Decoder level 2 | 16×16, plus a skip from encoder level 2 | Rebuild shape with detail |
| Decoder level 1 | 32×32, plus a skip from encoder level 1 | Output: predicted noise, 32×32 |

The sizes above are an illustration; real UNets differ in depth and channels.

### Why a time embedding

Noise at t = 900 is overwhelming and the right move is to find big shapes. At t = 20 the noise is a light dusting and the right move is to polish fine detail. The network is told which case it is by a [[time embedding|A vector computed from the step number t, usually with sine and cosine waves as in positional encoding, then passed through a small network and added into the UNet's blocks so every layer knows the noise level.]]. It works like the positional encoding you met in Week 8, except it encodes =="how noisy is this image"== rather than "where is this word". One UNet with a time embedding handles all 1000 noise levels, instead of 1000 separate networks.

## Making it useful: prompts, guidance and latent space {rail=Stable Diffusion}

{lede} The recipe so far makes random images. Stable Diffusion adds two ideas so that ==you can steer what is made and so that it fits on one GPU==: conditioning on a text prompt, and working in a compressed space.

**Text conditioning and guidance.** A text encoder turns the prompt into vectors, and the UNet reads them through attention layers so the predicted noise depends on the prompt. A trick called classifier-free guidance runs the denoiser twice, with and without the prompt, and pushes the result further in the direction the prompt suggests. The strength of that push is the *guidance scale* (the default in the `diffusers` Stable Diffusion pipeline is 7.5). Higher values usually follow the prompt more closely and give less variety; very high values can look harsh or over-saturated.

**Latent diffusion.** Running the loop on every pixel is expensive. In [[latent diffusion|Running diffusion in a compressed space made by an autoencoder instead of on raw pixels. The image is compressed to a small latent, denoised there, and decoded back to pixels at the end.]] (Rombach et al., 2022), an autoencoder first compresses the image. In Stable Diffusion v1 a 512×512 RGB image has 512 × 512 × 3 = 786,432 values, and its latent is 64 × 64 × 4 = 16,384 values, which is 48 times fewer. All the denoising happens on the small latent and a decoder makes the final picture.

```viz
{
  "type": "flow",
  "title": "GAN or diffusion",
  "modes": [
    {
      "name": "GAN",
      "tagline": "One pass from noise to image, trained as a game between two networks.",
      "inputLabel": "Input: noise z",
      "modelLabel": "generator, judged by a discriminator",
      "outputLabel": "Output: an image",
      "examples": [
        { "label": "Speed", "input": "One forward pass through the generator", "output": "An image almost instantly" },
        { "label": "Training", "input": "Two networks trained against each other", "output": "Can be unstable; mode collapse is a known failure" }
      ],
      "note": "Fast to sample from, and harder to train reliably."
    },
    {
      "name": "Diffusion",
      "tagline": "Many small denoising steps, trained with a plain noise-prediction loss.",
      "inputLabel": "Input: noise x_T (and a prompt)",
      "modelLabel": "UNet denoiser called once per step",
      "outputLabel": "Output: an image",
      "examples": [
        { "label": "Speed", "input": "From a few to about a thousand denoiser calls", "output": "Slower than a GAN, but samplers keep getting faster" },
        { "label": "Training", "input": "One network, mean squared error on the noise", "output": "Usually stable and covers the variety of the data well" }
      ],
      "note": "These are general tendencies, not rules. Results depend on the model, the sampler and the settings."
    }
  ]
}
```

Switch tabs and compare. The trade is mostly speed against stability: ==a GAN is quick to sample but tricky to train, diffusion is steady to train but needs many steps==.

## Capstone opens this week

The Structural Inspection Assistant capstone opens in Week 13 and runs to Week 20. It is a team project, worth 20% of the final grade, that triages inspection photos and drafts a summary for an engineer to review. The pipeline is: photo in, classify (crack, spalling, corrosion or none), find checklist items with RAG, then draft the summary. It uses vision models (ViT or CLIP), RAG over checklists, and NeMo Guardrails. One rule is fixed: ==a licensed engineer makes every pass/fail decision, and the assistant never signs off on safety==. Teams have a Team lead, a Technical lead and a Responsible-AI lead. A capstone proposal session takes place in Week 15, and your instructor announces dates and team arrangements. Read the full brief on the [Capstone](/capstone) page, and think about which of the models you have met so far could handle each step.

## Key takeaways {rail=Takeaway}

- The forward process adds noise with ==x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε==. With the linear schedule, ᾱ is 0.3964 at t = 300 and about 0.00004 at t = 1000, so the end of the forward process is pure noise.
- The network is trained to ==predict the noise ε with a mean squared error loss==, at randomly chosen noise levels. No adversarial game is needed.
- Sampling starts from noise and ==runs the denoiser step by step==. More steps usually mean better quality and more time.
- The denoiser is a ==UNet (shape-preserving, with skip connections) with a time embedding== so one network can handle every noise level. Stable Diffusion adds text conditioning with guidance and works in a smaller latent space.

## Lab: noise schedule, noising and Stable Diffusion {rail=Laboratory}

Compute the noise schedule yourself, then use a real diffusion model, so that you can ==verify the numbers in this lesson and see what the step count and guidance scale really do==. Time: 3 hours. This is a self-contained lab; your instructor's lab notebook is the graded reference.

### Setup

1. Log in to the portal and start JupyterLab. Create a folder `week13` and a notebook `diffusion.ipynb`.
2. Do not install packages and do not use `!pip install`, Google Drive or Colab code. There is no internet.
3. Parts 1 to 3 use only NumPy, scikit-learn's built-in digits data and matplotlib, so they run anywhere. Part 4 uses the Hugging Face model `runwayml/stable-diffusion-v1-5` from the offline cache (`HF_HOME` is set). Confirm with your instructor that every model ID below is in the offline cache.
4. The GPU is shared by the whole class. In Part 4 use half precision, run one pipeline at a time and free memory when you finish.

### Step-by-step tasks

1. *The noise schedule (25 min).* Build β and ᾱ and check the numbers from the lesson.
```python
import numpy as np, matplotlib.pyplot as plt
T = 1000
betas = np.linspace(1e-4, 0.02, T)       # beta_1 ... beta_T
alpha_bar = np.cumprod(1.0 - betas)      # alpha_bar[t-1] is the value at step t
print("alpha_bar(300)  =", alpha_bar[299])
print("alpha_bar(1000) =", alpha_bar[999])
for t in (1, 100, 300, 500, 1000):
    a = alpha_bar[t - 1]
    print(t, round(a, 4), "signal", round(np.sqrt(a), 4), "noise", round(np.sqrt(1 - a), 4))
plt.plot(range(1, T + 1), np.sqrt(alpha_bar), label="signal sqrt(alpha_bar)")
plt.plot(range(1, T + 1), np.sqrt(1 - alpha_bar), label="noise sqrt(1-alpha_bar)")
plt.xlabel("step t"); plt.legend(); plt.show()
```
   *Exercise 1:* write down ᾱ at t = 300 and t = 1000 and compare them with the lesson. At which step do signal and noise weights cross (the curves meet where ᾱ = 0.5)? Read it from the plot or find it with `np.argmax(alpha_bar < 0.5) + 1`.
2. *Noise a picture (35 min).* Use one of scikit-learn's 8×8 handwritten digits, scaled to the range −1 to 1.
```python
from sklearn.datasets import load_digits
x0 = load_digits().images[0] / 16 * 2 - 1      # 8x8 array, values in [-1, 1]
rng = np.random.default_rng(0)
eps = rng.standard_normal(x0.shape)
ts = [1, 50, 100, 300, 500, 1000]
fig, ax = plt.subplots(1, len(ts) + 1, figsize=(14, 2.5))
ax[0].imshow(x0, cmap="gray_r", vmin=-3, vmax=3); ax[0].set_title("x0")
for a, t in zip(ax[1:], ts):
    ab = alpha_bar[t - 1]
    xt = np.sqrt(ab) * x0 + np.sqrt(1 - ab) * eps
    a.imshow(xt, cmap="gray_r", vmin=-3, vmax=3); a.set_title(f"t={t}")
for a in ax: a.axis("off")
plt.show()
```
   *Exercise 2:* at which t can you no longer recognise the digit? Compare that with the signal weight √ᾱ_t from Exercise 1. Try a different digit (`images[3]`) and a different seed and say whether your answer changes.
3. *Recover the image from the noise (25 min).* If the network predicted ε perfectly, you could rewrite the forward formula to get x₀ back. See what a small error does.
```python
def predict_x0(xt, eps_hat, t):
    ab = alpha_bar[t - 1]
    return (xt - np.sqrt(1 - ab) * eps_hat) / np.sqrt(ab)

for t in (50, 300, 1000):
    ab = alpha_bar[t - 1]
    xt = np.sqrt(ab) * x0 + np.sqrt(1 - ab) * eps
    exact = np.abs(predict_x0(xt, eps, t) - x0).max()
    wrong = eps + 0.1 * rng.standard_normal(eps.shape)    # a slightly wrong noise estimate
    err = np.abs(predict_x0(xt, wrong, t) - x0).mean()
    factor = np.sqrt(1 - ab) / np.sqrt(ab)
    print(t, "exact error:", exact, "| error with a 0.1 mistake:", round(err, 3), "| amplification:", round(factor, 3))
```
   *Exercise 3:* explain, using the printed amplification factor, why predicting the noise is much harder to do accurately at t = 1000 than at t = 50. (The factor is √(1−ᾱ)/√ᾱ.)
4. *Stable Diffusion: number of steps (45 min).* Fix the random seed so that only the step count changes.
```python
import torch, gc, time
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to("cuda")
prompt = "A watercolour painting of a lighthouse at dusk"
fig, ax = plt.subplots(1, 3, figsize=(12, 4))
for a, steps in zip(ax, (5, 15, 30)):
    g = torch.Generator("cuda").manual_seed(0)
    t0 = time.time()
    img = pipe(prompt, num_inference_steps=steps, guidance_scale=7.5, generator=g).images[0]
    a.imshow(img); a.set_title(f"{steps} steps, {time.time() - t0:.1f}s"); a.axis("off")
plt.show()
```
   *Exercise 4:* describe what changes between 5, 15 and 30 steps (sharpness, detail, odd shapes) and how the time changes. Which step count would you choose for a quick preview, and which for a final image?
5. *Stable Diffusion: guidance scale (30 min).* Fix the steps at 20 and the seed, and change only the guidance scale.
```python
fig, ax = plt.subplots(1, 4, figsize=(16, 4))
for a, gs in zip(ax, (1.0, 4.0, 7.5, 15.0)):
    g = torch.Generator("cuda").manual_seed(0)
    img = pipe(prompt, num_inference_steps=20, guidance_scale=gs, generator=g).images[0]
    a.imshow(img); a.set_title(f"guidance {gs}"); a.axis("off")
plt.show()
del pipe; gc.collect(); torch.cuda.empty_cache()
```
   *Exercise 5:* say how closely each image follows the prompt and how its look changes at the highest value. Then change the prompt to one of your own and the seed to another number, and say which of the three (prompt, seed, scale) changes the result most.
6. *Reflection (20 min).* In a markdown cell: (a) why training a diffusion model is usually more stable than training a GAN; (b) one reason sampling is slower than a GAN; (c) the capstone needs images classified, not generated. Say whether diffusion could still help a team (for example to create extra practice photos) and name one risk of doing so.
7. *Cleanup.* Make sure the pipeline is freed, restart the kernel and save the notebook.

### What you should see

- Step 1: ᾱ(300) printed as about 0.3964 and ᾱ(1000) as about 4.0e-05. The first rows print 0.9999, 0.897, 0.3964, 0.0786 and 0.0 (rounded to 4 places), and the weights cross where ᾱ falls below 0.5, which happens between t = 200 and t = 300.
- Step 2: the digit fades gradually and is mostly gone by t = 500, and at t = 1000 you see almost only noise. The exact look depends on the seed.
- Step 3: the exact error is about 0 (a rounding level such as 1e-15). The error from a 0.1 mistake grows with t. The amplification factor prints 0.173 at t = 50, 1.234 at t = 300 and 157.407 at t = 1000. The measured error is roughly 0.08 times the factor, with some variation because there are only 64 pixels.
- Step 4: 5 steps looks soft and unfinished, and 15 and 30 steps look sharper. Time grows with the number of steps.
- Step 5: guidance 1 follows the prompt loosely; higher values follow it more strictly, and 15 can look harsh or over-saturated.

### Common mistakes

- Off-by-one with the schedule. `alpha_bar[299]` is step 300, because arrays start at 0.
- Using `np.sqrt(alpha_bar)` where the formula needs `alpha_bar`, or the other way round. The image is multiplied by √ᾱ and the noise by √(1 − ᾱ).
- Forgetting the seed, then wondering why two runs differ. Pass the same `torch.Generator` seed to compare steps or guidance fairly.
- Loading the pipeline in float32. It uses twice the shared GPU memory; use `torch_dtype=torch.float16`.
- Seeing "cannot connect to huggingface.co". The model ID is wrong or not in the cache; ask your instructor.

### Deliverables

Submit through the portal the notebook with outputs visible, your answers to Exercises 1–5, and the reflection. Your instructor announces due dates and how this lab counts toward your grade.

| Criterion | Points |
|---|---|
| Noise schedule and Exercise 1 | 20 |
| Noising and recovery (Exercises 2–3) | 25 |
| Steps comparison (Exercise 4) | 20 |
| Guidance comparison (Exercise 5) | 20 |
| Reflection | 10 |
| Code quality and GPU cleanup | 5 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Ten questions, with an explanation after each one. The graded knowledge check is on the portal.

```quiz
{
  "id": "week-13-check",
  "title": "Week 13 quiz: Diffusion models",
  "passMark": 70,
  "questions": [
    {
      "q": "What does the forward process of a diffusion model do?",
      "options": [
        "It generates a new image from a text prompt.",
        "It gradually adds Gaussian noise to a clean image until almost nothing is left.",
        "It removes noise from an image step by step.",
        "It compresses the image into a latent."
      ],
      "answer": 1,
      "why": "The forward process ruins the image on purpose with noise. Removing the noise is the reverse process, which is the part the network learns."
    },
    {
      "q": "What is the network trained to predict in the standard DDPM setup?",
      "options": [
        "The class label of the image",
        "The step number t",
        "The noise ε that was added",
        "The prompt"
      ],
      "answer": 2,
      "why": "The network outputs an estimate of ε, and the loss is the mean squared error against the true ε. The step number is an input, not the output."
    },
    {
      "q": "With the linear schedule, ᾱ at t = 300 is 0.3964. In x_t = √ᾱ · x₀ + √(1 − ᾱ) · ε, what number multiplies x₀ (to two decimals)?",
      "options": [
        "0.40",
        "0.78",
        "0.63",
        "0.16"
      ],
      "answer": 2,
      "why": "√0.3964 is about 0.63. The number 0.78 is √(1 − 0.3964), the weight on the noise, and 0.40 forgets the square root."
    },
    {
      "q": "At t = 1000, ᾱ is about 4.0 × 10⁻⁵. What does x_1000 look like?",
      "options": [
        "Almost pure noise, because only about 0.6% of the original image remains",
        "Almost identical to the original image",
        "Half image and half noise",
        "A sharper copy of the original"
      ],
      "answer": 0,
      "why": "√(4.0 × 10⁻⁵) is about 0.0064, so the image is scaled to under 1% while the noise has weight about 1. That is why sampling can start from pure noise."
    },
    {
      "q": "Why is the denoiser given the step number t through a time embedding?",
      "options": [
        "So the image can be resized.",
        "So the network knows how noisy the input is and can act differently at step 900 than at step 20.",
        "So it can read the text prompt.",
        "So it can skip the skip connections."
      ],
      "answer": 1,
      "why": "The right action depends on the noise level, from finding big shapes to polishing details. The embedding lets one network handle every level."
    },
    {
      "q": "What is the job of the skip connections in a UNet?",
      "options": [
        "They copy fine detail from encoder levels to decoder levels of the same size.",
        "They make the network skip some training examples.",
        "They convert the image into text.",
        "They add noise to the input."
      ],
      "answer": 0,
      "why": "Shrinking loses fine detail. Skip connections give the decoder that detail back, which helps the output keep sharp edges."
    },
    {
      "q": "In sampling, what is the starting point?",
      "options": [
        "A blank white image",
        "A random photo from the dataset",
        "The text prompt only",
        "Random Gaussian noise"
      ],
      "answer": 3,
      "why": "Sampling begins with noise and removes it step by step. The random starting noise is what makes every run differ unless you fix the seed."
    },
    {
      "q": "You raise the guidance scale from 7.5 to 15 in Stable Diffusion. What usually happens?",
      "options": [
        "The image follows the prompt less closely.",
        "The image follows the prompt more strongly, often with less variety and sometimes a harsh look.",
        "The model needs fewer steps.",
        "The image becomes a different size."
      ],
      "answer": 1,
      "why": "Guidance pushes the denoiser towards the prompt. Very high values can look over-saturated. It does not change the step count or the image size."
    },
    {
      "q": "Stable Diffusion v1 turns a 512×512 RGB image into a 64×64×4 latent before denoising. About how many times fewer values is the latent?",
      "options": [
        "8 times",
        "16 times",
        "48 times",
        "64 times"
      ],
      "answer": 2,
      "why": "512 × 512 × 3 = 786,432 and 64 × 64 × 4 = 16,384. 786,432 ÷ 16,384 = 48. The number 8 is the width ratio, but the channels change as well."
    },
    {
      "q": "Compared with a GAN, which statement about diffusion models is generally true?",
      "options": [
        "They need two networks that compete.",
        "They make an image in a single forward pass.",
        "They train with a simple noise-prediction loss but need many steps to sample.",
        "They cannot be conditioned on text."
      ],
      "answer": 2,
      "why": "Diffusion uses one network and an MSE loss, and generation takes many denoising steps. A GAN needs two competing networks and makes an image in one pass. Text conditioning is how Stable Diffusion works."
    }
  ]
}
```

## How Week 13 is assessed

**Your lab (100 points).** The marking table is in the lab's Deliverables. Your instructor announces due dates and how labs, knowledge checks and exams are weighted.

**Knowledge check.** The graded knowledge check for this week is on the portal. Topics: the forward and reverse processes, the noise-prediction loss, the UNet and time embedding, and guidance.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. What does a diffusion model learn to predict, and why can we train it with an MSE loss?
2. At t = 300, what are the two numbers that multiply x₀ and ε?
3. Why does the denoiser need to know the step number t?

**Homework / self-study**
- Finish any unfinished lab exercises and the reflection.
- Read the Capstone brief at [Capstone](/capstone) and, as a team, discuss which role each person would like.
- Preview Week 14: you will see how language models are trained, fine-tuned and aligned with human feedback.
