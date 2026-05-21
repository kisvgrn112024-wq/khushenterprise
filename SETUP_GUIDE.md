# Khush Enterprise - MongoDB Setup & Admin Portal Guide

## ✓ Completed Tasks

- ✅ **221 glassware products** added with images from the listing folder
- ✅ **Glassware category** created with auto-generated titles and descriptions  
- ✅ **Product images** copied from `listing/online listing or ke/` folders (PNG format preserved)
- ✅ **Realistic pricing** based on capacity and quantity
- ✅ **Products page** loads successfully at `http://localhost:5000/products.html`
- ✅ **Admin portal** page loads at `http://localhost:5000/admin-portal-ke.html`
- ✅ **Code pushed to GitHub** at [khushenterprise](https://github.com/kisvgrn112024-wq/khushenterprise)

---

## 🔧 To Enable Full Admin Portal & Product Loading

### Option 1: Install MongoDB Locally (Windows)

**Step 1: Download MongoDB Community Edition**
- Go to: https://www.mongodb.com/try/download/community
- Select **Windows** and download the `.msi` file
- Run the installer and follow the setup wizard
- During installation, choose to install **MongoDB Compass** (helpful for data management)

**Step 2: Start MongoDB Service**
```powershell
# Start MongoDB service
net start MongoDB

# Or if MongoDB is running as a user service:
# Use Services app (services.msc) and find "MongoDB" service
```

**Step 3: Verify MongoDB is Running**
```powershell
# Test connection on port 27017
Test-NetConnection -ComputerName localhost -Port 27017
```

**Step 4: Start the Backend**
```powershell
cd c:\web\backend
npm start
```

**Step 5: Access Admin Portal**
- Homepage: `http://localhost:5000/`
- Products: `http://localhost:5000/products.html`
- Admin Panel: `http://localhost:5000/admin-portal-ke.html`
- API: `http://localhost:5000/api/products` (will return JSON product data)

---

### Option 2: Use MongoDB Atlas (Cloud Database)

**Step 1: Create MongoDB Atlas Account**
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new cluster

**Step 2: Get Connection String**
- In MongoDB Atlas, click "Connect"
- Select "Drivers" → Node.js
- Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database`)

**Step 3: Create `.env` File**
```bash
# Create backend/.env file with:
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/khush-enterprises
PORT=5000
```

**Step 4: Start Backend and Access Admin Portal**
```powershell
cd c:\web\backend
npm start
```

---

## 📊 Product Data Structure

All 221 products are organized by type:

| Category | Type | Count | Image Samples |
|----------|------|-------|---|
| **Beaker** | Glass | 2 | 100ML, 50ML variants |
| **Beaker** | Plastic | 1 | - |
| **Conical Flask** | 100ml, 250ml, 500ml, 1000ml | 9 | Multiple angles per size |
| **Culture Tube** | Sets of 5, 10, 15, 20 | 12 | 3 images each |
| **MC** | Sets of 1, 2, 4, 6 | 12 | 3 images each |
| **Reagent Bottle** | - | 0 | (No images in folder) |
| **RB** | Sets of 1, 2 | 6 | 3 images each |
| **Test Tube** | Sets of 6, 12 | 20 | Multiple size variants |
| **Volumetric Flask** | 100ML, 250ML, 500ML | 3 | 1 image each |

---

## 🛠️ Troubleshooting

### Issue: Admin portal loads but can't see products
**Solution:** MongoDB is not connected
- Check MongoDB is running: `Test-NetConnection -ComputerName localhost -Port 27017`
- Or set up MongoDB Atlas and update `backend/.env` with `MONGO_URI`

### Issue: API returns 503 Service Unavailable
**Solution:** Database not connected
- This is expected behavior - shows clear error message
- Start MongoDB or set up cloud database connection

### Issue: Images show as broken links
**Solution:** Images are at `/uploads/` path
- Verify backend/public/uploads/ contains PNG files
- Restart backend server

---

## 📁 File Structure

```
c:\web\
├── backend/
│   ├── data/products.json         # All 221 products
│   ├── public/uploads/            # All 78 PNG images
│   └── src/server.ts              # Express backend with DB guard
├── frontend/
│   ├── src/app/page.tsx           # Homepage
│   ├── src/app/products/          # Products pages
│   └── src/app/admin-portal-ke/   # Admin pages
└── listing/
    └── online listing or ke/      # Source images (original)
```

---

## 🚀 Quick Start

```bash
# 1. Navigate to project
cd c:\web

# 2. Start MongoDB (if using local)
net start MongoDB

# 3. Start backend (in new terminal)
cd backend && npm start

# 4. Open in browser
http://localhost:5000
```

---

## ✅ Next Steps

1. **Install MongoDB** (Option 1 or 2 above)
2. **Start the backend** with MongoDB connection
3. **Test admin portal** to load and manage products
4. **Upload products** to database via admin interface if needed
5. **Deploy** to Hostinger or cloud platform

---

For issues or questions, check the `server-err.txt` and `server-out.txt` logs in `backend/` folder.
