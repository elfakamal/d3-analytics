<?php

namespace D3\AnalyticsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * D3Collection
 */
class D3Collection
{

  const SYSTEM_COLLECTION = 1;
  const REGULAR_COLLECTION = 2;
  const LIBRARY_COLLECTION = "Library";
  const STARRED_COLLECTION = "Starred";
  const DELETED_COLLECTION = "Deleted";

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->setCreationDate(new \DateTime());
    $this->setUpdateDate(new \DateTime());

    $this->setCollectionTypeId(self::REGULAR_COLLECTION);
  }

  /**
   * @var integer
   */
  protected $id;

  /**
   * @var string
   */
  protected $name;

  /**
   * @var string
   */
  protected $description;

  /**
   * @var integer
   */
  protected $collectionTypeId;

  /**
   * @var \DateTime
   */
  protected $creationDate;

  /**
   * @var \DateTime
   */
  protected $updateDate;

  /**
   * @var ArrayCollection
   */
  protected $visualizations;

  /**
   * Get id
   *
   * @return integer
   */
  public function getId()
  {
    return $this->id;
  }

  /**
   * Set name
   *
   * @param string $name
   * @return D3Collection
   */
  public function setName( $name )
  {
    $this->name = $name;

    return $this;
  }

  /**
   * Get name
   *
   * @return string
   */
  public function getName()
  {
    return $this->name;
  }

  /**
   * Set description
   *
   * @param string $description
   * @return D3Collection
   */
  public function setDescription( $description )
  {
    $this->description = $description;

    return $this;
  }

  /**
   * Get description
   *
   * @return string
   */
  public function getDescription()
  {
    return $this->description;
  }

  /**
   * Set creationDate
   *
   * @param \DateTime $creationDate
   * @return D3Collection
   */
  public function setCreationDate( $creationDate )
  {
    $this->creationDate = $creationDate;

    return $this;
  }

  /**
   * Get creationDate
   *
   * @return \DateTime
   */
  public function getCreationDate()
  {
    return $this->creationDate;
  }

  /**
   * Set updateDate
   *
   * @param \DateTime $updateDate
   * @return D3Collection
   */
  public function setUpdateDate( $updateDate )
  {
    $this->updateDate = $updateDate;

    return $this;
  }

  /**
   * Get updateDate
   *
   * @return \DateTime
   */
  public function getUpdateDate()
  {
    return $this->updateDate;
  }

  /**
   * Set collectionTypeId
   *
   * @param integer $collectionTypeId
   * @return D3Collection
   */
  public function setCollectionTypeId( $collectionTypeId )
  {
    $this->collectionTypeId = $collectionTypeId;

    return $this;
  }

  /**
   * Get collectionTypeId
   *
   * @return integer
   */
  public function getCollectionTypeId()
  {
    return $this->collectionTypeId;
  }

  /**
   * Add visualizations
   *
   * @param \D3\AnalyticsBundle\Entity\Visualization $visualizations
   * @return D3Collection
   */
  public function addVisualization( \D3\AnalyticsBundle\Entity\Visualization $visualizations )
  {
    $this->visualizations[] = $visualizations;
    return $this;
  }

  /**
   * Remove visualizations
   *
   * @param \D3\AnalyticsBundle\Entity\Visualization $visualizations
   */
  public function removeVisualization( \D3\AnalyticsBundle\Entity\Visualization $visualizations )
  {
    $this->visualizations->removeElement($visualizations);
  }

  /**
   * Get visualizations
   *
   * @return \Doctrine\Common\Collections\ArrayCollection
   */
  public function getVisualizations()
  {
    return $this->visualizations;
  }

}
