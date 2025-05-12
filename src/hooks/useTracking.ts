import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type EventName = 
  | 'page_view'
  | 'cv_upload'
  | 'prequalification_complete'
  | 'test_start'
  | 'test_complete'
  | 'results_viewed'
  | 'brochure_download'
  | 'cta_click';

interface TrackEventProps {
  name: EventName;
  properties?: Record<string, any>;
}

const useTracking = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackEvent({
      name: 'page_view',
      properties: {
        path: location.pathname,
        title: getPageTitle(location.pathname),
      }
    });
  }, [location.pathname]);

  const trackEvent = ({ name, properties = {} }: TrackEventProps) => {
    // In a real application, this would send data to an analytics service
    // For now, we'll just log to console
    console.log(`[Event: ${name}]`, properties);
    
    // Example implementation with Google Analytics
    // if (window.gtag) {
    //   window.gtag('event', name, properties);
    // }
  };

  const trackCTAClick = (ctaName: string, destination?: string) => {
    trackEvent({
      name: 'cta_click',
      properties: {
        cta_name: ctaName,
        destination,
      }
    });
  };

  return {
    trackEvent,
    trackCTAClick,
  };
};

function getPageTitle(path: string): string {
  switch (path) {
    case '/':
      return 'CV Upload';
    case '/prequalification':
      return 'Préqualification';
    case '/landing':
      return 'Welcome';
    case '/test':
      return 'Cognitive Test';
    case '/results':
      return 'Test Results';
    case '/formation':
      return 'Micro Formation';
    default:
      return 'La Passerelle Recrutement';
  }
}

export default useTracking;