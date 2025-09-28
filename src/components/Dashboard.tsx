import React, { useState } from 'react';
import { ParsedChat } from '../types/chat';
import { MessageSquare, Image, Calendar, Clock, Users, TrendingUp, Download, Filter, BarChart3, PieChart, Activity } from 'lucide-react';

interface DashboardProps {
  chatData: ParsedChat | null;
}


export const Dashboard: React.FC<DashboardProps> = ({ chatData }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!chatData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No chat data loaded</div>
      </div>
    );
  }

  const { stats, messages } = chatData;

  // Filter messages based on selected criteria
  const filteredMessages = messages.filter(msg => {
    if (selectedParticipant !== 'all' && msg.sender !== selectedParticipant) return false;
    if (dateRange.start && new Date(msg.timestamp) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(msg.timestamp) > new Date(dateRange.end)) return false;
    return true;
  });

  // Recalculate stats for filtered data
  const filteredStats = {
    ...stats,
    totalMessages: filteredMessages.length,
    messagesByParticipant: filteredMessages.reduce((acc, msg) => {
      acc[msg.sender] = (acc[msg.sender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Prepare data for charts
  const participantData = Object.entries(filteredStats.messagesByParticipant).map(([name, count]) => ({
    name,
    messages: count
  }));

  const hourlyData = Object.entries(stats.messagesByHour).map(([hour, count]) => ({
    hour: `${hour}:00`,
    messages: count
  }));

  const dailyData = Object.entries(stats.messagesByDay).map(([day, count]) => ({
    day,
    messages: count
  }));

  const mediaData = [
    { name: 'Images', value: stats.totalImages, color: '#0088FE' },
    { name: 'Videos', value: stats.totalVideos, color: '#00C49F' },
    { name: 'Audio', value: stats.totalAudio, color: '#FFBB28' },
    { name: 'Stickers', value: stats.totalStickers, color: '#FF8042' },
    { name: 'GIFs', value: stats.totalGifs, color: '#8884D8' }
  ].filter(item => item.value > 0);

  const topWords = Object.entries(stats.wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const topEmojis = Object.entries(stats.emojiCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([emoji, count]) => ({ emoji, count }));

  // Additional chart data
  const monthlyData = Object.entries(stats.messagesByMonth)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, count]) => ({ month, count }));

  const messageLengthData = filteredMessages
    .filter(msg => msg.type === 'text')
    .map(msg => msg.content.length)
    .reduce((acc, length) => {
      const range = Math.floor(length / 50) * 50;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

  const messageLengthRanges = Object.entries(messageLengthData)
    .map(([range, count]) => ({
      range: `${range}-${parseInt(range) + 49} chars`,
      count
    }))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range));

  // Activity heatmap data (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const activityHeatmap = last30Days.map(date => {
    const dayMessages = filteredMessages.filter(msg => 
      msg.timestamp.toISOString().split('T')[0] === date
    ).length;
    return { date, messages: dayMessages };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Chat Analyzer</h1>
        <p className="text-gray-600">
          Analysis from {stats.dateRange.start.toLocaleDateString()} to {stats.dateRange.end.toLocaleDateString()}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Participant</label>
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Participants</option>
              {stats.participants.map(participant => (
                <option key={participant} value={participant}>{participant}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredStats.totalMessages} messages
            {selectedParticipant !== 'all' && ` from ${selectedParticipant}`}
          </div>
          <button
            onClick={() => {
              setSelectedParticipant('all');
              setDateRange({ start: '', end: '' });
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Media Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedia.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.participants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg/Day</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageMessagesPerDay)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Participant */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Messages by Participant
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          <div className="space-y-3">
            {participantData.map((participant, index) => {
              const maxMessages = Math.max(...participantData.map(p => p.messages));
              const percentage = (participant.messages / maxMessages) * 100;
              const isHovered = hoveredItem === participant.name;
              return (
                <div 
                  key={participant.name} 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredItem(participant.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setSelectedParticipant(participant.name)}
                >
                  <div className="w-20 text-sm font-medium">{participant.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className={`h-4 rounded-full transition-all duration-500 ${
                        isHovered ? 'bg-blue-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {isHovered && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          {participant.messages} messages ({percentage.toFixed(1)}%)
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right font-medium">
                    {participant.messages.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Media Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Media Distribution</h3>
          <div className="space-y-3">
            {mediaData.map((media, index) => {
              const totalMedia = mediaData.reduce((sum, m) => sum + m.value, 0);
              const percentage = (media.value / totalMedia) * 100;
              return (
                <div key={media.name} className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-medium">{media.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="h-4 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: media.color
                      }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{media.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Hour */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Messages by Hour of Day</h3>
          <div className="grid grid-cols-6 gap-1 h-64 items-end">
            {hourlyData.map((hour, index) => {
              const maxMessages = Math.max(...hourlyData.map(h => h.messages));
              const height = (hour.messages / maxMessages) * 100;
              return (
                <div key={hour.hour} className="flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`${hour.hour}: ${hour.messages} messages`}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-left">
                    {hour.hour.split(':')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages by Day of Week */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Messages by Day of Week</h3>
          <div className="space-y-3">
            {dailyData.map((day, index) => {
              const maxMessages = Math.max(...dailyData.map(d => d.messages));
              const percentage = (day.messages / maxMessages) * 100;
              return (
                <div key={day.day} className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-medium">{day.day}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{day.messages}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Monthly Activity Trend
            </h3>
          </div>
          <div className="space-y-2">
            {monthlyData.map((month, index) => {
              const maxCount = Math.max(...monthlyData.map(m => m.count));
              const percentage = (month.count / maxCount) * 100;
              return (
                <div key={month.month} className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{month.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Length Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Message Length Distribution
            </h3>
          </div>
          <div className="space-y-2">
            {messageLengthRanges.map((range, index) => {
              const maxCount = Math.max(...messageLengthRanges.map(r => r.count));
              const percentage = (range.count / maxCount) * 100;
              return (
                <div key={range.range} className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium">{range.range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{range.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            Activity Heatmap (Last 30 Days)
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {activityHeatmap.map((day, index) => {
            const maxMessages = Math.max(...activityHeatmap.map(d => d.messages));
            const intensity = maxMessages > 0 ? (day.messages / maxMessages) : 0;
            const colorIntensity = Math.floor(intensity * 4);
            const colors = ['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'];
            const color = colors[colorIntensity] || 'bg-gray-100';
            
            return (
              <div 
                key={day.date} 
                className={`${color} h-8 rounded text-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all`}
                title={`${day.date}: ${day.messages} messages`}
              >
                {day.messages > 0 && (
                  <span className="text-white font-medium">{day.messages}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Less active</span>
          <div className="flex space-x-1">
            {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'].map((color, index) => (
              <div key={index} className={`w-3 h-3 rounded ${color}`}></div>
            ))}
          </div>
          <span>More active</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Words */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Most Used Words</h3>
          <div className="space-y-2">
            {topWords.map(({ word, count }, index) => (
              <div key={word} className="flex justify-between items-center">
                <span className="text-sm font-medium">{index + 1}. {word}</span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Emojis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Most Used Emojis</h3>
          <div className="space-y-2">
            {topEmojis.map(({ emoji, count }, index) => (
              <div key={emoji} className="flex justify-between items-center">
                <span className="text-lg">{index + 1}. {emoji}</span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Insights */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Activity Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Most Active Hour</p>
                <p className="text-lg font-bold">{stats.mostActiveHour}:00</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Most Active Day</p>
                <p className="text-lg font-bold">{stats.mostActiveDay}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium">Longest Streak</p>
                <p className="text-lg font-bold">{stats.longestStreak} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
