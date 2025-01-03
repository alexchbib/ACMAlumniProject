import axios from "axios";
import pkg from "http-proxy-middleware";
const {createProxyMiddleware: createHttpProxyMiddleware } = pkg;
const {get} = axios;

export let proxies = []
export class Proxy {
    /**
     *
     * @param {string} name
     * @param {string} context
     * @param {number} port
     * @param {string} protocol
     */
    constructor(name, context, port, host="localhost", protocol = "http") {
      this.name = name;
      this.context = context;
      this.port = port;
      this.protocol = protocol;
      this.host = host;
      proxies = [...proxies, this];
    }
  
    /**
     *
     * @returns RequestHandler
     */
    create() {
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
    
  
    /**
     * @returns string
     */
    get path() {
      return `${this.protocol}://${this.host}:${this.port}`;
    }
  
    /**
     * @returns Promise<void>
     */
    async test() {
      try {
        await get(this.path + "/test");
        console.log(`[TEST SUCCESSFUL] ${this.name} api`);
      } catch (error) {
        console.log(`[TEST FAILED] ${this.name} api: ${error.message}`);
        process.exit(1);
      }
    }
  }
  