import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createAdmin() {
  try {
    // Load environment variables
    dotenv.config();
    
    // Admin password
    const password = 'admin123';
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    // Read existing .env file
    const envPath = join(__dirname, '..', '.env');
    let envContent = await fs.readFile(envPath, 'utf-8');
    
    // Update ADMIN_PASSWORD_HASH
    const escapedHash = hash.replace(/\$/g, '\\$');
    envContent = envContent.replace(
      /ADMIN_PASSWORD_HASH=.*/,
      `ADMIN_PASSWORD_HASH="${escapedHash}"`
    );
    
    // Write back to .env file
    await fs.writeFile(envPath, envContent);
    
    console.log('Admin credentials updated successfully!');
    console.log('Username: admin');
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();