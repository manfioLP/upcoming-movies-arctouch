import {ManagerMap} from "../interfaces/ManagerMap";
import {Managers} from "./index";
import {Source} from "../events/Source";
import * as Mongoose from "mongoose";

export class Database extends Source {
  private _mongoose: any;
  private _managers: ManagerMap;

  constructor(config) {
    super();
    this.mongoose = Mongoose;
    this.mongoose.Promise = Promise;
    this.managers = Managers;
    this.wiring();
    this.init(config.mongodb);
  }

  private wiring(){
    this.mongoose.connection.on('error', this.mongooseError.bind(this));
  }

  private set mongoose(mongoose){
    this._mongoose = mongoose;
  }

  private get mongoose(){
    return this._mongoose;
  }

  private set managers(managers){
    this._managers = managers;
  }

  private get managers(){
    return this._managers;
  }

  private mongooseError(error, value){
    return console.error('error', error, value);
  }

  async init(config) {
    try {
      await this.mongoose.connect(`mongodb://${config.host}/${config.name}`,
          {useUnifiedTopology: true, useNewUrlParser: true});
      this.hub.send(this, 'database.ready', {success: true, error: false});
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async destroy() {
    try {
      await this.mongoose.connection.close();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

}