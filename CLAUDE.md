# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive To-Do web application (TaskFlow) with JSON file persistence for Vercel deployment. Currently in active development - frontend (HTML/CSS) completed, backend and JavaScript functionality pending.

## Current Implementation Status

**Completed:**
- `index.html` - Modern UI with glassmorphism design, task form, and semantic structure
- `style.css` - 2025 design trends with CSS custom properties, responsive layout, animations
- `script.js` - Complete frontend logic with API communication, task management, and UI updates
- `api/tasks.js` - Serverless function for task CRUD operations (compatible with both Vercel and local server)
- `db.json` - Data persistence file with working task storage
- `server.js` - Local development server for testing
- `package.json` - Project configuration with development scripts
- Unit tests - Comprehensive test suite with 100% coverage for API functions

## Architecture

**Frontend**: Vanilla HTML/CSS/JavaScript with modern design patterns
- Inter font family for typography
- Glassmorphism cards with backdrop-filter blur effects
- CSS custom properties for consistent design system
- Responsive mobile-first approach

**Backend**: Node.js serverless functions (Vercel)
- File-based JSON storage for simplicity
- RESTful API endpoints for task management

**Data Flow**: Frontend ↔ Fetch API ↔ Serverless Functions ↔ JSON file

## Development Commands

**Local development (recommended):**
```bash
npm run dev        # Start local development server on http://localhost:3000
npm start          # Same as npm run dev
```

**Testing:**
```bash
npm test           # Run unit tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

**Production deployment:**
```bash
vercel             # Deploy to Vercel (requires login)
vercel dev         # Run Vercel development environment
```

**Alternative local servers (limited functionality - no API):**
- `python3 -m http.server 8000`
- `npx serve .`
- Live Server VS Code extension

## Design System

The CSS implements a comprehensive design system with:
- Color palette using CSS custom properties (--color-primary: #6366f1, etc.)
- Consistent spacing scale (--spacing-1 through --spacing-20)
- Typography scale with Inter font weights 300-700
- Border radius system (12px, 16px, 20px for different components)
- Shadow system for depth and elevation

## Key Implementation Details

- **Task Management**: Each task has checkbox for completion, delete button, and text content with auto-generated IDs and timestamps
- **State Management**: TaskManager class handles all state with simple DOM manipulation, no framework dependencies
- **API Design**: GET/POST to `/api/tasks` for retrieving and updating entire task list with error handling and validation
- **Data Persistence**: Serverless function reads/writes to `db.json` file with automatic file creation
- **Cross-Platform Compatibility**: API works with both Vercel serverless functions and local Node.js server
- **Error Handling**: Comprehensive error handling with user-friendly notifications and rollback functionality
- **UI/UX Features**: Toast notifications, empty states, statistics with Polish language support, hover animations
- **Security**: HTML escaping, input validation, CORS headers for secure API communication

## Project Structure

```
/
├── index.html              # Main UI with modern glassmorphism design
├── style.css               # Complete CSS with 2025 design trends
├── script.js               # TaskManager class with full functionality
├── server.js               # Local development server
├── package.json            # Project configuration and scripts
├── .gitignore              # Git ignore rules
├── api/
│   └── tasks.js            # Serverless function (Vercel + local compatible)
├── tests/
│   └── tasks.test.js       # Comprehensive unit tests (12 test cases)
└── db.json                 # JSON data storage (auto-created)
```

## Features Implemented

- ✅ Add new tasks with validation
- ✅ Mark tasks as completed/uncompleted
- ✅ Delete tasks with confirmation
- ✅ Real-time task statistics
- ✅ Empty state handling
- ✅ Responsive design for mobile/desktop
- ✅ Error handling and user feedback
- ✅ Data persistence across sessions
- ✅ Modern UI with animations and hover effects