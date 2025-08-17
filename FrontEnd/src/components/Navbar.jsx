// import React from 'react'

// export default function Navbar() {
//   return (
//     <div className="flex w-full justify-center items-center py-6">
//   <div className="mt-3 mb-3">
//     <img
//       src="/codeCollabLogo.png"
//       alt="Logo"
//       className="w-auto h-auto max-w-[300px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px]"
//     />
//   </div>
// </div>

//   )
// }


import React from 'react';

export default function Navbar() {
  return (
    <div className="flex w-full justify-center items-center py-6 bg-gray-900 shadow-md">
      <div className="mt-3 mb-3">
        <img
          src="/codeCollabLogo.png"
          alt="Logo"
          className="w-auto h-auto  sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px] transition-transform transform hover:scale-105"
        />
      </div>
    </div>
  );
}

