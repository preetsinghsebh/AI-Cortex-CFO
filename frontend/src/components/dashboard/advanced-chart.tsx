"use client"

import { useEffect, useRef, memo } from 'react';

function AdvancedChartWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => {
            if (typeof window.TradingView !== 'undefined') {
                new window.TradingView.widget({
                    "width": "100%",
                    "height": "100%",
                    "symbol": "NSE:NIFTY",
                    "interval": "D",
                    "timezone": "Asia/Kolkata",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_advanced_chart",
                    "hide_side_toolbar": false,
                    "studies": [
                        "RSI@tv-basicstudies",
                        "MACD@tv-basicstudies"
                    ]
                });
            }
        };

        container.current.appendChild(script);
    }, []);

    return (
        <div className="h-full w-full relative" ref={container}>
            <div id="tradingview_advanced_chart" className="h-full w-full" />
        </div>
    );
}

export const AdvancedChart = memo(AdvancedChartWidget);

declare global {
    interface Window {
        TradingView: any;
    }
}
