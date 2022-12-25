/**
 * Copyright (c) 2022, David Dias Horta
 */

console.log("%cHiya fellow developer :)", "font-size: 30px;");
console.log("Copyright (c) 2022, David Dias Horta")
console.log("This is my submission for the \"Web Technologies\" module at HSLU.")

const {createApp} = Vue;

createApp({
    data() {
        return {
            canSubmit: false,
            error: null,
            generator: {
                lines: {
                    type: "number",
                    value: 2,
                    min: 0
                },
                ellipses: {
                    type: "number",
                    value: 1,
                    min: 0

                },
                rectangles: {
                    type: "number",
                    value: 1,
                    min: 0
                },
                background: {
                    type: "color",
                    value: "#ffffff",
                    onChange: this.setBackground
                },
            },
            form: {
                title: {
                    type: "text",
                    value: null,
                    placeholder: "your artwork's title...",
                    error: null,
                    validate: value => value ? null : "please enter a title"
                },
                name: {
                    type: "text",
                    value: null,
                    placeholder: "your name...",
                    error: null,
                    validate: value => value ? null : "please enter your name"
                },
                age: {
                    type: "number",
                    value: null,
                    min: 18,
                    max: 120,
                    placeholder: "your age...",
                    error: null,
                    validate: value => {
                        if (!value) {
                            return "please enter your age";
                        }
                        if (value < this.form.age.min) {
                            return `you must be at least ${this.form.age.min} years old`;
                        }
                        if (value > this.form.age.max) {
                            return `you can't be older than ${this.form.age.max}`;
                        }
                        return null;
                    },
                },
                email: {
                    type: "email",
                    value: null,
                    placeholder: "your email...",
                    error: null,
                    validate: (value) => {
                        if (!value) {
                            return "please enter your email";
                        }
                        /* email regex */
                        if (!value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
                            return "please enter a valid email";
                        }
                        return null;
                    },
                },
                canvas: {
                    type: "text",
                    value: null,
                    hidden: true,
                    validate: _ => null
                }
            }
        }
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = 1000;
        ctx.canvas.height = 1000;
        this.renderCanvas();
    },
    methods: {
        renderCanvas() {
            this.form.canvas.value = this.$refs.canvas.toDataURL();
        },
        clear() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = this.generator.background.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.renderCanvas();
        },
        setBackground() {
            if (confirm("changes will take effect after clearing. Do you want to clear now?")) {
                this.clear();
            }
        },
        toTitleCase(str) {
            return str[0].toUpperCase() + str.slice(1);
        },
        randomPoint() {
            // in canvas
            const canvas = this.$refs.canvas;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            return {x, y};
        },
        randomColour() {
            return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        },
        download() {
            const canvas = this.$refs.canvas;
            const link = document.createElement('a');
            const title = this.form.title.value || "artwork";
            link.download = `${title}.png`;
            link.href = canvas.toDataURL();
            link.click();
        },
        generate() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            // random rectangles
            for (let i = 0; i < this.generator.rectangles.value; i++) {
                const {x, y} = this.randomPoint();
                const width = Math.random() * 200;
                const height = Math.random() * 200;
                ctx.fillStyle = this.randomColour();
                ctx.fillRect(x, y, width, height);
            }
            // random ellipses
            for (let i = 0; i < this.generator.ellipses.value; i++) {
                const {x, y} = this.randomPoint();
                const width = Math.random() * 200;
                const height = Math.random() * 200;
                ctx.fillStyle = this.randomColour();
                ctx.beginPath();
                ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
            // random lines
            for (let i = 0; i < this.generator.lines.value; i++) {
                const {x: x1, y: y1} = this.randomPoint();
                const {x: x2, y: y2} = this.randomPoint();
                ctx.strokeStyle = this.randomColour();
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            this.renderCanvas();
        },
        validate() {
            this.error = null;
            this.canSubmit = false;

            for (const key in this.form) {
                const field = this.form[key];
                field.error = field.validate(field.value);
                if (field.error) {
                    this.error = field.error;
                    return;
                }
            }

            this.canSubmit = true;
        }
    }
}).mount('#app')
