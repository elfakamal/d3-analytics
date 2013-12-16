define(["./axial.horizontal.chart.viz", "d3", "constants", "color"],
function(ViewAxialHorizontalChart, d3, constants, Color)
{
	return ViewAxialHorizontalChart.extend(
	{

		/**
		 * overriding the parent initialize function in order to assign some fields.
		 */
		initialize: function()
		{
			ViewAxialHorizontalChart.prototype.initialize.call(this);
			this.orientation = constants.RIGHT;
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initColorScale: function()
		{
			ViewAxialHorizontalChart.prototype.initColorScale.call(this);

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
			ViewAxialHorizontalChart.prototype.initXAxis.call(this);
			this.xAxis.tickFormat(d3.format(".2s"));
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initYAxis: function()
		{
			ViewAxialHorizontalChart.prototype.initYAxis.call(this);
			this.yGroupScale = d3.scale.ordinal();
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
			var xDomain;

			//global Y scale
			this.yScale.domain(this.data.map(function(d) { return d[self.columns[0]]; }));

			//group internal Y scale
			this.yGroupScale.domain(this.groupValues).rangeRoundBands([0, this.yScale.rangeBand()]);

			xDomain = [
				d3.min(this.data, function(d) { return d3.min(d.values, function(d) { return d.value; }); }),
				d3.max(this.data, function(d) { return d3.max(d.values, function(d) { return d.value; }); })
			];
			this.xScale.domain(xDomain).nice();
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
					return "translate(0," + self.yScale(d[self.columns[0]]) + ")";
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
		 * We override this because we need to use the "value" key assigned during
		 * the sanitizeData process.
		 *
		 * @returns {function}
		 */
		getBarsPosY: function()
		{
			var self = this;
			return function(d) { return self.yGroupScale(d.name); };
		},

		/**
		 *
		 * @returns {function}
		 */
		getBarsHeight: function()
		{
			return this.yGroupScale.rangeBand();
		},

		/**
		 * in the horizontal bars chart, it's the second values that matters.
		 */
		getXScaleColumn: function()
		{
			return "value"
		},

		getYScaleColumn: function()
		{
			return "name";
		}

	});
});