import {Source} from '../events/Source';

export class InitRest extends Source {
    private _restfulSet: object;

    constructor(router) {
        super();
        this.restfulSet = {
        };
        for (let restful in this.restfulSet) {
            if (this.restfulSet.hasOwnProperty(restful)) {
                new this.restfulSet[restful](router);
            }
        }
        process.nextTick(() => {
            this.hub.send(this, 'restful.ready', {success: null, error: null});
        });
    }

    set restfulSet(restful) {
        this._restfulSet = restful;
    }

    get restfulSet() {
        return this._restfulSet;
    }
}