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
		self.components = [];

		if( components && components.length > 0 )
		{
			self.addComponents.apply(self, components);
		}

		return self;
	}

	/**
	 *
	 */
	State.prototype.allComponents = [];

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
				self.components.push(component);
				self.allComponents.push(component);
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
			components = _.filter(this.components, function(component)
			{
				return names.indexOf(component.name) >= 0
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
	 * @return Array
	 */
	State.prototype.getComponentsByCUIDs = function(CUIDs, returnAuraObjects)
	{
		var components = [];

		if( CUIDs && CUIDs.length > 0 )
		{
			components = _.filter(this.components, function(component)
			{
				return CUIDs.indexOf(component.CUID) >= 0
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
		var thisStateComponentCUIDs	= _.pluck(this.components, "CUID");
		var resultComponentCUIDs	= thisStateComponentCUIDs;

		if( typeof state !== 'undefined' )
		{
			var otherStateComponentNames = _.pluck(state.components, "CUID");
			resultComponentCUIDs = _.difference(thisStateComponentCUIDs, otherStateComponentNames);
		}

		return resultComponentCUIDs;
	};


	return State;
});