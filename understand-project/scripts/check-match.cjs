const fs = require('fs');

function parseCSV(path, quote = '"', delimiter = ',') {
    const data = fs.readFileSync(path, 'utf8');
    const lines = data.split('\n');
    return lines.map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === quote) {
                if (inQuotes && line[i + 1] === quote) {
                    current += quote;
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    });
}

try {
    const pharmacyList = parseCSV('C:\\Users\\C-R\\asperbeauty\\products-data.csv', '"', ',');
    const catalog = parseCSV('C:\\Users\\C-R\\Desktop\\ABS\\Asper All form Productts\\Asper_Catalog_CLEANED.csv', '"', ',');
    
    const pharmacyHeader = pharmacyList[0];
    const nameIdx = 1; // اسم المادة
    const priceIdx = 4; // سعر البيع
    
    const catalogHeader = catalog[0];
    const catTitleIdx = catalogHeader.indexOf('title');
    
    let matches = 0;
    for (let i = 1; i < 100; i++) {
        if (!pharmacyList[i]) continue;
        const pName = pharmacyList[i][nameIdx];
        if (!pName) continue;
        
        for (let j = 1; j < catalog.length; j++) {
            const cTitle = catalog[j][catTitleIdx];
            if (cTitle && cTitle.toLowerCase().includes(pName.toLowerCase())) {
                matches++;
                break;
            }
        }
    }
    console.log(`Potential matches in sample: ${matches}`);
} catch (e) {
    console.error(e);
}