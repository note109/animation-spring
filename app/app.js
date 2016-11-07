let stage;

$(() => {
  stage = new Stage();
});

$(window).on("resize", () => {
  stage.init();
});

class Stage {
  constructor() {
    this.canvas = document.getElementById("stage");
    this.ctx = this.canvas.getContext("2d");

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

    this.ctx.beginPath();
    this.ctx.arc(50, 50, 40, 0, Math.PI * 2, true);
    this.ctx.fill();
  }
}
