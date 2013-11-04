define({

	require: {
		paths:  {
			jquery_iframe_transport: 'bower_components/jquery-iframe-transport/jquery.iframe-transport'
		}
	},


	initialize: function (app)
	{
		var states = {
			"home": {
				components: [
					{name: "menu",			options:{el:"#section-menu-component"}},
					{name: "search",		options:{el:"#section-search-component"}},
					{name: "collection",	options:{el:"#section-collection-component"}},
					{name: "data-store",	options:{el:"#li-data-source-component"}},
					{name: "workspace",		options:{el:"#section-workspace-component"}},
					{name: "footer",		options:{el:"#footer-component"}},
				],
				preStart: {},
				postStart: {}
			},

			"add-visualization": {
				components: [
					{name: "menu",			options:{el:"#section-menu-component"}},
					{name: "search",		options:{el:"#section-search-component"}},
					{name: "collection",	options:{el:"#section-collection-component"}},
					{name: "data-store",	options:{el:"#li-data-source-component"}},
					{name: "workspace",		options:{el:"#section-workspace-component"}},
					{name: "entity-form",	options:{el:"#section-forms-component", entity:"collection"}},
					{name: "footer",		options:{el:"#footer-component"}},
				],
				preStart: {},
				postStart: {}
			}
		};

		app.sandbox.findComponentsByState = function(stateNameList, stateName)
		{
			var components = [];

			if( stateNameList && stateNameList.length > 0 && stateName )
			{
				var state = states[stateName];

				components = _.filter(state.components, function(component)
				{
					var toReturn = false;

					if( stateNameList.indexOf(component.name) >= 0 )
					{
						toReturn = true;
					}

					return toReturn;
				});
			}

			return components;
		};

		var currentState = "";

		/**
		 * Stop the un-wanted components and start the new ones.
		 */
		app.sandbox.switchToState = function(stateName, options)
		{
			if( !states.hasOwnProperty(stateName) )
			{
				throw new Error("There is no such state : " + stateName);
			}

			var nextComponents = states[stateName].components;

			var toStopNames = [];
			var toStartNames = [];

			//extract the names.
			if(nextComponents && nextComponents.length > 0)
			{
				var nextNames = _.pluck(nextComponents, "name");
				toStartNames = _.difference(nextNames, currentNames);
			}

			var componentsToStart = nextComponents;
			var componentsToStop = [];

			//the first run won't get in here.
			if( currentState !== "" && states.hasOwnProperty(currentState) )
			{
				var currentComponents = states[currentState].components;

				//extract the names.
				if(currentComponents && currentComponents.length > 0)
				{
					var currentNames = _.pluck(currentComponents, "name");
				}

				//get the difference between current component's names
				//and wanted ones.
				toStopNames = _.difference(currentNames, nextNames);
				toStartNames = _.difference(nextNames, currentNames);

				componentsToStart = app.sandbox.findComponentsByState(toStartNames, stateName);
				componentsToStop = app.sandbox.findComponentsByState(toStopNames, currentState);
			}

			if( componentsToStop && componentsToStop.length > 0 )
			{
				_.each(componentsToStop, function(component)
				{
					app.core.appSandbox.stop(component.options.el);
				});
			}

			if( componentsToStart && componentsToStart.length > 0 )
			{
				app.core.appSandbox.start(componentsToStart);
			}

			currentState = stateName;
		};

	},

	afterAppStart: function(app)
	{
		console.log("D3 Analytics App is now started !");
		app.core.appSandbox.switchToState("home", {});
	}

});