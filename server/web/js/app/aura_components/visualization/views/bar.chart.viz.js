define(["./chart.viz", "d3", "text!../templates/viz.html"],
function(ViewChart, d3, baseTemplate)
{

	return ViewChart.extend(
	{
		formatPercent	: d3.format(".0%"),
		margin			: {top: 20, right: 20, bottom: 30, left: 40},

		realWidth		: 200,
		realHeight		: 100,

		width			: null,
		height			: null,

		xScale			: null,
		yScale			: null,

		xAxis			: null,
		yAxis			: null,

		data			: null,
		svg				: null,



		initialize: function ()
		{
			this.initParameters();
			this.render();
		},

		lol: function()
		{
			this.realWidth += 10;
			this.realHeight += 10;
			this.initParameters();
			this.update();
		},


		initParameters: function()
		{
			this.width = this.realWidth - this.margin.left - this.margin.right;
			this.height = this.realHeight - this.margin.top - this.margin.bottom;

			this.xScale = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
			this.yScale = d3.scale.linear().range([this.height, 0]);

			this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
			this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").tickFormat(this.formatPercent);
		},

		render: function()
		{
			this.initBase();
			this.initDatasource();
		},

		initBase: function()
		{
			console.log("xScale : " + this.xScale);

			var vizSelection	= d3.select("#li-viz-" + this.model.get('id'));
			var viz				= vizSelection.select("#div-viz-content");

			this.svg = viz.append("svg")
				.attr("width", this.width + this.margin.left + this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
				.attr("class", "absolute-center")
			  .append("g")
				.attr("class", "first-g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		},

		initDatasource: function()
		{
			var dsList			= this.model.get('data_sources');
			var ds				= dsList[0];
			var fileName		= ds.file_name;
			var fileExtension	= ds.file_extension;

			if( this.allowedFileTypes.indexOf(fileExtension) < 0 )
			{
				throw new Error("D3 Analytics: File not supported");
				return;
			}

			var path		= "uploads/datasources/" + fileName;
			var d3loader	= d3[fileExtension];

			d3loader.apply(d3, [path])
				.row(this.accessor)
				.get(this.onLoaderComplete());
		},

		onLoaderComplete: function()
		{
			var self = this;

			return function(error, data)
			{
				self.data = data;

				self.xScale.domain(data.map(function(d) { return d.letter; }));
				self.yScale.domain([0, d3.max(data, function(d) { return d.frequency; })]);

				self.svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + self.height + ")")
					.call(self.xAxis);

				self.svg.append("g")
					.attr("class", "y axis")
					.call(self.yAxis)
				  .append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Frequency");

				self.svg.selectAll(".bar")
					.data(data)
				  .enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { var x = self.xScale; return x(d.letter); })
					.attr("width", self.xScale.rangeBand())
					.attr("y", function(d) { var y = self.yScale; return y(d.frequency); })
					.attr("height", function(d) { var y = self.yScale; return self.height - y(d.frequency); });
			};
		},

		/**
		 * the "+value" expresison converts value to number.
		 */
		accessor: function(d)
		{
			d.frequency = +d.frequency;
			return d;
		},

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

			yAxises.attr("y", 6)
				.attr("dy", ".71em");

			this.svg.selectAll(".bar")
				.attr("x", function(d) { var x = self.xScale; return x(d.letter); })
				.attr("width", this.xScale.rangeBand())
				.attr("y", function(d) { var y = self.yScale; return y(d.frequency); })
				.attr("height", function(d) { var y = self.yScale; return self.height - y(d.frequency); });
		}

	});

});


