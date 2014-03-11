<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use D3\AnalyticsBundle\Entity\DataStore;

/**
 * Description of DataStoreFixtures
 *
 * @author kamal
 */
class DataStoreFixtures implements FixtureInterface
{

  public function load( ObjectManager $manager )
  {
    $dataStore = new DataStore();
    $dataStore->setName("All");
    $dataStore->setDescription("The data store that contains all the data sources");
    $dataStore->setDataStoreTypeId(DataStore::SYSTEM_DATA_STORE);

    $manager->persist($dataStore);
    $manager->flush();
  }

}

?>
