"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stage = void 0;
var circle = void 0;

$(function () {
  circle = new Circle(150, 150, 40);
  stage = new Stage([circle]);
});

$(window).on("resize", function () {
  stage.init();
});

$(window).on("mousemove", function (e) {
  circle.targetX = e.clientX;
  circle.targetY = e.clientY;
});

var Circle = function () {
  function Circle(x, y, r) {
    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.r = r;

    this.spring = 0.1;
    this.friction = 0.95;

    this.vx = 50;
    this.targetX = 300;

    this.vy = 0;
    this.targetY = 300;
  }

  _createClass(Circle, [{
    key: "render",
    value: function render(ctx) {
      ctx.beginPath();

      var dx = this.targetX - this.x;
      var ax = dx * this.spring;
      this.vx += ax;
      this.vx *= this.friction;
      this.x += this.vx;

      var dy = this.targetY - this.y;
      var ay = dy * this.spring;
      this.vy += ay;
      this.vy *= this.friction;
      this.y += this.vy;

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);

      ctx.fill();
    }
  }]);

  return Circle;
}();

var Stage = function () {
  function Stage(contents) {
    _classCallCheck(this, Stage);

    this.canvas = document.getElementById("stage");
    this.ctx = this.canvas.getContext("2d");
    this.contents = contents;

    this.init();
  }

  _createClass(Stage, [{
    key: "init",
    value: function init() {
      this.width = $(".wrapper").width();
      this.height = $(".wrapper").height();
      this.canvas.setAttribute("width", this.width);
      this.canvas.setAttribute("height", this.height);

      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      this.ctx.clearRect(0, 0, this.width, this.height);

      this.contents.forEach(function (cnt) {
        cnt.render(_this.ctx);
      });
      requestAnimationFrame(this.render.bind(this));
    }
  }]);

  return Stage;
}();