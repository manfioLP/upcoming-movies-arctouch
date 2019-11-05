import { BasicRest } from "./Basic";
import { MovieHandler } from "../handlers/Movie";
import * as HTTPStatus from 'http-status-codes';

export class MovieRest extends BasicRest {

    protected _handler: MovieHandler
    get handler() {
        return this._handler
    }

    set handler(handler: MovieHandler) {
        this._handler = handler
    }

    constructor(router) {
        super(router);
        this.handler = new MovieHandler()

        this.routes = {
            get: {
                '/upcoming': this.getUpcoming.bind(this),
                'details/:movieId': this.getDetails.bind(this)
            },
            post: {

            }
        };

        this.wiring();
    }

    async getUpcoming(req, res) {
        const page = req.query.hasOwnProperty('page') ? req.query.page : 1;

        const response = await this.handler.getUpcomingMovies(Number(page))

        res
            .status(response.status)
            .send(response)
    }

    async getDetails(req, res) {
        if (!req.query.hasOwnProperty('movieId'))
            return res.status(HTTPStatus.BAD_REQUEST).send({success: false, error: {type: 'missing parameters', msg: 'missing movieId on query\'s request'}})
        const movieId = req.query.movieId

        const response = await this.handler.getMovieDetails(movieId)

        res
            .status(response.status)
            .send(response.data)
    }


}