import axios from "axios";

// کلاینت مخصوص سرویس Auth (پروژه‌ی جدا، پورت جدا).
// عمداً interceptor ندارد، تا موقع رفرش توکن حلقه‌ی بی‌نهایت درست نشود.
export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:5100",
  headers: {
    "Content-Type": "application/json",
  },
});
