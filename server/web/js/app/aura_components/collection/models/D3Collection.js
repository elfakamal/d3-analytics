define(['backbone'], function(Backbone)
{
  "use strict";

  var D3CollectionModel = Backbone.Model.extend(
  {
    defaults:
    {
      name: '',
      description: "",
      collection_type_id: 0,
      visualizationCount: 0
    }

  });

  return D3CollectionModel;

});
