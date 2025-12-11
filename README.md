# AssetVerse Server - Backend API

## 🌐 Live API URL
[AssetVerse API](https://asseet-vers-server.vercel.app)

## 📋 Project Purpose
Backend API for AssetVerse - A comprehensive B2B Corporate Asset Management System. This server handles authentication, asset management, request workflows, employee affiliations, payment processing, and analytics.

## ✨ Key Features

### Authentication & Authorization
- JWT token generation and validation
- Role-based middleware (verifyToken, verifyHR)
- Firebase authentication integration
- Secure password handling

### Asset Management
- CRUD operations for company assets
- Quantity tracking and management
- Asset search and filtering
- Multi-tenant data isolation

### Request Workflow
- Asset request processing
- Approval/rejection system
- Auto-affiliation logic
- Package limit enforcement

### Employee Management
- Employee affiliation tracking
- Multi-company support
- Team member management
- Profile image population

### Payment Integration
- Stripe checkout session creation
- Payment verification
- Package upgrade processing
- Payment history tracking

### Analytics
- Asset distribution statistics
- Top requested assets tracking
- Real-time data aggregation

## 📦 NPM Packages Used

### Core Dependencies
- **express** (^4.21.2) - Web framework
- **mongodb** (^6.12.0) - MongoDB driver
- **mongoose** (^8.9.3) - MongoDB ODM
- **dotenv** (^16.4.7) - Environment variable management

### Authentication & Security
- **jsonwebtoken** (^9.0.2) - JWT token generation/verification
- **cookie-parser** (^1.4.7) - Cookie parsing middleware
- **cors** (^2.8.5) - CORS middleware

### Payment Processing
- **stripe** (^17.5.0) - Stripe payment integration

### Development
- **nodemon** (^3.1.9) - Auto-restart on file changes

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Stripe account
- Firebase project

### Installation

1. Clone the repository
```bash
git clone https://github.com/imtiaz-al-kabir/AssetVerse-client.git
cd assetverse-server
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```env
# Server Configuration
PORT=5000

# MongoDB
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# JWT Secret
ACCESS_TOKEN_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

4. Start the development server
```bash
npm run dev
```

5. Start production server
```bash
npm start
```

## 🏗️ Project Structure

```
server/
├── controllers/           # Request handlers
│   ├── authController.js     # Authentication logic
│   ├── assetController.js    # Asset management
│   ├── requestController.js  # Request workflow
│   ├── employeeController.js # Employee management
│   ├── paymentController.js  # Payment processing
│   └── statsController.js    # Analytics
├── models/               # MongoDB schemas
│   ├── User.js              # User model
│   ├── Asset.js             # Asset model
│   ├── Request.js           # Request model
│   ├── EmployeeAffiliation.js # Affiliation model
│   ├── AssignedAsset.js     # Assigned asset model
│   ├── Package.js           # Package model
│   └── Payment.js           # Payment model
├── routes/               # API routes
│   ├── authRoutes.js        # Auth endpoints
│   ├── assetRoutes.js       # Asset endpoints
│   ├── requestRoutes.js     # Request endpoints
│   ├── employeeRoutes.js    # Employee endpoints
│   ├── paymentRoutes.js     # Payment endpoints
│   └── statsRoutes.js       # Analytics endpoints
├── middleware/           # Custom middleware
│   ├── verifyToken.js       # JWT verification
│   └── verifyHR.js          # HR role verification
└── index.js             # Server entry point
```

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register        # Register new user
POST   /auth/login           # User login
POST   /auth/jwt             # Generate JWT token
POST   /auth/logout          # User logout
```

### Assets (Protected - HR Only)
```
GET    /assets               # Get all company assets
POST   /assets               # Create new asset
PUT    /assets/:id           # Update asset
DELETE /assets/:id           # Delete asset
```

### Requests (Protected)
```
GET    /requests             # Get requests (role-based)
POST   /requests             # Create new request
PUT    /requests/:id         # Update request status (HR only)
GET    /requests/my-requests # Get employee's requests
```

### Employees (Protected - HR Only)
```
GET    /employees/my-team    # Get company employees
DELETE /employees/:id        # Remove employee
GET    /employees/team-list  # Get team list (for employees)
```

### Assigned Assets (Protected)
```
GET    /assigned-assets      # Get employee's assigned assets
```

### Payments (Protected - HR Only)
```
POST   /payments/create-checkout-session  # Create Stripe session
POST   /payments/payment-success          # Verify payment
```

### Analytics (Protected - HR Only)
```
GET    /stats/asset-distribution   # Pie chart data
GET    /stats/top-requests         # Bar chart data
```

### Packages (Public)
```
GET    /packages              # Get all packages
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  role: "employee" | "hr",
  companyName: String (HR only),
  companyLogo: String (HR only),
  packageLimit: Number (HR only),
  currentEmployees: Number (HR only),
  subscription: String (HR only),
  dateOfBirth: Date,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Assets Collection
```javascript
{
  productName: String,
  productImage: String,
  productType: "Returnable" | "Non-returnable",
  productQuantity: Number,
  availableQuantity: Number,
  dateAdded: Date,
  hrEmail: String,
  companyName: String
}
```

### Requests Collection
```javascript
{
  assetId: ObjectId,
  assetName: String,
  assetType: String,
  requesterName: String,
  requesterEmail: String,
  requesterImage: String,
  hrEmail: String,
  companyName: String,
  requestDate: Date,
  approvalDate: Date,
  requestStatus: "pending" | "approved" | "rejected",
  note: String,
  processedBy: String
}
```

### Employee Affiliations Collection
```javascript
{
  employeeId: ObjectId,
  hrId: ObjectId,
  employeeEmail: String,
  employeeName: String,
  employeeImage: String,
  hrEmail: String,
  companyName: String,
  companyLogo: String,
  affiliationDate: Date,
  status: "active" | "inactive"
}
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DB_USER` | MongoDB username |
| `DB_PASS` | MongoDB password |
| `ACCESS_TOKEN_SECRET` | JWT secret key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `CLIENT_URL` | Frontend URL for CORS |

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control
- CORS protection
- Environment variable security
- Password hashing (handled by Firebase)
- Secure cookie handling

## 🧪 Testing

### Test Credentials
**HR Manager:**
- Email: hr@testcompany.com
- Password: Test@123

**Employee:**
- Email: employee@test.com
- Password: Test@123

## 🚀 Deployment

### Recommended Platforms
- **Render** - Easy deployment with free tier
- **Railway** - Simple setup with MongoDB support
- **Heroku** - Classic PaaS solution

### Deployment Steps
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Firebase
- **Payment**: Stripe
- **Security**: CORS, Cookie Parser

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Imtiaz AL Kabir - [GitHub Profile](https://github.com/imtiaz-al-kabir)
