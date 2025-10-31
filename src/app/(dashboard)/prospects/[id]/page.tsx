/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(dashboard)/prospects/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useProspect } from "@/hooks/useProspect";
import { ProspectDetailTabs } from "@/components/prospects/prospect-detail-tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Building, User, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PROSPECT_STATUS_LABEL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProspectDetailPage() {
  const { id } = useParams() as { id: string };
  const { prospect, isLoading, error } = useProspect(id);

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-blue-100 text-blue-800';
      case 'QUALIFIE':
        return 'bg-green-100 text-green-800';
      case 'CONVERTI':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAS_SERIEUX':
        return 'bg-gray-100 text-gray-800';
      case 'PERDU':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le nom à afficher
  const getDisplayName = () => {
    if (prospect?.type === 'ENTREPRISE' && prospect?.companyName) {
      return prospect.companyName;
    }
    return `${prospect?.firstName || ''} ${prospect?.lastName || ''}`.trim() || 'Sans nom';
  };

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (prospect?.type === 'ENTREPRISE' && prospect?.companyName) {
      return prospect.companyName.substring(0, 2).toUpperCase();
    }
    const firstName = prospect?.firstName || '';
    const lastName = prospect?.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <Skeleton className="h-10 w-64 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error || !prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: "#171717" }}>Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error || "Le prospect n'a pas pu être trouvé"}</p>
          <Link href="/prospects">
            <Button style={{ backgroundColor: "#1D4ED8" }} className="text-white">
              Retour à la liste
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: "#F9FAFB" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/prospects">
            <Button variant="ghost" className="mb-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>

          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-2" style={{ backgroundColor: "#1D4ED8" }} />
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-20 w-20 mb-4" style={{ backgroundColor: "#EBF5FF" }}>
                    <AvatarFallback className="text-2xl" style={{ color: "#1D4ED8" }}>
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Link href={`/prospects/${prospect.id}/edit`}>
                      <Button size="sm" style={{ backgroundColor: "#1D4ED8" }} className="text-white">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#171717" }}>
                        {getDisplayName()}
                      </h1>
                      {prospect.type === 'ENTREPRISE' && prospect.contactFirstName && (
                        <p className="text-gray-600">
                          Contact: {prospect.contactFirstName} {prospect.contactLastName}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusBadgeColor(prospect.status)}>
                        {PROSPECT_STATUS_LABEL[prospect.status]}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {prospect.type === 'ENTREPRISE' ? (
                          <Building className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {prospect.type === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{prospect.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{prospect.phone}</span>
                    </div>
                    {prospect.whatsapp && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">WhatsApp: {prospect.whatsapp}</span>
                      </div>
                    )}
                    {prospect.country && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{prospect.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Créé le: {new Date(prospect.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {prospect.assignedTo && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          Assigné à: {prospect.assignedTo.firstName} {prospect.assignedTo.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProspectDetailTabs prospect={prospect} />
        </motion.div>
      </div>
    </motion.div>
  );
}