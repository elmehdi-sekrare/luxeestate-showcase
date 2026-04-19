// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";

// Serve uploaded images from d:/Downloads during dev
function serveDownloads() {
  return {
    name: "serve-downloads",
    configureServer(server: any) {
      server.middlewares.use("/dl-assets", (req: any, res: any, next: any) => {
        const filePath = path.join("d:/Downloads", decodeURIComponent(req.url || ""));
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase();
          const mime: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
          res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [serveDownloads()],
  },
});
