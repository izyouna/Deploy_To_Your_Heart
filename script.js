
class SoundManager {
    constructor(audioElementId) {
        this.audio = document.getElementById(audioElementId);
        this.isMuted = false;
    }

    play() {
        this.audio.play().catch(err => {
            console.log("Audio playback blocked or failed:", err);
        });
    }

    toggleMute(buttonElementId) {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        
        const btn = document.getElementById(buttonElementId);
        if (this.isMuted) {
            btn.innerHTML = "🔈 MUTED";
            btn.style.backgroundColor = "#E2E2E2";
        } else {
            btn.innerHTML = "🔊 MUSIC";
            btn.style.backgroundColor = "var(--pixel-accent-yellow)";
        }
    }
}

class ConfettiEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.colors = ['#FF3366', '#FFCC00', '#33CCFF', '#33FF66', '#FF99FF', '#FF9999'];
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawn() {
        this.particles = [];
        const particleCount = 120;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                
                x: window.innerWidth / 2,
                y: window.innerHeight * 0.75,
                size: Math.floor(Math.random() * 8) + 10, 
                vx: (Math.random() - 0.5) * 18,           
                vy: -Math.random() * 20 - 15,             
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12
            });
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let hasActiveParticles = false;

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.6; 
            p.rotation += p.rotationSpeed;

            if (p.y < this.canvas.height) {
                hasActiveParticles = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                
                this.ctx.fillStyle = p.color;
                
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                this.ctx.restore();
            }
        });

        if (hasActiveParticles) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

class FloatingHearts {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        this.symbols = ['❤️', '⭐', '✨', '💖', '⭐', '🎈'];
    }

    start() {
        
        this.intervalId = setInterval(() => this.spawn(), 1200);
    }

    spawn() {
        const element = document.createElement('div');
        element.className = 'floating-pixel';
        element.innerText = this.symbols[Math.floor(Math.random() * this.symbols.length)];

        element.style.left = Math.random() * 95 + '%';
        
        element.style.fontSize = Math.floor(Math.random() * 16) + 18 + 'px';
        
        element.style.animationDuration = Math.floor(Math.random() * 6) + 6 + 's';
        
        this.container.appendChild(element);

        setTimeout(() => {
            element.remove();
        }, 12000);
    }
}

class PromiseCoupon {
    constructor(couponBoxId, acceptBtnId, rejectBtnId, successCardId) {
        this.couponBox = document.getElementById(couponBoxId);
        this.acceptBtn = document.getElementById(acceptBtnId);
        this.rejectBtn = document.getElementById(rejectBtnId);
        this.successCard = document.getElementById(successCardId);

        this.rejectBtn.addEventListener('mouseover', () => this.runAway());
        this.rejectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.runAway();
        });

        this.acceptBtn.addEventListener('click', () => this.claimReward());
    }

    runAway() {
        
        const padding = 20;
        const widthLimit = this.couponBox.clientWidth - this.rejectBtn.offsetWidth - 2 * padding;
        const heightLimit = this.couponBox.clientHeight - this.rejectBtn.offsetHeight - 2 * padding;

        const randomX = padding + Math.floor(Math.random() * Math.max(1, widthLimit));
        const randomY = padding + Math.floor(Math.random() * Math.max(1, heightLimit));

        this.rejectBtn.style.position = 'absolute';
        this.rejectBtn.style.left = `${randomX}px`;
        this.rejectBtn.style.top = `${randomY}px`;
    }

    claimReward() {
        
        this.couponBox.style.display = 'none';
        this.successCard.style.display = 'block';

        this.rejectBtn.style.position = 'static';

        this.successCard.scrollIntoView({ behavior: 'smooth' });
    }
}

class GameController {
    constructor() {
        this.sound = new SoundManager('bg-music');
        this.confetti = new ConfettiEngine('confetti-canvas');
        this.floating = new FloatingHearts('bg-decorations');

        this.state1 = document.getElementById('state-1');
        this.state2 = document.getElementById('state-2');
        this.startBtn = document.getElementById('start-btn');
        this.muteBtn = document.getElementById('mute-btn');
    }

    init() {
        this.floating.start();

        this.startBtn.addEventListener('click', () => this.revealSurprise());

        this.muteBtn.addEventListener('click', () => {
            this.sound.toggleMute('mute-btn');
        });        
    }

    revealSurprise() {
        
        this.sound.play();

        this.confetti.spawn();

        this.state1.classList.add('fade-out');

        setTimeout(() => {
            this.state1.style.display = 'none';
            this.state2.style.display = 'block';

            setTimeout(() => {
                this.state2.classList.add('active');
                
                new PromiseCoupon('coupon-card', 'accept-coupon', 'reject-coupon', 'success-card');
            }, 50);
        }, 800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const controller = new GameController();
    controller.init();
});
