define([], function()
{

	return Backbone.View.extend(
	{
		allowedFileTypes: [
			"text",
			"json",
			"html",
			"xml",
			"csv",
			"tsv"
		]
	});

});


