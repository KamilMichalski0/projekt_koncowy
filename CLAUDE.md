# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive To-Do web application with JSON file persistence planned for deployment on Vercel. The project follows a frontend + serverless backend architecture pattern.

## Planned Architecture

Based on the implementation plan (Plan_implementacji.md), this project will have:

**Frontend**: HTML, CSS, and vanilla JavaScript
- `index.html` - Main UI with form and task list
- `style.css` - Modern styling
- `script.js` - Frontend logic and API communication

**Backend**: Node.js serverless functions on Vercel
- `api/tasks.js` - Serverless function handling GET/POST requests for tasks
- `db.json` - JSON file for data persistence

**API Endpoints**:
- `GET /api/tasks` - Retrieve all tasks from db.json
- `POST /api/tasks` - Update task list in db.json

## Development Commands

Since this is a simple web application without a build system:
- No build commands required
- No package manager configuration present
- Deploy using Vercel CLI: `vercel` (after installing vercel CLI globally)

## File Structure

The project follows this structure:
```
/
├── index.html              # Main UI
├── style.css               # Styling
├── script.js               # Frontend logic
├── api/
│   └── tasks.js            # Serverless function
└── db.json                 # Data storage
```

## Key Implementation Notes

- Vercel automatically recognizes files in `api/` folder as serverless functions
- Frontend communicates with backend via fetch API
- All data persistence handled through JSON file operations in the serverless function
- No client-side database or complex state management - simple DOM manipulation

## Deployment

The application is designed for Vercel deployment where:
- Static files (HTML, CSS, JS) are served directly
- API functions run as serverless endpoints
- JSON file persistence works within Vercel's serverless environment