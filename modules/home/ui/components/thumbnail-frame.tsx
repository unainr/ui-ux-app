"use client";
import React, { useRef, useEffect, useState } from "react";

interface Props {
	code: string;
}

export function ThumbnailFrame({ code }: Props) {
	const frameRef = useRef<HTMLIFrameElement>(null);

	const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; overflow: hidden; background-color: #ffffff; } /* Default white bg */
        /* Disable animations for thumbnail */
        * { animation: none !important; transition: none !important; }
      </style>
    </head>
    <body>
      ${code}
      <script>
        window.addEventListener('load', function() {
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
        });
      </script>
    </body>
    </html>
  `;

	return (
		<div className="w-full h-full relative overflow-hidden bg-white select-none pointer-events-none group-hover:scale-105 transition-transform duration-500">
			<iframe
				ref={frameRef}
				srcDoc={fullHTML}
				className="w-[1920px] h-[1080px] border-none origin-top-left"
				tabIndex={-1}
				title="Thumbnail"
				sandbox="allow-scripts"
				style={{
					transform: "scale(0.2)",
					width: "500%",
					height: "500%",
					pointerEvents: "none",
				}}
			/>
			{/* Overlay to prevent interaction */}
			<div className="absolute inset-0 z-10 bg-transparent"></div>
		</div>
	);
}
