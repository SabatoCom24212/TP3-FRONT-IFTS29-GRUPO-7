import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona en GitHub Pages / Netlify / Vercel sin configurar nada
export default defineConfig({ base: "./", plugins: [react()] });
