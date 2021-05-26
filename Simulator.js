"use strict";

class Simulator {

    constructor(canvas, log) {

        this.version = "V0.0.1 (2021-05-26)";

        this.canvas = canvas;
        this.log = log;

        this.camera = new Camera(0, 0, 0);
        this.bodyList = [];
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
        let car = new Body(100, 200);
        this.bodyList.push(car);
    }

    async simLoop() {

        const timer = ms => new Promise(res => setTimeout(res, ms));

        while (true) {

            this.draw();
            this.move();
            this.outputLog();

            await timer(1);
        }
    }

    draw() {

        let ctx = this.canvas.getContext("2d");

        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        for (const body of this.bodyList) {
            body.draw(this.camera, this.canvas, this.logMap);
        }
    }

    move() {
        for (const body of this.bodyList) {
            body.move(this.logMap);
        }
    }

    outputLog() {

    }

    keydown(event) {

    }

    keyup(event) {

    }
}