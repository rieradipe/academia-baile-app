#!/bin/bash

echo ""
echo "📦 Arrancando backend..."
cd backend
npm install
npm start &

echo ""
echo "💻 Arrancando frontend..."
cd ../frontend
npm install
npm run dev &

echo ""
echo "✅ Aplicación iniciada"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"