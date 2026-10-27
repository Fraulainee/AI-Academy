> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 1 — Course Orientation & Introduction to Generative AI

**Term:** Prelim (Weeks 1–5) · **Month:** 1 · **Kit sources:**
- Slides: `Generative-AI-Teaching-Kit/Module 1 - Introduction to Generative AI/Lecture Slides/1.1-Introduction-to-GenAI.pptx` and `.../1.2-Historical-and-Future-Perspectives-of-GenAI.pptx`
- Demo: `.../Module 1 - Introduction to Generative AI/Demos/1-Introduction-to-Generative-AI.ipynb`
- Lab: `.../Module 1 - Introduction to Generative AI/Labs/1-Introduction-to-Generative-AI/1-Introduction-to-Generative-AI.ipynb`
- Articles: `.../Module 1 - Introduction to Generative AI/Articles/` (What is Generative AI and How Does it Work · What is Machine Learning and Why Does It Matter · What Is Trustworthy AI)
- Knowledge check: `.../Module 1 - Introduction to Generative AI/Knowledge Checks/1-Introduction-to-Generative-AI.csv` (in `question_bank.json` as GA-1-Q01..Q20)

## Learning outcomes (from course plan)
By the end of the week students can:
1. Describe what Generative AI is and how it differs from classification or regression models.
2. Place key events on the history of AI (Dartmouth 1956, Perceptron 1958, deep learning, GPT-3, ChatGPT) and say where the field is heading.
3. List common uses (text, translation, images, audio) and the main risks (bias, misinformation, deepfakes, privacy).
4. Log in to the Supervaise portal, start a JupyterLab session on the DGX Spark, and run a notebook that uses the GPU.
5. Run four generative pipelines (story, translation, image, speech) and critique their output.

## Before class (instructor prep checklist, ~30–60 min)
- [ ] Confirm every student can log in to the JupyterHub portal (test two accounts from a non-admin laptop). Prepare a slide with the URL, username format, and support contact.
- [ ] Copy the two Module 1 slide decks locally the day before (about 70 MB each).
- [ ] **Important:** the kit demo and lab notebooks are written for Google Colab (`!pip install`, `google.colab.drive`, a TensorFlow GPU check, `numba` GPU resets). Do not run them as-is. Use the DGX Spark lab below, and use the demo only as a talking-point guide (Hugging Face Hub, GPT-2, MarianMT, Stable Diffusion, text-to-speech, Whisper).
- [ ] In a fresh portal session, run every cell of the lab in this plan once. Check these Hugging Face IDs load offline: `gpt2-medium`, `Helsinki-NLP/opus-mt-en-fr`, `-fr-en`, `-en-de`, `-de-en`, `-en-es`, `-es-en`, `runwayml/stable-diffusion-v1-5`, `facebook/mms-tts-eng` (TTS, see Instructor notes), and Whisper `base`.
- [ ] Run `nvidia-smi`; note the free unified memory. Stable Diffusion and other models share it with the whole class.
- [ ] Prepare the six items for the "Human or AI?" warm-up (Activity 1) and the 10 cards for Activity 2.
- [ ] Share the syllabus: weekly rhythm, grade weights (labs 30%, knowledge checks 10%, exams 35%, capstone 20%, DLI certificates 5%), the NCA-GENL goal, and the academic-integrity policy.
- [ ] Open Knowledge Check GA-1-Q01..Q20 on the portal and verify it loads.

## Lecture plan (3 hrs)

| Time | Segment | Activity | Materials |
|---|---|---|---|
| 0:00–0:10 | Warm-up / hook | "Human or AI?" vote on six items (Activity 1) | Prepared images/text, poll tool |
| 0:10–0:35 | Course orientation | Syllabus, grading, certification path (DLI certificates, NCA-GENL), portal rules, fair use of the shared DGX Spark | Course plan sections 1, 4, 5 |
| 0:35–1:15 | Mini-lecture 1: What is Generative AI? | Discriminative vs generative models; non-GenAI examples (logistic regression, random forest, SVM) vs GenAI (LLMs, diffusion); quick ML recap | Slides 1.1; article "What is Machine Learning and Why Does It Matter" |
| 1:15–1:35 | Class activity 2 | Think-pair-share: "Discriminative or generative?" | Card set (Activity 2) |
| 1:35–1:50 | Break | | |
| 1:50–2:30 | Mini-lecture 2: History and future | Dartmouth 1956, Perceptron 1958, AI winters, deep learning, GPT-2/GPT-3, ChatGPT; future directions | Slides 1.2; article "What is Generative AI and How Does it Work" |
| 2:30–2:55 | Class activity 3 | Case-study debate on generative AI in school (trustworthy AI) | Article "What Is Trustworthy AI"; role cards |
| 2:55–3:00 | Recap + exit ticket | Three exit-ticket questions | Portal form or paper |

Optional live demo (10 min, inside mini-lecture 1): run only the text-generation and translation cells of the lab so students see that a model is a downloadable artifact from a Hub, not a website.

## Class activities

### Activity 1 — "Human or AI?" warm-up (10 min, whole class)
**Goal:** surface prior beliefs and show that generated content is hard to spot.
**Steps:**
1. Prepare six items: two AI-generated images, one AI-generated paragraph, one human paragraph, one machine-translated sentence, one real photo. Number them.
2. Show each for 20 seconds; students vote by hand or poll.
3. Reveal the answers and ask: "What clue did you use? How confident were you?"
**Discussion:** Which items fooled most people? Why does it matter that we cannot always tell?
**Expected answers:** Students rely on "odd hands", style, or generic tone, none of which is reliable. Takeaway: provenance and disclosure matter more than visual clues. This sets up trustworthy AI.

### Activity 2 — Think-pair-share: discriminative or generative? (20 min, pairs)
**Goal:** fix the distinction that the knowledge check tests.
**Steps:**
1. Give each pair 10 cards: spam filter, house-price predictor, ChatGPT, Stable Diffusion, logistic regression, random forest, support vector machine, GPT-2, Whisper (speech to text), face unlock.
2. (3 min) Individually sort into "generates new data" vs "classifies or predicts".
3. (5 min) Compare with a partner; defend disagreements.
4. (10 min) Class discussion; resolve edge cases.
**Expected answers:** Generative: ChatGPT, Stable Diffusion, GPT-2. Discriminative (non-GenAI): spam filter, house-price predictor, logistic regression, random forest, SVM, face unlock. Whisper is the edge case: it generates text from audio with a sequence model, so accept either answer with a good reason and explain the nuance.

### Activity 3 — Case-study debate: "Should our school allow generative AI?" (25 min, groups of 4–5)
**Goal:** apply trustworthy-AI ideas (fairness, transparency, privacy, safety, accountability) to a realistic case.
**Steps:**
1. Assign roles: teacher, student, parent, school administrator, AI vendor.
2. (5 min) Read the scenario: "A teacher finds that half of the class essays were drafted by an AI tool."
3. (10 min) Each group prepares two benefits and two risks from its role's view.
4. (10 min) Two groups debate in front of the class; the others score arguments on evidence, fairness, and practicality.
**Discussion questions:** What are the risks (cheating, bias, privacy, misinformation, deepfakes)? Which guardrails would you accept (disclosure rules, detection, redesigned assessments)? Who is accountable when an AI tool is wrong?
**Expected answers:** Strong groups propose disclosure and citation rules, in-class assessment, AI-literacy teaching, and not putting private student data into public tools. Note that AI-text detectors are unreliable; do not present them as proof.

### Exit ticket (5 min)
1. In one sentence, what makes a model "generative"?
2. Name one event in AI history and why it mattered.
3. Name one risk of generative AI and one way to reduce it.
Collect the answers and use them to open Week 2.

## Lab activity sheet (3 hrs) — student-facing

**Objective.** Learn the portal and run four Hugging Face pipelines on the DGX Spark GPU: text generation, translation, image generation, and speech (text to speech and speech to text). Reflect on quality and ethics.

**Setup on DGX Spark.**
1. Log in to the portal and start JupyterLab. Create a folder `week01` and a notebook `lab1.ipynb`.
2. Do not install packages (everything is pre-installed; there is no internet). Do not use `!pip install`, Google Drive, or Colab code.
3. Models load from the offline Hugging Face cache (`HF_HOME` is set). Use the exact model IDs shown.
4. The GPU is shared by the whole class. Run one heavy model at a time and free memory after each part.

**Step-by-step tasks.**

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
   *Exercise 1:* generate a 100-token story from your own prompt. Run it with `do_sample=True, temperature=0.7` and again with `temperature=1.3`. Write 3–4 sentences comparing the outputs.
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

**Checkpoints with expected outputs.**
- Step 1: `True`, a GB10 device name, and tensor `[5., 7., 9.]`.
- Step 2: a fluent but sometimes repetitive continuation; higher temperature is more varied and less coherent.
- Step 3: a French sentence close to "Bonjour, comment allez-vous ?".
- Step 4: a 512×512 image in well under a minute at 30 steps.
- Step 5: a transcription close to the spoken text, with small word or punctuation differences.

**Deliverables.** The completed notebook with outputs visible, answers to the four exercises, the three images, and the reflection. Submit through the portal.

**Stretch goals.** Compare `gpt2-medium` with another cached model; try `top_k` and `top_p`; translate to a language your community speaks and ask a native speaker to rate it; measure time and `torch.cuda.max_memory_allocated()` for each model.

## Lab grading rubric (100 pts)

| Criterion | Points | Excellent | Satisfactory | Needs work |
|---|---|---|---|---|
| Environment and setup (portal, GPU check, no Colab code) | 10 | All checks run; notebook organized | Minor errors fixed with help | GPU not used or Colab code left in |
| Text generation + Exercise 1 | 20 | Works; compares two temperatures with insight | Works; weak comparison | Missing or not working |
| Translation + Exercise 2 | 15 | Round trip for 3 languages; specific nuance noted | Round trip done; vague analysis | Incomplete |
| Image generation + Exercise 3 | 20 | 3 images; specific prompt/result analysis; GPU freed | 3 images; shallow analysis | Fewer than 3 or errors |
| Audio chain + Exercise 4 | 15 | Full chain; clear reasons for differences | Chain runs; weak reasons | Chain broken |
| Reflection (ethics and applications) | 15 | Specific, balanced, links to class debate | General statements | Missing |
| Code quality and resource etiquette | 5 | Clean, commented, memory freed | Some clutter | Leaves GPU full |

## Instructor notes

**Common mistakes**
- Copying the kit's `!pip install` and `google.colab` cells (they fail offline).
- Forgetting `pad_token_id` for GPT-2 (harmless warning) or running `generate` with CPU tensors on a GPU model.
- Loading Stable Diffusion in float32 on a shared GPU, or not freeing it before the next step.
- Treating fluent output as true. Remind students that models can be fluent and wrong.

**Troubleshooting on DGX Spark**
- *Offline / "cannot connect to huggingface.co":* the model ID is not in the cache or is misspelled. Use the exact IDs; ask Supervaise to pre-cache anything else.
- *CUDA out of memory:* another session holds memory. Run `nvidia-smi`; have students `del` models, call `free_gpu()`, and restart kernels; keep `torch_dtype=torch.float16`.
- *ARM64:* never `pip install` in class; request packages from Supervaise.
- *TTS:* the kit lab uses the Coqui `TTS` package (`tts_models/en/ljspeech/tacotron2-DDC`), which downloads voices from the internet. This plan uses `facebook/mms-tts-eng` through `transformers`, as the kit demo hints with its commented-out `VitsModel` import. Confirm with Supervaise which TTS model is cached before class.
- The kit demo calls `numba.cuda ... device.reset()` between steps. Do not copy this on the shared server; use `del` and `torch.cuda.empty_cache()`.

**Answer key / reference solution outline.** There are no single correct outputs; the code above is the reference. Expected observations: higher temperature gives more creative but less coherent text; round-trip translation changes idioms and word order; images may distort hands and text; transcription errors come from synthetic voice quality and punctuation. Mark the analysis on specificity.

## Knowledge check
Assign **GA-1-Q01 … GA-1-Q20** (20 questions from `question_bank.json`; source CSV in Module 1 `Knowledge Checks`). Topics: Dartmouth Conference, Perceptron, GenAI vs non-GenAI models, ChatGPT lineage, trustworthy AI. 15–20 minutes, auto-graded. Known issue: **GA-1-Q05** (significance of the Dartmouth Conference) has an answer key that matches none of the printed options (key: "Coining of 'Artificial Intelligence'"); see `question_bank_issues.json`. Fix it in the portal or drop it from scoring.

## Homework / self-study
- Read the three Module 1 articles (the `.html` files in `Articles/` are links): What is Generative AI and How Does it Work; What is Machine Learning and Why Does It Matter; What Is Trustworthy AI. Write a half-page summary of the trustworthy-AI article.
- Finish any unfinished lab exercises and the reflection.
- Preview Week 2: revise NumPy arrays and functions from the Python course.
- No DLI course milestone this week (the first starts in Week 9).
