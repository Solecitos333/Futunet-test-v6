const fs = require('fs');

function testAriaLabels(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const buttonRegex = /<button[^>]*>/g;
    let match;
    let missingAriaCount = 0;

    while ((match = buttonRegex.exec(content)) !== null) {
        const buttonHTML = match[0];

        // Skip buttons that have text content (need full match or simple heuristic)
        // Simplified heuristic: check if it's an icon-only button and missing aria-label

        if (buttonHTML.includes('cart-qty-btn') ||
            buttonHTML.includes('inline-qty-btn') ||
            buttonHTML.includes('cart-item__remove')) {
            if (!buttonHTML.includes('aria-label')) {
                console.log(`Missing aria-label in ${filePath}: ${buttonHTML}`);
                missingAriaCount++;
            }
        }
    }
    return missingAriaCount;
}

const files = ['js/cart.js', 'js/catalog.js', 'index.html', 'catalogo.html', 'producto.html'];
files.forEach(f => {
  if (fs.existsSync(f)) {
      testAriaLabels(f);
  }
});
