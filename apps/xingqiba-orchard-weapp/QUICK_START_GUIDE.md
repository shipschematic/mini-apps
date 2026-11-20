# Quick Start Guide - Xingqiba Orchard Mini Program

## 🚀 Get Started in 3 Steps

### Step 1: Database Setup (Most Important!)

**Your admin system won't work until you complete this step!**

1. **Login to CloudBase Console**:
   - Go to: https://console.cloud.tencent.com/tcb
   - Select environment: `cloud1-d4gc2e7w9638ce590`

2. **Create Required Collections** (Click "New Collection" for each):
   - `admins` - Administrator accounts
   - `products` - Product information
   - `stores` - Store locations
   - `orders` - Customer orders (can be empty initially)

3. **Add Sample Data** (Copy-paste into collections):

**Admin Account** (admins collection):
```json
{
  "_id": "admin_001",
  "username": "admin", 
  "password": "REMOVED_DEFAULT_PASSWORD",
  "name": "Administrator",
  "role": "admin",
  "createdAt": "2026-04-30T00:00:00Z"
}
```

**Sample Products** (products collection) - See `setup-sample-data.js` for full list

**Store Information** (stores collection) - See `setup-sample-data.js` for details

4. **Set Permissions**: For each collection, set to "All users can read, creator can write"

### Step 2: Test Admin Access

**Mobile Access (Recommended for daily use)**:
- Open WeChat
- Search for "星七爸果园" mini program
- Go to "My" page
- Click "Admin Login"
- Use: **Username: admin, Password: REMOVED_DEFAULT_PASSWORD**

**PC Access (For development)**:
- Download WeChat Developer Tools
- Open project folder
- Preview and test admin features

### Step 3: Build and Deploy

```bash
# Development build
npm run dev:weapp

# Production build
npm run build:weapp

# Deploy to WeChat platform
# Upload the generated code in dist/ folder
```

## 🎯 Key Features Overview

### For Customers:
- Browse products and services
- Make reservations and purchases
- View order history
- Contact support

### For Administrators:
- Product management (add/edit/delete)
- Order management
- Store information management
- Sales analytics

## ⚡ Quick Troubleshooting

### Problem: Admin login doesn't work
**Solution**: Database collections not created. Complete Step 1 above.

### Problem: Admin pages show blank
**Solution**: Products or stores collections are empty. Add sample data.

### Problem: Build errors
**Solution**: Check that all dependencies are installed with `npm install`

## 📞 Support Resources

- **CloudBase Setup**: `CLOUDBASE_SETUP_GUIDE.md`
- **Admin Features**: `ADMIN_GUIDE.md`
- **Production Deployment**: `PRODUCTION_CHECKLIST.md`
- **Database Structure**: `DATABASE_DEPENDENCIES.md`

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev:weapp

# Run tests
npm test

# Type checking
npm run typecheck

# Lint code
npm run lint
```

## 🎉 You're Ready!

Once you complete the database setup in Step 1, your mini program will be fully functional with admin capabilities ready to use!