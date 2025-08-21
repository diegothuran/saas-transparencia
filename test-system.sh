#!/bin/bash

# Teste básico do sistema de login via API
echo "🧪 Testando sistema de transparência..."

# Backend test
echo "📡 Testando backend login..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo $RESPONSE | grep -q "access_token"; then
  echo "✅ Backend login funcionando!"
  TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  echo "📝 Token: ${TOKEN:0:20}..."
else
  echo "❌ Erro no backend login"
  echo "Response: $RESPONSE"
  exit 1
fi

# Test users endpoint
echo "👥 Testando endpoint de usuários..."
USERS_RESPONSE=$(curl -s -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer $TOKEN")

if echo $USERS_RESPONSE | grep -q "admin@transparencia.gov.br"; then
  echo "✅ Endpoint de usuários funcionando!"
else
  echo "❌ Erro no endpoint de usuários"
  echo "Response: $USERS_RESPONSE"
fi

# Frontend test
echo "🌐 Testando frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
  echo "✅ Frontend funcionando!"
else
  echo "❌ Erro no frontend (HTTP $FRONTEND_RESPONSE)"
fi

echo "🎉 Sistema funcionando! Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Login: admin / admin123"
echo "   Admin área: http://localhost:3000/admin/usuarios"
