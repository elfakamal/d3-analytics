define([
	"ModelVisualization",
	"text!./templates/base.html",
	"dropdown",
	"./views/bar.chart.viz",
	"./views/pie.chart.viz"
],
function (ModelVisualization, rawBaseTemplate, DropDown, ViewBarChartViz, ViewPieChartViz)
{
	'use strict';

	var baseTemplate = _.template(rawBaseTemplate);

	return {

		type: 'Backbone',

		viz: null,

		events:
		{
			'click #button-attach-datasource': function()
			{
				this.component.onAttachDatasourceClick();
			},
			'click #button-edit': function()
			{
				this.component.onEditDatasourceClick();
			},
			'click #button-update-viz-size': function()
			{
				this.component.onUpdateClick();
			}
		},

		onUpdateClick: function()
		{
			this.viz.lol();
		},

		resizeMe: function(x, y)
		{
			var resizeData = {el:this.$el, sizeX:x, sizeY:y, reposition:true};
			this.sandbox.emit("visualizations.resize", resizeData);
		},

		onAttachDatasourceClick: function()
		{
			this.resizeMe(2, 1);
			var selectDatasourceComponent = '<div id="div-select-datasource-component" class="absolute-center"></div>';
			this.$find('#div-viz-content').html(selectDatasourceComponent);

			this.sandbox.on("datasource.chosen", this.onDatasourceChosen, this);
			this.sandbox.on("component.stop.data-source", this.onDatasourceComponentStop, this);

			this.sandbox.start([{
				name: "data-source",
				options: {
					el: "#div-select-datasource-component",
					buttonLegend:"Attach"
				}
			}]);
		},

		onDatasourceComponentStop: function()
		{
			this.restoreThumbSize();
		},

		onEditDatasourceClick: function()
		{
			this.resizeMe(3, 2);
		},

		restoreThumbSize: function()
		{
			this.resizeMe(1, 1);
		},

		onDatasourceChosen: function(modelDatasource)
		{
			this.sandbox.off("datasource.chosen", this.onDatasourceChosen);

			//ready to get the model to send the attach request.
			//alert('sending attach request');
			this.model.attachDataSource(
				modelDatasource.get('id'),
				this.onAttachDataSourceSuccess,
				this.onAttachDataSourceError,
				this);
		},

		onAttachDataSourceSuccess: function()
		{
			this.sandbox.stop('#div-select-datasource-component');
			this.restoreThumbSize();
		},

		onAttachDataSourceError: function()
		{
			console.error('something is going wrong');
			//display the error message.
		},

		initialize: function()
		{
			this.initModel();
			this.initListeners();
			this.render();
			this.initViz();

			var dropdown = new DropDown(this.$find('#div-menu-grabber'));
		},

		initViz: function()
		{
			if( this.model.get('data_sources').length > 0 )
			{
				this.resizeMe(4, 3);

				this.viz = new ViewBarChartViz({
					el		: this.$el,
					sandbox	: this.sandbox,
					model	: this.model
				});
			}
		},


		initModel: function()
		{
			if( typeof this.options.modelId === 'undefined' )
			{
				throw new Error("you must specify a model for this component");
			}

			if( typeof this.options.d3collectionId === 'undefined' )
			{
				throw new Error("you must specify a collection for this component");
			}

			//emit an event to extract the model.
			this.sandbox.on("visualizations.model.get.response", this.onGetModelVisualizationResponse, this);
			this.sandbox.emit("visualizations.model.get", this.options.modelId);
		},

		onGetModelVisualizationResponse: function(response)
		{
			this.sandbox.off("visualizations.model.get.response", this.onGetModelVisualizationResponse);

			if( _.isObject(response) )
			{
				if( response.hasOwnProperty("error") )
				{
					throw new Error(response.error);
				}

				if( response.hasOwnProperty("model") )
				{
					this.model = response.model;
					this.model.bind('change', this.updateFields, this);
				}
			}
		},

		initListeners: function()
		{

		},

		updateFields: function()
		{
			this.$find("#span-visualization-name").text(this.model.get('name'));
			this.$find("#span-visualization-description").text(this.model.get('description'));
		},

		render: function()
		{
			this.$el.html(baseTemplate(this.model.toJSON()));
		}

	};

});
