import {Application} from "./Application";
import * as path from "path";

let config = null;
config = path.resolve("config.json");
new Application(config);