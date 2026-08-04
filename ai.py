from openai import OpenAI
from config import Config
import traceback
import time

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL,
    timeout=30
)

SYSTEM_PROMPT = """
You are Lyrch AI.

Reply in the same language as the user.

Be helpful, professional, and concise.
"""

def ask_ai(message):

    start = time.time()

    try:

        print("=" * 60)
        print("Calling Router by Nara")
        print("BASE URL:", Config.BASE_URL)
        print("MODEL:", Config.MODEL)
        print("API KEY EXISTS:", bool(Config.API_KEY))
        print("USER MESSAGE:", message)
        print("=" * 60)

        response = client.chat.completions.create(

            model=Config.MODEL,

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

        reply = response.choices[0].message.content

        print("Finished in %.2fs" % (time.time() - start))
        print("AI Reply:", reply)

        return reply

    except Exception as e:

        print("=" * 60)
        print("AI ERROR")
        print(type(e).__name__)
        print(str(e))
        traceback.print_exc()
        print("=" * 60)

        raise
