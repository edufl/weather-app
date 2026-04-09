function WeatherCard({ data }) {
  return (
    <div className="card">
      <h2>
        {data.city}, {data.country}
      </h2>

      <p>🌡️ Temperatura: {data.temperature}°C</p>
      <p>🌬️ Vento: {data.windspeed} km/h</p>
      <p>🧭 Direção: {data.winddirection}°</p>
    </div>
  );
}

export default WeatherCard;