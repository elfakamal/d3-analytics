define(["./chart.viz", "d3"],
function(ViewChart, d3)
{

	return ViewChart.extend(
	{
		formatPercent	: d3.format(".0%"),
		margin				: {top: 20, right: 20, bottom: 30, left: 40},

		realWidth			: 700,
		realHeight		: 300,

		width					: null,
		height				: null,

		xScale				: null,
		yScale				: null,

		xAxis					: null,
		yAxis					: null,


		/**
		 *
		 * @returns {undefined}
		 */
		initialize: function ()
		{
			this.render();
		},

//		lol: function()
//		{
//			this.realWidth += 10;
//			this.realHeight += 10;
//			this.initParameters();
//			this.update();
//		},

		/**
		 *
		 * @returns {undefined}
		 */
		initParameters: function()
		{
			this.width = this.realWidth - this.margin.left - this.margin.right;
			this.height = this.realHeight - this.margin.top - this.margin.bottom;

			this.xScale = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
			this.yScale = d3.scale.linear().range([this.height, 0]);

			this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
			this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").tickFormat(this.formatPercent);
		},

		/**
		 *
		 * @returns {undefined}
		 */
		render: function()
		{
			this.initParameters();
			this.initBase();
			this.initDatasource();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initBase: function()
		{
			this.$el.html("");
			var vizSelection = d3.select("#li-viz-" + this.model.get('id'));
			var viz = vizSelection.select("#div-chart-component");

			this.svg = viz.append("svg")
					.attr("width", this.width + this.margin.left + this.margin.right)
					.attr("height", this.height + this.margin.top + this.margin.bottom)
					.attr("class", "absolute-center")
			  .append("g")
					.attr("class", "first-g")
					.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initDatasource: function()
		{
			this.model.loadDatasource(this.onLoaderComplete, this.accessor, this);
		},

		/**
		 *
		 * @param {Object} data
		 * @returns {undefined}
		 */
		onLoaderComplete: function(data)
		{
			var columns = this.model.getDatasource().getColumns();
			console.log(columns);

			this.data = data;

			this.svg.append("g")
				.attr("class", "x axis");

			this.svg.append("g")
				.attr("class", "y axis")
				.append("text")
				.attr("transform", "rotate(-90)")
				.style("text-anchor", "end")
				.text("Frequency");

			this.svg.selectAll(".bar")
				.data(data)
				.enter().append("rect")
				.attr("class", "bar");

			this.update();
		},

		/**
		 *
		 * @param {Object} d
		 * @returns {Object}
		 */
		accessor: function(d)
		{
			d.frequency = +d.frequency;
			return d;
		},

		/**
		 *
		 * @returns {undefined}
		 */
		update: function()
		{
			var self = this;

			self.xScale.domain(this.data.map(function(d) { return d.letter; }));
			self.yScale.domain([0, d3.max(this.data, function(d) { return d.frequency; })]);

			d3.select("#li-viz-" + this.model.get('id'))
				.select("svg")
				.attr("width", this.width + this.margin.left + this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom);

			this.svg.select(".first-g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

			this.svg.select(".x.axis")
				.attr("transform", "translate(0," + this.height + ")")
				.call(this.xAxis);

			var yAxises = this.svg.select(".y.axis").call(this.yAxis);

			yAxises.select("text").attr("y", 6)
				.attr("dy", ".71em");

			this.svg.selectAll(".bar")
				.attr("x", function(d) { var x = self.xScale; return x(d.letter); })
				.attr("width", this.xScale.rangeBand())
				.attr("y", function(d) { var y = self.yScale; return y(d.frequency); })
				.attr("height", function(d) { var y = self.yScale; return self.height - y(d.frequency); });
		}

	});

});


