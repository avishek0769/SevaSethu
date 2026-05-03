from flask import Flask, render_template, request, jsonify
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from langdetect import detect, DetectorFactory
from dotenv import load_dotenv
from deep_translator import GoogleTranslator
from flask_cors import CORS
import json
import os
import re

load_dotenv()

app = Flask(__name__)
CORS(app, methods=["POST", "GET", "PUT", "OPTIONS"])
DetectorFactory.seed = 0

FILE_NAME = "chat_history.json"

allowed_keys = [
    "blood", "donate", "donation", "donor",
    "plasma", "platelet", "blood bank",
    "blut", "sangre", "sang", "血液", "रक्त", "خون", "দান", "রক্ত"
]

SYSTEM_PROMPT = (
    "You are a helpful medical assistant specialized only in blood donation. "
    "Answer in 2 to 3 sentences maximum. "
    "Be descriptive, informative, and easy to understand. "
    "Write in plain prose only. No lists, no bullet points, no numbered steps, no headers, no tables. "
    "Do not repeat the same sentence twice in your response. "
    "Only use letters, numbers, periods, and commas in your response. "
    "Do not use any of these characters: # * \\ / | : ; - ! ? >= <= ~ ^ "
    "Do not use special symbols like >= or approximately signs. Write numbers and comparisons in plain words instead. "
    "For example, write 'at least 50 kg' instead of '>= 50 kg', and 'about' instead of the approximately symbol. "
    "Always respond in English. "
    "If the question is not about blood donation, reply exactly: "
    "Sorry, I can only answer blood donation related questions."
)

llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    model="openai/gpt-oss-120b:free",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


def detect_language(text):
    try:
        lang_code = detect(text[:512])
        print(f"Detected language: {lang_code}")
        return lang_code
    except Exception as e:
        print(f"Language detection error: {e}")
        return "en"


def translate_to_english(text, src_lang):
    try:
        if src_lang == "en":
            return text
        translated = GoogleTranslator(
            source=src_lang, target="en").translate(text)
        return translated
    except Exception as e:
        print(f"Translation to English error: {e}")
        return text


def translate_from_english(text, target_lang):
    try:
        if target_lang == "en":
            return text
        translated = GoogleTranslator(
            source="en", target=target_lang).translate(text)
        return translated
    except Exception as e:
        print(f"Translation from English error: {e}")
        return text


def clean_response(text):
    text = re.sub(r'[#*\\/|:;!\?\-~^]', '', text)
    text = re.sub(r'[≥≤≈±×÷→←↑↓]', '', text)
    text = re.sub(r'[><=]', '', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r' ([.,])', r'\1', text)
    return text.strip()


def dedup_sentences(text):
    sentences = re.split(r'(?<=[.])\s+', text)
    seen = []
    for s in sentences:
        if s.strip() and s.strip() not in seen:
            seen.append(s.strip())
    return ' '.join(seen)


def save_chat(history):
    data = []
    for msg in history:
        if isinstance(msg, SystemMessage):
            role = "system"
            item = {"role": role, "content": msg.content}
        elif isinstance(msg, HumanMessage):
            role = "human"
            item = {"role": role, "content": msg.content}
        elif isinstance(msg, AIMessage):
            role = "ai"
            item = {"role": role, "content": msg.content}
            # store language if present
            if hasattr(msg, 'lang') and msg.lang:
                item["lang"] = msg.lang
        else:
            continue
        data.append(item)

    temp_file = FILE_NAME + ".tmp"
    with open(temp_file, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(temp_file, FILE_NAME)


def load_chat():
    if not os.path.exists(FILE_NAME):
        return [SystemMessage(content=SYSTEM_PROMPT)]

    try:
        with open(FILE_NAME, "r") as f:
            content = f.read().strip()
            if not content:
                raise ValueError("Empty file")
            data = json.loads(content)
    except (json.JSONDecodeError, ValueError):
        print("chat_history.json corrupted. Recreating...")
        default = [{"role": "system", "content": SYSTEM_PROMPT}]
        with open(FILE_NAME, "w") as f:
            json.dump(default, f, indent=2)
        return [SystemMessage(content=SYSTEM_PROMPT)]

    history = []
    for item in data:
        if item["role"] == "system":
            history.append(SystemMessage(content=item["content"]))
        elif item["role"] == "human":
            history.append(HumanMessage(content=item["content"]))
        elif item["role"] == "ai":
            msg = AIMessage(content=item["content"])
            if "lang" in item:
                msg.lang = item["lang"]
            history.append(msg)
    return history


chat_history = load_chat()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    global chat_history
    user_input = request.json.get("message", "").strip()

    detected_lang = detect_language(user_input)
    english_input = translate_to_english(user_input, detected_lang)
    english_input_lower = english_input.lower().strip()

    if english_input_lower in ["hi", "hello", "greetings"]:
        reply = "I am a Blood Bot, how can I help you."
        return jsonify({"reply": translate_from_english(reply, detected_lang), "lang": detected_lang})

    if not any(word in english_input_lower for word in allowed_keys):
        reply = "Sorry, I can only answer blood donation related questions."
        return jsonify({"reply": translate_from_english(reply, detected_lang), "lang": detected_lang})

    if english_input_lower == "exit":
        reply = "Goodbye, take care."
        return jsonify({"reply": translate_from_english(reply, detected_lang), "lang": detected_lang})

    chat_history.append(HumanMessage(content=english_input))
    chat_history = chat_history[-20:]

    try:
        response = llm.invoke(chat_history)
        ai_content = response.content.strip()
        ai_content = clean_response(ai_content)
        ai_content = dedup_sentences(ai_content)

        sentences = re.split(r'(?<=[.])\s+', ai_content)
        if len(sentences) > 3:
            ai_content = ' '.join(sentences[:3])
            if not ai_content.endswith('.'):
                ai_content += '.'

    except Exception as e:
        print(f"LLM error: {e}")
        chat_history.pop()
        reply = "Sorry, I am having trouble right now. Please try again."
        return jsonify({"reply": translate_from_english(reply, detected_lang), "lang": detected_lang})

    # Store the AI message with detected language
    ai_message = AIMessage(content=ai_content)
    ai_message.lang = detected_lang
    chat_history.append(ai_message)
    save_chat(chat_history)

    final_reply = translate_from_english(ai_content, detected_lang)
    return jsonify({"reply": final_reply, "lang": detected_lang})


@app.route("/history")
def history():
    formatted = []
    for msg in chat_history:
        if isinstance(msg, SystemMessage):
            role = "system"
            item = {"role": role, "content": msg.content}
        elif isinstance(msg, HumanMessage):
            role = "human"
            item = {"role": role, "content": msg.content}
        elif isinstance(msg, AIMessage):
            role = "ai"
            item = {"role": role, "content": msg.content}
            if hasattr(msg, 'lang') and msg.lang:
                item["lang"] = msg.lang
        else:
            continue
        formatted.append(item)
    return jsonify(formatted)


if __name__ == "__main__":
    app.run(debug=True)
