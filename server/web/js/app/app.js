require(['bower_components/aura/lib/aura'], function(Aura)
{
	var aura = new Aura({debug: true});
	aura.use('extensions/aura-backbone');
    aura.use('extensions/aura-templates');
    aura.use('extensions/d3-analytics');
    aura.use('extensions/aura-state');
    aura.use('extensions/aura-collect-spread');
	aura.start();
});