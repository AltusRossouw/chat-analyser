import React, { useState, useCallback } from 'react';
import { WhatsAppChatParser } from './utils/chatParser';
import { ParsedChat } from './types/chat';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const [chatData, setChatData] = useState<ParsedChat | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const content = await file.text();
      const parsed = WhatsAppChatParser.parseChatFile(content);
      setChatData(parsed);
    } catch (err) {
      setError('Failed to parse chat file. Please make sure it\'s a valid WhatsApp export.');
      console.error('Error parsing chat file:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setChatData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {!chatData ? (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              WhatsApp Chat Analyzer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your WhatsApp chat export to get detailed insights, statistics, and visualizations of your conversations.
            </p>
          </div>
          
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          
          {error && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Export Your WhatsApp Chat</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>Open WhatsApp on your phone</li>
                <li>Go to the chat you want to analyze</li>
                <li>Tap the three dots menu (⋮) in the top right</li>
                <li>Select "More" → "Export chat"</li>
                <li>Choose "Without Media" or "Include Media"</li>
                <li>Send the file to yourself via email or save to cloud storage</li>
                <li>Download the _chat.txt file to your computer</li>
                <li>Upload it here to start analyzing!</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Chat Analysis</h1>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Upload New Chat
                </button>
              </div>
            </div>
          </div>
          <Dashboard chatData={chatData} />
        </div>
      )}
    </div>
  );
}

export default App;
