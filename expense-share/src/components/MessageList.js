
'use client';
// components/MessageList.js
export default function MessageList({ messages, currentUser }) {
    if (!messages.length) {
      return <div className="text-center text-gray-500 py-8">No messages yet</div>;
    }
  
    return (
      <div className="space-y-3">
        {messages.map((message, index) => {
          // For string messages (expense notifications)
          if (!message.type || message.type === 'expense') {
            return (
              <div key={index} className="bg-gray-100 p-3 rounded-md">
                <p className="text-gray-700">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
            );
          }
          
          // For chat messages
          const isCurrentUser = message.sender === currentUser;
          
          return (
            <div 
              key={index} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  isCurrentUser 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {!isCurrentUser && (
                  <p className="font-medium text-xs mb-1">{message.sender}</p>
                )}
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
