
# مرحله اول: آماده‌سازی و Build پروژه
FROM node:20-alpine AS build

WORKDIR /app

# کپی فایل‌های پکیج
COPY package*.json ./

# نصب پکیج‌ها
RUN npm ci

# کپی سورس پروژه
COPY . .

# ساخت نسخه Production
RUN npm run build


# مرحله دوم: اجرای برنامه
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# انتقال فایل‌های موردنیاز از مرحله Build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
