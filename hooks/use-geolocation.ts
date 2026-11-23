"use client";

import { useEffect, useState } from "react";

export type GeolocationStatus =
    | "idle"
    | "locating"
    | "success"
    | "denied"
    | "unsupported"
    | "error";

interface GeolocationCoords {
    lat: number;
    lng: number;
}

interface UseGeolocationOptions {
    enabled?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
    const { enabled = true } = options;

    const [status, setStatus] = useState<GeolocationStatus>("idle");
    const [coords, setCoords] = useState<GeolocationCoords | null>(null);
    const [placeName, setPlaceName] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (typeof navigator === "undefined" || !navigator.geolocation) {
            setStatus("unsupported");
            return;
        }

        setStatus("locating");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setCoords({ lat, lng });
                setStatus("success");

                try {
                    const res = await fetch(
                        `/api/geocode/reverse?lat=${lat}&lng=${lng}`
                    );
                    if (res.ok) {
                        const json = await res.json();
                        const name = json?.data?.placeName;
                        if (name) {
                            setPlaceName(name);
                        }
                    }
                } catch {
                    // Place name is optional; coords are enough for nearby search
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus("denied");
                } else {
                    setStatus("error");
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 12000,
                maximumAge: 5 * 60 * 1000,
            }
        );
    }, [enabled]);

    return {
        status,
        coords,
        placeName,
        isLocating: status === "locating",
        isAvailable: status === "success" && coords !== null,
    };
}
