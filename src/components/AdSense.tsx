import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="w-full mt-auto py-8 flex justify-center bg-zinc-950/50">
      <div className="w-full max-w-4xl px-4 overflow-hidden">
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-1430587625650027"
          data-ad-slot="3172608804"
        ></ins>
      </div>
    </div>
  );
}
