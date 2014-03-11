define(['text!./templates/base.html', "./collections/D3Collections", "./views/D3Collection"],
function(tpl, D3Collections, D3CollectionView)
{
  var template = _.template(tpl);

  return {
    type: 'Backbone',
    /**
     *
     */
    _externalRequests: [],
    /**
     *
     */
    _collectionsLoaded: false,
    events: {
      "click #button-add-list": "onButtonAddListClick"
    },

    onButtonAddListClick: function()
    {
      this.sandbox.switchToState("add-collection");
    },

    initialize: function()
    {
      this.loadD3Collections();
      this.initListeners();
    },

    /**
     *
     */
    initListeners: function()
    {
      this.sandbox.on("collections.refresh", this.fetchD3Collections, this);
      this.sandbox.on("collections.system.get", this.onGetSystemCollections, this);
      this.sandbox.on("collections.library.get", this.onGetLibraryCollection, this);
      this.sandbox.on("collections.regular.get", this.onGetRegularCollections, this);
    },

    onGetSystemCollections: function()
    {
      if (this._collectionsLoaded == true)
      {
        //those who are listening to this event MUST stop listening on it.
        this.sandbox.emit("collections.system.get.response", this.collection.getSystemCollections());
      }
      else
      {
        this._externalRequests["collections.system.get.response"] = {
          object: this.collection,
          provider: "getSystemCollections"
        };
      }
    },

    onGetLibraryCollection: function()
    {
      if (this._collectionsLoaded == true)
      {
        //those who are listening to this event MUST stop listening on it.
        this.sandbox.emit("collections.library.get.response", this.collection.getLibraryCollection());
      }
      else
      {
        this._externalRequests["collections.library.get.response"] = {
          object: this.collection,
          provider: "getLibraryCollection"
        };
      }
    },

    onGetRegularCollections: function()
    {
      if (this._collectionsLoaded == true)
      {
        //those who are listening to this event MUST stop listening on it.
        this.sandbox.emit("collections.regular.get.response", this.collection.getRegularCollections());
      }
      else
      {
        this._externalRequests["collections.regular.get.response"] = {
          object: this.collection,
          provider: "getRegularCollections"
        };
      }
    },

    loadD3Collections: function()
    {
      this.collection = new D3Collections();
      this.collection.bind('add', this.renderOne, this);
      this.collection.bind('remove', this.renderAll, this);
      this.collection.bind('reset', this.renderAll, this);

      this.fetchD3Collections();
    },

    fetchD3Collections: function()
    {
      var self = this;

      this.collection.fetch({
        success: function(collection, resp, options)
        {
          self._collectionsLoaded = true;
          self.onCollectionsFetched();
        }
      });
    },

    onCollectionsFetched: function()
    {
      this.handleExternalRequests();
      this.fetchVisualizationCountMapping();
    },

    /**
     *
     * EXPLAIN EXACTLY WHAT'S GOING ON HERE.
     *
     *
     * //TODO: UNIT TEST THIS CRAP.
     */
    handleExternalRequests: function()
    {
      //the library is required for many component out there,
      //so I'm dispatching it for them without their demand.
      this.sandbox.emit("collections.library.get.response", this.collection.getLibraryCollection());

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

    fetchVisualizationCountMapping: function(parameters)
    {
      var self = this;

      $.ajax({
        url: "index_dev.php/api/collections/visualization/counts",
        type: "GET",
        dataType: "json",
        data:
        {
          XDEBUG_SESSION_START: "netbeans-xdebug"
        },

        success: function(data, textStatus, XMLHttpRequest)
        {
          self.updateVisualizationCounts(data);
        },

        error: function(jqXHR, textStatus, errorThrown)
        {
          console.log("error : " + jqXHR);
        }
      });
    },

    updateVisualizationCounts: function(data)
    {
      var mapping = {};

      _.each(data, function(obj)
      {
        mapping[obj.collection_id] = obj.visualizationCount;
      });

      this.collection.each(function(d3collection)
      {
        var count = 0;

        if (mapping.hasOwnProperty(d3collection.get('id')))
        {
          count = mapping[d3collection.get('id')];
        }

        d3collection.set({visualizationCount: count});
      });
    },

    renderAll: function()
    {
      this.$el.html(template());
//			this.removeAllDomObjects();
      this.collection.each(this.renderOne, this);
    },

    renderOne: function(d3collection)
    {
      var view = new D3CollectionView({
        model: d3collection,
        sandbox: this.sandbox
      });

      if (d3collection.get("collection_type_id") == 1)
      {
        this.$find('#ul-system-collections-list').append(view.render().el);
      }
      else
      {
        this.$find('#ul-regular-collections-list').append(view.render().el);
      }
    },

    removeAllDomObjects: function()
    {
      this.$('#ul-system-collections-list').html('');
      this.$('#ul-regular-collections-list').html('');
    }

  }

});