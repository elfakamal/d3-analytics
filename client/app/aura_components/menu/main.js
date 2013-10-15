define(['text!./templates/base.html'], function(tpl)
{
	var template = _.template(tpl);

	return {
		
		initialize: function ()
		{
			this.$el.html(template());
		},


		onHomeClick: function()
		{

		},

		onBrowseClick:function()
		{

		},

		onSignupClick:function()
		{

		}

	}

});