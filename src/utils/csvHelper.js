export function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result.map(s => s.trim());
}

export function parseInventoryCSV(csvText) {
  const lines = String(csvText).split(/\r?\n/).filter(l => l.trim().length);
  const items = [];
  lines.forEach((line, idx) => {
    if (idx === 0 && /name/i.test(line) && /price/i.test(line)) return;
    const cols = parseCsvLine(line);
    if (cols.length < 4) return;
    const [name, category, price, stock] = cols;
    if (!name) return;
    items.push({
      name,
      category: category || 'Stationery',
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      icon: '🗂️'
    });
  });
  return items;
}

export function generateInventoryCSV(products = []) {
  const rows = [['Name', 'Category', 'Price', 'Stock']];
  products.forEach(p => rows.push([p.name, p.category, p.price, p.stock]));
  return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
}
