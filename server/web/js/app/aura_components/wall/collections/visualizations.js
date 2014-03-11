define(["ModelVisualization"], function(ModelVisualization)
{
  "use strict";

  return Backbone.Collection.extend(
  {
    // Reference to this collection's model.
    model: ModelVisualization,
    _collectionId: 0,

    url: function()
    {
      if (!this._collectionId || this._collectionId === 0)
      {
        throw new Error("the wall have not collection id");
      }

      var url = 'collections/' + this._collectionId + '/visualizations';

      return url;
    },

    setCollectionId: function(collectionId)
    {
      if (this._collectionId !== collectionId)
      {
        this._collectionId = collectionId;
        this.fetch();
      }
    },

    getCollectionId: function(collectionId)
    {
      return this._collectionId;
    }

  });

});
