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
			this.defaultOrientation = constants.RIGHT;
			this.orientation = constants.RIGHT;
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
			if(this.orientation === constants.RIGHT)
				this.xScale = d3.scale.linear().range([0, this.width]);
			else
				this.xScale = d3.scale.linear().range([this.width, 0]);

			this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
		},

		initYAxis: function()
		{
			var padding = .1;
			this.yScale = d3.scale.ordinal().rangeRoundBands([0, this.height], padding);
			var orient = this.orientation === constants.LEFT ? constants.RIGHT : constants.LEFT;
			this.yAxis = d3.svg.axis().scale(this.yScale).orient(orient);
		},

		/**
		 * Abstract function
		 */
		drawXDomainLines: function()
		{

		},

		/**
		 * Abstract function
		 */
		drawYDomainLines: function()
		{

		},

		updateScales: function()
		{
			var self = this, xDomain = [];

			//but this seems to be better.
			xDomain = d3.extent(this.data, function(d){return d[self.getXScaleColumn()];});

			self.xScale.domain(xDomain).nice();
			self.yScale.domain(this.data.map(function(d) { return d[self.getYScaleColumn()]; }));
		},

		/**
		 *
		 */
		getBarsPosX: function()
		{
			var self = this;
			return function(d) {
				var x = self.xScale;

				if(self.orientation === constants.RIGHT)
					return x(Math.min(0, d[self.getXScaleColumn()]));
				else
					return x(Math.max(0, d[self.getXScaleColumn()]));
			}
		},

		/**
		 *
		 */
		getBarsPosY: function()
		{
			var self = this;
			return function(d) {
				var y = self.yScale;
				return y(d[self.getYScaleColumn()]);
			}
		},

		/**
		 * the bars must have the width that correspond to the xScale, because this
		 * chart is horizontal.
		 */
		getBarsWidth: function()
		{
			var self = this;
			return function(d) {
				var x = self.xScale;
				return Math.abs(x(d[self.getXScaleColumn()]) - x(0));
			};
		},

		getBarsHeight: function()
		{
			return this.yScale.rangeBand();
		},

		/**
		 * in the horizontal bars chart, it's the second values that matters.
		 */
		getXScaleColumn: function()
		{
			return this.columns[1];
		},

		getYScaleColumn: function()
		{
			return this.columns[0];
		},

		getChartValueColumn: function()
		{
			return this.getXScaleColumn();
		},

		updateXAxis: function()
		{
			this.svg.select(".x.axis")
				.attr("transform", "translate(0," + this.height + ")")
				.call(this.xAxis);
		},

		updateYAxis: function()
		{
			var x = this.xScale;
			this.svg.select(".y.axis")
				.attr("transform", "translate(" + x(0) + ",0)")
				.call(this.yAxis);
		}

	});

});
