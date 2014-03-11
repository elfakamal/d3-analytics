<?php

namespace D3\AnalyticsBundle\Entity;

use D3\AnalyticsBundle\Entity\D3Collection;
use D3\AnalyticsBundle\Entity\DataSource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Visualization
 */
class Visualization
{

  const VIZ_VERTICAL_BARS = 1;
  const VIZ_HORIZONTAL_BARS = 2;

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
   * @ORM\Column(type="text")
   */
  protected $description = "";

  /**
   * @var integer
   */
  protected $visualizationTypeId;

  /**
   *
   * @var boolean
   * @ORM\Column(type="boolean")
   */
  protected $isStarred = false;

  /**
   *
   * @var boolean
   * @ORM\Column(type="boolean")
   */
  protected $isActive = true;

  /**
   * @var \DateTime
   */
  protected $creationDate;

  /**
   * @var \DateTime
   */
  protected $updateDate;

  /**
   * Serialized chart properties.
   *
   * @var string
   * @ORM\Column(type="text")
   */
  protected $chartData = "";

  /**
   * @var ArrayCollection
   */
  protected $collections;

  /**
   * @var ArrayCollection
   */
  protected $dataSources;

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->setVisualizationTypeId(self::VIZ_VERTICAL_BARS);

    $this->isActive = true;
    $this->isStarred = false;
    $this->chartData = "";

    $this->setCreationDate(new \DateTime());
    $this->setUpdateDate(new \DateTime());

    $this->collections = new ArrayCollection();
    $this->dataSources = new ArrayCollection();
  }

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
   * @return Visualization
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
   * @return Visualization
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
   * Set visualizationTypeId
   *
   * @param integer $visualizationTypeId
   * @return Visualization
   */
  public function setVisualizationTypeId( $visualizationTypeId )
  {
    $this->visualizationTypeId = $visualizationTypeId;

    return $this;
  }

  /**
   * Get visualizationTypeId
   *
   * @return integer
   */
  public function getVisualizationTypeId()
  {
    return $this->visualizationTypeId;
  }

  /**
   * Set creationDate
   *
   * @param \DateTime $creationDate
   * @return Visualization
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

  public function setAsUpdated()
  {
    $this->setUpdateDate(new \DateTime());

    return $this;
  }

  /**
   * Set updateDate
   *
   * @param \DateTime $updateDate
   * @return Visualization
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
   * Add collections
   *
   * @param D3Collection $collection
   * @return Visualization
   */
  public function addCollection( D3Collection $collection )
  {
    $this->collections->add($collection);

    return $this;
  }

  /**
   * Remove collections
   *
   * @param D3Collection $collection
   */
  public function removeCollection( D3Collection $collection )
  {
    $this->collections->removeElement($collection);
  }

  /**
   * Set collections
   *
   * @param $collections Array
   * @return Visualization
   */
  public function setCollections( $collectons )
  {
    $this->collections = $collectons;

    return $this;
  }

  /**
   * Get collections
   *
   * @return ArrayCollection
   */
  public function getCollections()
  {
    return $this->collections;
  }

  /**
   * Add dataSources
   *
   * @param DataSource $dataSource
   * @return Visualization
   */
  public function addDataSource( DataSource $dataSource )
  {
    $this->dataSources[] = $dataSource;

    return $this;
  }

  /**
   * Remove dataSources
   *
   * @param DataSource $dataSource
   */
  public function removeDataSource( DataSource $dataSource )
  {
    $this->dataSources->removeElement($dataSource);
  }

  /**
   * Get dataSources
   *
   * @return ArrayCollection
   */
  public function getDataSources()
  {
    return $this->dataSources;
  }

  /**
   * Set isStarred
   *
   * @param boolean $isStarred
   * @return Visualization
   */
  public function setIsStarred( $isStarred )
  {
    if( !isset($isStarred) )
    {
      $this->isStarred = false;
    }
    else
    {
      $this->isStarred = $isStarred;
    }

    return $this;
  }

  /**
   * Get isStarred
   *
   * @return boolean
   */
  public function getIsStarred()
  {
    return $this->isStarred;
  }

  /**
   * Set isActive
   *
   * @param boolean $isActive
   * @return Visualization
   */
  public function setIsActive( $isActive )
  {
    $this->isActive = $isActive;

    return $this;
  }

  /**
   * Get isActive
   *
   * @return boolean
   */
  public function getIsActive()
  {
    return $this->isActive;
  }

  /**
   * Set chartData
   *
   * @param string $chartData
   * @return Visualization
   */
  public function setChartData( $chartData )
  {
    if( !isset($chartData) )
    {
      $this->chartData = "";
    }
    else
    {
      $this->chartData = $chartData;
    }

    return $this;
  }

  /**
   * Get chartData
   *
   * @return string
   */
  public function getChartData()
  {
    return $this->chartData;
  }

}
