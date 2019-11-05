import {BasicHandler} from "./Basic";
import * as path from 'path';
import * as HTTPStatus from 'http-status-codes';
import {MessageData} from "../interfaces/MessageData";
const request = require('request-promise')

export class MovieHandler extends BasicHandler {

    async getUpcomingMovies(page: number): Promise<MessageData> {

        if (page < 1 || typeof page != 'number') {
            return this.handleReturn(false, 'invalid page query value - it must be a number greater than zero!', HTTPStatus.BAD_REQUEST)
        }
        const tmdb = require(path.resolve('config.json')).tmdb
        const options = {
            method: 'GET',
            url: tmdb.base_url,
            qs: {page, language: tmdb.language, api_key: tmdb.api_key},
            body: '{}'
        }

        function callback(err, res, body) {
            if (err)
                throw new Error(err)
            if (!body.success)
                return {success: body.success, err: body.status_message}
            return {success: true, data: res, body}
        }

        try {
            const requestResponse = await request(options, callback)
            return this.handleReturn(true, JSON.parse(requestResponse), HTTPStatus.OK)
        } catch (requestError) {
            const error = JSON.parse(requestError.error)
            return this.handleReturn(false, error)
        }
    }

    async getMovieDetails(movieId: string) {
        return {status: 501, data: 'not implemented'}
    }
}