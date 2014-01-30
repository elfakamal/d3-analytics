define(["./line.chart.viz", "d3"],
function(ViewLineChart, d3)
{
	return ViewLineChart.extend(
	{

		initPath:function()
		{
			var self = this;
			this.path = d3.svg.area()
				.x(function(d) { return self.xScale(d[self.getXScaleColumn()]); })
				.y0(this.height)
				.y1(function(d) { return self.yScale(d[self.getYScaleColumn()]); });
		},

		drawContent: function()
		{
			var self = this;
			this.svg.append("path")
				.datum(this.data)
				.attr("class", "area path")
				.attr("d", this.path)
				.style('fill', 'rgba(10,200,200,.5)');
		}

	});

});