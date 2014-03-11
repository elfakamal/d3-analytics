define(["./axial.chart.viz", "d3", "constants", "color"],
function(ViewAxialChart, d3, constants, Color)
{

  return ViewAxialChart.extend(
  {
    drawContent: function()
    {
      this.drawBars();
      this.initBarsListeners();
    },

    /**
     * draws the bar of the bar chart based on the data source.
     */
    drawBars: function()
    {
      this.svg.selectAll(".bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar");
    },

    initBarsListeners: function()
    {
      this.svg.selectAll(".bar")
      //.on('click', this.onBarClick())
      .on('mouseover', this.onBarMouseOver())
      .on('mouseout', this.onBarMouseOut());
    },

    onBarClick: function()
    {
      var self = this;

      return function(d)
      {
        self.createTip(d, this);
      };
    },

    onBarMouseOver: function()
    {
      var self = this;

      return function(d)
      {
        var currentRGBAColor = d3.select(this).style('fill');
        var color = new Color(currentRGBAColor);
        color.setAlpha(1);
        d3.select(this).style('fill', color.toRGBAString());
        self.createTip(d, this);
      };
    },

    onBarMouseOut: function()
    {
      var self = this;

      return function(d)
      {
        var currentRGBAColor = d3.select(this).style('fill');
        var color = new Color(currentRGBAColor);
        color.setAlpha(.5);
        d3.select(this).style('fill', color.toRGBAString());
        self.svg.select('.tip').remove();
      };
    },

    createTip: function(d, rect)
    {
      var posX = d3.select(rect).attr("x");
      var posY = d3.select(rect).attr("y") - constants.TIP_MARGIN_BOTTOM;

      (posY <= this.marginTop()) && (posY = this.marginTop());

      this.svg.select('.tip').remove();

      var tipContainer = this.svg.append("g")
      .attr("class", "tip")
      .attr("transform", "translate(" + posX + "," + posY + ")");

      var text = tipContainer.append("text")
      .attr("y", -constants.TIP_MARGIN_BOTTOM)
      .style('fill', 'rgb(50, 50, 50)')
      .style('font-weight', 'bold')
      .text(d[this.columns[1]]);
    },

    updateContent: function()
    {
      var self = this;

      this.svg.selectAll(".bar")

      .style('fill', function(d) {
        return self.colorScale(d[self.getXScaleColumn()]);
      })

      .attr("x", this.getBarsPosX())
      .attr("y", this.getBarsPosY())

      .attr("width", this.getBarsWidth())
      .attr("height", this.getBarsHeight());
    }

  });

});
