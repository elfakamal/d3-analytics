define(['backbone', "../models/datastore"], function(Backbone, DatastoreModel)
{
  "use strict";

  return Backbone.Collection.extend(
  {
    // Reference to this collection's model.
    model: DatastoreModel,
    url: 'datastores',

    getLibrary: function()
    {
      var result = this.filter(function(datastore)
      {
        return datastore.get('name') == "All" && datastore.get('data_store_type_id') == 1;
      });

      if (result.length === 1)
      {
        return result[0];
      }

      return [];
    }

  });

});
