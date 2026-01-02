import React from 'react';

type Props = {
  code: string;
};

export function WebsiteFrame({ code }: Props) {
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Website Preview</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; }
      </style>
    </head>
    <body>
      ${code}
      <script>
        // Prevent default anchor link behavior and handle scroll inside iframe
        document.addEventListener('DOMContentLoaded', function() {
          // Handle all anchor links
          document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              const href = this.getAttribute('href');
              if (href && href !== '#') {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                  
                  // Update URL hash without affecting parent
                  if (history.pushState) {
                    history.pushState(null, null, href);
                  }
                }
              }
            });
          });
          
          // Close mobile menus when clicking links
          document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function() {
              // Find and close mobile menu if exists
              const mobileMenu = document.querySelector('[id*="mobile-menu"]') || 
                                 document.querySelector('[class*="mobile-menu"]');
              if (mobileMenu) {
                mobileMenu.classList.remove('active', 'open', 'show');
                mobileMenu.style.transform = 'translateX(-100%)';
              }
            });
          });
        });
        
        // Wait for all scripts to load
        window.addEventListener('load', function() {
          setTimeout(function() {
            // Initialize AOS
            if (typeof AOS !== 'undefined') {
              AOS.init({
                duration: 800,
                once: false,
                offset: 100,
                easing: 'ease-in-out'
              });
            }
            
            // Initialize Lucide
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }, 100);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={fullHTML}
      className="w-full h-[calc(100vh-4rem)] border rounded-lg shadow-lg"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      title="Website Preview"
      style={{ border: '1px solid #e5e7eb' }}
    />
  );
}

export default WebsiteFrame;