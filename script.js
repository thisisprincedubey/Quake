const map = L.map('map').setView([20, 0], 2);




function getSeverity(mag) {
  if (mag >= 5) return 'high';
  if (mag >= 3) return 'moderate';
  return 'low';
}

function getColor(mag) {
  if (mag >= 5) return '#e74c3c';
  if (mag >= 3) return '#f39c12';
  return '#27ae60';
}

document.getElementById('search').addEventListener('input', showResults);
document.getElementById('filter-mag').addEventListener('change', showResults);
document.getElementById('sort-by').addEventListener('change', showResults);
document.getElementById('filter-time').addEventListener('change', fetchEarthquakes);

fetchEarthquakes();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let allEarthquakes = [];
let allMarkers = [];



// fetching data from api.

function fetchEarthquakes() {
  const period = document.getElementById('filter-time').value;

  const urls = {
    day: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    week: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson',
    month: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
  };

  document.getElementById('loading').style.display = 'block';
  document.getElementById('cards-container').innerHTML = '';

  fetch(urls[period])
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      allEarthquakes = data.features;
      document.getElementById('loading').style.display = 'none';
      showResults();
    })
    .catch(function(error) {
      document.getElementById('loading').textContent = 'Failed to load data.';
      console.log(error);
    });
}



// function improvemnt required. 


function showResults() {
  const searchText = document.getElementById('search').value.toLowerCase();
  const minMag = parseFloat(document.getElementById('filter-mag').value);
  const sortBy = document.getElementById('sort-by').value;
  let filtered = allEarthquakes.filter(function(earthquake) {
    const place = earthquake.properties.place || '';
    const mag = earthquake.properties.mag || 0;
    const matchesSearch = place.toLowerCase().includes(searchText);
    const matchesMag = mag >= minMag;
    return matchesSearch && matchesMag;
  });


  filtered.sort(function(a, b) {
    if (sortBy === 'magnitude') {
      return b.properties.mag - a.properties.mag;
    }
    if (sortBy === 'depth') {
      return b.geometry.coordinates[2] - a.geometry.coordinates[2];
    }
    return b.properties.time - a.properties.time;
  });

  updateStats(filtered);
  showCards(filtered);
  showMarkers(filtered);
}


function updateStats(data) {
  document.getElementById('total-count').textContent = data.length;
  if (data.length === 0) {
    document.getElementById('strongest').textContent = '—';
    document.getElementById('avg-mag').textContent = '—';
    return;
  }
  const strongest = data.reduce(function(max, earthquake) {
    if (earthquake.properties.mag > max.properties.mag) {
      return earthquake;
    } else {
      return max;
    }
  });



  const total = data.reduce(function(sum, earthquake) {
    return sum + earthquake.properties.mag;
  }, 0);

  const average = total / data.length;

  document.getElementById('strongest').textContent = 'M' + strongest.properties.mag.toFixed(1);
  document.getElementById('avg-mag').textContent = average.toFixed(1);
}



function showCards(data) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  if (data.length === 0) {
    container.innerHTML = '<p class="no-results">No earthquakes found.</p>';
    return;
  }



  for (let i = 0; i < data.length; i++) {
    const earthquake = data[i];
    const mag = earthquake.properties.mag || 0;
    const place = earthquake.properties.place || 'Unknown location';
    const time = new Date(earthquake.properties.time).toLocaleString();
    const depth = earthquake.geometry.coordinates[2].toFixed(1);
    const severity = getSeverity(mag);

    const card = document.createElement('div');
    card.className = 'card ' + severity;

    card.innerHTML =
      '<div class="card-top">' +
        '<span class="card-place">' + place + '</span>' +
        '<span class="card-mag ' + severity + '">M' + mag.toFixed(1) + '</span>' +
      '</div>' +
      '<div class="card-meta">' +
        '<span>Depth: ' + depth + ' km</span>' +
        '<span>' + time + '</span>' +
      '</div>';



    card.addEventListener('click', function(eq) {
      return function() {
        const lat = eq.geometry.coordinates[1];
        const lng = eq.geometry.coordinates[0];
        map.setView([lat, lng], 6);
      };
    }(earthquake));

    container.appendChild(card);
  }
}



function showMarkers(data) {
  for (let i = 0; i < allMarkers.length; i++) {
    map.removeLayer(allMarkers[i]);
  }


  allMarkers = [];

  for (let j = 0; j < data.length; j++) {
    const earthquake = data[j];
    const lat = earthquake.geometry.coordinates[1];
    const lng = earthquake.geometry.coordinates[0];
    const mag = earthquake.properties.mag || 0;
    const place = earthquake.properties.place || 'Unknown';
    const depth = earthquake.geometry.coordinates[2].toFixed(1);
    const time = new Date(earthquake.properties.time).toLocaleString();
    const color = getColor(mag);


    const circle = L.circle([lat, lng], {
      radius: mag * 40000,
      color: color,
      fillColor: color,
      fillOpacity: 0.4,
      weight: 1
    }).addTo(map);


    circle.bindPopup(
      '<strong>M' + mag.toFixed(1) + '</strong><br/>' +
      place + '<br/>' +
      'Depth: ' + depth + ' km<br/>' +
      time
    );

    allMarkers.push(circle);
  }
}