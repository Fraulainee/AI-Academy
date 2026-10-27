> Content based on the NVIDIA Generative AI and DLI Deep Learning Teaching Kits, used under the Supervaise × NVIDIA partnership.

# Week 5 — Prelim Exam

**Purpose:** Prepare for the Prelim by ==reviewing Weeks 1–4 and practising the calculations== you can be asked to do by hand.

**Term:** Prelim (Weeks 1–5) · **Month:** 2 · **Time:** about 30 minutes for the lesson, then your study plan

```viz
{
  "type": "hook",
  "title": "Watch four weeks in one minute",
  "caption": "The Prelim is cumulative for Weeks 1–4: a network learns by lowering its loss, outputs probabilities, and for images slides small filters over a grid. These scenes use made-up numbers to jog your memory; nothing here is new.",
  "scenes": [
    { "name": "Learning", "kind": "loss", "outputLabel": "Training loss", "prompt": "Train a small network: each step nudges the weights downhill" },
    { "name": "Predicting", "kind": "bars", "outputLabel": "Probability for each digit (made up)", "prompt": "A digit classifier looks at a handwritten 7", "bars": [ { "label": "7", "value": 0.82 }, { "label": "1", "value": 0.09 }, { "label": "9", "value": 0.05 }, { "label": "2", "value": 0.04 } ] },
    { "name": "Convolution", "kind": "conv", "outputLabel": "Feature map", "prompt": "Slide a 3×3 vertical-edge filter over the image grid" },
    { "name": "Gradients", "kind": "text", "outputLabel": "Why deep sigmoid networks stall", "prompt": "Each sigmoid layer passes back at most 0.25 of the gradient. What is left after 10 layers?", "output": "0.25 to the power 10 is about 0.000001, so the first layers barely learn." }
  ]
}
```

## By the end, you can…

1. ==Explain the difference== between generative and discriminative models and place the key events of AI history (Dartmouth 1956, Perceptron 1958, deep learning, GPT-3, ChatGPT).
2. ==Compute== a neuron's output, a mean squared error and one gradient-descent update by hand.
3. ==Trace a forward and backward pass== with the chain rule, and explain why gradients vanish or explode and what helps.
4. ==Compute a convolution by hand==, its output size and its parameter count, and say why CNNs suit images better than fully connected layers.
5. Plan your revision with the study plan and the practice at [Mock Exam Prep](/mock-exam).

Assessed in the Prelim exam, which covers Weeks 1–4. Your instructor announces the date, room and format; this page does not. Read each review section, then use the figure under it to test yourself. The figures are practice, so you cannot break anything.

## Weeks 1–2: generative AI, learning and neurons {rail=Weeks 1–2}

{lede} Week 1 asked what a model produces; Week 2 asked how it learns. A [[generative model|A model that learns the patterns in data and then produces new data that follows them, such as text or images.]] ==creates new content==, while a [[discriminative model|A model that gives back a label or a number for data that already exists, such as spam or not spam.]] only ==labels or scores existing data==.

### Supervised learning in one paragraph

In [[supervised learning|Learning from examples where each input comes with the correct answer, called a label.]] you show the model examples with answers, measure how wrong it is with a [[loss function|A number that says how wrong the model's predictions are. Training tries to make it small.]], and adjust the weights to make that number smaller. A single [[neuron|The basic unit of a neural network. It computes a weighted sum of its inputs plus a bias, then applies an activation function.]] computes z = w₁x₁ + w₂x₂ + b and passes z through an activation function. One neuron draws one straight line, so it cannot solve XOR; a hidden layer can.

Training uses [[gradient descent|Repeatedly changing each weight a small step in the direction that lowers the loss. The step size is the learning rate.]]: new weight = old weight − learning rate × gradient. A good model must also ==generalise==, meaning it works on data it has never seen. If training accuracy is high but validation accuracy is low, the model is [[overfitting|Fitting the training data so closely, noise included, that performance on new data gets worse.]].

### Retrieval practice

Place each idea in the week where you met it. If you hesitate, go back to that week's lesson.

```viz
{
  "type": "sorter",
  "title": "Which week is this idea from?",
  "intro": "Sort each card into the week where it was taught. Weeks 1 and 2 are one bin because the Prelim treats them together.",
  "bins": [
    { "id": "w12", "label": "Weeks 1–2" },
    { "id": "w3", "label": "Week 3" },
    { "id": "w4", "label": "Week 4" }
  ],
  "cards": [
    { "name": "Temperature changes how adventurous the next word is", "answer": "w12", "why": "Week 1. Low temperature sticks with likely words, high temperature gives unlikely words a chance." },
    { "name": "A hidden layer lets a network solve XOR", "answer": "w12", "why": "Week 2. One neuron draws one line and cannot separate XOR, a hidden layer can." },
    { "name": "Learning rate", "answer": "w12", "why": "Week 2. It sets the step size in gradient descent: too small is slow, too large oscillates or diverges." },
    { "name": "The chain rule", "answer": "w3", "why": "Week 3. Backpropagation multiplies local derivatives along the path from the loss back to a weight." },
    { "name": "Vanishing gradients with sigmoid", "answer": "w3", "why": "Week 3. The sigmoid gradient is at most 0.25, so many layers shrink the gradient towards zero." },
    { "name": "Kaiming initialisation and ReLU", "answer": "w3", "why": "Week 3. ReLU-family activations and careful initialisation help gradients survive many layers." },
    { "name": "Weight sharing", "answer": "w4", "why": "Week 4. The same small kernel is reused at every position, which saves parameters." },
    { "name": "Output size ⌊(n + 2p − k)/s⌋ + 1", "answer": "w4", "why": "Week 4. It gives the width or height of a convolution output." },
    { "name": "Max pooling", "answer": "w4", "why": "Week 4. It keeps the largest value in each small window and shrinks the feature map." },
    { "name": "Perceptron (1958)", "answer": "w12", "why": "Week 1 history. It is an early artificial neuron, an ancestor of today's networks. Week 2 then explained how neurons work." }
  ]
}
```

Notice which bin you got wrong most often; those are your first revision targets. ==The loss is the number you are trying to shrink in every week of this term.==

### Gradient descent by hand

Take the loss L(w) = (w − 3)². Its gradient is 2(w − 3). Start at w = 0 with learning rate 0.1: the gradient is −6, so the new w is 0 − 0.1 × (−6) = 0.6. Move the slider below and watch what each learning rate does.

```viz
{
  "type": "descent",
  "title": "One step size, three behaviours",
  "fn": "quad",
  "lr": 0.1,
  "start": 0
}
```

Try 0.1 (steady), 1.0 (bounces between two points) and 1.1 (diverges). ==For this loss, a learning rate below 1 converges, 1 oscillates and above 1 blows up.==

## Week 3: backpropagation and vanishing gradients {rail=Week 3}

{lede} A network learns by a ==forward pass to get the loss, then a backward pass that multiplies local derivatives (the chain rule)== to get the gradient for every weight. Depth helps because layers build features from simple to complex, but depth also makes gradients easy to lose.

### A backward pass with real numbers

Use one neuron: z = w·x + b, y = σ(z), loss L = (y − t)². Let x = 1, w = 0.5, b = 0, target t = 1. The chain rule says dL/dw = dL/dy × dy/dz × dz/dw. Step through it.

```viz
{
  "type": "pipeline",
  "title": "Forward and backward through one neuron",
  "intro": "Press next to move from the inputs to the loss and then back to the gradient.",
  "nodes": [
    { "id": "inp", "label": "Inputs", "sub": "x, w, b, target t" },
    { "id": "z", "label": "z = w·x + b", "sub": "weighted sum" },
    { "id": "y", "label": "y = σ(z)", "sub": "activation" },
    { "id": "loss", "label": "L = (y − t)²", "sub": "loss" },
    { "id": "grad", "label": "dL/dw", "sub": "chain rule" },
    { "id": "upd", "label": "Update", "sub": "w − lr·gradient" }
  ],
  "steps": [
    { "title": "Forward: the weighted sum", "body": "Multiply the input by the weight and add the bias to get z.", "active": ["inp", "z"], "example": "z = 0.5 × 1 + 0 = 0.5" },
    { "title": "Forward: the activation", "body": "Pass z through the sigmoid to get the prediction y, a number between 0 and 1.", "active": ["z", "y"], "example": "y = σ(0.5) = 0.6225" },
    { "title": "Forward: the loss", "body": "Compare the prediction with the target t = 1 using the squared error.", "active": ["y", "loss"], "example": "L = (0.6225 − 1)² = 0.1425" },
    { "title": "Backward: local derivatives", "body": "Differentiate each step on its own. The loss depends on y, y depends on z, and z depends on w.", "active": ["loss", "y", "z"], "example": "dL/dy = 2(y − t) = −0.7551;  dy/dz = y(1 − y) = 0.2350;  dz/dw = x = 1" },
    { "title": "Backward: multiply them", "body": "The chain rule multiplies the three local derivatives to give the gradient of the loss with respect to w.", "active": ["grad", "z", "y"], "example": "dL/dw = −0.7551 × 0.2350 × 1 = −0.1774" },
    { "title": "Update the weight", "body": "Gradient descent moves w against the gradient. A negative gradient means w should go up.", "active": ["grad", "upd"], "example": "With learning rate 1: w = 0.5 − 1 × (−0.1774) = 0.6774" }
  ],
  "note": "The numbers were computed from the formulas above and rounded to four decimals."
}
```

Notice the three small numbers being multiplied. If any factor is tiny, the whole product is tiny. That is the seed of the vanishing-gradient problem.

### Why gradients vanish or explode

The sigmoid's derivative never exceeds 0.25. Each sigmoid layer therefore multiplies the gradient by at most 0.25 on the way back. After 5 layers that is 0.25⁵ ≈ 0.001, after 10 layers 0.25¹⁰ ≈ 0.000001. A factor above 1 does the opposite and the gradient ==explodes==. The [[vanishing gradient|A gradient that shrinks towards zero as it passes back through many layers, so early layers stop learning.]] problem is why deep sigmoid networks are hard to train.

```viz
{
  "type": "curve",
  "title": "Gradient left after n layers",
  "xRange": [0, 10],
  "yRange": [-8, 0],
  "logY": true,
  "series": [ { "fn": "decay", "label": "Factor per layer" } ],
  "param": { "label": "Factor per layer", "min": 0.1, "max": 1, "step": 0.05, "value": 0.25 },
  "alt": "A line showing the gradient remaining, on a log scale, after 0 to 10 layers when every layer multiplies it by the chosen factor. At 0.25 it falls to about one millionth after 10 layers; at 1.0 it stays flat.",
  "note": "The plot shows factors up to 1. Factors above 1 explode instead, which a log plot cannot show. The y-axis is log10 of the remaining gradient."
}
```

At 0.25 the line falls steeply; at 1.0 it is flat. Fixes to remember: ==ReLU-family activations, careful initialisation (Xavier, Kaiming), residual connections, normalisation, and gradient clipping for exploding gradients==.

## Week 4: convolutional networks {rail=Week 4}

{lede} Images are grids of numbers, and a fully connected layer treats every pixel separately and needs huge numbers of weights. A [[convolution|Sliding a small grid of weights, called a kernel, over an image and computing a weighted sum at each position.]] uses ==local connectivity== (each output looks at a small patch) and ==weight sharing== (the same kernel is reused everywhere), so it needs far fewer parameters.

### Output size and parameters

For input size n, kernel k, padding p and stride s, the output size is ⌊(n + 2p − k)/s⌋ + 1. A conv layer has (k × k × input channels) weights per filter plus one bias per filter. Example: 16 filters of 5×5 on a 3-channel image have 16 × (5 × 5 × 3) + 16 = 1216 parameters, whatever the image size.

### Convolution by hand

Below, the kernel has top row (1, 0) and bottom row (0, −1), and the input is a 4×4 grid. Each output cell is the sum of (input patch × kernel). For the top-left patch (rows (1, 2) and (0, 1)) that is 1×1 + 2×0 + 0×0 + 1×(−1) = 0. Try stride 1 with padding 0, then stride 2 with padding 1.

```viz
{
  "type": "conv",
  "title": "Compute a convolution by hand",
  "mode": "conv",
  "stride": 1,
  "padding": 0,
  "input": [ [1, 2, 0, 1], [0, 1, 3, 1], [2, 1, 0, 0], [1, 0, 1, 2] ],
  "kernel": [ [1, 0], [0, -1] ]
}
```

With stride 1 and no padding the output is 3×3 (formula: ⌊(4 − 2)/1⌋ + 1 = 3). With stride 2 and padding 1 it is ⌊(4 + 2 − 2)/2⌋ + 1 = 3 as well, but the values differ. Check your hand answers against the figure for every cell.

A typical small CNN is conv → ReLU → pool → flatten → fully connected. [[Pooling|Shrinking a feature map by keeping one value, such as the maximum, from each small window.]] halves the width and height with a 2×2 window and stride 2: a 24×24 map becomes 12×12.

## Key takeaways {rail=Takeaway}

- A ==generative model makes new content; a discriminative model labels or scores existing data==. Know the key dates: Dartmouth 1956, Perceptron 1958, deep learning 2012, Transformer 2017, GPT-3 2020, ChatGPT 2022.
- Learning means ==lowering the loss with gradient descent==: weight − learning rate × gradient. Too large a step oscillates or diverges.
- Backpropagation is the ==chain rule: multiply local derivatives along the path==. Sigmoid gradients are at most 0.25, so deep sigmoid networks lose the gradient.
- ==Convolution gives local connectivity and weight sharing==. Output size is ⌊(n + 2p − k)/s⌋ + 1, and a conv layer has k × k × C_in × filters + filters parameters.

## Study plan {rail=Study plan}

You do not run a lab this week. Use the time to turn understanding into speed. Do the steps in order and tick each one off.

1. **Check the basics (20 min).** Re-read the key takeaways above. Say each one aloud without looking.
2. **Redo the figures (30 min).** Re-sort the sorter until you get every card right. Replay the pipeline and write the six numbers from memory. Predict the descent behaviour before moving the slider.
3. **Redo calculations on paper (45 min).** Neuron output, mean squared error, one gradient-descent step, one chain-rule gradient, a convolution output size, a conv parameter count. These appear again and again.
4. **Practise at [Mock Exam Prep](/mock-exam) (45 min).** Do the timed modules for the topics you covered. They are unlimited attempts, so repeat until you score 70% or more.
5. **Review old labs (30 min).** Re-read your notes from the four labs: GPT-2 temperature, the XOR network, the gradient norms and the CNN. Be ready to explain what you saw, not only the code.
6. **Take the quiz below (15 min).** Then re-read the explanation for every question you missed.

The Prelim is cumulative for the term, so Week 1 history and ethics are covered as well as the maths. Your instructor announces the date, room and format of the exam.

## Check your understanding {rail=Check}

{sub} Formative · Not graded · Unlimited attempts · Your best score is saved to your account

Twelve cumulative questions from Weeks 1–4, several with calculations. Work them on paper first.

```quiz
{
  "id": "week-05-check",
  "title": "Week 5 quiz: Prelim review (Weeks 1–4)",
  "passMark": 70,
  "questions": [
    {
      "q": "Which system is generative rather than discriminative?",
      "options": [
        "A model that labels emails as spam or not spam",
        "A model that writes a new paragraph from a prompt",
        "A model that predicts a house price from its size",
        "A model that decides whether a face matches the phone owner"
      ],
      "answer": 1,
      "why": "Writing a new paragraph creates new content. The other three each return a label or a number for data that already exists."
    },
    {
      "q": "What was the Perceptron (1958)?",
      "options": [
        "A chatbot trained on web text",
        "A program that generated images from text",
        "A rule-based chess engine",
        "An early artificial neuron that learns to classify inputs by adjusting its weights"
      ],
      "answer": 3,
      "why": "Rosenblatt's Perceptron adjusted its weights from examples to classify inputs. It is an ancestor of modern neural networks and is discriminative."
    },
    {
      "q": "A neuron has weights w = (1, −2), bias b = 1 and input x = (2, 1). What is z = w·x + b before the activation?",
      "options": [
        "1",
        "3",
        "−1",
        "5"
      ],
      "answer": 0,
      "why": "z = 1×2 + (−2)×1 + 1 = 2 − 2 + 1 = 1. Option 3 forgets the minus sign on the second weight."
    },
    {
      "q": "A model predicts [2, 4, 7, 5] and the true values are [3, 3, 4, 2]. What is the mean squared error?",
      "options": [
        "2",
        "5",
        "20",
        "8"
      ],
      "answer": 1,
      "why": "The errors are −1, 1, 3, 3. Their squares are 1, 1, 9, 9, which sum to 20. Divide by 4 values to get 5. Option 20 forgets to divide."
    },
    {
      "q": "For L(w) = (w − 3)², you start at w = 0 with learning rate 0.1. What is w after one gradient-descent step?",
      "options": [
        "−0.6",
        "0.3",
        "0.6",
        "6"
      ],
      "answer": 2,
      "why": "The gradient is 2(w − 3) = −6. The update is w − lr × gradient = 0 − 0.1 × (−6) = 0.6. A minus gradient means w moves up, not down."
    },
    {
      "q": "A training run reaches 99% accuracy on training data but 70% on validation data. What is the most likely problem?",
      "options": [
        "Underfitting, because the model is too simple",
        "A learning rate of exactly zero",
        "Overfitting: the model memorised the training data and does not generalise",
        "The validation data should be used for training"
      ],
      "answer": 2,
      "why": "A large gap between training and validation accuracy is the classic sign of overfitting. Underfitting would show poor accuracy on both."
    },
    {
      "q": "With y = w·x, x = 2, w = 3, target t = 4 and loss L = (y − t)², what is dL/dw?",
      "options": [
        "4",
        "8",
        "2",
        "12"
      ],
      "answer": 1,
      "why": "y = 6, so dL/dy = 2(y − t) = 4 and dy/dw = x = 2. By the chain rule dL/dw = 4 × 2 = 8."
    },
    {
      "q": "Each sigmoid layer passes back at most 0.25 of the gradient. Roughly what fraction remains after 5 layers?",
      "options": [
        "About 0.25",
        "About 0.0625",
        "About 0.001",
        "About 0.00000095"
      ],
      "answer": 2,
      "why": "0.25⁵ = 0.0009765625, which is about 0.001. The value 0.00000095 is 0.25 to the power 10, not 5."
    },
    {
      "q": "Which change most directly helps against vanishing gradients in a deep network?",
      "options": [
        "Use ReLU activations with Kaiming initialisation",
        "Use a smaller training set",
        "Use sigmoid activations in every layer",
        "Set the learning rate to zero"
      ],
      "answer": 0,
      "why": "ReLU has gradient 1 for positive inputs and Kaiming initialisation keeps signal sizes stable. Sigmoid is the cause of the problem, not the fix."
    },
    {
      "q": "A 28×28 input goes through a convolution with kernel 3, padding 1 and stride 2. What is the output width?",
      "options": [
        "13",
        "14",
        "26",
        "28"
      ],
      "answer": 1,
      "why": "⌊(28 + 2×1 − 3)/2⌋ + 1 = ⌊13.5⌋ + 1 = 13 + 1 = 14. The value 13 forgets the +1."
    },
    {
      "q": "A conv layer has 16 filters of size 5×5 on a 3-channel input and one bias per filter. How many parameters does it have?",
      "options": [
        "400",
        "1200",
        "1216",
        "1280"
      ],
      "answer": 2,
      "why": "Each filter has 5 × 5 × 3 = 75 weights, so 16 × 75 = 1200. Adding 16 biases gives 1216."
    },
    {
      "q": "A 3×3 kernel whose every row is (1, 0, −1) sits over a patch whose every row is (5, 5, 1). What is the output value?",
      "options": [
        "12",
        "18",
        "0",
        "15"
      ],
      "answer": 0,
      "why": "The first column gives 5+5+5 = 15, the middle column has weight 0, and the last column gives −(1+1+1) = −3. The total is 15 − 3 = 12, a strong vertical-edge response."
    }
  ]
}
```

## How Week 5 is assessed

**The Prelim exam.** The Prelim is the cumulative exam for Weeks 1–4. Your instructor announces the date, room, format and weight. There is no laboratory this week.

**Mock Exam Prep.** [Mock Exam Prep](/mock-exam) has timed practice modules with a 70% pass mark and unlimited attempts. The answers unlock after you submit.

## Exit ticket and homework

Answer these in one or two sentences each:
1. Which calculation from Weeks 2–4 do you find hardest, and what is your plan for it?
2. In your own words, why does a deep sigmoid network lose the gradient?
3. Which of the four weeks do you most need to revisit?

**Homework / self-study**
- Complete the study plan above and repeat any Mock Exam Prep module below 70%.
- Preview Week 6: think about how a computer could turn the sentence "unbelievably good" into numbers.
