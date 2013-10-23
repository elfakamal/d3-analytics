<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace D3\AnalyticsBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use D3\AnalyticsBundle\Entity\Visualization;
use D3\AnalyticsBundle\Form\VisualizationType;

/**
 * Description of Front
 *
 * @author kamal
 */
class FrontController extends Controller
{

	public function indexAction()
	{
		return $this->render("D3AnalyticsBundle:Front:index.html.twig");
	}

	public function aboutAction()
	{
		return $this->render("D3AnalyticsBundle:Front:about.html.twig");
	}

	public function contactAction( Request $request)
	{
		$entity = new Visualization();
		$form = $this->createForm(new VisualizationType(), $entity);

		if( $request->getMethod() == "POST" )
		{
			$form->bind($request);

			if ($form->isValid())
			{
				$em = $this->getDoctrine()->getManager();
//				$em->persist($entity);
//				$em->flush();
			}
		}

		return $this->render("D3AnalyticsBundle:Front:contact.html.twig", array('form' => $form->createView()));
	}
}

?>
