import os

from groq import Groq


class GroqGenerator:

    def __init__(
        self,
        api_key=None,
        model="openai/gpt-oss-20b",
    ):

        api_key = (
            api_key
            or os.getenv("GROQ_API_KEY")
        )

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not configured."
            )

        self.client = Groq(
            api_key=api_key
        )

        self.model = model

    def generate(
        self,
        prompt,
        temperature=0.2,
        reasoning_effort="low",
        max_completion_tokens=1024,
    ):

        response = (
            self.client
            .chat
            .completions
            .create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature=temperature,
                max_completion_tokens=max_completion_tokens,
                stream=False,
            )
        )

        message = response.choices[0].message

        return {
            "text": (
                message.content or ""
            ).strip(),

            "finish_reason": (
                response.choices[0]
                .finish_reason
            ),

            "usage": (
                response.usage.model_dump()
                if response.usage
                else None
            ),
        }