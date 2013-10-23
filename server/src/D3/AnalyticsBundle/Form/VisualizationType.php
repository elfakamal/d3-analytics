<?php

namespace D3\AnalyticsBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class VisualizationType extends AbstractType
{
	/**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('description')
            ->add('visualizationTypeId')
//            ->add('creationDate')
//            ->add('updateDate')
//            ->add('collections')
//            ->add('dataSources')
        ;
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class'		=> 'D3\AnalyticsBundle\Entity\Visualization',
			'csrf_protection'	=> false
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
