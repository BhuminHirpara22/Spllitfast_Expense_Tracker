'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import io from 'socket.io-client';
import MessageList from '../../components/MessageList';
import ExpenseForm from '../../components/ExpenseForm';
import TransactionList from '../../components/TransactionList';
import ParticipantList from '../../components/ParticipantList';

export default function GroupPage() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [activeTab, setActiveTab] = useState('chat');
  const router = useRouter();
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUserName = localStorage.getItem('userName');
    const storedRoomName = localStorage.getItem('roomName');
    const action = localStorage.getItem('action');
    
    if (!storedUserName || !storedRoomName) {
      router.push('/');
      return;
    }
    
    setUserName(storedUserName);
    setRoomName(storedRoomName);
    
    // Connect to socket server
    const socketInstance = io('https://splitfast-expense-splitter.onrender.com');
    setSocket(socketInstance);
    
    socketInstance.on('connect', () => {
      setStatus('Connected');
      
      // Join or create group based on stored action
      if (action === 'create') {
        socketInstance.emit('createGroup', { roomName: storedRoomName, userName: storedUserName });
      } else {
        socketInstance.emit('joinGroup', { roomName: storedRoomName, userName: storedUserName });
      }
    });
    
    socketInstance.on('joinMessage', (message) => {
      setStatus(message);
    });
    
    socketInstance.on('joinError', (error) => {
      setStatus(error);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    });
    
    socketInstance.on('loadMessages', (loadedMessages) => {
      const parsedMessages = loadedMessages.map(msg => {
        try {
          return JSON.parse(msg);
        } catch {
          return { type: 'expense', text: msg, sender: 'System', timestamp: new Date().toISOString() };
        }
      });
      setMessages(parsedMessages);
    });
    
    socketInstance.on('message', (message) => {
      if (typeof message === 'string') {
        setMessages(prev => [...prev, { type: 'expense', text: message, sender: 'System', timestamp: new Date().toISOString() }]);
      } else {
        setMessages(prev => [...prev, message]);
      }
    });
    
    socketInstance.on('transactions', (newTransactions) => {
      setTransactions(newTransactions);
    });
    
    socketInstance.on('error', (error) => {
      setStatus(error);
    });
    
    return () => {
      socketInstance.disconnect();
    };
  }, [router]);

  useEffect(() => {
    // Extract participants from transactions
    if (transactions.length > 0) {
      const uniqueParticipants = new Set();
      
      transactions.forEach(transaction => {
        uniqueParticipants.add(transaction.from);
        uniqueParticipants.add(transaction.to);
      });
      
      setParticipants(Array.from(uniqueParticipants));
    }
  }, [transactions]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket) return;
    
    const newMessage = {
      type: 'chat',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('sendMessage', newMessage);
    setMessageText('');
  };

  const sendExpense = (expenseData) => {
    if (!socket) return;
    
    const newExpense = {
      ...expenseData,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('sendMessage', newExpense);
  };

  const leaveGroup = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('roomName');
    localStorage.removeItem('action');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Expense Share | {roomName}</title>
      </Head>
      
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Group: {roomName}</h1>
            <p className="text-sm opacity-80">Logged in as: {userName}</p>
          </div>
          <button 
            onClick={leaveGroup}
            className="bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50"
          >
            Leave Group
          </button>
        </div>
      </header>
      
      <div className="container mx-auto p-4 flex flex-col flex-grow">
        <div className="text-sm text-gray-500 mb-4">{status}</div>
        
        <div className="bg-white rounded-lg shadow-md flex flex-col flex-grow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'expenses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('expenses')}
              >
                Add Expense
              </button>
              <button
                className={`px-4 py-3 font-medium ${activeTab === 'transactions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
            </nav>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            {activeTab === 'chat' && (
              <>
                <MessageList messages={messages} currentUser={userName} />
                <div ref={messageEndRef} />
              </>
            )}
            
            {activeTab === 'expenses' && (
              <ExpenseForm onSubmit={sendExpense} />
            )}
            
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <ParticipantList participants={participants} currentUser={userName} />
                <TransactionList transactions={transactions} currentUser={userName} />
              </div>
            )}
          </div>
          
          {activeTab === 'chat' && (
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}