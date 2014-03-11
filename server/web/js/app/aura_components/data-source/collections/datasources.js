define(["ModelDatasource"], function(ModelDatasource)
{
  "use strict";

  return Backbone.Collection.extend(
  {
    // Reference to this collection's model.
    model: ModelDatasource,
    _datastoreId: 0,
    
    url: function()
    {
      if (!this._datastoreId || this._datastoreId === 0)
      {
        throw new Error("you must specify a data store id");
      }

      var url = 'datastores/' + this._datastoreId + '/datasources';

      return url;
    },

    setDatastoreId: function(datastoreId)
    {
      this._datastoreId = datastoreId;
    },

    getDatastoreId: function(datastoreId)
    {
      return this._datastoreId;
    }
  });

});
