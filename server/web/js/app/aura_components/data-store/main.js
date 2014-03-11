define(['text!./templates/base.html', "./collections/datastores", "./views/datastore"], function(tpl, DatastoreCollection, DatastoreView)
{
  var template = _.template(tpl);

  return {
    type: 'Backbone',
    _datastoresLoaded: false,
    _externalRequests: [],
    events: {
      'click #button-add-datastore': "onAddDatastoreClick"
    },
    onAddDatastoreClick: function()
    {
      this.sandbox.switchToState("add-datastore");
    },
    initialize: function()
    {
      this.$el.html(template());
      this.loadDataStores();

      this.sandbox.on("datastore.library.get", this.onGetDatastoreLibraryRequest, this);
    },
    onGetDatastoreLibraryRequest: function()
    {
      if (this._datasourcesLoaded == true)
      {
        //those who are listening to this event MUST stop listening on it.
        this.sandbox.emit("datastore.library.get.response", this.collection.getLibrary());
      }
      else
      {
        this._externalRequests["datastore.library.get.response"] = {
          object: this.collection,
          provider: "getLibrary"
        };
      }
    },
    loadDataStores: function()
    {
      this.collection = new DatastoreCollection();
      this.collection.bind('add', this.renderOne, this);
      this.collection.bind('remove', this.renderAll, this);
      this.collection.bind('reset', this.renderAll, this);

      var self = this;

      this.collection.fetch({
        success: function(collection, response, options)
        {
          self._datasourcesLoaded = true;
          self.onDatasourcesFetched();
        }
      });
    },
    onDatasourcesFetched: function()
    {
      //handle the asynchronous requests.
      if (this._externalRequests.length > 0)
      {
        for (var event in this._externalRequests)
        {
          var object = this._externalRequests[event].object;
          var provider = this._externalRequests[event].provider;
          //					var textualProvider = object[provider];
          var rawData = provider.apply(object);
          console.log("asynchronous event emit data : " + rawData);

          var data = this._externalRequests[event].object[this._externalRequests[event].provider]();
          this.sandbox.emit(event, data);
        }

        this._externalRequests = [];
      }
    },
    renderAll: function()
    {
      this.collection.each(this.renderOne);
    },
    renderOne: function(modelDatastore)
    {
      var view = new DatastoreView({
        model: modelDatastore
      });

      if (modelDatastore.get("data_store_type_id") == 1)
      {
        this.$('#ul-system-datastore-list').append(view.render().el);
      }
      else
      {
        this.$('#ul-regular-datastore-list').append(view.render().el);
      }
    }
  }

});