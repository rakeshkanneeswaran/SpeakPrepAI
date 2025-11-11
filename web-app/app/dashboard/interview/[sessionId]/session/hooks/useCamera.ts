"use client";
import { useState, useRef, useCallback, useEffect, RefObject } from "react";

export const useCamera = () => {
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const startCamera = useCallback(async () => {
        try {
            setCameraError(null);

            // Stop any existing camera stream first
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user",
                },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await new Promise((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play().then(resolve).catch(resolve);
                        };
                    }
                });
            }
            setCameraActive(true);
        } catch (err: any) {
            console.error("Camera access denied:", err);
            setCameraError(
                `Camera error: ${err.message || "Please allow camera access to continue."}`
            );
            setCameraActive(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        console.log("📷 Stopping camera...");
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => {
                track.stop();
                console.log("📷 Stopped camera track:", track.kind);
            });
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setCameraError(null);
    }, []);

    // Auto cleanup when component unmounts
    useEffect(() => {
        return () => {
            console.log("📷 Cleaning up camera on unmount...");
            stopCamera();
        };
    }, [stopCamera]);

    // Stop camera when page becomes hidden (user switches tabs, minimizes window)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && cameraActive) {
                console.log("📷 Page hidden, stopping camera...");
                stopCamera();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [cameraActive, stopCamera]);

    // Stop camera when window is about to unload (user navigates away)
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (cameraActive) {
                console.log("📷 Page unloading, stopping camera...");
                stopCamera();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cameraActive, stopCamera]);

    return {
        cameraError,
        cameraActive,
        videoRef: videoRef as RefObject<HTMLVideoElement | null>,
        startCamera,
        stopCamera,
    };
};