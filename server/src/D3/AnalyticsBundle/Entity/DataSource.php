<?php

namespace D3\AnalyticsBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

use D3\AnalyticsBundle\Entity\DataStore;
use D3\AnalyticsBundle\Entity\Visualization;

/**
 * DataSource
 */
class DataSource
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
    private $fileName;

	/**
	 *
	 * @var ArrayCollection
	 */
	private $visualizations;

	/**
	 *
	 * @var ArrayCollection
	 */
	private $dataStores;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->dataStores = new ArrayCollection();
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
     * @return DataSource
     */
    public function setName($name)
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
     * Set fileName
     *
     * @param string $fileName
     * @return DataSource
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;

        return $this;
    }

    /**
     * Get fileName
     *
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

	public function getVisualizations()
	{
		return $this->visualizations;
	}

	public function getDataStores()
	{
		return $this->dataStores;
	}



    /**
     * Add Visualizations
     *
     * @param \D3\AnalyticsBundle\Entity\Visualization $visualizations
     * @return DataSource
     */
    public function addVisualization(Visualization $visualizations)
    {
        $this->visualizations[] = $visualizations;

        return $this;
    }

    /**
     * Remove visualizations
     *
     * @param \D3\AnalyticsBundle\Entity\Visualization $visualizations
     */
    public function removeVisualization(Visualization $visualizations)
    {
        $this->visualizations->removeElement($visualizations);
    }


    /**
     * Add dataStores
     *
     * @param \D3\AnalyticsBundle\Entity\DataStore $dataStores
     * @return DataSource
     */
    public function addDataStore(DataStore $dataStores)
    {
        $this->dataStores[] = $dataStores;

        return $this;
    }

    /**
     * Remove dataStores
     *
     * @param \D3\AnalyticsBundle\Entity\DataStore $dataStores
     */
    public function removeDataStore(DataStore $dataStores)
    {
        $this->dataStores->removeElement($dataStores);
    }
}