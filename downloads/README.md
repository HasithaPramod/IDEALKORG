# Downloads Directory

This directory contains the file upload system for IDEA's website.

## Directory Structure

```
downloads/
├── files.json          # Stores file metadata (auto-generated)
├── .htaccess          # Apache configuration for downloads
├── README.md          # This file
└── files/             # Directory containing uploaded files
    ├── .htaccess      # Apache configuration for file access
    └── [uploaded files] # Files uploaded through the system
```

## File Types Supported

- **Documents**: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx)
- **Images**: JPG, JPEG, PNG, GIF, SVG
- **Media**: MP4, MP3
- **Archives**: ZIP, RAR
- **Text**: TXT files

## File Size Limit

Maximum file size: 50MB per file

## Security Features

- File type validation
- Size limit enforcement
- Unique filename generation
- Prevention of script execution
- CORS headers for secure access

## API Endpoints

- **GET** `/upload.php` - List all files
- **POST** `/upload.php` - Upload new file
- **DELETE** `/upload.php` - Delete file by ID

## File Metadata Structure

Each file entry in `files.json` contains:
```json
{
  "id": "unique_file_id",
  "title": "File Title",
  "description": "File Description",
  "filename": "unique_filename.ext",
  "originalName": "Original File Name.ext",
  "url": "https://idealk.org/downloads/files/filename.ext",
  "uploadedAt": "2024-01-15 10:30:00",
  "size": 1024000,
  "type": "application/pdf",
  "category": "Reports"
}
```

## Categories

- Reports
- Guidelines
- Forms
- Presentations
- Other

## Access URLs

- **Admin Dashboard**: `/admin` (File Management section)
- **Public Downloads**: `/downloads`
- **API Endpoint**: `/upload.php` 