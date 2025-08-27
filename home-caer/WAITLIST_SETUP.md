# Waitlist Email Setup

This project now includes automatic email notifications when users join the waitlist.

## Setup Instructions

### 1. Get Resend API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with:

```env
RESEND_API_KEY=your_resend_api_key_here
```

Replace `your_resend_api_key_here` with your actual Resend API key.

### 3. Verify Domain (Optional but Recommended)
For production use, verify your domain with Resend to send emails from your own domain instead of the default Resend domain.

## Features

- ✅ Automatic email confirmation when users join waitlist
- ✅ Waitlist position tracking
- ✅ Duplicate email prevention
- ✅ Beautiful email template with Caer branding
- ✅ Success/error handling in UI
- ✅ Form validation

## Email Template

Users will receive an email with:
- Welcome message
- Their waitlist position number
- Information about Caer
- Link to X (Twitter)

## Development

The waitlist count starts at #7228 and increments with each new signup. In production, you should integrate with a proper database to persist this data.

## API Endpoint

- **POST** `/api/waitlist`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "success": true, "position": 7228, "message": "Successfully joined waitlist" }`
