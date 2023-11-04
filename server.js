const fs = require('fs');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Define a route to handle GET requests at the root URL
app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/ping', (req, res) => {
    res.send('pong');
  });
app.use(express.static('public'));

const getAlerts = async () => {
    try {
        const response = await axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json');
        const data = response.data;
        const citiesData = loadLocalFile('./public/cities.json');
        const citiesDictData = loadLocalFile('./public/citiesDict.json');
        const citiesCoordinates = loadLocalFile('./public/citiesCoordinatesReversed.json');
        const mergedData = data.map(item => {
            const city = item['data']
            const cityInfo = citiesData.filter(oneCity => oneCity['value'] == city)[0]
            const cityDictInfo = citiesDictData.cities[city]
            cityDictInfo.coordinates = citiesCoordinates[cityDictInfo.id]
            return {... item, cityInfo, cityDictInfo}
        })
        return mergedData
    } catch (error) {
        console.log(`error in request - ${error}`)
    }
}

let alerts = []

setInterval(async () => {
    const updatesAlerts = await getAlerts()
    const newAlerts = updatesAlerts.filter(obj1 => !alerts.some(obj2 => obj2.id === obj1.id));
    if (newAlerts.length > 0 && alerts.length > 0) {
        console.log(`new alerts - ${newAlerts.map(alert => alert.alertDate + ' - ' + alert.cityInfo.name_en).join('\n')}`)
    }
    alerts = updatesAlerts
}, 1000)

app.get('/alerts', (req, res) => {
    res.json(alerts)
  });

// Function to load local cities data
const loadLocalFile = (filename) => {
    try {
      const data = fs.readFileSync(filename, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load local cities data:', error);
      return [];
    }
  };

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});