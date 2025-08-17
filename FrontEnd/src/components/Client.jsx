import React from 'react';
import Avatar from 'react-avatar';

function Client({ username, Location }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Avatar */}
      <Avatar 
        name={username?.toString()} 
        size={45} 
        round="14px" 
        className="border-2 border-green-400" 
      />

      {/* Username */}
      <span className="text-gray-200 font-medium">
        {Location.state?.username === username 
          ? <span>{username.toString()} <span className="text-green-400 font-semibold">(You)</span></span> 
          : <span>{username.toString()}</span>
        }
      </span>
    </div>
  );
}

export default Client;
