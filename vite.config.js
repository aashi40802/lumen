import { defineConfig } from "vite";

// Several files use a `.js` extension while containing JSX (App.js, pages,
// contexts) to match the assignment's required structure. We configure
// esbuild to treat every .js/.jsx file under src/ with the JSX loader, so the
// classic React runtime (each file imports React) compiles in dev and build.
export default defineConfig({
  // "/" for local dev and Netlify/Vercel (root domain); the GitHub Pages
  // workflow sets DEPLOY_BASE="/lumen/" so assets resolve under the repo path.
  base: process.env.DEPLOY_BASE || "/",
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.(js|jsx)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: { loader: { ".js": "jsx" } },
  },
  build: { outDir: "dist", sourcemap: false },
});
