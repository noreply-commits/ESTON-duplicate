const { createTables } = require('./config/db');

console.log('🚀 Setting up Eston University Admissions Portal...\n');

async function setup() {
  try {
    console.log('📊 Creating database tables...');
    await createTables();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n🎯 Next steps:');
    console.log('1. Create a .env file based on env.example');
    console.log('2. Install dependencies: npm install');
    console.log('3. Install client dependencies: cd client && npm install');
    console.log('4. Start the development server: npm run dev');
    console.log('\n🔑 Default admin account:');
    console.log('   Email: admin@eston.edu.gh');
    console.log('   Password: admin123');
    console.log('\n⚠️  Remember to change the default admin password!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your database connection settings');
    console.log('3. Ensure the database exists');
    process.exit(1);
  }
}

setup();
