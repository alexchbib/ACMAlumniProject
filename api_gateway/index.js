// Gateway

// imports
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { Proxy,proxies } from "./classes/Proxy";

dotenv.config({path:"./.env"});
const app = express();

// creating proxies

// THESE ARE TEST PROXIES. 
// TODO: REPLACE WITH ACTUAL PROXIES (Auth, ScraperBackend, Notification etc.)
const userApi = new Proxy("users", "/api/users/**", process.env.USER_PORT, process.env.USER_HOST);
const todoApi = new Proxy("todos", "/api/todos/**", process.env.TODO_PORT, process.env.TODO_HOST);

// testing proxies
const activeProxies = [userApi, todoApi];
let testedProxies = 0;
const proxiesRequestHandlers = new Map();

for (const activeProxy of activeProxies) {
  (async () => {
    await activeProxy.test();
    testedProxies++;
    if (activeProxies.length === testedProxies) {
      /**
       * example:
       * "users" -> userProxy (userApi.create)
       * "todos" -> todoProxy (todoApi.create)
       */
      activeProxies.forEach((proxy) => {
        proxiesRequestHandlers.set(proxy.name, proxy.create());
      });


      // all the code goes here. Reason: Do not build proxy before it is tested

      // establishing rate limit ~ 15 requests / 30 seconds
      const limiter = rateLimit({
        windowMs: 30 * 1000,
        max: 15,
        message: `Too many requests. Try again later`,
      });

      // middlewares

      // using app.use(express.json() or express.urlencoded()) BREAKS the app: https://github.com/chimurai/http-proxy-middleware/issues/417
      app.use(cors());
      app.use(limiter);

      // dynamically generated routes
      for (const proxy of proxies) {
        app.use(
          `/api/${proxy.name}/**`,
          customExpressRequestHandler(proxy.name)
        );
      }
      const GATEWAY_PORT = process.env.GATEWAY_PORT || 5000;
      app.listen(GATEWAY_PORT, () => {
        console.log(
          `[GATEWAY LISTENING] Gateway is listening on port ${GATEWAY_PORT}`
        );
      });
    }
  })();
}

function proxyErrorHandler(_req, res) {
  res.send(
    "The accessed resource is not available right now. Please try again later"
  );
}

/**
 *
 * @param {string} name
 */
function customExpressRequestHandler(name) {
  // when proxy is not set in the proxiesToTest array, return the proxyErrorHandler error message (refer to proxyErrorHandler function)
  return proxiesRequestHandlers.get(name) || proxyErrorHandler;
}