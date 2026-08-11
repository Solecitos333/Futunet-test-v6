const fs = require('fs');

const cartSrc = fs.readFileSync('./js/cart.js', 'utf8');

if (cartSrc.includes('aria-label="Disminuir cantidad"') && cartSrc.includes('aria-label="Aumentar cantidad"')) {
    console.log("Success: aria-labels found in js/cart.js");
} else {
    console.log("Error: aria-labels not found in js/cart.js");
}
