import { Point } from "./point.js";

export class Main {

    canvas;
    ctx;

    xAxisContainer;
    yAxisContainer;
    xAxisLabel;
    yAxisLabel;
    points = [];

    addingPointActive = false;
    currentPoint;

    constructor() {
        this.canvas = document.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');

        this.xAxisContainer = document.querySelector('#x-axis-container');
        this.xAxisContainer?.querySelector('input')?.addEventListener("keydown", (event) => this.drawXAxis(event));
        this.xAxisContainer?.querySelector('p:nth-child(2)')?.addEventListener("click", (event) => this.drawXAxis(event, true));

        this.yAxisContainer = document.querySelector('#y-axis-container');
        this.yAxisContainer?.querySelector('input')?.addEventListener("keydown", (event) => this.drawYAxis(event));
        this.yAxisContainer?.querySelector('p:nth-child(2)')?.addEventListener("click", (event) => this.drawYAxis(event, true));

        document.querySelector('#previous-data')?.addEventListener("click", () => {
            console.log("click");
            const pointsData = JSON.parse(localStorage.getItem('points')) || [];
            this.points = pointsData.map(data => new Point(data.x, data.y, data.comment === '' ? ' ' : data.comment, this));
            this.drawPoints();
            document.querySelector('#previous-data')?.remove();
        });

        document.querySelector('#clear-data')?.addEventListener("click", () => {
            localStorage.removeItem('points');
            this.points = [];
            this.drawAxes();
            this.drawPoints();
        });
        document.querySelector('#clear-axis')?.addEventListener("click", () => {
            localStorage.removeItem('x-axis');
            localStorage.removeItem('y-axis');
            this.xAxisContainer.style.display = "flex";
            this.yAxisContainer.style.display = "flex";
            this.drawAxes();
            this.drawPoints();
        });

        const xLabelData = localStorage.getItem('x-axis');
        const yLabelData = localStorage.getItem('y-axis');

        if (xLabelData && xLabelData !== 'null') {
            this.setXAxis(xLabelData);
            // this.xAxisLabel = xLabelData;
        }
        if (yLabelData && yLabelData !== 'null') {
            this.setYAxis(yLabelData);
            // this.yAxisLabel = yLabelData;
        }

        this.canvas.addEventListener('click', (e) => {
            if (!this.addingPointActive) {

                // get canvas bounds and x,y within grphic area
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // check within graphic area
                if (x > 50 && x < 750 && y > 50 && y < 550) {
                    this.addingPointActive = true;
                    this.currentPoint = new Point(x, y, '', this);
                    this.drawAxes();
                    this.drawPoints();
                    this.drawTempPoint(x, y);
                }
            } else {
                if (this.currentPoint) {
                    this.currentPoint.remove();
                    this.currentPoint = null;
                    this.addingPointActive = false;
                    this.drawAxes();
                    this.drawPoints();
                }
            }
        });

        // Initialiseren
        this.drawAxes();
        this.drawPoints();
    }

    drawAxes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#EEE";
        this.ctx.fillRect(50, 50, 700, 500);
        this.ctx.beginPath();
        this.ctx.moveTo(50, 550);
        this.ctx.lineTo(750, 550);
        this.ctx.moveTo(50, 550);
        this.ctx.lineTo(50, 50);
        this.ctx.stroke();

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = "black";
        this.ctx.fillText(this.xAxisLabel, 400, 580);
        this.ctx.fillText(this.yAxisLabel, 20, 30);
    }

    drawXAxis(e, isMouseEvent = false) {
        if (isMouseEvent) {
            this.setXAxis(this.xAxisContainer.querySelector('input').value);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            this.setXAxis(e.target.value);
        }
    }
    setXAxis(value) {
        this.xAxisLabel = value;
        localStorage.setItem('x-axis', value);
        this.xAxisContainer.style.display = "none";
        this.drawAxes();
        this.drawPoints();
    }

    drawYAxis(e, isMouseEvent = false) {
        if (isMouseEvent) {
            this.setYAxis(this.yAxisContainer.querySelector('input').value);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            this.setYAxis(e.target.value);
        }
    }
    setYAxis(value) {
        this.yAxisLabel = value;
        this.yAxisContainer.style.display = "none";
        localStorage.setItem('y-axis', value);
        this.drawAxes();
        this.drawPoints();
    }

    drawPoints() {
        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.font = '12px Open sans';
            this.ctx.fillText(point.comment, point.x + 10, point.y - 10);
        });
    }

    addPoint(point) {
        this.points.push(point);

        this.setPoints();
        this.drawPoints();
        this.addingPointActive = false;
    }
    setPoints() {
        localStorage.setItem('points', JSON.stringify(this.points.map(p => {
            return {
                x: p.x,
                y: p.y,
                comment: p.comment
            };
        })));
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    drawTempPoint(x, y) {
        this.ctx.fillStyle = "gray";
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // return color to original for other points
        this.ctx.fillStyle = "black";
    }
}



document.addEventListener('DOMContentLoaded', () => {
    new Main();
});
