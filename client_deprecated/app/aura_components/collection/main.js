define(['text!./templates/base.html', "./collections/D3Collections", "./views/D3Collection"],
function (tpl, D3Collections, D3CollectionView)
{
	var template = _.template(tpl);

	return {

		events: {

		},

		initialize: function()
		{
			this.$el.html(template());
			this.loadD3Collections();
		},

		loadD3Collections: function()
		{
			this.collection = new D3Collections();
			this.collection.bind('add', this.renderOne, this);
			this.collection.bind('remove', this.renderAll, this);
			this.collection.bind('reset', this.renderAll, this);

			this.collection.fetch();
		},

		renderAll: function()
		{
			this.collection.each(this.renderOne);
		},

		renderOne: function(d3collection)
		{
			var view = new D3CollectionView({ model: d3collection });

			if( d3collection.get("collection_type_id") == 1 )
			{
				this.$('#ul-system-collections-list').append(view.render().el);
			}
			else
			{
				this.$('#ul-regular-collections-list').append(view.render().el);
			}
		},

		removeAllDomObjects: function()
		{
			this.$('#ul-system-collections-list').html('');
			this.$('#ul-regular-collections-list').html('');
		}

	}

});