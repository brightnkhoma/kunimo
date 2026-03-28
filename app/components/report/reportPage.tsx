"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { showToast } from "@/app/lib/toast/toast"
import { Project } from "@/app/lib/types/project"
import { Report } from "@/app/lib/types/report"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MapPin, Calendar, ImageIcon, ArrowLeft, Navigation, X } from "lucide-react"

const r: Report = {
    id: "",
    userId: "",
    projectId: "",
    date: "",
    status: "pending",
    description: "",
    images: [],
    projectLoaction: {
        district: "",
        area: "",
        physicalAdress: ""
    },
    coordinates: {
        lat: 0,
        long: 0
    }
}

export const ReportPage = () => {
    const [report, setReport] = useState<Report>(r);
    const { api,user,isAuthenticating } = useApp();
    const [project, setProject] = useState<Project | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [loadingProject, setLoadingProject] = useState<boolean>(false);
    const [isCreatingReport, setIsCreatingReport] = useState<boolean>(false);
    const [gettingLocation, setGettingLocation] = useState<boolean>(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const onGetProject = async () => {
        if (loadingProject) return;
        setLoadingProject(true);
        try {
            const _project = await api.project.getProject(id);
            setProject(_project);
            setReport(prev => ({
                ...prev,
                projectLoaction: _project?.location || {district : "",physicalAdress : ""}
            }));
        } catch (error) {
            showToast("error", { description: "Failed to load project" });
        } finally {
            setLoadingProject(false);
        }
    };

    useEffect(() => {
        if (id) {
            onGetProject();
        }
    }, [id]);

    const getCurrentLocation = () => {
        setGettingLocation(true);
        
        if (!navigator.geolocation) {
            showToast("error", { description: "Geolocation is not supported" });
            setGettingLocation(false);
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setReport(prev => ({
                    ...prev,
                    coordinates: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    }
                }));
                setGettingLocation(false);
                showToast("success", { description: "Location captured" });
            },
            () => {
                showToast("error", { description: "Unable to get location" });
                setGettingLocation(false);
            }
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + imageFiles.length > 5) {
            showToast("error", { description: "Maximum 5 images allowed" });
            return;
        }
        
        setImageFiles(prev => [...prev, ...files]);
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };
    
    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onCreateReport = async () => {
        if (isCreatingReport || !project) return;
        
        if (!report.description.trim()) {
            showToast("error", { description: "Please describe the incident" });
            return;
        }
        
        if (!report.coordinates.lat || !report.coordinates.long) {
            showToast("error", { description: "Please provide your location" });
            return;
        }
        
        setIsCreatingReport(true);
        
        try {
            
            const uploadedImages = [];
            // for (const file of imageFiles) {
            //     const formData = new FormData();
            //     formData.append("image", file);
            //     const uploaded = await api.upload.uploadImage(formData);
            //     uploadedImages.push({ uri: uploaded.url, description: "" });
            // }
            
            const reportData: Report = {
                ...report,
                projectId: id,
                date: new Date().toISOString(),
                images: [],
                status: "pending"
            };
            
            const success = await api.report.report(reportData);
            
            if (success) {
                showToast("success", { 
                    description: "Thank you for contributing to this project, your report has been recorded." 
                });
                router.push(`/projects/${id}`);
            } else {
                showToast("error", { description: "Failed to send report, please try again later." });
            }
        } catch (error) {
            showToast("error", { description: "Something went wrong" });
        } finally {
            setIsCreatingReport(false);
        }
    };


    useEffect(()=>{
        if(!user && !isAuthenticating){
            showToast("info",{title : "Authentication Required", description : "Please Login in First or Create a an Account. It Will Just Take a Few Minutes."});
            router.push("/login")
        }
    },[user])

    if (loadingProject) {
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
                
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back
                    </button>
                    <h1 className="text-xl font-medium">Report incident</h1>
                    <p className="text-xs text-gray-400 mt-1">
                        {project.name} • {project.location.district}
                        {project.location.area && `, ${project.location.area}`}
                    </p>
                </div>

                
                <div className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-medium text-gray-700">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="What happened? When? Any details..."
                            value={report.description}
                            onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                            className="min-h-[100px] text-sm border-gray-200 resize-none"
                        />
                    </div>

                    
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">
                            Location
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Latitude, Longitude"
                                value={report.coordinates.lat ? `${report.coordinates.lat.toFixed(6)}, ${report.coordinates.long.toFixed(6)}` : ""}
                                readOnly
                                className="text-xs font-mono bg-gray-50 border-gray-200"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={gettingLocation}
                                className="h-9 px-3"
                            >
                                {gettingLocation ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Navigation className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400">
                            Click the button to use your current location
                        </p>
                    </div>

                    
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-700">
                            Photos (max 5)
                        </Label>
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={imageFiles.length >= 5}
                                />
                                <div className="border border-dashed border-gray-300 rounded-md p-3 hover:border-gray-400 transition-colors">
                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </label>
                            {imageFiles.length > 0 && (
                                <span className="text-xs text-gray-400">
                                    {imageFiles.length}/5 selected
                                </span>
                            )}
                        </div>
                        
                        
                        {imagePreviews.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-1 -right-1 bg-gray-600 text-white rounded-full p-0.5 hover:bg-gray-700"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    
                    <Button
                        onClick={onCreateReport}
                        disabled={isCreatingReport || !report.description || !report.coordinates.lat}
                        className="w-full mt-4 h-9 text-sm"
                        variant={"outline"}
                    >
                        {isCreatingReport ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {isCreatingReport ? "Submitting..." : "Submit report"}
                    </Button>
                </div>
            </div>
        </div>
    );
}