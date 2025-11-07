from langchain_groq import ChatGroq

model_config = {"name": "llama-3.1-8b-instant", "temperature": 0.5, "max_tokens": 2}


def generate_llm_from_api_key(api_key: str) -> ChatGroq:
    """
    Generates a ChatGroq LLM instance using the provided API key.
    """
    llm_instance = ChatGroq(
        model=model_config["name"],
        temperature=model_config["temperature"],
        max_tokens=None,
        timeout=None,
        api_key=api_key,
    )

    return llm_instance
