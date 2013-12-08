define([
	"ModelVisualization",
	"text!./templates/base.html",
	"text!./templates/edit.html",
	"dropdown",
	"tab"
	],
	function (ModelVisualization, rawBaseTemplate, rawEditTemplate, DropDown, tab)
	{
		'use strict';

		var baseTemplate = _.template(rawBaseTemplate);
		var editTemplate = _.template(rawEditTemplate);

		return {

			type: 'Backbone',

			viz: null,
			isDatasourceComponentStarted: false,
			isEntityFormComponentStarted: false,
			isChartEditorComponentStarted: false,
			isChartComponentStarted: false,

			childrenComponents: {
				"chart": "#div-chart-component",
				"datasource": "#div-select-datasource-component",
				"chart-editor": "#section-chart-editor-component",
				"entity-form": "#section-visualization-form-component",
				"edit": "#div-edit-visualization"
			},

			events:
			{
				'click #button-attach-datasource': function()
				{
					this.component.onAttachDatasourceClick();
				},
				'click #button-edit': function()
				{
					this.component.onEditVisualizationClick();
				},
				'click #button-save': function()
				{
					this.component.save();
				},
				'click #button-cancel': function()
				{
					this.component.resetThumb();
				},
				'click #li-tab-chart': function()
				{
					this.component.onChartTabClick();
				}
			},

			/**
			 * Initializes all the requirements of the visualization components.
			 */
			initialize: function()
			{
				this.initModel();
				this.render();
				this.initViz();
			},

			/**
			 * Initializes the visualization's chart.
			 */
			initViz: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				if (this.model.get('data_sources').length > 0)
				{
					if (!this.isChartComponentStarted)
					{
						//start the chart component.
						var chartComponent = '<div id="div-chart-component" class="absolute-center"></div>';
						this.$find('#div-viz-content').html(chartComponent);

						this.sandbox.on("component.stop.chart", this.onChartComponentStop, this);
						this.sandbox.start([{
							name: "chart",
							options: {
								el: "#div-chart-component",
								chartType: "bar",
								model: this.model
							}
						}]);

						this.isChartComponentStarted = true;
					}
				}
			},

			/**
			 *
			 */
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

			/**
			 *
			 */
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

			/**
			 * a helper that resizes the visualization's thumb, it must send a request
			 * to the wall component to do this.
			 */
			resizeMe: function(x, y, callback)
			{
				var resizeData = {
					el:this.$el,
					sizeX:x,
					sizeY:y,
					reposition:true,
					callback: callback
				};

				this.sandbox.emit("visualizations.resize", resizeData);
			},

			/**
			 * Restores the size of the thumb to it's default / original size.
			 */
			restoreThumbSize: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				var sizeIndex = JSON.parse(this.model.get('chart_data')).size;
				this.resizeMe.apply(this, this.sandbox.visualizationSizes[sizeIndex]);
				this.sandbox.emit("chart.refresh");
			},

			/**
			 *
			 * @returns {undefined}
			 */
			resetThumb: function()
			{
				//stop all tabbed sub components
				this.stopComponents(["entity-form", "chart-editor", "datasource"]);

				//remove the edit area
				this.$find(this.childrenComponents["edit"]).remove();

				//reset the size
				this.restoreThumbSize();

				//reset the view
				this.renderIcon();
				this.showTitle();

				//TODO: reset the flags
			},

			/**
			 * Shows the thumb title.
			 */
			showTitle: function()
			{
				if( this.$find("#div-handle").hasClass("hidden") )
				{
					this.$find("#div-handle").removeClass("hidden");
				}
			},

			/**
			 * Hides the thumb title.
			 */
			hideTitle: function()
			{
				if( !this.$find("#div-handle").hasClass("hidden") )
				{
					this.$find("#div-handle").addClass("hidden");
				}
			},

			/**
			 * Sends a request to gather data from the chart editor, and then saves
			 * the model.
			 */
			save: function()
			{
				if( this.isChartEditorComponentStarted )
				{
					this.sandbox.on("chart-editor.get.data.response", this.onGetChartDataResponse, this);
					this.sandbox.emit("chart-editor.get.data");
				}
				else
				{
					this.sandbox.emit("entity-form.visualization.save");
				}
			},

			/**
			 * A response for the collect process.
			 *
			 * This function gets the chart data from the chart editor and sends
			 * the save request to the actual form entity (it have the same model).
			 */
			onGetChartDataResponse: function(chartData)
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				if (this.isEntityFormComponentStarted && this.isChartEditorComponentStarted)
				{
					this.sandbox.off("chart-editor.get.data.response", this.onGetChartDataResponse);
					this.model.set({chart_data: JSON.stringify(chartData)});
					this.sandbox.emit("entity-form.visualization.save");
				}
			},

			/**
			 * Stops a list of component based on their names.
			 *
			 * @param {Array} componentList
			 * @returns {undefined}
			 */
			stopComponents: function(componentList)
			{
				_.each(componentList, function(componentName)
				{
					if(_.has(this.childrenComponents, componentName))
						this.sandbox.stop(this.childrenComponents[componentName])
				}, this);
			},

			/**
			 * Starts the data source component
			 */
			onAttachDatasourceClick: function()
			{
				if( !this.isDatasourceComponentStarted )
				{
					this.stopComponents(["chart", "chart-editor", "entity-form"]);

					this.resizeMe(2, 1);
					this.hideTitle();

					var selectDatasourceComponent = '<div id="div-select-datasource-component" class="absolute-center"></div>';

					//using "html" instead of "append" => it's the datasource component
					//which means if it changes the data source of the visualization,
					//there will be a need of redrawing the chart using the new data.
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

					this.isDatasourceComponentStarted = true;
				}
			},

			/**
			 * When the data source component is stopped, this resets it's related
			 * state by disabling it's listener and flag.
			 */
			onDatasourceComponentStop: function()
			{
				this.isDatasourceComponentStarted = false;
				this.sandbox.off("datasource.chosen", this.onDatasourceChosen);
				this.sandbox.off("component.stop.data-source", this.onDatasourceComponentStop);

				this.initViz();
				this.resetThumb();
			},

			onChartComponentStop: function()
			{
				this.isChartComponentStarted = false;
				this.sandbox.off("component.stop.chart", this.onChartComponentStop);
			},

			/**
			 * Starts the entity form component.
			 */
			onEditVisualizationClick: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				if( !this.isEntityFormComponentStarted )
				{
					this.stopComponents(["datasource"]);

					//before editing the chart, we are hiding the component because
					//we need it afterwards.
					this.sandbox.emit("chart.hide");

					this.resizeMe(3, 2);
					this.hideTitle();

					//using "append" instead of "html" because we need the chart component
					//in this case we don't need to stop the chart, as the data won't
					//change.
					this.$find("#div-viz-content").append(editTemplate());
					this.$find('#ul-tabs a:first').tab('show');

					this.sandbox.on("entity-form.visualization.save.success", this.onVisualizationSaveSuccess, this);
					this.sandbox.on("component.stop.entity-form", this.onEntityFormComponentStop, this);

					this.sandbox.start([{
						name: "entity-form",
						options: {
							el							: "#section-visualization-form-component",
							model						: this.model,
							entity					: "visualization",
							titleEnabled		: false,
							buttonsEnabled	: false,
							contained				: true
						}
					}]);

					this.isEntityFormComponentStarted = true;
				}
			},

			/**
			 * we must stop either the entity form component AND the chart editor
			 * component.
			 */
			onVisualizationSaveSuccess: function()
			{
				this.sandbox.off("entity-form.visualization.save.success", this.onVisualizationSaveSuccess);
				this.resetThumb();
			},

			/**
			 * When the entity form component is stopped, this resets it's related
			 * state by disabling it's listener and flag.
			 */
			onEntityFormComponentStop: function()
			{
				this.isEntityFormComponentStarted = false;
				this.sandbox.off("component.stop.entity-form", this.onEntityFormComponentStop);
				this.sandbox.off("entity-form.visualization.save.success", this.onVisualizationSaveSuccess);
			},

			/**
			 * Starts the chart editor (in case it's not), and passes the model to it.
			 */
			onChartTabClick: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				if( !this.isChartEditorComponentStarted )
				{
					this.sandbox.on("component.stop.chart-editor", this.onChartEditorComponentStop, this);
					this.sandbox.start([{
						name: "chart-editor",
						options: {
							el							: "#section-chart-editor-component",
							model						: this.model,
							titleEnabled		: false,
							buttonsEnabled	: false,
							contained				: true
						}
					}]);

					this.isChartEditorComponentStarted = true;
				}
			},

			/**
			 * When the chart editor component is stopped, this resets it's related
			 * state by disabling it's listener and flag.
			 */
			onChartEditorComponentStop: function()
			{
				this.isChartEditorComponentStarted = false;
				this.sandbox.off("component.stop.chart-editor", this.onChartEditorComponentStop);
			},

			/**
			 * Callback for the 'datasource.chosen' event, it attaches the data source
			 * to this visualization.
			 */
			onDatasourceChosen: function(modelDatasource)
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				this.sandbox.off("datasource.chosen", this.onDatasourceChosen);

				//ready to get the model to send the attach request.
				this.model.attachDataSource(
					modelDatasource.get('id'),
					this.onAttachDataSourceSuccess,
					this.onAttachDataSourceError,
					this);
			},

			/**
			 * Stops the data source component when it succeeds, and restores
			 * the thumb's size.
			 */
			onAttachDataSourceSuccess: function()
			{
				this.stopComponents(["datasource"]);
				this.restoreThumbSize();
			},

			/**
			 * TODO: display a message to the user.
			 */
			onAttachDataSourceError: function()
			{
				console.error('onAttachDataSourceError: something is going wrong');
			},

			/**
			 *
			 */
			updateFields: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				this.$find("#span-visualization-name").text(this.model.get('name'));
				this.$find("#span-visualization-description").text(this.model.get('description'));
			},

			/**
			 *
			 */
			render: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				this.$el.html(baseTemplate(this.model.toJSON()));
				this.renderIcon();
				var dropdown = new DropDown(this.$find('#div-menu-grabber'));
			},

			/**
			 *
			 * @returns {undefined}
			 */
			renderIcon: function()
			{
				if (typeof this.model === "undefined")
					throw new Error("model is missing");

				if (!this.isChartComponentStarted)
				{
					var vizType = this.model.get('visualization_type_id');

					if (_.has(this.sandbox.visualizationTypes, vizType) &&
							_.has(this.sandbox.chartIcons, this.sandbox.visualizationTypes[vizType]))
					{
						var chartIcon = this.sandbox.chartIcons[this.sandbox.visualizationTypes[vizType]];
						this.$find("#div-viz-content").html('<span id="span-chart-icon" class="icon absolute-center">' + chartIcon + '</span>');
					}
				}
			}

		};

	});
