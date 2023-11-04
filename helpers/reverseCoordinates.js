const fs = require('fs');

// Define the schema for your file
const schema = "lat, lng"; // Change this to your desired schema

// Read the JSON file
const inputFile = './public/citiesCoordinates.json';
const outputFile = './public/citiesCoordinatesReversed.json';

try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

  // Reverse the coordinates within each nested array based on the schema
  const reversedData = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      reversedData[key] = data[key].map(item => {
        return [item[1], item[0]]; // Reverse the coordinates
      });
    }
  }

  // Write the reversed data to a new file
  fs.writeFileSync(outputFile, JSON.stringify(reversedData, null, 2));

  console.log('File has been reversed and saved to citiesCoordinatesReversed.json');
} catch (error) {
  console.error('Error:', error.message);
}
