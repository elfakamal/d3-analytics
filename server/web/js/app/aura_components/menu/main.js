define(['text!./templates/base.html'], function(tpl)
{
  var template = _.template(tpl);

  return {
    type: 'Backbone',
    events: {
      "click #li-add-data-source": "onAddDataSourceClick",
      "click #li-add-visualization": "onAddVisualizationClick",
      "click #li-collect": function()
      {
        this.component.onCollectClick();
      }
    },

    onCollectClick: function()
    {
      var collectionId = this.sandbox.collect("collection.id", this.onCollectionIdCollected, "wall", null, this);
    },

    onCollectionIdCollected: function(data)
    {
      alert("data came from wall component " + data);
    },

    initialize: function()
    {
      this.$el.html(template());
    },

    onHomeClick: function(event)
    {
      if (event)
      {
        event.preventDefault();
      }

      this.sandbox.switchToState("home");
    },

    onBrowseClick: function()
    {

    },

    onSignupClick: function()
    {

    },

    onAddVisualizationClick: function()
    {
      this.sandbox.switchToState("add-visualization");
    },

    onAddDataSourceClick: function()
    {
      this.sandbox.switchToState("add-datasource");
    }

  }

});