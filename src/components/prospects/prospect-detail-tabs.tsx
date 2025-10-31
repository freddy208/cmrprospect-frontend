/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-detail-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, UserCheck, MessageSquare, GraduationCap, Calculator, Calendar, User, MapPin } from "lucide-react";
import { PROSPECT_STATUS_LABEL, PROSPECT_TYPE_LABEL, LEAD_CHANNEL_LABEL, SERVICE_TYPE_LABEL } from "@/lib/constants";
import { CommentSection } from "@/components/prospects/comment-section";
import { InteractionSection } from "@/components/prospects/interaction-section";
import { ResourceSection } from "@/components/prospects/resource-section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Prospect } from "@/types/prospect";

interface ProspectDetailTabsProps {
  prospect: Prospect;
}

export function ProspectDetailTabs({ prospect }: ProspectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6" style={{ backgroundColor: "#F3F4F6" }}>
          <TabsTrigger 
            value="details" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Détails
          </TabsTrigger>
          <TabsTrigger 
            value="interactions" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Interactions
          </TabsTrigger>
          <TabsTrigger 
            value="comments" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Commentaires
          </TabsTrigger>
          <TabsTrigger 
            value="formation" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Formation
          </TabsTrigger>
          <TabsTrigger 
            value="simulateur" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Simulateur
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Card */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                    <Building className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                    Informations Générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{prospect.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{prospect.phone}</span>
                  </div>
                  {prospect.whatsapp && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">WhatsApp: {prospect.whatsapp}</span>
                    </div>
                  )}
                  {prospect.country && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{prospect.country}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Créé le: {new Date(prospect.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Status Card */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                    <UserCheck className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                    Statut & Assignation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Statut</p>
                    <Badge className={cn(
                      prospect.status === 'NOUVEAU' ? 'bg-blue-100 text-blue-800' :
                      prospect.status === 'QUALIFIE' ? 'bg-green-100 text-green-800' :
                      prospect.status === 'CONVERTI' ? 'bg-yellow-100 text-yellow-800' :
                      prospect.status === 'PAS_SERIEUX' ? 'bg-gray-100 text-gray-800' :
                      prospect.status === 'PERDU' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {PROSPECT_STATUS_LABEL[prospect.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Type</p>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {prospect.type === 'ENTREPRISE' ? (
                        <Building className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {PROSPECT_TYPE_LABEL[prospect.type]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Assigné à</p>
                    <p className="text-sm text-gray-600">
                      {prospect.assignedTo ? `${prospect.assignedTo.firstName} ${prospect.assignedTo.lastName}` : "Non assigné"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Créé par</p>
                    <p className="text-sm text-gray-600">
                      {prospect.createdBy.firstName} {prospect.createdBy.lastName}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Info Card */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                    <GraduationCap className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                    Informations sur le service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Type de service</p>
                    <p className="text-sm text-gray-600">
                      {SERVICE_TYPE_LABEL[prospect.serviceType]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Canal d&apos;acquisition</p>
                    <p className="text-sm text-gray-600">
                      {LEAD_CHANNEL_LABEL[prospect.leadChannel]}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: "#171717" }}>
                    <MessageSquare className="h-5 w-5" style={{ color: "#1D4ED8" }} />
                    Activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Commentaires</p>
                    <p className="text-sm text-gray-600">{prospect._count.comments}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Interactions</p>
                    <p className="text-sm text-gray-600">{prospect._count.interactions}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <InteractionSection prospectId={prospect.id} />
          </motion.div>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CommentSection prospectId={prospect.id} />
          </motion.div>
        </TabsContent>

        {/* Formation Tab */}
        <TabsContent value="formation">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResourceSection
              type="formation"
              resource={prospect.formation}
              prospectId={prospect.id}
            />
          </motion.div>
        </TabsContent>

        {/* Simulateur Tab */}
        <TabsContent value="simulateur">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResourceSection
              type="simulateur"
              resource={prospect.simulateur}
              prospectId={prospect.id}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}