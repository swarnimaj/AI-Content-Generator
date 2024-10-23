import React, { useRef, useEffect, useState } from 'react';

const LazyIframe = ({ srcDoc, title }) => {
  const iframeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      if (iframeRef.current) {
        observer.unobserve(iframeRef.current);
      }
    };
  }, []);

  return (
    <div ref={iframeRef} style={{ height: '500px', width: '100%' }}>
      {isVisible && (
        <iframe
          srcDoc={srcDoc}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

export default LazyIframe;
