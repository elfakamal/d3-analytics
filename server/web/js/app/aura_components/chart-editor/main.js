define(["d3", "text!./templates/base.bar.html", "colorpicker"],
function(d3, rawBaseTemplate, colorpicker) {
	'use strict';

	var template = _.template(rawBaseTemplate);

	return {

		type: "Backbone",
		datasource: null,

		commonOptions: {},
		chartData: {},
		colorpickers: {},

		/**
		 * helper that acts like hasOwnProperty but more safely.
		 *
		 * @param string option: property name
		 * @returns {Boolean} whether the options object contains the property.
		 */
		hasOption: function(option)
		{
			if (typeof option === "undefined") return false;
			return _.has(this.options, option);
		},

		/**
		 *
		 */
		initialize: function()
		{
			this.initListeners();
			this.model = this.hasOption("model") ? this.options.model : null;
			this.chartData = JSON.parse(this.model.get('chart_data'));
			this.initDatasource();
		},

		/**
		 *
		 */
		initListeners: function()
		{
			this.sandbox.on("chart-editor.get.data", this.onGetDataRequest, this);
			this.sandbox.on("chart-editor.set.data", this.onSetDataRequest, this);
		},

		/**
		 *
		 * @param Object data
		 */
		onSetDataRequest: function(data)
		{
			this.chartData = data;
		},

		/**
		 * A response for the collect process.
		 *
		 * This function extracts chart data from the form and returns
		 * it to the caller.
		 */
		onGetDataRequest: function()
		{
			this.extractData();
			this.sandbox.emit("chart-editor.get.data.response", this.getData());
		},

		/**
		 * Initializes the data source from the model visualization in order
		 * to render the editor.
		 *
		 * If the data source is not loaded yet, it waits for the load complete
		 * callback to do the render.
		 *
		 * The common options are important to tell the template what to display
		 * and how.
		 */
		initDatasource: function()
		{
			var titleEnabled = this.hasOption("titleEnabled") ? this.options.titleEnabled : true,
					buttonsEnabled = this.hasOption("buttonsEnabled") ? this.options.buttonsEnabled : true,
					contained = this.hasOption("contained") ? this.options.contained : false;

			this.commonOptions = {contained: contained, titleEnabled: titleEnabled, buttonsEnabled: buttonsEnabled};

			if (this.model.getDatasource())
			{
				this.render();
			}
			else
			{
				var self = this;
				this.model.loadDatasource(function() {
					self.render();
				});
			}
		},

		/**
		 * Extracts the data source columns in order to handle the columns colors.
		 * It initializes the color pickers and listens for their change.
		 */
		render: function()
		{
			var self = this;
			var colorsDico = {};
			var columns = this.model.getDatasource().getColumns();
			this.commonOptions.columns = columns;

			//filling in the dico, example of result: {0 : "#FF5000", 1 : "#50FF00"}
			_.each(columns, function(value, key, columns) {
				_.each(this.getData().colors, function(pair) {
					if(pair[0] === value) colorsDico[key] = pair[1];
				}, this);
			}, this);

			this.$el.html(template(_.extend(
				JSON.parse(this.model.get("chart_data")),
				this.commonOptions,
				{colors: colorsDico}
			)));

			$('.my-colorpicker-control').each(function()
			{
				$(this).colorpicker({format: 'hex'}).on("changeColor", function(event)
				{
					$(this).css("background-color", event.color.toHex());

					// /!\ Watch out this line, sometimes the colors are "null" /!\
					self.colorpickers[$(this).attr("id")] = event.color.toHex();
				});
			});
		},

		/**
		 *
		 * @returns {undefined}
		 */
		updateData: function()
		{
			this.chartData.grouped = this.$find('#label-checkbox-grouped [type="checkbox"]:checked').length > 0;
			this.chartData.negative = this.$find('#label-checkbox-negative [type="checkbox"]:checked').length > 0;
			this.chartData.size = this.$find("#select-chart-size").val();
			this.chartData.colors = [];

			var columns = this.model.getDatasource().getColumns();

			_.each(columns, function(value, key, columns)
			{
				var pair = [value, this.colorpickers["span-colorpicker-" + key]];
				this.chartData.colors.push(pair);
			}, this);
		},

		/**
		 * Extracts data from the form.
		 */
		extractData: function()
		{
			this.chartData.grouped = this.$find('#label-checkbox-grouped [type="checkbox"]:checked').length > 0;
			this.chartData.negative = this.$find('#label-checkbox-negative [type="checkbox"]:checked').length > 0;
			this.chartData.size = this.$find("#select-chart-size").val();
			this.chartData.colors = [];

			var columns = this.model.getDatasource().getColumns();

			_.each(columns, function(value, key, columns)
			{
				// /!\ Watch out this line, sometimes the colors are "null" /!\ 
				var pair = [value, this.colorpickers["span-colorpicker-" + key]];
				this.chartData.colors.push(pair);
			}, this);
		},

		/**
		 *
		 * @returns Object
		 */
		getData: function()
		{
			return this.chartData;
		}

	};

});
