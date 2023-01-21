const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
const fetch = require('node-fetch');
const { send } = require('process');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser, urlencoded({extended:true}));
require('dotenv').config();

app.use(express.static("public"));
app.use(express.static( "views" ) );

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const sendData = {location: "location", temp: "Temp", desc: "description", feel:"feel-like", humidity: "Humidity", speed: "speed"}

    res.render("index", {sendData: sendData});

});

app.post('/', async (req, res)=> {
    let location = await req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${process.env.APIKEY}&unit=metric`;
    const respose = await fetch(url);
    const weatherdata = await respose.json();
    const temp = weatherdata.main.temp;
    const desc = weatherdata.weather[0].description;
    const sendData = {};
    sendData.temp = temp;
    sendData.desc = desc;
    sendData.location = location;
    sendData.feel = weatherdata.main.feels_like;
    sendData.humidity = weatherdata.main.humidity;
    sendData.speed = weatherdata.wind.speed;
    res.render('index', {sendData: sendData});

})

app.listen(5000, () => {
    console.log('Server running on port 5000');
});


