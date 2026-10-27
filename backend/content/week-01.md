> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 1 — Introduction to Generative AI

**Purpose:** Learn how a ==generative model creates new content== instead of only labelling data, and how to judge what it makes.

**Term:** Prelim (Weeks 1–5) · **Month:** 1 · **Time:** about 30 minutes for the lesson, then a 3-hour lab

```viz
{
  "type": "hook",
  "title": "Watch a model make something new",
  "caption": "You write a prompt; a generative model returns content that did not exist before: text, a translation, a picture, a voice. These are examples made up for the animation. Real output is different every time. That is generative AI.",
  "scenes": [
    { "name": "Text", "kind": "text", "outputLabel": "New text", "prompt": "Once upon a time in a land far, far", "output": "away, there lived a weaver who could hear what the wind was saying." },
    { "name": "Translation", "kind": "text", "outputLabel": "New text, in French", "prompt": "Hello, how are you?", "output": "Bonjour, comment allez-vous ?" },
    { "name": "Image", "kind": "image", "outputLabel": "New image", "prompt": "A futuristic city with flying cars" },
    { "name": "Speech", "kind": "speech", "outputLabel": "New audio", "prompt": "Hello, this is a test of text to speech." }
  ]
}
```

## By the end, you can…

1. ==Explain what Generative AI is== and how it differs from a model that classifies or predicts.
2. Place key moments on the ==history of AI== (Dartmouth 1956, Perceptron 1958, deep learning, GPT-3, ChatGPT) and say where the field is heading.
3. List what generative AI is used for (text, translation, images, audio) and the ==main risks== (bias, misinformation, deepfakes, privacy).
4. Log in to the Supervaise portal, start a JupyterLab session on the DGX Spark, and run a notebook that uses the GPU.
5. Run four generative models (story, translation, image, speech) and ==judge their output==.

Assessed in the Week 1 lab and quiz. Read each section, then play with the figure under it. The figures are practice, so you cannot break anything. Terms with a dotted underline open a short definition when you select them.

## What is Generative AI? {rail=Concept}

{lede} A [[generative model|A model that learns the patterns in a large amount of data and then produces new data that follows them, such as text, images or audio.]] ==creates new content==. A [[discriminative model|A model that takes existing data and gives back a label or a number, such as "spam" or a predicted price. It does not create anything new.]] only ==labels or scores data that already exists==.

### Two kinds of model

Most machine-learning models you will meet in this course answer a question about data that already exists. A discriminative model looks at an input and gives back a *label or a number*: "this email is spam", "this house costs about ₱4.2 million". Logistic regression, random forests and support vector machines (SVMs) are all like this.

A generative model learns the patterns in a large amount of data, then produces **new content** that follows those patterns: a paragraph, a picture, a sentence in French, a voice reading your text. A [[large language model (LLM)|A generative model trained on huge amounts of text. It writes by repeatedly predicting the next word.]] such as GPT-2 or ChatGPT, and image models such as Stable Diffusion, are generative.

Switch between the two below and try the examples. Notice what comes out of the model each time.

```viz
{
  "type": "flow",
  "title": "Two ways to use a model",
  "modes": [
    {
      "name": "Discriminative",
      "tagline": "Takes data that already exists and answers a question about it. The answer comes from a fixed set: a label or a number.",
      "inputLabel": "Input",
      "modelLabel": "learned a boundary between classes",
      "outputLabel": "Output: a label or a number",
      "examples": [
        { "label": "Spam filter", "input": "“You have WON a free phone, click now!!”", "output": "spam" },
        { "label": "House prices", "input": "80 m², 2 bedrooms, near a train station", "output": "₱ 4.2 million (an estimate)" },
        { "label": "Face unlock", "input": "A photo from the phone camera", "output": "owner: yes" }
      ],
      "note": "These models do not create anything. They sort or score what you give them."
    },
    {
      "name": "Generative",
      "tagline": "Learns the patterns in lots of data, then makes new data that follows them. The answer did not exist before you asked.",
      "inputLabel": "Input: a prompt",
      "modelLabel": "learned what the data looks like",
      "outputLabel": "Output: new content",
      "examples": [
        { "label": "Text (GPT-2, ChatGPT)", "input": "“Once upon a time in a land far, far away”", "output": "…there lived a young weaver who could hear what the wind was saying." },
        { "label": "Translation", "input": "“Hello, how are you?” (English)", "output": "“Bonjour, comment allez-vous ?” (French)" },
        { "label": "Image (Stable Diffusion)", "input": "“A futuristic city with flying cars”", "output": "A brand-new picture of that city" },
        { "label": "Speech", "input": "“Hello, this is a test.”", "output": "An audio clip of a voice saying it" }
      ],
      "note": "The text example is made up to show the idea. Real model output differs every time you run it."
    }
  ]
}
```

### Try it: discriminative or generative?

Decide for each example whether the system ==generates new data== or ==classifies or predicts==. You get an explanation either way. One example is an edge case on purpose.

```viz
{
  "type": "sorter",
  "title": "Sort the ten examples",
  "cards": [
    { "name": "Spam filter", "answer": "discriminative", "why": "It labels an existing email as spam or not spam. Nothing new is created." },
    { "name": "House-price predictor", "answer": "discriminative", "why": "It predicts a number from the features of a house." },
    { "name": "ChatGPT", "answer": "generative", "why": "It writes new text, one piece at a time, in reply to your prompt." },
    { "name": "Stable Diffusion", "answer": "generative", "why": "It creates a new image from a text description." },
    { "name": "Logistic regression", "answer": "discriminative", "why": "A classic classifier. It outputs the probability of a class." },
    { "name": "Random forest", "answer": "discriminative", "why": "Many decision trees vote on a label or a number." },
    { "name": "Support vector machine", "answer": "discriminative", "why": "It finds the boundary that best separates classes." },
    { "name": "GPT-2", "answer": "generative", "why": "A language model that continues any text you give it. You will run it in the lab." },
    { "name": "Whisper (speech to text)", "answer": "either", "why": "Edge case. It writes new text from audio using a sequence model, so it does generate text. But the text is a transcript of what was said, so it also behaves like a translator or classifier. Either answer is fine if you can defend it." },
    { "name": "Face unlock", "answer": "discriminative", "why": "It decides whether the face matches the owner: yes or no." }
  ]
}
```

## A short history of AI {rail=History}

{lede} Today's tools feel sudden, but they sit on ==about seventy years of work==, with long quiet stretches in between. The pattern is steady: better [[data|The examples a model learns from. More and better data is one of the main reasons modern models work.]], more computing power, and better ideas arriving together.

Select each event to see why it mattered. Two terms to know: the [[Perceptron|An early artificial neuron (1958) that learns to classify inputs by adjusting its weights from examples. It is an ancestor of today's neural networks.]] and the [[AI winters|Periods when interest and funding for AI dropped because early promises were bigger than what the technology could deliver.]].

```viz
{
  "type": "timeline",
  "title": "From a summer workshop to ChatGPT",
  "events": [
    { "year": "1956", "title": "Dartmouth workshop", "text": "A summer workshop at Dartmouth College brought researchers together around the idea that machines could be made to learn and reason. The term “artificial intelligence” comes from this event, and it is often treated as the birth of the field." },
    { "year": "1958", "title": "The Perceptron", "text": "Frank Rosenblatt built the Perceptron, an early artificial neuron that learns to classify inputs by adjusting its weights from examples. It is the ancestor of today's neural networks. It was discriminative: it sorted inputs, it did not create anything." },
    { "year": "1970s–90s", "title": "AI winters", "text": "Early promises were bigger than what computers and data could deliver. Funding and interest dropped in more than one period, which people call AI winters. The lesson: progress depends on data, computing power and realistic goals." },
    { "year": "2012", "title": "Deep learning takes off", "text": "Large neural networks trained on GPUs started winning image-recognition contests by a wide margin. This showed that more data plus more GPU computing could beat hand-built methods, and deep learning became the main approach." },
    { "year": "2017", "title": "The Transformer", "text": "A new architecture called the Transformer, built on attention, made it practical to train very large language models. You will study it in Week 7." },
    { "year": "2019–20", "title": "GPT-2 and GPT-3", "text": "GPT-2 (2019) showed that a language model trained to predict the next word could write surprisingly fluent text. GPT-3 (2020) was far larger, and showed that scale alone brought new abilities. You run GPT-2 in this week's lab." },
    { "year": "2022", "title": "ChatGPT and image generators", "text": "ChatGPT put a conversational model in front of millions of people, and Stable Diffusion made high-quality image generation open to everyone. Generative AI moved from research labs into daily life." },
    { "year": "Next", "title": "Where it is heading", "text": "Expect models that combine text, images, audio and video, that act as agents using tools, and that run on smaller, cheaper hardware. Expect more rules about disclosure, safety and privacy too. This course follows the same path: language models, multimodal models, fine-tuning, retrieval, agents." }
  ]
}
```

## How a language model writes, one word at a time {rail=How it writes}

{lede} A text model does one simple thing over and over: ==given the words so far, score every possible next word, then pick one==. Repeat, and you get a story.

The model does not always pick the top word. A setting called [[temperature|A setting that controls how adventurous the next-word pick is. Low values stay with the most likely words; high values give unlikely words a real chance.]] controls how adventurous the pick is. Low temperature makes the model stay with the most likely words. High temperature gives unlikely words a real chance. You will compare temperature 0.7 and 1.3 in the lab, so try it here first.

```viz
{
  "type": "temperature",
  "title": "Next-word probabilities",
  "prompt": "Once upon a time in a land far, far",
  "tokens": [
    { "t": "away", "logit": 4.2 },
    { "t": "beyond", "logit": 2.4 },
    { "t": "from", "logit": 2.1 },
    { "t": "off", "logit": 1.2 },
    { "t": "behind", "logit": 0.4 },
    { "t": "pizza", "logit": -1.5 }
  ],
  "note": "The scores are made up to show the idea; they are not taken from a real model. In a real model there are tens of thousands of candidate words."
}
```

Move the slider to the far left, then to the far right, and press **Draw 50 times** each time. At low temperature almost every draw is “away”. At high temperature even “pizza” shows up. ==Higher temperature means more varied text, and also less coherent text.==

## What can it do, and what can go wrong? {rail=Uses & risks}

{lede} Generative AI is ==useful across text, translation, images and audio==, and the same few risks come with all of it.

| Area | What generative AI can do | What to watch for |
|---|---|---|
| Text | Draft, summarise, explain, write code | Fluent but wrong answers; made-up facts |
| Translation | Translate between many languages | Lost nuance; idioms and word order change |
| Images | Create pictures from a description | Distorted hands and text; fake photos (deepfakes) |
| Audio | Read text aloud; turn speech into text | Cloned voices; transcription errors |

Whatever the area, the same risks keep coming back:
- **Bias:** a model learns from human data, so it can repeat unfair patterns in that data.
- **Misinformation and deepfakes:** convincing fake text, images, audio and video are cheap to make.
- **Privacy:** anything you type into a public tool may be stored or used. Do not paste private data about yourself or classmates.
- **Overtrust:** a model can be ==fluent and wrong at the same time==.

[[Trustworthy AI|The idea that AI should be built and used in line with five principles: fairness, transparency, privacy, safety and accountability.]] means building and using AI in line with five principles: ==fairness, transparency, privacy, safety and accountability==. When you evaluate any AI tool, ask which of the five it is weak on.

Can you tell AI-made content from human-made content by looking? Often not. Clues such as “odd hands” or a generic tone are unreliable, and AI-text detectors are unreliable too. This is why ==disclosure== (saying when AI was used) and ==provenance== (knowing where content came from) matter more than spotting clues.

## Key takeaways {rail=Takeaway}

- A ==generative model makes new content== that follows patterns it learned. A discriminative model labels or scores data that already exists.
- Modern generative AI is the result of ==decades of work, driven by data, GPUs and the Transformer==. ChatGPT is a recent step, not the start.
- A language model writes by ==choosing one next word at a time==. Temperature trades predictability for variety.
- Generative AI is useful for text, translation, images and audio, and carries risks: bias, misinformation, deepfakes, privacy. ==Use the five trustworthy-AI principles to judge it.==

## Lab: run four generative models on the DGX Spark {rail=Laboratory}

Learn the portal, then ==run four Hugging Face pipelines on the DGX Spark GPU==: text generation, translation, image generation, and speech. Reflect on quality and ethics. Time: 3 hours.

### Setup

1. Log in to the portal and start JupyterLab. Create a folder `week01` and a notebook `lab1.ipynb`.
2. Do not install packages (everything is pre-installed; there is no internet). Do not use `!pip install`, Google Drive, or Colab code.
3. Models load from the offline Hugging Face cache (`HF_HOME` is set). Use the exact model IDs shown.
4. The GPU is shared by the whole class. Run one heavy model at a time and free memory after each part.

### Step-by-step tasks

1. *Check the environment (10 min).*
```python
import torch, gc
print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))
x = torch.tensor([1.0, 2.0, 3.0], device="cuda"); y = torch.tensor([4.0, 5.0, 6.0], device="cuda")
print(x + y)

def free_gpu():
    gc.collect(); torch.cuda.empty_cache()
```
2. *Text generation with GPT-2 (30 min).*
```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer
tok = GPT2Tokenizer.from_pretrained("gpt2-medium")
lm = GPT2LMHeadModel.from_pretrained("gpt2-medium").to("cuda")

def generate_text(prompt, max_length=50, **kw):
    ids = tok(prompt, return_tensors="pt").to("cuda")
    out = lm.generate(**ids, max_length=max_length, pad_token_id=tok.eos_token_id, **kw)
    return tok.decode(out[0], skip_special_tokens=True)

print(generate_text("Once upon a time in a land far, far away"))
```
   *Exercise 1:* generate a 100-token story from your own prompt. Run it with `do_sample=True, temperature=0.7` and again with `temperature=1.3`. Write 3–4 sentences comparing the outputs. (Use what you saw in the temperature figure.)
3. *Translation with MarianMT (30 min).*
```python
from transformers import MarianMTModel, MarianTokenizer
def translate(text, src="en", tgt="fr"):
    name = f"Helsinki-NLP/opus-mt-{src}-{tgt}"
    t = MarianTokenizer.from_pretrained(name); m = MarianMTModel.from_pretrained(name).to("cuda")
    batch = t(text, return_tensors="pt", padding=True).to("cuda")
    return t.decode(m.generate(**batch)[0], skip_special_tokens=True)
print(translate("Hello, how are you?"))
```
   *Exercise 2:* translate one sentence to `fr`, `de`, `es` and back to English (round trip). Record what meaning or nuance was lost.
4. *Image generation with Stable Diffusion (40 min).* Use half precision and few steps to save shared memory.
```python
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to("cuda")
img = pipe("A futuristic city with flying cars", num_inference_steps=30, guidance_scale=7.5).images[0]
img.save("city.png"); img
```
   *Exercise 3:* three creative prompts. For each, write the prompt, say whether the image matches your intention, and note one surprising element. When finished: `del pipe; free_gpu()`.
5. *Speech: text to speech and back (40 min).* Offline text-to-speech with a Hugging Face VITS model, then Whisper for transcription.
```python
import scipy.io.wavfile as wav, numpy as np
from transformers import VitsModel, AutoTokenizer
ttok = AutoTokenizer.from_pretrained("facebook/mms-tts-eng")
tts = VitsModel.from_pretrained("facebook/mms-tts-eng").to("cuda")
def speak(text, path="output.wav"):
    inp = ttok(text, return_tensors="pt").to("cuda")
    with torch.no_grad():
        wave = tts(**inp).waveform[0].cpu().numpy()
    wav.write(path, tts.config.sampling_rate, wave)
speak("Hello, this is a test of text to speech conversion.")

import whisper
w = whisper.load_model("base")
print(w.transcribe("output.wav")["text"])
```
   *Exercise 4 (audio chain):* generate text with GPT-2, convert it to speech, transcribe it, and compare the original with the final text. List two reasons for differences (for example punctuation, rare words, synthetic pronunciation). Free `tts` and `w` afterwards.
6. *Reflection (20 min).* In a markdown cell answer: (a) the most surprising result, (b) two real-world applications, (c) two ethical concerns and one mitigation each.
7. *Cleanup.* Free all models, restart the kernel, save the notebook.

### What you should see

- Step 1: `True`, a GB10 device name, and tensor `[5., 7., 9.]`.
- Step 2: a fluent but sometimes repetitive continuation; higher temperature is more varied and less coherent.
- Step 3: a French sentence close to "Bonjour, comment allez-vous ?".
- Step 4: a 512×512 image in well under a minute at 30 steps.
- Step 5: a transcription close to the spoken text, with small word or punctuation differences.

### Common mistakes

- Copying `!pip install` or `google.colab` code from online tutorials. It fails offline. Use only the code on this page.
- Seeing "cannot connect to huggingface.co". The model ID is misspelled or not in the cache. Use the exact IDs shown.
- Seeing "CUDA out of memory". Another session is holding GPU memory. Run `nvidia-smi`, then `del` your models, call `free_gpu()` and restart the kernel. Keep `torch_dtype=torch.float16` for Stable Diffusion.
- Forgetting to free a model before loading the next one. The GPU is shared with the whole class.
- Treating fluent output as true. A model can be fluent and wrong.

### Deliverables

The completed notebook with outputs visible, answers to the four exercises, the three images, and the reflection. Submit through the portal.

**Stretch goals.** Compare `gpt2-medium` with another cached model; try `top_k` and `top_p`; translate to a language your community speaks and ask a native speaker to rate it; measure time and `torch.cuda.max_memory_allocated()` for each model.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Nine questions, with an explanation after each one. The graded knowledge check (GA-1-Q01 … Q20) is on the portal.

```quiz
{
  "id": "week-01-check",
  "title": "Week 1 quiz: Introduction to Generative AI",
  "passMark": 70,
  "questions": [
    {
      "q": "Which statement best describes a generative model?",
      "options": [
        "It learns patterns in data so it can produce new, similar content.",
        "It sorts existing data into a fixed set of labels.",
        "It stores a copy of every example it was trained on.",
        "It predicts a single number such as a price."
      ],
      "answer": 0,
      "why": "Generative models produce new content that follows learned patterns. Sorting into labels or predicting a number is what discriminative models do."
    },
    {
      "q": "Which of these is NOT a generative AI system?",
      "options": [
        "ChatGPT",
        "Stable Diffusion",
        "A spam filter that labels each email",
        "GPT-2"
      ],
      "answer": 2,
      "why": "A spam filter labels an email that already exists. ChatGPT and GPT-2 write text, and Stable Diffusion creates images."
    },
    {
      "q": "Why is the 1956 Dartmouth workshop remembered?",
      "options": [
        "It produced the first neural network that could see.",
        "It was the first public release of ChatGPT.",
        "It ended the first AI winter.",
        "It is where the term “artificial intelligence” was introduced and the field was launched."
      ],
      "answer": 3,
      "why": "The workshop brought researchers together and gave the field its name, “artificial intelligence”."
    },
    {
      "q": "What was the Perceptron (1958)?",
      "options": [
        "An early artificial neuron that learns to classify inputs from examples.",
        "A large language model trained on the web.",
        "A program that generated images from text.",
        "A rule-based chess engine."
      ],
      "answer": 0,
      "why": "Rosenblatt's Perceptron adjusts its weights from examples to classify inputs. It is an ancestor of modern neural networks."
    },
    {
      "q": "Which list is in the correct order, oldest first?",
      "options": [
        "GPT-3, GPT-2, ChatGPT",
        "ChatGPT, GPT-2, GPT-3",
        "GPT-2, GPT-3, ChatGPT",
        "GPT-2, ChatGPT, GPT-3"
      ],
      "answer": 2,
      "why": "GPT-2 came out in 2019, GPT-3 in 2020 and ChatGPT in late 2022."
    },
    {
      "q": "You raise the temperature from 0.7 to 1.3 when generating text. What usually happens?",
      "options": [
        "The output becomes identical every time.",
        "The model runs much faster.",
        "The model becomes more truthful.",
        "The output becomes more varied and less coherent."
      ],
      "answer": 3,
      "why": "A higher temperature gives unlikely words a larger chance, so text is more varied and also less predictable and less coherent. It does not make the model more truthful."
    },
    {
      "q": "Why is “look for odd hands in the picture” a poor way to decide whether an image is AI-made?",
      "options": [
        "Real photos never show hands.",
        "AI images are always perfect.",
        "Image generators keep improving, so such clues are unreliable. Disclosure and provenance matter more.",
        "Hands are the only thing detectors check."
      ],
      "answer": 2,
      "why": "Visual clues fade as generators improve and people also misjudge real images. Knowing where content came from, and being told when AI was used, is more reliable."
    },
    {
      "q": "A school worries that students' private details could leak if they paste essays into a public AI tool. Which trustworthy-AI principle is this mainly about?",
      "options": [
        "Privacy",
        "Accountability",
        "Fairness",
        "Transparency"
      ],
      "answer": 0,
      "why": "Keeping personal data from being exposed or reused is privacy. The five principles are fairness, transparency, privacy, safety and accountability."
    },
    {
      "q": "In the lab, why do you free GPU memory (for example del pipe; free_gpu()) after each part?",
      "options": [
        "The GPU is shared by the whole class, so one heavy model should run at a time.",
        "Models stop working if they stay in memory.",
        "Python deletes your notebook otherwise.",
        "It makes the images more creative."
      ],
      "answer": 0,
      "why": "All students share the DGX Spark. Leaving a model loaded can cause out-of-memory errors for the rest of the class."
    }
  ]
}
```

## How Week 1 is assessed

**Your lab (100 points).**

| Criterion | Points | Excellent | Satisfactory | Needs work |
|---|---|---|---|---|
| Environment and setup (portal, GPU check, no Colab code) | 10 | All checks run; notebook organized | Minor errors fixed with help | GPU not used or Colab code left in |
| Text generation + Exercise 1 | 20 | Works; compares two temperatures with insight | Works; weak comparison | Missing or not working |
| Translation + Exercise 2 | 15 | Round trip for 3 languages; specific nuance noted | Round trip done; vague analysis | Incomplete |
| Image generation + Exercise 3 | 20 | 3 images; specific prompt/result analysis; GPU freed | 3 images; shallow analysis | Fewer than 3 or errors |
| Audio chain + Exercise 4 | 15 | Full chain; clear reasons for differences | Chain runs; weak reasons | Chain broken |
| Reflection (ethics and applications) | 15 | Specific, balanced, links to class debate | General statements | Missing |
| Code quality and resource etiquette | 5 | Clean, commented, memory freed | Some clutter | Leaves GPU full |

**Across the course.** Laboratories and knowledge checks run through the term, with exams in Weeks 5, 10, 15 and 20 and a capstone. Your instructor announces the component weights in the syllabus. The long-term goal is the NVIDIA-Certified Associate exam (NCA-GENL).

**Knowledge check.** The graded knowledge check for this week (20 questions, 15–20 minutes, auto-marked) is on the portal. Topics: the Dartmouth Conference, the Perceptron, generative versus non-generative models, the ChatGPT lineage, and trustworthy AI.

## Exit ticket and homework

Answer these three questions in one or two sentences each before you leave (your instructor will use them to open Week 2):
1. What makes a model "generative"?
2. Name one event in AI history and say why it mattered.
3. Name one risk of generative AI and one way to reduce it.

**Homework / self-study**
- Read the three Module 1 articles: *What is Generative AI and How Does it Work*, *What is Machine Learning and Why Does It Matter*, and *What Is Trustworthy AI*. Write a half-page summary of the trustworthy-AI article.
- Finish any unfinished lab exercises and the reflection.
- Preview Week 2: revise NumPy arrays and functions from the Python course.
- There is no DLI course milestone this week (the first starts in Week 9).
