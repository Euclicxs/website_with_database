<?php
// config.php
// Database configuration for XAMPP/InfinityFree

// XAMPP local settings (default)
$db_host = 'localhost';
$db_name = 'login_database';
$db_user = 'root';
$db_pass = '';

// Uncomment and modify these for InfinityFree hosting:
$db_host = 'sql104.infinityfree.com'; // Your InfinityFree MySQL hostname
$db_name = 'if0_41145541_login'; // Your database name
$db_user = 'if0_41145541'; // Your database username
$db_pass = 'keityDa7HSj'; // Your database password

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
