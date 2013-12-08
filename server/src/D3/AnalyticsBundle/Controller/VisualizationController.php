<?php

namespace D3\AnalyticsBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Util\Codes;
use FOS\RestBundle\Controller\Annotations\Route;
use D3\AnalyticsBundle\Entity\Visualization;
use D3\AnalyticsBundle\Form\VisualizationType;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use JMS\Serializer\Exception\UnsupportedFormatException;
use Doctrine\ORM\EntityManager;

/**
 * Description of VisualizationController
 *
 * @author kamal
 */
class VisualizationController extends FOSRestController implements ClassResourceInterface
{

	/**
	 * Saves an entity to the database
	 *
	 * @param $entity
	 * @param \Doctrine\ORM\EntityManager $entityManager
	 */
	private function saveEntity( $entity, EntityManager $entityManager = null )
	{
		if( null === $entityManager )
		{
			$entityManager = $this->getDoctrine()->getManager();
		}

		$entityManager->persist($entity);
		$entityManager->flush();
	}

	/**
	 * Retrieves all the visualizations that belogns to a specific collection.
	 *
	 * @param integer $collectionId collection database identifier
	 * @return array
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function cgetAction( $collectionId )
	{
		$em = $this->getDoctrine()->getManager();

		$visualizations = $em->getRepository('D3AnalyticsBundle:Visualization')
						->getVisualizations($collectionId);

		return $visualizations;
	}

	/**
	 * Retrieves a visualization object from the database.
	 *
	 * @param integer $collectionId collection database identifier
	 * @param integer $visualizationId Visualization database identifier
	 * @return Visualization
	 */
	protected function getVisualization( $collectionId, $visualizationId )
	{
		$em = $this->getDoctrine()->getManager();
		$visualization = $em->getRepository('D3AnalyticsBundle:Visualization')
						->getVisualization($collectionId, $visualizationId);

		if( !$visualization || empty($visualization) )
		{
			throw new NotFoundHttpException("Sorry, there is no such visualization");
		}

		return $visualization;
	}

	/**
	 * The Action that retrieves a visualization object from the database.
	 *
	 * @param integer $collectionId collection database identifier
	 * @param integer $visualizationId Visualization database identifier
	 * @return array
	 * @Route(requirements={"collectionId" = "\d+", "visualizationId" = "\d+"})
	 * @Rest\View(statusCode="200")
	 */
	public function getAction( $collectionId, $visualizationId )
	{
		if( empty($visualizationId) || !is_numeric($visualizationId) )
		{
			throw new NotFoundHttpException("Sorry, there is no such visualization");
		}

		$visualization = $this->getVisualization($collectionId, $visualizationId);
		return $visualization;
	}

	/**
	 * Creates a Visualization and adds it to the Library and a chosen collection.
	 *
	 * @param integer $collectionId collection database identifier
	 * @return Visualization
	 * @Route(requirements={"collectionId" = "\d+"})
	 * @Rest\View(statusCode="201")
	 */
	public function postAction( $collectionId )
	{
		$request = $this->getRequest();
		$visualization = new Visualization();
		$form = $this->createForm(new VisualizationType(), $visualization);

		$form->bind($request);

		if( $form->isValid() )
		{
			$em = $this->getDoctrine()->getManager();
			$library = $em->getRepository('D3AnalyticsBundle:D3Collection')->getLibrary();
			$visualization->addCollection($library);

			if( $library->getId() != $collectionId )
			{
				$collection = $em->getRepository('D3AnalyticsBundle:D3Collection')
								->findOneById($collectionId);

				//TODO:TEST: THE COLLECTION AVAILABILITY.

				$visualization->addCollection($collection);
			}

			$this->saveEntity($visualization, $em);

			return $visualization;
		}

		return array('form' => $form);
	}

	/**
	 * Updates a visualization
	 *
	 * @param integer $libraryId collection database identifier
	 * @param integer $visualizationId Visualization database identifier
	 * @return Visualization
	 * @Route(requirements={"libraryId" = "\d+", "visualizationId" = "\d+"})
	 * @Rest\View(statusCode="200")
	 */
	public function putAction( $libraryId, $visualizationId )
	{
		//getting rid of the "this form should not contain extra fields" error.
		$unwantedParams = array("id", "creation_date", "update_date", "data_sources");
		$request = $this->getRequest();

		$allRequestParams = $request->request->all();

		foreach($allRequestParams as $key => $value)
		{
			if( in_array($key, $unwantedParams) )
			{
				$request->request->remove($key);
			}
		}

		$visualization = $this->getVisualization($libraryId, $visualizationId);
		$form = $this->createForm(new VisualizationType(), $visualization);

		$form->bind($request);

		if( $form->isValid() )
		{
			$visualization->setAsUpdated();
			$this->saveEntity($visualization);
			return $visualization;
		}

		return array('form' => $form);
	}

	/**
	 * Attaches a data source to a visualization.
	 *
	 * @param integer $libraryId
	 * @param integer $visualizationId
	 * @param integer $dataSourceId
	 * @return Visualization
	 * @Route(requirements={"libraryId" = "\d+", "visualizationId" = "\d+", "dataSourceId" = "\d+"})
	 * @Rest\View(statusCode="200")
	 */
	public function attachDatasourceAction( $libraryId, $visualizationId, $dataSourceId )
	{
//		return array();

		if( $dataSourceId > 0 )
		{
			$em = $this->getDoctrine()->getManager();

			//TEST//DONE: IF IS THERE ALREADY SUCH AN ASSOCIATION.
			$hasDataSource = $em->getRepository("D3AnalyticsBundle:Visualization")
							->hasDataSource($visualizationId, $dataSourceId);

			if( $hasDataSource === true )
			{
				throw new HttpException(400, "This data source is already attached to this visualization");
			}

			//TEST//DONE: WHETHER IT IS REALLY THE LIBRARY OR ANOTHER COLLECTION
			//(THROW AN EXCEPTION IF IT'S NOT THE LIBRARY).
			$library = $em->getRepository('D3AnalyticsBundle:D3Collection')->getLibrary();
			if( $libraryId != $library->getId() )
			{
				throw new HttpException(400, "the 'libraryId' you specified is not valid");
			}

			$visualization = $this->getVisualization($libraryId, $visualizationId);

			$dataSource = $em->getRepository("D3AnalyticsBundle:DataSource")
							->findOneById($dataSourceId);

			if( !$dataSource || empty($dataSource) === true )
			{
				throw new NotFoundHttpException("Cannot find the data source you're specifying by the id '$dataSource'");
			}

			$visualization->addDataSource($dataSource);
			$this->saveEntity($visualization, $em);
		}

		return $visualization;
	}

	/**
	 * Activate a visualization
	 *
	 * @param integer $libraryId
	 * @param integer $visualizationId
	 * @return Visualization
	 * @Route(requirements={"libraryId" = "\d+", "visualizationId" = "\d+"})
	 * @Rest\View()
	 */
	public function patchActivateAction( $libraryId, $visualizationId )
	{
		$visualization = $this->getVisualization($libraryId, $visualizationId);
		$visualization->setIsActive(true);
		$this->saveEntity($visualization);
		return $visualization;
	}

	/**
	 * Deactivate a visualization
	 *
	 * @param integer $libraryId
	 * @param integer $visualizationId
	 * @return Visualization
	 * @Route(requirements={"libraryId" = "\d+", "visualizationId" = "\d+"})
	 * @Rest\View()
	 */
	public function patchDeactivateAction( $libraryId, $visualizationId )
	{
		$visualization = $this->getVisualization($libraryId, $visualizationId);
		$visualization->setIsActive(false);
		$this->saveEntity($visualization);
		return $visualization;
	}

	/**
	 * Deletes a visualization from the database.
	 *
	 * @param integer $libraryId
	 * @param integer $visualizationId
	 * @return empty view response
	 * @Route(requirements={"libraryId" = "\d+", "visualizationId" = "\d+"})
	 * @Rest\View(statusCode="204")
	 */
	public function deleteAction( $libraryId, $visualizationId )
	{
		$visualization = $this->getVisualization($libraryId, $visualizationId);
		$em = $this->getDoctrine()->getManager();
		$em->remove($visualization);
		$em->flush();
		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}

?>
