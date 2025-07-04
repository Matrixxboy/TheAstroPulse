import os
import sys # Unused, can remove
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

from langchain_core.prompts import ChatPromptTemplate # Use ChatPromptTemplate for chat models
from langchain.prompts import PromptTemplate # Still useful if you strictly want a non-chat template, but ChatPromptTemplate is preferred for ChatGroq
from transformers import pipeline # Unused if using ChatGroq for generation
import pathlib # Unused, can remove
from functools import lru_cache # To be used for caching if desired
from dotenv import load_dotenv
load_dotenv()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_PATH = os.path.join(BASE_DIR, "local_faiss_index")

# --- Environment Variable Check (Good Practice) ---
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
if not GROQ_API_KEY:
    print("Error: GROQ_API_KEY not found in environment variables.", file=sys.stderr)
    print("Please set it in your .env file or environment.", file=sys.stderr)
    sys.exit(1) # Exit if the key is missing

# os.environ["GROQ_API_KEY"] = GROQ_API_KEY # Redundant, load_dotenv already handles it. Remove this line.


# === Load Embedding Model Once ===
print("[⚙️] Loading embedding model...")
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
print("[✅] Embedding model loaded.")

# === Load FAISS Vector DB Once ===
print(f"[⚙️] Loading FAISS index from '{FAISS_PATH}'...")
try:
    db = FAISS.load_local(FAISS_PATH, embeddings=embedding_model, allow_dangerous_deserialization=True)
    print("[✅] FAISS index loaded.")
except Exception as e:
    print(f"[❌] Error loading FAISS index: {e}", file=sys.stderr)
    print("Ensure 'local_faiss_index' directory exists and is correctly populated.", file=sys.stderr)
    sys.exit(1) # Exit if FAISS fails to load

# === Initialize ChatGroq LLM Once ===
print("[⚙️] Initializing ChatGroq LLM...")
llm = ChatGroq(
    model="llama3-8b-8192",
    temperature=0.4,
    max_tokens=500
)
print("[✅] ChatGroq LLM initialized.")


# If you definitely want to use FLAN-T5 at some point or for other purposes, keep this:
# print("[⚙️] Loading FLAN-T5 model...")
# flan_t5_pipe = pipeline("text2text-generation", model="google/flan-t5-small")
# print("[✅] FLAN-T5 model loaded.")


# === Q&A Logic ===
# Use @lru_cache if you want to cache the output of the function for identical queries.
# Be mindful of potential memory usage for the cache if maxsize is large.
# @lru_cache(maxsize=128)
def chat_bot_reply(user_query: str) -> str:
    # Get Top Matching Chunks - The retriever will handle this.
    # db.as_retriever(search_kwargs={"k": 2}) creates a retriever from your FAISS DB
    retriever = db.as_retriever(search_kwargs={"k": 2})

    # === Form Instructional Prompt using ChatPromptTemplate ===
    # Using ChatPromptTemplate for better structure with chat models
    system_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a professional numerologist. Only respond to questions related to numerology. Analyze the provided context carefully and respond clearly, briefly, and professionally. If the answer cannot be found within the given context, reply by stating that there is not enough information to provide an answer."),
        ("human", "Context:\n{context}\n\nQuestion:\n{input}") # 'input' is the default placeholder for the user's query in LangChain chains
    ])

    # create_stuff_documents_chain combines documents into the prompt
    document_chain = create_stuff_documents_chain(llm, system_prompt)

    # create_retrieval_chain combines retrieval (from FAISS) and document chaining
    # It takes a retriever and the document_chain
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    # Invoke the chain with just the user's question.
    # The 'retrieval_chain' will automatically:
    # 1. Use the retriever to get 'context' documents based on 'input'.
    # 2. Pass these 'context' documents and the original 'input' to the 'document_chain'.
    # 3. The 'document_chain' will then format them into the 'system_prompt' and send to 'llm'.
    result = retrieval_chain.invoke({"input": user_query}) # 'input' is the key for the user's query

    # The result from invoke typically contains the 'answer' key for these chains
    final_answer = result.get('answer', "No answer found or an error occurred.")

    # If you wanted to use FLAN-T5 (not recommended to mix with ChatGroq for the same task)
    # prompt_for_flan = system_prompt.format_messages(context=context, input=user_query)[1].content # Extract human message content
    # final_answer = flan_t5_pipe(prompt_for_flan, max_new_tokens=150)[0]["generated_text"]

    # print(f"\n💬 Answer: {final_answer}") # For testing/debugging

    # If using lru_cache, the function's return value will be cached.
    return final_answer