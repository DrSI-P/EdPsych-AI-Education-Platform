# EdPsych-Pupil-Voice-Tool Repository Analysis

## Repository Overview
The EdPsych-Pupil-Voice-Tool repository appears to be a tool specifically designed for collecting and managing pupil voice data. It has a clear separation between frontend and backend components.

## Technology Stack
### Frontend
- **Framework**: Next.js (version 14.1.0)
- **UI Library**: React (version 18.2.0)
- **Styling**: Tailwind CSS
- **Development**: TypeScript

### Backend
- **Framework**: Flask (version 3.1.0)
- **Database ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Authentication**: Flask-Login
- **Database**: SQLite (default), with PyMySQL support for MySQL

## Project Structure
- **edpsych_connect_tool/**: Main project directory
  - **frontend/**: Next.js application
  - **backend/**: Flask application
    - **src/**: Source code
      - **main.py**: Main Flask application file
    - **requirements.txt**: Python dependencies

## Key Features
1. **User Authentication System**:
   - Registration and login functionality
   - Role-based access control (EP role mentioned)
   - Session management with Flask-Login

2. **Child Data Management**:
   - Child registration with unique identifiers
   - Age group categorization

3. **Response Collection**:
   - Multiple response types (text, image, audio)
   - File upload functionality
   - Module and activity tracking
   - Timestamp recording

4. **File Storage**:
   - Secure file handling
   - Support for various media types (images, audio)
   - UUID-based unique filenames

## Database Models
1. **User**: Authentication and role management
2. **Child**: Child identification and categorization
3. **Response**: Storing various types of responses from children

## API Endpoints
1. **Authentication**:
   - `/api/register`: User registration
   - `/api/login`: User login
   - `/api/logout`: User logout
   - `/api/status`: Check login status

2. **Child Management**:
   - `/api/child/ensure`: Create or retrieve child records

3. **Response Collection**:
   - `/api/submit_response`: Submit child responses (text or files)

4. **System**:
   - `/api/health`: Health check endpoint
   - `/api/protected_data`: Example of protected route

## Security Features
- Password hashing with Werkzeug
- Secure file uploads with filename sanitization
- Session protection
- Login required decorators for protected routes

## Notable Implementation Details
- Default test user and child created on startup
- Support for multiple response types (text, images, audio)
- File storage in an instance directory
- SQLite database by default, with configuration for potential MySQL usage

## Third-Party Integrations
- No external API integrations visible in the main code
- Relies on standard Flask ecosystem libraries
