<?php

namespace D3\AnalyticsBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use D3\AnalyticsBundle\Entity\DataStore;
use D3\AnalyticsBundle\Entity\Visualization;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * DataSource
 */
class DataSource
{

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
	protected $fileName;

	/**
	 *
	 * @var string
	 */
	protected $fileExtension;

	/**
	 *
	 * @var \Symfony\Component\HttpFoundation\File\UploadedFile
	 */
	protected $file;

	/**
	 *
	 * @var ArrayCollection
	 */
	protected $visualizations;

	/**
	 *
	 * @var ArrayCollection
	 */
	protected $dataStores;

	/**
	 * Constructor
	 */
	public function __construct()
	{
		$this->dataStores = new ArrayCollection();
	}

	public function getAbsolutePath()
	{
		if( null === $this->fileName )
		{
			return null;
		}
		else
		{
			return $this->getUploadRootDir() . '/' . $this->fileName;
		}
	}

	public function getWebPath()
	{
		if( null === $this->fileName )
		{
			return null;
		}
		else
		{
			return $this->getUploadDir() . '/' . $this->fileName;
		}
	}

	protected function getUploadRootDir()
	{
		// the absolute directory path where uploaded
		// documents should be saved
		return __DIR__ . '/../../../../web/' . $this->getUploadDir();
	}

	protected function getUploadDir()
	{
		// get rid of the __DIR__ so it doesn't screw up
		// when displaying uploaded doc/image in the view.
		return 'uploads/datasources';
	}

	public function upload()
	{
		// the file property can be empty if the field is not required
		if( null === $this->getFile() )
		{
			return;
		}

		$this->setFileExtension($this->getClientOriginalExtension());

		// move takes the target directory and then the
		// target filename to move to
		$this->getFile()->move($this->getUploadRootDir(), $this->getFileName());

		// clean up the file property as we won't need it anymore
		$this->file = null;
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

	public function getClientOriginalExtension()
	{
		if( null === $this->getFile() )
		{
			return;
		}

		return $this->getFile()->getClientOriginalExtension();
	}

	/**
	 * Set name
	 *
	 * @param string $name
	 * @return DataSource
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
	 * Set fileName
	 *
	 * @param string $fileName
	 * @return DataSource
	 */
	public function setFileName( $fileName )
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

	public function getFileExtension()
	{
		return $this->fileExtension;
	}

	public function setFileExtension( $fileExtension )
	{
		$this->fileExtension = $fileExtension;
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
	public function addVisualization( Visualization $visualizations )
	{
		$this->visualizations[] = $visualizations;

		return $this;
	}

	/**
	 * Remove visualizations
	 *
	 * @param \D3\AnalyticsBundle\Entity\Visualization $visualizations
	 */
	public function removeVisualization( Visualization $visualizations )
	{
		$this->visualizations->removeElement($visualizations);
	}

	/**
	 * Add dataStores
	 *
	 * @param \D3\AnalyticsBundle\Entity\DataStore $dataStores
	 * @return DataSource
	 */
	public function addDataStore( DataStore $dataStores )
	{
		$this->dataStores[] = $dataStores;

		return $this;
	}

	/**
	 * Remove dataStores
	 *
	 * @param \D3\AnalyticsBundle\Entity\DataStore $dataStores
	 */
	public function removeDataStore( DataStore $dataStores )
	{
		$this->dataStores->removeElement($dataStores);
	}

	/**
	 * Sets file.
	 *
	 * @param UploadedFile $file
	 */
	public function setFile( UploadedFile $file = null )
	{
		$this->file = $file;
	}

	/**
	 * Get file.
	 *
	 * @return UploadedFile
	 */
	public function getFile()
	{
		return $this->file;
	}

}