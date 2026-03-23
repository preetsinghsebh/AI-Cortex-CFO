"use client"

import { useEffect, useRef, memo } from 'react';

function SectorHeatmapWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous widget if any (though unlikely with strict mode off/on in dev)
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "exchanges": [],
            "dataSource": "NIFTY50",
            "grouping": "sector",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "locale": "en",
            "symbolUrl": "",
            "colorTheme": "dark",
            "hasTopBar": false,
            "isDataSetEnabled": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "width": "100%",
            "height": "100%"
        });

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";

        container.current.appendChild(widgetContainer);
        container.current.appendChild(script);

    }, []);

    return (
        <div className="tradingview-widget-container h-full w-full" ref={container} />
    );
}

export const SectorHeatmap = memo(SectorHeatmapWidget);
