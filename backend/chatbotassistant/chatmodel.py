import os
import sys
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from transformers import pipeline
import pathlib
from functools import lru_cache

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_PATH = os.path.join(BASE_DIR, "local_faiss_index")

# === Load Embedding + FAISS Vector DB ===
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = FAISS.load_local(FAISS_PATH, embeddings=embedding_model, allow_dangerous_deserialization=True)

# === Load FLAN-T5 Only Once ===
pipe = pipeline("text2text-generation", model="google/flan-t5-small")

# print("💡 Vermeil AI is ready! Type 'exit' to stop.")
cache = {}
# === Q&A Loop ===
def chat_bot_reply(user_query):
    # === Get Top Matching Chunks ===
    docs = db.similarity_search(user_query, k=2)
    context = "\n".join([doc.page_content for doc in docs])

    # === Form Instructional Prompt ===
    prompt = (
        f"As a professional numerologist, analyze the context and provide a well-structured and informative answer to the question.\n"
        f"Include examples or interpretations if helpful.\n\n"
        f"Context:\n{context}\n\n"
        f"Question:\n{user_query}\n\n"
        f"Answer:"
    )
    
    # === Get the Answer from FLAN-T5 ===
    result = pipe(prompt, max_new_tokens=150)[0]["generated_text"]
    # print(f"\n💬 Answer: {result}")

    # OPTIONAL: Use LLM to generate answer (need OpenAI key or HF)
    # chain = load_qa_chain(ChatOpenAI(temperature=0), chain_type="stuff")
    # response = chain.run(input_documents=docs, question=user_query)
    # print("\n🤖 Answer:", response)
    cache[user_query] = result
    return result
