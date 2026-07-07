import React, { useState, useEffect } from 'react';
import { getHistory } from '../api/chat';
import { FiSearch, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const History = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadHistory();
  }, [pagination.page, searchTerm]);

  const loadHistory = async () => {
    try {
      const response = await getHistory(pagination.page, pagination.limit, searchTerm);
      setConversations(response.conversations);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        pages: response.pagination.pages,
      });
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load conversation history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    loadHistory();
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat History</h1>
          <p className="text-gray-600 dark:text-gray-400">View all your past conversations</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </form>
      </div>

      {conversations.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start asking questions in the Chat section
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className="card animate-fade-in hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMessageSquare className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {conv.documentId?.fileName || 'Unknown document'}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        • {new Date(conv.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Q: {conv.question}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      A: {conv.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;