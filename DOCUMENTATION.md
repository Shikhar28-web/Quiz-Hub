# 📚 Quiz Hub - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Installation & Setup](#installation--setup)
8. [Usage Guide](#usage-guide)
9. [Configuration](#configuration)
10. [Development](#development)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Quiz Hub** is an AI-powered web application that automatically generates intelligent quizzes from various content sources. It's designed for educators, teachers, and anyone who needs to create assessments quickly and efficiently.

### Key Highlights
- **AI-Powered**: Uses Google Gemini or Hugging Face AI for intelligent question generation
- **Multi-Format Support**: Handles PDF, DOCX, PPTX, TXT files, URLs, and direct text input
- **Real-time Preview**: See generated questions before saving
- **Auto-grading**: Instant results with detailed feedback
- **Shareable Links**: Easy test distribution to students
- **Responsive Design**: Works on desktop and mobile devices

---

## ✨ Features

### 🎯 Smart Quiz Generation
- **Multiple Input Sources**
  - File upload (PDF, DOCX, PPTX, TXT)
  - URL content extraction
  - Direct text input
- **AI-Powered Questions**
  - Google Gemini API integration
  - Hugging Face Inference API support
  - Built-in heuristic generator (offline fallback)
- **Customizable Settings**
  - Question count (1-100)
  - Difficulty levels (Easy, Medium, Hard)
  - Question type distribution

### 📝 Question Types
- **Multiple Choice Questions (MCQ)**: Single correct answer from multiple options
- **True/False Questions**: Binary choice questions
- **Multiple Correct Answers**: Select all that apply
- **Fill in the Blank**: Text-based completion questions

### 🎨 User Experience
- **Modern UI**: Clean, responsive design
- **Theme Toggle**: Dark/light mode switching
- **Real-time Preview**: Preview questions before saving
- **Shareable Links**: Generate unique URLs for test distribution
- **Auto-grading**: Instant scoring and feedback
- **Question Ratings**: Students can rate question quality (1-5 stars)

### 🤖 AI Assistant
- **Built-in Chatbot**: Context-aware help system
- **Test Material Understanding**: AI understands the test content
- **Real-time Assistance**: Get help during test-taking

---

## 🛠️ Technology Stack

### Backend
- **Python 3.7+**: Core programming language
- **Flask 3.0.3**: Web framework for API and routing
- **Flask-CORS 4.0.0**: Cross-origin resource sharing
- **SQLite**: Lightweight database for data persistence

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling and responsive design
- **Vanilla JavaScript (ES6+)**: Client-side functionality
- **No Frameworks**: Pure vanilla implementation for simplicity

### File Processing
- **PyPDF2 3.0.1**: PDF text extraction
- **python-docx 1.1.2**: Microsoft Word document processing
- **python-pptx 0.6.23**: PowerPoint presentation processing
- **BeautifulSoup4 4.12.3**: HTML parsing for web content

### AI/ML Integration
- **Google Generative AI 0.7.2**: Gemini API integration
- **Hugging Face Inference API**: Alternative AI provider
- **Built-in Heuristic Generator**: Offline fallback system

### HTTP & Networking
- **Requests 2.32.3**: HTTP library for API calls and web scraping

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Browser)     │◄──►│   (Flask)       │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │    │ • REST API      │    │ • Google Gemini │
│ • Responsive UI │    │ • File Processing│    │ • Hugging Face  │
│ • Theme Toggle  │    │ • Database      │    │ • Web Scraping  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │                 │
                       │ • Tests         │
                       │ • Submissions   │
                       │ • Ratings       │
                       └─────────────────┘
```

### File Structure
```
Quiz Hub/
├── server.py              # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.py              # Setup script
├── README.md             # Project overview
├── DOCUMENTATION.md      # This documentation
└── quize/                # Frontend files
    ├── index.html        # Main application page
    ├── app.js            # JavaScript functionality
    ├── style.css         # Styling
    └── quize.html        # Redirect file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
No authentication required - all endpoints are public.

### Endpoints

#### 1. Create Test
**POST** `/api/create_test`

Creates a new quiz from uploaded content.

**Request Body (Multipart Form Data):**
```json
{
  "title": "string",
  "settings": "JSON string",
  "file": "file (optional)",
  "url": "string (optional)",
  "text": "string (optional)"
}
```

**Settings JSON Structure:**
```json
{
  "num_questions": 10,
  "type_distribution": {
    "mcq": 4,
    "true_false": 3,
    "multiple_correct": 1,
    "fill_blank": 2
  },
  "difficulty_distribution": {
    "easy": 4,
    "medium": 3,
    "hard": 3
  }
}
```

**Response:**
```json
{
  "test_id": "uuid",
  "title": "string",
  "questions": [
    {
      "id": "uuid",
      "type": "mcq|true_false|multiple_correct|fill_blank",
      "difficulty": "easy|medium|hard",
      "prompt": "string",
      "options": ["array"],
      "correct": "answer",
      "explanation": "string",
      "topic": "string"
    }
  ]
}
```

#### 2. Get Test
**GET** `/api/test/<test_id>`

Retrieves a test for student access (answers masked).

**Response:**
```json
{
  "test_id": "uuid",
  "title": "string",
  "questions": [
    {
      "id": "uuid",
      "type": "string",
      "difficulty": "string",
      "prompt": "string",
      "options": ["array"],
      "explanation": "string",
      "topic": "string"
    }
  ]
}
```

#### 3. Submit Answers
**POST** `/api/submit/<test_id>`

Submits student answers and returns results.

**Request Body:**
```json
{
  "student_name": "string",
  "answers": {
    "question_id": "answer"
  }
}
```

**Response:**
```json
{
  "submission_id": "uuid",
  "total": 10,
  "correct": 8,
  "score": 8,
  "accuracy": 80.0,
  "details": [
    {
      "id": "uuid",
      "type": "string",
      "prompt": "string",
      "correct": true,
      "correct_answer": "answer",
      "student_answer": "answer",
      "explanation": "string"
    }
  ]
}
```

#### 4. Rate Question
**POST** `/api/rate/<test_id>`

Submits a question quality rating.

**Request Body:**
```json
{
  "question_idx": 0,
  "rating": 5
}
```

**Response:**
```json
{
  "ok": true
}
```

#### 5. Export Test Link
**GET** `/api/export/<test_id>`

Generates a shareable link for the test.

**Response:**
```json
{
  "link": "http://localhost:5000/test/uuid"
}
```

#### 6. Chat Assistant
**POST** `/api/chat`

Sends a message to the AI assistant.

**Request Body:**
```json
{
  "message": "string",
  "test_id": "uuid (optional)"
}
```

**Response:**
```json
{
  "reply": "string"
}
```

---

## 🗄️ Database Schema

### Tables

#### 1. `tests`
Stores quiz metadata and questions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Unique test identifier |
| `title` | TEXT | Test title |
| `created_at` | TEXT | ISO timestamp |
| `settings_json` | TEXT | JSON string of test settings |
| `questions_json` | TEXT | JSON array of questions |
| `source_text` | TEXT | Original source content |

#### 2. `submissions`
Records student answers and scores.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Unique submission identifier |
| `test_id` | TEXT | Reference to test |
| `submitted_at` | TEXT | ISO timestamp |
| `student_name` | TEXT | Student's name |
| `answers_json` | TEXT | JSON object of student answers |
| `score` | REAL | Number of correct answers |
| `accuracy` | REAL | Percentage accuracy |
| `details_json` | TEXT | JSON array of detailed results |

#### 3. `ratings`
Stores question quality ratings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Unique rating identifier |
| `test_id` | TEXT | Reference to test |
| `question_idx` | INTEGER | Question index |
| `rating` | INTEGER | Rating (1-5) |
| `created_at` | TEXT | ISO timestamp |

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)
- Git (for cloning)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quiz-hub.git
   cd quiz-hub
   ```

2. **Run the setup script**
   ```bash
   python setup.py
   ```
   This will:
   - Install all required dependencies
   - Create necessary directories (`data/`, `data/uploads/`)
   - Initialize the SQLite database

3. **Start the server**
   ```bash
   python server.py
   ```

4. **Access the application**
   - Teacher Interface: http://localhost:5000/
   - Student Interface: http://localhost:5000/test/<TEST_ID>

### Optional: AI Integration Setup

#### Google Gemini (Recommended)
```bash
export PREFERRED_LLM=gemini
export GEMINI_API_KEY=your_gemini_api_key_here
export GEMINI_MODEL=gemini-1.5-flash
```

#### Hugging Face
```bash
export PREFERRED_LLM=huggingface
export HUGGINGFACE_API_KEY=your_hf_api_key_here
export HF_MODEL=google/flan-t5-large
```

**Note**: If no API keys are configured, the app uses a built-in heuristic generator that works offline.

---

## 📖 Usage Guide

### For Teachers

#### Creating a Quiz
1. **Access the application**
   - Go to http://localhost:5000/
   - You'll see the teacher interface

2. **Enter test details**
   - Provide a test title
   - Choose input method:
     - Upload file (.txt, .pdf, .docx, .pptx)
     - Paste a URL
     - Input text directly

3. **Configure settings**
   - Set total number of questions
   - Adjust difficulty distribution
   - Choose question type distribution

4. **Generate questions**
   - Click "Generate Questions"
   - Wait for AI processing
   - Review generated questions in preview

5. **Save and share**
   - Click "Save Test" to store
   - Use "Export Link" to get shareable URL
   - Share the link with students

#### Managing Tests
- All tests are stored in the SQLite database
- Access via the generated shareable links
- No separate admin interface (keeps it simple)

### For Students

#### Taking a Test
1. **Access the test**
   - Open the shared test link
   - Enter your name when prompted

2. **Answer questions**
   - Read each question carefully
   - Select your answers
   - Use the chatbot for help if needed

3. **Submit and review**
   - Click "Submit Answers"
   - View your score and accuracy
   - Review correct answers and explanations
   - Rate question quality

#### Using the Chatbot
- Click the chat icon (💬) in the bottom right
- Ask questions about the test material
- Get context-aware assistance

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `PREFERRED_LLM` | AI provider (gemini/huggingface) | heuristic |
| `GEMINI_API_KEY` | Google Gemini API key | None |
| `GEMINI_MODEL` | Gemini model name | gemini-1.5-flash |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | None |
| `HF_MODEL` | Hugging Face model | google/flan-t5-large |

### File Upload Settings
- **Allowed Extensions**: .txt, .pdf, .docx, .pptx
- **Max File Size**: No explicit limit (system dependent)
- **Storage Location**: `data/uploads/`

### Database Settings
- **Type**: SQLite
- **Location**: `data/quize.db`
- **Auto-initialization**: Yes (on first run)

---

## 🔧 Development

### Running in Development Mode
```bash
python server.py
```
The server runs on `http://localhost:5000` with debug mode enabled.

### Project Structure for Development
```
Quiz Hub/
├── server.py              # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.py              # Setup script
├── .gitignore            # Git ignore rules
├── README.md             # Project overview
├── DOCUMENTATION.md      # This documentation
└── quize/                # Frontend files
    ├── index.html        # Main application page
    ├── app.js            # JavaScript functionality
    ├── style.css         # Styling
    └── quize.html        # Redirect file
```

### Adding New Features
1. **Backend Changes**: Modify `server.py`
2. **Frontend Functionality**: Update `quize/app.js`
3. **Styling**: Edit `quize/style.css`
4. **Database Changes**: Modify the `init_db()` function in `server.py`

### Code Style Guidelines
- **Python**: Follow PEP 8 standards
- **JavaScript**: Use ES6+ features, camelCase naming
- **HTML**: Semantic HTML5, accessibility-friendly
- **CSS**: BEM methodology, responsive design

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error**: `Address already in use`
**Solution**: 
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
# Or use a different port
export PORT=5001
python server.py
```

#### 2. AI API Errors
**Error**: `Rate limit exceeded` or `API key invalid`
**Solution**:
- Check API key configuration
- Verify API quotas
- The app will fall back to heuristic generation

#### 3. File Upload Issues
**Error**: `File not allowed`
**Solution**:
- Ensure file extension is supported (.txt, .pdf, .docx, .pptx)
- Check file size limits
- Verify file isn't corrupted

#### 4. Database Errors
**Error**: `Database locked` or `Permission denied`
**Solution**:
```bash
# Check file permissions
ls -la data/quize.db
# Fix permissions if needed
chmod 644 data/quize.db
```

#### 5. Dependencies Issues
**Error**: `Module not found`
**Solution**:
```bash
# Reinstall dependencies
pip install -r requirements.txt
# Or run setup again
python setup.py
```

### Debug Mode
Enable debug mode for detailed error messages:
```python
# In server.py, line 641
app.run(host="0.0.0.0", port=APP_PORT, debug=True)
```

### Logs
- **Flask logs**: Printed to console in debug mode
- **Database**: SQLite database at `data/quize.db`
- **Uploads**: Stored in `data/uploads/`

---

## 📞 Support

### Getting Help
1. **Check this documentation** for common solutions
2. **Use the built-in chatbot** for context-aware assistance
3. **Review the README.md** for quick setup instructions
4. **Check GitHub Issues** for known problems

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Reporting Issues
When reporting issues, please include:
- Operating system and version
- Python version
- Error messages
- Steps to reproduce
- Expected vs actual behavior

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for educators and learners everywhere**

*Last updated: December 2024*
