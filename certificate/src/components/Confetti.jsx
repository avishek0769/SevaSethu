// src/components/Confetti.jsx

import { useEffect, useRef } from "react";

const COLORS = [
    "#c0392b",
    "#d4af37",
    "#e74c3c",
    "#f5d76e",
    "#8b0000",
    "#a855f7",
    "#3b82f6",
    "#fff",
];

export default function Confetti({ active }) {
    const ref = useRef();

    useEffect(() => {
        if (!active || !ref.current) return;
        const wrap = ref.current;
        for (let i = 0; i < 70; i++) {
            const el = document.createElement("div");
            const size = 6 + Math.random() * 9;
            el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-10px;
        width:${size}px;
        height:${size}px;
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
        animation:fall ${1.5 + Math.random() * 2}s linear ${Math.random() * 0.8}s forwards;
        pointer-events:none;
      `;
            wrap.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }
    }, [active]);

    return (
        <div
            ref={ref}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 999,
                overflow: "hidden",
            }}
        />
    );
}
