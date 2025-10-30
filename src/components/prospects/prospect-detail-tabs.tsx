/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/prospects/prospect-detail-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, UserCheck, MessageSquare, GraduationCap, Calculator } from "lucide-react";
import { PROSPECT_STATUS_LABEL, PROSPECT_TYPE_LABEL } from "@/lib/constants";
import { CommentSection } from "@/components/prospects/comment-section";
import { InteractionSection } from "@/components/prospects/interaction-section";
import { ResourceSection } from "@/components/prospects/resource-section";
import { cn } from "@/lib/utils";

interface ProspectDetailTabsProps {
  prospect: any; // Use the full Prospect type
}

export function ProspectDetailTabs({ prospect }: ProspectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="details">Détails</TabsTrigger>
        <TabsTrigger value="interactions">Interactions</TabsTrigger>
        <TabsTrigger value="comments">Commentaires</TabsTrigger>
        <TabsTrigger value="formation">Formation</TabsTrigger>
        <TabsTrigger value="simulateur">Simulateur</TabsTrigger>
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{prospect.companyName || prospect.firstName} {prospect.lastName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{prospect.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{prospect.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={prospect.status === 'CONVERTI' ? 'default' : 'secondary'}>
                  {PROSPECT_STATUS_LABEL[prospect.status]}
                </Badge>
                <Badge variant="outline">{PROSPECT_TYPE_LABEL[prospect.type]}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statut & Assignation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Assigné à</p>
                <p className="text-sm text-muted-foreground">
                  {prospect.assignedTo ? `${prospect.assignedTo.firstName} ${prospect.assignedTo.lastName}` : "Non assigné"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Créé par</p>
                <p className="text-sm text-muted-foreground">
                  {prospect.createdBy.firstName} {prospect.createdBy.lastName}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Interactions Tab */}
      <TabsContent value="interactions">
        <InteractionSection prospectId={prospect.id} />
      </TabsContent>

      {/* Comments Tab */}
      <TabsContent value="comments">
        <CommentSection prospectId={prospect.id} />
      </TabsContent>

      {/* Formation Tab */}
      <TabsContent value="formation">
        <ResourceSection
          type="formation"
          resource={prospect.formation}
          prospectId={prospect.id}
        />
      </TabsContent>

      {/* Simulateur Tab */}
      <TabsContent value="simulateur">
        <ResourceSection
          type="simulateur"
          resource={prospect.simulateur}
          prospectId={prospect.id}
        />
      </TabsContent>
    </Tabs>
  );
}