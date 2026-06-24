import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadFrontendEnv() {
  const envPath = path.join(repoRoot, ".env", "frontend.env");
  if (!fs.existsSync(envPath)) {
    return {};
  }
  const vars = {};
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const frontendEnv = loadFrontendEnv();
const apiUrl = frontendEnv.VITE_API_URL || process.env.VITE_API_URL || "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
  },
  server: {
    port: 5173,
  },
});
