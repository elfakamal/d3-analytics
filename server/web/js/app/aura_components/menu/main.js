define(['text!./templates/base.html'], function(tpl)
{
	var template = _.template(tpl);

	return {

	    type: 'Backbone',

		events: {
			"click #li-add-data-source": "onAddDataSourceClick",
			"click #li-add-visualization": "onAddVisualizationClick"
		},

		initialize: function ()
		{
			this.$el.html(template());
		},


		onHomeClick: function(event)
		{
			if( event )
			{
				event.preventDefault();
			}

			this.sandbox.switchToState("home");
		},

		onBrowseClick:function()
		{

		},

		onSignupClick:function()
		{

		},

		onAddDataSourceClick: function()
		{
			alert('cool');
		},

		onAddVisualizationClick: function()
		{

		}

	}

});