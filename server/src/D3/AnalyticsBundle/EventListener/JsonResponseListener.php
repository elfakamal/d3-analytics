<?php

namespace D3\AnalyticsBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernel;

/**
 * Description of JsonResponseListener
 *
 * @author kamal
 */
class JsonResponseListener
{

  public function onKernelResponse( FilterResponseEvent $event )
  {
    $request = $event->getRequest();

//		if( HttpKernel::MASTER_REQUEST != $event->getRequestType() )
//		{
//			// don't do anything if it's not the master request
//			return;
//		}

    $event->getResponse()->headers->set('Access-Control-Allow-Credentials', 'true');
    $event->getResponse()->headers->set('Access-Control-Allow-Headers', 'origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    $event->getResponse()->headers->set('Access-Control-Allow-Origin', 'http://localhost:1984');
    $event->getResponse()->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
    //$event->getResponse()->headers->set('Allow', 'POST, GET, PUT, DELETE, OPTIONS, PATCH');
  }

}

?>
