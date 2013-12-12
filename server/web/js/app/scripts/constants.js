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
			2: "bar.horizontal",
			3: "pie",
			4: "donut",
			5: "line"
		},

		VISUALIZATION_TYPE_NAMES: {
			1: "Vertical Bar",
			2: "Horizontal Bar",
			3: "Pie",
			4: "Donut",
			5: "Line"
		},

		CHART_ICONS: {
			"bar.vertical": '&#128202',
			"bar.horizontal": '&#128202',
			"pie": '&#9716',
			"donut": '&#128191',
			"line": '&#128200'
		}
	};

	return constants;
});