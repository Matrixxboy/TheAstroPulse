import os
import sys
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from helper import load_pdf_file, text_split, Hugging_face_embedding

# Load environment variables
load_dotenv()

# === STEP 1: Load and Prepare Data ===
extracted_data = load_pdf_file(data='knowledge/')
text_chunks = text_split(extracted_data)
embeddings = Hugging_face_embedding()  # This should return a HuggingFaceEmbeddings object

# === STEP 2: Create FAISS index ===
faiss_index = FAISS.from_documents(
    documents=text_chunks,
    embedding=embeddings
)

# === STEP 3: Save the index locally ===
faiss_index.save_local("local_faiss_index")

print("✅ Data has been embedded and saved locally using FAISS.")
