<?php

namespace D3\AnalyticsBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityRepository;

/**
 *
 * @author Kamal Farsaoui <elfa.kamal@gmail.com>
 */
class VisualizationType extends AbstractType
{

	/**
	 * @param FormBuilderInterface $builder
	 * @param array $options
	 */
	public function buildForm( FormBuilderInterface $builder, array $options )
	{
		$builder
						->add('name')
						->add('description')
						->add('visualization_type_id')
						->add('is_active')
						->add('is_starred')
						->add('chart_data')


////creation_date: "2013-11-15T01:18:57+0100"
////data_sources: Array[1]
////description: "my"
////id: 39
//is_active: true
//is_starred: false
////name: "my data EDIT"
////update_date: "2013-11-15T01:19:25+0100"
//visualizationTypeId: "1"
//visualization_type_id: 1



//            ->add('creationDate')
//            ->add('updateDate')
//            ->add('collections', 'entity', array(
//				"class" => "ArrayCollection",
//				"query_builder" => function(EntityRepository $repository) {
//					return $repository->createQueryBuilder("c")->where("c.collectionTypeId = 2");
//				},
//				"property" => "id"
//			))
//
//            ->add('collections', 'collection', array(
//				'type'   => 'select',
//				'options'  => array(
//					'choices'  => function(EntityRepository $repository) {
//						return $repository->createQueryBuilder("c.id")->where("c.collectionTypeId = 2")->getQuery()->getResult();
//					},
////					'choices'  => array(
////						'nashville' => 'Nashville',
////						'paris'     => 'Paris',
////						'berlin'    => 'Berlin',
////						'london'    => 'London',
////					),
//				)))
//            ->add('dataSourceId')
		;
	}

	/**
	 * @param OptionsResolverInterface $resolver
	 */
	public function setDefaultOptions( OptionsResolverInterface $resolver )
	{
		$resolver->setDefaults(array(
				'data_class' => 'D3\AnalyticsBundle\Entity\Visualization',
				'csrf_protection' => false
		));
	}

	/**
	 * It returns an empty string because there is no form.
	 * thus the request can get directly to the params without
	 * passing through the form name.
	 *
	 * @return string
	 */
	public function getName()
	{
		return '';
	}

}
