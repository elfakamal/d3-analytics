define(['underscore', 'jquery'], function(_, $)
{

	/**
	 *
	 */
	function NaiveComponent(name, options)
	{
		var self = this;

		if( !(this instanceof NaiveComponent) )
		{
			self = Object.create(NaiveComponent.prototype);
		}

		self.name = name;

		this.options = _.defaults(options || {},
		{
			el			: "",
			tagName		: "",
			className	: "",
			parent		: "",
			index		: 0,
			component	: self.name
		});

		this.options.className += this.options.className === "" ? "" : " ";
		this.options.className += "component";

		return self;
	}

	/**
	 *
	 */
	NaiveComponent.prototype.componentNamespace = "aura";

	/**
	 *
	 */
	NaiveComponent.prototype.nativeOptions = [
		"el",
		"tagName",
		"className",
		"parent",
		"index"
	];

	NaiveComponent.prototype.getElementSelector = function()
	{
		return this.options.el;
	};

	NaiveComponent.prototype.getParent = function()
	{
		return this.options.parent;
	};

	NaiveComponent.prototype.getTagName = function()
	{
		return this.options.tagName;
	};

	NaiveComponent.prototype.getIndex = function()
	{
		return this.options.index;
	};

	/**
	 *
	 */
	NaiveComponent.prototype.getElementID = function()
	{
		return this.options.el.substring(1, this.options.el.length);
	};

	/**
	 *
	 */
	NaiveComponent.prototype.getMetadata = function()
	{
		return _.omit(this.options, this.nativeOptions);
	};

	/**
	 *
	 */
	NaiveComponent.prototype.getMetadataElementAttributes = function()
	{
		var attributes = "";
		var metadata = this.getMetadata();

		_.each(metadata, function(value, key, object)
		{
			attributes += ' data-' + this.componentNamespace + '-' + key;
			attributes += '="' + value + '" ';
		}, this);

		return attributes;
	};

	/**
	 *
	 */
	NaiveComponent.prototype.getHTML = function()
	{
		var html = "<" + this.options.tagName + " ";
		html += 'id="' + this.getElementID() + '" ';
		html += 'class="' + this.options.className + '" ';
		html += this.getMetadataElementAttributes();
		html += "></" + this.options.tagName + ">";
		return html;
	};


	NaiveComponent.prototype.toAuraObject = function()
	{
		var auraObject = {};
		auraObject.name = this.name;
		auraObject.options = _.omit(this.options, this.nativeOptions.slice(1, this.nativeOptions.length));

		return auraObject;
	};

	return NaiveComponent;
});