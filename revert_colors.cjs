const fs = require('fs');

try {
  let content = fs.readFileSync('resources/js/App.jsx', 'utf8');

  // Replace PieChart Colors array first before #BA9AF9 replacement
  const oldColors = "const COLORS = ['#BA9AF9', '#9571DE', '#533394', '#3B226E', '#B4B4B4', '#241442'];";
  const newColors = "const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];";
  content = content.replace(oldColors, newColors);

  // Replace utility classes
  content = content.replace(/fin-primary/g, 'fin-mint');
  content = content.replace(/fin-secondary/g, 'fin-peach');
  content = content.replace(/#BA9AF9/g, '#85e0d4');

  fs.writeFileSync('resources/js/App.jsx', content);
  console.log('App.jsx colors reverted successfully!');
} catch (error) {
  console.error('Error reverting colors:', error);
}
