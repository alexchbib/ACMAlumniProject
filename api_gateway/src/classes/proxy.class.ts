import axios from "axios";
import {createProxyMiddleware as createHttpProxyMiddleware} from "http-proxy-middleware";
import type { ProxyT } from "../types/proxy.type";
import type { RequestHandler } from "express";


export let proxies: ProxyT[] = []

export class Proxy{
  name: string;
  context: string;
  port: string;
  protocol: string;
  host: string;
    constructor(config: ProxyT) {
      this.name = config.name;
      this.context = config.context;
      this.port = config.port;
      this.protocol = config.protocol;
      this.host = config.host;
      proxies = [...proxies, this];
    }
  
    create():RequestHandler {
      return createHttpProxyMiddleware({
        target: {
          host: this.host,
          port: this.port,
          protocol: this.protocol,
        },
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${this.name}`]: "",
        },
      });
    }
    
  
    get path(): string {
      return `${this.protocol}://${this.host}:${this.port}`;
    }
  
    async test(): Promise<void> {
      try {
        await axios.get(this.path + "/test");
        console.log(`[TEST SUCCESSFUL] ${this.name} api`);
      } catch (error: any) {
        console.log(`[TEST FAILED] ${this.name} api: ${error.message}`);
        process.exit(1);
      }
    }
  }
  