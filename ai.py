from openai import OpenAI
from config import Config

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL
)

SYSTEM_PROMPT = """
You are Lyrch AI.
Reply in the same language as the user.
"""

def ask_ai(message):

    response = client.chat.completions.create(
        model="auto",
        messages=[
            {
                "role":"system",
                "content":SYSTEM_PROMPT
            },
            {
                "role":"user",
                "content":message
            }
        ]
    )

    return response.choices[0].message.content
