define(["../models/d3collection", "text!../templates/base-collection.html"],
function(D3CollectionModel, baseTemplate)
{
  var template = _.template(baseTemplate);

  return Backbone.View.extend(
  {
    events: {
      "click #button-save": "onButtonSaveClick",
      "click #button-cancel": function()
      {
        this.options.sandbox.switchToState("home");
      }
    },

    initialize: function()
    {
      this.render();
    },

    render: function()
    {
      this.$el.html(template());
      return this;
    },

    isValid: function()
    {
      if (this.$("#input-collection-name").val() !== "" &&
      this.$("#textarea-collection-description").val() !== "")
      {
        return true;
      }

      return false;
    },

    onButtonSaveClick: function()
    {
      var self = this;

      if (this.isValid())
      {
        this.model = new D3CollectionModel();
        this.model.set({
          name: this.$("#input-collection-name").val(),
          description: this.$("#textarea-collection-description").val()
        });

        this.model.save(null, {
          success: function(model, response)
          {
            //alert('success');
            self.options.sandbox.emit("collections.refresh");
            self.options.sandbox.switchToState("home");
          },

          error: function(model, response)
          {
            alert("error");
          }
        });
      }
      else
      {
        console.error("the form is not valid");
      }
    }


  });

});