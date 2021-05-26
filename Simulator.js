"use strict";

class Simulator {

    constructor() {

        this.version = "V0.0.1 (2021-05-23)";

        this.c = document.getElementById("simulator");
        this.ctx = this.c.getContext("2d");
        this.logMap = {};

        this.initiate();
        this.buildMap();
        this.simLoop();
    }

    initiate() {
        document.body.addEventListener("keydown", this.keydown.bind(this), false);
        document.body.addEventListener("keyup", this.keyup.bind(this), false);
    }

    buildMap() {

    }

    async simLoop() {

        const timer = ms => new Promise(res => setTimeout(res, ms));

        while (true) {

            await timer(1);
        }
    }

    keydown(event) {

    }

    keyup(event) {

    }
}