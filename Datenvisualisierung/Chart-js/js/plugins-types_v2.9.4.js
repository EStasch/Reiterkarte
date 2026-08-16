let _stroke = null;
  const simplePlugin = {
    id: "paintShadow",
    beforeDatasetsDraw: function (chart) {
      if (!_stroke) _stroke = chart.ctx.stroke;
      chart.ctx.stroke = function () {
        if (!chart.ctx) return;
        chart.ctx.save();
        chart.ctx.shadowColor = "rgba(0,0,0,0.2)";
        chart.ctx.shadowBlur = 4;
        chart.ctx.shadowOffsetX = 1;
        chart.ctx.shadowOffsetY = 2;
        _stroke.apply(this, arguments);
        chart.ctx.restore();
      };
    },
  };

  //Chart.plugins.register(simplePlugin);


  //Alternative Class
  const ShadowLineElement = Chart.elements.Line.extend({
  draw () {
    

		console.log(this)

    const { ctx } = this._chart

    const originalStroke = ctx.stroke

    ctx.stroke = function () {
      ctx.save()
      ctx.shadowColor = "rgba(0,0,0,0.2)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 2
      originalStroke.apply(this, arguments)
      ctx.restore()
    }
    
    Chart.elements.Line.prototype.draw.apply(this, arguments)
    //Chart.elements.Point.prototype.draw.apply(this, arguments)

    
    ctx.stroke = originalStroke;
  }
})

Chart.defaults.ShadowLine = Chart.defaults.line
Chart.controllers.ShadowLine = Chart.controllers.line.extend({
  datasetElementType: ShadowLineElement
})