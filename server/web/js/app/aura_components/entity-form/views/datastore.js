define(["../models/datastore","text!../templates/base-datastore.html"],
function(DatastoreModel, baseTemplate)
{
	var template = _.template(baseTemplate);

	return Backbone.View.extend(
	{

		events: {
			"click #button-save": "onButtonSaveClick",
			"click #button-cancel": function()
			{
				this.options.sandbox.switchToState("home");
			}
		},

		initialize: function ()
		{
			this.render();
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
			var self = this;

			if( this.isValid() )
			{
				this.model = new DatastoreModel();
				this.model.set({
					name: this.$("#input-datastore-name").val(),
					description: this.$("#textarea-datastore-description").val()
				});

				this.model.save(null, {
					success: function(model, response)
					{
						alert('success');
						self.options.sandbox.switchToState("home");
					},
					error: function(model, response)
					{
						alert("error");
					}
				});
			}
		}

	});

});