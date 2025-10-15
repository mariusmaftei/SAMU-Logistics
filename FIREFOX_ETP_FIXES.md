# Firefox Enhanced Tracking Protection (ETP) Compatibility Fixes

## Problem

Firefox's Enhanced Tracking Protection was blocking the SAMU Logistics application, requiring users to disable ETP for the app to work properly. This was due to:

1. **Cross-origin cookies** being blocked
2. **Third-party authentication** (Google OAuth) being restricted
3. **Cross-origin API requests** with credentials being filtered
4. **Session management** being interfered with

## Solutions Implemented

### 1. Server-Side Fixes

#### Content Security Policy Headers (`server/server.js`)

- Added comprehensive CSP headers to prevent tracking protection issues
- Configured cross-origin policies for better Firefox compatibility
- Added specific headers for Google OAuth integration

#### Enhanced CORS Configuration

- Added Firefox-specific headers (`User-Agent`, `Cache-Control`, `Pragma`)
- Extended exposed headers for better cookie handling
- Added preflight caching for improved performance

#### Session Configuration (`server/config/session.js`)

- Disabled cookie partitioning for better compatibility
- Added rolling sessions for extended activity
- Configured proper session destruction on logout

#### Firefox-Specific Cookie Handling

- Added user agent detection for Firefox
- Implemented Firefox-specific cookie attributes
- Added cache control headers for Firefox requests

### 2. Client-Side Fixes

#### API Request Interceptors (`client/src/services/api.js`)

- Added Firefox detection and specific headers
- Implemented cache control for Firefox requests
- Enhanced credential handling for Firefox

#### Authentication Service (`client/src/services/auth-service.js`)

- Added Firefox-specific login method
- Implemented cookie clearing for Firefox compatibility
- Enhanced error handling for Firefox ETP issues

#### AuthContext Enhancements (`client/src/context/AuthContext.js`)

- Added Firefox detection and logging
- Implemented Firefox-specific error handling
- Added fallback behavior for network errors

### 3. User Experience Improvements

#### Firefox ETP Warning Component

- Created `FirefoxETPWarning` component for user guidance
- Provides clear instructions for Firefox users
- Offers retry functionality and dismissal options
- Responsive design for mobile compatibility

## Technical Details

### Headers Added

```javascript
// Firefox ETP compatibility headers
res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
res.header("Cross-Origin-Resource-Policy", "cross-origin");

// Content Security Policy
res.header(
  "Content-Security-Policy",
  "default-src 'self' https://samu-logistics-app.web.app https://samu-logistics-server.qcpobm.easypanel.host https://accounts.google.com; " +
    "script-src 'self' 'unsafe-inline' https://accounts.google.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://samu-logistics-server.qcpobm.easypanel.host https://accounts.google.com; " +
    "frame-src https://accounts.google.com;"
);
```

### Cookie Configuration

```javascript
cookie: {
  secure: isProduction,
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  partitioned: false, // Disabled for Firefox compatibility
}
```

### Firefox Detection

```javascript
const isFirefox = navigator.userAgent.includes("Firefox");
```

## Testing Recommendations

1. **Test with Firefox ETP enabled** (Standard protection)
2. **Test with Firefox ETP strict** (Strict protection)
3. **Test with Firefox ETP disabled** (Should work normally)
4. **Test cross-browser compatibility** (Chrome, Edge, Safari)

## User Instructions

If users still experience issues with Firefox ETP:

1. **Temporary Solution**: Disable Enhanced Tracking Protection
2. **Site Exception**: Add the SAMU Logistics site to Firefox exceptions
3. **Alternative Browser**: Use Chrome or Edge for optimal experience
4. **Retry Authentication**: Use the retry button in the warning component

## Benefits

- ✅ **Improved Firefox compatibility** without disabling ETP
- ✅ **Better user experience** with clear guidance
- ✅ **Maintained security** while improving functionality
- ✅ **Cross-browser consistency** in behavior
- ✅ **Graceful degradation** for unsupported configurations

## Future Considerations

- Monitor Firefox ETP updates and adjust accordingly
- Consider implementing alternative authentication methods
- Add more granular browser detection if needed
- Implement progressive enhancement for different protection levels
