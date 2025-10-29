/* eslint-disable react-hooks/purity */
"use client";

import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Rocket,
  Target,
} from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Suivi en temps réel",
      description:
        "Visualisez l'activité de vos commerciaux instantanément avec des données actualisées en direct.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Gestion des prospects",
      description:
        "Centralisez et organisez vos prospects avec un système intuitif et performant.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analyse avancée",
      description:
        "Prenez des décisions éclairées grâce à des rapports détaillés et des KPIs personnalisés.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tableau de bord puissant",
      description:
        "Accédez à toutes vos informations critiques depuis une interface claire et moderne.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const benefits = [
    {
      icon: <Rocket className="w-5 h-5" />,
      text: "Interface intuitive et rapide",
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Synchronisation en temps réel",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      text: "Rapports automatisés",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Sécurité renforcée",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: "Support dédié 24/7",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Mises à jour gratuites",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ProspectsHub
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/(auth)/login">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                >
                  Se connecter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Contenu textuel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-5 py-2.5 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full mb-8 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Plateforme CRM nouvelle génération
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                Gérez vos prospects{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                    efficacement
                  </span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-2 left-0 h-3 bg-linear-to-r from-blue-400/30 to-purple-400/30 z-0"
                  />
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Suivez vos commerciaux et vos prospects en temps réel avec une
                plateforme moderne conçue pour optimiser vos performances et
                booster vos résultats.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/(auth)/login">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-bold px-12 py-8 text-lg group shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/50 hover:scale-105"
                  >
                    Accéder à la plateforme
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Illustration 3D moderne */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative"
            >
              {/* Dashboard mockup moderne */}
              <div className="relative">
                {/* Carte principale */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                >
                  {/* Header du dashboard */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="h-3 w-24 bg-linear-to-r from-gray-200 to-gray-100 rounded-full" />
                        <div className="h-2 w-16 bg-gray-100 rounded-full mt-2" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
                    >
                      <div className="h-2 w-12 bg-blue-400 rounded-full mb-3" />
                      <div className="h-6 w-16 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg" />
                    </motion.div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                      className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200"
                    >
                      <div className="h-2 w-12 bg-purple-400 rounded-full mb-3" />
                      <div className="h-6 w-16 bg-linear-to-r from-purple-500 to-purple-600 rounded-lg" />
                    </motion.div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                      className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 border border-emerald-200"
                    >
                      <div className="h-2 w-12 bg-emerald-400 rounded-full mb-3" />
                      <div className="h-6 w-16 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-lg" />
                    </motion.div>
                  </div>

                  {/* Chart area */}
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end justify-between h-32 space-x-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className="flex-1 bg-linear-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-lg"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-6 -right-6 bg-linear-to-br from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>+42% de conversion</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-linear-to-br from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Performant</span>
                </motion.div>
              </div>

              {/* Éléments de décoration flottants */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -left-10 w-24 h-24 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-10 -right-10 w-32 h-32 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225/0.15)_1px,transparent_0)] bg-size-[40px_40px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-600">
                Fonctionnalités
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Tout ce dont vous avez{" "}
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                besoin
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Des fonctionnalités puissantes et intuitives pour booster la
              productivité de votre équipe commerciale
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white overflow-hidden">
                  <CardContent className="p-8 relative">
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 from-blue-500 to-purple-500" />

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300`}
                    >
                      <div className={`bg-linear-to-br ${feature.color} bg-clip-text text-transparent`}>
                        {feature.icon}
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative line */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-1 bg-linear-to-r ${feature.color} rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm border border-blue-100 rounded-full mb-8 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-600">
                  Avantages
                </span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                Pourquoi choisir{" "}
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ProspectsHub
                </span>
                ?
              </h2>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Une solution complète pensée pour les équipes commerciales
                modernes qui veulent performer et atteindre leurs objectifs.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">{benefit.icon}</div>
                    </div>
                    <span className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Mockup d'interface premium */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                {/* Browser controls */}
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-3.5 h-3.5 rounded-full bg-linear-to-br from-red-400 to-red-500 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-linear-to-br from-yellow-400 to-yellow-500 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-linear-to-br from-green-400 to-green-500 shadow-sm" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Header bar */}
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-linear-to-r from-blue-200 via-purple-200 to-blue-200 rounded-lg w-2/3 animate-pulse" />
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl" />
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "from-blue-100 to-blue-50",
                      "from-purple-100 to-purple-50",
                      "from-emerald-100 to-emerald-50",
                    ].map((gradient, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2,
                        }}
                        className={`h-24 bg-linear-to-br ${gradient} rounded-2xl border border-gray-200 shadow-sm`}
                      />
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-end justify-between h-32 space-x-2">
                      {[55, 70, 48, 85, 62, 92, 75, 88].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.3 + i * 0.1,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className="flex-1 bg-linear-to-t from-blue-500 via-purple-500 to-blue-400 rounded-t-xl shadow-lg"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-4">
                    {[75, 90, 65].map((width, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.8 + i * 0.2,
                          duration: 1,
                        }}
                        className="h-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 bg-linear-to-br from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Nouveau</span>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Éléments de décoration animés */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8"
          >
            <Rocket className="w-4 h-4 text-white mr-2" />
            <span className="text-sm font-semibold text-white">
              Commencez maintenant
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
            Prêt à booster vos{" "}
            <span className="relative inline-block">
              <span className="relative z-10">performances</span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-4 bg-yellow-400/40 z-0"
              />
            </span>
            ?
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Rejoignez votre équipe et commencez à gérer vos prospects de manière
            plus efficace dès aujourd&apos;hui. L&apos;excellence commerciale commence ici.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/(auth)/login">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-16 py-8 text-xl group shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl"
              >
                Se connecter maintenant
                <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-3 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Connexion sécurisée</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full" />
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Accès instantané</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full" />
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Support 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-b from-gray-900 to-black text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ProspectsHub</span>
            </motion.div>

            <p className="text-gray-400 mb-6 text-lg">
              La solution CRM pour les équipes commerciales performantes
            </p>

            <div className="h-px w-64 bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6" />

            <p className="text-sm text-gray-500">
              © 2025 KPF Consulting. Tous droits réservés.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Plateforme interne d&apos;agence commerciale
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}