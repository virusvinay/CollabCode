import React from 'react';
import Avatar from 'react-avatar';

function Client({username ,Location}) {

  return (
    <div className="d-flex align-items-center mb-3">
      <Avatar name={username?.toString()} size={50} round="14px" className="mr-3" />
      <span className='mx-2'>
         {
            Location.state?.username == username ? <span>{username.toString()} (You)</span> : <span>{ username.toString()}</span>
          }
      </span>
    </div>
  );
}

export default Client;
