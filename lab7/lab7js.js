const locationInput = document.getElementById("location-input");
      const submitButton = document.getElementById("submit-button");
      const locationList = document.getElementById("card-list");
      const apiKey = "731e40fecf47d746d9df940223fd93f5";
      
      submitButton.addEventListener("click", function(e) {
        e.preventDefault();
        if (checkIfAddPossible()) {
          saveCity(locationInput.value);
        }
        else {
          alert("Limit miejsc został osiągnięty (10/10)");
        }
        locationInput.value = "";
      });
      
      fetchLocations();
      function fetchLocations() {
        locationList.innerHTML = "";
        let locations = JSON.parse(localStorage.getItem("locations")) || [];
        locations.forEach(location => {
          checkWeather(location.city)
          .then((result) => {
            createCard(location.ID, location.city, result[0], result[1], result[2], result[3])
          })
          .catch((error) => {
            console.error("Pojawił się problem:", error);
          });
        });
      }
      
      function saveCity(cityName) {
        return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          if(!data.name) {
            alert("Zła lokalizacja!");
            throw new Error("Zła lokalizacja");
          }
          let city = data.name;
          helperID = Date.now();
          let locations = JSON.parse(localStorage.getItem("locations")) || [];
          locations.push({ID:helperID, city:city});
          localStorage.setItem("locations", JSON.stringify(locations));
          checkWeather(city);
          fetchLocations();
        })
        .catch((error) => {
          console.error("Pojawił się problem:", error);
        });
      }
      
      function checkWeather(cityName) {
        return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          if(!data.name) {
            alert("Zła lokalizacja!");
            throw new Error("Zła lokalizacja");
          }
          let humidity = data.main.humidity;
          let temperature = data.main.temp;
          let weather_main = data.weather[0].main;
          let weather_icon_code = data.weather[0].icon;
          return [humidity, temperature, weather_main, weather_icon_code]
        })
        .catch((error) => {
          console.error("Pojawił się problem:", error);
        });
      }

      function checkIfAddPossible() {
        let locations = JSON.parse(localStorage.getItem("locations")) || [];
        if (locations.length < 10) {
          return true;
        }
        else {
          return false;
        }
      }
      
      function createCard(ID, city, humidity, temperature, weather_main, weather_icon_code) {
        // tworzenie indywidualnej karty dla każdego miasta
        const newCard = document.createElement("div");
        newCard.classList.add("card", "text-white");
        
        // tworzenie zawartości dla kazdej karty
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        newCard.appendChild(cardBody);
        
        // tytuł dla wybranego wczesniej miasta
        const titleElement = document.createElement("h3");
        titleElement.classList.add("card-title");
        titleElement.innerText = city;
        cardBody.appendChild(titleElement);
        
        // pokazywanie wilgotności
        const humidityElement = document.createElement("p");
        humidityElement.classList.add("card-text");
        humidityElement.innerText = `Wilgotność: ${humidity}%`;
        cardBody.appendChild(humidityElement);
        
        // pokazywanie temp
        const temperatureElement = document.createElement("p");
        temperatureElement.classList.add("card-text");
        temperatureElement.innerText = `Temperatura: ${temperature} C`;
        cardBody.appendChild(temperatureElement);
        
        // pokazywanie pogody
        const weathercodeElement = document.createElement("p");
        weathercodeElement.classList.add("card-text");
        weathercodeElement.innerText = `Pogoda: ${weather_main}`;
        cardBody.appendChild(weathercodeElement);
        
        //ikona pogody
        const weathericonElement = document.createElement("img");
    weathericonElement.classList.add("card-text");
    weathericonElement.src = `http://openweathermap.org/img/wn/${weather_icon_code}@2x.png`;
    cardBody.appendChild(weathericonElement);
        
        // przycisk usunięcia miasta
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Usuń";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.addEventListener("click", function() {
          newCard.remove();
          let locations = JSON.parse(localStorage.getItem("locations")) || [];
          let locationIndex = locations.findIndex(location => location.ID == ID);
          locations.splice(locationIndex, 1);
          localStorage.setItem("locations", JSON.stringify(locations));
        });
        newCard.appendChild(deleteButton);
        
        locationList.appendChild(newCard);
      }