import { useEffect, useState } from 'react';
import api from '../services/api';
import React from 'react';
const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get('/topics');
        setTopics(response.data);
        const initialExpanded = {};
        response.data.forEach(topic => {
          initialExpanded[topic._id] = topic.name === 'Algorithms';
        });
        setExpandedTopics(initialExpanded);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleSubTopic = async (subTopicId) => {
    try {
      const response = await api.patch(`/topics/subtopic/${subTopicId}/toggle`);
      
      setTopics(prevTopics => 
        prevTopics.map(topic => ({
          ...topic,
          subTopics: topic.subTopics.map(subTopic => 
            subTopic._id === subTopicId 
              ? { ...subTopic, completed: response.data.completed }
              : subTopic
          )
        }))
      );

      setTimeout(() => {
        fetchUpdatedTopics();
      }, 100);
    } catch (error) {
      console.error('Error toggling subtopic:', error);
    }
  };

  const fetchUpdatedTopics = async () => {
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching updated topics:', error);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded";
    switch (status) {
      case 'Completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'In Progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getLevelBadge = (level) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded";
    switch (level) {
      case 'EASY':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'MEDIUM':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'HARD':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Topics</h1>
        <p className="text-gray-600">Explore these exciting topics!</p>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="bg-cyan-500 text-white p-4 cursor-pointer hover:bg-cyan-600 transition-colors flex items-center justify-between"
              onClick={() => toggleTopic(topic._id)}
            >
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold">{topic.name}</h2>
                <span className={getStatusBadge(topic.status)}>
                  {topic.status}
                </span>
              </div>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedTopics[topic._id] ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expandedTopics[topic._id] && (
              <div className="bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sub Topics</h3>
                {topic.subTopics && topic.subTopics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LeetCode Link
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            YouTube Link
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Article Link
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topic.subTopics.map((subTopic) => (
                          <tr key={subTopic._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={subTopic.completed}
                                  onChange={() => toggleSubTopic(subTopic._id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                                />
                                <span className={`text-sm font-medium ${subTopic.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {subTopic.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <a 
                                href={subTopic.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Practice
                              </a>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <a 
                                href={subTopic.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Watch
                              </a>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <a 
                                href={subTopic.articleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Read
                              </a>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={getLevelBadge(subTopic.level)}>
                                {subTopic.level}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                subTopic.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subTopic.completed ? 'Done' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No subtopics available for this topic.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;