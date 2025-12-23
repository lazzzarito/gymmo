"use client";

import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelInput } from "@/components/ui/PixelInput";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { ArrowRight, Swords, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EntryPoint() {
  const router = useRouter();
  const { updateProfile, isAuthenticated, name, email: storeEmail } = useGameStore();

  // Si ya está autenticado, redirigir al Hub
  useEffect(() => {
    if (isAuthenticated && name !== 'Héroe') {
      router.push("/hub");
    }
  }, [isAuthenticated, name, router]);

  const [view, setView] = useState<'splash' | 'login' | 'onboarding'>('splash');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    class: "",
  });

  const handleStartAdventure = () => {
    setView('onboarding');
    setStep(0);
  };

  const handleLogin = () => {
    // Simulación de login local
    if (formData.email === storeEmail && storeEmail !== '') {
      updateProfile({ isAuthenticated: true });
      router.push("/hub");
    } else {
      alert("Credenciales no encontradas localmente. Por favor, crea una nueva aventura.");
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateProfile({
        name: formData.name,
        email: formData.email,
        gender: formData.gender as 'male' | 'female',
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        class: formData.class as any,
        isAuthenticated: true
      });
      router.push("/hub");
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
      <div className="absolute top-10 left-10 w-16 h-16 border-4 border-white/10 rotate-45" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-white/5 rotate-12" />

      <AnimatePresence mode="wait">
        {view === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-press-start text-primary tracking-tighter">GYMMO</h1>
              <p className="font-vt323 text-2xl text-gray-500 uppercase tracking-widest">The RPG Fitness Experience</p>
            </div>

            <div className="space-y-4">
              <PixelButton onClick={handleStartAdventure} className="w-full h-16 text-lg">
                NUEVA AVENTURA
              </PixelButton>
              <PixelButton onClick={() => setView('login')} variant="outline" className="w-full">
                CONTINUAR SENDA (LOGIN)
              </PixelButton>
            </div>

            <p className="text-gray-600 font-vt323 text-lg italic">"Donde el hierro se convierte en leyenda"</p>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md"
          >
            <PixelCard>
              <h2 className="text-xl text-secondary mb-6 text-center font-press-start uppercase">Login</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Email del Héroe</label>
                  <PixelInput
                    type="email"
                    placeholder="hero@gymmo.com"
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Palabra de Poder (Password)</label>
                  <PixelInput
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <PixelButton onClick={handleLogin} className="w-full" disabled={!formData.email}>
                    REANUDAR PROGRESO
                  </PixelButton>
                  <button onClick={() => setView('splash')} className="text-gray-500 font-vt323 text-lg hover:text-white transition-colors">
                    ← Volver
                  </button>
                </div>
              </div>
            </PixelCard>
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div key="onboarding" className="w-full max-w-md">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h1 className="text-2xl md:text-3xl text-primary mb-8 leading-relaxed font-vt323 text-4xl">
                  ¿Comenzamos? Ingresa tu correo electrónico
                </h1>
                <div className="mb-8">
                  <PixelInput
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                  />
                </div>
                <PixelButton onClick={nextStep} className="w-full" disabled={!formData.email}>
                  DESPERTAR <ArrowRight className="ml-2 inline-block w-4 h-4" />
                </PixelButton>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1">
                <PixelCard>
                  <h2 className="text-xl text-secondary mb-6 text-center">Identidad</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Nombre de Héroe</label>
                      <PixelInput
                        placeholder="Ej. Arnold"
                        value={formData.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Género</label>
                      <div className="flex gap-4">
                        <PixelButton variant={formData.gender === "male" ? "primary" : "outline"} onClick={() => updateForm("gender", "male")} className="flex-1">M</PixelButton>
                        <PixelButton variant={formData.gender === "female" ? "primary" : "outline"} onClick={() => updateForm("gender", "female")} className="flex-1">F</PixelButton>
                      </div>
                    </div>
                    <PixelButton onClick={nextStep} className="w-full mt-6" disabled={!formData.name || !formData.gender}>CONTINUAR</PixelButton>
                  </div>
                </PixelCard>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2">
                <PixelCard>
                  <h2 className="text-xl text-secondary mb-6 text-center">Biometría</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Edad</label>
                      <PixelInput type="number" value={formData.age} onChange={(e) => updateForm("age", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Peso (kg)</label>
                      <PixelInput type="number" value={formData.weight} onChange={(e) => updateForm("weight", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-vt323 tracking-widest uppercase text-gray-400">Altura (cm)</label>
                      <PixelInput type="number" value={formData.height} onChange={(e) => updateForm("height", e.target.value)} />
                    </div>
                    <PixelButton onClick={nextStep} className="w-full col-span-2 mt-4" disabled={!formData.age || !formData.weight || !formData.height}>SIGUIENTE</PixelButton>
                  </div>
                </PixelCard>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3">
                <PixelCard>
                  <h2 className="text-xl text-secondary mb-6 text-center">Elige tu Clase</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'Novato', label: 'Novato', icon: User, desc: 'Palo de madera. Inicia tu viaje.' },
                      { id: 'Intermedio', label: 'Intermedio', icon: Swords, desc: 'Espada de hierro. Ya has entrenado.' },
                      { id: 'Pro', label: 'Pro', icon: Swords, desc: 'Espada de diamante. Eres una bestia.' },
                    ].map((c) => (
                      <div key={c.id} onClick={() => updateForm('class', c.id)} className={cn("border-4 p-4 cursor-pointer transition-all hover:scale-105", formData.class === c.id ? "border-primary bg-primary/20" : "border-gray-700 bg-black/20")}>
                        <div className="flex items-center gap-4">
                          <div className="p-2 border-2 border-white"><c.icon className="w-6 h-6 text-white" /></div>
                          <div><h3 className="font-press-start text-xs text-white mb-1">{c.label}</h3><p className="font-vt323 text-gray-400 text-sm">{c.desc}</p></div>
                        </div>
                      </div>
                    ))}
                    <PixelButton onClick={nextStep} className="w-full mt-6" disabled={!formData.class}>COMENZAR AVENTURA</PixelButton>
                  </div>
                </PixelCard>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
