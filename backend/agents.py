import os, json
from groq import Groq
from rubric import get_opponent_persona , NEGOTIATION_RUBRIC
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "openai/gpt-oss-120b"

def opponent_agent(conversation_history, scenario="salary"):
    system_prompt = get_opponent_persona(scenario)
    messages = [{"role": "system", "content": system_prompt}] + conversation_history

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.9,
        max_tokens=300,
    )
    return response.choices[0].message.content


def coach_agent(last_human_message, conversation_history):
    context = "\n".join([f"{m['role']}: {m['content']}" for m in conversation_history[-4:]])
    prompt = f"Conversation so far:\n{context}\n\nRubric:\n{NEGOTIATION_RUBRIC}"
    fallback = {
        "summary": "Unable to generate coaching guidance right now.",
        "recommendations": [],
        "score": 0,
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
        print(f"coach_agent failed: {e}")
        return fallback