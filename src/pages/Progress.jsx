import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import React from 'react';
const Progress = () => {
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

  if (!progressData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load progress data.</p>
      </div>
    );
  }

  const levelData = [
    {
      name: 'EASY',
      completed: progressData.levelStats.EASY.completed,
      total: progressData.levelStats.EASY.total,
      percentage: progressData.levelStats.EASY.total > 0 
        ? Math.round((progressData.levelStats.EASY.completed / progressData.levelStats.EASY.total) * 100) 
        : 0
    },
    {
      name: 'MEDIUM',
      completed: progressData.levelStats.MEDIUM.completed,
      total: progressData.levelStats.MEDIUM.total,
      percentage: progressData.levelStats.MEDIUM.total > 0 
        ? Math.round((progressData.levelStats.MEDIUM.completed / progressData.levelStats.MEDIUM.total) * 100) 
        : 0
    },
    {
      name: 'HARD',
      completed: progressData.levelStats.HARD.completed,
      total: progressData.levelStats.HARD.total,
      percentage: progressData.levelStats.HARD.total > 0 
        ? Math.round((progressData.levelStats.HARD.completed / progressData.levelStats.HARD.total) * 100) 
        : 0
    }
  ];

  const overallData = [
    { name: 'Completed', value: progressData.overall.completed, fill: '#10B981' },
    { name: 'Remaining', value: progressData.overall.total - progressData.overall.completed, fill: '#E5E7EB' }
  ];

  const COLORS = {
    EASY: '#10B981',
    MEDIUM: '#F59E0B', 
    HARD: '#EF4444'
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Progress Reports</h1>
        <p className="text-gray-600">Track your learning journey with detailed analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="flex items-center justify-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-blue-600">{progressData.overall.percentage}%</p>
            <p className="text-gray-600">
              {progressData.overall.completed} of {progressData.overall.total} topics completed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Level Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'completed' ? 'Completed' : name === 'total' ? 'Total' : name]}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="total" fill="#E5E7EB" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levelData.map((level) => (
          <div key={level.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                level.name === 'EASY' ? 'text-green-600' :
                level.name === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {level.name}
              </h3>
              <span className="text-2xl font-bold text-gray-900">
                {level.percentage}%
              </span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-3 mb-4`}>
              <div 
                className={`h-3 rounded-full ${
                  level.name === 'EASY' ? 'bg-green-500' :
                  level.name === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${level.percentage}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">
              {level.completed} of {level.total} completed
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Topic-wise Progress</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {progressData.topicProgress.map((topic) => (
              <div key={topic.name} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{topic.name}</h3>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-blue-600">
                      {topic.percentage}%
                    </span>
                    <p className="text-sm text-gray-600">
                      {topic.completed}/{topic.total}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;