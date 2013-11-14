var width = 100,
    height = 100,
    twoPi = 2 * Math.PI,
    progress = .69,
    total = 1308573, // must be hard-coded if server doesn't report Content-Length
    formatPercent = d3.format(".0%"),
	innerRadius = 30,
	outerRadius = 50,
	padding = 20;

var skills = [
	{
		weight			: .7,
		customClasses	: "skill-1",
		duration		: 1000,
		content			: {
			title	: "Frontend development",
			details	: [
				"HTML5",
				"CSS3",
				"Javascript",
				"Aura",
				"Backbone",
				"RequireJS",
				"Underscore",
				"SocketIO",
				"SVG",
				"D3js",
				"jQuery",
				"AJAX",
				"Action Script",
				"Papervision3D",
				"Flex / AIR",
			]
		}
	},
	{
		weight			: .8,
		customClasses	: "skill-2",
		duration		: 1500,
		content			: {
			title	: "Backend development",
			details	: [
				"PHP",
				"MySQL",
				"Symfony",
				"Doctrine",
				"NodeJS",
				"Memcached",
				"Gearman",
				"Supervisor",
				"XHProf",
				"JAVA"
			]
		}
	},
	{
		weight			: .8,
		customClasses	: "skill-3",
		duration		: 2000,
		content			: {
			title	: "Multimedia",
			details	: [
				"Photoshop",
				"Illustrator",
				"InDesign",
				"Flash",
				"Flex"
			]
		}
	},
	{
		weight			: .7,
		customClasses	: "skill-4",
		duration		: 2500,
		content			: {
			title	: "Methods & Tools",
			details	: [
				"MVC",
				"event-driven architecture",
				"Active Record Pattern",
				"GIT (Github)",
				"Twitter Bootstrap",
				"Responsive Web Design",
				"Netbeans IDE",
				"MySQL Workbench"
			]
		}
	}
];


//foreground
var arc = d3.svg.arc()
	.startAngle(0)
    .endAngle(function(d)
	{
		return d.weight * twoPi;
	})
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

//background
var arc2 = d3.svg.arc()
	.startAngle(0)
    .endAngle(twoPi)
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);


var bodySelection = d3.select("body");
var skillListSelection = bodySelection.select("#ul-skills");

var skillItems = skillListSelection.selectAll("li")
	.data(skills)
	.enter()
	.append("li")
	.style("width", "100%")
	.attr("class", "skillListItem");


var skillSVGs = skillItems.append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("class", "skill-svg");


var skillContents = skillItems.append("div")
	.attr("class", "skill-content");

var skillTitles = skillContents.append("span")
	.attr("class", "skill-title")
	.text(function(d)
	{
		return d.content.title;
	});




var skillDetailsContainer = skillContents.append("div")
	.attr("class", "skill-details-container");

var skillDetails = skillDetailsContainer.selectAll("span")
	.data(function(d)
	{
		return d.content.details;
	})
	.enter()
	.append("span")
	.attr("class", "skill-detail")
	.text(function(d)
	{
		return d;
	});


var pieBases = skillSVGs
	.append("g")
	.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
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
	.attrTween("d", pieTween);


var percentTexts = pieBases.append("text")
	.attr("class", "percent")
	.attr("text-anchor", "middle")
	.attr("dy", ".35em")
	.attr("fill", "lightgray");


function pieTween(d, i)
{
	var myInterpolation = d3.interpolate({weight:.0}, {weight: d.weight});

	return function(t)
	{
		var progressEnd = myInterpolation(t);
		var myTexts = d3.selectAll("text.percent");
		d3.select(myTexts[0][i]).text(formatPercent(progressEnd.weight));
		return arc(progressEnd);
	}
}










