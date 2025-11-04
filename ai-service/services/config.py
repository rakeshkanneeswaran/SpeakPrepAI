from langchain_groq import ChatGroq

model_config = {"name": "llama-3.1-8b-instant", "temperature": 0.5, "max_tokens": 2}

llm = ChatGroq(
    model=model_config["name"],
    temperature=model_config["temperature"],
    max_tokens=None,
    timeout=None,
    max_retries=model_config["max_tokens"],
)
