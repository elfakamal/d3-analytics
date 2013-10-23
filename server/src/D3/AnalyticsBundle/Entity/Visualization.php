<?php

namespace D3\AnalyticsBundle\Entity;

use D3\AnalyticsBundle\Entity\Collection;
use D3\AnalyticsBundle\Entity\DataSource;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Visualization
 */
class Visualization
{

	/**
	 * @var integer
	 */
	private $id;

	/**
	 * @var string
	 */
	private $name;

	/**
	 * @var string
	 */
	private $description;

	/**
	 * @var integer
	 */
	private $visualizationTypeId;

	/**
	 * @var \DateTime
	 */
	private $creationDate;

	/**
	 * @var \DateTime
	 */
	private $updateDate;


	/**
	 * @var ArrayCollection
	 */
	private $collections;

	/**
	 * @var ArrayCollection
	 */
	private $dataSources;

	/**
	 * Constructor
	 */
	public function __construct()
	{
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
	 * @param Collection $collection
	 * @return Visualization
	 */
	public function addCollection( Collection $collection )
	{
		$this->collections[] = $collection;

		return $this;
	}

	/**
	 * Remove collections
	 *
	 * @param Collection $collection
	 */
	public function removeCollection( Collection $collection )
	{
		$this->collections->removeElement($collection);
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

}