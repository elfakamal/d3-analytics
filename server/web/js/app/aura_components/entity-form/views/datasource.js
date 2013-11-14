define([
	"jquery",
	"text!../templates/base-datasource.html",
	"ModelDatasource"
],
function($, baseTemplate, ModelDatasource)
{

	var template = _.template(baseTemplate);

	return Backbone.View.extend(
	{
		_token: null,
		_isTitled: true,

		setIsTitled: function(isTitled)
		{
			this._isTitled = isTitled;
		},

		events: {
			"change #file-datasource"	: "onFileInputChange",
			"click #button-save"		: "onButtonSaveClick",
			"click #button-cancel"	: function(event)
			{
				if( event )
				{
					event.preventDefault();
				}

				this.options.sandbox.switchToState("home");
			}
		},

		initialize: function ()
		{
			this.render();
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
					//console.log("the form : " + data);
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
			this.$el.html(template({isTitled: this._isTitled}));
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

			this.model = new ModelDatasource();

			this.model.save(values,
			{
				iframe		: true,
				files		: this.$('form :file'),
				data		: values_with_csrf,
				success	: function()
				{
					self.options.sandbox.switchToState("home");
				},
				error: function()
				{
					alert('not cool upload');
				}
			});
		}

	});

});
