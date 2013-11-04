<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use D3\AnalyticsBundle\Entity\D3Collection;

/**
 * Description of D3CollectionFixtures
 *
 * @author kamal
 */
class D3CollectionFixtures implements FixtureInterface
{

	/**
	 *
	 * @param \Doctrine\Common\Persistence\ObjectManager $manager
	 */
	public function load(ObjectManager $manager)
	{
		$collectionLibrary = new D3Collection();
		$collectionLibrary->setName(D3Collection::LIBRARY_COLLECTION);
		$collectionLibrary->setDescription("The collection that contains all the visualizations");
		$collectionLibrary->setCollectionTypeId(D3Collection::SYSTEM_COLLECTION);

		$manager->persist($collectionLibrary);

		$collectionStarred = new D3Collection();
		$collectionStarred->setName(D3Collection::STARRED_COLLECTION);
		$collectionStarred->setDescription("The collection that contains favorite visualizations");
		$collectionStarred->setCollectionTypeId(D3Collection::SYSTEM_COLLECTION);

		$manager->persist($collectionStarred);

		$collectionDeleted = new D3Collection();
		$collectionDeleted->setName(D3Collection::DELETED_COLLECTION);
		$collectionDeleted->setDescription("The collection that contains deleted visualizations");
		$collectionDeleted->setCollectionTypeId(D3Collection::SYSTEM_COLLECTION);

		$manager->persist($collectionDeleted);

		$manager->flush();
	}
}

?>
