"use strict";

class Camera {
    constructor(x, y, r) {

        this.position = new Point(x, y);
        this.rotation = r;
    }
}

class Body {

    constructor(width, height) {

        this.shape = Shape.rectangle(width, height);

        this.position = new Point(0, 0);
        this.rotation = 0;

        this.velocity = new Point(0, 0);
    }

    draw(camera, canvas, logMap) {
        this.shape.project(new Camera(0, 0, -this.rotation), logMap).draw(camera, canvas, logMap);
    }

    move(logMap) {

    }
}

class Shape {

    constructor(pointList) {
        this.pointList = pointList;
    }

    static rectangle(width, height) {
        return new Shape([
            new Point(-width / 2, -height / 2),
            new Point(width / 2, -height / 2),
            new Point(width / 2, height / 2),
            new Point(-width / 2, height / 2)
        ]);
    }

    project(camera, logMap) {
        let pointList1 = [];
        for (let point of this.pointList) { pointList1.push(point.project(camera)); }
        return new Shape(pointList1);
    }

    draw(camera, canvas, logMap) {

        let ctx = canvas.getContext("2d");
        let centerScreen = new Point(ctx.canvas.width / 2, ctx.canvas.height / 2);

        var isFirst = true;
        for (let point of this.pointList) {

            let point1 = point.project(camera).plus(centerScreen);

            if (isFirst) {
                isFirst = false;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
            } else {
                ctx.lineTo(point1.x, point1.y);
            }
        }
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    }
}

class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static radial(radius, angle) {
        return new Point(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    unit() {
        let hypot = Math.hypot(this.x, this.y);
        return new Point(this.x / hypot, this.y / hypot);
    }

    plus(point) { return new Point(this.x + point.x, this.y + point.y); }
    minus(point) { return new Point(this.x - point.x, this.y - point.y); }
    times(point) { return new Point(this.x * point.x - this.y * point.y, this.x * point.y + this.y * point.x); }
    project(camera) { return this.minus(camera.position).times(Point.radial(1, -camera.rotation)); }
}