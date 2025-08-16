# 🎓 Quiz Hub - AI-Powered Quiz Generator

A modern, intelligent web application that automatically generates quizzes from various content sources. Perfect for teachers, educators, and anyone who needs to create assessments quickly and efficiently.

![Quiz Hub](https://img.shields.io/badge/Status-Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.7+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0+-lightgrey)

## ✨ Features

### 🎯 **Smart Quiz Generation**
- **Multiple Input Sources**: Upload files (PDF, DOCX, PPTX, TXT), paste URLs, or input text directly
- **AI-Powered Questions**: Uses Google Gemini or Hugging Face AI to generate intelligent questions
- **Fallback System**: Built-in heuristic generator ensures questions are always created
- **Customizable Settings**: Control question count, difficulty levels, and question types

### 📝 **Question Types Supported**
- **Multiple Choice Questions (MCQ)**
- **True/False Questions**
- **Multiple Correct Answers**
- **Fill in the Blank**

### 🎨 **User Experience**
- **Modern UI**: Clean, responsive design with dark/light theme toggle
- **Real-time Preview**: See generated questions before saving
- **Shareable Links**: Easy test distribution to students
- **Auto-grading**: Instant results with detailed feedback
- **Question Ratings**: Students can rate question quality (1-5 stars)

### 🤖 **AI Assistant**
- **Built-in Chatbot**: Get help and ask questions about the content
- **Context-Aware**: Understands the test material for better assistance

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

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
   - Set up the database

3. **Start the server**
   ```bash
   python server.py
   ```

4. **Open the application**
   - Teacher Interface: http://localhost:5000/
   - Student Interface: http://localhost:5000/test/<TEST_ID>

## ⚙️ Configuration

### Optional: AI Integration

For enhanced question generation, you can configure AI providers:

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

## 📖 How to Use

### For Teachers

1. **Create a Quiz**
   - Go to http://localhost:5000/
   - Enter a test title
   - Upload a file, paste a URL, or input text
   - Configure question settings (count, difficulty, types)
   - Click "Generate Questions"

2. **Review and Save**
   - Preview generated questions
   - Click "Save Test" to store
   - Use "Export Link" to get a shareable URL

3. **Share with Students**
   - Copy the generated link
   - Share with your students
   - Students can take the test at the provided URL

### For Students

1. **Take a Test**
   - Open the shared test link
   - Enter your name
   - Answer all questions
   - Click "Submit Answers"

2. **View Results**
   - See your score and accuracy
   - Review correct answers and explanations
   - Rate question quality
   - Use the chatbot for help

## 🛠️ Technical Details

### Architecture
- **Backend**: Python Flask with SQLite database
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **File Processing**: PyPDF2, python-docx, python-pptx
- **AI Integration**: Google Gemini API, Hugging Face Inference API

### File Structure
```
Quiz Hub/
├── server.py              # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.py              # Setup script
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── quize/                # Frontend files
    ├── index.html        # Main application page
    ├── app.js            # JavaScript functionality
    ├── style.css         # Styling
    └── quize.html        # Redirect file
```

### Database Schema
- **tests**: Stores quiz metadata and questions
- **submissions**: Records student answers and scores
- **ratings**: Stores question quality ratings

## 🔧 Development

### Running in Development Mode
```bash
python server.py
```
The server runs on `http://localhost:5000` with debug mode enabled.

### Adding New Features
1. Modify `server.py` for backend changes
2. Update `quize/app.js` for frontend functionality
3. Style changes go in `quize/style.css`

## 📁 Data Management

### What's Stored
- **Database**: `data/quize.db` (SQLite)
- **Uploads**: `data/uploads/` (User-uploaded files)

### Backup
The `data/` folder is excluded from Git for privacy. To backup:
```bash
# Backup database
cp data/quize.db backup_quize.db

# Backup uploads
cp -r data/uploads/ backup_uploads/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Flask and modern web technologies
- AI integration powered by Google Gemini and Hugging Face
- Icons and emojis for enhanced user experience




**Made with ❤️ os shikhar for educators and learners everywhere** 
