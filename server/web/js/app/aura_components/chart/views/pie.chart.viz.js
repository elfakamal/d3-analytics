define(["./chart.viz", "d3", "constants", "color"],
function(ViewChart, d3, constants, Color)
{

	return ViewChart.extend(
	{

		arcModel: null,
		pieLayout: null,


		radius :function()
		{
			//find out what's with the "10" !!
			return Math.min(this.width, this.height) / 2 - 10;
		},

		innerRadius :function()
		{
			return 0;
		},

		/**
		 *free memory from the other fields.
		 */
		dispose: function()
		{
			this.isDonut = false;
			this.donutTickness = 0;
			this.arcModel = null;
			this.pieLayout = null;

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

			this.initPie();
		},

		initPie: function()
		{
			var self = this;

			this.arcModel = d3.svg.arc()
				.outerRadius(this.radius())
				.innerRadius(this.innerRadius());

			this.pieLayout = d3.layout.pie()
				.sort(null)
				.value(function(d) { return d[self.getValueColumn()]; });
		},

		/**
		 * this function needs to be overriden.
		 */
		initColorScale: function()
		{
			var colors = [];
			if(this.data) colors = this.generateColors(this.data.length);
			this.colorScale = d3.scale.ordinal().range(colors);
		},

		sanitizeData: function()
		{
			var self = this;
			_.map(this.data, function(row)
			{
				row[self.getValueColumn()] = +row[self.getValueColumn()];
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

			this.drawArcs();
			this.drawPath();
			this.drawTexts();

			this.update();
		},

		positionBase: function()
		{
			this.svg.attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");
		},

		drawArcs: function()
		{
			this.svg.selectAll(".arc")
				.data(this.pieLayout(this.data))
				.enter()
				.append("g")
					.attr("class", "arc");
		},

		drawPath: function()
		{
			var self = this;

			this.svg.selectAll(".arc")
				.append("path")
					.attr("class", "path")
					.attr("d", this.arcModel)
					.style("fill", function(d)
					{
						return self.colorScale(d.data[self.getKeyColumn()]);
					});
		},

		drawTexts: function()
		{
			var self = this;

			this.svg.selectAll(".path")
				.append("text")
					.attr("class", "text")
					.attr("transform", function(d)
					{
						return "translate(" + self.arcModel.centroid(d) + ")";
					})
					.attr("dy", ".35em")
					.style("text-anchor", "middle")
					.text(function(d) { return d.data[self.getKeyColumn()]; });
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

			this.updatePath();
			this.updateTexts();
		},

		updatePath: function()
		{
			var self = this;

			this.svg.selectAll(".path")
				.attr("d", this.arcModel)
				.style("fill", function(d)
				{
					return self.colorScale(d.data[self.getKeyColumn()]);
				});
		},

		updateTexts: function()
		{
			var self = this;

			this.svg.selectAll(".text")
				.attr("transform", function(d)
				{
					return "translate(" + self.arcModel.centroid(d) + ")";
				})
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data[self.getKeyColumn()]; });
		},

		/**
		 * Abstract function
		 */
		getKeyColumn: function()
		{
			return this.columns[0];
		},

		/**
		 * Abstract function
		 */
		getValueColumn: function()
		{
			return this.columns[1];
		}
	});

});
