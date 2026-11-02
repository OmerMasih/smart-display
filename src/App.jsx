import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  // Announcement state
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "IT SUPPORT",
      message: "For technical assistance, please contact the IT Support Team.",
      category: "IT Support",
    },
    {
      id: 2,
      title: "IMPORTANT NOTICE",
      message:
        "Please wear your identification badge while inside the building.",
      category: "Important",
    },
  ]);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Weather API
  useEffect(() => {
    let isMounted = true;

    async function getWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=38.5816&longitude=-121.4944&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles",
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          setWeather(data);
          setWeatherError(false);
        }
      } catch (error) {
        console.error("Weather error:", error);

        if (isMounted) {
          setWeatherError(true);
        }
      }
    }

    getWeather();

    const weatherTimer = setInterval(getWeather, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(weatherTimer);
    };
  }, []);

  // Weather descriptions
  function getWeatherDescription(code) {
    if (code === 0) return "Clear Sky";
    if ([1, 2].includes(code)) return "Partly Cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
    if ([71, 73, 75, 77].includes(code)) return "Snow";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([85, 86].includes(code)) return "Snow Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Conditions Unavailable";
  }

  // Weather icons
  function getWeatherIcon(code, isDay) {
    if ([95, 96, 99].includes(code)) return "⛈️";

    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      return "🌧️";
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([45, 48].includes(code)) return "🌫️";
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2, 3].includes(code)) return "🌤️";

    return "🌡️";
  }

  // Add announcement
  function handleAddAnnouncement(event) {
    event.preventDefault();

    if (!newTitle.trim() || !newMessage.trim()) {
      return;
    }

    const announcement = {
      id: Date.now(),
      title: newTitle.trim(),
      message: newMessage.trim(),
      category: newCategory,
    };

    setAnnouncements((previous) => [...previous, announcement]);

    setNewTitle("");
    setNewMessage("");
    setNewCategory("General");
  }

  // Delete announcement
  function handleDeleteAnnouncement(id) {
    setAnnouncements((previous) => previous.filter((item) => item.id !== id));
  }

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <main className="display">
      {/* CORPORATE HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">SD</div>

          <div>
            <h1>SMART DISPLAY</h1>
            <p>Corporate Information Center</p>
          </div>
        </div>

        <div className="header-info">
          <div className="clock">{formattedTime}</div>
          <div className="date">{formattedDate}</div>

          <div className="system-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </header>

      {/* ANNOUNCEMENT MANAGER */}
      <section className="manager">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CONTENT MANAGEMENT</span>
            <h2>Manage Announcements</h2>
            <p>Add and manage messages displayed on your screen.</p>
          </div>

          <div className="announcement-count">
            {announcements.length} Active
          </div>
        </div>

        <form className="announcement-form" onSubmit={handleAddAnnouncement}>
          <div className="form-field">
            <label htmlFor="title">Announcement Title</label>

            <input
              id="title"
              type="text"
              placeholder="Enter a title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>

            <input
              id="message"
              type="text"
              placeholder="Enter announcement message"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="category">Category</label>

            <select
              id="category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
            >
              <option value="General">General</option>
              <option value="IT Support">IT Support</option>
              <option value="Important">Important</option>
              <option value="Safety">Safety</option>
            </select>
          </div>

          <button className="add-button" type="submit">
            + Add Announcement
          </button>
        </form>
      </section>

      {/* ANNOUNCEMENT DISPLAY */}
      <section className="announcements">
        {announcements.map((announcement) => {
          const isSafety =
            announcement.category === "Important" ||
            announcement.category === "Safety";

          return (
            <article
              className={`announcement ${
                isSafety ? "safety-card" : "information-card"
              }`}
              key={announcement.id}
            >
              {isSafety ? (
                <div className="safety-visual">
                  <div className="safety-backdrop" aria-hidden="true" />

                  <img
                    src="/safety-notice.gif"
                    alt="Safety starts with you. Please wear your employee identification badge."
                    className="safety-gif"
                  />
                </div>
              ) : (
                <div className="announcement-content">
                  <span className="announcement-label">
                    {announcement.category}
                  </span>

                  <h2>{announcement.title}</h2>

                  <p>{announcement.message}</p>

                  <div className="announcement-footer">
                    <span>Company Information</span>
                    <span>● Official Notice</span>
                  </div>
                </div>
              )}

              <button
                className="delete-button"
                type="button"
                onClick={() => handleDeleteAnnouncement(announcement.id)}
                aria-label={`Delete ${announcement.title}`}
              >
                Delete
              </button>
            </article>
          );
        })}
      </section>

      {/* WEATHER PANEL */}
      <section className="weather-card">
        <div className="weather-left">
          <span className="eyebrow">LOCAL WEATHER</span>

          <h2>Sacramento, California</h2>

          {weatherError && (
            <p className="weather-error">Weather temporarily unavailable.</p>
          )}

          {!weather && !weatherError && <p>Loading weather information...</p>}

          {weather && (
            <>
              <p className="weather-description">
                {getWeatherDescription(weather.current.weather_code)}
              </p>

              <div className="temperature">
                {Math.round(weather.current.temperature_2m)}
                <span>°F</span>
              </div>

              <p className="feels-like">
                Feels like {Math.round(weather.current.apparent_temperature)}°F
              </p>

              <div className="weather-extra">
                <div>
                  <span>↑</span>
                  High {Math.round(weather.daily.temperature_2m_max[0])}°F
                </div>

                <div>
                  <span>↓</span>
                  Low {Math.round(weather.daily.temperature_2m_min[0])}°F
                </div>

                <div>💧 {weather.current.relative_humidity_2m}%</div>

                <div>💨 {Math.round(weather.current.wind_speed_10m)} mph</div>
              </div>

              <p className="weather-credit">
                Weather data provided by Open-Meteo
              </p>
            </>
          )}
        </div>

        {weather && (
          <div className="weather-visual">
            <span className="weather-icon">
              {getWeatherIcon(
                weather.current.weather_code,
                weather.current.is_day,
              )}
            </span>
          </div>
        )}
      </section>

      {/* NEWS TICKER */}
      <footer className="ticker">
        <div className="ticker-label">LIVE UPDATES</div>

        <div className="ticker-window">
          <div className="ticker-track">
            <span>
              Welcome to our information center. Please wear your identification
              badge at all times. Safety starts with you. Stay informed and stay
              safe.
            </span>

            <span aria-hidden="true">
              Welcome to our information center. Please wear your identification
              badge at all times. Safety starts with you. Stay informed and stay
              safe.
            </span>
          </div>
        </div>
      </footer>

      <div className="bottom-note">
        SMART DISPLAY SYSTEM
        <span>•</span>
        INFORMATION AND SAFETY
      </div>
    </main>
  );
}

export default App;
