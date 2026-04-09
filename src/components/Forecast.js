function Forecast({ data }) {
  return (
    <div className="forecast">
      <h3>📅 Previsão 7 dias</h3>

      <div className="forecast-grid">
        {data.map((day, i) => (
          <div key={i} className="forecast-card">
            <p>{day.date}</p>
            <p>🔥 {day.max}°C</p>
            <p>❄️ {day.min}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;