const fs = require('fs');

try {
  let content = fs.readFileSync('resources/js/App.jsx', 'utf8');

  // Replace bg-fin-mint with a gradient variant
  content = content.replace(/bg-fin-mint/g, 'bg-gradient-to-br from-fin-mint to-fin-mint/60');
  
  // Replace the isolated bg-emerald-600 with gradient
  content = content.replace(/bg-emerald-600/g, 'bg-gradient-to-br from-emerald-600 to-emerald-600/60');

  // Replace explicit hover:bg-[#85e0d4] with hover opacity so the gradient is preserved
  content = content.replace(/hover:bg-\[#85e0d4\]/g, 'hover:brightness-110 hover:saturate-150');
  content = content.replace(/hover:bg-emerald-700/g, 'hover:brightness-110');

  // Replace the hover in the chart tooltip "bg-fin-mint/10" which might have been converted to "bg-gradient-to-br from-fin-mint to-fin-mint/60/10"
  // Wait, if it was bg-fin-mint/10, the regex /bg-fin-mint/g would match "bg-fin-mint" and replace it, resulting in:
  // "bg-gradient-to-br from-fin-mint to-fin-mint/60/10" which is invalid!
  // So let's fix it by being smarter:
  // First, undo any generic replacements that hit /10
  content = content.replace(/bg-gradient-to-br from-fin-mint to-fin-mint\/60\/10/g, 'bg-fin-mint/10');
  // And fix anything that might have been bg-fin-mint/20
  content = content.replace(/bg-gradient-to-br from-fin-mint to-fin-mint\/60\/20/g, 'bg-fin-mint/20');

  fs.writeFileSync('resources/js/App.jsx', content);
  console.log('Gradients applied successfully!');
} catch (error) {
  console.error('Error:', error);
}
