/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, useDeleteUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  MapPin,
  Calendar,
  Loader2,
  Users,
  BookOpen,
  Calculator,
  MessageSquare,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { ROLE_LABEL } from "@/lib/constants";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useUser(userId);

  const deleteUserMutation = useDeleteUser();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    },
    enabled: !!userId,
  });

  const handleDelete = () => {
    if (!user) return;

    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success("Utilisateur supprimé", {
          description: `${user.firstName} ${user.lastName} a été supprimé avec succès.`,
        });
        router.push("/users");
      },
      onError: (error: any) => {
        toast.error("Erreur de suppression", {
          description:
            error?.response?.data?.message ||
            "Impossible de supprimer cet utilisateur.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Utilisateur introuvable
          </h2>
          <p className="text-gray-600 mb-4">
            Cet utilisateur n&apos;existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push("/users")}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive || status === "INACTIVE") {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          Inactif
        </Badge>
      );
    }
    if (status === "DELETED") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-700">
          Supprimé
        </Badge>
      );
    }
    return <Badge className="bg-green-100 text-green-700">Actif</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      DIRECTEUR_GENERAL: "bg-yellow-100 text-yellow-700 border-yellow-200",
      COUNTRY_MANAGER: "bg-purple-100 text-purple-700 border-purple-200",
      SALES_OFFICER: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge variant="outline" className={colors[role] || ""}>
        {ROLE_LABEL[role] || role}
      </Badge>
    );
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const kpiData = [
    {
      title: "Prospects créés",
      value: stats?.createdProspectsCount || 0,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Prospects assignés",
      value: stats?.assignedProspectsCount || 0,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Formations créées",
      value: stats?.createdFormationsCount || 0,
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Simulateurs créés",
      value: stats?.createdSimulateursCount || 0,
      icon: <Calculator className="w-5 h-5 text-orange-600" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Commentaires",
      value: stats?.commentsCount || 0,
      icon: <MessageSquare className="w-5 h-5 text-pink-600" />,
      bgColor: "bg-pink-50",
    },
    {
      title: "Interactions",
      value: stats?.interactionsCount || 0,
      icon: <Activity className="w-5 h-5 text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* User Info */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-3xl shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "Sans nom"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status, user.isActive)}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {user.email}
                  </div>
                  {user.country && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {user.country}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/users/${userId}/edit`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                      {kpi.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {statsLoading ? "-" : kpi.value}
                  </div>
                  <div className="text-xs text-gray-600">{kpi.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-gray-200 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger value="prospects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Prospects créés
              </TabsTrigger>
              <TabsTrigger value="assigned" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Prospects assignés
              </TabsTrigger>
              <TabsTrigger value="formations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Formations
              </TabsTrigger>
              <TabsTrigger value="simulateurs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Simulateurs
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Commentaires
              </TabsTrigger>
              <TabsTrigger value="interactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Interactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Vue d&apos;ensemble</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Informations générales
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Rôle:</span>
                          <p className="font-medium text-gray-900">
                            {ROLE_LABEL[user.role]}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pays:</span>
                          <p className="font-medium text-gray-900">
                            {user.country || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Statut:</span>
                          <div className="mt-1">
                            {getStatusBadge(user.status, user.isActive)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Dernière connexion:</span>
                          <p className="font-medium text-gray-900">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString("fr-FR")
                              : "Jamais"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Mis à jour le:</span>
                          <p className="font-medium text-gray-900">
                            {new Date(user.updatedAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Activité récente
                      </h3>
                      <p className="text-sm text-gray-600">
                        Les données d&apos;activité détaillées seront affichées ici.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prospects">
              <Card>
                <CardHeader>
                  <CardTitle>Prospects créés par cet utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des prospects créés (intégration avec useProspects à
                    faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assigned">
              <Card>
                <CardHeader>
                  <CardTitle>Prospects assignés à cet utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des prospects assignés (intégration avec useProspects à
                    faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="formations">
              <Card>
                <CardHeader>
                  <CardTitle>Formations créées</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des formations (intégration à faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="simulateurs">
              <Card>
                <CardHeader>
                  <CardTitle>Simulateurs créés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des simulateurs (intégration à faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Commentaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des commentaires (intégration à faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interactions">
              <Card>
                <CardHeader>
                  <CardTitle>Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Liste des interactions (intégration à faire)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Supprimer cet utilisateur ?"
        description={`Vous êtes sur le point de supprimer ${user.firstName} ${user.lastName}. Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}