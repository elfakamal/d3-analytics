<?php

namespace D3\AnalyticsBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class D3CollectionType extends AbstractType
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
//            ->add('collectionTypeId')
//            ->add('creationDate')
//            ->add('updateDate')
        ;
    }

    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'D3\AnalyticsBundle\Entity\D3Collection',
			'csrf_protection'	=> false
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return '';
    }
}
