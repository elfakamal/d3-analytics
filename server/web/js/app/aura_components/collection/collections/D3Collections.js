define(['backbone', "../models/D3Collection"], function(Backbone, D3CollectionModel)
{
  "use strict";

  return Backbone.Collection.extend(
  {
    // Reference to this collection's model.
    model: D3CollectionModel,
    url: 'collections',

    getLibraryCollection: function()
    {
      var result = this.filter(function(d3collection)
      {
        return d3collection.get('name') == "Library" && d3collection.get('collection_type_id') == 1;
      });

      if (result.length > 0)
      {
        return result[0];
      }

      return null;
    },

    getSystemCollections: function()
    {
      return this.filter(function(d3collection)
      {
        return d3collection.get('collection_type_id') == 1;
      });
    },

    getRegularCollections: function()
    {
      return this.filter(function(d3collection)
      {
        return d3collection.get('collection_type_id') == 2;
      });
    },

    getStarredCollection: function()
    {
      return this.filter(function(d3collection)
      {
        return d3collection.get('name') == "Starred" && d3collection.get('collection_type_id') == 1;
      });
    },

    getDeletedCollection: function()
    {
      return this.filter(function(d3collection)
      {
        return d3collection.get('name') == "Deleted" && d3collection.get('collection_type_id') == 1;
      });
    }
  });

});
