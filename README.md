# Login Website - PHP MySQL

A simple login and account creation website using PHP and MySQL, compatible with XAMPP and InfinityFree hosting.

## Features
- Create account with username and password
- Sign in verification
- MySQL database storage
- Clean, minimalist UI
- XAMPP and InfinityFree compatible

## Setup Instructions

### For XAMPP (Local Development)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

2. **Place files in htdocs**
   - Copy all files to `C:\xampp\htdocs\your-project-folder\`

3. **Setup Database**
   - Open your browser and go to: `http://localhost/your-project-folder/setup_database.php`
   - This will create the database and table automatically
   - After setup is complete, you can delete `setup_database.php` for security

4. **Access your website**
   - Go to: `http://localhost/your-project-folder/index.html`

### For InfinityFree Hosting

1. **Create MySQL Database**
   - Log in to InfinityFree control panel
   - Go to MySQL Databases
   - Create a new database and note the credentials:
     - Database hostname (e.g., `sql123.infinityfree.com`)
     - Database name (e.g., `if0_12345678_login_database`)
     - Database username (e.g., `if0_12345678`)
     - Database password

2. **Update config.php**
   - Open `config.php`
   - Comment out the XAMPP settings
   - Uncomment and update the InfinityFree settings with your credentials

3. **Upload Files**
   - Upload all files to your InfinityFree `htdocs` folder via FTP or File Manager
   - Do NOT upload `node_modules` folder

4. **Setup Database**
   - Visit: `http://yoursite.infinityfreeapp.com/setup_database.php`
   - This creates the accounts table
   - Delete `setup_database.php` after setup

5. **Access your website**
   - Go to: `http://yoursite.infinityfreeapp.com/index.html`

## Files Structure

```
├── index.html              # Main HTML page
├── css/
│   └── style.css          # Styles
├── js/
│   └── app.js             # Frontend JavaScript
├── config.php             # Database configuration
├── sign_in.php            # Sign in API endpoint
├── create_account.php     # Create account API endpoint
├── setup_database.php     # Database setup script (delete after use)
└── README.md              # This file
```

## Security Notes

⚠️ **Important**: This is a demo project. For production use:
- Use `password_hash()` and `password_verify()` for passwords
- Implement HTTPS
- Add CSRF protection
- Add rate limiting
- Sanitize all inputs
- Use prepared statements (already implemented)

## Database Schema

```sql
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

**"Connection error" message:**
- Make sure XAMPP Apache and MySQL are running
- Check that `config.php` has correct database credentials

**"Database connection failed":**
- Verify MySQL is running
- Check database name, username, and password in `config.php`

**404 errors on PHP files:**
- Make sure Apache is running in XAMPP
- Verify files are in the correct htdocs folder

## License

Free to use for personal and educational projects.
