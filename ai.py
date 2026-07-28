from openai import OpenAI
from config import Config

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL
)


def ask_ai(message):
    response = client.chat.completions.create(
        model="DeepSeek-V4-Flash",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI assistant."
            },
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return response.choices[0].message.content
