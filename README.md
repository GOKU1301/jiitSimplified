
# JIIT Simplified Paper Portal

A full-stack application that allows JIIT students to upload, search, and download past exam papers. The platform helps students prepare for exams by providing easy access to previous papers organized by subject, year, and term.

## Features

- **User Authentication**: Secure login via Google OAuth for JIIT email addresses
- **Paper Search**: Search by subject code, year range, and exam terms (T1, T2, T3)
- **Paper Upload**: Authenticated users can upload PDF papers to share with others
- **AWS S3 Integration**: Secure storage and retrieval of uploaded papers
- **Responsive UI**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express
- Sequelize ORM with MySQL database
- Passport.js for authentication
- AWS SDK for S3 integration
- JWT for session management

### Frontend
- Next.js (React framework)
- Tailwind CSS for styling
- TypeScript for type safety
- Fetch API for backend communication

## Project Structure

```
/jiit-simplified-monorepo
├── jiitSimplified             # Backend folder
│   └── backend                
│       ├── src                # Backend source code
│       │   ├── config         # Configuration files
│       │   ├── controllers    # Request handlers
│       │   ├── middlewares    # Express middlewares
│       │   ├── models         # Sequelize models
│       │   ├── routes         # API routes
│       │   ├── services       # Business logic
│       │   └── index.js       # Entry point
│       └── package.json       
│       
├── jiit_simplified_frontend   # Frontend folder
│   ├── app                    # Next.js app directory
│   │   ├── api                # Frontend API clients
│   │   ├── components         # Reusable UI components
│   │   ├── dashboard          # Dashboard page
│   │   ├── login              # Login page
│   │   └── page.tsx           # Home page
│   └── package.json
│
├── package.json               # Root package.json for monorepo
└── README.md                  # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL database
- AWS account with S3 bucket
- Google OAuth credentials

### Environment Setup

1. **Backend (.env file in jiitSimplified/backend)**
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-here
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

2. **Frontend (.env.local file in jiit_simplified_frontend)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Installation

1. Install all dependencies
```bash
npm run install:all
```

2. Initialize the database (run migrations and seeders)
```bash
cd jiitSimplified/backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

3. Start the development servers
```bash
# From root directory
npm run dev
```

## Development

- Backend will run on http://localhost:3001
- Frontend will run on http://localhost:3000
- API endpoints are available at http://localhost:3001/api/*

## Deployment

1. Build both frontend and backend
```bash
npm run build
```

2. Start production servers
```bash
npm run start
``` 
=======
# jiit_simplified
JiitSimplified is the go-to app for JIIT students to easily upload and access past year question papers. No more digging through old chats or asking around last minute — everything you need is just a tap away. Built by students, for students of jiit:)
>>>>>>> 61dfa7e070ae30dab8e4083439ea0b0d8243cd99
=======
# jiitSimplified
>>>>>>> fcf8b22a10a81d185ed58ea1dd09e148fa4f533a
