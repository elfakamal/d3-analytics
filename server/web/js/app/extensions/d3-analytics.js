define(['../scripts/state-manager', '../scripts/naive-component'],
function(StateManager, NaiveComponent)
{

	return {

		require: {
			paths:  {
				jquery_iframe_transport: 'bower_components/jquery-iframe-transport/jquery.iframe-transport'
			}
		},

		initialize: function (app)
		{
			var stateManager = new StateManager();
			var allComponents = {
				"menu"					: new NaiveComponent("menu",		{el:"#nav-menu-component",tagName:"nav",parent:"#header",index:0}),
				"search"				: new NaiveComponent("search",		{el:"#section-search-component",tagName:"section",parent:"#aside-side-pane",index:0}),
				"collection"			: new NaiveComponent("collection",	{el:"#section-collection-component",tagName:"section",parent:"#aside-side-pane",index:1}),
				"datastore"				: new NaiveComponent("data-store",	{el:"#section-data-store-component",tagName:"section",parent:"#aside-side-pane",index:2}),
				"workspace"				: new NaiveComponent("workspace",	{el:"#section-workspace-component",tagName:"section",parent:"#section-content",index:0}),
				"collection-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"collection",tagName:"section",className:"center-container",parent:"#section-workspace-component",index:0}),
				"datastore-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"datastore",tagName:"section",className:"center-container",parent:"#section-workspace-component",index:0}),
				"visualization-form"	: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"visualization",tagName:"section",className:"center-container",parent:"#section-workspace-component",index:0}),
				"datasource-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"datasource",tagName:"section",className:"center-container",parent:"#section-workspace-component",index:0}),
				"footer"				: new NaiveComponent("footer",		{el:"#div-footer-component",tagName:"div",className:"center-container",parent:"#footer",index:0})
			};

			stateManager.addState("home", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["workspace"],
				allComponents["footer"],
			]);

			stateManager.addState("add-collection", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["workspace"],
				allComponents["collection-form"],
				allComponents["footer"],
			]);

			stateManager.addState("add-datastore", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["workspace"],
				allComponents["datasource-form"],
				allComponents["footer"],
			]);

			stateManager.addState("add-visualization", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["workspace"],
				allComponents["visualization-form"],
				allComponents["footer"],
			]);

			var currentState = "";

			/**
			 * Stop the un-wanted components and start the new ones.
			 */
			app.sandbox.switchToState = function(stateName, options)
			{
				if( !stateManager.hasState(stateName) )
				{
					console.warn("The requested state doesn't exist, state : " + stateName);
					return;
				}

				var switched				= false;

				var componentNamesToStart	= stateManager.compare(stateName, currentState);
				var componentNamesToStop	= stateManager.compare(currentState, stateName);
				var componentsToStart		= stateManager.findComponentsByState(componentNamesToStart, stateName, true);
				var componentsToStop		= stateManager.findComponentsByState(componentNamesToStop, currentState, true);

				stateManager.createElements(stateName, componentNamesToStart);

				if( componentsToStop && componentsToStop.length > 0 )
				{
					_.each(componentsToStop, function(component)
					{
						app.core.appSandbox.stop(component.options.el);
					});

					switched = true;
				}

				if( componentsToStart && componentsToStart.length > 0 )
				{
					app.core.appSandbox.start(componentsToStart);
					switched = true;
				}

				currentState = stateName;

				if( switched )
				{
					console.log("state switched to : " + stateName);
				}
			};

		},

		afterAppStart: function(app)
		{
			//console.log("D3 Analytics App is now started !");
			app.core.appSandbox.switchToState("home", {});
		}

	}
});