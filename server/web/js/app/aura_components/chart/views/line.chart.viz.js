define(["./axial.chart.viz", "d3", "constants", "color"],
function(ViewAxialChart, d3, constants, Color)
{
  return ViewAxialChart.extend(
  {
    path: null,
    parseDate: d3.time.format("%d-%b-%y").parse,

    /**
     * overriding the parent initialize function in order to assign some fields.
     */
    initialize: function()
    {
      this.defaultOrientation = constants.TOP;
      this.orientation = constants.TOP;
      this.xTicks = false;
      this.yTicks = true;

      ViewAxialChart.prototype.initialize.call(this);
    },

    sanitizeData: function()
    {
      var self = this;
      _.map(this.data, function(row)
      {
        row[self.getXScaleColumn()] = self.parseDate(row[self.getXScaleColumn()]);
        row[self.getChartValueColumn()] = +row[self.getChartValueColumn()];
        return row;
      });
    },

    /**
     *
     * @returns {undefined}
     */
    initParameters: function()
    {
      ViewAxialChart.prototype.initParameters.call(this);
      this.initPath();
    },

    initPath: function()
    {
      var self = this;
      this.path = d3.svg.line()
      .x(function(d) {
        return self.xScale(d[self.getXScaleColumn()]);
      })
      .y(function(d) {
        return self.yScale(d[self.getYScaleColumn()]);
      });
    },

    /**
     * this function needs to be overriden.
     */
    initColorScale: function()
    {
      var colors = this.generateColors();
      this.colorScale = d3.scale.ordinal().range(colors);
    },

    initXAxis: function()
    {
      this.xScale = d3.time.scale().range([0, this.width]);
      var orient = this.orientation === constants.TOP ? constants.BOTTOM : constants.TOP;
      this.xAxis = d3.svg.axis().scale(this.xScale).orient(orient);
    },

    initYAxis: function()
    {
      if (this.orientation === constants.TOP)
        this.yScale = d3.scale.linear().range([this.height, 0]);
      else
        this.yScale = d3.scale.linear().range([0, this.height]);

      this.yAxis = d3.svg.axis().scale(this.yScale).orient("left");
    },

    drawContent: function()
    {
      this.svg.append("path")
      .datum(this.data)
      .attr("class", "path line")
      .style("fill", "none")
      .style("stroke", "steelblue")
      .style("stroke-width", "1px");
    },

    updateScales: function()
    {
      var self = this, yDomain = [];
      self.xScale.domain(d3.extent(this.data, function(d) {
        return d[self.getXScaleColumn()];
      }));

      yDomain = [
        Math.min(0, d3.min(this.data, function(d) {
          return d[self.getYScaleColumn()];
        })),
        d3.max(this.data, function(d) {
          return d[self.getYScaleColumn()];
        })
      ];

      self.yScale.domain(yDomain).nice();
    },

    /**
     *
     * @returns {undefined}
     */
    updateXAxis: function()
    {
      this.svg.select(".x.axis")
      .attr("transform", "translate(0," + this.yScale(0) + ")")
      .call(this.xAxis);
    },

    /**
     *
     * @returns {undefined}
     */
    updateYAxis: function()
    {
      this.svg.select(".y.axis").call(this.yAxis);
    },

    updateContent: function()
    {
      this.svg.select(".path").attr("d", this.path);
    },

    /**
     * in the horizontal bars chart, it's the second values that matters.
     *
     * @returns {String}
     */
    getXScaleColumn: function()
    {
      return this.columns[0];
    },

    /**
     *
     * @returns {String}
     */
    getYScaleColumn: function()
    {
      return this.columns[1];
    },

    /**
     *
     * @returns {String}
     */
    getChartValueColumn: function()
    {
      return this.getYScaleColumn();
    },

    marginTop: function()
    {
      var defaultMargin = 20;
      if (this.chartData && +this.chartData.size === 1)
        return 5;
      return defaultMargin;
    },

    marginRight: function()
    {
      var defaultMargin = 20;
      if (this.chartData && +this.chartData.size === 1)
        return 5;

      if (this.orientation === constants.LEFT)
        return 40;

      return defaultMargin;
    },

    marginLeft: function()
    {
      var defaultMargin = 40;
      if (this.chartData && +this.chartData.size === 1)
        return 5;

      return defaultMargin;
    },

    marginBottom: function()
    {
      var defaultMargin = 30;
      if (this.chartData && +this.chartData.size === 1)
        return 5;

      return defaultMargin;
    }

  });

});