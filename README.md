# CommentAIze

CommentAIze is an AI-powered web application designed to analyze social media comments extracted from PDF or DOCX files. Leveraging the Mistral language model through Ollama, it provides comprehensive insights including toxic comment detection, sentiment analysis, feedback summarization, and comment categorization.

## Features

- **File Upload Support**: Upload PDF or DOCX files containing social media comments
- **Toxic Comment Detection**: Identifies and lists toxic, hateful, spam, or offensive comments
- **Sentiment Analysis**: Provides an overall sentiment summary with percentages (positive/negative/neutral)
- **Feedback Summarization**: Analyzes comments to summarize likes, dislikes, and suggestions in natural language
- **Comment Categorization**: Groups comments into categories such as appreciation, criticism, suggestions, questions, and spam/troll
- **Web Interface**: User-friendly drag-and-drop interface for file uploads and result visualization
- **REST API**: Programmatic access via API endpoints for integration with other systems
- **Local AI Processing**: Uses Ollama for running Mistral model locally, ensuring privacy and offline capability

## Prerequisites

- Python 3.7 or higher
- [Ollama](https://ollama.ai/) installed and running
- Mistral model pulled in Ollama: `ollama pull mistral:latest`

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CommentAIze
   ```

2. **Install Python dependencies**:
   ```bash
   pip install flask PyMuPDF python-docx ollama
   ```

3. **Start Ollama service** (if not already running):
   ```bash
   ollama serve
   ```

## Usage

### Web Application

1. Start the Flask application:
   ```bash
   python api.py
   ```

2. Open your web browser and navigate to `http://localhost:5000`

3. Upload a PDF or DOCX file containing comments using the drag-and-drop interface

4. View the analysis results including sentiment charts, feedback summaries, comment categories, and toxic comments

### Command Line Interface

For direct analysis without the web interface:

1. Modify the `file_path` in `main.py` to point to your comment file

2. Run the analysis:
   ```bash
   python main.py
   ```

3. The results will be printed to the console

### API Usage

The application provides a REST API endpoint for programmatic access:

**Endpoint**: `POST /api/analyze`

**Parameters**: Multipart form data with a file upload (key: 'file')

**Supported file types**: PDF (.pdf) and DOCX (.docx)

**Response**: JSON object containing the analysis results

Example using curl:
```bash
curl -X POST -F "file=@comments.pdf" http://localhost:5000/api/analyze
```

## Project Structure

```
CommentAIze/
├── main.py              # Core analysis logic and CLI functionality
├── api.py               # Flask web application and API endpoints
├── templates/
│   └── index.html       # Main web interface template
├── static/
│   ├── styles.css       # CSS styles for the web interface
│   └── script.js        # JavaScript for frontend functionality
├── uploads/             # Temporary directory for uploaded files
├── Comment.pdf          # Sample PDF file for testing
├── Comment.docx         # Sample DOCX file for testing
└── README.md            # This file
```

## API Response Format

The analysis returns a JSON object with the following structure:

```json
{
  "toxic_comments": ["List of toxic comments"],
  "sentiment_summary": "Overall sentiment with percentages",
  "feedback_summary": {
    "likes": "Summary of positive feedback",
    "dislikes": "Summary of negative feedback",
    "suggestions": "Summary of suggestions"
  },
  "categorized_comments": {
    "appreciation": ["List of appreciative comments"],
    "criticism": ["List of critical comments"],
    "suggestions": ["List of suggestion comments"],
    "questions": ["List of questions"],
    "spam": ["List of spam/troll comments"]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Mistral AI](https://mistral.ai/) for the language model
- [Ollama](https://ollama.ai/) for local AI model serving
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [PyMuPDF](https://pymupdf.readthedocs.io/) for PDF processing
- [python-docx](https://python-docx.readthedocs.io/) for DOCX processing
