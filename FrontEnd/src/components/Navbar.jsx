import React from 'react';

export default function Navbar() {
  return (
    <div className="flex w-full justify-center items-center py-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-sm border-b border-gray-700">
      <div className="flex items-center gap-4 max-w-6xl w-full px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
            {/* Simple icon: brackets */}
            <span className="text-lg">{"{ }"}</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">CollabCode</h1>
            <p className="text-xs text-gray-400 -mt-1">Realtime Collaboration</p>
          </div>
        </div>

        <div className="ml-auto text-sm text-gray-400 hidden sm:flex gap-4">
          <span className="hover:text-gray-100 cursor-pointer">Docs</span>
          <span className="hover:text-gray-100 cursor-pointer">About</span>
          <span className="hover:text-gray-100 cursor-pointer">Contact</span>
        </div>
      </div>
    </div>
  );
}
