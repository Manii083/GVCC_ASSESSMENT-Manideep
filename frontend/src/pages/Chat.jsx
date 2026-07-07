import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDocuments } from '../api/documents';
import { askQuestion } from '../api/chat';
import { FiSend, FiFile, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadDocuments();
    
    const docId = searchParams.get('document');
    if (docId) {
      setSelectedDocument(docId);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDocument) {
      toast.error('Please select a document first');
      return;
    }

    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setSending(true);

    try {
      const response = await askQuestion({
        documentId: selectedDocument,
        question: question.trim(),
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.conversation.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setSending(false);
    }
  };

  const selectedDoc = documents.find(d => d._id === selectedDocument);

  if (loading) {
    return <Loader />;
  }

  if (documents.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No documents available
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload a document first to start asking questions
        </p>
        <a href="/documents" className="btn-primary inline-flex items-center gap-2">
          Go to Documents
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FiFile className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedDoc ? selectedDoc.fileName : 'Select a document'}
              </span>
              <FiChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => {
                      setSelectedDocument(doc._id);
                      setShowDropdown(false);
                      setMessages([]);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      selectedDocument === doc._id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
                    }`}
                  >
                    {doc.fileName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {selectedDoc && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedDoc.fileName} • {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Select a document and ask a question to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={selectedDoc ? "Ask a question about this document..." : "Please select a document first"}
          disabled={!selectedDoc || sending}
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={!selectedDoc || sending || !question.trim()}
          className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend className="h-4 w-4" />
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;