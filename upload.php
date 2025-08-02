<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set proper headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Log function for debugging
function logError($message) {
    error_log("[UPLOAD-FILE] " . $message);
}

// Configuration
$FILES_JSON = "downloads/files.json";
$UPLOAD_DIR = "downloads/files/";

// Create directories if they don't exist
if (!file_exists($UPLOAD_DIR)) {
    if (!mkdir($UPLOAD_DIR, 0755, true)) {
        logError("Failed to create upload directory: " . $UPLOAD_DIR);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create upload directory']);
        exit();
    }
}

// Initialize or load files.json
if (!file_exists($FILES_JSON)) {
    $result = file_put_contents($FILES_JSON, json_encode([]));
    if ($result === false) {
        logError("Failed to create files.json");
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create files.json']);
        exit();
    }
}

function getFiles() {
    global $FILES_JSON;
    $content = file_get_contents($FILES_JSON);
    if ($content === false) {
        logError("Failed to read files.json");
        return [];
    }
    $files = json_decode($content, true);
    return is_array($files) ? $files : [];
}

function saveFiles($files) {
    global $FILES_JSON;
    $result = file_put_contents($FILES_JSON, json_encode($files, JSON_PRETTY_PRINT));
    if ($result === false) {
        logError("Failed to write to files.json");
        return false;
    }
    return true;
}

function validateFile($file) {
    $allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'video/mp4',
        'audio/mpeg',
        'application/zip',
        'application/x-rar-compressed',
        'text/plain'
    ];
    
    $maxSize = 50 * 1024 * 1024; // 50MB
    
    if ($file['size'] > $maxSize) {
        return ['valid' => false, 'error' => 'File size exceeds 50MB limit'];
    }
    
    if (!in_array($file['type'], $allowedTypes)) {
        return ['valid' => false, 'error' => 'File type not allowed: ' . $file['type']];
    }
    
    return ['valid' => true];
}

// Handle GET request - return list of files
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        logError("GET request received");
        $files = getFiles();
        $response = [
            'success' => true, 
            'files' => $files,
            'count' => count($files),
            'timestamp' => date('Y-m-d H:i:s')
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        logError("GET error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'error' => 'Failed to load files: ' . $e->getMessage()
        ]);
    }
    exit;
}

// Handle POST request - upload file
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        logError("POST request received");
        
        if (!isset($_FILES['file'])) {
            logError("No file uploaded");
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No file uploaded']);
            exit;
        }

        $file = $_FILES['file'];
        $title = $_POST['title'] ?? $_POST['description'] ?? '';
        $description = $_POST['description'] ?? '';
        $category = $_POST['category'] ?? 'Other';

        logError("File details: " . json_encode([
            'name' => $file['name'],
            'size' => $file['size'],
            'type' => $file['type'],
            'error' => $file['error']
        ]));

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessage = 'Upload error: ' . $file['error'];
            logError($errorMessage);
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $errorMessage]);
            exit;
        }

        // Validate file
        $validation = validateFile($file);
        if (!$validation['valid']) {
            logError("File validation failed: " . $validation['error']);
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $validation['error']]);
            exit;
        }

        // Generate unique filename
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $unique_name = uniqid('file_', true) . '.' . $ext;
        $target_file = $UPLOAD_DIR . $unique_name;

        logError("Target file: " . $target_file);

        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            $files = getFiles();
            $fileInfo = [
                'id' => uniqid('download_', true),
                'title' => $title ?: $file['name'],
                'description' => $description,
                'filename' => $unique_name,
                'originalName' => $file['name'],
                'url' => "https://idealk.org/downloads/files/" . $unique_name,
                'uploadedAt' => date('Y-m-d H:i:s'),
                'size' => $file['size'],
                'type' => $file['type'],
                'category' => $category
            ];
            $files[] = $fileInfo;
            
            if (saveFiles($files)) {
                logError("File uploaded successfully: " . $fileInfo['id']);
                echo json_encode([
                    'success' => true, 
                    'file' => $fileInfo,
                    'message' => 'File uploaded successfully'
                ]);
            } else {
                logError("Failed to save file metadata");
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to save file metadata']);
            }
        } else {
            logError("Failed to move uploaded file");
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
        }
    } catch (Exception $e) {
        logError("POST error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Upload failed: ' . $e->getMessage()]);
    }
    exit;
}

// Handle DELETE request - delete file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        logError("DELETE request received");
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        $fileId = $data['id'] ?? '';
        
        if (!$fileId) {
            logError("No file ID provided for deletion");
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No file ID provided']);
            exit;
        }

        $files = getFiles();
        $fileIndex = -1;
        
        foreach ($files as $index => $file) {
            if ($file['id'] === $fileId) {
                $fileIndex = $index;
                break;
            }
        }
        
        if ($fileIndex !== -1) {
            $file = $files[$fileIndex];
            $filePath = $UPLOAD_DIR . $file['filename'];
            
            // Delete physical file
            if (file_exists($filePath)) {
                if (!unlink($filePath)) {
                    logError("Failed to delete physical file: " . $filePath);
                }
            }
            
            // Remove from array
            array_splice($files, $fileIndex, 1);
            
            // Save updated list
            if (saveFiles($files)) {
                logError("File deleted successfully: " . $fileId);
                echo json_encode([
                    'success' => true, 
                    'message' => 'File deleted successfully'
                ]);
            } else {
                logError("Failed to update file list after deletion");
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to update file list']);
            }
        } else {
            logError("File not found for deletion: " . $fileId);
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'File not found']);
        }
    } catch (Exception $e) {
        logError("DELETE error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Delete failed: ' . $e->getMessage()]);
    }
    exit;
}

// Handle unsupported methods
logError("Unsupported method: " . $_SERVER['REQUEST_METHOD']);
http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
?> 