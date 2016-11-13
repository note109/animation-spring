"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stage = void 0;
var circle = void 0;
var cursor = {
  x: 0,
  y: 0,
  dragging: false
};

$(function () {
  circle = new Circle(150, 150, 40);
  var handle = new Handle(150, 200, 20);
  stage = new Stage([circle, handle]);
});

$(window).on("resize", function () {
  stage.init();
});

$(window).on("mousedown", function (e) {
  cursor.dragging = true;
});

$(window).on("mousemove", function (e) {
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
});

$(window).on("mouseup", function (e) {
  cursor.dragging = false;
});

var Handle = function () {
  function Handle(x, y, r) {
    _classCallCheck(this, Handle);

    this.x = x;
    this.y = y;
    this.r = r;
  }

  _createClass(Handle, [{
    key: "render",
    value: function render(ctx) {
      ctx.beginPath();

      if (this.isDragged()) {
        this.handleDrag();
      }

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgba(192, 80, 77, 0.8)";
      ctx.fill();
    }
  }, {
    key: "isDragged",
    value: function isDragged() {
      if (cursor.dragging === false) {
        return false;
      }
      var dx = Math.abs(this.x - cursor.x);
      var dy = Math.abs(this.y - cursor.y);

      return dx <= this.r && dy <= this.r;
    }
  }, {
    key: "handleDrag",
    value: function handleDrag() {
      this.x = cursor.x;
      this.y = cursor.y;
    }
  }]);

  return Handle;
}();

var Circle = function () {
  function Circle(x, y, r, chainTo) {
    _classCallCheck(this, Circle);

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

  _createClass(Circle, [{
    key: "render",
    value: function render(ctx) {
      ctx.beginPath();

      var dx = this.getTargetX() - this.x;
      var ax = dx * this.spring;
      this.vx += ax;
      this.vx *= this.friction;
      this.x += this.vx;

      var dy = this.getTargetY() - this.y;
      var ay = dy * this.spring;
      this.y += this.gravity;
      this.vy += ay;
      this.vy *= this.friction;
      this.y += this.vy;

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgba(155, 187, 89, 0.8)";
      ctx.fill();
    }
  }, {
    key: "getTargetX",
    value: function getTargetX() {
      return this.chainTo ? this.chainTo.x : this.targetX;
    }
  }, {
    key: "getTargetY",
    value: function getTargetY() {
      return this.chainTo ? this.chainTo.y : this.targetY;
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