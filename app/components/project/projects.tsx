"use client"

import { useApp } from "@/app/lib/hooks/useApp";
import { showToast } from "@/app/lib/toast/toast";
import { Project } from "@/app/lib/types/project"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, MapPin, Calendar, FolderOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProjectsPage = () => {
    const { api,isAdmin } = useApp();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const router = useRouter();

    const onClickProject = (projectId: string) => {
        router.push(`/projects/${projectId}`);
    };

    const onLoadProjects = async () => {
        try {
            if (loading) return;
            setLoading(true);
            const _projects = await api.project.getProjects();
            setProjects(_projects);
            setFilteredProjects(_projects);
        } catch (error: any) {
            console.log(error);
            showToast("error", {
                title: "Error",
                description: error.message || "Something went wrong while trying to fetch projects."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        onLoadProjects();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProjects(projects);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = projects.filter(project =>
                project.name.toLowerCase().includes(query) ||
                project.location.district.toLowerCase().includes(query) ||
                (project.location.area && project.location.area.toLowerCase().includes(query))
            );
            setFilteredProjects(filtered);
        }
    }, [searchQuery, projects]);

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
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6 pb-2 border-b">
                    <div>
                        <h1 className="text-lg font-medium">
                            Projects
                        </h1>
                    </div>
                   { isAdmin && <Button
                        onClick={() => router.push("/project")}
                        variant="ghost"
                        size="sm"
                        className="h-8"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        New
                    </Button>}
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-6 ml-8 h-8 border-0 border-b rounded-none px-0 text-sm focus-visible:ring-0 focus-visible:border-b-2"
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <FolderOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                            {searchQuery ? "No projects found" : "No projects"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => onClickProject(project.id)}
                                className="py-3 cursor-pointer hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium truncate">
                                                {project.name}
                                            </span>
                                            <span className={cn(
                                                "text-xs",
                                                getStatusColor(project.status)
                                            )}>
                                                {project.status === "active" ? "●" : "○"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {project.location.district}
                                                {project.location.area && `, ${project.location.area}`}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(project.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-gray-300 group-hover:text-gray-400">
                                        →
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};