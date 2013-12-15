define(["./pie.chart.viz", "constants"],
function(ViewPieChart, constants)
{

	return ViewPieChart.extend(
	{
		donutTickness: 40, //constants.DONUT_TICKNESS

		innerRadius :function()
		{
			return this.radius() - this.donutTickness;
		}
	});

});