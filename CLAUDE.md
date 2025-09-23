# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive To-Do web application (TaskFlow) with JSON file persistence for Vercel deployment. Currently in active development - frontend (HTML/CSS) completed, backend and JavaScript functionality pending.

## Current Implementation Status

**Completed:**
- `index.html` - Modern UI with glassmorphism design, task form, and semantic structure
- `style.css` - 2025 design trends with CSS custom properties, responsive layout, animations

**Pending:**
- `script.js` - Frontend logic and API communication
- `api/tasks.js` - Serverless function for task CRUD operations
- `db.json` - Data persistence file

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

Local development:
- Serve files with any HTTP server (e.g., `python -m http.server`, `npx serve`, Live Server extension)
- Deploy: `vercel` (requires Vercel CLI installation)

## Design System

The CSS implements a comprehensive design system with:
- Color palette using CSS custom properties (--color-primary: #6366f1, etc.)
- Consistent spacing scale (--spacing-1 through --spacing-20)
- Typography scale with Inter font weights 300-700
- Border radius system (12px, 16px, 20px for different components)
- Shadow system for depth and elevation

## Key Implementation Details

- **Task Management**: Each task will have checkbox for completion, delete button, and text content
- **State Management**: Simple DOM manipulation, no framework dependencies
- **API Design**: GET/POST to `/api/tasks` for retrieving and updating entire task list
- **Data Persistence**: Serverless function reads/writes to `db.json` file
- **Empty States**: UI includes empty state messaging when no tasks exist
- **Statistics**: Header shows task count and completion stats