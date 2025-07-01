from langchain_community.document_loaders import PyPDFLoader,DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings
from dotenv import load_dotenv
load_dotenv()


def load_pdf_file(data):
    loader = DirectoryLoader(
        data,
        glob="*pdf",
        loader_cls=PyPDFLoader
    )
    documents = loader.load()
    return documents

extracted_data = load_pdf_file(data='knowledge/')

def text_split(extracted_data):
    text_spliter = RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=20)
    text_chunks = text_spliter.split_documents(extracted_data)
    return text_chunks

text_chunks = text_split(extracted_data)
print(f"Length of the text chunks : ",len(text_chunks))

def Hugging_face_embedding():
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    return embeddings
