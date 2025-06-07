'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Note the change from next/router
import Head from 'next/head';

export default function Home() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinGroup = (action) => {
    if (!roomName || !userName) {
      setError('Please enter both group name and your name');
      return;
    }

    // Store user info in localStorage for persistence
    localStorage.setItem('userName', userName);
    localStorage.setItem('roomName', roomName);
    localStorage.setItem('action', action);
    
    router.push('/group');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <Head>
        <title>Expense Share | Welcome</title>
        <meta name="description" content="Split expenses with your friends easily" />
      </Head>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Expense Share</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter group name"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleJoinGroup('create')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Group
            </button>
            <button
              onClick={() => handleJoinGroup('join')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Join Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
