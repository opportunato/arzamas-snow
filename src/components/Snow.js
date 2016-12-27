import React from 'react';

class Snow extends React.Component {
  start(el) {
    var w = el.getBoundingClientRect().width,
      h = el.getBoundingClientRect().height,
      ctx = el.getContext('2d'),
      arc = 500,
      time,
      count,
      size = 2,
      speed = 5,
      lights = [];

    el.setAttribute('width', w + 'px');
    el.setAttribute('height', h + 'px');

    function init() {
      time = 0;
      count = 0;

      for(var i = 0; i < arc; i++) {
        lights[i] = {
          x: Math.ceil(Math.random() * w),
          y: Math.ceil(Math.random() * h),
          toX: Math.random() * 5 + 1,
          toY: Math.random() * 5 + 1,
          c: "rgba(255, 255, 255, 0.5)",
          size: Math.random() * size
        }
      }
    }

    function bubble() {
      ctx.clearRect(0,0,w,h);

      for(var i = 0; i < arc; i++) {
        var li = lights[i];

        ctx.beginPath();
        ctx.arc(li.x,li.y,li.size,0,Math.PI*2,false);
        ctx.fillStyle = li.c;
        ctx.fill();

        li.x = li.x + li.toX * (time * 0.05);
        li.y = li.y + li.toY * (time * 0.05);

        if(li.x > w) { li.x = 0; }
        if(li.y > h) { li.y = 0; }
        if(li.x < 0) { li.x = w; }
        if(li.y < 0) { li.y = h; }
      }
      if(time < speed) {
        time++;
      }
      requestAnimationFrame(bubble);
    }
    init();
    bubble();
  }

  render() {
    return <canvas className="xx-snow" ref={this.start} />;
  }
}

export default Snow;
