import os
import fitz  # PyMuPDF for PDF reading
import docx
from ollama import chat

# --- STEP 1: Read comments from PDF or Word file ---
def extract_comments_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()

def extract_comments_from_docx(file_path):
    doc = docx.Document(file_path)
    text = "\n".join([p.text for p in doc.paragraphs])
    return text.strip()

def extract_comments(file_path):
    if file_path.endswith(".pdf"):
        return extract_comments_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_comments_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Use .pdf or .docx")

# --- STEP 2: Build prompt for Mistral ---
def build_prompt(comments_text):
    prompt = f"""
You are CommentAIze, an AI assistant for analyzing social media comments.

Given the following set of comments (each may include like/dislike counts), perform all of the following:

1. **Toxic Comment Detection:** Identify and list comments that are toxic, hateful, spam, or offensive.
2. **Sentiment Summary:** Summarize overall sentiment (positive/negative/neutral) with percentages.
3. **Feedback Summarization:** Analyze all the comments and summarize the general audience feedback in natural language.
- Do NOT include or quote any individual comments.
- Instead, describe the overall opinions or patterns of what the viewers liked, disliked, and suggested.
- Keep each category (likes, dislikes, suggestions) short — ideally 1-2 sentences each.
- The tone should sound like you are explaining insights to the creator directly.
Example format:
"feedback_summary": {{
   "likes": "Viewers appreciated your editing quality, enthusiasm, and the helpfulness of your tutorial.",
   "dislikes": "Some viewers found the background music distracting and thought the pacing was too fast.",
   "suggestions": "Many requested a slower walkthrough and a version focused on mobile editing."
}}
4. **Comment Categorization:** Group comments into (in points):
   - Appreciation
   - Criticism
   - Suggestion
   - Question
   - Spam/Troll

Return your response in **structured JSON** format with the keys:
{{
  "toxic_comments": [...],
  "sentiment_summary": "...",
  "feedback_summary": {{
    "likes": [...],
    "dislikes": [...],
    "suggestions": [...]
  }},
  "categorized_comments": {{
    "appreciation": [...],
    "criticism": [...],
    "suggestions": [...],
    "questions": [...],
    "spam": [...]
  }}
}}

Here are the comments for analysis:
---
{comments_text}
---
"""
    return prompt

# --- STEP 3: Query Mistral via Ollama ---
def analyze_comments(file_path, model="mistral:latest"):
    comments_text = extract_comments(file_path)
    prompt = build_prompt(comments_text)

    print("🧠 Running CommentAIze analysis using Mistral locally...")
    response = chat(model=model, messages=[{"role": "user", "content": prompt}])
    return response["message"]["content"]

# --- STEP 4: Example Run ---
if __name__ == "__main__":
    file_path = r"C:\Users\ssanj\OneDrive\Desktop\Sanjay\CommentAIze\Comment.pdf"  
    result = analyze_comments(file_path)
    print("\n=== CommentAIze Analysis Result ===\n")
    print(result)
