define(['backbone', "text!../templates/D3Collection.html"], function(Backbone, collectionItemTemplate)
{
	"use strict";

	var template = _.template(collectionItemTemplate);

	return Backbone.View.extend(
	{
		tagName: "li",

		className: function()
		{
			var className = "";

			if( this.model.get("collection_type_id") == 1 )
			{
				className = "system-collection";
			}
			else
			{
				className = "regular-collection";
			}

			return className;
		},

		events: {

		},

		initialize: function()
		{

			this.render();
		},

		render: function ()
		{
			this.$el.html(template(this.model.toJSON()));
			return this;
		}

	});

});