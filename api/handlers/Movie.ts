import {BasicHandler} from "./Basic";
import * as path from 'path';
import * as HTTPStatus from 'http-status-codes';
import {MessageData} from "../interfaces/MessageData";
import {Genre} from "../interfaces/Genre"

const request = require('request-promise')

export class MovieHandler extends BasicHandler {

    private tmdb
    private readonly globalOptions
    private static _instance: MovieHandler;
    private currentGenres: Genre[]

    private constructor() {
        super()
        this.tmdb = require(path.resolve('config.json')).tmdb
        this.globalOptions = {
            method: 'GET',
            url: this.tmdb.base_url,
            qs: {language: this.tmdb.language, api_key: this.tmdb.api_key},
            body: '{}'
        }
        this.getMovieGenres()
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
            const movies = JSON.parse(requestResponse).results
            return this.handleReturn(true, this.populateGenres(movies), HTTPStatus.OK)
        } catch (requestError) {
            console.error(requestError)
            const error = JSON.parse(requestError.error ? requestError.error : requestError)
            return this.handleReturn(false, error)
        }
    }

    populateGenres(movies) {
        const populated_array = []
        movies.forEach(element => {
            populated_array.push({
                ...element,
                genres: this.setGenres(element)
                })
            });
        return populated_array
    }

    setGenres(element) {
        const arr = []
        this.currentGenres.forEach(el => {
            for (let genreId of element.genre_ids) {
                if (genreId == el.id)
                    arr.push(el.name)
            }
        })
        return arr
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
    
    async getMovieGenres(): Promise<MessageData> {
        const options = {
            ...this.globalOptions
        }
        options.url += `/genre/movie/list`
        try {
            const requestResponse = await request(options, this.callback)
            this.currentGenres = JSON.parse(requestResponse).genres
            console.log(JSON.parse(requestResponse));
            return this.handleReturn(true, JSON.parse(requestResponse), HTTPStatus.OK)
        } catch (requestError) {
            const error = JSON.parse(requestError.error)
            return this.handleReturn(false, error)
        }
    }
}
