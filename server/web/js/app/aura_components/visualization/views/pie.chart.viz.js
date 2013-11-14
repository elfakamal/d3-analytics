define(["./chart.viz", "d3", "text!../templates/viz.html"],
function(ViewChart, d3, baseTemplate)
{

	return ViewChart.extend(
	{
		arc: null,
		percentTexts: null,
		width : 100,
		height : 100,
		twoPi : 2 * Math.PI,
		progress : .69,
		total : 1308573, // must be hard-coded if server doesn't report Content-Length
		formatPercent : d3.format(".0%"),
		innerRadius : 30,
		outerRadius : 50,
		padding : 20,

		events: {

		},

		initialize: function ()
		{
			this.render();
		},

		render: function()
		{
			var dsList		= this.model.get('data_sources');
			var ds			= dsList[0];
			var fileName	= ds.file_name;//"6d29fe6a24140899e2bb392b8fe1630a.d3a"

			console.log(ds);

			//foreground
			this.arc = d3.svg.arc()
				.startAngle(0)
				.endAngle(function(d)
				{
					return d.weight * this.twoPi;
				})
				.innerRadius(this.innerRadius)
				.outerRadius(this.outerRadius);

			//background
			var arc2 = d3.svg.arc()
				.startAngle(0)
				.endAngle(this.twoPi)
				.innerRadius(this.innerRadius)
				.outerRadius(this.outerRadius);

			var vizSelection = d3.select("#li-viz-" + this.model.get('id'));
			var skillListSelection = vizSelection.select("#div-viz-content");
			var self = this;

			d3.json("uploads/datasources/" + fileName, function(error, data)
			{

				var skillItems = skillListSelection.selectAll("div")
					.data(data)
					.enter()
					.append("div")
					.style("width", "100%")
					.style("height", "100%")
					.attr("class", "center-container");

				var skillSVGs = skillItems.append("svg")
					.attr("width", self.width)
					.attr("height", self.height)
					.attr("class", "absolute-center");

				var pieBases = skillSVGs
					.append("g")
					.attr("transform", "translate(" + (self.width/2) + "," + (self.height/2) + ")")
					.attr("class", function(d)
					{
						var classes = "skill-graphic";

						if( d.customClasses != "" )
						{
							classes += " " + d.customClasses;
						}

						return classes;
					});


				pieBases.append("path")
					.attr("class", "background")
					.attr("d", arc2)
					.attr("transform", "scale(0)")
					.transition()
					.duration(1000)
					.attr("transform", "scale(1)");


				var pieForegrounds = pieBases.append("path")
					.attr("class", "foreground")
					.transition()
					.delay(1000)
					.duration(function(d)
					{
						return d.duration;
					})
					.attrTween("d", self.pieTween());


				self.percentTexts = pieBases.append("text")
					.attr("class", "percent")
					.attr("text-anchor", "middle")
					.attr("dy", ".35em")
					.attr("fill", "gray");

			});

		},

		pieTween : function ()
		{
			var self = this;

			return function(d, i)
			{
				var myInterpolation = d3.interpolate({weight:.0}, {weight: d.weight});

				return function(t)
				{
					var progressEnd = myInterpolation(t);
					var myTexts = self.percentTexts;//d3.selectAll("text.percent");
					//console.log("my texts : " + myTexts);
					d3.select(myTexts[0][i]).text(self.formatPercent(progressEnd.weight));
					return self.arc(progressEnd);
				}
			}
		}

	});

});


