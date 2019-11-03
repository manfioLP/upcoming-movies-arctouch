import * as Express from "express";
import * as Path from "path";
import * as HTTP from "http";
import * as CORS from "cors";
import * as BodyParser from "body-parser";
import {InitRest} from "./rests";
import {Source} from "./events/Source";
import {Database} from "./db/Database";
import {Router} from "express";

export class Application extends Source {
  private _mainPort: any;
  private _dataBase: any;
  private _server: any;
  private _router: any;
  private static _config: any;
  private _app: any;

  constructor(pathConfig) {
    super();
    Application.config = pathConfig;
    this.app = Express;
    this.server = this.initServer();
    this.serverConfiguration();
    this.router = Router;
    this.server.listen(this.mainPort, this.initDataBase.bind(this));
  }

  private set mainPort(port) {
    this._mainPort = port;
  }

  private get mainPort() {
    return this._mainPort;
  }

  private set dataBase(dataBase) {
    this._dataBase = new dataBase(Application.config.db);
  }

  private get dataBase() {
    return this._dataBase;
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


  private wiring() {
    this.hub.on('error.**', this.initError.bind(this));
    this.hub.on('database.ready', this.dataBaseReady.bind(this));
    this.hub.on('restful.ready', this.serverOk.bind(this));
  }

  private initError(error) {
    return console.error(`Something is wrong ${error}`);
  }

  private serverOk() {
    this.app.use('/api', this.router);
    this.hub.send(this, 'app.ready', {success: null, error: null});
    console.log(`APP READY. LISTENING ON PORT::${Application.config.server.port}`);
  }

  private initDataBase() {
    this.wiring();
    this.dataBase = Database;
  }

  private dataBaseReady() {
    new InitRest(this.router);
  }

  private serverConfiguration() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', Path.resolve(__dirname + '/views'));
    this.app.use(CORS());
    this.app.use(BodyParser.urlencoded({extended: true}));
    this.app.use(BodyParser.json());
  }

  private initServer() {
      this.mainPort = Application.config.server.port;
      return HTTP.createServer(this.app);
  }

  public async destroy() {
    return await this.dataBase.destroy();
  }

}