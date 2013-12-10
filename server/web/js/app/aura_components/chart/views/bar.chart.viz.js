define(["./chart.viz", "d3", "constants"],
function(ViewChart, d3, constants)
{

	return ViewChart.extend(
	{
		formatPercent	: d3.format(".0%"),

		marginTop: function()
		{
			var defaultMargin = 10;
			if(this.chartData && +this.chartData.size === 1) return 10;
			return defaultMargin;
		},

		marginRight: function()
		{
			var defaultMargin = 10;
			if(this.chartData && +this.chartData.size === 1) return 10;
			return defaultMargin;
		},

		marginBottom: function()
		{
			var defaultMargin = 30;
			if(this.chartData && +this.chartData.size === 1) return 10;
			return defaultMargin;
		},

		marginLeft: function()
		{
			var defaultMargin = 40;
			if(this.chartData && +this.chartData.size === 1) return 10;
			return defaultMargin;
		},

		/**
		 *
		 */
		realWidth : function()
		{
			var defaultWidth = constants.DEFAULT_THUMB_WIDTH;
			var sizeX = 1;

			if(!_.isEmpty(this.chartData))
				sizeX = constants.VISUALIZATION_SIZES[this.chartData.size][0];

			//piked from the gridster width computing formula.
			return (sizeX * defaultWidth + ((sizeX - 1) * constants.DEFAULT_HORIZONTAL_MARGIN) * 2);
		},

		/**
		 *
		 */
		realHeight : function()
		{
			var defaultHeight = constants.DEFAULT_THUMB_HEIGHT;
			var sizeY = 1;

			if(!_.isEmpty(this.chartData))
				sizeY = constants.VISUALIZATION_SIZES[this.chartData.size][1];

			//piked from the gridster width computing formula.
			var height = (sizeY * defaultHeight + ((sizeY - 1) * constants.DEFAULT_VERTICAL_MARGIN) * 2);
			return height - constants.THUMB_TITLE_HEIGHT;
		},

		width					: null,
		height				: null,

		xScale				: null,
		yScale				: null,

		xAxis					: null,
		yAxis					: null,

		columns			: {},

		/**
		 *
		 * @returns {undefined}
		 */
		initialize: function ()
		{
			this.initListeners();
			this.render();
		},

		initListeners: function()
		{
			this.model.on('change', this.onModelChange, this);
		},

		onModelChange: function()
		{
			this.chartData = JSON.parse(this.model.get("chart_data"));
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initParameters: function()
		{
			this.chartData = JSON.parse(this.model.get("chart_data"));

			this.width = this.realWidth() - this.marginLeft() - this.marginRight();
			this.height = this.realHeight() - this.marginTop() - this.marginBottom();

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
			this.initDatasource();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initDatasource: function()
		{
			if(!this.data)
				this.model.loadDatasource(this.onLoaderComplete, this);
		},

		/**
		 *
		 * @param {Object} data
		 * @returns {undefined}
		 */
		onLoaderComplete: function(data)
		{
			this.columns = this.model.getDatasource().getColumns();
			this.data = data;
			this.drawChart();
		},

		/**
		 *
		 */
		drawChart: function()
		{
			this.drawBase();
			this.drawXAxis();
			this.drawYAxis();
			this.drawBars();
			this.update();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		drawBase: function()
		{
			this.$el.html("");
			var vizSelection = d3.select("#li-viz-" + this.model.get('id'));
			var viz = vizSelection.select("#div-chart-component");

			this.svg = viz.append("svg")
					.attr("width", this.width + this.marginLeft() + this.marginRight())
					.attr("height", this.height + this.marginTop() + this.marginBottom())
					.attr("class", "absolute-center")
					.style("margin-top", "auto")
					.style("margin-bottom", "0px")
				.append("g")
					.attr("class", "first-g")
					.attr("transform", "translate(" + this.marginLeft() + "," + this.marginTop() + ")");
		},

		/**
		 * draws the x axis of the bar chart.
		 */
		drawXAxis: function()
		{
			if(+this.chartData.size === 1)
				return;

			this.svg.append("g").attr("class", "x axis");
		},

		/**
		 * draws the y axis of the bar chart.
		 */
		drawYAxis: function()
		{
			if(+this.chartData.size === 1)
				return;

			this.svg.append("g")
				.attr("class", "y axis")
				.append("text")
					.attr("transform", "rotate(-90)")
					.style("text-anchor", "end")
					.text(_(this.columns[1]).capitalize());
		},

		/**
		 * draws the bar of the bar chart based on the data source.
		 */
		drawBars: function()
		{
			this.svg.selectAll(".bar")
				.data(this.data)
				.enter()
				.append("rect")
					.attr("class", "bar");
		},

		/**
		 * updates all chart's parameters.
		 *
		 * @returns {undefined}
		 */
		update: function()
		{
			this.initParameters();
			this.updateScales();
			this.updateSVG();
			this.updateXAxis();
			this.updateYAxis();
			this.updateBars();
		},

		/**
		 *
		 */
		updateScales: function()
		{
			var self = this;
			self.xScale.domain(this.data.map(function(d) { return d[self.columns[0]]; }));
			self.yScale.domain([0, d3.max(this.data, function(d) { return d[self.columns[1]]; })]);
		},

		/**
		 *
		 */
		updateSVG: function()
		{
			d3.select("#li-viz-" + this.model.get('id'))
				.select("svg")
				.attr("width", this.width + this.marginLeft() + this.marginRight())
				.attr("height", this.height + this.marginTop() + this.marginBottom());

			this.svg.select(".first-g")
				.attr("transform", "translate(" + this.marginLeft() + "," + this.marginTop() + ")");
		},

		/**
		 *
		 */
		updateXAxis: function()
		{
			this.svg.select(".x.axis")
				.attr("transform", "translate(0," + this.height + ")")
				.call(this.xAxis);
		},

		/**
		 *
		 */
		updateYAxis: function()
		{
			var yAxises = this.svg.select(".y.axis").call(this.yAxis);
			yAxises.select("text").attr("y", 6).attr("dy", ".71em");
		},

		/**
		 *
		 */
		updateBars: function()
		{
			var self = this;
			var colorsDictionary = this.getColorDictionary();

			this.svg.selectAll(".bar")
				.style('fill', colorsDictionary[1])

				.attr("x", function(d) { var x = self.xScale; return x(d[self.columns[0]]); })
				.attr("width", this.xScale.rangeBand())

				.attr("y", function(d) { var y = self.yScale; return y(d[self.columns[1]]); })
				.attr("height", function(d) { var y = self.yScale; return self.height - y(d[self.columns[1]]); });
		},

		/**
		 * filling in the dico, example of result: {0 : "#FF5000", 1 : "#50FF00"}
		 *
		 * @returns {undefined}
		 */
		getColorDictionary: function()
		{
			var columns = this.model.getDatasource().getColumns();
			var colorsDico = {};
			var chartData = JSON.parse(this.model.get('chart_data'));

			_.each(columns, function(value, key, list) {
				_.each(chartData.colors, function(pair) {
					if(pair[0] === value) colorsDico[key] = pair[1];
				}, this);
			}, this);

			return colorsDico;
		}

	});

});


