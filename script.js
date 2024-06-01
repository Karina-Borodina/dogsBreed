const apiKey = 'live_0DPySQieCUuukjkTTBtBNtt9Vn0wADLYwyPrENMtYDD0rNMTrHZJwSkizGHJMpIY';

// Функция для очистки контейнеров
function clearDogInfo() {
    document.getElementById('dog-image').src = "";
    document.getElementById('dog-breed').innerText = "";
    document.getElementById('dog-description').innerText = "";
    document.getElementById('dogs-container').innerHTML = ""; // Очищаем контейнер с собаками
}

// Рандом
document.getElementById('random-button').addEventListener('click', () => {
    clearDogInfo();
    fetch("https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1", {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const dog = data[0];
        document.getElementById('dog-image').src = dog.url;
        document.getElementById('dog-breed').innerText = dog.breeds[0].name;
        document.getElementById('dog-description').innerText = dog.breeds[0].temperament;
    })
    .catch(error => console.error("Error fetching data:", error));
});

// Поиск
document.getElementById('search-button').addEventListener('click', () => {
    clearDogInfo();
    const breedQuery = document.getElementById('search-input').value;
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breedQuery}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const breed = data[0];
            fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}`, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then(response => response.json())
            .then(imageData => {
                document.getElementById('dog-image').src = imageData[0].url;
                document.getElementById('dog-breed').innerText = breed.name;
                document.getElementById('dog-description').innerText = breed.temperament;
            })
            .catch(error => console.error("Error fetching image data:", error));
        } else {
            document.getElementById('dog-image').src = "";
            document.getElementById('dog-breed').innerText = "Порода не найдена";
            document.getElementById('dog-description').innerText = "";
        }
    })
    .catch(error => console.error("Error fetching breed data:", error));
});

// Маленькие
document.getElementById('small-dogs-button').addEventListener('click', () => {
    clearDogInfo();
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const smallDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[1]) <= 10;
        });
        displayDogInfo(smallDogs.slice(0, 4)); // Отображаем только 4 породы
    })
    .catch(error => console.error("Error fetching data:", error));
});

// Средние
document.getElementById('medium-dogs-button').addEventListener('click', () => {
    clearDogInfo();
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const mediumDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[0]) > 10 && parseInt(weightRange[1]) <= 25;
        });
        displayDogInfo(mediumDogs.slice(0, 4)); // Отображаем только 4 породы
    })
    .catch(error => console.error("Error fetching data:", error));
});

// Большие
document.getElementById('large-dogs-button').addEventListener('click', () => {
    clearDogInfo();
    fetch("https://api.thedogapi.com/v1/breeds", {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const largeDogs = data.filter(dog => {
            const weightRange = dog.weight.metric.split(" - ");
            return parseInt(weightRange[0]) > 25;
        });
        displayDogInfo(largeDogs.slice(0, 4)); // Отображаем только 4 породы
    })
    .catch(error => console.error("Error fetching data:", error));
});

function displayDogInfo(data) {
    const dogsContainer = document.getElementById('dogs-container');
    dogsContainer.innerHTML = ''; // Очищаем контейнер

    data.forEach(dog => {
        const dogElement = document.createElement('div');
        dogElement.classList.add('dog');
        const dogImage = dog.image ? dog.image.url : 'https://via.placeholder.com/150'; // Проверка наличия изображения

        dogElement.innerHTML = `
            <img src="${dogImage}" alt="${dog.name}">
            <h3>${dog.name}</h3>
            <p>${dog.temperament}</p>
        `;
        dogsContainer.appendChild(dogElement);
    });
}
