define(["./chart.viz", "d3", "text!../templates/viz.html"],
function(ViewChart, d3, baseTemplate)
{

	return ViewChart.extend(
	{
		formatPercent	: d3.format(".0%"),
		margin			: {top: 20, right: 20, bottom: 30, left: 40},

		width			: function(){return 600 - this.margin.left - this.margin.right},
		height			: function(){return 400 - this.margin.top - this.margin.bottom},

		xScale : function()
		{
			return d3.scale.ordinal().rangeRoundBands([0, this.width()], .1);
		},
		yScale : function()
		{
			return d3.scale.linear().range([this.height(), 0]);
		},

		xAxis : function()
		{
			return d3.svg.axis().scale(this.xScale()).orient("bottom");
		},
		yAxis : function()
		{
			return d3.svg.axis().scale(this.yScale()).orient("left").tickFormat(this.formatPercent);
		},

		svg: null,

		events: {

		},

		initialize: function ()
		{
			this.render();
		},

		render: function()
		{
			this.initBase();
			this.initDatasource();
		},

		initBase: function()
		{
			var vizSelection	= d3.select("#li-viz-" + this.model.get('id'));
			var viz				= vizSelection.select("#div-viz-content");

			this.svg = viz.append("svg")
				.attr("width", this.width() + this.margin.left + this.margin.right)
				.attr("height", this.height() + this.margin.top + this.margin.bottom)
			  .append("g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		},

		initDatasource: function()
		{
			var dsList		= this.model.get('data_sources');
			var ds			= dsList[0];
			var fileName	= ds.file_name;
			var fileExtension	= ds.file_extension;

			if( this.allowedFileTypes.indexOf(fileExtension) < 0 )
			{
				throw new Error("D3 Analytics: File not supported");
				return;
			}

			var path = "uploads/datasources/" + fileName;

			var d3loader = d3[fileExtension];

			d3loader.apply(d3, [path])
				.row(this.accessor)
				.get(this.onLoaderComplete());
		},

		onLoaderComplete: function()
		{
			var self = this;

			return function(error, data)
			{
				self.xScale.domain(data.map(function(d) { return d.letter; }));
				self.yScale.domain([0, d3.max(data, function(d) { return d.frequency; })]);

				self.svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + self.height() + ")")
					.call(self.xAxis());

				self.svg.append("g")
					.attr("class", "y axis")
					.call(self.yAxis())
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
					.attr("x", function(d) { var x = self.xScale(); return x(d.letter); })
					.attr("width", self.xScale().rangeBand())
					.attr("y", function(d) { var y = self.yScale(); return y(d.frequency); })
					.attr("height", function(d) { var y = self.yScale(); return self.height() - y(d.frequency); });
			};
		},

		/**
		 * the "+value" expresison converts value to number.
		 */
		accessor: function(d)
		{
			d.frequency = +d.frequency;
			return d;
		}

	});

});


