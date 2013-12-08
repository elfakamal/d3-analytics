define(['underscore'], function (_)
{
  'use strict';

  return {

		type: "Backbone",


		/**
		 *
		 * @returns {undefined}
		 */
    initialize: function ()
		{
			this.initModel();
			this.initListeners();
			this.loadChartView();
    },

		/**
		 *
		 * @returns {undefined}
		 */
		initModel: function()
		{
			this.options.hasOwnProperty("model") && (this.model = this.options.model);
			if(typeof this.model === 'undefined')
				throw new Error("this chart needs a model");
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initListeners: function()
		{
			this.sandbox.on("chart.refresh", this.onChartRefreshRequested, this);
			this.sandbox.on("chart.show", this.show, this);
			this.sandbox.on("chart.hide", this.hide, this);
		},

		show: function()
		{
			this.view.show();
		},

		hide: function()
		{
			this.view.hide();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		onChartRefreshRequested : function()
		{
			this.view.show();
			this.view.update();
		},

		/**
		 *
		 * @returns {undefined}
		 */
		loadChartView: function()
		{
			if( !_.has(this.options, "chartType") ) return;

			var self = this;
			var viewChartFile = "./aura_components/chart/views/";
			viewChartFile += this.options.chartType + ".chart.viz";

			require([viewChartFile], function(ViewChart)
			{
				self.initView(ViewChart);
			});
		},

		/**
		 *
		 * @returns {undefined}
		 */
		initView: function(ViewChart)
		{
			this.view = new ViewChart({
				el			: this.$el,
				sandbox	: this.sandbox,
				model		: this.model
			});
		},

		/**
		 *
		 * @returns {undefined}
		 */
    render: function ()
		{
      //Place render logic here
      //this.$el.html('Click me: ' + this.$el.html());
    }

  };

});
