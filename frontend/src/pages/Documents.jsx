import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, uploadDocument, deleteDocument } from '../api/documents';
import { FiUpload, FiSearch, FiTrash2,  FiClock, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

useEffect(() => {
  loadDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm]);

  const loadDocuments = async () => {
    try {
      const response = await getDocuments(searchTerm);
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const validExtensions = ['.pdf', '.txt', '.md'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) || !validExtensions.includes(ext)) {
      toast.error('Only PDF, TXT, and Markdown files are allowed');
      return;
    }

    if (file.size > 10485760) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
await uploadDocument(file);      toast.success('Document uploaded successfully');
      await loadDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await deleteDocument(id);
      toast.success('Document deleted successfully');
      await loadDocuments();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      txt: '📝',
      md: '📋',
    };
    return icons[fileType] || '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage your documents</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <label className="btn-primary cursor-pointer flex items-center gap-2">
            <FiUpload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No documents yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload your first document to get started
          </p>
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <FiUpload className="h-4 w-4" />
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md"
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="card animate-fade-in hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="text-3xl mr-4">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {doc.fileName}
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{doc.fileType.toUpperCase()}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <FiClock className="mr-1 h-3 w-3" />
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    to={`/chat?document=${doc._id}`}
                    className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1"
                  >
                    Chat
                    <FiChevronRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc._id, doc.fileName)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;