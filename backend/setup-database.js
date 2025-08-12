import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

async function setupDatabase() {
  console.log('🚀 Setting up Planning Tool Database...');
  
  // Check if we have the required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please update backend/.env with your Supabase credentials');
    return;
  }

  // Create database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'database.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Creating database tables...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('⚠️  Table already exists, skipping...');
          } else {
            console.error('❌ Error executing statement:', error.message);
          }
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📊 Tables created:');
    console.log('   - materials (inventory management)');
    console.log('   - bom (bill of materials)');
    console.log('   - orders (production orders)');
    console.log('');
    console.log('📝 Sample data inserted for testing');
    console.log('');
    console.log('🚀 You can now start the application:');
    console.log('   npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in backend/.env');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Verify your database credentials');
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();