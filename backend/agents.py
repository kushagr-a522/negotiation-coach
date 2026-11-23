import os
import json
from groq import Groq
from dotenv import load_dotenv
from rubric import get_opponent_persona, get_coach_rubric

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "openai/gpt-oss-120b"


def opponent_agent(conversation_history, scenario="salary", difficulty="medium"):
    system_prompt = get_opponent_persona(scenario, difficulty)
    messages = [{"role": "system", "content": system_prompt}] + conversation_history

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.9,
        max_tokens=300,
    )
    return response.choices[0].message.content


def coach_agent(last_human_message, conversation_history, focus="general"):
    context = "\n".join([m["role"] + ": " + m["content"] for m in conversation_history[-4:]])
    prompt = "Conversation so far:\n" + context + "\n\nRubric:\n" + get_coach_rubric(focus)

    fallback = {
        "anchoring": 0,
        "no_free_concession": 0,
        "leverage_use": 0,
        "calm_confidence": 0,
        "total_score": 0,
        "feedback": "Could not score this message.",
    }

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print("coach_agent failed:", e)
        return fallback