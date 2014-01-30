define([], function()
{
	var constants = {

		DEFAULT_HORIZONTAL_MARGIN: 10,
		DEFAULT_VERTICAL_MARGIN: 10,

		DEFAULT_THUMB_WIDTH: 180,
		DEFAULT_THUMB_HEIGHT: 180,

		THUMB_TITLE_HEIGHT: 40,

		TIP_HEIGHT: 20,
		TIP_WIDTH: 100,
		TIP_MARGIN_BOTTOM: 5,

		DONUT_TICKNESS: 40,

		TOP: "top",
		RIGHT: "right",
		BOTTOM: "bottom",
		LEFT: "left",

		VISUALIZATION_SIZES: {
			1: [1, 1],
			2: [2, 2],
			3: [4, 2],
			4: [6, 2]
		},

		VISUALIZATION_TYPES: {
			1: "bar.vertical",
			2: "bar.grouped.vertical",
			3: "bar.horizontal",
			4: "bar.grouped.horizontal",
			5: "pie",
			6: "donut",
			7: "line",
			8: "line", //TODO: change this to line.time
			9: "area",
			10: "area" //TODO: change this to area.time
		},

		VISUALIZATION_TYPE_NAMES: {
			1: "Vertical Bar Chart",
			2: "Vertical Grouped Bar Chart",
			3: "Horizontal Bar Chart",
			4: "Horizontal Grouped Bar Chart",
			
			5: "Pie Chart",
			6: "Donut Chart",
			
			7: "Normal Line Chart",
			8: "Time Line Chart",

			9: "Normal Area Chart",
			10: "Time Area Chart"
		},

		VISUALIZATION_TYPE_GROUPS: [
			{key:"", name: "Bar Charts", children: [1, 2, 3, 4]},
			{key:"5", name: "Pie Chart", children: []},
			{key:"6", name: "Donut Chart", children: []},
			{key:"", name: "Line Chart", children: [7, 8]},
			{key:"", name: "Area Chart", children: [9, 10]}
		],

		CHART_ICONS: {
			"bar.vertical": '&#128202',
			"bar.grouped.vertical": '&#128202',
			"bar.horizontal": '&#128202',
			"bar.grouped.horizontal": '&#128202',
			"pie": '&#9716',
			"donut": '&#128191',
			"line": '&#128200',
			"area": '&#128200'
		}
	};

	return constants;
});