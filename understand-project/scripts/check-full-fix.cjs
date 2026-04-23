const fs = require('fs');
const path = 'C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalo with full fix.csv';

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

const data = fs.readFileSync(path, 'utf8');
const lines = data.split('\n');
const headers = parseCSVLine(lines[0].trim());
const priceIdx = headers.indexOf('variants/0/price');
const titleIdx = headers.indexOf('title');

for (let i = 1; i < 10; i++) {
    const row = parseCSVLine(lines[i]);
    console.log(`${row[titleIdx]}: ${row[priceIdx]}`);
}