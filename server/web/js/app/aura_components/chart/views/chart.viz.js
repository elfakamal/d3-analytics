define([], function()
{

	return Backbone.View.extend(
	{

		data					: null,
		chartData			: null,
		svg						: null,

		getChartIcon: function()
		{
			return '';
		},

		show: function()
		{
			this.$el.css("display", "block").css("overflow", "auto");
		},

		hide: function()
		{
			this.$el.css("display", "none").css("overflow", "hidden");
		},

		update: function() {}

	});

});

