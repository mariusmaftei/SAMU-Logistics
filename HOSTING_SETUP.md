# Environment Variables Configuration

To fix authentication issues when hosting, you need to set up the following environment variables:

## Required Environment Variables

### Database

```
MONGODB_URI=mongodb://localhost:27017/samu-logistics
```

### Server Configuration

```
PORT=8080
NODE_ENV=production
SERVER_URL=https://your-server-domain.com
```

### Client Configuration

```
CLIENT_URL=https://your-client-domain.com
```

### Session Security

```
SESSION_SECRET=your-very-secure-session-secret-key-here
```

### Google OAuth

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-server-domain.com/auth/google/callback
```

### Authorization

```
AUTHORISED_EMAILS=user1@example.com,user2@example.com
```

## Important Notes

1. **CLIENT_URL**: This must match your frontend domain exactly
2. **SERVER_URL**: This must match your backend domain exactly
3. **GOOGLE_CALLBACK_URL**: Must be registered in your Google OAuth app settings
4. **SESSION_SECRET**: Use a strong, random secret key
5. **CORS**: The server will automatically allow your CLIENT_URL

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your callback URL: `https://your-server-domain.com/auth/google/callback`
6. Add authorized origins: `https://your-client-domain.com`

## Common Issues Fixed

- ✅ CORS now includes your hosted domain
- ✅ Session cookies work in production
- ✅ Google OAuth callback URL is configurable
- ✅ Fallback URLs prevent crashes
- ✅ Better error handling for missing environment variables
