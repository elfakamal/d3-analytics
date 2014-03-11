define(["./chart.viz", "d3", "constants", "color"],
function(ViewChart, d3, constants, Color)
{

  return ViewChart.extend(
  {
    formatPercent: d3.format(".0%"),
    xScale: null,
    yScale: null,
    xAxis: null,
    yAxis: null,
    xTicks: false,
    yTicks: false,
    
    /**
     *free memory from the other fields.
     */
    dispose: function()
    {
      this.formatPercent = null,
      this.width = null;
      this.height = null;
      this.xScale = null;
      this.yScale = null;
      this.xAxis = null;
      this.yAxis = null;
      this.columns = null;

      ViewChart.prototype.dispose.call(this);
    },

    /***************************************************************************
     *
     * INITIALIZERS
     *
     **************************************************************************/

    /**
     *
     * @returns {undefined}
     */
    initParameters: function()
    {
      ViewChart.prototype.initParameters.call(this);

      this.initXAxis();
      this.initYAxis();
      this.drawXDomainLines();
      this.drawYDomainLines();
    },

    /**
     * Abstract function
     */
    initXAxis: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    initYAxis: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    sanitizeData: function()
    {
      var self = this;
      _.map(this.data, function(row)
      {
        row[self.getChartValueColumn()] = +row[self.getChartValueColumn()];
        return row;
      });
    },

    /***************************************************************************
     *
     * DRAWERS
     *
     **************************************************************************/

    /**
     *
     */
    drawChart: function()
    {
      ViewChart.prototype.drawChart.call(this);

      this.drawXAxis();
      this.drawYAxis();
      this.drawContent();
      this.update();
    },

    /**
     * Abstract function
     */
    drawContent: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * draws the x axis of the bar chart.
     */
    drawXAxis: function()
    {
      if (+this.chartData.size === 1)
        return;

      this.svg.append("g").attr("class", "x axis");
    },

    /**
     * draws the y axis of the bar chart.
     */
    drawYAxis: function()
    {
      if (+this.chartData.size === 1)
        return;

      this.svg.append("g").attr("class", "y axis");

//				.append("text")
//					.attr("class", "caption")
//					.attr("transform", "rotate(-90)")
//					.style("text-anchor", "end")
//					.text(_(this.columns[1]).capitalize());
    },

    /**
     * intializes the x axis ticks to draw them.
     */
    drawXDomainLines: function()
    {
      if (this.xTicks === true)
        this.xAxis.tickSize(-this.height);
    },

    /**
     * intializes the y axis ticks to draw them.
     */
    drawYDomainLines: function()
    {
      if (this.yTicks === true)
        this.yAxis.tickSize(-this.width);
    },

    /***************************************************************************
     *
     * UPDATERS
     *
     **************************************************************************/

    /**
     * updates all chart's parameters.
     *
     * @returns {undefined}
     */
    update: function()
    {
      ViewChart.prototype.update.call(this);

      this.updateScales();
      this.updateXAxis();
      this.updateYAxis();
      this.updateContent();
    },

    /**
     * Abstract function
     */
    updateScales: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    updateXAxis: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    updateYAxis: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    updateText: function()
    {
      this.svg.select(".y.axis")
      .select("text").attr("y", 6).attr("dy", ".71em");
    },

    /**
     * Abstract function
     */
    updateContent: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /***************************************************************************
     *
     * GETTERS
     *
     **************************************************************************/

    /**
     * Abstract function
     */
    getBarsPosX: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getBarsPosY: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getBarsWidth: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getBarsHeight: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getXScaleColumn: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getYScaleColumn: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    },

    /**
     * Abstract function
     */
    getChartValueColumn: function()
    {
      throw new Error("This is an abstract method, you must override it.");
    }
  });

});


