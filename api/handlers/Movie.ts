import {BasicHandler} from "./Basic";
import * as path from 'path';
import * as HTTPStatus from 'http-status-codes';
import {MessageData} from "../interfaces/MessageData";

const request = require('request-promise')

export class MovieHandler extends BasicHandler {

    private tmdb
    private readonly globalOptions
    private static _instance: MovieHandler;

    private constructor() {
        super()
        this.tmdb = require(path.resolve('config.json')).tmdb
        this.globalOptions = {
            method: 'GET',
            url: this.tmdb.base_url,
            qs: {language: this.tmdb.language, api_key: this.tmdb.api_key},
            body: '{}'
        }
    }

    static getInstace() {
        if (this._instance)
            return this._instance
        else
            return new MovieHandler()
    }

    private callback(err, res, body) {
        if (err)
            throw new Error(err)
        if (!body.success)
            return {success: body.success, err: body.status_message}
        return {success: true, data: res, body}
    }

    async getUpcomingMovies(page: number): Promise<MessageData> {
        const options = {
            ...this.globalOptions
        }
        options.qs['page'] = page
        options.url += '/movie/upcoming'

        try {
            const requestResponse = await request(options, this.callback)
            return this.handleReturn(true, JSON.parse(requestResponse), HTTPStatus.OK)
        } catch (requestError) {
            const error = JSON.parse(requestError.error)
            return this.handleReturn(false, error)
        }
    }

    async getMovieDetails(movieId: string): Promise<MessageData> {
        const options = {
            ...this.globalOptions
        }
        options.url += `/movie/${movieId}`
        try {
            const requestResponse = await request(options, this.callback)
            return this.handleReturn(true, JSON.parse(requestResponse), HTTPStatus.OK)
        } catch (requestError) {
            const error = JSON.parse(requestError.error)
            return this.handleReturn(false, error)
        }
    }
}