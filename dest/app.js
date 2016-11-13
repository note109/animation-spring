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
  var handle1 = new Handle(257, 221, 10);
  var handle2 = new Handle(368, 117, 20);
  var handle3 = new Handle(500, 149, 30);
  var handle4 = new Handle(553, 278, 20);
  var handle5 = new Handle(458, 347, 20);
  var handle6 = new Handle(314, 369, 20);

  var handles = [handle1, handle2, handle3, handle4, handle5, handle6];

  circle = new Circle(150, 150, 40, handles);
  stage = new Stage([circle].concat(handles));
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
    this.dragged = false;
  }

  _createClass(Handle, [{
    key: "render",
    value: function render(ctx) {
      ctx.beginPath();

      if (this.isDragged()) {
        this.handleDrag();
      }

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgba(204, 61, 58, 0.8)";
      ctx.fill();
    }
  }, {
    key: "isDragged",
    value: function isDragged() {
      if (cursor.dragging === false) {
        this.dragged = false;

        return this.dragged;
      }
      var dx = Math.abs(this.x - cursor.x);
      var dy = Math.abs(this.y - cursor.y);

      if (dx <= this.r && dy <= this.r) {
        this.dragged = true;
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

  return Handle;
}();

var Circle = function () {
  function Circle(x, y, r, chainTos) {
    _classCallCheck(this, Circle);

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

  _createClass(Circle, [{
    key: "render",
    value: function render(ctx) {
      var _this = this;

      ctx.beginPath();

      this.chainTos.forEach(function (chainTo) {
        var dx = _this.getTargetX(chainTo) - _this.x;
        var ax = dx * _this.spring;
        _this.vx += ax;
        _this.vx *= _this.friction;
        _this.x += _this.vx;

        var dy = _this.getTargetY(chainTo) - _this.y;
        var ay = dy * _this.spring;
        _this.y += _this.gravity;
        _this.vy += ay;
        _this.vy *= _this.friction;
        _this.y += _this.vy;
      });

      var col = "rgba(73, 195, 179, 0.8)";

      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fillStyle = col;
      ctx.fill();

      this.chainTos.forEach(function (chainTo) {
        var dx = Math.abs(_this.x - chainTo.x);
        var dy = Math.abs(_this.y - chainTo.y);
        var d = Math.sqrt(dx * dx + dy * dy);
        var width = Math.max(60 - d / 30 * 3, 20);

        ctx.beginPath();
        ctx.moveTo(_this.x, _this.y);
        ctx.lineTo(chainTo.x, chainTo.y);
        ctx.lineWidth = width;
        ctx.strokeStyle = col;
        ctx.stroke();
      });
    }
  }, {
    key: "getTargetX",
    value: function getTargetX(chain) {
      return chain.x;
    }
  }, {
    key: "getTargetY",
    value: function getTargetY(chain) {
      return chain.y;
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