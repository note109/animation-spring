let stage;
let circle;
let cursor = {
  x: 0,
  y: 0,
  dragging: false,
};

$(() => {
  circle = new Circle(150, 150, 40);
  const handle = new Handle(150, 200, 20);
  stage = new Stage([circle, handle]);
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
  }

  render(ctx) {
    ctx.beginPath();

    if (this.isDragged()) {
      this.handleDrag();
    }

    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(192, 80, 77, 0.8)";
    ctx.fill();
  }

  isDragged() {
    if (cursor.dragging === false) {
      return false;
    }
    const dx = Math.abs(this.x - cursor.x);
    const dy = Math.abs(this.y - cursor.y);

    return dx <= this.r && dy<= this.r;
  }

  handleDrag() {
    this.x = cursor.x;
    this.y = cursor.y;
  }

}

class Circle {
  constructor(x, y, r, chainTo) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.spring = 0.1;
    this.friction = 0.85;

    this.vx = 50;
    this.targetX = 300;

    this.vy = 0;
    this.targetY = 300;
    this.gravity = 0;

    this.chainTo = chainTo;
  }

  render(ctx) {
    ctx.beginPath();

    const dx = this.getTargetX() - this.x;
    const ax = dx * this.spring;
    this.vx += ax;
    this.vx *= this.friction
    this.x += this.vx;

    const dy = this.getTargetY() - this.y;
    const ay = dy * this.spring;
    this.y += this.gravity;
    this.vy += ay;
    this.vy *= this.friction
    this.y += this.vy;

    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(155, 187, 89, 0.8)";
    ctx.fill();
  }

  getTargetX() {
    return this.chainTo ? this.chainTo.x : this.targetX;
  }

  getTargetY() {
    return this.chainTo ? this.chainTo.y : this.targetY;
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
