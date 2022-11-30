/**
 * TODOs
 * variable background
 * clear button
 * download button
 * navbar
 * about section
 * images
 */

const {createApp} = Vue;

createApp({
    data() {
        return {
            canSubmit: false,
            error: null,
            generator: {
                lines: {
                    type: "number",
                    value: 2
                },
                ellipses: {
                    type: "number",
                    value: 1
                },
                rectangles: {
                    type: "number",
                    value: 1
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
                    error: "please name your artwork",
                    hasError: false,
                },
                name: {
                    type: "text",
                    value: null,
                    placeholder: "your name...",
                    error: "please enter your name",
                    hasError: false,
                },
                age: {
                    type: "number",
                    value: null,
                    min: 18,
                    max: 120,
                    placeholder: "your age...",
                    error: "please enter your age",
                    rangeError: "you must be at least 18 years old",
                    hasError: false,
                },
                email: {
                    type: "email",
                    value: null,
                    placeholder: "your email...",
                    error: "please enter your email",
                    validate: (value) => value.includes("@") ? null : "please enter a valid email",
                    hasError: false,
                },
            }
        }
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = 1000;
        ctx.canvas.height = 1000;
    },
    methods: {
        clear() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = this.generator.background.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        },
        validate() {
            this.error = null;
            this.canSubmit = false;

            for (const key in this.form) {
                this.form[key].hasError = true;
                const value = this.form[key].value;
                if (!value) {
                    this.error = this.form[key].error;
                    return;
                }
                if (this.form[key].validate) {
                    const error = this.form[key].validate(value);
                    if (error) {
                        this.error = error;
                        return;
                    }
                }
                if (this.form[key].min && value < this.form[key].min) {
                    this.error = this.form[key].rangeError;
                    return;
                }
                if (this.form[key].max && value > this.form[key].max) {
                    this.error = this.form[key].rangeError;
                    return;
                }
                this.form[key].hasError = false;
            }

            this.canSubmit = true;
        }
    }
}).mount('#app')
