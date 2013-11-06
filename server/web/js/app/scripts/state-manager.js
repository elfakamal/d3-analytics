define(['underscore', 'jquery', './state', './naive-component'],
function(_, $, State, NaiveComponent)
{

	/**
	 *
	 */
	function StateManager(options)
	{
		var self = this;

		if( !(this instanceof StateManager) )
		{
			self = Object.create(StateManager.prototype);
		}

		this.options = _.defaults(options || {},
		{
			history: false
		});

		return self;
	}

	/**
	 *
	 */
	StateManager.prototype.states = {};

	/**
	 *
	 */
	StateManager.prototype.currentState = "";

	/**
	 *
	 */
	StateManager.prototype.addState = function(state, componentList)
	{
		if( componentList && componentList.length === 0 )
		{
			console.warn("component list is empty");
		}

		var stateObject = null;

		if( state instanceof State )
		{
			stateObject = state;
		}
		else if( typeof state === 'string' )
		{
			stateObject = new State(state, componentList);
		}

		this.states[stateObject.name] = stateObject;

		return stateObject;
	};

	/**
	 * @return Array
	 */
	StateManager.prototype.findComponentsByState =
		function(componentNames, stateName, returnAuraObjects)
	{
		var components = [];

		if( stateName !== "" && this.states.hasOwnProperty(stateName) )
		{
			var state = this.states[stateName];

			if( state )
			{
				components = state.getComponentsByNames(componentNames, returnAuraObjects);
			}
		}

		return components;
	};


	/**
	 *
	 */
	StateManager.prototype.preSwitch = function(stateName)
	{
		//add the next components to the dom.
	};

	/**
	 *
	 */
	StateManager.prototype.postSwitch = function(stateName)
	{
		//do something
	};

	/**
	 *
	 */
	StateManager.prototype.compare = function(state1, state2)
	{
		if( typeof state1 !== 'undefined' )
		{
			if( this.states.hasOwnProperty(state1) )
			{
				var stateA = this.states[state1];
				var stateB = this.states[state2];

				return stateA.compare(stateB);
			}
		}

		return [];
	};


	/**
	 *
	 */
	StateManager.prototype.createElements = function(stateName, componentNames)
	{
		if( stateName && componentNames && componentNames.length > 0 )
		{
			if( this.states.hasOwnProperty(stateName) )
			{
				var self		= this;
				var state		= this.states[stateName];
				var components	= state.getComponentsByNames(componentNames, false);

				components = _.sortBy(components, "getIndex");

				_.each(components, function(component)
				{
					var elementID = component.getElementSelector();
					var elementParentID = component.getParent();

					if( $(elementParentID).length <= 0 )
					{
						console.error("Component Element Parent doesn't exists, component : " + component.name);
					}
					else
					{
						if( $(elementID).length > 0 )
						{
							console.warn("Component Element already exists, component : " + component.name);
						}
						else
						{
							self.insertAtIndex(
								component.getIndex(),
								component.getParent(),
								component.getTagName(),
								component.getHTML()
							);
						}
					}
				});
			}
		}
	};

	StateManager.prototype.insertAtIndex = function(index, parent, elementTagName, element)
	{
		if( typeof parent === 'undefined' ||
			typeof element === 'undefined' ||
			typeof elementTagName === 'undefined' )
		{
			throw new Error("some of the paramaters you specified are not valid");
		}

		if( index === 0 )
		{
			$(parent).prepend(element);
			return;
		}

		$(parent + " " + elementTagName + ":nth-child(" + index + ")").after(element);
	};


	StateManager.prototype.hasState = function(stateName)
	{
		if( typeof stateName !== 'undefined' )
		{
			return this.states.hasOwnProperty(stateName);
		}

		return false;
	};

	return StateManager;

});