import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=38.5816&longitude=-121.4944&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles"
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = await response.json();
        setWeather(data);
        setWeatherError(false);
      } catch (error) {
        console.error("Could not load weather:", error);
        setWeatherError(true);
      }
    }

    getWeather();

    const intervalId = setInterval(getWeather, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  function getWeatherDescription(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain showers";
    if ([85, 86].includes(code)) return "Snow showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Conditions unavailable";
  }

  function getWeatherIcon(code, isDay) {
    if ([95, 96, 99].includes(code)) return "⛈️";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
      return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([45, 48].includes(code)) return "🌫️";
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2, 3].includes(code)) return "🌤️";
    return "🌡️";
  }

  return (
    <main className="display">
      <header className="header">
        <div>
          <h1>SMART DISPLAY</h1>
          <p>Company Information Center</p>
        </div>

        <div className="header-right">
          <div className="clock">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>

          <div className="date">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="status">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </header>

      <section className="announcements">
        <article className="announcement announcement-blue">
          <h2>IT SUPPORT</h2>
          <p>For technical assistance, please contact the IT Support Team.</p>
          <span>Support • Service • Solutions</span>
        </article>

        <article className="announcement announcement-orange">
          <h2>IMPORTANT NOTICE</h2>
          <p>
            Please wear your identification badge while inside the building.
          </p>
          <span>Safety starts with you.</span>
        </article>
      </section>

      <section className="weather-card">
        <div>
          <p className="weather-location">SACRAMENTO, CALIFORNIA</p>
          <h2>Current Weather</h2>

          {weatherError && <p>Weather is temporarily unavailable.</p>}

          {!weather && !weatherError && <p>Loading weather...</p>}

          {weather && (
            <>
              <p className="weather-description">
                {getWeatherDescription(weather.current.weather_code)}
              </p>
              <p className="weather-temperature">
                {Math.round(weather.current.temperature_2m)}°F
                <span>
                  {" "}
                  Feels like {Math.round(weather.current.apparent_temperature)}
                  °F
                </span>
              </p>
              <p>
                High: {Math.round(weather.daily.temperature_2m_max[0])}°F
                {"  "} Low: {Math.round(weather.daily.temperature_2m_min[0])}°F
              </p>
              <p>
                💧 Humidity: {weather.current.relative_humidity_2m}%{"  "} 💨
                Wind: {Math.round(weather.current.wind_speed_10m)} mph
              </p>
              <p className="weather-credit">Weather data by Open-Meteo.com</p>
            </>
          )}
        </div>

        {weather && (
          <div className="weather-icon" aria-hidden="true">
            {getWeatherIcon(
              weather.current.weather_code,
              weather.current.is_day
            )}
          </div>
        )}
      </section>

      <footer className="ticker">
        <strong>ANNOUNCEMENT</strong>
        <p>
          Welcome! Please check this screen regularly for important company
          updates.
        </p>
      </footer>
    </main>
  );
}

export default App;
