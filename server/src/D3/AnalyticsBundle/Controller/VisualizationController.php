<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
namespace D3\AnalyticsBundle\Controller;


use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use \FOS\RestBundle\Util\Codes;

use JMS\Serializer\Exception\UnsupportedFormatException;

use D3\AnalyticsBundle\Entity\Visualization;
use D3\AnalyticsBundle\Form\VisualizationType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


/**
 * Description of VisualizationController
 *
 * @author kamal
 */
class VisualizationController extends FOSRestController implements ClassResourceInterface
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
		$em				= $this->getDoctrine()->getManager();
        $visualizations	= $em->getRepository('D3AnalyticsBundle:Visualization')->findAll();

		return $visualizations;
	}

	/**
	 *
	 * @param integer $id
	 */
	protected function getVisualization( $id )
	{
		$em				= $this->getDoctrine()->getManager();
        $visualization	= $em->getRepository('D3AnalyticsBundle:Visualization')->findOneById($id);

		if( !$visualization || empty($visualization) )
		{
			throw new NotFoundHttpException("Sorry, there is no such visualization");
		}

		return $visualization;
	}


	/**
	 *
	 * @return Array
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function getAction($id)
	{
		if( empty($id) || !is_numeric($id) )
		{
			throw new NotFoundHttpException("Sorry, there is no such visualization");
		}

		$visualization = $this->getVisualization($id);

		return $visualization;
	}

	/**
	 *
	 * @Rest\View(statusCode="201")
	 */
	public function postAction()
	{
		$request		= $this->getRequest();
		$visualization	= new Visualization();
		$form			= $this->createForm(new VisualizationType(), $visualization);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getEntityManager();
			$em->persist($visualization);
			$em->flush();

			return $visualization;
		}

		return array('form' => $form);
	}


	/**
	 *
	 * updates a Visualization
	 *
	 * @param integer $id Visualization database identifier
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function putAction( $id )
	{
		$request		= $this->getRequest();
		$visualization	= $this->getVisualization($id);
		$form			= $this->createForm(new VisualizationType(), $visualization);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getEntityManager();
			$em->persist($visualization);
			$em->flush();

			return $visualization;
		}

		return array('form' => $form);
	}

	/**
	 *
	 * @param integer $id
	 *
	 * @Rest\View()
	 */
	public function deleteAction( $id )
	{
		$visualization	= $this->getVisualization($id);

		$em = $this->getDoctrine()->getEntityManager();
		$em->remove($visualization);
		$em->flush();

		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}

?>
