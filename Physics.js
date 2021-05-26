"use strict";

class Camera {
    constructor(x, y, r, zoom) {

        this.x = x;
        this.y = y;
        this.r = r;

        this.vx = 0;
        this.vy = 0;
        this.vr = 0;

        this.zoom = zoom;
    }
}

class Shape {

    constructor(lineList) {
        this.lineList = lineList;
    }

    project(camera, logMap) {
        let lineList1 = [];
        for (let line of this.lineList) {
            let line1 = line.project(camera, logMap);
            lineList1.push(line1);
        }
        return new Shape(lineList1);
    }

    draw(camera, ctx, lineWidth, strokeStyle, logMap) {
        for (let line of this.lineList) {
            line.draw(camera, ctx, lineWidth, strokeStyle, logMap);
        }
    }
}

class Line {

    constructor(pointList) {
        this.pointList = pointList;
    }

    project(camera, logMap) {
        let pointList1 = [];
        for (let point of this.pointList) {
            let point1 = point.project(camera, logMap);
            pointList1.push(point1);
        }
        return new Line(pointList1);
    }

    draw(camera, ctx, lineWidth, strokeStyle, logMap) {

        ctx.beginPath();

        var isFirst = true;
        for (let point of this.pointList) {

            let point1 = point.project(camera, logMap);

            if (!isFirst) {
                isFirst = false;
                ctx.moveTo(point1.x + ctx.canvas.width / 2, point1.y + ctx.canvas.height / 2);
            } else {
                ctx.lineTo(point1.x + ctx.canvas.width / 2, point1.y + ctx.canvas.height / 2);
            }
        }

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FFFFFF";
    }
}

class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    project(camera, logMap) {

        let zoom = 2 ** (camera.zoom / 4);

        let nx = (this.x - camera.x) / zoom;
        let ny = (this.y - camera.y) / zoom;

        let nnx = nx * Math.cos(camera.r) - ny * Math.sin(camera.r);
        let nny = ny * Math.cos(camera.r) + nx * Math.sin(camera.r);

        return new Point(nnx, nny);
    }
}