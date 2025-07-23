import React from "react";
import './App.css'
function WeatherCard({ city, temperature, status }) {
  return (
    <div className="weather-card">
    <h2>{city}</h2>
    <p>Temperature: {temperature}°C</p>
    <p>Status: {status}</p>
    </div>

  );
}

export default WeatherCard;
