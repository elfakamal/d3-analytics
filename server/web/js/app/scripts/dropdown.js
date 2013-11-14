define(['underscore', 'jquery'], function(_, $)
{
	function DropDown(el)
	{
		this.dd = el;
		this.initEvents();
	}

	DropDown.prototype = {

		initEvents : function()
		{
			var obj = this;

			obj.dd.on('click', function(event)
			{
				if( event.currentTarget === event.target )
				{
					$(this).toggleClass('active');
					event.stopPropagation();
				}
			});
		}
	};

	$(document).click(function(event)
	{
		$(".wrapper-dropdown-5").removeClass("active");
	});

	return DropDown;

});