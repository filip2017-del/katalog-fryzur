async function loadHairstyles() {
  const res = await fetch("hairstyles.json");
  const data = await res.json();
  displayHairstyles(data);

  const lengthFilter = document.getElementById("lengthFilter");
  const styleFilter = document.getElementById("styleFilter");
  const faceFilter = document.getElementById("faceFilter");

  function applyFilters() {
    const lengthVal = lengthFilter.value;
    const styleVal = styleFilter.value;
    const faceVal = faceFilter.value;

    const filtered = data.filter(item => {
      const matchLength = !lengthVal || item.length === lengthVal;
      const matchStyle = !styleVal || item.style === styleVal;
      const matchFace = !faceVal || item.faceShapes.includes(faceVal);
      return matchLength && matchStyle && matchFace;
    });

    displayHairstyles(filtered);
  }

  lengthFilter.addEventListener("change", applyFilters);
  styleFilter.addEventListener("change", applyFilters);
  faceFilter.addEventListener("change", applyFilters);
}

function displayHairstyles(list) {
  const container = document.getElementById("hairstyleContainer");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>Brak fryzur spełniających kryteria.</p>";
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/400x250?text=Brak+zdjęcia'}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p><strong>Długość:</strong> ${item.length}</p>
      <p><strong>Styl:</strong> ${item.style}</p>
      <p>${item.description}</p>
    `;
    container.appendChild(card);
  });
}

loadHairstyles();
