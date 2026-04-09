import { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Digite uma cidade");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast([]);

      // 1. Geocoding (cidade -> coordenadas)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Cidade não encontrada");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Clima atual + 7 dias
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      const data = await weatherRes.json();

      // clima atual
      setWeather({
        city: name,
        country,
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
      });

      // previsão 7 dias
      const forecastData = data.daily.time.map((date, i) => ({
        date,
        max: data.daily.temperature_2m_max[i],
        min: data.daily.temperature_2m_min[i],
      }));

      setForecast(forecastData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg">
      <div className="container">
        <h1>🌦️ Weather App</h1>

        <div className="search">
          <input
            type="text"
            placeholder="Digite a cidade..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
          />

          <button onClick={getWeather} disabled={loading}>
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {!weather && !loading && !error && (
          <p>Digite uma cidade para ver o clima 👆</p>
        )}

        {loading && <p>Carregando...</p>}

        {error && <p className="error">{error}</p>}

        {weather && <WeatherCard data={weather} />}

        {forecast.length > 0 && <Forecast data={forecast} />}
      </div>
    </div>
  );
}

export default App;