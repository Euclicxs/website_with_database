<?php
// sign_in.php
// Handle sign in verification

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
        'message' => 'please enter username and password'
    ]);
    exit;
}

// Fetch account by username
$stmt = $conn->prepare("SELECT username, password FROM accounts WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Username does not exist
    echo json_encode([
        'success' => false,
        'message' => '✗ account has not been created yet'
    ]);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

// Check password
if ($user['password'] !== $password) {
    // Password is wrong
    echo json_encode([
        'success' => false,
        'message' => '✗ credentials incorrect · password is wrong'
    ]);
    exit;
}

// Success
echo json_encode([
    'success' => true,
    'message' => '✓ authentication success · account exists and credentials valid'
]);

$conn->close();
?>
