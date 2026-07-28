from openai import OpenAI
from config import Config

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL
)

def ask_ai(message):
    response = client.chat.completions.create(
        model="auto",      # or your working model
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful AI assistant. "
                    "Always reply in the same language as the user. "
                    "If the user writes in English, answer in English. "
                    "If the user writes in Filipino, answer in Filipino. "
                    "If the user writes in Chinese, answer in Chinese."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return response.choices[0].message.content
