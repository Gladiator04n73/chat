# Используем официальный Node.js образ для сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install -g npm@10.8.2

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Используем легковесный образ для запуска
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Копируем зависимости из builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
