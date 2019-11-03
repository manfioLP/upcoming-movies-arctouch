import {Hub} from "./Hub";
import {v4} from "node-uuid";

export class Source {
  _id: string;
  _hub: Hub;

  constructor() {
    this.id = v4();
    this.hub = Hub.getInstance();
  }

  set id(uuid) {
    this._id = uuid;
  }

  get id() {
    return this._id;
  }

  set hub(hub) {
    this._hub = hub;
  }

  get hub() {
    return this._hub;
  }

  destroy() {
    this.hub.send(this, "hub.core.source.destroyed", {
      error: null,
      success: this.id,
    });
    this.id = null;
  }
}