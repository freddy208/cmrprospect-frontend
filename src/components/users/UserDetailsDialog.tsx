// src/components/users/UserDetailsDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  UserCheck,
  Users,
  FileText,
  BarChart3,
  Activity,
  Clock,
} from "lucide-react";
import { User } from "@/types/user";
import { USER_STATUS_LABEL, ROLE_LABEL } from "@/lib/constants";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface UserStats {
  prospectsCreated: number;
  prospectsAssigned: number;
  formationsCreated: number;
  simulateursCreated: number;
  commentsCreated: number;
  interactionsCreated: number;
}

export function UserDetailsDialog({ isOpen, onClose, user }: UserDetailsDialogProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      setIsLoadingStats(true);
      try {
        // Remplacer par votre fonction API réelle
        // const stats = await getUserStats(user.id);
        // setUserStats(stats);

        // Données de démonstration
        setUserStats({
          prospectsCreated: 12,
          prospectsAssigned: 8,
          formationsCreated: 3,
          simulateursCreated: 2,
          commentsCreated: 24,
          interactionsCreated: 36
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de l'utilisateur:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (isOpen && user) {
      fetchUserStats();
    }
  }, [isOpen, user]);

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

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ color: "#171717" }}>
                  Détails de &apos;l&apos;utilisateur
                </DialogTitle>
              </DialogHeader> `

              <div className="space-y-6">
                {/* Informations générales */}
                <Card className="border-gray-200 shadow-sm">
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
                          {getInitials(user.lastName, user.firstName || '')}
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
                              <Clock className="h-4 w-4 mr-2" />
                              Dernière connexion le {new Date(user.lastLogin).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Permissions */}
                <Card className="border-gray-200 shadow-sm">
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
                      {user.role.permissions.map((permission) => (
                        <Badge key={permission.id} variant="outline">
                          {permission.name}
                        </Badge>
                      ))}
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
                                  <UserCheck className="h-8 w-8 text-green-600" />
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
                                <UserCheck className="h-8 w-8 text-green-600" />
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
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}