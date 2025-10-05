import { initializeDatabase } from '@/lib/db-init';

export async function setup() {
  await initializeDatabase();
}

setup();
