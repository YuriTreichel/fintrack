const fs = require('fs');
let c = fs.readFileSync('resources/js/App.jsx', 'utf8');

c = c.replace(/([a-z-]+:)?text-zinc-900\s*dark:text-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'text-fin-text' + (p2 || ''));
c = c.replace(/([a-z-]+:)?text-zinc-100\s*dark:text-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'text-fin-text' + (p2 || ''));
c = c.replace(/([a-z-]+:)?text-zinc-600\s*dark:text-zinc-500(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'text-fin-text-muted' + (p2 || ''));
c = c.replace(/([a-z-]+:)?bg-zinc-900\/10\s*dark:bg-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'bg-fin-element' + (p2 || ''));
c = c.replace(/([a-z-]+:)?bg-zinc-200\s*dark:bg-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'bg-fin-text' + (p2 || ''));
c = c.replace(/([a-z-]+:)?border-zinc-900\/10\s*dark:border-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'border-fin-element' + (p2 || ''));
c = c.replace(/([a-z-]+:)?border-zinc-200\s*dark:border-white(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'border-fin-border' + (p2 || ''));
c = c.replace(/([a-z-]+:)?text-white\s*dark:text-black(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'text-fin-bg' + (p2 || ''));
c = c.replace(/([a-z-]+:)?bg-zinc-200\/50\s*dark:bg-black(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'bg-black' + (p2 || ''));
c = c.replace(/([a-z-]+:)?bg-zinc-200\s*dark:bg-black(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'bg-black' + (p2 || ''));
c = c.replace(/([a-z-]+:)?border-zinc-200\s*dark:border-black(\/[0-9]+)?/g, (m, p1, p2) => (p1 || '') + 'border-black' + (p2 || ''));

c = c.replace(/className=\"min-h-screen bg-fin-bg text-zinc-100/, 'className="min-h-screen bg-fin-bg text-fin-text');

fs.writeFileSync('resources/js/App.jsx', c);
console.log('Replaced.');
