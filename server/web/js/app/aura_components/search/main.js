define(['text!./templates/base.html'], function (tpl)
{
	var template = _.template(tpl);

	return {

		type: 'Backbone',

		events: {
			"click #coco": "canYouStopMe",
			"click #switchToMenu": "onSwitchToMenuClick"
		},

		canYouStopMe: function()
		{
			this.sandbox.stop();
		},

		onSwitchToMenuClick: function()
		{
			this.sandbox.switchToState("add-visualization");
		},

		initialize: function()
		{
			this.$el.html(template());
		}
	};

});