define(["./bar.vertical.chart.viz", "d3", "constants"],
function(ViewBarVerticalChart, d3, constants)
{
	return ViewBarVerticalChart.extend(
	{
		groupValues: null,
		colorScale: null,

		initParameters: function()
		{
			ViewBarVerticalChart.prototype.initParameters.call(this);

			this.colorScale = d3.scale.ordinal().range([
				"#98abc5",
				"#8a89a6",
				"#7b6888",
				"#6b486b",
				"#a05d56",
				"#d0743c",
				"#ff8c00"
			]);
		},

		sanitizeData: function()
		{
			var self = this;
			this.groupValues = _.rest(_.values(this.columns));

			_.each(this.data, function(d) {
				d.values = self.groupValues.map(function(name) {
					return {name: name, value: +d[name]};
				});
			});
		},

		initXAxis: function()
		{
			ViewBarVerticalChart.prototype.initXAxis.call(this);
			this.xGroupScale = d3.scale.ordinal();
		},

		initYAxis: function()
		{
			ViewBarVerticalChart.prototype.initYAxis.call(this);
			this.yAxis.tickFormat(d3.format(".2s"));
		},

		updateScales: function()
		{
			var self = this, yDomain = [];

			//global X scale
			this.xScale.domain(this.data.map(function(d) { return d[self.getXScaleColumn()]; }));

			//group internal X scale
			this.xGroupScale.domain(this.groupValues).rangeRoundBands([0, this.xScale.rangeBand()]);

			yDomain = [
				0,
				d3.max(this.data, function(d) { return d3.max(d.values, function(d) { return d.value; }); })
			];
			this.yScale.domain(yDomain).nice();
		},

		drawBars: function()
		{
			var group = this.svg.selectAll(".group")
				.data(this.data)
				.enter().append("g")
					.attr("class", "group");

			group.selectAll(".bar")
				.data(function(d) { return d.values; })
				.enter().append("rect")
					.attr("class", "bar");
		},

		updateBars: function()
		{
			var self = this;

			var group = this.svg.selectAll(".group")
				.attr("transform", function(d) {
					var x = self.xScale;
					return "translate(" + x(d[self.getXScaleColumn()]) + ",0)";
				});

			group.selectAll(".bar")
				.attr("width", self.xGroupScale.rangeBand())
				.attr("x", function(d) {var x = self.xGroupScale; return x(d.name); })
				.attr("y", function(d) {var y = self.yScale; return y(d.value); })
				.attr("height", function(d) {return self.height - self.yScale(d.value); })
				.style("fill", function(d) { return self.colorScale(d.name); });
		}

	});
});
