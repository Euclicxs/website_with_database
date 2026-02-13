<?php
// setup_database.php
// Run this file ONCE to create the database and table

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'login_database';

// Create connection without database
$conn = new mysqli($db_host, $db_user, $db_pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";
if ($conn->query($sql) === TRUE) {
    echo "✓ Database created successfully or already exists<br>";
} else {
    echo "✗ Error creating database: " . $conn->error . "<br>";
}

// Select database
$conn->select_db($db_name);

// Create accounts table
$sql = "CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "✓ Table 'accounts' created successfully or already exists<br>";
} else {
    echo "✗ Error creating table: " . $conn->error . "<br>";
}

echo "<br><strong>Setup complete!</strong><br>";
echo "You can now delete this file (setup_database.php) for security.<br>";
echo "<a href='index.html'>Go to your website</a>";

$conn->close();
?>
