<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
namespace D3\AnalyticsBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Util\Codes;

use D3\AnalyticsBundle\Entity\D3Collection;
use D3\AnalyticsBundle\Form\D3CollectionType;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Description of D3CollectionController
 *
 * @author kamal
 * @Rest\RouteResource("collection");
 */
class D3CollectionController extends FOSRestController implements ClassResourceInterface
{

	/**
	 *
	 * @return Array
	 * @Rest\View(statusCode="200")
	 *
	 */
	public function cgetAction()
	{
		$em				= $this->getDoctrine()->getManager();
        $collections	= $em->getRepository('D3AnalyticsBundle:D3Collection')->findAll();

		return $collections;
	}

	/**
	 * @return Array
	 * @Rest\View(statusCode="200")
	 */
	public function cgetVisualizationCountsAction()
	{
		//TODO:
		//implement the query to extract the count mapping
		//[collectionId] => VisualizationCount

		$em			= $this->getDoctrine()->getManager();
        $mapping	= $em->getRepository('D3AnalyticsBundle:D3Collection')
				->getVisualizationCountMapping();

		return $mapping;
	}

	/**
	 *
	 * @param integer $id
	 * @return D3Collection
	 */
	protected function getD3Collection( $id )
	{
		$em			= $this->getDoctrine()->getManager();
        $collection	= $em->getRepository('D3AnalyticsBundle:D3Collection')->findOneById($id);

		if( !$collection || empty($collection) )
		{
			throw new NotFoundHttpException("Sorry, there is no such collection");
		}

		return $collection;
	}


	/**
	 *
	 * @return Array
	 * @Rest\View(statusCode="200")
	 */
	public function getAction($id)
	{
		if( empty($id) || !is_numeric($id) )
		{
			throw new NotFoundHttpException("Sorry, there is no such collection");
		}

		$collection = $this->getD3Collection($id);

		return $collection;
	}

	/**
	 *
	 * @Rest\View(statusCode="201")
	 */
	public function postAction()
	{
		$request	= $this->getRequest();
		//$types		= $request->getAcceptableContentTypes();

		$collection	= new D3Collection();
		$form		= $this->createForm(new D3CollectionType(), $collection);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getManager();
			$em->persist($collection);
			$em->flush();

			return $collection;
		}

		return array('form' => $form);
	}


	/**
	 *
	 * updates a D3Collection
	 * @param integer $id D3Collection database identifier
	 * @Rest\View(statusCode="200")
	 */
	public function putAction( $id )
	{
		$request	= $this->getRequest();
		$collection	= $this->getD3Collection($id);
		$form		= $this->createForm(new D3CollectionType(), $collection);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getManager();
			$em->persist($collection);
			$em->flush();

			return $collection;
		}

		return array('form' => $form);
	}

	/**
	 *
	 * @param integer $id
	 * @Rest\View(statusCode="204")
	 */
	public function deleteAction( $id )
	{
		$collection	= $this->getD3Collection($id);

		if( $collection->getCollectionTypeId() == D3Collection::REGULAR_COLLECTION )
		{
			$em = $this->getDoctrine()->getManager();
			$em->remove($collection);
			$em->flush();
		}
		else
		{
			throw new AccessDeniedHttpException("you can't delete this collection", null, 403);
		}

		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}

?>
