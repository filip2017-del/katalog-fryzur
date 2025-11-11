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

    // Domyślne zdjęcie jeśli brak
    const images = item.images && item.images.length > 0
      ? item.images
      : ['https://via.placeholder.com/400x250?text=Brak+zdjęcia'];

    // Generuj HTML galerii
    let galleryHTML = `
      <div class="gallery">
        ${images.map((src, i) => `
          <img src="${src}" alt="${item.name} - ${i + 1}" ${i === 0 ? 'class="active"' : ''}>
        `).join('')}
        
        ${images.length > 1 ? `
          <button class="gallery-nav prev" aria-label="Poprzednie zdjęcie">‹</button>
          <button class="gallery-nav next" aria-label="Następne zdjęcie">›</button>
          <div class="gallery-dots">
            ${images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;

    card.innerHTML = `
      ${galleryHTML}
      <h3>${item.name}</h3>
      <p><strong>Długość:</strong> ${item.length}</p>
      <p><strong>Styl:</strong> ${item.style}</p>
      <p>${item.description}</p>
    `;

    container.appendChild(card);

    // Tylko jeśli jest więcej niż 1 zdjęcie
    if (images.length > 1) {
      initGallery(card, images);
    }
  });
}

function initGallery(card, images) {
  const gallery = card.querySelector('.gallery');
  const imgs = card.querySelectorAll('.gallery img');
  const dots = card.querySelectorAll('.gallery-dots .dot');
  const prevBtn = card.querySelector('.gallery-nav.prev');
  const nextBtn = card.querySelector('.gallery-nav.next');

  let currentIndex = 0;
  let startX = 0;
  let isSwiping = false;

  function showImage(index) {
    imgs.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextImage() {
    showImage((currentIndex + 1) % images.length);
  }

  function prevImage() {
    showImage((currentIndex - 1 + images.length) % images.length);
  }

  // Kliknięcia
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });

  // Swipe (touch)
  gallery.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    gallery.classList.add('swiping');
  });

  gallery.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    e.preventDefault();
  }, { passive: false });

  gallery.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) { // minimalny ruch
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    isSwiping = false;
    gallery.classList.remove('swiping');
  });

  // Kliknięcie w zdjęcie = następne
  gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      nextImage();
    }
  });

  // Opcjonalnie: klawisze strzałek (jeśli karta ma fokus)
  card.tabIndex = 0;
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

// Uruchom
loadHairstyles();
