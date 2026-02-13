<?php
// create_account.php
// Handle account creation

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

$username = isset($data['username']) ? trim($data['username']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

// Validation
if (empty($username) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => '✗ username and password are required'
    ]);
    exit;
}

// Validate username format
if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    echo json_encode([
        'success' => false,
        'message' => '✗ username: letters, numbers, underscore only'
    ]);
    exit;
}

// Validate password length
if (strlen($password) < 4) {
    echo json_encode([
        'success' => false,
        'message' => '✗ password: at least 4 characters'
    ]);
    exit;
}

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM accounts WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => '✗ username already exists · choose another'
    ]);
    $stmt->close();
    exit;
}
$stmt->close();

// Insert new account (plain text password for demo - use password_hash() in production)
$stmt = $conn->prepare("INSERT INTO accounts (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => '✓ account created · redirecting to sign in'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => '✗ creation failed · try again'
    ]);
}

$stmt->close();
$conn->close();
?>
