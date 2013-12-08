<?php

namespace D3\AnalyticsBundle\Entity;

/**
 * DataStore
 */
class DataStore
{

	const SYSTEM_DATA_STORE = 1;
	const REGULAR_DATA_STORE = 2;

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
	 *
	 * @var integer
	 */
	protected $dataStoreTypeId;

	/**
	 * @var \DateTime
	 */
	protected $creationDate;

	/**
	 * @var \DateTime
	 */
	protected $updateDate;

	/**
	 *
	 * @var ArrayCollection
	 */
	protected $dataSources;

	public function __construct()
	{
		$this->setCreationDate(new \DateTime());
		$this->setUpdateDate(new \DateTime());

		$this->setDataStoreTypeId(self::REGULAR_DATA_STORE);
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
	 * @return DataStore
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
	 * @return DataStore
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
	 * @return DataStore
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
	 * @return DataStore
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
	 * Set dataStoreTypeId
	 *
	 * @param integer $dataStoreTypeId
	 * @return DataStore
	 */
	public function setDataStoreTypeId( $dataStoreTypeId )
	{
		$this->dataStoreTypeId = $dataStoreTypeId;

		return $this;
	}

	/**
	 * Get dataStoreTypeId
	 *
	 * @return integer
	 */
	public function getDataStoreTypeId()
	{
		return $this->dataStoreTypeId;
	}


    /**
     * Add dataSources
     *
     * @param \D3\AnalyticsBundle\Entity\DataSource $dataSources
     * @return DataStore
     */
    public function addDataSource(\D3\AnalyticsBundle\Entity\DataSource $dataSources)
    {
        $this->dataSources[] = $dataSources;
    
        return $this;
    }

    /**
     * Remove dataSources
     *
     * @param \D3\AnalyticsBundle\Entity\DataSource $dataSources
     */
    public function removeDataSource(\D3\AnalyticsBundle\Entity\DataSource $dataSources)
    {
        $this->dataSources->removeElement($dataSources);
    }

    /**
     * Get dataSources
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDataSources()
    {
        return $this->dataSources;
    }
}