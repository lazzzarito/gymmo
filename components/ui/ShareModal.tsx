"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { PixelModal } from "./PixelModal";
import { PixelButton } from "./PixelButton";
import { Share, Download, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareStat {
    label: string;
    value: string | number;
    color?: string;
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    stats: ShareStat[];
    icon?: React.ReactNode;
    type: 'PROFILE' | 'QUEST' | 'WORKOUT';
    color?: string; // Border accent color
}

export function ShareModal({ isOpen, onClose, title, subtitle, stats, icon, type, color = "border-white" }: ShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            // Generate Image
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2, // High resolution
                backgroundColor: '#000000',
            });

            // Convert to Blob
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `gymmo_share_${Date.now()}.png`, { type: 'image/png' });

            // Share Text based on type
            let shareText = "¡He conquistado mis límites en Gymmo! ⚔️";
            if (type === 'QUEST') shareText = "¡Misión Diaria Completada! 🛡️ #GymmoHero";
            if (type === 'WORKOUT') shareText = "¡Mazmorra purificada! Entrenamiento completado. 💪 #Gymmo";
            if (type === 'PROFILE') shareText = "Este es mi legado. ¿Te atreves a superar mis stats? 👑 #GymmoStats";

            // Attempt Native Share
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Gymmo Legacy',
                    text: shareText,
                    files: [file]
                });
            } else {
                // Fallback: Download
                const link = document.createElement('a');
                link.download = `gymmo_${type.toLowerCase()}_${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error("Error sharing:", err);
            // Fallback for desktop/unsupported if share fails but generation worked
            if (cardRef.current) {
                const dataUrl = await toPng(cardRef.current);
                const link = document.createElement('a');
                link.download = 'gymmo-share.png';
                link.href = dataUrl;
                link.click();
            }
        } finally {
            setIsGenerating(false);
            onClose(); // Optional: close after share
        }
    };

    return (
        <PixelModal isOpen={isOpen} onClose={onClose} title="COMPARTIR LEGADO">
            <div className="space-y-6 flex flex-col items-center">
                <p className="font-vt323 text-gray-400 text-center">
                    Captura este momento y compártelo con tus aliados.
                </p>

                {/* The Card to be Captured */}
                <div
                    ref={cardRef}
                    className={cn(
                        "relative w-full aspect-[4/5] bg-black p-6 border-4 flex flex-col justify-between overflow-hidden",
                        color
                    )}
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% 50%, rgba(50,50,50,0.2) 2px, transparent 2px),
                            linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95))
                        `,
                        backgroundSize: '20px 20px, 100% 100%'
                    }}
                >
                    {/* Watermark / Header */}
                    <div className="flex justify-between items-start z-10">
                        <div className="text-2xl font-black italic tracking-tighter text-white/20">GYMMO</div>
                        <div className="px-2 py-1 border border-white/20 text-[8px] font-press-start text-white/50 rounded">
                            {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 z-10 text-center">
                        <div className={cn("transform scale-150 p-4 border-2 rounded-full mb-2 bg-black/50 shadow-xl", color)}>
                            {icon || <Share className="w-8 h-8 text-white" />}
                        </div>

                        <h2 className="font-press-start text-xl text-white uppercase break-words w-full shadow-black drop-shadow-md">
                            {title}
                        </h2>
                        {subtitle && <p className="font-vt323 text-xl text-gray-300 px-4">{subtitle}</p>}

                        {/* Stats Grid */}
                        <div className="w-full grid grid-cols-2 gap-3 mt-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-2 rounded relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
                                    <div className="font-press-start text-[8px] text-gray-500 uppercase">{stat.label}</div>
                                    <div className={cn("font-vt323 text-2xl truncate", stat.color || "text-white")}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer / URL */}
                    <div className="mt-4 pt-4 border-t border-dashed border-white/10 z-10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="font-vt323 text-gray-500 text-sm">gymmo.app</span>
                            </div>
                            <div className="font-press-start text-[8px] text-white/30">LVL {type}</div>
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full pointer-events-none" />
                </div>

                {/* Action Button */}
                <PixelButton onClick={handleShare} className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> GENERANDO...</>
                    ) : (
                        <><Camera className="w-4 h-4 mr-2" /> COMPARTIR HALLAZGO</>
                    )}
                </PixelButton>
            </div>
        </PixelModal>
    );
}
