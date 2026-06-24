# 🏛️ CivicPulse — Advanced Civic Issue Reporting System

A full-stack MERN application for reporting and tracking civic issues with role-based access for citizens and government officials. **NOW WITH 5 POWERFUL NEW FEATURES!** 🚀

---

## ✨ What's New in v2.0

### 🎯 5 Major Features Added

1. **📸 Image/Media Upload** - Attach up to 5 photos to complaints for better documentation
2. **⭐ Admin Rating System** - Users rate government response quality (1-5 stars)
3. **📊 Advanced Analytics** - Category breakdown, priority distribution, performance metrics
4. **🔥 Trending Issues** - Automatic detection of recurring civic problems
5. **📥 PDF Export** - Download complaint reports for official documentation

### 🐛 Critical Bug Fixes

✅ **Fixed Admin Dashboard Issue** - Admin can now receive and see all complaints properly
✅ Route ordering fixed in Express.js (specific routes before generic ones)
✅ Enhanced error logging and debugging
✅ Improved API response handling

---

## 🎨 UI/UX Improvements

- **Tabbed Admin Dashboard** - Switch between Complaints, Analytics & Trending
- **Star Rating System** - Visual 5-star feedback interface
- **Interactive Analytics Charts** - Beautiful category and priority breakdowns
- **Professional PDF Export** - One-click report generation
- **Enhanced Image Gallery** - Preview and manage complaint photos
- **Responsive Design** - Works perfectly on mobile, tablet & desktop

---

## 📦 Project Structure

```
civic-report/
├── backend/
│   ├── middleware/
│   │   └── auth.js                    [Protected routes]
│   ├── models/
│   │   ├── User.js                    [Enhanced user model]
│   │   └── Complaint.js               [UPDATED: images, ratings, etc]
│   ├── routes/
│   │   ├── auth.js                    [Login/Register]
│   │   └── complaints.js              [FIXED: Route ordering + NEW endpoints]
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── StatusBadge.js
    │   │   ├── UI.js
    │   │   ├── ImageUpload.js          [NEW: Upload images]
    │   │   ├── RatingCard.js           [NEW: Rate admins]
    │   │   ├── AnalyticsDashboard.js   [NEW: View stats]
    │   │   └── TrendingIssues.js       [NEW: Trending problems]
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── AdminDashboard.js       [ENHANCED: Tabs + export]
    │   │   ├── ComplaintForm.js        [ENHANCED: Image upload]
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── UserDashboard.js        [ENHANCED: Ratings]
    │   ├── utils/
    │   │   └── pdfExport.js            [NEW: PDF generation]
    │   ├── api.js                      [UPDATED: New endpoints]
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── package.json
    ├── .env                            [NEW]
    └── postcss.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### Installation

```bash
# 1. Backend Setup
cd backend
npm install
npm start
# Server runs on http://localhost:5000

# 2. Frontend Setup (new terminal)
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Create Admin User

**Option 1: Direct MongoDB**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

**Option 2: Admin Key**
Register with:
```json
{
  "adminKey": "CIVIC_ADMIN_2024"
}
```

---

## 🎯 Features Overview

### 👤 For Citizens

- ✅ **Report Issues** with title, description, photos, location, priority
- ✅ **Track Status** - See real-time updates on submitted complaints
- ✅ **Rate Responses** - Give 1-5 star feedback on admin handling
- ✅ **Location Tagging** - Automatic GPS or manual address entry
- ✅ **Image Attachments** - Upload up to 5 photos per report

### 👨‍💼 For Administrators

- ✅ **Centralized Dashboard** - View all complaints in one place
- ✅ **Status Management** - Pending → In Progress → Resolved workflow
- ✅ **Analytics** - Category breakdown, priority distribution, user ratings
- ✅ **Trending Detection** - Find recurring issues automatically
- ✅ **PDF Export** - Generate official reports with one click
- ✅ **Admin Notes** - Communicate directly with citizens

---

## 📊 Database Schema (Updated)

### Complaint Document
```javascript
{
  _id: ObjectId,
  title: String,                    // Issue title
  description: String,              // Detailed description
  category: String,                 // Roads, Water Supply, etc
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  status: String,                   // Pending, In Progress, Resolved
  priority: String,                 // Low, Medium, High
  images: [String],                 // NEW: Image URLs/base64
  rating: Number,                   // NEW: 0-5 star rating
  feedback: String,                 // NEW: User feedback text
  assignedTo: ObjectId,             // NEW: Assigned admin
  daysToResolve: Number,            // NEW: Resolution time
  isRecurring: Boolean,             // NEW: Recurring flag
  userId: ObjectId,                 // Reference to User
  adminNote: String,                // Admin's response
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Complaints (FIXED & ENHANCED)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | Get all complaints |
| POST | `/api/complaints` | Create new complaint |
| PUT | `/api/complaints/:id` | Update complaint status |
| DELETE | `/api/complaints/:id` | Delete complaint |
| GET | `/api/complaints/stats` | Get statistics (FIXED) |
| GET | `/api/complaints/analytics/report` | Get analytics (NEW) |
| GET | `/api/complaints/trending/issues` | Get trending (NEW) |
| PUT | `/api/complaints/:id/feedback` | Submit rating (NEW) |
| POST | `/api/complaints/:id/images` | Upload image (NEW) |

---

## 🛡️ Authentication & Security

- ✅ **JWT Tokens** - Secure session management
- ✅ **Password Hashing** - bcryptjs encryption
- ✅ **Protected Routes** - Role-based access control
- ✅ **CORS Enabled** - Safe cross-origin requests
- ✅ **Error Handling** - Comprehensive error messages

---

## 🎨 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **ES6+** - Modern JavaScript

---

## 🔧 Configuration

### Backend `.env`
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=civic_report_super_secret_jwt_key_2024
PORT=5000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📸 Feature Showcase

### 1. Image Uploads
Users can attach multiple photos to complaints for better documentation and proof.

### 2. Star Ratings
After complaints are resolved, users rate the admin's response with visual 5-star system.

### 3. Analytics Dashboard
Beautiful charts showing:
- Category-wise complaint distribution
- Priority level breakdown
- Average admin performance rating
- Monthly trends

### 4. Trending Issues
Automatically identifies and ranks recurring civic problems for faster resolution.

### 5. PDF Export
Export all filtered complaints as formatted HTML documents for official records.

---

## 🐛 Bug Fixes in v2.0

### Admin Dashboard Issue (FIXED ✅)

**Problem**: Admin could not see complaints

**Root Cause**: Express route ordering - generic routes were before specific routes

**Solution**:
```javascript
// BEFORE (Wrong order):
router.get('/', ...)          // Generic route
router.get('/stats', ...)     // Specific route (never reached)

// AFTER (Correct):
router.get('/stats', ...)     // Specific route (FIRST)
router.get('/', ...)          // Generic route (LAST)
```

**Additional Fixes**:
- ✅ Enhanced error logging
- ✅ Better error messages
- ✅ Improved async handling
- ✅ Added category stats calculation

---

## 📝 Usage Guide

### User Workflow
1. Register → Login
2. Fill profile information
3. Click "Report New Issue"
4. Fill complaint form with images
5. Submit complaint
6. Track status in dashboard
7. Rate admin response once resolved

### Admin Workflow
1. Login with admin account
2. View Admin Dashboard
3. See all complaints with filters
4. Update complaint status
5. Add admin notes
6. Check Analytics tab
7. View Trending Issues
8. Export data as needed

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Admin sees empty dashboard | Verify user role is 'admin' in MongoDB |
| MongoDB connection error | Check MONGO_URI in .env file |
| Images not uploading | Ensure FileReader is supported (modern browsers) |
| Port already in use | Kill process or use different port |
| CORS errors | Check frontend .env has correct API_URL |

---

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[SETUP.md](./SETUP.md)** - Complete setup guide

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack development with MERN
- ✅ Database design and relationships
- ✅ RESTful API development
- ✅ Authentication & authorization
- ✅ Real-time UI updates
- ✅ Advanced UI patterns (tabs, cards, modals)
- ✅ Data visualization (charts, graphs)
- ✅ Error handling & logging
- ✅ Component reusability
- ✅ State management

---

## 🚀 Future Enhancements

- [ ] Email notifications on status changes
- [ ] SMS alerts for high-priority issues
- [ ] Real-time WebSocket updates
- [ ] Geolocation clustering
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Admin-to-citizen messaging

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Contributors

Built with ❤️ for better civic participation and government responsiveness.

---

**Version**: 2.0 (with 5 new features)  
**Last Updated**: April 2026  
**Status**: ✅ Production Ready  
**Admin Issue**: ✅ FIXED


## 🚀 Setup & Running

### Step 1: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster and get your connection string
3. Open `backend/.env` and replace:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/civic-report?retryWrites=true&w=majority
   ```

### Step 2: Run Backend

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Step 3: Run Frontend

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 🔑 Authentication

### Creating an Admin Account
During registration, enter the Admin Secret Key: `CIVIC_ADMIN_2024`

This grants admin role. Regular registration creates a citizen account.

### Default Roles
- **user** — Citizen: can create and view own complaints
- **admin** — Government Staff: can view all complaints, update status, add notes

---

## 🎯 Features

### Citizen (User) Features
- ✅ Register / Login
- ✅ Create complaint with title, description, category, priority
- ✅ GPS location capture via browser + manual address
- ✅ View all own complaints with status
- ✅ See admin notes on complaints
- ✅ Filter complaints by status

### Admin Features
- ✅ View ALL citizen complaints
- ✅ Stats dashboard (Total, Pending, In Progress, Resolved)
- ✅ Update complaint status via dropdown
- ✅ Add admin notes visible to citizens
- ✅ Delete complaints
- ✅ Search & filter complaints
- ✅ View GPS map links

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | None | Register user |
| POST | /api/auth/login | None | Login |
| GET | /api/complaints | User/Admin | Get complaints |
| POST | /api/complaints | User | Create complaint |
| PUT | /api/complaints/:id | Admin | Update status |
| DELETE | /api/complaints/:id | Admin | Delete complaint |
| GET | /api/complaints/stats | Admin | Dashboard stats |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Styling | Tailwind CSS 3 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP | Axios |

---

## 📱 UI Pages

1. **Home** — Landing page with features, categories, CTA
2. **Login** — Auth with gradient background
3. **Register** — Account creation (user/admin)
4. **User Dashboard** — My complaints with stats & filters
5. **Complaint Form** — Report issue with GPS & category picker
6. **Admin Dashboard** — Full complaint management with stats

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=<your_mongodb_atlas_url>
JWT_SECRET=civic_report_super_secret_jwt_key_2024
PORT=5000
```

### Frontend (optional .env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```
