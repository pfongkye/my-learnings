import { createRequestHandler } from "@remix-run/express";
import express from "express";

// notice that the result of `remix build` is "just a module"
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

app.all("*", createRequestHandler({build}))

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}.`)
})