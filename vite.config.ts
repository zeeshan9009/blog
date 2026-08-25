import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function localApiPlugin(): Plugin {
    return {
        name: "local-api-handlers",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url || "";
                if (url.startsWith("/api/spotlight")) {
                    const { default: handler } = await import("./api/spotlight.js");
                    return handler(req, res);
                }
                if (url.startsWith("/api/analytics")) {
                    const { default: handler } = await import("./api/analytics.js");
                    return handler(req, res);
                }
                if (url.startsWith("/api/search")) {
                    const { default: handler } = await import("./api/search.js");
                    return handler(req, res);
                }
                if (
                    url.startsWith("/api/http-headers") ||
                    url.startsWith("/api/ip-lookup") ||
                    url.startsWith("/api/dns-lookup") ||
                    url.startsWith("/api/diagnostics")
                ) {
                    const { default: handler } = await import("./api/diagnostics.js");
                    return handler(req, res);
                }
                next();
            });
        }
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), localApiPlugin()]
});
