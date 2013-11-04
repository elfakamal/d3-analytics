define(["./views/d3collection", "./views/visualization", "./views/datastore", "./views/datasource"],
function(D3CollectionView, VisualizationView, DatastoreView, DatasourceView)
{

	return {

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
					case this.options.entity == "collection" :
					{
						this.view = new D3CollectionView({
							sandbox: this.sandbox
						});
						break;
					}
					case this.options.entity == "visualization" :
					{
						this.view = new VisualizationView();
						break;
					}
					case this.options.entity == "datastore" :
					{
						this.view = new DatastoreView();
						break;
					}
					case this.options.entity == "datasource" :
					{
						this.view = new DatasourceView();
						break;
					}
				}

				this.render();
			}
		},

		render: function()
		{
			if( this.view !== null )
			{
				this.$el.html(this.view.render().el);
			}
		}

	}

});