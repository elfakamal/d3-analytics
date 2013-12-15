define(["./chart.viz", "d3", "constants", "color"],
function(ViewChart, d3, constants, Color)
{

	return ViewChart.extend(
	{

		formatPercent	: d3.format(".0%"),

		xScale				: null,
		yScale				: null,

		xAxis					: null,
		yAxis					: null,

		xTicks				: false,
		yTicks				: false,

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


		/***************************************************************************
		 *
		 * INITIALIZERS
		 *
		 **************************************************************************/

		/**
		 *
		 * @returns {undefined}
		 */
		initParameters: function()
		{
			ViewChart.prototype.initParameters.call(this);

			this.initXAxis();
			this.initYAxis();
			this.drawXDomainLines();
			this.drawYDomainLines();
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

		sanitizeData: function()
		{
			var self = this;
			_.map(this.data, function(row)
			{
				row[self.getChartValueColumn()] = +row[self.getChartValueColumn()];
				return row;
			});
		},

		/***************************************************************************
		 *
		 * DRAWERS
		 *
		 **************************************************************************/

		/**
		 *
		 */
		drawChart: function()
		{
			ViewChart.prototype.drawChart.call(this);

			this.drawXAxis();
			this.drawYAxis();
			this.drawBars();
			this.initBarsListeners();
			this.update();
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
		 * intializes the x axis ticks to draw them.
		 */
		drawXDomainLines: function()
		{
			if(this.xTicks === true)
				this.xAxis.tickSize(-this.height);
		},

		/**
		 * intializes the y axis ticks to draw them.
		 */
		drawYDomainLines: function()
		{
			if(this.yTicks === true)
				this.yAxis.tickSize(-this.width);
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

		initBarsListeners: function()
		{
			this.svg.selectAll(".bar")
//				.on('click', this.onBarClick())
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
//				var sanitized = currentRGBAColor.replace(/\s|[a-z]+|[\(\)]/g, "");
//				var colorArray = sanitized.split(",");
//				colorArray[colorArray.length - 1] = "1";
//				d3.select(this).style('fill', "rgba(" + colorArray.join(",") + ")");

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
//				var sanitized = currentRGBAColor.replace(/\s|[a-z]+|[\(\)]/g, "");
//				var colorArray = sanitized.split(",");
//				colorArray[colorArray.length - 1] = "0.5";
//				d3.select(this).style('fill', "rgba(" + colorArray.join(",") + ")");

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

		/***************************************************************************
		 *
		 * UPDATERS
		 *
		 **************************************************************************/

		/**
		 * updates all chart's parameters.
		 *
		 * @returns {undefined}
		 */
		update: function()
		{
			ViewChart.prototype.update.call(this);

			this.updateScales();
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
			var self = this;

			this.svg.selectAll(".bar")

				.style('fill', function(d) { return self.colorScale(d[self.getXScaleColumn()]); })

				.attr("x", this.getBarsPosX())
				.attr("y", this.getBarsPosY())

				.attr("width", this.getBarsWidth())
				.attr("height", this.getBarsHeight());
		},

		/***************************************************************************
		 *
		 * GETTERS
		 *
		 **************************************************************************/

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
		}
	});

});


