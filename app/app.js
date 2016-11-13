let stage;
let cursor = {
  x: 0,
  y: 0,
  dragging: false,
};

$(() => {
  const circle1 = new Circle(150, 150, 40);
  const circle2 = new Circle(150, 250, 40);
  const circle3 = new Circle(250, 150, 40);

  circle1.setChainTos([circle2]);
  circle2.setChainTos([circle1]);

  stage = new Stage([circle1, circle2]);
});

$(window).on("resize", () => {
  stage.init();
});

$(window).on("mousedown", (e) => {
  cursor.dragging = true;
});

$(window).on("mousemove", (e) => {
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
});

$(window).on("mouseup", (e) => {
  cursor.dragging = false;
});

class Handle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dragged = false;
  }

  render(ctx) {
    ctx.beginPath();

    if (this.isDragged()) {
      this.handleDrag();
    }

    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(204, 61, 58, 0.8)";
    ctx.fill();
  }

  isDragged() {
    if (cursor.dragging === false) {
      this.dragged = false;

      return this.dragged;
    }
    const dx = Math.abs(this.x - cursor.x);
    const dy = Math.abs(this.y - cursor.y);

    if (dx <= this.r && dy<= this.r) {
      this.dragged = true;
    }

    return this.dragged;
  }

  handleDrag() {
    this.x = cursor.x;
    this.y = cursor.y;
  }

}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.spring = 0.1;
    this.friction = 0.85;

    this.vx = 50;

    this.vy = 0;
    this.gravity = 0;

    this.chainTos = [];
  }

  setChainTos(chainTos) {
    this.chainTos = chainTos;
  }

  render(ctx) {
    ctx.beginPath();

    this.chainTos.forEach((chainTo) => {
      const dx = chainTo.x - this.x;
      const dy = chainTo.y - this.y;
      const ax = (this.getTargetX(dy, dx, chainTo) - this.x) * this.spring;
      const ay = (this.getTargetY(dy, dx, chainTo) - this.y) * this.spring;
      this.vx += ax;
      this.vx *= this.friction
      this.x += this.vx;

      this.y += this.gravity;
      this.vy += ay;
      this.vy *= this.friction
      this.y += this.vy;
    });

    const col = "rgba(73, 195, 179, 0.8)";

    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fillStyle = col;
    ctx.fill();

    this.chainTos.forEach((chainTo) => {
      const dx = Math.abs(this.x - chainTo.x);
      const dy = Math.abs(this.y - chainTo.y);
      const d = Math.sqrt(dx * dx + dy * dy);
      const width = Math.max(60 - (d / 30 * 3), 20);

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(chainTo.x, chainTo.y);
      ctx.lineWidth = width;
      ctx.strokeStyle = col;
      ctx.stroke();
    });
  }

  getTargetX(y, x, chain) {
    const angle = Math.atan2(y, x);

    return chain.x - Math.cos(angle) * 300;
  }

  getTargetY(y, x, chain) {
    const angle = Math.atan2(y, x);

    return chain.y - Math.sin(angle) * 300;
  }
}

class Stage {
  constructor(contents) {
    this.canvas = document.getElementById("stage");
    this.ctx = this.canvas.getContext("2d");
    this.contents = contents;

    this.init();
  }

  init() {
    this.width = $(".wrapper").width();
    this.height = $(".wrapper").height();
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.contents.forEach((cnt) => {
      cnt.render(this.ctx);
    });
    requestAnimationFrame(::this.render);
  }
}
