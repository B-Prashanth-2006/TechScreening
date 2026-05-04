# TechScreening Demo - Full Stack Structure

## Project Organization

```
techscreening-demo/
├── frontend/
│   ├── css/
│   │   └── styles.css           # All styling
│   ├── js/
│   │   └── app.js               # Frontend logic, speech API, form handling
│   └── index.html               # Main HTML file
├── backend/
│   ├── controllers/
│   │   └── resumeController.js  # Resume upload logic
│   ├── models/
│   │   └── resumeModel.js       # Database operations
│   ├── routes/
│   │   └── api.js               # API endpoints
│   └── server.js                # Express server setup
├── db/
│   └── resumes.json             # Resume storage (JSON database)
├── uploads/                     # Uploaded resume files
├── package.json
└── README.md
```

## Architecture

### Frontend (`/frontend`)
- **index.html** - Main page structure
- **css/styles.css** - All styling using CSS variables
- **js/app.js** - Application logic:
  - Language selection
  - Resume upload with drag-and-drop
  - Speech recognition (microphone input)
  - Speech synthesis (AI speaking)

### Backend (`/backend`)
- **server.js** - Express app initialization and middleware setup
- **routes/api.js** - API route definitions
- **controllers/resumeController.js** - Business logic for resume handling
- **models/resumeModel.js** - Database read/write operations

### Database (`/db`)
- **resumes.json** - Simple JSON file storing uploaded resume metadata

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open browser:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /api/status` - Check backend status
- `POST /api/upload` - Upload resume file

## Features

- Language selection (Python, Java, C++, C)
- Resume upload with validation
- Real-time speech recognition
- AI voice output
- Responsive design
- Clean separation of concerns
