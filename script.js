/**
 * ==========================================
 * SoundManager Class
 * จัดการการเล่นเพลงพื้นหลังเรโทรและการปิด/เปิดเสียง
 * ==========================================
 */
class SoundManager {
    constructor(audioElementId) {
        this.audio = document.getElementById(audioElementId);
        this.isMuted = false;
    }

    // เริ่มเล่นเพลง (จะถูกเรียกหลังจากผู้ใช้กดปุ่ม Start Game ป้องกันเบราว์เซอร์บล็อกการเล่นออโต้)
    play() {
        this.audio.play().catch(err => {
            console.log("Audio playback blocked or failed:", err);
        });
    }

    // สลับสถานะเปิด/ปิดเสียงเพลง
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

/**
 * ==========================================
 * ConfettiEngine Class
 * จัดการระบบพลุกระดาษปลิวพิกเซลแบบสี่เหลี่ยม 8-bit
 * ==========================================
 */
class ConfettiEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        // จานสีพาสเทลพิกเซลสำหรับกระดาษปลิว
        this.colors = ['#FF3366', '#FFCC00', '#33CCFF', '#33FF66', '#FF99FF', '#FF9999'];
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    // ปรับขนาด Canvas ให้เต็มหน้าจอ
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // เริ่มระเบิดพลุกระดาษพิกเซล
    spawn() {
        this.particles = [];
        const particleCount = 120;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                // เกิดจากกึ่งกลางด้านล่างของหน้าจอขึ้นไป
                x: window.innerWidth / 2,
                y: window.innerHeight * 0.75,
                size: Math.floor(Math.random() * 8) + 10, // ขนาดสี่เหลี่ยมพิกเซล
                vx: (Math.random() - 0.5) * 18,           // ความเร็วแนวแกน X
                vy: -Math.random() * 20 - 15,             // แรงพุ่งแนวแกน Y
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12
            });
        }
        this.animate();
    }

    // วาดและคำนวณตำแหน่งกระดาษโปรย
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let hasActiveParticles = false;

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.6; // ค่าแรงดึงดูดจำลอง (Gravity) ทำให้ย้อยตกลงมา
            p.rotation += p.rotationSpeed;

            // วาดเฉพาะเศษกระดาษที่ยังไม่ตกพ้นหน้าจอ
            if (p.y < this.canvas.height) {
                hasActiveParticles = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                
                this.ctx.fillStyle = p.color;
                // วาดสี่เหลี่ยมจัตุรัสแบบคมชัดสไตล์พิกเซลเกม
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

/**
 * ==========================================
 * FloatingHearts Class
 * ผลิตสัญลักษณ์หัวใจและประกายพิกเซลลอยในพื้นหลัง
 * ==========================================
 */
class FloatingHearts {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // สัญลักษณ์พิกเซลและประกายดาว
        this.symbols = ['❤️', '⭐', '✨', '💖', '⭐', '🎈'];
    }

    // เริ่มการผลิตสัญลักษณ์อย่างต่อเนื่อง
    start() {
        // ผลิตสัญลักษณ์ลอยสุ่มขึ้นไปทุกๆ 1.2 วินาที
        this.intervalId = setInterval(() => this.spawn(), 1200);
    }

    spawn() {
        const element = document.createElement('div');
        element.className = 'floating-pixel';
        element.innerText = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        
        // กำหนดตำแหน่ง X แบบสุ่มตามสัดส่วนหน้าจอ
        element.style.left = Math.random() * 95 + '%';
        // สุ่มขนาดให้มีระยะตื้นลึก
        element.style.fontSize = Math.floor(Math.random() * 16) + 18 + 'px';
        // สุ่มระยะเวลาการลอยขึ้นข้างบนเพื่อสลับสับเปลี่ยนความช้าเร็ว
        element.style.animationDuration = Math.floor(Math.random() * 6) + 6 + 's';
        
        this.container.appendChild(element);
        
        // ลบอิลิเมนต์ทิ้งหลังจากลอยเลยพ้นหน้าจอไปแล้วเพื่อไม่ให้หนักหน่วยความจำ
        setTimeout(() => {
            element.remove();
        }, 12000);
    }
}

/**
 * ==========================================
 * PromiseCoupon Class
 * ควบคุมการทำงานของการ์ดรับคูปองกอดและปุ่มหลบหลีก
 * ==========================================
 */
class PromiseCoupon {
    constructor(couponBoxId, acceptBtnId, rejectBtnId, successCardId) {
        this.couponBox = document.getElementById(couponBoxId);
        this.acceptBtn = document.getElementById(acceptBtnId);
        this.rejectBtn = document.getElementById(rejectBtnId);
        this.successCard = document.getElementById(successCardId);

        // ตรวจจับเหตุการณ์ของปุ่มปฏิเสธ (ปุ่มจะย้ายตำแหน่งหนี)
        this.rejectBtn.addEventListener('mouseover', () => this.runAway());
        this.rejectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.runAway();
        });

        // ตรวจจับเหตุการณ์ของปุ่มยอมรับ
        this.acceptBtn.addEventListener('click', () => this.claimReward());
    }

    // ฟังก์ชันทำให้ปุ่มปฏิเสธวิ่งหนีสุ่มเฉพาะในขอบเขตของกล่องคูปอง (couponBox)
    runAway() {
        // กำหนดระยะขอบความปลอดภัยไม่ให้หลุดขอบกล่องคูปอง
        const padding = 20;
        const widthLimit = this.couponBox.clientWidth - this.rejectBtn.offsetWidth - 2 * padding;
        const heightLimit = this.couponBox.clientHeight - this.rejectBtn.offsetHeight - 2 * padding;

        const randomX = padding + Math.floor(Math.random() * Math.max(1, widthLimit));
        const randomY = padding + Math.floor(Math.random() * Math.max(1, heightLimit));

        // ปรับปุ่มเป็นระบบพิกัดสัมพัทธ์ในกรอบเพื่อเคลื่อนย้ายเฉพาะภายในกล่อง
        this.rejectBtn.style.position = 'absolute';
        this.rejectBtn.style.left = `${randomX}px`;
        this.rejectBtn.style.top = `${randomY}px`;
    }

    // แสดงหน้าต่างยินดีต้อนรับและขอบคุณสำเร็จรูป
    claimReward() {
        // ค่อยๆ ปิดการแสดงคูปองและแสดงกล่องสำเร็จ
        this.couponBox.style.display = 'none';
        this.successCard.style.display = 'block';
        
        // ล้างคุณสมบัติปุ่มหลบหนีกลับไปสถานะปกติป้องกันค้าง
        this.rejectBtn.style.position = 'static';
        
        // เลื่อนหน้าจอลงมาให้กล่องของขวัญขอบคุณเห็นชัด
        this.successCard.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * ==========================================
 * GameController Class
 * คลาสมองภาพรวมและควบคุมเครื่องจักรสถานะของหน้าเว็บเซอร์ไพรส์
 * ==========================================
 */
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

    // เริ่มต้นการจำลองระบบทั้งหมด
    init() {
        this.floating.start();
        
        // ปลุกฟังก์ชัน Start Button
        this.startBtn.addEventListener('click', () => this.revealSurprise());
        
        // ปลุกฟังก์ชัน Mute Button
        this.muteBtn.addEventListener('click', () => {
            this.sound.toggleMute('mute-btn');
        });        

        // เล่นเสียงเพลงทันทีหลังจากมีปฏิสัมพันธ์แรก
        this.sound.play();
    }

    // ทำการเปลี่ยนผ่านหน้าจอจากสถานะที่ 1 ไปสู่สถานะที่ 2
    revealSurprise() {
        // ระเบิดกระดาษพิกเซล Confetti เฉลิมฉลอง
        this.confetti.spawn();

        // เพิ่มแอนิเมชัน Fade-Out ให้หน้าจอแรกเลื่อนหายไปด้านบน
        this.state1.classList.add('fade-out');

        // รอระยะเวลาให้ Transition สไลด์ปิดสมบูรณ์
        setTimeout(() => {
            this.state1.style.display = 'none';
            this.state2.style.display = 'block';

            // สไลด์หน้าเซอร์ไพรส์หลักขึ้นมาพร้อมเอฟเฟกต์เด้ง
            setTimeout(() => {
                this.state2.classList.add('active');
                // เริ่มต้นการทำงานของคูปองคำสัญญา
                new PromiseCoupon('coupon-card', 'accept-coupon', 'reject-coupon', 'success-card');
            }, 50);
        }, 800);
    }
}

// เริ่มโหลดสคริปต์หลักและทำงาน
document.addEventListener('DOMContentLoaded', () => {
    const controller = new GameController();
    controller.init();
});
