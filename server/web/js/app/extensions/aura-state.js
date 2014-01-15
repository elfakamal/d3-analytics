define(['../scripts/state-manager', '../scripts/naive-component'],
function(StateManager, NaiveComponent)
{
	'use strict';

	return {

		name: 'D3 Analytics States',

		initialize: function (app)
		{
			var stateManager = new StateManager();
			var allComponents = {
				"menu"					: new NaiveComponent("menu",		{el:"#nav-menu-component",tagName:"nav",parent:"#header",index:0}),
				"search"				: new NaiveComponent("search",		{el:"#section-search-component",tagName:"section",parent:"#aside-side-pane",index:0}),
				"collection"			: new NaiveComponent("collection",	{el:"#section-collection-component",tagName:"section",parent:"#aside-side-pane",index:1}),
				"datastore"				: new NaiveComponent("data-store",	{el:"#section-data-store-component",tagName:"section",parent:"#aside-side-pane",index:2}),
				"wall"					: new NaiveComponent("wall",		{el:"#section-wall-component",tagName:"section",parent:"#section-content",index:0}),
				"collection-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"collection",tagName:"section",className:"center-container overlay",parent:"body",index:0}, ["entity"]),
				"datastore-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"datastore",tagName:"section",className:"center-container overlay",parent:"body",index:0}, ["entity"]),
				"visualization-form"	: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"visualization",tagName:"section",className:"center-container overlay",parent:"body",index:0}, ["entity"]),
				"datasource-form"		: new NaiveComponent("entity-form",	{el:"#section-forms-component",entity:"datasource",tagName:"section",className:"center-container overlay",parent:"body",index:0}, ["entity"]),
				"footer"				: new NaiveComponent("footer",		{el:"#div-footer-component",tagName:"div",className:"center-container",parent:"#footer",index:0})
			};

			stateManager.addState("home", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["wall"],
				allComponents["footer"],
			]);

			stateManager.addState("add-collection", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["wall"],
				allComponents["collection-form"],
				allComponents["footer"],
			]);

			stateManager.addState("add-datastore", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["wall"],
				allComponents["datastore-form"],
				allComponents["footer"],
			]);

			stateManager.addState("add-visualization", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["wall"],
				allComponents["visualization-form"],
				allComponents["footer"],
			]);

			stateManager.addState("add-datasource", [
				allComponents["menu"],
				allComponents["search"],
				allComponents["collection"],
				allComponents["datastore"],
				allComponents["wall"],
				allComponents["datasource-form"],
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

				if( stateName === currentState )
				{
					console.log("already in this state : " + stateName);
					return;
				}

				var componentNamesToStart	= stateManager.compare(stateName, currentState);
				var componentNamesToStop	= stateManager.compare(currentState, stateName);
				var componentsToStart		= stateManager.findComponentsByState(componentNamesToStart, stateName, true);
				var componentsToStop		= stateManager.findComponentsByState(componentNamesToStop, currentState, true);

				if( componentsToStop && componentsToStop.length > 0 )
				{
					_.each(componentsToStop, function(component)
					{
						app.core.appSandbox.stop(component.options.el);
					});
				}

				stateManager.createElements(stateName, componentNamesToStart);

				if( componentsToStart && componentsToStart.length > 0 )
				{
					app.core.appSandbox.start(componentsToStart);
				}

				currentState = stateName;
			};

			/**
			 *
			 */
			app.sandbox.stopComponents = function(components)
			{
				if( components && components.length > 0 )
				{
					_.each(components, function(component)
					{
						app.core.appSandbox.stop(component.options.el);
					});
				}
			};

			/**
			 *
			 */
			app.sandbox.startComponents = function(components)
			{
				if( components && components.length > 0 )
				{
					app.core.appSandbox.start(components);
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