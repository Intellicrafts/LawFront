# BakilApp_Frontend
React Application For Showing BakilApp Frontend UI

## Environment Configuration

This application supports both local development and production environments. The API configuration is managed through environment variables.

### API Environment Setup

The application can connect to two different backend environments:

1. **Production API**: Connects to the online Chambers API service
2. **Local API**: Connects to your local Laravel backend

### How to Switch Between Environments

#### For Local Development

1. Create or modify `.env.local` file in the project root:
   ```
   REACT_APP_USE_PRODUCTION=false
   REACT_APP_LOCAL_API_URL=http://127.0.0.1:8000/api
   ```

2. Start the development server:
   ```
   npm start
   ```

#### For Production Build

1. Make sure `.env.production` has the correct settings:
   ```
   REACT_APP_USE_PRODUCTION=true
   REACT_APP_PROD_API_URL=https://chambersapi.logicera.in/api
   ```

2. Build the application:
   ```
   npm run build
   ```

### Environment Files

- `.env`: Default configuration (production settings)
- `.env.local`: Local development settings (overrides .env)
- `.env.production`: Production build settings (used when building for production)

### Checking Current Environment

The application logs the current API environment to the console on startup:
```
API Service using [PRODUCTION/LOCAL] environment: [API URL]
```

You can check this in your browser's developer console to confirm which environment is active.
