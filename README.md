# Secure Admin Pannel
## Project Overview.
```
├── client          # contains react app
└──  backend        # contains backend stuffs
└── README.md              # Project documentation
```

## Tech Stack
- **Frontend**: React, JavaScript, CSS, `react-hot-toast` for notifications.
- **Backend** : Node, express , mongodb , cors , dotenv

## Installation
```bash
  https://github.com/arun-kumar-1995/secure-admin-panel.git
```

## Install dependencies
```bash
cd client
npm install
cd backend
npm install
```

## Env variable for backend app
```bash
# ------------------------------
# Application Configuration
# ------------------------------

PORT=5500

# ------------------------------
# Database Configuration
# ------------------------------


MONGO_URL=mongodb url
DB_NAME=Test-db

JWT_SECRET="secure_pannel_login" 
TOKEN_EXPIRE=1


# -------------------
#  GMAIL SMS
# --------------


EMAIL_USER=arun.devpro@gmail.com
EMAIL_PASS=your app password

EMAIL_ADMIN=er.arun.rhino@gmail.com


# ------------------------------
# Logging and Debugging
# ------------------------------

LOG_LEVEL=info            
ENABLE_DEBUG=true


# ------------------------------
# FRONTEND REQUEST
# ------------------------------


FRONTEND_URL=http://localhost:5173

```
## Routes
```bash

- '/get-ip' getmethod to get the local ip address
- '/send-otp' : post method: for sending otp
- '/verify-otp': post method: for verify otp
- '/ip-login' : post methos: for ip login
- '/block-ip-address' : post method: for blocking the unauthorized ip address
- /get-logs': get method: For getting all admin access logs
- 
```
