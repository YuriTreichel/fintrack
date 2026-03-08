const fs = require('fs');

try {
  let content = fs.readFileSync('resources/js/App.jsx', 'utf8');

  // Replace utility classes
  content = content.replace(/fin-mint/g, 'fin-primary');
  content = content.replace(/fin-peach/g, 'fin-secondary');
  content = content.replace(/#85e0d4/g, '#BA9AF9');

  // Replace PieChart Colors array
  const oldColors = "const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];";
  const newColors = "const COLORS = ['#BA9AF9', '#9571DE', '#533394', '#3B226E', '#B4B4B4', '#241442'];";
  content = content.replace(oldColors, newColors);

  fs.writeFileSync('resources/js/App.jsx', content);
  console.log('App.jsx colors replaced successfully!');
} catch (error) {
  console.error('Error replacing colors:', error);
}
