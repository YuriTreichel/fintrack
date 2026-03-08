const fs = require('fs');

try {
  let content = fs.readFileSync('resources/js/App.jsx', 'utf8');

  // Revert the glassMint string exactly as it was defined
  const glassMint = 'bg-gradient-to-b from-fin-mint/90 to-fin-mint/60 backdrop-blur-md shadow-[inset_0_1px_rgba(255,255,255,0.3)] border border-fin-mint/20';
  
  // Need to be careful returning suffixes like /10 /20 /40
  let findStr1 = glassMint + '\\/10';
  content = content.replace(new RegExp(findStr1, 'g'), 'bg-fin-mint/10');
  let findStr2 = glassMint + '\\/20';
  content = content.replace(new RegExp(findStr2, 'g'), 'bg-fin-mint/20');
  let findStr3 = glassMint + '\\/40';
  content = content.replace(new RegExp(findStr3, 'g'), 'bg-fin-mint/40');
  
  // Revert the rest
  content = content.replace(new RegExp(glassMint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'bg-fin-mint');

  // Revert Emerald
  content = content.replace(/bg-gradient-to-br from-emerald-600 to-emerald-600\/60/g, 'bg-emerald-600');

  // Revert Hovers
  content = content.replace(/hover:brightness-110 hover:translate-y-\[-1px\]/g, 'hover:bg-[#85e0d4]');

  fs.writeFileSync('resources/js/App.jsx', content);
  console.log('Mint reversed to solid colors successfully!');
} catch (error) {
  console.error('Error:', error);
}
