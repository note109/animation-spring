let stage;

$(() => {
  const circle = new Circle(150, 150, 40);

  stage = new Stage([circle]);
});

$(window).on("resize", () => {
  stage.init();
});

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = 0;
    this.spring = 0.1;
    this.targetX = 300;
    this.friction = 0.95;
  }

  render(ctx) {
    ctx.beginPath();

    const dx = this.targetX - this.x;
    const ax = dx * this.spring;
    this.vx += ax;
    this.vx *= this.friction
    this.x += this.vx;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);

    ctx.fill();
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
