/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/profile/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MapPin,
  Calendar,
  Shield,
  Users,
  FileText,
  BarChart3,
  Activity,
  Edit,
  ArrowLeft
} from "lucide-react";
import { UserDetailsDialog } from "@/components/users/UserDetailsDialog";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { USER_STATUS_LABEL, ROLE_LABEL } from "@/lib/constants";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { getUserStats } from "@/lib/api"; // Import direct de la fonction API

interface UserStats {
  prospectsCreated: number;
  prospectsAssigned: number;
  formationsCreated: number;
  simulateursCreated: number;
  commentsCreated: number;
  interactionsCreated: number;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { getById } = useUsers(); // On ne récupère que getById
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false); // État de chargement pour les statistiques
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const userData = await getById(params.id as string);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, getById]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!params.id) return;
      
      setIsLoadingStats(true);
      try {
        // Utilisation directe de l'API pour récupérer les statistiques
        const stats = await getUserStats(params.id as string);
        setUserStats(stats);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de l'utilisateur:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [params.id]);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityLevel = () => {
    if (!userStats) return 0;
    const total = userStats.prospectsCreated + userStats.prospectsAssigned + 
                  userStats.formationsCreated + userStats.simulateursCreated + 
                  userStats.commentsCreated + userStats.interactionsCreated;
    return Math.min(total / 10, 100); // Normaliser à 100%
  };

  const handleEditProfile = () => {
    router.push(`/users/profile/${params.id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Utilisateur non trouvé.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="space-y-6" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
            {isOwnProfile ? "Mon profil" : `Profil de ${user.firstName} ${user.lastName}`}
          </h1>
          {isOwnProfile && (
            <Button
              onClick={handleEditProfile}
              className="flex items-center gap-1 ml-auto"
              style={{ backgroundColor: "#1D4ED8" }}
            >
              <Edit className="h-4 w-4" />
              Modifier mon profil
            </Button>
          )}
        </div>

        {/* Informations générales */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#1D4ED8" }}>
              <Users className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={user.firstName || user.lastName} />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xl font-medium">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold" style={{ color: "#171717" }}>
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {ROLE_LABEL[user.role.name] || user.role.name}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {USER_STATUS_LABEL[user.status]}
                  </Badge>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  {user.country && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.country}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Créé le {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dernière connexion le {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#1D4ED8" }}>
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              Permissions accordées à l&apos;utilisateur via son rôle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.role?.id && user.role?.name ? (
                <Badge key={user.role.id} variant="outline">
                  {user.role.name}
                </Badge>
              ) : (
                "Non spécifié"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#1D4ED8" }}>
                  <BarChart3 className="h-5 w-5" />
                  Statistiques générales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userStats ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Niveau d&apos;activité</span>
                        <span>{Math.round(getActivityLevel())}%</span>
                      </div>
                      <Progress value={getActivityLevel()} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Prospects créés</p>
                            <p className="text-2xl font-bold text-blue-900">{userStats.prospectsCreated}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Prospects assignés</p>
                            <p className="text-2xl font-bold text-green-900">{userStats.prospectsAssigned}</p>
                          </div>
                          <Users className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Interactions</p>
                            <p className="text-2xl font-bold text-purple-900">{userStats.interactionsCreated}</p>
                          </div>
                          <Activity className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Impossible de charger les statistiques
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#1D4ED8" }}>
                  <Users className="h-5 w-5" />
                  Statistiques des prospects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Prospects créés</p>
                          <p className="text-2xl font-bold text-blue-900">{userStats.prospectsCreated}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Prospects assignés</p>
                          <p className="text-2xl font-bold text-green-900">{userStats.prospectsAssigned}</p>
                        </div>
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Impossible de charger les statistiques
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#1D4ED8" }}>
                  <FileText className="h-5 w-5" />
                  Contenu créé
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Formations créées</p>
                          <p className="text-2xl font-bold text-blue-900">{userStats.formationsCreated}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Simulateurs créés</p>
                          <p className="text-2xl font-bold text-green-900">{userStats.simulateursCreated}</p>
                        </div>
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Commentaires</p>
                          <p className="text-2xl font-bold text-purple-900">{userStats.commentsCreated}</p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Impossible de charger les statistiques
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Bouton pour remonter en haut */}
      <ScrollToTop />
    </div>
  );
}