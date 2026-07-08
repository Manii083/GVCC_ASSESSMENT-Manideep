import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/dashboard';
import { FiFile, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your knowledge base
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Documents
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalDocuments || 0}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FiFile className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="mt-4">
            <Link
              to="/documents"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all documents
              <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div
          className="card animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Questions
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalQuestions || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FiMessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="mt-4">
            <Link
              to="/history"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View history
              <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      {stats?.recentUploads?.length > 0 && (
        <div
          className="card animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Uploads
          </h2>

          <div className="space-y-3">
            {stats.recentUploads.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center min-w-0">
                  <FiFile className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.fileName}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(doc.uploadedAt).toLocaleDateString()} •{' '}
                      {doc.fileType.toUpperCase()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/chat?document=${doc._id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Ask questions
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent conversations */}
      {stats?.recentConversations?.length > 0 && (
        <div
          className="card animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Conversations
          </h2>

          <div className="space-y-3">
            {stats.recentConversations.map((conv, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conv.question}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {conv.answer}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {conv.documentId?.fileName || 'Document'} •{' '}
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;