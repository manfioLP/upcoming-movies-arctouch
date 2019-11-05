import {Source} from "../events/Source"
import * as BBPromise from "bluebird";
import * as HTTPStatus from "http-status-codes";
import {MessageData} from "../interfaces/MessageData";

export class BasicHandler extends Source {

    protected sendToServer(event, dado): BBPromise<any> {
        return this.hub.send(this, event, {success: dado, error: null,}).promise;
    }

    async handleReturn(success: boolean, data, status?: number): Promise<MessageData> {
        let returnObject
        if (!success || data.error) {
            returnObject = await this.getError(data)
            returnObject['success'] = success
        } else {
            returnObject = {
                success: true,
                data
            };
        }
        if (status)
            returnObject['status'] = status

        return returnObject
    }

    async getError(error) {
        // TODO: handle error
        if (error.status_code) {
            return BasicHandler.getExternalError(error)
        }
        if (typeof error === 'string') {
            error = { error }
        }
        return error
    }

    static getExternalError(error) {
        switch (error.status_code) {
            case 7:
                return {error: 'external api problem - invalid tmdb key', status: HTTPStatus.UNAUTHORIZED}
            default:
                return {error: `external api problem - error code#${error.status_code} not tracked yet`, status: HTTPStatus.BAD_REQUEST}
        }
    }

}