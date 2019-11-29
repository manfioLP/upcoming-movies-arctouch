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
        this.handler =  MovieHandler.getInstace()

        this.routes = {
            get: {
                '/upcoming': this.getUpcoming.bind(this),
                '/details': this.getDetails.bind(this)
            },
            post: {

            }
        };

        this.wiring();
    }

    async getUpcoming(req, res) {
        const page = req.query.hasOwnProperty('page') ? Number(req.query.page) : 1;

        if (page < 1 || isNaN(page)) {
            return res.status(HTTPStatus.BAD_REQUEST).send({success: false, error: 'invalid page query value - it must be a number greater than zero!'})
        }

        const response = await this.handler.getUpcomingMovies(page)

        res
            .status(response.status)
            .send(response)
    }

    async getDetails(req, res) {
        if (!req.query.hasOwnProperty('movieId'))
            return res.status(HTTPStatus.BAD_REQUEST).send({success: false, error: 'missing parameters - movieId is missing on query\'s request'})
        if (!Number(req.query.movieId))
            return res.status(HTTPStatus.BAD_REQUEST).send({success: false, error: 'invalid parameters - movieId format - it should only contain numbers!'})
        const movieId = req.query.movieId

        const response = await this.handler.getMovieDetails(movieId)

        res
            .status(response.status)
            .send(response)
    }


}