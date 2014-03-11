<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\Entity\Repository;

use D3\AnalyticsBundle\Entity\Visualization;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;

/**
 * Description of VisualizationRepository
 *
 * @author kamal
 */
class VisualizationRepository extends EntityRepository
{

  /**
   *
   * @param type $collectionId
   * @param type $visualizaitonId
   * @return Visualization
   */
  public function getVisualization( $collectionId, $visualizaitonId )
  {
    $query = $this->createQueryBuilder("v")
      ->leftJoin("v.collections", "c")
      ->where("v.id = :visualizationId")
      ->setParameter("visualizationId", $visualizaitonId)
      ->andWhere("c.id = :collectionId")
      ->setParameter("collectionId", $collectionId)
      ->getQuery();

    $sql = $query->getSQL();

    $result = null;

    try
    {
      $result = $query->getOneOrNullResult();
//			$result = $query->getResult();
    }
    catch( NonUniqueResultException $exc )
    {
      $result = null;
    }

    return $result;
  }

  /**
   *
   * @param integer $collectionId
   * @return array
   */
  public function getVisualizations( $collectionId )
  {
    $query = $this->createQueryBuilder("v")
      ->leftJoin("v.collections", "c")
      ->where("c.id = :collectionId")
      ->setParameter("collectionId", $collectionId)
      ->getQuery();

    $sql = $query->getSQL();

    return $query->getResult();
  }

  /**
   * Verify whether is already there an association between this visualization
   * and this data source.
   *
   * 	array(1) (
   * 	  [0] => array(1) (
   * 		[hasAssociation] => (string) 1
   * 	  )
   * 	)
   *
   * @param integer $dataSourceId
   * @return Boolean
   */
  public function hasDataSource( $visualizaitonId, $dataSourceId )
  {
    $conn = $this->getEntityManager()->getConnection();

    $sql = "SELECT count(*) as associationCount
				FROM visualization_data_source_assoc vda
				WHERE vda.visualization_id = :vid
				AND vda.data_source_id = :dsid";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue("vid", $visualizaitonId);
    $stmt->bindValue("dsid", $dataSourceId);
    $stmt->execute();
    $result = $stmt->fetchAll();

    if( $result !== null && empty($result) === false &&
      is_array($result) === true && count($result) == 1 &&
      is_array($result[0]) === true &&
      array_key_exists("associationCount", $result[0]) )
    {
      $associationCount = $result[0]["associationCount"];

      if( $associationCount == 1 )
      {
        return true;
      }
    }

    return false;
  }

}

?>
