define(['underscore', 'jquery', './naive-component'], function(_, $, NaiveComponent)
{

	/**
	 *
	 */
	function State(name, components, options)
	{
		var self = this;

		if( !(this instanceof State) )
		{
			self = Object.create(State.prototype);
		}

		this.options = _.defaults(options || {}, {});

		self.name = name;
		self.components = {};

		if( components && components.length > 0 )
		{
			self.addComponents.apply(self, components);
		}

		return self;
	}

	/**
	 *
	 */
	State.prototype.allComponents = {};


	/**
	 * Variadic function to add one or more components.
	 */
	State.prototype.addComponents = function()
	{
		if( !arguments || arguments.length === 0 )
		{
			//or throw new Error
			console.warn("you must specify at least one component");
		}

		var self = this;

		_.each(arguments, function(component)
		{
			if( !(component instanceof NaiveComponent) )
			{
				console.error("the component is not valid");
				//throw new Error("the component is not valid");
			}

			if( component.name !== "" )
			{
				self.components[component.name] = component;
				self.allComponents[component.name] = component;
			}
		});
	};

	/**
	 * @return Array
	 */
	State.prototype.getComponentsByNames = function(names, returnAuraObjects)
	{
		var components = [];

		if( names && names.length > 0 )
		{
			components = _.filter(this.components, function(component, name, dictionary)
			{
				return names.indexOf(name) >= 0
			});
		}

		if( typeof returnAuraObjects !== 'undefined' && returnAuraObjects === true )
		{
			components = _.map(components, function(component)
			{
				return component.toAuraObject();
			});
		}

		return components;
	};


	/**
	 * return the names of the components that exists in this instance,
	 * and not in the argument state.
	 */
	State.prototype.compare = function(state)
	{
		var thisStateComponentNames	= _.keys(this.components);
		var resultComponentNames	= thisStateComponentNames;

		if( typeof state !== 'undefined' )
		{
			var otherStateComponentNames = _.keys(state.components);
			resultComponentNames = _.difference(thisStateComponentNames, otherStateComponentNames);
		}

		return resultComponentNames;
	};


	return State;
});