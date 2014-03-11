define(["constants", "d3", "color"], function(constants, d3, Color)
{

  return Backbone.View.extend(
  {
    width: null,
    height: null,
    defaultOrtientation: "",
    orientation: "",
    data: null,
    chartData: null,
    svg: null,
    colorScale: null,
    columns: {},

    /**
     *
     * @returns {undefined}
     */
    initialize: function()
    {
      this.initListeners();
      this.render();
    },

    /**
     *
     * @returns {undefined}
     */
    initParameters: function()
    {
      this.chartData = JSON.parse(this.model.get("chart_data"));

      this.width = this.realWidth() - this.marginLeft() - this.marginRight();
      this.height = this.realHeight() - this.marginTop() - this.marginBottom();

      this.initColorScale();
    },

    /**
     * this function needs to be overriden.
     */
    initColorScale: function()
    {
      var colors = this.getColorDictionary();
      this.colorScale = d3.scale.ordinal().range(colors);
    },

    initListeners: function()
    {
      this.model.on('change', this.onModelChange, this);
    },

    onModelChange: function()
    {
      this.chartData = JSON.parse(this.model.get("chart_data"));
    },

    render: function()
    {
      this.initParameters();
      this.initDatasource();
    },

    initDatasource: function()
    {
      if (!this.data)
        this.model.loadDatasource(this.onLoaderComplete, this);
    },

    /**
     *
     * @param {Object} data
     * @returns {undefined}
     */
    onLoaderComplete: function(data)
    {
      this.columns = this.model.getDatasource().getColumns();
      this.data = data;
      this.sanitizeData();
      this.drawChart();
    },

    marginTop: function()
    {
      var defaultMargin = 10;

      if (this.chartData && +this.chartData.size === 1)
        defaultMargin = 5;

      return defaultMargin;
    },

    marginRight: function()
    {
      var defaultMargin = 10;

      if (this.chartData && +this.chartData.size === 1)
        defaultMargin = 5;

      return defaultMargin;
    },

    marginBottom: function()
    {
      var defaultMargin = 30;

      if (this.chartData && +this.chartData.size === 1)
        defaultMargin = 5;

      return defaultMargin;
    },

    marginLeft: function()
    {
      var defaultMargin = 40;

      if (this.chartData && +this.chartData.size === 1)
        defaultMargin = 5;

      return defaultMargin;
    },

    /**
     *
     */
    realWidth: function()
    {
      var defaultWidth = constants.DEFAULT_THUMB_WIDTH;
      var sizeX = 1;

      if (!_.isEmpty(this.chartData))
        sizeX = constants.VISUALIZATION_SIZES[this.chartData.size][0];

      //piked from the gridster width computing formula.
      return (sizeX * defaultWidth + ((sizeX - 1) * constants.DEFAULT_HORIZONTAL_MARGIN) * 2);
    },

    /**
     *
     */
    realHeight: function()
    {
      var defaultHeight = constants.DEFAULT_THUMB_HEIGHT;
      var sizeY = 1;

      if (!_.isEmpty(this.chartData))
        sizeY = constants.VISUALIZATION_SIZES[this.chartData.size][1];

      //piked from the gridster width computing formula.
      var height = (sizeY * defaultHeight + ((sizeY - 1) * constants.DEFAULT_VERTICAL_MARGIN) * 2);
      return height;// - constants.THUMB_TITLE_HEIGHT;
    },

    /**
     * Abstract function
     */
    generateColors: function(count)
    {
      var colors = [];

      var iterator = function()
      {
        var R, G, B;

        R = Math.round(Math.random() * 255);
        G = Math.round(Math.random() * 255);
        B = Math.round(Math.random() * 255);

        var rgb = [R, G, B, .5];
        var strRGB = "rgba(" + rgb.join(",") + ")";
        colors.push(strRGB);

        //free memory
        rgb = null;
        strRGB = "";
      };

      if (typeof count !== "undefined")
        for (var i = 0; i < count; i++)
          iterator();
      else
        _.each(this.columns, iterator);

      return colors;
    },

    /**
     * filling in the dico, example of result: {0 : "#FF5000", 1 : "#50FF00"}
     *
     * @returns {undefined}
     */
    getColorDictionary: function()
    {
      var colorsArray = [];

      if (!_.isEmpty(this.columns))
      {
        var realColumns = _.rest(_.values(this.columns));

        if (this.model.get('chart_data') !== "")
        {
          var chartData = JSON.parse(this.model.get('chart_data'));

          _.each(realColumns, function(value, key, list) {
            _.each(chartData.colors, function(pair)
            {
              if (pair[0] === value)
              {
                var color = new Color(pair[1]);
                color.setAlpha(.5);
                colorsArray.push(color.toRGBAString());

                //free memory
                color = null;
              }
            },

            this);
          },

          this);
        }

        //free memory
        realColumns = null;
      }

      return colorsArray;
    },

    /**
     * Abstract function
     */
    getChartIcon: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    show: function()
    {
      this.$el.css("display", "block").css("overflow", "auto");
    },

    hide: function()
    {
      this.$el.css("display", "none").css("overflow", "hidden");
    },

    drawChart: function()
    {
      this.drawBase();
      this.positionBase();
    },

    /**
     *
     * @returns {undefined}
     */
    drawBase: function()
    {
      this.$el.html("");
      var vizSelection = d3.select("#li-viz-" + this.model.get('id'));
      var viz = vizSelection.select("#div-chart-component");

      this.svg = viz.append("svg")
      .attr("width", this.width + this.marginLeft() + this.marginRight())
      .attr("height", this.height + this.marginTop() + this.marginBottom())
      .attr("class", "absolute-center")
      .style("margin-top", "auto")
      .style("margin-bottom", "0px")
      .append("g")
      .attr("class", "first-g");
    },

    positionBase: function()
    {
      this.svg.attr("transform", "translate(" + this.marginLeft() + "," + this.marginTop() + ")");
    },

    /**
     * Abstract function
     */
    update: function()
    {
      this.initParameters();
      this.updateSVG();
    },

    /**
     *
     */
    updateSVG: function()
    {
      d3.select("#li-viz-" + this.model.get('id'))
      .select("svg")
      .attr("width", this.width + this.marginLeft() + this.marginRight())
      .attr("height", this.height + this.marginTop() + this.marginBottom());

//			this.svg.select(".first-g")
//				.attr("transform", "translate(" + this.marginLeft() + "," + this.marginTop() + ")");
    },

    /**
     * free memory.
     */
    dispose: function()
    {
      this.data = null;
      this.chartData = null;
      this.svg.remove();
      this.svg = null;
      this.defaultOrtientation = "";
      this.orientation = "";
    }

  });

});

