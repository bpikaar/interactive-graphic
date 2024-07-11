import { Main } from "./app.js";

export class Point {
    #x = 0;
    #y = 0;
    #comment = '';

    #commentElement;
    #main;

    get x() { return this.#x; }
    get y() { return this.#y; }

    get comment() {
        return this.#comment;
    }
    set comment(comment) {
        this.#comment = comment;
        this.#commentElement?.remove();
        this.#main?.addPoint(this);
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} comment 
     * @param {Main} main 
     */
    constructor(x, y, comment, main) {
        this.#x = x;
        this.#y = y;
        this.comment = comment;
        this.#main = main;

        if (comment === '') {
            this.#inputForLabel();
        }
    }

    #inputForLabel() {
        this.#commentElement = document.createElement("div");
        this.#commentElement.className = "field has-addons";
        this.#commentElement.style.position = "absolute";
        this.#commentElement.style.left = (this.#x + 40) + "px";
        this.#commentElement.style.top = (this.#y + 40) + "px";

        document.body.appendChild(this.#commentElement);

        const pInput = document.createElement("p");
        pInput.className = "control";
        this.#commentElement.appendChild(pInput);

        const input = document.createElement("input");
        input.className = "input is-small";
        input.type = "text";
        input.placeholder = "Comment";
        pInput.appendChild(input);

        const pButton = document.createElement("p");
        pButton.className = "control";
        this.#commentElement.appendChild(pButton);

        const a = document.createElement("a");
        a.className = "button is-static is-small";
        a.innerHTML = "Add";
        pButton.appendChild(a);

        input.focus();

        input.addEventListener("keydown", (e) => this.#addCommentLabel(e));
        pButton.addEventListener("click", (e) => this.#addCommentLabelFromButton(e));
    }

    #addCommentLabel(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            this.comment = e.target.value;
        }
    }
    #addCommentLabelFromButton(e) {
        e.preventDefault();
        this.comment = e.target.closest("div").querySelector("p input").value;
    }

    remove() {
        this.#commentElement?.remove();
    }
}
