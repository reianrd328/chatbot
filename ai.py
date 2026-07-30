def ask_ai(message):

    try:

        response = client.chat.completions.create(
            model="auto",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Lyrch AI. "
                        "Reply in the same language as the user."
                    )
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        print("========== AI ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("==============================")

        raise
