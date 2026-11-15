"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileController() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Désactive l'affichage style Spotify sur l'écran verrouillé iPhone
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
      } catch {}
    }

    // 2. Fonction qui coupe immédiatement tout son dès qu'on quitte ou verrouille l'iPhone
    const stopAllSiteAudio = () => {
      const audios = document.querySelectorAll("audio");
      audios.forEach((audio) => {
        if (!audio.paused) {
          audio.dataset.wasPlaying = "true";
          audio.pause();
        }
      });

      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        if (!video.paused && !video.muted) {
          video.pause();
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        stopAllSiteAudio();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", stopAllSiteAudio);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("beforeunload", stopAllSiteAudio);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", stopAllSiteAudio);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("beforeunload", stopAllSiteAudio);
    };
  }, [pathname]);

  return null;
}