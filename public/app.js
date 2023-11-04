document.addEventListener('DOMContentLoaded', () => {
  const newDataContainer = document.getElementById('new-data-container');
  const prevDataContainer = document.getElementById('prev-data-container');

  // Function to fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      displayData(data);
    } catch (error) {
      prevDataContainer.innerHTML = 'Error: ' + error.message;
    }
  };

  // Function to display the data on the webpage with styled rectangles
  const displayData = (dataList) => {
    clearAllMarkers()
    const timeForNewAlert = 1000*60*10
    while (prevDataContainer.firstChild) {
      prevDataContainer.removeChild(prevDataContainer.firstChild);
    }
    while (newDataContainer.firstChild) {
      newDataContainer.removeChild(newDataContainer.firstChild);
    }

    dataList.filter(item => new Date(item.alertDate) > new Date() - timeForNewAlert).forEach(alert => displayAlert(alert, true));
    dataList.filter(item => new Date(item.alertDate) <= new Date() - timeForNewAlert).forEach(alert => displayAlert(alert, false));
  };

  const displayAlert = (alert, isNew) => {
    const wrapperElement = isNew ? 'div' : 'p'
    const dataDiv = document.createElement('div');
    const container = isNew ? newDataContainer : prevDataContainer;
      dataDiv.className = `data-box-${isNew?'new':'old'}`;
      dataDiv.innerHTML = `<h2>${alert.title}</h2>
                          <${wrapperElement}><strong>תאריך:</strong> ${alert.alertDate}</${wrapperElement}>
                          <${wrapperElement}><strong>עיר:</strong> ${alert.cityInfo ? alert.cityInfo.name : alert.data}</${wrapperElement}>
                          <${wrapperElement}><strong>אזור:</strong> ${alert.cityInfo && alert.cityInfo.zone}</${wrapperElement}>`;
      if (alert.cityInfo) {
        const timeSinceCountdown = parseInt((new Date() - new Date(alert.alertDate) - alert.cityInfo.countdown*1000)/1000)
        let timeText = `${alert.cityInfo.time}`
        if (timeSinceCountdown < 0) {
          timeText += ` (${-timeSinceCountdown})`
        }
        dataDiv.innerHTML += `<${wrapperElement}><strong style='color: red'>${timeText}</${wrapperElement}>`
      }
      
      container.appendChild(dataDiv);
      
      if (isNew && alert.cityInfo) {
        addMarker(alert.cityInfo.lat, alert.cityInfo.lng, alert.data);
      }
      if (isNew && alert.cityDictInfo.coordinates) {
        addPolygon(alert.cityDictInfo.coordinates)
      }
  }

  // Fetch and display the data when the page loads
  fetchData()
  setInterval(() => {fetchData()}, 1000)
});