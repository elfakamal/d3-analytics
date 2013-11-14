define(["text!../templates/base-datasource.html"], function(baseTemplate)
{
	var template = _.template(baseTemplate);

	return Backbone.View.extend(
	{

		events: {
			"click #button-save": "onButtonSaveClick"
		},

		initialize: function ()
		{

		},

		render: function()
		{
			this.$el.html(template());
			return this;
		},

		onButtonSaveClick: function()
		{
			alert('lol');
		}

	});

});