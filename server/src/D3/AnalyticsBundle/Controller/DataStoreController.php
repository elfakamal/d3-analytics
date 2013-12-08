<?php

namespace D3\AnalyticsBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Util\Codes;
use D3\AnalyticsBundle\Entity\DataStore;
use D3\AnalyticsBundle\Form\DataStoreType;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * DataStore controller.
 * @Rest\RouteResource("Datastore")
 */
class DataStoreController extends FOSRestController implements ClassResourceInterface
{

	/**
	 *
	 * @return Array
	 *
	 * @Rest\View(statusCode="200")
	 *
	 */
	public function cgetAction()
	{
		$em = $this->getDoctrine()->getManager();
		$dataStores = $em->getRepository('D3AnalyticsBundle:DataStore')->findAll();

		return $dataStores;
	}

	/**
	 *
	 * @param integer $id
	 * @return DataStore
	 */
	protected function getDataStore( $id )
	{
		$em = $this->getDoctrine()->getManager();
		$dataStore = $em->getRepository('D3AnalyticsBundle:DataStore')->findOneById($id);

		if( !$dataStore || empty($dataStore) )
		{
			throw new NotFoundHttpException("Sorry, there is no such dataStore");
		}

		return $dataStore;
	}

	/**
	 *
	 * @return Array
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function getAction( $id )
	{
		if( empty($id) || !is_numeric($id) )
		{
			throw new NotFoundHttpException("Sorry, there is no such dataStore");
		}

		$dataStore = $this->getDataStore($id);

		return $dataStore;
	}

	/**
	 *
	 * @Rest\View(statusCode="201")
	 */
	public function postAction()
	{
		$request = $this->getRequest();
		$dataStore = new DataStore();
		$form = $this->createForm(new DataStoreType(), $dataStore);

		$form->bind($request);

		if( $form->isValid() )
		{
			$em = $this->getDoctrine()->getManager();
			$em->persist($dataStore);
			$em->flush();

			return $dataStore;
		}

		return array('form' => $form);
	}

	/**
	 *
	 * updates a DataStore
	 *
	 * @param integer $id DataStore database identifier
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function putAction( $id )
	{
		$request = $this->getRequest();
		$dataStore = $this->getDataStore($id);
		$form = $this->createForm(new DataStoreType(), $dataStore);

		$form->bind($request);

		if( $form->isValid() )
		{
			$em = $this->getDoctrine()->getManager();
			$em->persist($dataStore);
			$em->flush();

			return $dataStore;
		}

		return array('form' => $form);
	}

	/**
	 *
	 * @param integer $id
	 *
	 * @Rest\View(statusCode="204")
	 */
	public function deleteAction( $id )
	{
		$dataStore = $this->getDataStore($id);

		if( $dataStore->getDataStoreTypeId() == DataStore::REGULAR_DATA_STORE )
		{
			$em = $this->getDoctrine()->getManager();
			$em->remove($dataStore);
			$em->flush();
		}
		else
		{
			throw new AccessDeniedHttpException("you can't delete this data store", null, 403);
		}

		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}
