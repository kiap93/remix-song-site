import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSense() {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    
    const initAd = () => {
      try {
        const ads = document.getElementsByClassName('adsbygoogle');
        let pushed = false;

        for (let i = 0; i < ads.length; i++) {
          const ad = ads[i] as HTMLElement;
          // Check if it's our specific slot to avoid interfering with others
          if (ad.getAttribute('data-ad-slot') === '3172608804') {
            // Only push if it hasn't been initialized and HAS a visible width
            if (!ad.hasAttribute('data-adsbygoogle-status')) {
              if (ad.clientWidth > 0) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                pushed = true;
              } else if (attempts < maxAttempts) {
                // If width is still 0, try again shortly
                attempts++;
                setTimeout(initAd, 200);
                return;
              }
            }
          }
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    };

    // Initial wait to allow layout to settle
    const timer = setTimeout(initAd, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full mt-auto py-12 flex justify-center bg-zinc-950/50 border-t border-zinc-900 min-h-[250px]">
      <div className="w-full max-w-5xl px-4 overflow-hidden flex justify-center">
        <div style={{ width: '100%', minWidth: '250px' }}>
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '90px' }}
            data-ad-format="autorelaxed"
            data-ad-client="ca-pub-1430587625650027"
            data-ad-slot="3172608804"
          ></ins>
        </div>
      </div>
    </div>
  );
}
