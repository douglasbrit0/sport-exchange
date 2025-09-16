from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

LABELS = ["negative", "neutral", "positive"]

def predict_sentiment(model, tokenizer, text: str):
    encoded_input = tokenizer(
        text,
        return_tensors='pt',
        truncation=True,
        max_length=512,  # Explicitly cap at model's supported length
        padding=True
    )
    with torch.no_grad():
        output = model(**encoded_input)
        scores = output.logits[0].detach().numpy()
        scores = softmax(scores)
        label = LABELS[np.argmax(scores)]
        confidence = float(np.max(scores))

    if label == "positive":
        return 1.0 * confidence
    elif label == "neutral":
        return 0.5 * confidence
    else:
        return 0.0 * confidence

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()
