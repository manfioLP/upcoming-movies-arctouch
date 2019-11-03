import * as path from 'path';
import {TestManager} from './TestManager';

const chai: any = require('chai');
const chaiHTTP = require('chai-http');
const config = require(path.resolve('devConfig.json'));

chai.use(chaiHTTP);
let expect = chai.expect;
let testManager = null;
const baseURL = `http://localhost:${config.server.port}`;

describe('API', () => {

    before((done) => {
        testManager = new TestManager(done);
    });

    describe("Livros", () => {
        it("", (done) => {
            done();
        })
    })

});