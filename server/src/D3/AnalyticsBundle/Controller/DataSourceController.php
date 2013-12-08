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
	 * @param integer $dataStoreId
	 * @Rest\View()
	 */
	public function cgetAction( $dataStoreId )
	{
		$em = $this->getDoctrine()->getManager();
		$entities = $em->getRepository('D3AnalyticsBundle:DataSource')->findAll();

		return $entities;
	}

	/**
	 *
	 * @param integer $dataStoreId
	 */
	protected function getDataSource( $dataStoreId, $dataSourceId )
	{
		$em = $this->getDoctrine()->getManager();
		$dataSource = $em->getRepository('D3AnalyticsBundle:DataSource')->findOneById($dataStoreId);

		if( !$dataSource || empty($dataSource) )
		{
			throw new NotFoundHttpException("Sorry, there is no such data source");
		}

		return $dataSource;
	}

	/**
	 *
	 * @param integer $dataStoreId
	 * @param integer $dataSourceId
	 * @return Array
	 * @Rest\View(statusCode="200")
	 */
	public function getAction( $dataStoreId, $dataSourceId )
	{
		if( empty($dataSourceId) || !is_numeric($dataSourceId) )
		{
			throw new NotFoundHttpException("Sorry, there is no such data source");
		}

		$dataSource = $this->getDataSource($dataSourceId);

		return $dataSource;
	}

	/**
	 * 78274616d4a09295689a021bc5fdc83219f74774
	 * @return Array
	 *
	 * @Rest\View(statusCode="200")
	 */
	public function getFormAction()
	{
		$dataSource = new DataSource();
		$form = $this->createForm(new DataSourceType(), $dataSource);

		$token = $form->createView()->children['_token'];
		$CSRF_name = $token->vars['name'];
		$CSRF_value = $token->vars['value'];

		return array('token_name' => $CSRF_name, 'token_value' => $CSRF_value);
	}

	/**
	 *
	 * @param string $name
	 * @return Array
	 *
	 * @Rest\View(statusCode="201")
	 */
	public function postAction( $dataStoreId )
	{
		$request = $this->getRequest();

		/**
		 * TODO: EXPLAIN MORE
		 * no need of these parameters.
		 */
		$request->request->remove("X-Requested-With");
		$request->request->remove("X-HTTP-Accept");

		$dataSource = new DataSource();
		$form = $this->createForm(new DataSourceType(), $dataSource);

		$form->bind($request);

		if( $form->isValid() )
		{
			$em = $this->getDoctrine()->getManager();

			//fill in the data source object fields
			$dataSource->setFileName($this->generateUniqueFileName() . ".d3a");
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
		$request = $this->getRequest();
		$dataSource = $this->getDataSource($id);
		$form = $this->createForm(new DataSourceType(), $dataSource);

		$form->bind($request);

		if( $form->isValid() )
		{
			$em = $this->getDoctrine()->getManager();
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
		$dataSource = $this->getDataSource($id);

		$em = $this->getDoctrine()->getManager();
		$em->remove($dataSource);
		$em->flush();

		return $this->view(null, Codes::HTTP_NO_CONTENT);
	}

}
