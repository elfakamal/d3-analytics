/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


require(['bower_components/aura/lib/aura'], function(Aura)
{
	var aura = new Aura({debug: true});
	aura.use('extensions/aura-backbones');
    aura.use('extensions/aura-templates');
	aura.start();
});