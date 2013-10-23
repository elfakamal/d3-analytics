<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
namespace D3\AnalyticsBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use D3\AnalyticsBundle\Entity\DataSource;


/**
 * Description of DataSourceFixtures
 *
 * @author kamal
 */
class DataSourceFixtures implements FixtureInterface
{

	public function load( ObjectManager $manager )
	{
		return;
		
		$dataSource1 = new DataSource();
		$dataSource1->setName("fb users");
		$dataSource1->setFileName("1111.csv");
		$manager->persist($dataSource1);


		$dataSource2 = new DataSource();
		$dataSource2->setName("lk users");
		$dataSource2->setFileName("2222.csv");
		$manager->persist($dataSource2);


		$dataSource3 = new DataSource();
		$dataSource3->setName("g+ users");
		$dataSource3->setFileName("3333.csv");
		$manager->persist($dataSource3);


		$dataSource4 = new DataSource();
		$dataSource4->setName("tw users");
		$dataSource4->setFileName("4444.csv");
		$manager->persist($dataSource4);


		$manager->flush();
	}

}

?>
