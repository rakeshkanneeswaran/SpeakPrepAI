from openai import OpenAI


class OpenAIClient:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def generate(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict technical interviewer. "
                        "You ask short, direct, real-world questions. "
                        "You NEVER explain or teach. "
                        "You NEVER use lists or multiple questions."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.6,
            max_tokens=60,
        )

        return response.choices[0].message.content.strip()
