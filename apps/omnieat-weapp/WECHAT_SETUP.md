# WeChat Mini Program Development Setup

## ✅ Fixed Issues

1. **TabBar Icon Format**: Converted all SVG icons to PNG format (WeChat only supports PNG/JPG)
2. **CORS Configuration**: Updated backend to allow all origins in development mode for WeChat Mini Program
3. **Environment Setup**: Created `.env` file for backend with proper configuration

## 🚀 How to Run

### Option 1: Use the Automated Script (Recommended)

Simply double-click **`start-weapp.bat`** and it will:
1. Convert SVG icons to PNG
2. Build the WeChat Mini Program
3. Sync the database
4. Copy PNG icons to dist folder
5. Start the backend API server

### Option 2: Manual Steps

```bash
# 1. Convert icons to PNG
node convert-icons.js

# 2. Build WeChat Mini Program
npm run build:weapp

# 3. Copy PNG icons to dist
xcopy /Y /I src\assets\icons\*.png dist\assets\icons\

# 4. Sync database
cd backend
npx prisma db push

# 5. Start backend server
npm run dev
```

## 📱 WeChat DevTools Setup

1. **Open WeChat DevTools**
2. **Import Project**: Select the `dist/` folder
3. **Settings** (Important!):
   - Go to **Details** → **Local Settings**
   - ✅ Enable **"Don't check valid domain names"**
   - ✅ Set **Base Lib Version** to latest stable (not canary if having issues)
4. **Compile** the project in DevTools

## 🔧 Troubleshooting

### Blank Screen / Timeout Error

**Symptoms**: App shows blank screen with "Error: timeout" in console

**Solutions**:
1. **Check if backend is running**: 
   - Look for "Backend API" terminal window
   - Or visit http://localhost:3000/api/categories in browser
   
2. **Restart backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Check WeChat DevTools settings**:
   - Make sure "Don't check valid domain names" is enabled
   - Try changing base lib version in Settings

4. **Clear cache**:
   - In WeChat DevTools: **Tools** → **Clear Cache** → **Clear All**
   - Then recompile

### CORS Errors

If you see CORS errors, make sure:
- Backend `.env` file exists with `ALLOWED_ORIGINS="*"`
- Backend server is restarted after changing `.env`

### Database Errors

If database operations fail:
```bash
cd backend
npx prisma db push --force-reset
```

## 📝 API Endpoints

Your local backend provides these endpoints:
- `GET /api/categories` - Get all categories
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes?categoryId=X` - Get recipes by category
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

All endpoints are accessible at `http://localhost:3000`

## 🎯 Next Steps

1. Run `start-weapp.bat`
2. Open WeChat DevTools and import `dist/` folder
3. Enable "Don't check valid domain names"
4. Compile and test!

The app should now load properly with data from your local backend! 🎉
