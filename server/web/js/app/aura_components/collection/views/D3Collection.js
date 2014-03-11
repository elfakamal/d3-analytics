define(['backbone', "text!../templates/D3Collection.html"], function(Backbone, collectionItemTemplate)
{
  "use strict";

  var template = _.template(collectionItemTemplate);

  return Backbone.View.extend(
  {
    //got a jquery bug: event.returnValue is deprecated. Please use the standard event.preventDefault() instead
    //bug ticket: http://bugs.jquery.com/ticket/14320

    events: {
      'click': "onClick"
    },

    tagName: "li",
    className: function()
    {
      var className = "";

      if (this.model.get("collection_type_id") == 1)
      {
        className = "system-collection";
      }
      else
      {
        className = "regular-collection";
      }

      return className;
    },

    initialize: function()
    {
      this.model.bind('change', this.onModelChange, this);
      this.render();
    },

    onModelChange: function()
    {
      this.$("#span-name").text(this.model.get('name'));
      this.$("#span-visualization-count").text(this.model.get('visualizationCount'));
    },

    onClick: function()
    {
      this.options.sandbox.emit("collections.selected", this.model);
    },

    render: function()
    {
      var additionalOptions = {};

      if (this.model.get('collection_type_id') == 1)
      {
        if (this.model.get('name') == "Library")
          additionalOptions.icon = "glyphicon-th";
        if (this.model.get('name') == "Starred")
          additionalOptions.icon = "glyphicon-star";
        if (this.model.get('name') == "Deleted")
          additionalOptions.icon = "glyphicon-trash";
      }
      else
        additionalOptions.icon = "glyphicon-th-large";

      this.$el.html(template(_.extend(additionalOptions, this.model.toJSON())));
      return this;
    }

  });

});