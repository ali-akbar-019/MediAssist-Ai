import { useState, useCallback } from "react";

interface LocationState {
    lat: number;
    lng: number;
    accuracy: number;
}

interface LocationError {
    code: number;
    message: string;
}

export const useLocation = () => {
    const [location, setLocation] = useState<LocationState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<LocationError | null>(null);
    const [permissionStatus, setPermissionStatus] = useState
        <"idle" | "granted" | "denied" | "unavailable">("idle");

    const getLocation = useCallback((): Promise<LocationState | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                setPermissionStatus("unavailable");
                setError({
                    code: 0,
                    message: "Geolocation is not supported by your browser.",
                });
                resolve(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData: LocationState = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    };
                    setLocation(locationData);
                    setPermissionStatus("granted");
                    setIsLoading(false);
                    resolve(locationData);
                },
                (err) => {
                    setIsLoading(false);

                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            setPermissionStatus("denied");
                            setError({
                                code: err.code,
                                message:
                                    "Location permission denied. Please enable location access in your browser settings.",
                            });
                            break;
                        case err.POSITION_UNAVAILABLE:
                            setPermissionStatus("unavailable");
                            setError({
                                code: err.code,
                                message: "Location information is unavailable.",
                            });
                            break;
                        case err.TIMEOUT:
                            setError({
                                code: err.code,
                                message: "Location request timed out. Please try again.",
                            });
                            break;
                        default:
                            setError({
                                code: err.code,
                                message: "An unknown error occurred while getting location.",
                            });
                    }
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000,
                }
            );
        });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const resetLocation = useCallback(() => {
        setLocation(null);
        setError(null);
        setPermissionStatus("idle");
    }, []);

    return {
        location,
        isLoading,
        error,
        permissionStatus,
        getLocation,
        clearError,
        resetLocation,
    };
};