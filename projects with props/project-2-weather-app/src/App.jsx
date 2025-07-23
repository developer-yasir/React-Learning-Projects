import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";

const API_KEY = "0d3794fb2951d78e62edab24cb3997d5"; // apna OpenWeatherMap API key daalo
const cities = ["Lahore", "Karachi", "Islamabad", "Multan"];

function App() {
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        const cityWeather = {
          city: data.name,
          temperature: data.main.temp,
          status: data.weather[0].main,
        };

        setWeather(cityWeather);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setWeather(null);
      }
    }

    fetchWeather();
  }, [selectedCity]);

  return (
      <div className="container">
        <h1>Weather App</h1>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>

        {weather ? (
          <WeatherCard
            city={weather.city}
            temperature={weather.temperature}
            status={weather.status}
          />
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
  );
}

export default App;
