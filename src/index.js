let addToy = false;
const toyCollection = document.getElementById('toy-collection');
const toyForm = document.querySelector('.add-toy-form');
const baseUrl = 'http://localhost:3000/toys';

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetchToys();

  // Add event listener for form submission
  toyForm.addEventListener('submit', createToy);
});

function fetchToys() {
  fetch(baseUrl)
    .then(response => response.json())
    .then(toys => {
      toyCollection.innerHTML = '';
      toys.forEach(renderToy);
    })
    .catch(error => console.error('Error fetching toys:', error));
}

function renderToy(toy) {
  const toyDiv = document.createElement('div');
  toyDiv.className = 'card';
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes </p>
    <button class="like-btn" data-id="${toy.id}">Like <3</button>
  `;
  toyCollection.appendChild(toyDiv);

  // Add event listener for like button
  toyDiv.querySelector('.like-btn').addEventListener('click', () => likeToy(toy.id, toy.likes));
}

function createToy(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, image, likes: 0 })
  })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      event.target.reset();
    })
    .catch(error => console.error('Error creating toy:', error));
}

function likeToy(id, likes) {
  fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: likes + 1 })
  })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.querySelector(`[data-id="${id}"]`).closest('.card');
      toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error('Error updating likes:', error));
}