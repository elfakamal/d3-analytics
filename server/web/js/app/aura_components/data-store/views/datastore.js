define(['backbone', "text!../templates/datastore.html"], function(Backbone, datastoreTemplate)
{
  "use strict";

  var template = _.template(datastoreTemplate);

  return Backbone.View.extend(
  {
    tagName: "li",

    className: function()
    {
      var className = "";

      if (this.model.get("data_store_type_id") == 1)
      {
        className = "system-datastore";
      }
      else
      {
        className = "regular-datastore";
      }

      return className;
    },

    events: {
    },

    initialize: function()
    {
      this.render();
    },

    render: function()
    {
      var additionalOptions = {};
      if (this.model.get("data_store_type_id") == 1)
        additionalOptions.icon = "glyphicon-th";
      else
        additionalOptions.icon = "glyphicon-th-list";

      this.$el.html(template(_.extend(additionalOptions, this.model.toJSON())));
      return this;
    }

  });

});