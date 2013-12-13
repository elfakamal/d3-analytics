define([
	"ModelVisualization",
	"text!../templates/base-visualization.html",
	"text!../templates/partial-select-d3collections.html",
	"constants"
],
function(ModelVisualization, baseTemplate, partialSelectD3Collections, constants)
{
	var template = _.template(baseTemplate);
	var parsedPartialSelectD3Collections = _.template(partialSelectD3Collections);


	return Backbone.View.extend(
	{
		_systemCollections: null,
		_regularCollections: null,
		_libraryCollection: null,

		/**
		 * this flag is important for the post save process. It allows us to know
		 * whether the model was new before the save or the request was sent in
		 * order to update the model.
		 */
		_wasNew: false,

		events: {
			"click #button-save": "onButtonSaveClick",
			"click #button-cancel": function()
			{
				this.options.sandbox.switchToState("home");
			}
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initialize: function ()
		{
			if( !this.model )
				this.model = new ModelVisualization();

			this.render();
			this.initListeners();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initListeners: function()
		{
			this.options.sandbox.on("collections.library.get.response", this.onGetLibraryCollectionResponse, this);
			this.options.sandbox.emit('collections.library.get');

			if( !_.has(this.options, "contained") || this.options.contained === false )
			{
				this.options.sandbox.on("collections.regular.get.response", this.onGetRegularCollectionResponse, this);
				this.options.sandbox.on("collections.system.get.response", this.onGetSystemCollectionResponse, this);

				this.options.sandbox.emit('collections.regular.get');
				this.options.sandbox.emit('collections.system.get');
			}
			else
			{
				this.options.sandbox.on("entity-form.visualization.save", this.onVisualizationSaveRequested, this);
			}
		},

		/**
		 *
		 * @param D3Collection libraryCollection
		 * @returns {undefined}
		 */
		onGetLibraryCollectionResponse: function(libraryCollection)
		{
			this.options.sandbox.off("collections.library.get.response", this.onGetLibraryCollectionResponse);
			this._libraryCollection = libraryCollection;
			console.log('got library collection ' + libraryCollection.get('id'));
		},

		/**
		 *
		 * @param D3Collection regularCollections
		 * @returns {undefined}
		 */
		onGetRegularCollectionResponse: function(regularCollections)
		{
			this.options.sandbox.off("collections.regular.get.response", this.onGetRegularCollectionResponse);
			this._regularCollections = regularCollections;
			console.log('got regularCollections');
			this.$("#li-collection").html(parsedPartialSelectD3Collections({d3collections: regularCollections}));
		},

		/**
		 *
		 * @param D3Collection systemCollections
		 * @returns {undefined}
		 */
		onGetSystemCollectionResponse: function(systemCollections)
		{
			this.options.sandbox.off("collections.system.get.response", this.onGetSystemCollectionResponse);
			this._systemCollections = systemCollections;
			console.log('got systemCollections');
		},

		/**
		 *
		 * @returns ViewVisualization
		 */
		render: function()
		{
			console.log('render entity-form');
			var options = _.pick(this.options, ["titleEnabled","buttonsEnabled", "contained"]);
			var modelData = {};
			if( this.model ) modelData = this.model.toJSON();
			var data = _.extend(options, modelData, {constants:constants});
			this.$el.html(template(data));
			this.$("#select-visualization-type")[0].selectedIndex = this.model.get('visualization_type_id');

			return this;
		},

		/**
		 *
		 * @returns {Boolean}
		 */
		isValid: function()
		{
			return ( this.$("#input-visualization-name").val() !== "" &&
				this.$("#textarea-visualization-description").val() !== "" );
		},

		onButtonSaveClick: function()
		{
			this.saveVisualization();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		onVisualizationSaveRequested: function()
		{
			//no need of this, cuz it must be enabled all time, in order to let every
			//component to save a visualization.
			//this.options.sandbox.off("entity-form.visualization.save", this.onVisualizationSaveRequested);
			this.saveVisualization();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		saveVisualization: function()
		{
			var self = this;

			if( this.isValid() )
			{
				if( this._libraryCollection === null || typeof this._libraryCollection === "undefined" )
					throw new Error("library needed");

				if( !_.has(this.options, "contained") || this.options.contained === false )
				{
					this.model.setLibraryId(this._libraryCollection.get("id"));
					this.model.setCollectionId(this.$("#select-collection").val());
				}

				this.model.set({
					name										: this.$("#input-visualization-name").val(),
					description							: this.$("#textarea-visualization-description").val(),
					visualization_type_id		: this.$("#select-visualization-type").val()
				}, {silent: true});

				this._wasNew = this.model.isNew();

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

		/**
		 * Model save success callback.
		 * refresh the library and the collection to which we added the viz.
		 */
		onModelSaveSuccess: function(model, response)
		{
			console.log('model visualization save success');
			this.options.sandbox.emit("entity-form.visualization.save.success", this.model.get('id'));

			if( this._wasNew )
				this.options.sandbox.emit("collections.refresh");

			this._wasNew = false;

			//this must to be the last line because it may stop this component.
			this.options.sandbox.switchToState("home");
		},

		onModelSaveError: function(model, response)
		{
			alert('error');
		}

	});

});