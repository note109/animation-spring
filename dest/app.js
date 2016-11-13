"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stage = void 0;
var cursor = {
  x: 0,
  y: 0,
  dragging: false,
  circle: undefined
};
var hold = false;

$(function () {
  var circle1 = new Circle(150, 150, 40);
  var circle2 = new Circle(150, 250, 40);
  var circle3 = new Circle(250, 150, 40);

  circle1.setChainTos([circle2, circle3]);
  circle2.setChainTos([circle1, circle3]);
  circle3.setChainTos([circle1, circle2]);

  stage = new Stage([circle1, circle2, circle3]);
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

$(window).on("keypress", function (e) {
  hold = true;
});

$(window).on("keyup", function (e) {
  hold = false;
});

var getId = function () {
  var id = 0;
  return function () {
    return id++;
  };
}();

var Circle = function () {
  function Circle(x, y, r) {
    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.r = r;
    this.id = getId();

    this.spring = 0.1;
    this.friction = 0.85;

    this.vx = 50;

    this.vy = 0;
    this.gravity = 0;

    this.chainTos = [];

    this.dragged = false;

    this.distance = 150;
  }

  _createClass(Circle, [{
    key: "setChainTos",
    value: function setChainTos(chainTos) {
      this.chainTos = chainTos;
    }
  }, {
    key: "render",
    value: function render(ctx) {
      var _this = this;

      ctx.beginPath();

      if (this.isDragged()) {
        this.x = cursor.x;
        this.y = cursor.y;
      } else {
        if (!hold) {
          this.chainTos.forEach(function (chainTo) {
            var dx = chainTo.x - _this.x;
            var dy = chainTo.y - _this.y;
            var angle = Math.atan2(dy, dx);
            var targetX = chainTo.x - Math.cos(angle) * _this.distance;
            var targetY = chainTo.y - Math.sin(angle) * _this.distance;
            var ax = (targetX - _this.x) * _this.spring;
            var ay = (targetY - _this.y) * _this.spring;
            _this.vx += ax;
            _this.vx *= _this.friction;
            _this.x += _this.vx;

            _this.y += _this.gravity;
            _this.vy += ay;
            _this.vy *= _this.friction;
            _this.y += _this.vy;
          });
        }
      }

      var col = "rgba(73, 195, 179, 0.8)";

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = col;
      ctx.fill();

      this.chainTos.forEach(function (chainTo) {
        var dx = Math.abs(_this.x - chainTo.x);
        var dy = Math.abs(_this.y - chainTo.y);
        var d = Math.sqrt(dx * dx + dy * dy);
        var width = Math.max(30 - d / 30 * 3, 20);

        ctx.beginPath();
        ctx.moveTo(_this.x, _this.y);
        ctx.lineTo(chainTo.x, chainTo.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = col;
        ctx.stroke();
      });
    }
  }, {
    key: "isDragged",
    value: function isDragged() {
      if (cursor.dragging === false) {
        this.dragged = false;
        cursor.circle = undefined;

        return this.dragged;
      }
      if (cursor.circle !== undefined && cursor.circle !== this.id) {
        return false;
      }

      var dx = Math.abs(this.x - cursor.x);
      var dy = Math.abs(this.y - cursor.y);

      if (dx <= this.r && dy <= this.r) {
        this.dragged = true;
        cursor.circle = this.id;
      }

      return this.dragged;
    }
  }, {
    key: "handleDrag",
    value: function handleDrag() {
      this.x = cursor.x;
      this.y = cursor.y;
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
      var _this2 = this;

      this.ctx.clearRect(0, 0, this.width, this.height);

      this.contents.forEach(function (cnt) {
        cnt.render(_this2.ctx);
      });
      requestAnimationFrame(this.render.bind(this));
    }
  }]);

  return Stage;
}();