import React from 'react';

const Home = ({ isAdmin }) => {
  return (
    <div className="container">
      <h2>Welcome to MyBookStore!</h2>
      {isAdmin ? (
        <p>This is the home page for admin.</p>
      ) : (
        <p>This is the home page for logged-in user.</p>
      )}
    </div>
  );
};

export default Home;
