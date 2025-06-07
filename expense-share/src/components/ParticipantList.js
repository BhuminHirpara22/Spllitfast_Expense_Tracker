// components/ParticipantList.js
export default function ParticipantList({ participants, currentUser }) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Group Members</h2>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant, index) => (
            <div 
              key={index} 
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                participant === currentUser 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {participant === currentUser ? `${participant} (You)` : participant}
            </div>
          ))}
        </div>
      </div>
    );
  }