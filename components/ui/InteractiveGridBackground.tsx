"use client";

import React, { useEffect, useState } from "react";

export default function InteractiveGridBackground() {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (!isHovering) setIsHovering(true);
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isHovering]);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700">
            {/* 1. Base clean background */}
            <div className="absolute inset-0 bg-background" />

            {/* 2. Wide Interactive Spotlight Grid (reveals grid lines within 450px of cursor) */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    opacity: isHovering ? 1 : 0,
                    backgroundImage: `
                        linear-gradient(to right, rgba(113, 113, 122, 0.22) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(113, 113, 122, 0.22) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    maskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 80%)`,
                    WebkitMaskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 80%)`,
                }}
            />

            {/* 3. High-Contrast Inner Spotlight Grid (bright glowing lines exactly where cursor hovers) */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    opacity: isHovering ? 1 : 0,
                    backgroundImage: `
                        linear-gradient(to right, rgba(20, 184, 166, 0.55) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(20, 184, 166, 0.55) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    maskImage: `radial-gradient(160px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, transparent 100%)`,
                    WebkitMaskImage: `radial-gradient(160px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, transparent 100%)`,
                }}
            />

            {/* 4. Ambient Glowing Orb that follows cursor with smooth trailing spring animation */}
            <div
                className="absolute h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${mousePos.x - 175}px, ${mousePos.y - 175}px)`,
                    opacity: isHovering ? 1 : 0,
                }}
            />
        </div>
    );
}
