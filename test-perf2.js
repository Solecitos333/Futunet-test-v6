const fs = require('fs');

function testFunction() {
  const obj = { id: 1, name: "test", img: "image.jpg" };
  const str = `      <a class="showcase-card" href="catalogo.html?q=${encodeURIComponent(obj.name)}" aria-label="Ver ${obj.name} en el catálogo">
        <div class="showcase-card__media">
          <img src="${obj.img}" alt="${obj.name}" loading="lazy" decoding="async" />
        </div>
        <div class="showcase-card__body">
          <span class="showcase-card__meta">${obj.name}</span>
          <h3 class="showcase-card__title">${obj.name}</h3>
          <span class="showcase-card__price">${obj.name}</span>
        </div>
      </a>
  `;
}
testFunction();
