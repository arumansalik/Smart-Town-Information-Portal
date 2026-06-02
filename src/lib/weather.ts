// CURRENT WEATHER
export async function getWeather() {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Karaikudi,TN,IN&units=metric&appid=${process.env.WEATHER_API_KEY}`,
        { cache: "no-store" }
    );

    return res.json();
}

// 5-DAY FORECAST
export async function getForecast() {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Karaikudi,TN,IN&units=metric&appid=${process.env.WEATHER_API_KEY}`,
        { cache: "no-store" }
    );

    return res.json();
}