define(["../models/d3collection","text!../templates/base-collection.html"],
function(D3CollectionModel, baseTemplate)
{
	var template = _.template(baseTemplate);

	return Backbone.View.extend(
	{

		events: {
			"click #button-save": "onButtonSaveClick",
			"click #button-cancel": "onButtonCancelClick"
		},

		onButtonCancelClick: function()
		{
			this.options.sandbox._children = [];
			this.options.sandbox.stop();
		},

		initialize: function ()
		{

		},

		render: function()
		{
			this.$el.html(template());
			return this;
		},

		isValid: function()
		{
			if( this.$("#input-collection-name").val() != "" &&
				this.$("#textarea-collection-description").val() != "" )
			{
				return true;
			}

			return false;
		},

		onButtonSaveClick: function()
		{
			if( this.isValid() )
			{
				this.model = new D3CollectionModel();
				this.model.set({
					name: this.$("#input-collection-name").val(),
					description: this.$("#textarea-collection-description").val()
				});

				this.model.save();
			}
		}

	});

});