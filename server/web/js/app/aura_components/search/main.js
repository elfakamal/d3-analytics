define(['text!./templates/base.html'], function (tpl)
{
	var template = _.template(tpl);

	return {

		type: 'Backbone',

		events: {
			
		},


		initialize: function()
		{
			this.$el.html(template());
		}
	};

});