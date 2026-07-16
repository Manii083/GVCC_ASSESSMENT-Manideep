# AI-Powered Knowledge Base Assistant

A full-stack web application that allows users to upload documents and ask AI-powered questions about their content. The system uses the Gemini API to provide accurate, document-based responses.

## Features

- **User Authentication**: Secure signup and login with JWT
- **Document Management**: Upload PDF, TXT, and Markdown files
- **AI-Powered Q&A**: Ask questions about uploaded documents
- **Conversation History**: View and search past conversations
- **Dashboard**: Overview of documents and conversations
- **Search**: Search through documents and conversation history
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- pdf-parse for PDF processing

### AI Integration
- Gemini API for intelligent document Q&A

## Architecture

The application follows a RESTful API architecture with a clean separation of concerns:

- **Frontend**: React SPA with component-based architecture
- **Backend**: Express.js REST API with MVC pattern
- **Database**: MongoDB for data persistence
- **Authentication**: JWT-based authentication with bcrypt

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gemini API Key

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/...
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=abcd....
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
