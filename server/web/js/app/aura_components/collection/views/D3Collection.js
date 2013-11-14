define(['backbone', "text!../templates/D3Collection.html"], function(Backbone, collectionItemTemplate)
{
	"use strict";

	var template = _.template(collectionItemTemplate);

	return Backbone.View.extend(
	{
		events: {
			'click': "onClick"
		},

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

		initialize: function()
		{
			this.model.bind('change', this.onModelChange, this);
			this.render();
		},

		onModelChange: function()
		{
			this.$("#span-name").text(this.model.get('name'));
			this.$("#span-visualization-count").text(this.model.get('visualizationCount'));
		},

		onClick:function()
		{
			this.options.sandbox.emit("collections.selected", this.model);
		},

		render: function ()
		{
			this.$el.html(template(this.model.toJSON()));
			return this;
		}

	});

});