import dotenv
import os
import logging

from services.interview.engine import InterviewEngine
from services.llm.openai_client import OpenAIClient
from services.context_store.redis_context_store import redis_context_store_manager

# ENV
dotenv.load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# LOGGING
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# ENGINE INIT
llm_client = OpenAIClient(api_key)
interview_engine = InterviewEngine(redis_context_store_manager, llm_client)
