import React from 'react';
import './App.css'
function WelcomeCard({ name, age, city, image }) {
  return (
    <div className="card">
      <img src={image} alt={name} className="profile-img" />
      <h2>{name}</h2>
      <p>City: {city}</p>
      <p>Age: {age} years</p>
    </div>
  );
}

export default WelcomeCard;
