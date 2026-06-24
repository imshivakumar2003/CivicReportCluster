# 🚀 Civic Report - Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (Cloud or Local)
- Git

---

## ⚡ Quick Setup (2 minutes)

### Step 1: Start the Backend
```bash
cd backend
npm install
npm start
```
✅ Backend running on `http://localhost:5000`

### Step 2: Start the Frontend
```bash
# Open new terminal
cd frontend
npm install
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 👤 Create Your First Admin

### Option 1: Direct MongoDB Update
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Use Admin Key
Register with this data:
```json
{
  "name": "Admin User",
  "email": "admin@civic.com",
  "password": "yourpassword",
  "role": "admin",
  "adminKey": "CIVIC_ADMIN_2024"
}
```

---

## 🔑 Key Features Overview

| Feature | Location | Usage |
|---------|----------|-------|
| 📸 Upload Images | Complaint Form | Add photos while filing complaints |
| ⭐ Rate Admins | User Dashboard | Rate resolved complaints |
| 📊 View Analytics | Admin > Analytics Tab | See statistics and trends |
| 🔥 Trending Issues | Admin > Trending Tab | Find recurring problems |
| 📥 Export Data | Admin Dashboard | Download complaints as HTML |

---

## 🎯 User Workflows

### As a Regular User:
1. **Register** → Login → Fill Profile
2. **Report Issue** → Add title, description, photos
3. **Track Status** → View your complaints in dashboard
4. **Rate Admin** → Give feedback on resolved issues

### As an Admin:
1. **Login** with admin credentials
2. **View Dashboard** → See all stats
3. **Manage Complaints** → Update status, add notes
4. **Check Analytics** → Understand complaint trends
5. **Export Data** → Generate reports

---

## 🗄️ Environment Files

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

## ❌ Troubleshooting

### Admin Can't See Complaints?
✅ **Fixed!** Routes are now properly ordered:
- `/stats` route is BEFORE `/:id` route
- Server logs show connection status
- Check MongoDB connection in terminal

### Images Not Uploading?
- Ensure FileReader API is supported (modern browsers)
- Check browser console for errors
- Max 5 images per complaint

### Port Already in Use?
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

---

## 📊 Database Structure

### Collections:
- **users**: Admin and regular users
- **complaints**: All civic issues reported
- **ratings**: User feedback on admin responses

### Key Fields in Complaints:
```javascript
{
  title: String,
  description: String,
  category: ['Roads', 'Water Supply', ...],
  status: ['Pending', 'In Progress', 'Resolved'],
  priority: ['Low', 'Medium', 'High'],
  images: [String],           // NEW
  rating: Number,             // NEW
  feedback: String,           // NEW
  daysToResolve: Number,      // NEW
  userId: ObjectId,
  adminNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/stats` - Get statistics
- `GET /api/complaints/analytics/report` - Get detailed analytics
- `GET /api/complaints/trending/issues` - Get trending issues
- `PUT /api/complaints/:id/feedback` - Submit rating
- `POST /api/complaints/:id/images` - Upload image

---

## 🎨 Tech Stack

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

### Frontend:
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS
- Modern ES6+

---

## ✨ 5 New Features

1. **📸 Image Uploads** - Multiple images per complaint
2. **⭐ Rating System** - Users rate admin responses
3. **📊 Analytics** - Category stats, priority breakdown
4. **🔥 Trending Issues** - Find recurring problems
5. **📥 PDF Export** - Download complaint reports

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check MONGO_URI in .env |
| Admin dashboard empty | Verify user role is 'admin' |
| Images not displaying | Check browser console for errors |
| API 404 errors | Ensure backend is running on port 5000 |
| Port 3000 in use | Kill process or use PORT=3001 npm start |

---

## 📝 Development Notes

- Hot reload enabled for both frontend and backend
- CORS configured for localhost:3000
- Error logging in backend terminal
- Component logging in browser console

---

## 🎯 Test Scenario

1. Register as **User** → File complaint with images
2. Login as **Admin** → View complaint in dashboard
3. Update complaint status → User sees update
4. Mark as Resolved → User rates response
5. View Analytics → See rating in analytics
6. Export Data → Download report

---

## 📞 Support

- Check server logs: Look in terminal for `npm start`
- Browser console: Right-click → Inspect → Console
- Network tab: Check API calls in DevTools
- MongoDB Compass: Visualize database

---

**Status**: ✅ Ready to Use  
**Last Updated**: Today  
**Version**: 2.0 (with 5 new features)
