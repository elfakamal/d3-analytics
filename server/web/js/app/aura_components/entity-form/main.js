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

    initialize: function()
    {
      this.initView();
    },

    hasOption: function(option)
    {
      if (typeof option === "undefined")
      {
        return false;
      }

      return _.has(this.options, option);
    },

    initView: function()
    {
      var titleEnabled = this.hasOption("titleEnabled") ? this.options.titleEnabled : true,
      buttonsEnabled = this.hasOption("buttonsEnabled") ? this.options.buttonsEnabled : true,
      model = this.hasOption("model") ? this.options.model : null,
      contained = this.hasOption("contained") ? this.options.contained : false;

      var commonOptions = {
        el: this.$el,
        model: model,
        sandbox: this.sandbox,
        contained: contained,
        titleEnabled: titleEnabled,
        buttonsEnabled: buttonsEnabled
      };

      if (this.hasOption("entity"))
      {
        switch (true)
        {
          case this.options.entity === "collection" :
            {
              this.formView = new D3CollectionView(commonOptions);
              break;
            }
          case this.options.entity === "visualization" :
            {
              this.formView = new VisualizationView(commonOptions);
              break;
            }
          case this.options.entity === "datastore" :
            {
              this.formView = new DatastoreView(commonOptions);
              break;
            }
          case this.options.entity === "datasource" :
            {
              this.formView = new DatasourceView(commonOptions);
              break;
            }
        }
      }
    }
  }

});