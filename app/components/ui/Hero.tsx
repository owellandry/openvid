"use client";
import { Icon } from "@iconify/react";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveUploadedVideo } from "@/lib/video-upload-cache";
import { saveUploadedImage } from "@/lib/image-upload-cache";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
    onVideoUpload?: (file: File) => void;
    onPhotoUpload?: (file: File) => void;
}

export default function Hero({ onVideoUpload, onPhotoUpload }: HeroProps) {
    const t = useTranslations("hero");
    const router = useRouter();

    const videoInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingVideo, setIsDraggingVideo] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);

    const handleVideoFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("video/")) return;
        setIsUploadingVideo(true);
        try {
            await saveUploadedVideo(file);
            if (onVideoUpload) onVideoUpload(file);
            router.push("/editor?mode=video");
        } finally {
            setIsUploadingVideo(false);
        }
    }, [onVideoUpload, router]);

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleVideoFile(file);
        e.target.value = "";
    };

    const handleVideoDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVideo(true);
    };

    const handleVideoDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVideo(false);
    };

    const handleVideoDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVideo(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleVideoFile(file);
    };

    const photoInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const handlePhotoFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        setIsUploadingPhoto(true);
        try {
            await saveUploadedImage(file);
            if (onPhotoUpload) onPhotoUpload(file);
            router.push("/editor?mode=photo");
        } finally {
            setIsUploadingPhoto(false);
        }
    }, [onPhotoUpload, router]);

    const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handlePhotoFile(file);
        e.target.value = "";
    };

    return (
        <>
            <h1 className="animate-reveal text-5xl md:text-7xl font-semibold text-white tracking-tight mb-5 leading-[1.05]">
                {t("title")}
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-200 via-neutral-400 to-amber-300">
                    {t("titleHighlight")}
                </span>
            </h1>
            <p className="animate-reveal [animation-delay:150ms] text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                {t("description")}
            </p>

            <div className="animate-reveal [animation-delay:300ms] flex flex-col items-center justify-center gap-3">
                <div
                    onDragOver={handleVideoDragOver}
                    onDragLeave={handleVideoDragLeave}
                    onDrop={handleVideoDrop}
                    onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                    className={[
                        "w-full max-w-md",
                        "relative flex items-center justify-center px-6 h-14",
                        "rounded-2xl border cursor-pointer transition-all duration-200",
                        isDraggingVideo ? "border-amber-400/60 bg-amber-500/10" : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25",
                        isUploadingVideo ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                >
                    <div className="flex items-center justify-center gap-3 pointer-events-none w-full">
                        {isUploadingVideo ? (
                            <>
                                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-amber-300" />
                                <span className="text-sm font-semibold text-white/80">{t("uploadButtonUploading")}</span>
                            </>
                        ) : isDraggingVideo ? (
                            <>
                                <Icon icon="ph:arrow-fat-down-bold" className="w-5 h-5 text-amber-300" />
                                <span className="text-sm font-semibold text-white/80">{t("uploadButtonDragging")}</span>
                            </>
                        ) : (
                            <>
                                <Icon icon="mage:video-upload" className="w-5 h-5 text-amber-300" />
                                <span className="text-sm font-semibold text-white">{t("uploadButton")}</span>
                                <span className="text-xs text-white/40 hidden sm:inline">MP4, WebM, MOV</span>
                            </>
                        )}
                    </div>
                </div>

                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    className="hidden"
                    onChange={handleVideoFileChange}
                />

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <a href="#docs">{t("recordButton")}</a>
                    </Button>

                    <button
                        type="button"
                        onClick={() => !isUploadingPhoto && photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="text-sm text-white/60 hover:text-white/85 transition-colors underline decoration-white/20 underline-offset-4 disabled:opacity-50"
                    >
                        {t("uploadPhotoButton")}
                    </button>

                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handlePhotoFileChange}
                    />
                </div>

                <Link href="/editor?mode=video" className="text-sm text-white/50 hover:text-white/75 transition-colors mt-2">
                    {t("goToVideoEditor")}
                </Link>
            </div>
        </>
    );
}
