"use client";

import { PixelCard } from "@/components/ui/PixelCard";
import { useGameStore } from "@/lib/store";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function StatsRadar() {
    const { stats } = useGameStore();

    // Data must include full range to keep chart balanced
    const data = [
        { subject: 'Fuerza', A: stats.str, fullMark: 100 },
        { subject: 'Estamina', A: stats.sta, fullMark: 100 },
        { subject: 'Voluntad', A: stats.will, fullMark: 100 },
    ];

    return (
        <PixelCard className="bg-black/20 border-gray-800 p-4 relative overflow-hidden h-[300px] flex flex-col">
            <h3 className="font-press-start text-[10px] text-gray-500 mb-2 uppercase text-center absolute top-4 left-0 right-0 z-10">Triángulo de Poder</h3>

            <div className="-ml-6 w-[calc(100%+40px)] h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#9ca3af", fontSize: 13, fontFamily: 'var(--font-vt323)' }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Stats"
                            dataKey="A"
                            stroke="#4fd6be"
                            strokeWidth={3}
                            fill="#4fd6be"
                            fillOpacity={0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Overlay stats values */}
            <div className="absolute bottom-2 right-2 text-[8px] font-press-start text-gray-600">
                STR: {stats.str} | STA: {stats.sta} | WIL: {stats.will}
            </div>
        </PixelCard>
    );
}
