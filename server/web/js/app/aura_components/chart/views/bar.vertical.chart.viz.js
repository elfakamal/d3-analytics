define(["./bar.chart.viz", "d3", "constants", "color"],
function(ViewBarChart, d3, constants, Color)
{
	return ViewBarChart.extend(
	{
		/**
		 * overriding the parent initialize function in order to assign some fields.
		 */
		initialize: function()
		{
			this.defaultOrientation = constants.TOP;
			this.orientation = constants.TOP;
			ViewBarChart.prototype.initialize.call(this);
		},

		marginRight: function()
		{
			var defaultMargin = 20;
			if(this.chartData && +this.chartData.size === 1)
				return 10;

			if(this.orientation === constants.LEFT)
				return 40;

			return defaultMargin;
		},

		marginLeft: function()
		{
			var defaultMargin = 40;
			if(this.chartData && +this.chartData.size === 1)
				return 10;

			return defaultMargin;
		},

		initXAxis: function()
		{
			var padding = .1;
			this.xScale = d3.scale.ordinal().rangeRoundBands([0, this.width], padding);
			var orient = this.orientation === constants.TOP ? constants.BOTTOM : constants.TOP;
			this.xAxis = d3.svg.axis().scale(this.xScale).orient(orient);
		},

		initYAxis: function()
		{
			if(this.orientation === constants.TOP)
				this.yScale = d3.scale.linear().range([this.height, 0]);
			else
				this.yScale = d3.scale.linear().range([0, this.height]);

			this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");
		},

		updateScales: function()
		{
			var self = this, xDomain = [];
			self.xScale.domain(this.data.map(function(d) { return d[self.getXScaleColumn()]; }));
			xDomain = d3.extent(this.data, function(d){return d[self.getYScaleColumn()];});
			self.yScale.domain(xDomain).nice();
		},

		/**
		 * the bars must begin from the x = 0.
		 */
		getBarsPosX: function()
		{
			var self = this;
			return function(d) {
				var x = self.xScale;
				return x(d[self.getXScaleColumn()]);
			}
		},

		getBarsPosY: function()
		{
			var self = this;
			return function(d) {
				var y = self.yScale;

				if(self.orientation === constants.TOP)
					return y(Math.max(0, d[self.getYScaleColumn()]));
				else
					return y(Math.min(0, d[self.getYScaleColumn()]));
			}
		},

		/**
		 * the bars must have the width that correspond to the xScale, because this
		 * chart is horizontal.
		 */
		getBarsWidth: function()
		{
			return this.xScale.rangeBand();
		},

		getBarsHeight: function()
		{
			var self = this;
			return function(d)
			{
				var y = self.yScale;
				return Math.abs(y(d[self.getYScaleColumn()]) - y(0));
			};
		},

		/**
		 * in the horizontal bars chart, it's the second values that matters.
		 */
		getXScaleColumn: function()
		{
			return this.columns[0];
		},

		getYScaleColumn: function()
		{
			return this.columns[1];
		},

		getChartValueColumn: function()
		{
			return this.getYScaleColumn();
		},

		updateXAxis: function()
		{
			var y = this.yScale;
			this.svg.select(".x.axis")
				.attr("transform", "translate(0," + y(0) + ")")
				.call(this.xAxis);
		},

		updateYAxis: function()
		{
			this.svg.select(".y.axis").call(this.yAxis);
		}

	});

});
