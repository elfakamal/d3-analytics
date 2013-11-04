define(["jquery", "text!../templates/base-datasource.html", "../models/datasource"],
function($, baseTemplate, DatasourceModel)
{
	var template = _.template(baseTemplate);

	return Backbone.View.extend(
	{
		_token: null,

		events: {
			"change #file-datasource": "onFileInputChange",
			"click #button-save": "onButtonSaveClick",
			"click #button-cancel": function()
			{
				this.options.sandbox.stop();
			}
		},

		initialize: function ()
		{
			var self = this;

			$.ajax({
				url			: "index_dev.php/api/datastore/datasource/form",
				type		: "GET",
				dataType	: "json",
				data:
				{
					XDEBUG_SESSION_START: "netbeans-xdebug"
				},
				success: function(data, textStatus, XMLHttpRequest)
				{
					console.log("the form : " + data);
					self._token = data;
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
					console.log("error : " + jqXHR);
				}
			});
		},

		render: function()
		{
			this.$el.html(template());
			return this;
		},

		onFileInputChange: function()
		{
			var path = this.$("#file-datasource").val();

			var index = path.lastIndexOf('\\');
			var fileName = path.substring(++index, path.length);
			console.log(fileName);

			if( fileName.length > 20 )
			{
				fileName = fileName.substring(0, 20) + "...";
			}

			this.$('#div-file-upload-mask').html('Selected file : ' + fileName);
		},

		onButtonSaveClick: function(event)
		{
			if( event )
			{
				event.preventDefault();
			}

			var self = this;
			var csrf_param = "";
			var csrf_token = "";

			if( !this._token )
			{
				throw new Error("The form is not valid");
			}

			csrf_param = this._token.token_name;
			csrf_token = this._token.token_value;

			var values = {};
			var values_with_csrf;

			_.each(this.$('form').serializeArray(), function(input)
			{
				values[ input.name ] = input.value;
			});

			values_with_csrf = _.extend({}, values);
			values_with_csrf[csrf_param] = csrf_token;

			this.model = new DatasourceModel();

			this.model.save(values,
			{
				iframe: true,
				files: this.$('form :file'),
				data: values_with_csrf,
				success: function()
				{
					self.options.sandbox.stop();
				},
				error: function()
				{
					alert('not cool upload');
				}
			});
		}

	});

});