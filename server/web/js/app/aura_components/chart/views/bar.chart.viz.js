define(["./chart.viz", "d3", "constants", "color"],
function(ViewChart, d3, constants, Color)
{

	return ViewChart.extend(
	{
		defaultOrtientation	: "",
		orientation					: "",

		formatPercent	: d3.format(".0%"),

		width					: null,
		height				: null,

		xScale				: null,
		yScale				: null,

		xAxis					: null,
		yAxis					: null,

		columns			: {},

		/**
		 *free memory from the other fields.
		 */
		dispose: function()
		{
			this.formatPercent = null,
			this.width = null;
			this.height = null;
			this.xScale = null;
			this.yScale = null;
			this.xAxis = null;
			this.yAxis = null;
			this.columns = null;

			ViewChart.prototype.dispose.call(this);
		},

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

			this.initXAxis();
			this.initYAxis();
		},

		/**
		 * Abstract function
		 */
		initXAxis: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		initYAxis: function()
		{
			throw new Error("This is an abstract method, you must override it.");
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
			this.sanitizeData();
			this.drawChart();
		},

		sanitizeData: function()
		{
			var self = this;
			_.map(this.data, function(row)
			{
				row[self.getChartValueColumn()] = +row[self.getChartValueColumn()];
				return row;
			});
		},

		/**
		 *
		 */
		drawChart: function()
		{
			this.drawBase();
			this.drawXAxis();
			this.drawYAxis();
			this.drawXDomainLines();
			this.drawYDomainLines();
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
				.attr("class", "y axis");
//				.append("text")
//					.attr("class", "caption")
//					.attr("transform", "rotate(-90)")
//					.style("text-anchor", "end")
//					.text(_(this.columns[1]).capitalize());
		},

		/**
		 * Abstract function
		 */
		drawXDomainLines: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		drawYDomainLines: function()
		{
			throw new Error("This is an abstract method, you must override it.");
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
					.attr("class", "bar")
//					.on('click', this.onBarClick())
					.on('mouseover', this.onBarMouseOver())
					.on('mouseout', this.onBarMouseOut());
		},

		onBarClick: function()
		{
			var self = this;

			return function(d)
			{
				self.createTip(d, this);
			};
		},

		onBarMouseOver: function()
		{
			var self = this;

			return function(d)
			{
				var currentRGBAColor = d3.select(this).style('fill');
				var color = new Color(currentRGBAColor);
				color.setAlpha(1);
				d3.select(this).style('fill', color.toRGBAString());
				self.createTip(d, this);
			};
		},

		onBarMouseOut: function()
		{
			var self = this;

			return function(d)
			{
				var currentRGBAColor = d3.select(this).style('fill');
				var color = new Color(currentRGBAColor);
				color.setAlpha(.5);
				d3.select(this).style('fill', color.toRGBAString());
				self.svg.select('.tip').remove();
			};
		},

		createTip: function(d, rect)
		{
			var posX = d3.select(rect).attr("x");
			var posY = d3.select(rect).attr("y") - constants.TIP_MARGIN_BOTTOM;

			(posY <= this.marginTop()) && (posY = this.marginTop());

			this.svg.select('.tip').remove();

			var tipContainer = this.svg.append("g")
				.attr("class", "tip")
				.attr("transform", "translate(" + posX + "," + posY + ")");

//			var tipBG = tipContainer.append("rect")
//				.style('fill', 'rgba(255, 255, 255, .7)')
//				.attr("x", this.xScale.rangeBand()/2 - constants.TIP_WIDTH/2)
//				.attr("y", -constants.TIP_HEIGHT)
//				.attr("width", constants.TIP_WIDTH)
//				.attr("height", constants.TIP_HEIGHT);

			var text = tipContainer.append("text")
				.attr("y", -constants.TIP_MARGIN_BOTTOM)
				.style('fill', 'rgb(50, 50, 50)')
				.style('font-weight', 'bold')
				.text(d[this.columns[1]]);
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
		 * Abstract function
		 */
		updateScales: function()
		{
			throw new Error("This is an abstract method, you must override it.");
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
		 * Abstract function
		 */
		updateXAxis: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		updateYAxis: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		updateText: function()
		{
			this.svg.select(".y.axis")
				.select("text").attr("y", 6).attr("dy", ".71em");
		},

		/**
		 *
		 */
		updateBars: function()
		{
			var colorsDictionary = this.getColorDictionary();
			var color = new Color(colorsDictionary[1]);
			color.setAlpha(.5);

			this.svg.selectAll(".bar")

				.style('fill', color.toRGBAString())

				.attr("x", this.getBarsPosX())
				.attr("y", this.getBarsPosY())

				.attr("width", this.getBarsWidth())
				.attr("height", this.getBarsHeight());
		},

		/**
		 * Abstract function
		 */
		getBarsPosX: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getBarsPosY: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getBarsWidth: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getBarsHeight: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getXScaleColumn: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getYScaleColumn: function()
		{
			throw new Error("This is an abstract method, you must override it.");
		},

		/**
		 * Abstract function
		 */
		getChartValueColumn: function()
		{
			throw new Error("This is an abstract method, you must override it.");
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


