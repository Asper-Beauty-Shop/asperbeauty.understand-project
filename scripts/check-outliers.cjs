const fs = require('fs');
const csvPath = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalog_CLEANED.csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const data = fs.readFileSync(csvPath, 'utf8');
const lines = data.split('\n');
const headers = parseCSVLine(lines[0].trim());
const priceIdx = headers.indexOf('variants/0/price');
const titleIdx = headers.indexOf('title');

let outliers = [];
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    const price = parseFloat(row[priceIdx]);
    if (price > 150) {
        outliers.push({ title: row[titleIdx], price: price });
    }
}
console.log(JSON.stringify(outliers.slice(0, 20), null, 2));