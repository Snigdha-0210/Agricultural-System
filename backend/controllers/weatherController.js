// OpenWeatherMap Live API integration
exports.getWeather = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let url = '';
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      const q = encodeURIComponent(city || 'Nashik,IN');
      url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API returned status ${response.status}`);
    }

    const data = await response.json();
    const result = {
      location: `${data.name}, ${data.sys?.country || 'IN'}`,
      current: {
        temp: Math.round(data.main.temp),
        condition: data.weather[0]?.main || 'Clear',
        description: data.weather[0]?.description || '',
        icon: data.weather[0]?.icon,
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind?.speed * 3.6), // m/s to km/h
        feels_like: Math.round(data.main.feels_like)
      },
      raw: data
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching OpenWeatherMap data', error: error.message });
  }
};