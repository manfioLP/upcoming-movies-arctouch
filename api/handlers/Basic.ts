import {Source} from "../events/Source"
import * as BBPromise from "bluebird";

export class BasicHandler extends Source {

    protected sendToServer(event, dado): BBPromise<any> {
        return this.hub.send(this, event, {success: dado, error: null,}).promise;
    }

    async handleReturn(success: boolean, data) {
        if (!success || data.error) {
            return {
                success: false,
                data: await this.getError(data),
            };
        }
        return {
            success: true,
            data: data.success
        };
    }

    async getError(error) {
        // TODO: handle error
        return error
    }

}