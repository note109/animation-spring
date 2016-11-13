let stage;
let circle;
let cursor = {
  x: 0,
  y: 0,
  dragging: false,
};

$(() => {
  const handle1 = new Handle(50, 200, 20);
  const handle2 = new Handle(350, 200, 20);
  const handle3 = new Handle(150, 400, 20);
  const handle4 = new Handle(150, 450, 20);
  const handle5 = new Handle(150, 500, 20);
  const handle6 = new Handle(150, 550, 20);

  const handles = [handle1, handle2, handle3, handle4, handle5, handle6];

  circle = new Circle(150, 150, 40, handles);
  stage = new Stage([circle, ...handles]);
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
  constructor(x, y, r, chainTos) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.spring = 0.1;
    this.friction = 0.85;

    this.vx = 50;

    this.vy = 0;
    this.gravity = 0;

    this.chainTos = chainTos;
  }

  render(ctx) {
    ctx.beginPath();

    this.chainTos.forEach((chainTo) => {
      const dx = this.getTargetX(chainTo) - this.x;
      const ax = dx * this.spring;
      this.vx += ax;
      this.vx *= this.friction
      this.x += this.vx;

      const dy = this.getTargetY(chainTo) - this.y;
      const ay = dy * this.spring;
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
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(chainTo.x, chainTo.y);
      ctx.lineWidth = 30;
      ctx.strokeStyle = col;
      ctx.stroke();
    });
  }

  getTargetX(chain) {
    return chain.x;
  }

  getTargetY(chain) {
    return chain.y;
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
