<?php

namespace D3\AnalyticsBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;

use D3\AnalyticsBundle\Entity\DataSource;
use D3\AnalyticsBundle\Form\DataSourceType;

use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Util\Codes;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * DataSource controller.
 *
 * @Rest\RouteResource("DataSource");
 */
class DataSourceController extends FOSRestController implements ClassResourceInterface
{

    /**
     * Lists all DataSource entities.
     *
	 * @Rest\View()
     */
    public function cgetAction()
    {
        $em			= $this->getDoctrine()->getManager();
        $entities	= $em->getRepository('D3AnalyticsBundle:DataSource')->findAll();

        return array('entities' => $entities);
    }

	/**
	 *
	 * @param integer $id
	 */
	protected function getDataSource( $id )
	{
		$em			= $this->getDoctrine()->getManager();
        $dataSource	= $em->getRepository('D3AnalyticsBundle:DataSource')->findOneById($id);

		if( !$dataSource || empty($dataSource) )
		{
			throw new NotFoundHttpException("Sorry, there is no such data source");
		}

		return $dataSource;
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
			throw new NotFoundHttpException("Sorry, there is no such data source");
		}

		$dataSource = $this->getDataSource($id);

		return $dataSource;
	}

	/**
	 *
	 * @param string $name
	 * @return Array
	 *
	 * @Rest\View(statusCode="201")
	 */
	public function postAction()
	{
		$request	= $this->getRequest();
		$dataSource	= new DataSource();
		$form		= $this->createForm(new DataSourceType(), $dataSource);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getEntityManager();

			//fill in the data source object fields
			$dataSource->setFileName($this->generateUniqueFileName() . ".csv");
			$dataSource->upload();

			$em->persist($dataSource);
			$em->flush();

			return $dataSource;
		}

		return array('form' => $form);
	}


	/**
	 * Generate unique file name.
	 *
	 * @return string An unique file name.
	 */
	private function generateUniqueFileName()
	{
		return md5(base64_encode(pack('N6', mt_rand(), mt_rand(), mt_rand(), mt_rand(), mt_rand(), uniqid())));
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
		$request	= $this->getRequest();
		$dataSource	= $this->getDataSource($id);
		$form		= $this->createForm(new DataSourceType(), $dataSource);

		$form->bind($request);

		if($form->isValid())
		{
			$em = $this->getDoctrine()->getEntityManager();
			$em->persist($dataSource);
			$em->flush();

			return $dataSource;
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
		$dataSource	= $this->getDataSource($id);

		$em = $this->getDoctrine()->getEntityManager();
		$em->remove($dataSource);
		$em->flush();

		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}
