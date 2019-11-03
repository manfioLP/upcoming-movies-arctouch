import {Source} from "../events/Source";
import {Types, Model} from "mongoose";

export abstract class BasicManager extends Source {
  constructor() {
    super();
    this.wiring();
  }

  protected objectIdGenerator(id?:string): Types.ObjectId{
    return id ? new Types.ObjectId(id) : new Types.ObjectId();
  }

  // CREATE

  protected handleCreate(msg) {
    if (msg.source_id === this.id) return;
    this.create(msg.data.success).then((ret) => {
      this.answer(msg.id, "create", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "create", null, error);
    });
  }

  protected afterCreate(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].toJSON();
    }
    return data;
  }

  protected async create(data) {
    data = this.beforeCreate(data);
    let ret: any = await this.model.create(data);
    return this.afterCreate(Array.isArray(ret) ? ret : [ret]);
  }

  protected beforeCreate(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; ++i) {
        data[i]._id = data[i]._id ? this.objectIdGenerator(data[i]._id) : this.objectIdGenerator();
        data[i].id = data[i]._id.toString();
      }
    } else {
      data._id = data._id ? this.objectIdGenerator(data._id) : this.objectIdGenerator();
      data.id = data._id.toString();
    }
    return data;
  }

  // END CREATE

  // READ

  protected beforeRead(data) {
    return data;
  }

  protected afterRead(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; ++i) {
        delete data[i]._id;
      }
    } else if(data && typeof data === 'object'){
      delete data._id;
    }
    return data;
  }

  protected async read(data) {
    data = this.beforeRead(data);
    let result: any;
    let find: any;
    if (data.id) {
      find = this.model.findById(data.id);
    } else if(data.findOne){
      find = this.model.findOne(data.query);
    }else if(data.query){
      find = this.model.find(data.query);
    }
    find.select(data.select);
    if (data.populate) find.populate(data.populate);
    if (data.limit) find.limit(data.limit);
    if (data.skip) find.skip(data.skip);
    if (data.sort) find.sort(data.sort).collation(data.collation);
    result = await find.lean().exec();
    return this.afterRead(result);
  }

  protected handleRead(msg) {
    if (msg.source_id === this.id) return;
    this.read(msg.data.success).then((ret) => {
      this.answer(msg.id, "read", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "read", null, error);
    });
  }

  // END READ

  // UPDATE

  protected beforeUpdate(data) {
    return data;
  }

  protected afterUpdate(data) {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; ++i) {
        delete data[i]._id;
      }
    } else {
      delete data._id;
    }
    return data;
  }

  protected async update(data) {
    data = this.beforeUpdate(data);
    let update = null;
    if (data.id) {
      update = this.model.findByIdAndUpdate(data.id, data.update, data.options);
    } else {
      update = this.model.update(data.query, data.update, data.options);
    }
    if (data.populate) update.populate(data.populate);
    let result = await update.lean().exec();
    return this.afterUpdate(result);
  }

  protected async handleUpdate(msg) {
    if (msg.source_id === this.id) return;
    this.update(msg.data.success).then((ret) => {
      this.answer(msg.id, "update", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "update", null, error);
    });
  }

  // END UPDATE

  // DELETE

  beforeDelete(data) {
    return data;
  }

  afterDelete(result) {
    return result;
  }

  async delete(data) {
    data = this.beforeDelete(data);
    let del = null;
    if (data.id) {
      del = this.model.findByIdAndRemove(data.id);
    } else {
      del = this.model.remove(data.query);
    }
    let result = await del.exec();
    return this.afterDelete(result);
  }

  handleDelete(msg) {
    if (msg.source_id === this.id) return;
    this.delete(msg.data.success).then((ret) => {
      this.answer(msg.id, "delete", ret, null);
    }).catch((error) => {
      this.answer(msg.id, "delete", null, error);
    });
  }

  // END DELETE

  // COUNT
  async count(data): Promise<number> {
    let count = null;
    if (data.id) {
      count = this.model.count({_id: data.id});
    } else {
      count = this.model.count(data.query);
    }
    return await count.exec();
  }

  async handleCount(msg): Promise<void> {
    if (msg.source_id === this.id) return;
    this.count(msg.data.success)
      .then((ret) => {
        this.answer(msg.id, "count", ret, null);
      })
      .catch((error) => {
        this.answer(msg.id, "count", null, error);
      })
  }

  // END COUNT
  
  // AGGREGATE

  async aggregate(data) {
    return await this.model.aggregate(data).cursor({}).exec().toArray();
  }

  handleAggregate(msg) {
    if (msg.source_id === this.id) return;
    this.aggregate(msg.data.success)
      .then(ret => {
        this.answer(msg.id, 'aggregate', ret, null);
      })
      .catch(err => {
        this.answer(msg.id, 'aggregate', null, err);
      })
  }

  // END AGGREGATE

  answer(messageId, event, success, error) {
    let data = {
      success: success,
      error: error
    };
    this.hub.send(this, "db." + this.eventSource + "." + event, data, messageId);
  }

  wiring() {
    this.hub.on("db." + this.eventSource + ".create", this.handleCreate.bind(this));
    this.hub.on("db." + this.eventSource + ".read", this.handleRead.bind(this));
    this.hub.on("db." + this.eventSource + ".update", this.handleUpdate.bind(this));
    this.hub.on("db." + this.eventSource + ".delete", this.handleDelete.bind(this));
    this.hub.on("db." + this.eventSource + ".count", this.handleCount.bind(this));
    this.hub.on("db." + this.eventSource + ".aggregate", this.handleAggregate.bind(this));
    this.wireCustomListeners();
  }

  abstract wireCustomListeners();

  abstract get model(): Model<any>;

  abstract get eventSource(): string;
}