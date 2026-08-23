import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function localApiPlugin(): Plugin {
    return {
        name: "local-api-handlers",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url || "";
                if (url.startsWith("/api/http-headers")) {
                    const { default: handler } = await import("./api/http-headers");
                    return handler(req, res);
                }
                if (url.startsWith("/api/ip-lookup")) {
                    const { default: handler } = await import("./api/ip-lookup");
                    return handler(req, res);
                }
                if (url.startsWith("/api/dns-lookup")) {
                    const { default: handler } = await import("./api/dns-lookup");
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
