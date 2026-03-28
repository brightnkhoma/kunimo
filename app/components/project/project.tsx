"use client"

import { useApp } from "@/app/lib/hooks/useApp";
import { showToast } from "@/app/lib/toast/toast";
import { Project } from "@/app/lib/types/project";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, User, FileText, Flag, ArrowLeft, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProjectDetailsPage = () => {
    const { api, isAdmin } = useApp();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadProject = async () => {
        try {
            setLoading(true);
            const _project = await api.project.getProject(projectId);
            setProject(_project);
        } catch (error: any) {
            showToast("error", {
                title: "Error",
                description: error.message || "Failed to load project"
            });
        } finally {
            setLoading(false);
        }
    };

    const goToReports = () => {
        if (!isAdmin) return;
        router.push(`/projects/${projectId}/reports`);
    };

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "text-green-600";
            case "inactive":
                return "text-gray-400";
            case "archives":
                return "text-amber-600";
            default:
                return "text-gray-400";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-sm text-gray-400 mb-3">Project not found</p>
                <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
                    Back to projects
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Back
                </button>

                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h1 className="text-2xl font-medium tracking-tight">
                            {project.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <Button
                                    onClick={goToReports}
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-xs"
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View reports
                                </Button>
                            )}
                            <Button
                                onClick={() => router.push(`/projects/${projectId}/report`)}
                                size="sm"
                                variant="link"
                                className="h-8 px-3 text-xs"
                            >
                                <Flag className="h-3 w-3 mr-1" />
                                Report
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className={cn(
                            "text-xs",
                            getStatusColor(project.status)
                        )}>
                            {project.status === "active" ? "●" : "○"} {project.status}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(project.createdAt)}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location.district}</span>
                        {project.location.area && <span>, {project.location.area}</span>}
                        {project.location.physicalAdress && (
                            <span className="text-xs text-gray-400">({project.location.physicalAdress})</span>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center gap-1 text-xs text-gray-400">
                        <User className="h-3 w-3" />
                        <span>Created by {project.createdBy.slice(0, 8)}...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};