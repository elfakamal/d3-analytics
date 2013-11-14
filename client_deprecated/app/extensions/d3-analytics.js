define(
{
	initialize: function (app)
	{
		app.sandbox.reverse = function (string) {
			return string.split('').reverse().join('');
		};
	},

	afterAppStart: function(app)
	{
		console.log("D3 Analytics App is now started !");
		$('#section-workspace').append('<section data-aura-component="entity-form" data-aura-entity="collection" id="section-forms-component"></section>')
		app.sandbox.start([{name: "entity-form", options:{el:"#section-forms-component", entity: "collection"}}]);
	}

});