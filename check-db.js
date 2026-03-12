import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf-8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].replace(/["']/g, '').trim() : process.env[key];
};

const url = getEnv('VITE_SUPABASE_URL');
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample Product:', data[0]);
    console.log('Columns:', Object.keys(data[0] || {}));
  }
}

check();
