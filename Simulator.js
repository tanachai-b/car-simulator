"use strict";

class Simulator {

    constructor(canvas, log) {

        this.version = "V0.0.1 (2021-05-26)";

        this.canvas = canvas;
        this.log = log;

        this.camera = new Camera(0, 0, 0);
        this.bodyList = [];
        this.logMap = {};

        this.front;
        this.back;
        this.chassie;
        this.frontLeftWheel;
        this.frontRightWheel;
        this.backLeftWheel;
        this.backRightWheel;

        this.pressedKeys = {};

        this.steering = 0;
        this.throttle = 0;

        this.initiate();
        this.buildMap();
        this.simLoop();
    }

    initiate() {
        document.body.addEventListener("keydown", this.keydown.bind(this), false);
        document.body.addEventListener("keyup", this.keyup.bind(this), false);
    }

    buildMap() {

        for (let x = -2500; x <= 2500; x += 250) {
            for (let y = -2500; y <= 2500; y += 250) {
                this.bodyList.push(new Body(10, 0, x, y, "line"));
                this.bodyList.push(new Body(0, 10, x, y, "line"));
            }
        }

        this.bodyList.push(new Body(250, 100, 100, -200));
        this.bodyList.push(new Body(250, 100, 700, -200));

        this.bodyList.push(new Body(100, 250, 250, 300));
        this.bodyList.push(new Body(100, 250, 500, 300));

        let chassie = new Body(250, 100);
        this.bodyList.push(chassie);

        let front = new Body(10, 10);
        // this.bodyList.push(front);

        let back = new Body(10, 10);
        // this.bodyList.push(back);
        back.position.x = -1;

        let frontLeftWheel = new Body(40, 15)
        this.bodyList.push(frontLeftWheel);
        let frontRightWheel = new Body(40, 15)
        this.bodyList.push(frontRightWheel);
        let backLeftWheel = new Body(40, 15)
        this.bodyList.push(backLeftWheel);
        let backRightWheel = new Body(40, 15)
        this.bodyList.push(backRightWheel);

        this.front = front;
        this.back = back;
        this.chassie = chassie;
        this.frontLeftWheel = frontLeftWheel;
        this.frontRightWheel = frontRightWheel;
        this.backLeftWheel = backLeftWheel;
        this.backRightWheel = backRightWheel;
    }

    async simLoop() {

        const timer = ms => new Promise(res => setTimeout(res, ms));
        while (true) {

            this.draw();
            this.controlCar();
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

    controlCar() {

        let steerGoal = 0;
        if (this.pressedKeys["0_KeyA"]) { steerGoal += 1; }
        if (this.pressedKeys["0_KeyD"]) { steerGoal += -1; }
        if (this.pressedKeys["0_KeyQ"]) { steerGoal += 0.5; }
        if (this.pressedKeys["0_KeyE"]) { steerGoal += -0.5; }

        steerGoal = Math.max(Math.min(steerGoal, 1), -1);

        this.steering += Math.sign(steerGoal - this.steering) * Math.min(Math.abs(steerGoal - this.steering), 0.02);

        let front = this.front.position;
        let back = this.back.position;

        if (this.pressedKeys["0_KeyW"]) {
            this.front.velocity = this.front.velocity.plus(front.minus(back).unit().times(new Point(0.02, 0)));
        }

        if (this.pressedKeys["0_KeyS"]) {
            this.front.velocity = this.front.velocity.plus(front.minus(back).unit().times(new Point(-0.02, 0)));
        }
    }

    move() {

        // move front wheels
        this.front.move(this.logMap);

        // back wheels follow
        let front = this.front.position;
        let back = this.back.position;

        this.back.position = back.minus(front).unit().times(new Point(150, 0)).plus(front);

        // move chassie
        this.chassie.position = front.times(new Point(0.5, 0)).plus(back.times(new Point(0.5, 0)));
        this.chassie.rotation = front.minus(back).angle();

        // rotate all wheels
        let chassie = this.chassie.position;

        this.frontLeftWheel.position = (new Point(75, 40)).times(front.minus(back).unit()).plus(chassie);
        this.frontLeftWheel.rotation = this.chassie.rotation + this.steering * Math.PI / 4;
        this.frontRightWheel.position = (new Point(75, -40)).times(front.minus(back).unit()).plus(chassie);
        this.frontRightWheel.rotation = this.chassie.rotation + this.steering * Math.PI / 4;

        this.backLeftWheel.position = (new Point(-75, 40)).times(front.minus(back).unit()).plus(chassie);
        this.backLeftWheel.rotation = this.chassie.rotation;
        this.backRightWheel.position = (new Point(-75, -40)).times(front.minus(back).unit()).plus(chassie);
        this.backRightWheel.rotation = this.chassie.rotation;

        // calc friction
        let frontV = this.front.velocity;
        let wheelRot = Point.radial(1, this.frontLeftWheel.rotation);
        let turnedV = frontV.times(wheelRot.flip(1, -1));

        this.front.velocity = new Point(turnedV.x * 0.99, turnedV.y * 0.9).times(wheelRot);

        // move camera
        this.camera.position = chassie;
        this.camera.rotation = front.minus(back).angle() - Math.PI / 2;
    }

    outputLog() {

        let logStr = "log items: " + Object.keys(this.logMap).length + "<br>";

        for (let key in this.logMap) { logStr += key + ": " + this.logMap[key] + "<br>"; }

        this.log.innerHTML = logStr;
    }

    keydown(event) {

        let mod = event.ctrlKey * 4 + event.shiftKey * 2 + event.altKey * 1;

        this.pressedKeys[mod + "_" + event.code] = 1;
        // switch (mod + "_" + event.code) {
        //     case "0_KeyW": event.preventDefault(); this.pressedKeys.W = 1; break;
        //     case "0_KeyS": event.preventDefault(); this.pressedKeys.S = 1; break;
        //     case "0_KeyA": event.preventDefault(); this.pressedKeys.A = 1; break;
        //     case "0_KeyD": event.preventDefault(); this.pressedKeys.D = 1; break;
        // }
    }

    keyup(event) {

        let mod = event.ctrlKey * 4 + event.shiftKey * 2 + event.altKey * 1;

        this.pressedKeys[mod + "_" + event.code] = 0;
        // switch (mod + "_" + event.code) {
        //     case "0_KeyW": event.preventDefault(); this.pressedKeys.W = 0; break;
        //     case "0_KeyS": event.preventDefault(); this.pressedKeys.S = 0; break;
        //     case "0_KeyA": event.preventDefault(); this.pressedKeys.A = 0; break;
        //     case "0_KeyD": event.preventDefault(); this.pressedKeys.D = 0; break;
        // }
    }
}