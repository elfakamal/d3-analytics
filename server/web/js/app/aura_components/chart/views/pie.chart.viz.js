define(["./chart.viz", "d3", "constants", "color"],
function(ViewChart, d3, constants, Color)
{

	return ViewChart.extend(
	{

		arcModel: null,
		pieLayout: null,


		radius :function()
		{
			return Math.min(this.width, this.height) / 2;
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
			var posX = this.width/2 + this.marginLeft();
			var posY = this.height/2 + this.marginTop();

			this.svg.attr("transform", "translate(" + posX + "," + posY + ")");
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
			this.svg.selectAll(".arc")
				.append("path")
					.attr("class", "path")
					.on('mouseover', this.onPathMouseOver())
					.on('mouseout', this.onPathMouseOut());
		},

		onPathMouseOver: function()
		{
			var self = this;

			return function(d)
			{
				var currentRGBAColor = d3.select(this).style('fill');
				var color = new Color(currentRGBAColor);
				color.setAlpha(1);
				d3.select(this).style('fill', color.toRGBAString());

				if(self.chartData && +self.chartData.size === 1)
					d3.select(this.parentNode).select("text").style("display", "block");
			};
		},

		onPathMouseOut: function()
		{
			var self = this;

			return function(d)
			{
				var currentRGBAColor = d3.select(this).style('fill');
				var color = new Color(currentRGBAColor);
				color.setAlpha(.5);
				d3.select(this).style('fill', color.toRGBAString());

				if(self.chartData && +self.chartData.size === 1)
					d3.select(this.parentNode).select("text").style("display", "none");
			};
		},

		drawTexts: function()
		{
			this.svg.selectAll(".arc")
				.append("text")
					.attr("class", "text")

					//TODO: complete this stuff ...
					.on('mouseover', this.onTextMouseOver())
					.on('mouseout', this.onTextMouseOut());

			if(this.chartData && +this.chartData.size === 1)
			{
				this.svg.selectAll(".text").style("display", "none");
			}
			else
			{
				this.svg.selectAll(".text").style("display", "block");
			}
		},

		onTextMouseOver: function()
		{
			var self = this;
			var accessor = this.onPathMouseOver();

			return function(d)
			{
				var path = d3.select(this.parentNode).select("path")[0][0];
				accessor.apply(path, [d]);
			};
		},

		onTextMouseOut: function()
		{
			var self = this;
			var accessor = this.onPathMouseOut();

			return function(d)
			{
				var path = d3.select(this.parentNode).select("path")[0][0];
				accessor.apply(path, [d]);
			};
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
				.style("fill", "white")
				.style("font-weight", "bold")
				.style("text-anchor", "middle")
				.text(function(d)
				{
					return d.data[self.getKeyColumn()];
				});

			if(this.chartData && +this.chartData.size === 1)
			{
				this.svg.selectAll(".text").style("display", "none");
			}
			else
			{
				this.svg.selectAll(".text").style("display", "block");
			}
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
		},

		marginTop: function()
		{
			return 5;
		},

		marginRight: function()
		{
			return 5;
		},

		marginBottom: function()
		{
			return 5;
		},

		marginLeft: function()
		{
			return 5;
		}

	});

});
