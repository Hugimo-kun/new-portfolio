document.addEventListener("DOMContentLoaded", function() {
    const CONTAINER = document.getElementById('canvasContainer');
    const CANVAS = document.createElement('canvas');
    CANVAS.id = 'particlesCanvas';
    CONTAINER.appendChild(CANVAS);
    const CONTEXT = CANVAS.getContext('2d');
    const PARTICLES = [];
    const MOUSE = { x: null, y: null };
    const MAX_DISTANCE = 175;
    const DARKMODE_BUTTON = document.getElementById('darkmode-toggle');
    let isDarkmode = localStorage.getItem("isDarkmode");
    const DENSITY = 6000;
    let particleCount = CANVAS.width * CANVAS.height / DENSITY;
    const PATH = window.location.pathname;
    const PATH_NAME = PATH.substring(PATH.lastIndexOf("/") + 1);
    let hamburger = document.querySelector(".hamburger");
    const CONTENT_CONTAINER = document.querySelector(".content");
    const FR_BUTTON = document.getElementById("frButton");
    const EN_BUTTON = document.getElementById("enButton");
    const PARTICLES_COLORS = {
        red: {
            particle: () => localStorage.getItem("isDarkmode") === 'true' ? "lightcoral" : "crimson",
            line: (opacity) => localStorage.getItem("isDarkmode") === 'true' ? `rgba(240, 128, 128, ${opacity})` : `rgba(220, 20, 60, ${opacity})`,
        },
        blue: {
            particle: () => localStorage.getItem("isDarkmode") === 'true' ? "lightskyblue" : "royalblue",
            line: (opacity) => localStorage.getItem("isDarkmode") === 'true' ? `rgba(135, 206, 250, ${opacity})` : `rgba(65, 105, 225, ${opacity})`,
        },
        green: {
            particle: () => localStorage.getItem("isDarkmode") === 'true' ? "lightgreen" : "forestgreen",
            line: (opacity) => localStorage.getItem("isDarkmode") === 'true' ? `rgba(144, 238, 144, ${opacity})` : `rgba(34, 139, 34, ${opacity})`,
        },
        yellow: {
            particle: () => localStorage.getItem("isDarkmode") === 'true' ? "lightyellow" : "#BC8F8F",
            line: (opacity) => localStorage.getItem("isDarkmode") === 'true' ? `rgba(255, 255, 224, ${opacity})` : `rgba(188, 143, 143, ${opacity})`,
        },
        purple: {
            particle: () => localStorage.getItem("isDarkmode") === 'true' ? "plum" : "purple",
            line: (opacity) => localStorage.getItem("isDarkmode") === 'true' ? `rgba(221, 160, 221, ${opacity})` : `rgba(128, 0, 128, ${opacity})`,
        }
    };

    const NAV_HEIGHT = document.querySelector('nav').offsetHeight;
    CANVAS.width = CONTAINER.offsetWidth;
    if (window.innerWidth > 768) {
        CANVAS.height = CONTAINER.offsetHeight - NAV_HEIGHT;
    } else {
        CANVAS.height = CONTAINER.offsetHeight;
    }

    function getParticleColor() {
        switch (PATH_NAME) {
            case "presentation.html":
                return PARTICLES_COLORS.green.particle();
            case "tech.html":
                return PARTICLES_COLORS.red.particle();
            case "projects.html":
                return PARTICLES_COLORS.purple.particle();
            case "contact.html":
                return PARTICLES_COLORS.yellow.particle();
            default :
            return PARTICLES_COLORS.blue.particle();
        }
    }

    function getLineColor(opacity) {
        switch (PATH_NAME) {
            case "presentation.html":
                return PARTICLES_COLORS.green.line(opacity);
            case "tech.html":
                return PARTICLES_COLORS.red.line(opacity);
            case "projects.html":
                return PARTICLES_COLORS.purple.line(opacity);
            case "contact.html":
                return PARTICLES_COLORS.yellow.line(opacity);
            default :
                return PARTICLES_COLORS.blue.line(opacity);
        }
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

    CONTENT_CONTAINER.addEventListener('mousemove', (event) => {
        const NAV_HEIGHT = document.querySelector('nav').offsetHeight;
        MOUSE.x = event.clientX;
        MOUSE.y = event.clientY - NAV_HEIGHT;
    })

    CONTENT_CONTAINER.addEventListener('mouseleave', () => {
        MOUSE.x = null;
        MOUSE.y = null;
    })

    window.addEventListener('resize', () => {
        particleCount = CANVAS.width * CANVAS.height / DENSITY;
        resize();
        init();
    })

    if (isDarkmode === "true") {
        addDarkmode();
        DARKMODE_BUTTON.checked = true;
    } else {
        removeDarkmode();
    }

    function addDarkmode() {
        CONTAINER.classList.add("darkmode");
        hamburger.classList.add("darkmode");
        localStorage.setItem("isDarkmode", true);
    }

    function removeDarkmode() {
        CONTAINER.classList.remove("darkmode");
        hamburger.classList.remove("darkmode");
        localStorage.setItem("isDarkmode", false);
    }

    DARKMODE_BUTTON.addEventListener('click', () => {
        isDarkmode = localStorage.getItem("isDarkmode");
        isDarkmode !== "true" ? addDarkmode() : removeDarkmode();
    })

    FR_BUTTON.addEventListener('click', () => {
        localStorage.setItem("language", "FR");
        changeLanguage("FR");
    })

    EN_BUTTON.addEventListener('click', () => {
        localStorage.setItem("language", "EN");
        changeLanguage("EN");
    })

    function changeLanguage(language) {
        if (language === "FR" || language === null) {
            document.querySelectorAll(".EN").forEach(function (elem) {
                elem.style.display = "none";
                elem.style.visibility = "hidden";
            });
            document.querySelectorAll(".FR").forEach(function (elem) {
                elem.style.display = "block";
                elem.style.visibility = "visible";
            });
            FR_BUTTON.classList.add("active");
            EN_BUTTON.classList.remove("active");
        } else {
            document.querySelectorAll(".FR").forEach(function (elem) {
                elem.style.display = "none";
                elem.style.visibility = "hidden";
            });
            document.querySelectorAll(".EN").forEach(function (elem) {
                elem.style.display = "block";
                elem.style.visibility = "visible";
            });
            EN_BUTTON.classList.add("active");
            FR_BUTTON.classList.remove("active");
        }
    }

    function animateText() {
        let delay = 100,
            delayStart = 0,
            contents,
            letters;

        document.querySelectorAll(".animated").forEach(function (elem) {
            if (window.getComputedStyle(elem).display === "none") {
                return;
            }

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

    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("is-active");
        document.querySelector("nav").classList.toggle("is-out");
    });

    resize();
    init();
    animate();
    changeLanguage(localStorage.getItem("language"));
    animateText();
})
