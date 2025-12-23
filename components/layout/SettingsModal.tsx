"use client";

import { PixelModal } from "@/components/ui/PixelModal";
import { PixelButton } from "@/components/ui/PixelButton";
import { Volume2, VolumeX, Trash2 } from "lucide-react";
import { useState } from "react";
import { useGameStore } from "@/lib/store";
import Link from "next/link";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [sound, setSound] = useState(true);
    const { logout, hardReset } = useGameStore();

    return (
        <PixelModal isOpen={isOpen} onClose={onClose} title="OPCIONES">
            <div className="space-y-6">
                {/* COMUNIDAD */}
                <div className="space-y-2">
                    <h3 className="font-press-start text-[10px] text-secondary">COMUNIDAD</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <a href="https://t.me/GymmoRPG" target="_blank" className="p-3 border-2 border-gray-800 bg-black/40 text-center hover:border-secondary transition-colors flex items-center justify-center gap-2">
                            <span className="font-vt323 text-xl text-blue-400">Telegram</span>
                        </a>
                        <a href="https://whatsapp.com/channel/0029VbCADrxIN9iigavdj23h" target="_blank" className="p-3 border-2 border-gray-800 bg-black/40 text-center hover:border-secondary transition-colors flex items-center justify-center gap-2">
                            <span className="font-vt323 text-xl text-green-400">WhatsApp</span>
                        </a>
                    </div>
                    <a href="https://github.com/lazzzarito/gymmo" target="_blank" className="block p-3 border-2 border-gray-800 bg-black/40 text-center hover:border-white transition-colors">
                        <span className="font-vt323 text-xl text-gray-400 text-center block">Código en GitHub</span>
                    </a>
                </div>

                {/* INFORMACIÓN LEGAL */}
                <div className="space-y-2">
                    <h3 className="font-press-start text-[10px] text-secondary">LEGAL</h3>
                    <div className="flex flex-col gap-2 font-vt323 text-gray-400 text-lg">
                        <Link href="/privacy" onClick={onClose} className="hover:text-white flex items-center justify-between">
                            <span>Política de Privacidad</span>
                            <span className="text-gray-700">→</span>
                        </Link>
                        <Link href="/terms" onClick={onClose} className="hover:text-white flex items-center justify-between">
                            <span>Términos de Servicio</span>
                            <span className="text-gray-700">→</span>
                        </Link>
                    </div>
                </div>

                {/* SONIDO */}
                <div className="space-y-2">
                    <h3 className="font-press-start text-[10px] text-secondary">AUDIO</h3>
                    <div className="flex items-center justify-between p-3 border-2 border-gray-800 bg-black/40">
                        <div className="flex items-center gap-3">
                            {sound ? <Volume2 className="w-5 h-5 text-secondary" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
                            <span className="font-vt323 text-xl">Efectos SFX</span>
                        </div>
                        <PixelButton onClick={() => setSound(!sound)} size="sm" variant="secondary">
                            {sound ? 'CON' : 'SIN'}
                        </PixelButton>
                    </div>
                </div>

                {/* ACCIONES */}
                <div className="space-y-2 pt-4 border-t border-gray-800">
                    <h3 className="font-press-start text-[10px] text-red-500">ZONA DE PELIGRO</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <PixelButton
                            className="bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
                            onClick={logout}
                        >
                            CERRAR SESIÓN
                        </PixelButton>
                        <PixelButton
                            className="bg-red-900/20 border-red-900 text-red-500 hover:bg-red-900/40"
                            onClick={() => {
                                if (confirm("¿ESTÁS SEGURO? Se borrarán todos tus niveles, logros y gremios permanentemente.")) {
                                    hardReset();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> BORRAR DATOS
                        </PixelButton>
                    </div>
                </div>

                <div className="flex justify-center items-center text-gray-600 font-vt323 text-lg pt-4">
                    <span>Gymmo RPG v3.0 — 2025</span>
                </div>
            </div>
        </PixelModal>
    );
}
