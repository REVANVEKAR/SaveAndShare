# Community Aid Platform

A collaborative resource sharing platform for Community Aid that connects NGOs, volunteers, and donors using WhatsApp/Telegram integration.

## Features

- WhatsApp/Telegram webhook integration for donation collection
- NGO dashboard with resource claiming and drive management
- User dashboard for volunteering and participation
- Interactive location mapping for donated resources
- NGO verification system
- Profile management for both NGOs and users

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Messaging**: WhatsApp/Telegram API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm run install:all
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Copy `.env.example` to `.env` in the client directory
   - Update the variables with your configuration

4. Start the development servers:

```bash
npm run dev
```

## Project Structure

```
community-aid-platform/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/              # Source files
│       ├── components/   # React components
│       ├── context/      # Context providers
│       ├── pages/        # Page components
│       └── config/       # Configuration
├── server/               # Express backend
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   └── routes/           # API routes
└── README.md             # Project documentation
```

## API Documentation

### Auth Endpoints

- `POST /api/auth/ngo/register` - Register a new NGO
- `POST /api/auth/ngo/login` - Login as NGO
- `POST /api/auth/user/register` - Register a new user
- `POST /api/auth/user/login` - Login as user
- `GET /api/auth/me` - Get current user information

### NGO Endpoints

- `PUT /api/ngo/profile` - Update NGO profile
- `POST /api/ngo/verify` - Submit verification request

### Drive Endpoints

- `POST /api/drives` - Create a new drive
- `GET /api/drives/my-drives` - Get all drives created by logged-in NGO
- `GET /api/drives/upcoming` - Get all upcoming drives
- `POST /api/drives/register/:id` - Register for a drive
- `GET /api/drives/my-registrations` - Get user's drive registrations
- `PUT /api/drives/:id` - Update drive status
- `DELETE /api/drives/:id` - Delete a drive

### Resource Endpoints

- `GET /api/resources` - Get all available resources
- `POST /api/resources/claim/:id` - Claim a resource
- `POST /api/resources/collect/:id` - Mark resource as collected

### Webhook Endpoints

- `POST /api/webhooks/message` - Webhook for WhatsApp/Telegram messages

## WhatsApp/Telegram Integration

The platform uses webhooks to receive donation messages from WhatsApp or Telegram. The message format should be:

```
Donation: 20 food packets
Location: 123 Main St, City
Contact: John Doe, 555-1234
```

## License

This project is licensed under the MIT License.