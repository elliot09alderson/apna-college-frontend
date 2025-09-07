import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import React from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/topics/progress');
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to continue your coding journey? Check out your progress below and dive into some topics!
        </p>
      </div>

      {progressData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {progressData.overall.percentage}%
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
                <p className="text-sm text-gray-600">
                  {progressData.overall.completed} of {progressData.overall.total} completed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Level Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">EASY</span>
                <span className="text-sm text-gray-600">
                  {progressData.levelStats.EASY.completed}/{progressData.levelStats.EASY.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-600">MEDIUM</span>
                <span className="text-sm text-gray-600">
                  {progressData.levelStats.MEDIUM.completed}/{progressData.levelStats.MEDIUM.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-600">HARD</span>
                <span className="text-sm text-gray-600">
                  {progressData.levelStats.HARD.completed}/{progressData.levelStats.HARD.total}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/topics"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Browse Topics
              </Link>
              <Link 
                to="/progress"
                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                View Progress Report
              </Link>
            </div>
          </div>
        </div>
      )}

      {progressData && progressData.topicProgress.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Progress</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.topicProgress.slice(0, 6).map((topic) => (
                <div key={topic.name} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{topic.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      {topic.completed}/{topic.total}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {topic.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${topic.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;