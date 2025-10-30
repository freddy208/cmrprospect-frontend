"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirection automatique si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  // Affichage d'un loader pendant la vérification de la session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Croissance rapide",
      description: "Augmentez vos ventes de 3x",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestion d'équipe",
      description: "Suivez vos commerciaux en temps réel",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Objectifs clairs",
      description: "Atteignez vos quotas plus rapidement",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics puissants",
      description: "Prenez des décisions éclairées",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex">
      {/* Section gauche - Visuel et informations */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Éléments de décoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Contenu */}
        <div className="relative z-10">
          {/* Logo et titre */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ProspectsHub</h1>
                <p className="text-blue-100 text-sm">Votre CRM nouvelle génération</p>
              </div>
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              La prospection commerciale
              <br />
              <span className="text-yellow-400">réinventée pour l&apos;Afrique</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Gérez vos prospects, suivez vos équipes et boostez vos performances avec la plateforme préférée des directeurs commerciaux.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-yellow-400 mb-2">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Illustration décorative SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FBBF24"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-90.1,-5.4C-88.4,-21,-82.6,-36,-73.9,-49.4C-65.2,-62.8,-53.6,-74.6,-39.7,-81.9C-25.8,-89.2,-9.6,-92,6.1,-90.6C21.8,-89.2,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex justify-center min-h-screen p-6 sm:p-12">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Logo mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden mb-8 text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">ProspectsHub</h1>
                <p className="text-gray-600 text-sm">Votre CRM nouvelle génération</p>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de connexion */}
          <LoginForm />

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-center"
          >
          </motion.div>
        </div>
      </div>
    </div>
  );
}