<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use D3\AnalyticsBundle\Entity\Visualization;

/**
 * Description of VisualizationFixtures
 *
 * @author kamal
 */
class VisualizationFixtures implements FixtureInterface
{

	public function load( ObjectManager $manager )
	{
		$visualization1 = new Visualization();
		$visualization1->setName('Symfony2 users');
		$visualization1->setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing eletra electrify denim vel ports.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut velocity magna. Etiam vehicula nunc non leo hendrerit commodo. Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque. Nulla consectetur tempus nisl vitae viverra. Cras el mauris eget erat congue dapibus imperdiet justo scelerisque. Nulla consectetur tempus nisl vitae viverra. Cras elementum molestie vestibulum. Morbi id quam nisl. Praesent hendrerit, orci sed elementum lobortis, justo mauris lacinia libero, non facilisis purus ipsum non mi. Aliquam sollicitudin, augue id vestibulum iaculis, sem lectus convallis nunc, vel scelerisque lorem tortor ac nunc. Donec pharetra eleifend enim vel porta.');
		$visualization1->setVisualizationTypeId(1);
		$visualization1->setCreationDate(new \DateTime());
		$visualization1->setUpdateDate($visualization1->getCreationDate());
		$manager->persist($visualization1);

		$visualization2 = new Visualization();
		$visualization2->setName('Facebook users');
		$visualization2->setDescription('Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque. Na. Cras elementum molestie vestibulum. Morbi id quam nisl. Praesent hendrerit, orci sed elementum lobortis.');
		$visualization2->setVisualizationTypeId(2);
		$visualization2->setCreationDate(new \DateTime("2011-07-23 06:12:33"));
		$visualization2->setUpdateDate($visualization2->getCreationDate());
		$manager->persist($visualization2);

        $visualization3 = new Visualization();
        $visualization3->setName('twitter users');
        $visualization3->setDescription('Lorem ipsumvehicula nunc non leo hendrerit commodo. Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque.');
		$visualization3->setVisualizationTypeId(3);
        $visualization3->setCreationDate(new \DateTime("2011-07-16 16:14:06"));
        $visualization3->setUpdateDate($visualization3->getCreationDate());
        $manager->persist($visualization3);

		$visualization4 = new Visualization();
		$visualization4->setName('google+ users');
		$visualization4->setDescription('Lorem commodo. Vestibulum vulputate mauris eget erat congue dapibus imperdiet justo scelerisque. Nulla consectetur tempus nisl vitae viverra.');
		$visualization4->setVisualizationTypeId(4);
		$visualization4->setCreationDate(new \DateTime("2011-06-02 18:54:12"));
		$visualization4->setUpdateDate($visualization4->getCreationDate());
		$manager->persist($visualization4);

		$manager->flush();
	}

}

?>
