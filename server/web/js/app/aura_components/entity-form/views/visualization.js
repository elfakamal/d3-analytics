define([
	"ModelVisualization",
	"text!../templates/base-visualization.html",
	"text!../templates/partial-select-d3collections.html"
//	,
//	"text!../templates/partial-select-datasources.html"
],
function(ModelVisualization, baseTemplate, partialSelectD3Collections/*, partialSelectDatasources*/)
{
	var template							= _.template(baseTemplate);
	var parsedPartialSelectD3Collections	= _.template(partialSelectD3Collections);
//	var parsedPartialSelectDatasources		= _.template(partialSelectDatasources);


	return Backbone.View.extend(
	{
		_systemCollections: null,
		_regularCollections: null,
		_libraryCollection: null,

		events: {
			"click #button-save": "onButtonSaveClick",
			"click #button-cancel": function()
			{
				this.options.sandbox.switchToState("home");
			}
		},

		initialize: function ()
		{
			this.render();
			this.prepareChannels();
		},

		prepareChannels: function()
		{
			this.options.sandbox.on("collections.library.get.response", this.onGetLibraryCollectionResponse, this);
			this.options.sandbox.on("collections.regular.get.response", this.onGetRegularCollectionResponse, this);
			this.options.sandbox.on("collections.system.get.response", this.onGetSystemCollectionResponse, this);

			this.options.sandbox.emit('collections.library.get');
			this.options.sandbox.emit('collections.regular.get');
			this.options.sandbox.emit('collections.system.get');
		},

		onGetLibraryCollectionResponse: function(libraryCollection)
		{
			this.options.sandbox.off("collections.library.get.response", this.onGetLibraryCollectionResponse);
			this._libraryCollection = libraryCollection;
			console.log('got library collection ' + libraryCollection.get('id'));
		},

		onGetRegularCollectionResponse: function(regularCollections)
		{
			this.options.sandbox.off("collections.regular.get.response", this.onGetRegularCollectionResponse);
			this._regularCollections = regularCollections;
			console.log('got regularCollections');
			this.$("#li-collection").html(parsedPartialSelectD3Collections({d3collections: regularCollections}));
		},

		onGetSystemCollectionResponse: function(systemCollections)
		{
			this.options.sandbox.off("collections.system.get.response", this.onGetSystemCollectionResponse);
			this._systemCollections = systemCollections;
			console.log('got systemCollections');
		},

		render: function()
		{
			console.log('render entity-form');
			this.$el.html(template());
			return this;
		},

		isValid: function()
		{
			if( this.$("#input-visualization-name").val() != "" &&
				this.$("#textarea-visualization-description").val() != "" )
			{
				return true;
			}

			return false;
		},

		onButtonSaveClick: function()
		{
			var self = this;

			if( this.isValid() )
			{
				if( this._libraryCollection == null )
				{
					throw new Error("library needed");
				}

				this.model = new ModelVisualization();
				this.model.setLibraryId(this._libraryCollection.get("id"));
				this.model.setCollectionId(this.$("#select-collection").val());
				this.model.set({
					name:					this.$("#input-visualization-name").val(),
					description:			this.$("#textarea-visualization-description").val(),
					visualizationTypeId:	this.$("#select-visualization-type").val()
				});

				this.model.save(null,
				{
					success: function(model, response)
					{
						self.onModelSaveSuccess(model, response);
					},
					error: function(model, response)
					{
						self.onModelSaveError(model, response);
					}
				});
			}
		},

		onModelSaveSuccess: function(model, response)
		{
			console.log('model visualization save success');

			//refresh the library and the collection to which we added the viz.
			//get the hell out of the DOM, and stop the component.
			this.options.sandbox.emit("collections.refresh");

			this.options.sandbox.switchToState("home");
		},

		onModelSaveError: function(model, response)
		{
			alert('error');
		}

	});

});