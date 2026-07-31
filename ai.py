from openai import OpenAI
from config import Config
import time

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL,
    timeout=20
)

SYSTEM_PROMPT = """
You are Lyrch AI.
Reply in the same language as the user.
"""

def ask_ai(message):
    start = time.time()

    try:
        print("Calling AI...")

        response = client.chat.completions.create(
            model="DeepSeek-V4-Flash",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        print(f"Finished in {time.time() - start:.2f}s")

        return response.choices[0].message.content

    except Exception as e:
        print("AI ERROR:", repr(e))
        raise
