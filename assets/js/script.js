document.addEventListener("DOMContentLoaded", function() {
    const CONTAINER = document.getElementById('canvasContainer');
    const CANVAS = document.createElement('canvas');
    CANVAS.id = 'particlesCanvas';
    CONTAINER.appendChild(CANVAS);
    const CONTEXT = CANVAS.getContext('2d');
    const PARTICLES = [];
    const MOUSE = { x: null, y: null };
    const MAX_DISTANCE = 175;
    const DARKMODE_BUTTON = document.getElementById('darkmodeButton');
    let isDarkmode = false;
    const DENSITY = 6000;
    let particleCount;
    particleCount = CANVAS.width * CANVAS.height / DENSITY;

    CANVAS.width = CONTAINER.offsetWidth;
    CANVAS.height = CONTAINER.offsetHeight;

    function getParticleColor() {
        return isDarkmode ? "white" : "black";
    }

    function getLineColor(opacity) {
        return isDarkmode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
    }

    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
        }

        draw() {
            CONTEXT.beginPath();
            CONTEXT.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            CONTEXT.fillStyle = getParticleColor();
            CONTEXT.fill();
        }

        update() {
            if (this.x + this.size > CANVAS.width || this.x - this.size < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.size > CANVAS.height || this.y - this.size < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    function linkParticles() {
        for (let i = 0; i < PARTICLES.length; i++) {
            for (let j = i; j < PARTICLES.length; j++) {
                const DISTANCE = Math.hypot(
                    PARTICLES[i].x - PARTICLES[j].x,
                    PARTICLES[i].y - PARTICLES[j].y
                );
                if (DISTANCE < MAX_DISTANCE) {
                    CONTEXT.beginPath();
                    CONTEXT.strokeStyle = getLineColor(1 - DISTANCE / MAX_DISTANCE);
                    CONTEXT.lineWidth = 1;
                    CONTEXT.moveTo(PARTICLES[i].x, PARTICLES[i].y);
                    CONTEXT.lineTo(PARTICLES[j].x, PARTICLES[j].y);
                    CONTEXT.stroke();
                }
            }

            const MOUSE_DISTANCE = Math.hypot(
                PARTICLES[i].x - MOUSE.x,
                PARTICLES[i].y - MOUSE.y
            );
            if (MOUSE_DISTANCE < MAX_DISTANCE) {
                CONTEXT.beginPath();
                CONTEXT.strokeStyle = getLineColor(1 - MOUSE_DISTANCE / MAX_DISTANCE);
                CONTEXT.lineWidth = 1;
                CONTEXT.moveTo(PARTICLES[i].x, PARTICLES[i].y);
                CONTEXT.lineTo(MOUSE.x, MOUSE.y);
                CONTEXT.stroke();
            }
        }
    }

    function init() {
        PARTICLES.length = 0;
        particleCount = CANVAS.width * CANVAS.height / DENSITY;

        for (let i = 0; i < particleCount; i++) {
            const SIZE = Math.random() * 2 + 1;
            const X = Math.random() * CANVAS.width;
            const Y = Math.random() * CANVAS.height;
            const DX = (Math.random() - 0.5) * 2;
            const DY = (Math.random() - 0.5) * 2;

            PARTICLES.push(new Particle(X, Y, DX, DY, SIZE));
        }
    }

    function resize() {
        const OLD_WIDTH = CANVAS.width;
        const OLD_HEIGHT = CANVAS.height;

        CANVAS.width = CONTAINER.offsetWidth;
        CANVAS.height = CONTAINER.offsetHeight;

        PARTICLES.forEach((particle) => {
            particle.x = (particle.x / OLD_WIDTH) * CANVAS.width;
            particle.y = (particle.y / OLD_HEIGHT) * CANVAS.height;
        });
    }

    function animate() {
        CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
        PARTICLES.forEach((particle) => particle.update());
        linkParticles();
        requestAnimationFrame(animate);
    }

    CANVAS.addEventListener('mousemove', (event) => {
        const NAV_HEIGHT = document.querySelector('nav').offsetHeight;
        MOUSE.x = event.clientX;
        MOUSE.y = event.clientY - NAV_HEIGHT;
    })

    CANVAS.addEventListener('mouseleave', () => {
        MOUSE.x = null;
        MOUSE.y = null;
    })

    window.addEventListener('resize', () => {
        particleCount = CANVAS.width * CANVAS.height / DENSITY;
        resize();
        init();
    })

    /* DARKMODE_BUTTON.addEventListener('click', () => {
        isDarkmode = !isDarkmode;
        CONTAINER.classList.toggle('darkmode');
    }) */

    function animateText() {
        let delay = 100,
            delayStart = 0,
            contents,
            letters;

        document.querySelectorAll(".animated").forEach(function (elem) {
            contents = elem.textContent.trim();
            elem.textContent = "";
            letters = contents.split("");
            elem.style.visibility = "visible";

            letters.forEach(function(letters, index1){
                setTimeout(function(){
                    elem.textContent += letters;
                }, delayStart + delay * index1);
            });
            delayStart += delay * letters.length;
        });
    }

    init();
    animate();
    animateText();
})