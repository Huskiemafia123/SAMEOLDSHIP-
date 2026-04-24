import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('marine.db');

function escapeString(str: string) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

async function run() {
  const settings = db.prepare('SELECT key, value FROM settings').all() as { key: string, value: string }[];
  const services = db.prepare('SELECT * FROM services').all();

  const settingsMap: Record<string, string> = {};
  let logoUrl = '';
  let watermarkUrl = '';

  settings.forEach(s => {
    if (s.key === 'logo_url') {
      logoUrl = s.value;
    } else if (s.key === 'watermark_url') {
      watermarkUrl = s.value;
    } else {
      settingsMap[s.key] = s.value;
    }
  });

  // Ensure assets directory exists
  if (!fs.existsSync('src/assets')) {
    fs.mkdirSync('src/assets', { recursive: true });
  }

  // Write logo.ts
  fs.writeFileSync('src/assets/logo.ts', `export const logoData = "${escapeString(logoUrl)}";\n`);
  console.log('Wrote src/assets/logo.ts');

  // Write watermark.ts
  fs.writeFileSync('src/assets/watermark.ts', `export const watermarkData = "${escapeString(watermarkUrl)}";\n`);
  console.log('Wrote src/assets/watermark.ts');

  // Write data.ts
  const dataContent = `import { logoData } from './assets/logo';
import { watermarkData } from './assets/watermark';

export const settings = ${JSON.stringify(settingsMap, null, 2)};

// Add back the urls
settings.logo_url = logoData;
settings.watermark_url = watermarkData;

export const services = ${JSON.stringify(services, null, 2)};
`;

  fs.writeFileSync('src/data.ts', dataContent);
  console.log('Wrote src/data.ts');
}

run().catch(console.error);
