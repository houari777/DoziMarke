#!/bin/bash
# 📜 scripts/setup.sh

echo "🚀 بدء إعداد منصة dozi market..."

# تثبيت الاعتمادات الأساسية
echo "📦 تثبيت Node.js dependencies..."
npm install

echo "🔧 تثبيت React Native dependencies..."
cd frontend && npm install && cd ..

# إنشاء ملفات البيئة
echo "⚙️ إنشاء ملفات البيئة..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "📁 إنشاء هيكل المجلدات..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p frontend/android/app/src/main/assets

# بناء مشروع Odin 3
echo "⚡ بناء خادم Odin 3..."
cd high-performance
odin build . -out:dozi_performance -o:speed
cd ..

# تثبيت MongoDB
echo "🗄️  التحقق من تثبيت MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB غير مثبت"
    echo "📖 الرجاء تثبيت MongoDB من: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

echo "✅ الإعداد اكتمل!"
echo "📖 لبدء التشغيل:"
echo "1. ابدأ MongoDB: mongod"
echo "2. ابدأ خادم Node.js: cd backend && npm start"
echo "3. ابدأ خادم Odin 3: cd high-performance && ./dozi_performance"
echo "4. ابدأ تطبيق React Native: cd frontend && npm start"