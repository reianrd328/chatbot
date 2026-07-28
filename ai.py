
from openai import OpenAI
from config import Config

client = OpenAI(
    api_key=Config.API_KEY,
    base_url=Config.BASE_URL
)


def ask_ai(message):

    try:

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"
