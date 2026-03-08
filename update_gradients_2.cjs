const fs = require('fs');

try {
  let content = fs.readFileSync('resources/js/App.jsx', 'utf8');

  // 1. Revert previous changes
  content = content.replace(/bg-gradient-to-br from-fin-mint to-fin-mint\/60/g, 'bg-fin-mint');
  content = content.replace(/bg-gradient-to-br from-emerald-600 to-emerald-600\/60/g, 'bg-emerald-600');
  content = content.replace(/hover:brightness-110 hover:saturate-150/g, 'hover:bg-[#85e0d4]');
  content = content.replace(/hover:brightness-110/g, 'hover:bg-emerald-700');

  // 2. Apply the "illuminated but subtle" effect
  // Instead of a flashy fade, we use a 90% to 70% opacity gradient with a subtle inner white shadow to simulate a sleek glossy/illuminated surface.
  // We also add backdrop-blur for a premium touch.
  const glassMint = 'bg-gradient-to-b from-fin-mint/90 to-fin-mint/60 backdrop-blur-md shadow-[inset_0_1px_rgba(255,255,255,0.3)] border border-fin-mint/20';
  
  content = content.replace(/bg-fin-mint/g, glassMint);
  
  // Clean up generic replaces that hit generic /10 or /20 tooltips, reverting them properly
  // Since we replaced bg-fin-mint, "bg-fin-mint/10" became "glassMint/10" which is invalid.
  // We need to fix those using a regex block.
  // Note: let's replace back anything that ended up with /10 or /20
  let findStr1 = glassMint + '/10';
  content = content.split(findStr1).join('bg-fin-mint/10');
  let findStr2 = glassMint + '/20';
  content = content.split(findStr2).join('bg-fin-mint/20');
  let findStr3 = glassMint + '/40';
  content = content.split(findStr3).join('bg-fin-mint/40');

  // Also apply a subtle hover for these buttons
  content = content.replace(/hover:bg-\[#85e0d4\]/g, 'hover:brightness-110 hover:translate-y-[-1px]');
  content = content.replace(/hover:bg-emerald-700/g, 'hover:brightness-110 hover:translate-y-[-1px]');

  fs.writeFileSync('resources/js/App.jsx', content);
  console.log('Subtle illuminated gradients applied successfully!');
} catch (error) {
  console.error('Error:', error);
}
