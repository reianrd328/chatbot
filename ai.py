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
        print("=" * 60)
        print("Calling AI...")
        print("API KEY EXISTS:", bool(Config.API_KEY))
        print("BASE URL:", Config.BASE_URL)
        print("MODEL:", "auto")
        print("USER MESSAGE:", message)
        print("=" * 60)

        response = client.chat.completions.create(
            model="auto",
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

        reply = response.choices[0].message.content

        print("AI Reply:", reply)

        return reply

    except Exception as e:
        import traceback

        print("=" * 60)
        print("AI ERROR")
        print("Exception Type:", type(e).__name__)
        print("Exception:", str(e))
        traceback.print_exc()
        print("=" * 60)

        raise
