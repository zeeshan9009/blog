import type { IncomingMessage, ServerResponse } from "node:http";
import handler from "./index.js";

export default function dynamicRouteHandler(req: IncomingMessage, res: ServerResponse) {
  // Extract profileId from URL path if not already in req.query
  const reqAny = req as any;
  if (!reqAny.query?.profileId) {
    const parts = (req.url || "").split("?")[0].split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== "analytics" && lastPart !== "[profileId]") {
      reqAny.query = { ...(reqAny.query || {}), profileId: lastPart };
    }
  }
  return handler(req, res);
}
