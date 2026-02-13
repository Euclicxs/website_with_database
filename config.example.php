<?php
// config.example.php
// Copy this file to config.php and update with your database credentials

// XAMPP local settings (default)
$db_host = 'localhost';
$db_name = 'login_database';
$db_user = 'root';
$db_pass = '';

// For InfinityFree hosting, uncomment and modify these:
// $db_host = 'sql123.infinityfree.com'; // Your InfinityFree MySQL hostname
// $db_name = 'if0_12345678_login_database'; // Your database name
// $db_user = 'if0_12345678'; // Your database username
// $db_pass = 'your_password'; // Your database password

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to utf8
$conn->set_charset("utf8");
?>
