import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      entry: "server",
      // إجبار Nitro على البناء المتوافق مع خوادم Vercel
      preset: "vercel" 
    },
  },
});
