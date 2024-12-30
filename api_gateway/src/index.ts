// Gateway

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Proxy, proxies } from "./classes/proxy.class";
import { promises as fs } from "fs";
import type { ProxyT } from "./types/proxy.type";

const activeProxies: Proxy[] = [];
const app = express();
const proxiesRequestHandlers = new Map();

async function main() {
  await readJsonFile<ProxyT>("./proxies.json");

  for (let i = 0; i < activeProxies.length; i++) {
    await activeProxies[i].test();
    if (i === activeProxies.length - 1) {
      activeProxies.forEach((proxy) => {
        proxiesRequestHandlers.set(proxy.name, proxy.create());
      });
      // Build routes after testing all proxies
      buildRoutes();
    }
  }
}

async function readJsonFile<T extends ProxyT>(filePath: string): Promise<void> {
  try {
    let response = await fs.readFile(filePath, "utf-8");
    let data = JSON.parse(response) as T[];
    for (const d of data) {
      activeProxies.push(new Proxy(d));
    }
  } catch (error: any) {
    console.error("Error reading or parsing file:", error);
    throw error;
  }
}

function buildRoutes() {
  // establishing rate limit ~ 15 requests / 30 seconds
  const limiter = rateLimit({
    windowMs: 30 * 1000,
    max: 15,
    message: `Too many requests. Try again later`,
  });

  // middlewares

  // using app.use(express.json() or express.urlencoded())
  // BREAKS the app: https://github.com/chimurai/http-proxy-middleware/issues/417
  app.use(cors());
  app.use(limiter);

  // dynamically generated routes
  for (const proxy of proxies) {
    app.use(proxy.context, customExpressRequestHandler(proxy.name));
    console.log(
      `[ROUTE SETUP] Proxy: ${proxy.context}/** -> ${proxy.protocol}://${proxy.host}:${proxy.port}`
    );
  }
  const GATEWAY_PORT = process.env.GATEWAY_PORT || 5000;

  app.listen(GATEWAY_PORT, () => {
    console.log(
      `[GATEWAY LISTENING] Gateway is listening on port ${GATEWAY_PORT}`
    );
  });
}

function customExpressRequestHandler(name: string) {
  // when proxy is not set in the activeProxies array, return the error message
  return (
    proxiesRequestHandlers.get(name) ||
    ((_req: Request, res: Response) => res.send("Resource not available."))
  );
}

main();
