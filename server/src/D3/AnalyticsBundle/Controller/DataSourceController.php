<?php

namespace D3\AnalyticsBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use D3\AnalyticsBundle\Entity\DataSource;
use D3\AnalyticsBundle\Form\DataSourceType;

/**
 * DataSource controller.
 *
 */
class DataSourceController extends Controller
{

    /**
     * Lists all DataSource entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('D3AnalyticsBundle:DataSource')->findAll();

        return $this->render('D3AnalyticsBundle:DataSource:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new DataSource entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new DataSource();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('datasource_show', array('id' => $entity->getId())));
        }

        return $this->render('D3AnalyticsBundle:DataSource:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a DataSource entity.
    *
    * @param DataSource $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(DataSource $entity)
    {
        $form = $this->createForm(new DataSourceType(), $entity, array(
            'action' => $this->generateUrl('datasource_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new DataSource entity.
     *
     */
    public function newAction()
    {
        $entity = new DataSource();
        $form   = $this->createCreateForm($entity);

        return $this->render('D3AnalyticsBundle:DataSource:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a DataSource entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('D3AnalyticsBundle:DataSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find DataSource entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('D3AnalyticsBundle:DataSource:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing DataSource entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('D3AnalyticsBundle:DataSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find DataSource entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('D3AnalyticsBundle:DataSource:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a DataSource entity.
    *
    * @param DataSource $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(DataSource $entity)
    {
        $form = $this->createForm(new DataSourceType(), $entity, array(
            'action' => $this->generateUrl('datasource_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing DataSource entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('D3AnalyticsBundle:DataSource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find DataSource entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('datasource_edit', array('id' => $id)));
        }

        return $this->render('D3AnalyticsBundle:DataSource:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a DataSource entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('D3AnalyticsBundle:DataSource')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find DataSource entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('datasource'));
    }

    /**
     * Creates a form to delete a DataSource entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('datasource_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
