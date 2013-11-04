define(['text!./templates/base.html', "./collections/datastores", "./views/datastore"],
function (tpl, DatastoreCollection, DatastoreView)
{
	var template = _.template(tpl);

	return {


	    type: 'Backbone',

		initialize: function()
		{
			this.$el.html(template());
			this.loadDataStores();
		},

		loadDataStores: function()
		{
			this.collection = new DatastoreCollection();
			this.collection.bind('add', this.renderOne, this);
			this.collection.bind('remove', this.renderAll, this);
			this.collection.bind('reset', this.renderAll, this);

			this.collection.fetch();
		},

		renderAll: function()
		{
			this.collection.each(this.renderOne);
		},

		renderOne: function(modelDatastore)
		{
			var view = new DatastoreView({ model: modelDatastore });

			if( modelDatastore.get("data_store_type_id") == 1 )
			{
				this.$('#ul-system-datastore-list').append(view.render().el);
			}
			else
			{
				this.$('#ul-regular-datastore-list').append(view.render().el);
			}
		}
	}

});