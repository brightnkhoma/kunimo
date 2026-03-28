"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { Project } from "@/app/lib/types/project";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, FileText, Calendar, User, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/app/lib/toast/toast";

const initialProject: Project = {
    id: "",
    name: "",
    location: {
        district: "",
        area: "",
        physicalAdress: ""
    },
    description: "",
    createdAt: "",
    createdBy: "",
    status: "active"
};

export const ProjectCreatePage = () => {
    const { api,user,isAuthenticating, isAdmin } = useApp();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [project, setProject] = useState<Project>(initialProject);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setProject(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof Project] as any,
                    [child]: value
                }
            }));
        } else {
            setProject(prev => ({ ...prev, [name]: value }));
        }
        
        if (error) setError("");
    };

    const validateProject = (): boolean => {
        if (!project.name.trim()) {
            setError("Project name is required");
            return false;
        }
        if (project.name.length < 3) {
            setError("Project name must be at least 3 characters");
            return false;
        }
        if (!project.location.district.trim()) {
            setError("District is required");
            return false;
        }
        if (!(project.location.area || "").trim()) {
            setError("Area is required");
            return false;
        }
        if (!project.description.trim()) {
            setError("Description is required");
            return false;
        }
        if (project.description.length < 20) {
            setError("Please provide a more detailed description (at least 20 characters)");
            return false;
        }
        return true;
    };

    const onCreateProject = async () => {
        if (!validateProject()) return;
        
        setLoading(true);
        setError("");
        
        try {
            const projectId = await api.project.createProject(project);
            if (projectId) {
                router.push(`/projects/${projectId}?created=true`);
            } else {
                setError("Failed to create project. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading && e.target instanceof HTMLInputElement) {
            const form = e.target.form;
            const index = Array.from(form?.elements || []).indexOf(e.target);
            const nextElement = form?.elements[index + 1];
            if (nextElement instanceof HTMLElement) {
                nextElement.focus();
            }
        }
    };

     useEffect(()=>{
            if(!user && !isAuthenticating){
                showToast("info",{title : "Authentication Required", description : "Please Login in First or Create a an Account. It Will Just Take a Few Minutes."});
                router.push("/login")
            }
        },[user])

        if(!isAdmin){
            return null;
        }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link 
                        href="/projects" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to projects
                    </Link>
                    <div className="mt-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Create new project
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Set up a new incident reporting project for your community
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    {error && (
                        <div className="p-6 pb-0">
                            <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Project name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g., Flood Monitoring 2024"
                                value={project.name}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                className="h-11 px-4"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-sm font-medium">Location</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="district" className="text-xs text-muted-foreground">
                                        District
                                    </Label>
                                    <Input
                                        id="district"
                                        name="location.district"
                                        type="text"
                                        placeholder="District name"
                                        value={project.location.district}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="h-10 px-3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-xs text-muted-foreground">
                                        Area
                                    </Label>
                                    <Input
                                        id="area"
                                        name="location.area"
                                        type="text"
                                        placeholder="Area/community"
                                        value={project.location.area}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="h-10 px-3"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="physicalAdress" className="text-xs text-muted-foreground">
                                    Physical address (optional)
                                </Label>
                                <Input
                                    id="physicalAdress"
                                    name="location.physicalAdress"
                                    type="text"
                                    placeholder="Street address, landmark, etc."
                                    value={project.location.physicalAdress}
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                    disabled={loading}
                                    className="h-10 px-3"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the purpose of this project, what incidents will be tracked, and any relevant details..."
                                value={project.description}
                                onChange={handleChange}
                                disabled={loading}
                                className="min-h-[120px] resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                {project.description.length}/500 characters
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="bg-slate-50 rounded-lg p-4 border">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-medium text-muted-foreground">Incident Type</span>
                                </div>
                                <p className="text-sm">Flood, Landslide, Storm, etc.</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <span className="text-xs font-medium text-muted-foreground">Community Based</span>
                                </div>
                                <p className="text-sm">Citizen reports with verification</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50/50 rounded-b-lg">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onCreateProject}
                            disabled={loading || !project.name || !project.location.district || !project.location.area || !project.description}
                            className="min-w-[120px]"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Creating..." : "Create project"}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>
                        Projects help organize incident reports by location and theme.
                        Once created, community members can submit reports to this project.
                    </p>
                </div>
            </div>
        </div>
    );
};