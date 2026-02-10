import json
from transformers import pipeline
from difflib import get_close_matches

class KnowledgeBaseChatbot:
    def __init__(self, knowledge_file: str, model_name: str = "google/flan-t5-small"):
        """
        Initializes the chatbot with a knowledge base and a Hugging Face model.

        Args:
            knowledge_file (str): Path to the JSON file containing the knowledge base.
            model_name (str): Name of the Hugging Face model to use for text generation.
        """
        self.knowledge = self._load_knowledge_base(knowledge_file)
        self.pattern_to_answer, self.all_patterns = self._preprocess_knowledge()
        self.generator_pipeline = self._load_huggingface_model(model_name)
        print("\n--- Chatbot Ready ---\n")

    def _load_knowledge_base(self, knowledge_file: str) -> list:
        """Loads the knowledge base from a JSON file."""
        print(f"[⚙️] Loading knowledge base from '{knowledge_file}'...")
        try:
            with open(knowledge_file, "r", encoding="utf-8") as f:
                knowledge = json.load(f)
            print("[✅] Knowledge base loaded.")
            return knowledge
        except FileNotFoundError:
            print(f"[❌] Error: Knowledge file '{knowledge_file}' not found.")
            exit()
        except json.JSONDecodeError:
            print(f"[❌] Error: Could not decode JSON from '{knowledge_file}'.")
            exit()

    def _preprocess_knowledge(self) -> tuple[dict, list]:
        """
        Preprocesses the knowledge base for faster pattern matching.
        Creates a mapping from lowercased patterns to answers and a list of all patterns.
        """
        print("[⚙️] Preprocessing knowledge patterns...")
        pattern_to_answer = {}
        all_patterns = []

        for item in self.knowledge:
            answer = item.get("answer", "No answer provided for this entry.")
            question_patterns = item.get("question_patterns", [])

            if not isinstance(question_patterns, list):
                print(f"[⚠️] Warning: 'question_patterns' for item with answer '{answer[:30]}...' is not a list. Skipping.")
                continue

            for pattern in question_patterns:
                if isinstance(pattern, str):
                    pattern_lower = pattern.lower().strip()
                    pattern_to_answer[pattern_lower] = answer
                    all_patterns.append(pattern_lower)
                else:
                    print(f"[⚠️] Warning: Non-string pattern found in knowledge base: {pattern}. Skipping.")
        print("[✅] Knowledge patterns preprocessed.")
        return pattern_to_answer, all_patterns

    def _load_huggingface_model(self, model_name: str):
        """Loads the Hugging Face text generation pipeline."""
        print(f"[⚙️] Loading Hugging Face model '{model_name}'...")
        try:
            pipeline_instance = pipeline("text2text-generation", model=model_name)
            print("[✅] Model loaded and ready.")
            return pipeline_instance
        except Exception as e:
            print(f"[❌] Error loading Hugging Face model: {e}")
            exit()

    def find_best_match(self, user_input: str) -> str | None:
        """
        Finds the best matching answer from the knowledge base for a given user input.
        Prioritizes exact matches, then falls back to fuzzy matching.
        """
        user_input_lower = user_input.lower().strip()

        # 1. Exact match within patterns
        for pattern, answer in self.pattern_to_answer.items():
            if pattern in user_input_lower:
                return answer

        # 2. Fuzzy match fallback using difflib
        # Using a higher cutoff for better precision in fuzzy matching
        close_matches = get_close_matches(user_input_lower, self.all_patterns, n=1, cutoff=0.75)
        if close_matches:
            return self.pattern_to_answer.get(close_matches[0])

        return None

    def generate_structured_reply(self, user_input: str, matched_answer: str) -> str:
        """
        Generates a clear and informative reply using the loaded LLM,
        based on the user's question and the matched knowledge.
        """
        prompt = (
            f"You are an expert assistant.\n"
            f"User Question: {user_input}\n"
            f"Knowledge Info: {matched_answer}\n"
            f"Generate a clear one sentence, informative response based only on the given knowledge. "
            f"Do not introduce new information."
        )
        try:
            response = self.generator_pipeline(prompt, max_length=250, do_sample=True,
                                               temperature=0.7,  # Add temperature for more diverse outputs
                                               pad_token_id=self.generator_pipeline.tokenizer.eos_token_id)[0]['generated_text']
            return response.strip()
        except Exception as e:
            print(f"[❌] Error during text generation: {e}")
            return "I apologize, but I encountered an error while generating a response."

    def get_bot_reply(self, user_input: str) -> str:
        """
        Processes a user input and returns the chatbot's reply.
        """
        matched_answer = self.find_best_match(user_input)

        if matched_answer:
            reply = self.generate_structured_reply(user_input, matched_answer)
            return reply
        else:
            return "Sorry, I couldn't find an answer to that in my knowledge base. Could you please rephrase your question or ask something else?"

# # === Example Usage ===
# if __name__ == "__main__":
#     # Ensure you have 'knowledge_data.json' in the same directory or provide the full path.
#     # Example knowledge_data.json structure:
#     # [
#     #   {
#     #     "question_patterns": ["what is life path 1", "meaning of life path one"],
#     #     "answer": "Life Path 1 represents individuals who are natural leaders, innovators, and pioneers. They possess a strong drive for independence and achievement. Their core desire is to stand out and initiate new paths. Challenges include selfishness and dominance."
#     #   },
#     #   {
#     #     "question_patterns": ["tell me about life path 2", "characteristics of life path two"],
#     #     "answer": "Life Path 2 individuals are harmonizers, peacemakers, and diplomats. They excel at cooperation, intuition, and sensitivity. Their purpose is to bring people together and foster balance. They may struggle with indecisiveness or being overly sensitive."
#     #   }
#     # ]

#     chatbot = KnowledgeBaseChatbot(knowledge_file="knowledge_data.json")

#     while True:
#         user_question = input("You: ")
#         if user_question.lower() in ["exit", "quit", "bye"]:
#             print("Chatbot: Goodbye!")
#             break
        
#         bot_response = chatbot.get_bot_reply(user_question)
#         print("Chatbot:", bot_response)
#         print("-" * 50)