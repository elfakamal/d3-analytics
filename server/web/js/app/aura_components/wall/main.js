define([
	"./collections/visualizations",
	"text!./templates/base.html",
	"text!./templates/visualization.html",
	"gridster"
],
function(VisualizationCollection, rawBaseTemplate, rawVisualizationTemplate, gridster)
{
	"use strict";

	var baseTemplate			= _.template(rawBaseTemplate);
	var visualizationTemplate	= _.template(rawVisualizationTemplate);

	return {

		type: "Backbone",
		childrenVisualizations: [],
		grid: null,
		_library: null,

		initialize: function()
		{
			this.initCollection();
			this.initListeners();
			this.lazyInitLibrary();
		},

		initCollection: function()
		{
			this.collection = new VisualizationCollection();

			this.collection.bind('add', this.renderOne, this);
			this.collection.bind('remove', this.render, this);
			this.collection.bind('reset', this.render, this);
		},

		lazyInitLibrary: function()
		{
			this.sandbox.on("collections.library.get.response", this.onGetLibraryCollectionResponse, this);

			//don't need to send this demand, the collection component send it
			//just after it's totally loaded.
			//this.sandbox.emit("collections.library.get");
		},

		onGetLibraryCollectionResponse: function(libraryCollection)
		{
			this.sandbox.off("collections.library.get.response", this.onGetLibraryCollectionResponse);
			this._library = libraryCollection;
		},

		initListeners: function()
		{
			this.sandbox.on('collections.selected', this.onCollectionSelected, this);
			this.sandbox.on("visualizations.resize", this.onVisualizationResize, this);
			this.sandbox.on("visualizations.model.get", this.onVisualizationModelRequest, this);
		},

		onCollectionSelected: function(d3collectionModel)
		{
			this.collection.setCollectionId(d3collectionModel.get('id'));
		},

		onVisualizationResize: function(resizeData)
		{
			if( typeof resizeData !== "undefined" )
			{
				this.grid.resize_widget(
					resizeData.el,
					resizeData.sizeX,
					resizeData.sizeY,
					resizeData.reposition);
			}
		},

		onVisualizationModelRequest: function(visualizationId)
		{
			var result = this.collection.filter(function(modelVisualization)
			{
				return modelVisualization.get('id') == visualizationId;
			});

			if( result.length !== 1 )
			{
				this.sandbox.emit('visualizations.model.get.response', {error: "there is no such visualization"});
			}

			var modelVisualization = result[0];
			modelVisualization.setCollectionId(this.collection.getCollectionId());
			modelVisualization.setLibraryId(this._library.get('id'));
			this.sandbox.emit('visualizations.model.get.response', {model: modelVisualization});
		},

		initGrid: function()
		{
			this.grid = $(".gridster > ul").gridster({
				widget_margins: [10, 10],
				widget_base_dimensions: [180, 180],
				draggable:{
					handle: 'div#div-handle #span-visualization-name'
				}
			}).data("gridster");
		},

		stopChildren: function()
		{
			_.each(this.childrenVisualizations, function(selector)
			{
				if( this.$find(selector).length > 0 )
				{
					this.sandbox.stop(selector);
				}
			}, this);
		},

		renderOne: function(modelVisualization)
		{
			var data = {
				id				: modelVisualization.get('id'),
				d3collectionId	: this.collection.getCollectionId()
			};

			var newVisualizationHTML = visualizationTemplate(_.extend(data, modelVisualization.toJSON()));
			var gridsterWidget = this.grid.add_widget(newVisualizationHTML);
			var newVisualizationElementID = $(gridsterWidget).attr("id");
			this.childrenVisualizations.push("#" + newVisualizationElementID);
		},

		render: function()
		{
			this.stopChildren();
			this.html(baseTemplate());
			this.initGrid();

//			this.renderOne(this.collection.at(0));

			this.collection.each(function(modelVisualization)
			{
				this.renderOne(modelVisualization);
			}, this);
		}

	}

});