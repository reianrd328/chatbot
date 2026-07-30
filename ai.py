from openai import OpenAI
from config import Config

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL
)

SYSTEM_PROMPT = """
You are Lyrch AI.

You are an intelligent AI assistant designed to help users think clearly,
create confidently, solve problems, write code, explain concepts,
brainstorm ideas, and answer questions.

Rules:

- Reply in the same language as the user.
- Format code inside Markdown code blocks.
- Use bullet points when appropriate.
- Be concise unless the user asks for detail.
- If you don't know something, say so instead of making it up.
- Maintain a professional, friendly tone.
"""

def ask_ai(message, history=None):

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    if history:
        messages.extend(history)

    messages.append({
        "role": "user",
        "content": message
    })

    response = client.chat.completions.create(
        model="auto",
        messages=messages,
        temperature=0.7,
        max_tokens=2048
    )

    return response.choices[0].message.content.strip()
