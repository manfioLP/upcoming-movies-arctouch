import * as Express from "express";
import * as HTTP from "http";
import * as CORS from "cors";
import * as BodyParser from "body-parser";
import {Router} from "express";
import {MovieRest} from "./rests/Movie"

export class Application {
  private _mainPort: any;
  private _server: any;
  private _router: any;
  private static _config: any;
  private _app: any;

  private restfulSet = {
    MovieRest,
  }

  constructor(pathConfig) {
    Application.config = pathConfig;
    this.app = Express;
    this.server = this.initServer();
    this.serverConfiguration();
    this.router = Router;
    this.serverOk()
    this.initRest()
  }

  private set mainPort(port) {
    this._mainPort = port;
  }

  private get mainPort() {
    return this._mainPort;
  }

  private set server(server) {
    this._server = server;
  }

  private get server() {
    return this._server;
  }

  private set router(router) {
    this._router = new router();
  }

  private get router() {
    return this._router;
  }

  private static set config(pathConfig) {
    Application._config = require(pathConfig);
  }

  private static get config() {
    return Application._config;
  }

  private set app(express) {
    this._app = express();
  }

  private get app() {
    return this._app;
  }


  /**
   * É executada assim que o server fica pronto para atender.
   */
  private serverOk() {
    this.app.use('/api', this.router);
    console.log(`APP READY. LISTENING ON PORT::${Application.config.server.port}`);
  }

  /**
   * Inicia as configurações do server.
   */
  private serverConfiguration() {
    this.app.set('view engine', 'ejs');
    this.app.use(CORS());
    this.app.use(BodyParser.urlencoded({extended: true}));
    this.app.use(BodyParser.json());
  }

  /**
   *
   * @returns {any}
   *
   * Inicia o server, se no config estiver que é um https, ele inicia com chave.
   * Caso contrario, ele inicia apenas em http.
   */
  private initServer() {
      this.mainPort = Application.config.server.port;
      return HTTP.createServer(this.app).listen(this.mainPort);
  }

  private initRest() {
    for (let rest in this.restfulSet) {
      if (this.restfulSet.hasOwnProperty(rest)) {
        new this.restfulSet[rest](this.router);
      }
    }
  }

}