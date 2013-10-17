<?php

namespace D3\AnalyticsBundle\Entity;

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

	private $collections;

	private $dataSources;

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
     * Set description
     *
     * @param string $description
     * @return Visualization
     */
    public function setDescription($description)
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
    public function setVisualizationTypeId($visualizationTypeId)
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
    public function setCreationDate($creationDate)
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
     * @return Visualization
     */
    public function setUpdateDate($updateDate)
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
}
