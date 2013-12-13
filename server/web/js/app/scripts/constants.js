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
			7: "line"
		},

		VISUALIZATION_TYPE_NAMES: {
			1: "Vertical Bar Chart",
			2: "Vertical Grouped Bar Chart",
			3: "Horizontal Bar Chart",
			4: "Horizontal Grouped Bar Chart",
			5: "Pie",
			6: "Donut",
			7: "Line"
		},

		VISUALIZATION_TYPE_GROUPS: [
			{key:"", name: "Bar Charts", children: [1, 2, 3, 4]},
			{key:"5", name: "Pie Chart", children: []},
			{key:"6", name: "Donut Chart", children: []},
			{key:"7", name: "Line Chart", children: []},
		],

		CHART_ICONS: {
			"bar.vertical": '&#128202',
			"bar.grouped.vertical": '&#128202',
			"bar.horizontal": '&#128202',
			"bar.grouped.horizontal": '&#128202',
			"pie": '&#9716',
			"donut": '&#128191',
			"line": '&#128200'
		}
	};

	return constants;
});