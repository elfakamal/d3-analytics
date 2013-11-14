<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\Entity\Repository;

use D3\AnalyticsBundle\Entity\D3Collection;

use Doctrine\ORM\EntityRepository;

/**
 * Description of D3CollectionRepository
 *
 * @author kamal
 */
class D3CollectionRepository extends EntityRepository
{

	public function getLibrary()
	{
		return $this->getCollection(D3Collection::LIBRARY_COLLECTION, D3Collection::SYSTEM_COLLECTION);
	}

	public function getStarred()
	{
		return $this->getCollection(D3Collection::STARRED_COLLECTION, D3Collection::SYSTEM_COLLECTION);
	}

	public function getDeleted()
	{
		return $this->getCollection(D3Collection::DELETED_COLLECTION, D3Collection::SYSTEM_COLLECTION);
	}

	protected function getCollection( $name, $collectionTypeId )
	{
		$collection = $this->findOneBy(array(
			"name"				=> $name,
			"collectionTypeId"	=> $collectionTypeId
		));

		return $collection;
	}

	public function getVisualizationCountMapping()
	{
		$conn = $this->getEntityManager()->getConnection();

		$sql = "SELECT collection_id, count(visualization_id) as visualizationCount
				FROM visualization_collection_assoc vca
				GROUP BY collection_id";

		$stmt = $conn->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll();

		return $result;
	}

}

?>
