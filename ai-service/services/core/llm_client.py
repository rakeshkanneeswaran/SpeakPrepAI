from langchain_openai import ChatOpenAI
import logging
import time

logger = logging.getLogger(__name__)

model_config = {"name": "gpt-4.1-mini", "temperature": 0.5}


def generate_llm_for_question_from_api_key(api_key: str) -> ChatOpenAI:
    """
    Generates a ChatOpenAI LLM instance for generating questions.
    """
    llm_instance = ChatOpenAI(
        model=model_config["name"],
        temperature=model_config["temperature"],
        max_tokens=50,  # Short questions
        timeout=10,  # 10 second timeout for questions
        api_key=api_key,
    )
    return llm_instance


def generate_llm_from_api_key(api_key: str) -> ChatOpenAI:
    """
    Generates a ChatOpenAI LLM instance for normal responses.
    """
    llm_instance = ChatOpenAI(
        model=model_config["name"],
        temperature=model_config["temperature"],
        max_tokens=None,  # No token limit (controlled by prompt template)
        timeout=30,  # 30 second timeout for longer responses
        api_key=api_key,
    )
    return llm_instance


def invoke_llm_with_retry(llm: ChatOpenAI, prompt: str, max_retries: int = 2):
    """
    Invoke LLM with automatic retry on failure
    """
    last_exception = None

    for attempt in range(max_retries + 1):
        try:
            return llm.invoke(prompt)
        except Exception as e:
            last_exception = e
            if attempt == max_retries:
                logger.error(
                    f"LLM call failed after {max_retries + 1} attempts: {str(e)}"
                )
                raise e

            delay = 1 * (2**attempt)  # Exponential backoff: 1s, 2s, 4s
            logger.warning(
                f"LLM call attempt {attempt + 1} failed. Retrying in {delay}s..."
            )
            time.sleep(delay)

    raise last_exception
