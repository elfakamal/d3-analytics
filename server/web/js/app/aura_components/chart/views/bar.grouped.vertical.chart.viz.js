define(["./bar.vertical.chart.viz", "d3", "constants"],
function(ViewAxialVerticalChart, d3, constants)
{
	return ViewAxialVerticalChart.extend(
	{
		groupValues: null,

		/**
		 * overriding the parent initialize function in order to assign some fields.
		 */
		initialize: function()
		{
			this.orientation = constants.TOP;
			ViewAxialVerticalChart.prototype.initialize.call(this);
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initColorScale: function()
		{
			ViewAxialVerticalChart.prototype.initColorScale.call(this);

//			this.colorScale.range([
//				"#98abc5",
//				"#8a89a6",
//				"#7b6888",
//				"#6b486b",
//				"#a05d56",
//				"#d0743c",
//				"#ff8c00"
//			]);
		},

		/**
		 * temporary
		 *
		 * @returns {Array}
		 */
		getColorDictionary:function(){
			return this.generateColors();
		},

		/**
		 * Prepare, structure and convert the data so it can be easy to handle
		 * by the accessors.
		 *
		 * @returns {undefined}
		 */
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

		/**
		 * Defining group's internal X scale, "this.xGroupScale".
		 *
		 * @returns {undefined}
		 */
		initXAxis: function()
		{
			ViewAxialVerticalChart.prototype.initXAxis.call(this);
			this.xGroupScale = d3.scale.ordinal();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initYAxis: function()
		{
			ViewAxialVerticalChart.prototype.initYAxis.call(this);
			this.yAxis.tickFormat(d3.format(".2s"));
		},

		/**
		 * As we are dealing with grouped bars, it's necessary to override
		 * this function to redraw the bars within the already drawn groups.
		 *
		 * @returns {undefined}
		 */
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

		updateScales: function()
		{
			var self = this;
			var yDomain;

			//global X scale
			this.xScale.domain(this.data.map(function(d) { return d[self.getXScaleColumn()]; }));

			//group internal X scale
			this.xGroupScale.domain(this.groupValues).rangeRoundBands([0, this.xScale.rangeBand()]);

			yDomain = [
				d3.min(this.data, function(d) { return d3.min(d.values, function(d) { return d.value; }); }),
				d3.max(this.data, function(d) { return d3.max(d.values, function(d) { return d.value; }); })
			];
			this.yScale.domain(yDomain).nice();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		updateContent: function()
		{
			var self = this;

			var group = this.svg.selectAll(".group")
				.attr("transform", function(d) {
					var x = self.xScale;
					return "translate(" + x(d[self.getXScaleColumn()]) + ",0)";
				});

			group.selectAll(".bar")

				.attr("x", this.getBarsPosX())
				.attr("y", this.getBarsPosY())

				.attr("width", this.getBarsWidth())
				.attr("height", this.getBarsHeight())

				.style("fill", function(d) { return self.colorScale(d.name); });
		},

		/**
		 * Overriden from bar.vertical.chart.viz
		 *
		 * We override this because we need to use this.xGroupScale, and the "name"
		 * key for the groups.
		 *
		 * @returns {function}
		 */
		getBarsPosX: function()
		{
			var self = this;
			return function(d) {
				var x = self.xGroupScale;
				return x(d.name);
			};
		},

		/**
		 * Overriden from bar.vertical.chart.viz
		 *
		 * We override this because we need to use the "value" key assigned during
		 * the sanitizeData process.
		 *
		 * @returns {function}
		 */
		getBarsPosY: function()
		{
			var self = this;
			return function(d) {
				var y = self.yScale;
				return y(Math.max(0, d.value));
			};
		},

		/**
		 * the bars must have the width that correspond to the xScale, because this
		 * chart is vertical.
		 *
		 * @returns {function}
		 */
		getBarsWidth: function()
		{
			return this.xGroupScale.rangeBand();
		},

		/**
		 *
		 * @returns {function}
		 */
		getBarsHeight: function()
		{
			var self = this;
			return function(d) {
				var y = self.yScale;
				return Math.abs(y(d.value) - y(0));
			};
		}

	});
});
