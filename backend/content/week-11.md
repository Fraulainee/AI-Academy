> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 11 — Multimodal AI

**Purpose:** See how a model can work with images and text together: a ==Vision Transformer turns an image into a sequence of tokens==, and CLIP learns a ==shared space where pictures and words can be compared==.

**Term:** Pre-final (Weeks 11–15) · **Month:** 3 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "When a model sees and reads",
  "caption": "A multimodal model handles more than one kind of data, such as pictures and text. An image is cut into patches that act like word tokens, and a picture can be matched to the best description. These scenes are illustrative examples made up for the animation, not real model output.",
  "scenes": [
    { "name": "Patches", "kind": "tokens", "outputLabel": "A 224 × 224 image as tokens", "prompt": "Cut the image into 16 × 16 squares", "tokens": ["patch 1", "patch 2", "patch 3", "patch 4", "…", "patch 196"] },
    { "name": "Zero-shot", "kind": "bars", "outputLabel": "Illustrative match scores", "prompt": "Photo of a dog. Which caption fits best?", "bars": [ { "label": "a photo of a dog", "value": 0.88 }, { "label": "a photo of a cat", "value": 0.09 }, { "label": "a photo of a car", "value": 0.02 }, { "label": "a photo of a pizza", "value": 0.01 } ] },
    { "name": "Caption", "kind": "text", "outputLabel": "Generated caption (illustrative)", "prompt": "Describe this photo: a street market at sunset", "output": "A busy street market with colourful stalls under an orange evening sky." },
    { "name": "Question", "kind": "text", "outputLabel": "Answer (illustrative)", "prompt": "Photo of a table with 3 chairs. How many chairs are in the photo?", "output": "There are 3 chairs." }
  ]
}
```

## By the end, you can…

1. ==Explain what a multimodal model is== and name three real applications.
2. ==Describe how a Vision Transformer turns an image into tokens==: patches, linear projection, CLS token and position embeddings.
3. ==Calculate the number of patches and tokens== for a given image size and patch size.
4. Explain how ==CLIP aligns images and text== and how zero-shot classification works.
5. Patchify an image in code and run CLIP zero-shot classification in the lab.

Assessed in the Week 11 lab and quiz. Read each section, then use the figure under it. Terms with a dotted underline open a short definition when you select them.

## What is a multimodal model? {rail=Multimodal}

{lede} A [[modality|One kind of data, such as text, images, audio or video.]] is one kind of data. A [[multimodal model|A model that takes in, produces or links more than one modality, for example images and text.]] ==works with more than one kind of data==, such as pictures and words together.

### Three things a multimodal model can do

Think of a phone camera app. You point at a plant and ask "what is this?" The app needs to understand a picture *and* a question. Common applications fall into a few patterns:

- **Image captioning:** a picture goes in, a sentence comes out.
- **Visual question answering (VQA):** a picture plus a question go in, an answer comes out.
- **Text-to-image:** a description goes in, a new picture comes out (you will study this in Weeks 12–13).
- **Speech and video:** speech to text, or text to speech, as you saw in Week 1.

Switch between the two tabs. The outputs are hand-written examples.

```viz
{
  "type": "flow",
  "title": "One kind of data, or several",
  "modes": [
    {
      "name": "Unimodal",
      "tagline": "The input and the output are the same kind of data, or the model sees only one kind.",
      "inputLabel": "One modality in",
      "modelLabel": "single-modality model",
      "outputLabel": "Output",
      "examples": [
        { "label": "Text to text", "input": "Translate to French: Good morning.", "output": "Bonjour." },
        { "label": "Image to label", "input": "A photo of a street", "output": "label: street" }
      ],
      "note": "Illustrative examples."
    },
    {
      "name": "Multimodal",
      "tagline": "The model links two or more kinds of data, such as pictures and words.",
      "inputLabel": "Image and text in",
      "modelLabel": "multimodal model",
      "outputLabel": "Text or image out",
      "examples": [
        { "label": "Captioning", "input": "A photo of a dog on a beach", "output": "A dog running along the shore." },
        { "label": "Visual question answering", "input": "A photo of a kitchen + “Is the stove on?”", "output": "No, the stove is off." },
        { "label": "Text to image", "input": "“A red kite over a green hill”", "output": "A new picture of a red kite over a hill" }
      ],
      "note": "Illustrative examples. Real systems can be wrong, so check their output."
    }
  ]
}
```

Now try matching tasks to the data they use. One card is an edge case on purpose.

```viz
{
  "type": "sorter",
  "title": "What goes in and what comes out?",
  "bins": [
    { "id": "i2t", "label": "Image in, text out" },
    { "id": "t2i", "label": "Text in, image out" },
    { "id": "it2t", "label": "Image + text in, text out" },
    { "id": "t2t", "label": "Text only (not multimodal)" }
  ],
  "cards": [
    { "name": "Write a one-sentence description of a photo", "answer": "i2t", "why": "Only the picture is given and the output is text. This is image captioning." },
    { "name": "Answer “How many chairs are in this photo?”", "answer": "it2t", "why": "The model needs both the picture and the question, and it answers in text. This is visual question answering." },
    { "name": "Draw a poster from the slogan “Clean water for all”", "answer": "t2i", "why": "A text prompt goes in and a new picture comes out." },
    { "name": "Translate a sentence from English to French", "answer": "t2t", "why": "Both input and output are text, so this is not multimodal." },
    { "name": "Summarise a news article", "answer": "t2t", "why": "Text goes in and text comes out." },
    { "name": "Describe what a bar chart shows", "answer": "i2t", "why": "The chart is an image, and the answer is text." },
    { "name": "Stable Diffusion creating a city scene", "answer": "t2i", "why": "You met it in Week 1: a text description produces a new image." },
    { "name": "Pick the best label for a photo from a list of captions (CLIP)", "answer": "either", "why": "Edge case. The model takes an image and candidate captions and returns scores, not new text. It is multimodal either way, so either answer is fine if you can explain it." }
  ]
}
```

## Vision Transformers: an image as a sequence of tokens {rail=Vision Transformer}

{lede} A Transformer reads a sequence of vectors. A text model gets one vector per token. A [[Vision Transformer (ViT)|A Transformer for images. It cuts the image into fixed-size patches, turns each patch into a vector, and processes the sequence of patches like a sentence of tokens.]] does the same trick with pictures: ==cut the image into patches and treat each patch as a token==.

### Patches

Imagine laying a grid over a photo, like tiles on a floor. Each tile is a patch. In the original ViT paper (Dosovitskiy et al., 2020), the title says "an image is worth 16×16 words": patches of 16×16 pixels are the "words".

For a 224 × 224 colour image with 16 × 16 patches, there are (224 / 16)² = 14² = **196 patches**. Each patch has 16 × 16 × 3 = **768 numbers** (3 colour channels). In total 196 × 768 = 150,528, which is exactly 3 × 224 × 224: ==cutting into patches loses no information, it only reorganises the numbers==.

Try it on a small 8 × 8 image. Change the patch size and watch the token count.

```viz
{
  "type": "patch",
  "title": "Cut a tiny image into patch tokens",
  "image": [
    [0,9,9,9,9,9,9,0],
    [0,0,0,0,0,9,9,0],
    [0,0,0,0,9,9,0,0],
    [0,0,0,9,9,0,0,0],
    [0,0,9,9,0,0,0,0],
    [0,0,9,9,0,0,0,0],
    [0,0,9,9,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  "channels": 1,
  "patchSizes": [2, 4, 8]
}
```

Notice the trade-off. With 2 × 2 patches there are 16 tokens of 4 numbers each. With 4 × 4 patches there are only 4 tokens of 16 numbers each. Smaller patches mean more tokens, finer detail and more computation, because attention compares every token with every other token.

### The whole ViT pipeline

Step through the stages for a 224 × 224 colour image with 16 × 16 patches. The hidden size D = 768 is the one used in ViT-Base, which also has 12 Transformer blocks.

```viz
{
  "type": "pipeline",
  "title": "A Vision Transformer, step by step",
  "intro": "Press the step buttons. Each step lists the tensor shape.",
  "nodes": [
    { "id": "img", "label": "Image", "sub": "3 × 224 × 224" },
    { "id": "patch", "label": "Patches", "sub": "196 × 768" },
    { "id": "proj", "label": "Linear projection", "sub": "768 → D" },
    { "id": "pos", "label": "CLS + positions", "sub": "197 × D" },
    { "id": "enc", "label": "Transformer encoder", "sub": "L blocks" },
    { "id": "head", "label": "CLS → MLP head", "sub": "class scores" }
  ],
  "steps": [
    { "title": "Start with the image", "body": "The input is a grid of pixel values, three numbers (red, green, blue) at each of 224 × 224 positions.", "active": ["img"], "example": "3 × 224 × 224 = 150,528 numbers." },
    { "title": "Cut into patches and flatten", "body": "Cut the image into non-overlapping 16 × 16 squares and flatten each one into a list of numbers.", "active": ["img", "patch"], "example": "14 × 14 = 196 patches. Each has 16 × 16 × 3 = 768 numbers. Result: 196 × 768." },
    { "title": "Linear projection", "body": "One shared linear layer maps every flattened patch to a vector of size D, like an embedding lookup for words. The same weights are used for every patch.", "active": ["patch", "proj"], "example": "With D = 768 the layer has 768 × 768 + 768 = 590,592 parameters. Result: 196 × 768." },
    { "title": "Add a CLS token and position embeddings", "body": "A special learned [CLS] vector is put in front of the patches. Learned position embeddings are added so the model knows where each patch came from.", "active": ["proj", "pos"], "example": "196 patches + 1 CLS = 197 tokens. Position embeddings: 197 × 768 = 151,296 parameters." },
    { "title": "Transformer encoder", "body": "The tokens pass through a stack of Transformer blocks (self-attention and feed-forward, as in Week 8). Every patch can attend to every other patch. The shape does not change.", "active": ["pos", "enc"], "example": "Attention scores per head: 197 × 197 = 38,809." },
    { "title": "Read out the CLS token", "body": "After the last block, the CLS vector summarises the whole image. A small MLP head turns it into class scores.", "active": ["enc", "head"], "example": "768 numbers → one score per class, for example 10 classes." }
  ]
}
```

Notice that nothing here is new: the encoder is the Transformer you already know. Only the front end changed, from word embeddings to patch embeddings. Also notice that the attention cost grows with the *square* of the number of tokens. At 448 × 448 with 16 × 16 patches there are 28² = 784 patches, so 785 tokens and 785² = 616,225 scores per head, about 16 times more than 38,809 for the 224 × 224 image.

### Why ViTs need lots of data

A CNN builds in two assumptions: nearby pixels belong together (local connectivity) and the same filter works everywhere (weight sharing). A ViT has neither assumption built in, so it must learn them from data. These built-in assumptions are called [[inductive biases|Assumptions built into a model's design that help it learn from less data, such as a CNN's belief that nearby pixels are related.]]. In UvA Tutorial 15 (linked in the lab), a ViT trained from scratch on CIFAR10 reaches about 75% where CNNs reach about 90%, because ==a ViT without that built-in structure needs more data or pre-training==.

## CLIP: pictures and words in one space {rail=CLIP}

{lede} CLIP (Radford et al., 2021) trains an image encoder and a text encoder together so that ==a picture and its caption end up close together in one shared embedding space==. This idea is called [[contrastive learning|Training by pulling matching pairs together and pushing non-matching pairs apart in embedding space.]].

### How it is trained

Take a batch of 4 images, each paired with its own caption. Encode all 4 images and all 4 captions, and compute the cosine similarity between every image and every caption. That gives a 4 × 4 table. The 4 matching pairs lie on the diagonal. Training raises the diagonal scores and lowers all the others. Here is an illustrative table.

```viz
{
  "type": "heatmap",
  "title": "Image and caption similarities in one batch",
  "corner": "image ↓ caption →",
  "rows": ["dog photo", "cat photo", "car photo", "pizza photo"],
  "cols": ["“a dog”", "“a cat”", "“a car”", "“a pizza”"],
  "showValues": true,
  "rowsSumToOne": false,
  "W": [ [0.31, 0.12, 0.08, 0.10], [0.10, 0.29, 0.14, 0.07], [0.09, 0.13, 0.33, 0.11], [0.07, 0.10, 0.12, 0.30] ],
  "note": "Illustrative numbers authored for teaching, not from a trained model. In real training every batch contains many more pairs."
}
```

The diagonal is highest in every row. The loss treats each row as a small classification problem: "which caption belongs to this image?" It is the same idea as SimCLR in the optional lab notebook, except that CLIP's two views of an item are an image and its text.

### Zero-shot classification

Once trained, CLIP can sort images into categories it was never trained on. You write the categories as sentences, such as "a photo of a dog", encode them, and encode the photo. The category whose text embedding is closest to the image embedding wins. This is [[zero-shot classification|Classifying into classes by comparing the input with text descriptions of the classes, without training on labelled examples of those classes.]]. You just change the text, with no retraining.

Select the photo point to see its neighbours.

```viz
{
  "type": "scatter",
  "title": "A shared image and text space",
  "metric": "cosine",
  "points": [
    { "label": "text: dog", "x": 4, "y": 1.2, "group": "text" },
    { "label": "text: cat", "x": 3.2, "y": 2.6, "group": "text" },
    { "label": "text: car", "x": -1, "y": 4, "group": "text" },
    { "label": "text: pizza", "x": 1, "y": -4, "group": "text" },
    { "label": "photo: new dog", "x": 4.2, "y": 1.5, "group": "image" },
    { "label": "photo: car", "x": -1.2, "y": 3.7, "group": "image" }
  ],
  "note": "The coordinates are illustrative, authored for teaching. Real CLIP embeddings have hundreds of dimensions. By cosine similarity the new dog photo is closest to “text: dog” (0.999), then “text: cat” (0.943)."
}
```

Notice which text point is nearest the new dog photo: that nearest text is the zero-shot answer. The wording of the text matters too, so "a photo of a dog" often works better than just "dog". You will test this in the lab.

## Key takeaways {rail=Takeaway}

- A ==multimodal model links more than one kind of data==, for example captioning, visual question answering and text-to-image.
- A ViT ==cuts an image into patches, projects each into a vector, adds a CLS token and position embeddings== and feeds the sequence to a Transformer. A 224 × 224 image with 16 × 16 patches gives 196 patches, or 197 tokens with the CLS token.
- ViTs lack a CNN's built-in assumptions, so they ==need more data or pre-training== to match CNNs.
- CLIP trains with a contrastive loss so images and captions share one space, which makes ==zero-shot classification== possible: pick the label text closest to the image.

## Lab: patches, a tiny ViT and CLIP zero-shot {rail=Laboratory}

Build the front end of a ViT yourself, train a tiny one on handwritten digits, then use CLIP to ==classify images with text labels it was never trained on==. This is GA Lab 5. Time: 3 hours.

### Setup

1. Log in to the portal, start JupyterLab, and create `week11/lab5.ipynb`.
2. No internet and no `pip install`. Models load from the offline Hugging Face cache (`HF_HOME`). Part 4 uses `openai/clip-vit-base-patch32`. Confirm with your instructor that every model ID below is in the offline cache.
3. The GPU is shared. Everything in Parts 1 to 3 is tiny and runs on CPU. Keep CLIP on CPU too unless your instructor says otherwise, and free memory when you finish.

### Step-by-step tasks

1. *Patchify an image in NumPy (20 min).*
```python
import numpy as np
from sklearn.datasets import load_digits

img = load_digits().images[0]            # shape (8, 8), values 0 to 16
p = 2
patches = img.reshape(8 // p, p, 8 // p, p).transpose(0, 2, 1, 3).reshape(-1, p * p)
print(patches.shape)                     # (16, 4)
print(patches[1], img[0:2, 2:4].reshape(-1))   # the same four numbers
```
   *Exercise 1:* repeat for p = 4 and p = 8. Fill in a table of p, number of patches and numbers per patch. Check that patches × numbers per patch is always 64.
2. *Count tokens and parameters for a real size (20 min).*
```python
x = np.random.rand(224, 224, 3)
q = 16
patches = x.reshape(224 // q, q, 224 // q, q, 3).transpose(0, 2, 1, 3, 4).reshape(-1, q * q * 3)
print(patches.shape)                     # (196, 768)
D = 768
print("projection parameters:", 768 * D + D)
print("tokens with CLS:", patches.shape[0] + 1, "position parameters:", (patches.shape[0] + 1) * D)
```
   *Exercise 2:* (a) What are the numbers for 32 × 32 patches? (b) For a 448 × 448 image with 16 × 16 patches, how many tokens are there, and how many attention scores per head? (c) In two sentences, say why high-resolution images are expensive for ViTs.
3. *A tiny ViT on digits (60 min).* It uses 2 × 2 patches of an 8 × 8 digit, so 16 patches plus a CLS token.
```python
import torch, torch.nn as nn
from sklearn.datasets import load_digits

class TinyViT(nn.Module):
    def __init__(self, p=2, D=32, n_classes=10):
        super().__init__()
        self.p = p
        self.proj = nn.Linear(p * p, D)
        self.cls = nn.Parameter(torch.zeros(1, 1, D))
        self.pos = nn.Parameter(torch.randn(1, (8 // p) ** 2 + 1, D) * 0.02)
        layer = nn.TransformerEncoderLayer(D, 4, 64, batch_first=True)
        self.enc = nn.TransformerEncoder(layer, 2, enable_nested_tensor=False)
        self.head = nn.Linear(D, n_classes)
    def forward(self, imgs):             # imgs: (B, 8, 8)
        B, p = imgs.shape[0], self.p
        x = imgs.reshape(B, 8 // p, p, 8 // p, p).permute(0, 1, 3, 2, 4).reshape(B, -1, p * p)
        t = torch.cat([self.cls.expand(B, -1, -1), self.proj(x)], dim=1) + self.pos
        return self.head(self.enc(t)[:, 0])

d = load_digits()
X = torch.tensor(d.images, dtype=torch.float32) / 16.0
y = torch.tensor(d.target)
Xtr, ytr, Xte, yte = X[:1400], y[:1400], X[1400:], y[1400:]
model = TinyViT()
print(model(Xtr[:8]).shape)              # torch.Size([8, 10])
print(sum(p.numel() for p in model.enc.parameters()))   # 17088
```
   Now train it.
```python
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
for epoch in range(30):
    model.train()
    perm = torch.randperm(len(Xtr))
    for i in range(0, len(perm), 64):
        idx = perm[i:i + 64]
        loss = nn.functional.cross_entropy(model(Xtr[idx]), ytr[idx])
        opt.zero_grad(); loss.backward(); opt.step()
    model.eval()
    with torch.no_grad():
        acc = (model(Xte).argmax(dim=1) == yte).float().mean().item()
    print(epoch, round(loss.item(), 3), round(acc, 3))
```
   *Exercise 3:* the loss should fall and the test accuracy should end well above the 10% of random guessing. Record your final accuracy. Re-run with `TinyViT(p=4)` and `TinyViT(p=1)`, and report which patch size worked best and why you think so. Remember that the digits are tiny, so a ViT has little to learn from.
4. *CLIP zero-shot classification (50 min).*
```python
import torch
from PIL import Image, ImageDraw
from transformers import CLIPModel, CLIPProcessor

def make(shape, color):
    im = Image.new("RGB", (224, 224), "white")
    draw = ImageDraw.Draw(im)
    box = (52, 52, 172, 172)
    if shape == "circle":
        draw.ellipse(box, fill=color)
    else:
        draw.rectangle(box, fill=color)
    return im

images = {"red circle": make("circle", "red"), "blue square": make("square", "blue"), "green circle": make("circle", "green")}
name = "openai/clip-vit-base-patch32"
model = CLIPModel.from_pretrained(name).eval()
proc = CLIPProcessor.from_pretrained(name)
labels = ["a red circle", "a blue square", "a green circle", "a yellow triangle"]

def zero_shot(img, labels, template="a photo of {}"):
    inp = proc(text=[template.format(l) for l in labels], images=img, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = model(**inp).logits_per_image     # (1, number of labels)
    return logits.softmax(dim=1)[0]

for k, im in images.items():
    probs = zero_shot(im, labels)
    print(k, {l: round(float(v), 3) for l, v in zip(labels, probs)})
```
   *Exercise 4:* does the highest probability match each image? Add two more labels of your own, then add a photo you took or any image file with `Image.open("yourfile.jpg").convert("RGB")` and classify it.
5. *Prompt wording (20 min).* Run `zero_shot(images["red circle"], labels, template=t)` for `t` in `"{}"`, `"a photo of {}"` and `"a drawing of {}"`. *Exercise 5:* tabulate the probability of the correct label for each template and write three sentences on what changed. Then free memory: `del model, proc`.
6. *Reflection (10 min).* In a markdown cell: (a) one way zero-shot classification could fail, (b) one risk of using a model like CLIP on photos of people, (c) one application you would build.

### What you should see

- Step 1: shape `(16, 4)`, and the two printed rows hold the same numbers. For p = 4: `(4, 16)`; for p = 8: `(1, 64)`.
- Step 2: `(196, 768)`, `projection parameters: 590592`, and `tokens with CLS: 197 position parameters: 151296`.
- Step 3: `torch.Size([8, 10])` and `17088` for the encoder parameters. Loss falls over the 30 epochs. Accuracy varies with the random seed, so do not compare exact numbers with a classmate.
- Step 4: the matching label usually gets the highest probability for simple shapes and colours. This is not guaranteed, so report what you actually see. Each row of probabilities adds up to 1.
- Step 5: the template can change the probabilities noticeably, even when the winner stays the same.

### Common mistakes

- Reshaping without the transpose in Step 1. You then get rows of the image, not square patches. Compare with the check line.
- Passing a grayscale image to CLIP. Use `.convert("RGB")`.
- Forgetting `model.eval()` and `torch.no_grad()` when testing. Dropout then stays on and you build a needless gradient graph.
- Using a patch size that does not divide the image size (for example p = 3 for an 8 × 8 image).
- Reading CLIP's probabilities as certainty. They only compare the labels you supplied, so a missing label can never be chosen.

### Go further: UvA notebooks

**Tutorial 15, Vision Transformers**, by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence): [Vision Transformers](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial15/Vision_Transformer.html). It builds `img_to_patch`, the linear projection, a CLS token, learned position embeddings and an MLP head, and trains on CIFAR10, where it reaches about 75% while CNNs reach about 90%.

**Tutorial 17, SimCLR**, by Phillip Lippe, University of Amsterdam (UvA Deep Learning Tutorials, MIT licence): [SimCLR](https://uvadlc-notebooks.readthedocs.io/en/latest/tutorial_notebooks/tutorial17/SimCLR.html). It shows contrastive learning on STL10, pulling two augmented views of one image together and pushing other images apart. This is the idea behind CLIP-style training.

Both notebooks download data and checkpoints from the internet, so run them on a laptop with internet, or ask your instructor to pre-download them for the Spark.

### Deliverables

Submit through the portal the notebook with outputs, the answers to Exercises 1–5 and the reflection. Your instructor announces dates and weights.

| Criterion | Points |
|---|---|
| Patchify and counts (Exercises 1–2) | 3 |
| Tiny ViT trained, with the patch-size comparison (Exercise 3) | 3 |
| CLIP zero-shot with your own labels and image (Exercise 4) | 2 |
| Prompt-wording table and reflection (Exercise 5 and reflection) | 2 |

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Nine questions, with an explanation after each one.

```quiz
{
  "id": "week-11-check",
  "title": "Week 11 quiz: Multimodal AI",
  "passMark": 70,
  "questions": [
    {
      "q": "Which system is multimodal?",
      "options": [
        "A spam filter that reads email text",
        "A model that answers a typed question about an uploaded photo",
        "A model that translates English to French",
        "A logistic regression on house prices"
      ],
      "answer": 1,
      "why": "It combines two kinds of data, an image and text. The others use a single kind of data."
    },
    {
      "q": "A 224 × 224 colour image is cut into 16 × 16 patches. How many patches are there?",
      "options": [
        "14",
        "49",
        "256",
        "196"
      ],
      "answer": 3,
      "why": "(224 / 16)² = 14² = 196. The number 14 is the count per side, and 49 is what you get with 32 × 32 patches."
    },
    {
      "q": "A ViT adds one CLS token to those 196 patch tokens. How many tokens enter the Transformer encoder?",
      "options": [
        "197",
        "196",
        "198",
        "768"
      ],
      "answer": 0,
      "why": "196 patches + 1 CLS = 197 tokens. 768 is the size of each token vector in ViT-Base, not the number of tokens."
    },
    {
      "q": "The same 224 × 224 image is cut into 32 × 32 patches instead. How many patches are there?",
      "options": [
        "196",
        "64",
        "49",
        "32"
      ],
      "answer": 2,
      "why": "(224 / 32)² = 7² = 49. Larger patches mean fewer tokens, and so cheaper attention but coarser detail."
    },
    {
      "q": "How many numbers are in one flattened 16 × 16 patch of an RGB image?",
      "options": [
        "256",
        "768",
        "48",
        "224"
      ],
      "answer": 1,
      "why": "16 × 16 × 3 colour channels = 768. 256 would be a single-channel patch."
    },
    {
      "q": "Why does a ViT trained from scratch on a small dataset usually do worse than a CNN?",
      "options": [
        "It lacks built-in assumptions such as local connectivity and weight sharing, so it needs more data or pre-training",
        "It cannot process colour images",
        "It uses no attention",
        "It has too few parameters to learn anything"
      ],
      "answer": 0,
      "why": "A CNN has locality and weight sharing built in, which helps with little data. A ViT must learn them. ViTs handle colour and do use attention."
    },
    {
      "q": "You double the side of an input image (for example from 224 to 448) and keep 16 × 16 patches. What happens to the number of patches?",
      "options": [
        "It doubles",
        "It stays the same",
        "It becomes four times larger",
        "It becomes eight times larger"
      ],
      "answer": 2,
      "why": "The side count doubles in both directions: 14 × 14 = 196 becomes 28 × 28 = 784, which is four times as many. Attention scores grow roughly with the square of that."
    },
    {
      "q": "What does CLIP's contrastive training do in one batch of image–caption pairs?",
      "options": [
        "It generates new captions for every image",
        "It makes every image similar to every caption",
        "It deletes pairs that do not match",
        "It raises the similarity of matching pairs and lowers the similarity of mismatched pairs"
      ],
      "answer": 3,
      "why": "The loss raises the diagonal of the similarity table (the true pairs) and lowers the off-diagonal scores. It does not generate text."
    },
    {
      "q": "How do you classify a photo into categories with CLIP, without any labelled training images of those categories?",
      "options": [
        "Write each category as a text prompt, embed the prompts and the photo, and pick the closest text",
        "Fine-tune CLIP on thousands of labelled photos",
        "Convert the photo to black and white",
        "Ask CLIP to generate a new photo of each category"
      ],
      "answer": 0,
      "why": "This is zero-shot classification: the class names are supplied as text and compared with the image in the shared space. No retraining is needed."
    }
  ]
}
```

## How Week 11 is assessed

Your lab is marked on the portal using the table above or the sheet your instructor publishes, and the Week 11 knowledge check is on the portal. Component weights and due dates are announced by your instructor.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave:
1. How does a ViT turn a picture into something a Transformer can read?
2. How many tokens does a 224 × 224 image give with 16 × 16 patches, including the CLS token?
3. What does "zero-shot" mean in CLIP classification?

**Homework / self-study**
- Finish the lab exercises and the reflection.
- Optional: read Tutorial 15 or Tutorial 17 from the lab section.
- Preview Week 12: image generation with GANs. Think about how a network could make a picture from random numbers.
