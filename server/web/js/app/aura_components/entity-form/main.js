define(["./views/d3collection", "./views/visualization", "./views/datastore", "./views/datasource"],
function(D3CollectionView, VisualizationView, DatastoreView, DatasourceView)
{
	/**
	 * This widget doesn't know what's in the templates, because they are loaded
	 * in the sub-views, so we can't listen to events from here, we have to do
	 * it from the sub-views.
	 */
	return {

	    type: 'Backbone',

		initialize: function ()
		{
			this.initView();
		},

		initView: function()
		{
			if( this.options.hasOwnProperty("entity") )
			{
				switch (true)
				{
					case this.options.entity === "collection" :
					{
						this.formView = new D3CollectionView({
							el: this.$el,
							sandbox: this.sandbox
						});
						break;
					}
					case this.options.entity === "visualization" :
					{
						this.formView = new VisualizationView({
							el: this.$el,
							sandbox: this.sandbox
						});
						break;
					}
					case this.options.entity === "datastore" :
					{
						this.formView = new DatastoreView({
							el: this.$el,
							sandbox: this.sandbox
						});
						break;
					}
					case this.options.entity === "datasource" :
					{
						this.formView = new DatasourceView({
							el: this.$el,
							sandbox: this.sandbox
						});
						break;
					}
				}
			}
		}
	}

});