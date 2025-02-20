import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { error: null, city: null, temp: null, description: null, icon: null });
});

app.post("/weather", async (req, res) => {
    const city = req.body.city;

    if (!city) {
        return res.render("index.ejs", { error: "Please enter a city name!", city: null, temp: null, description: null, icon: null });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const weatherData = response.data;

        const timestamp = weatherData.dt * 1000; 
        const dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString("en-IN");
        const time = dateObj.toLocaleTimeString("en-IN", { 
            timeZone: "Asia/Kolkata", 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        }); 
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await axios.get(forecastUrl);
        const forecastData = forecastResponse.data;
        const hourlyForecast = forecastData.list.slice(0, 8).map(hour => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true }),
            temp: hour.main.temp,
            icon: hour.weather?.[0]?.icon || null 
        }));
        
        const day = dateObj.toLocaleDateString("en-IN", { 
            timeZone: "Asia/Kolkata", 
            weekday: "long" 
        });
        res.render("index.ejs", { 
            city: weatherData.name, 
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            date: date,
            time: time,
            day: day,
            hourlyForecast: hourlyForecast,
            error: null
            
        });

    } catch (error) {
        res.render("index.ejs", { error: "City not found!", city: null, temp: null, description: null, icon: null });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
