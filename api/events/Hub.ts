import {EventEmitter2} from "eventemitter2";
import {Message} from "./Message";
import * as BBPromise from "bluebird";
import {Source} from "./Source";
import * as path from 'path';

export class Hub {
	eventemitter: EventEmitter2;
	private static instance: Hub;

	private constructor() {
    let config:any = require(path.resolve("config.json"));
    this.eventemitter = new EventEmitter2(config.eventConfig);
	}

	public on(event: string, listener: Function): Hub {
		this.eventemitter.on(event, listener);
		return this;
	}

	public once(event: string, listener: Function): Hub {
		this.eventemitter.once(event, listener);
		return this;
	}

	public un(event: string, listener: Function): Hub {
		this.eventemitter.off(event, listener);
		return this;
	}

	public send(source: Source, event: string, data, previous?: string): Message {
		if (!source || (typeof source !== "object")) {
			throw new Error("To send message through Hub, the source is required " +
				"and must extend Source");
		}

		let msg = new Message(source.id, event, data, previous);
		process.nextTick(() => {
			try {
				this.eventemitter.emit(event, msg);
			} catch (e) {
				console.error("Tentando enviar dados para um HUB Destruido", event, source, e);
			}
		});

		return msg;
	}

	public destroy(): BBPromise<boolean> {
		return new BBPromise<boolean>((resolve) => {
			Hub.instance = null;
			this.eventemitter.removeAllListeners();
			this.eventemitter = null;
			resolve(true);
		});
	}

	public static getInstance(): Hub {
		if (!Hub.instance) {
			Hub.instance = new Hub();
		}

		return Hub.instance;
	}
}