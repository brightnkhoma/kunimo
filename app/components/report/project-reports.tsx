"use client"

import { useState, useEffect } from "react"
import { Report } from "@/app/lib/types/report"
import { useApp } from "@/app/lib/hooks/useApp"
import { useParams, useRouter } from "next/navigation"
import { Project } from "@/app/lib/types/project"
import { showToast } from "@/app/lib/toast/toast"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Calendar, User, CheckCircle, XCircle, Archive, Trash2, ArrowLeft, Eye, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export const ProjectReports = () => {
    const [reports, setReports] = useState<Report[]>([])
    const [filteredReports, setFilteredReports] = useState<Report[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [project, setProject] = useState<Project | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [filter, setFilter] = useState<string>("all")
    const { api } = useApp()
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const onGetReports = async () => {
        try {
            setLoading(true)
            const _reports = await api.report.getProjectReports(id)
            setReports(_reports)
            setFilteredReports(_reports)
        } catch (error) {
            showToast("error", { description: "Failed to load reports" })
        } finally {
            setLoading(false)
        }
    }

    const onGetProject = async () => {
        try {
            const _project = await api.project.getProject(id)
            setProject(_project)
        } catch (error) {
            showToast("error", { description: "Failed to load project" })
        }
    }

    useEffect(() => {
        if (id) {
            onGetProject()
            onGetReports()
        }
    }, [id])

    useEffect(() => {
        if (filter === "all") {
            setFilteredReports(reports)
        } else {
            setFilteredReports(reports.filter(report => report.status === filter))
        }
    }, [filter, reports])

    const onApproveReport = async (reportId: string) => {
        setActionLoading(reportId)
        try {
            const success = await api.report.approve(reportId)
            if (success) {
                showToast("success", { description: "Report approved" })
                onGetReports()
            } else {
                showToast("error", { description: "Failed to approve report" })
            }
        } catch (error) {
            showToast("error", { description: "Something went wrong" })
        } finally {
            setActionLoading(null)
        }
    }

    const onDenyReport = async (reportId: string) => {
        setActionLoading(reportId)
        try {
            const success = await api.report.remove(reportId)
            if (success) {
                showToast("success", { description: "Report denied" })
                onGetReports()
            } else {
                showToast("error", { description: "Failed to deny report" })
            }
        } catch (error) {
            showToast("error", { description: "Something went wrong" })
        } finally {
            setActionLoading(null)
        }
    }

    const onArchiveReport = async (reportId: string) => {
        setActionLoading(reportId)
        try {
            const success = await api.report.remove(reportId)
            if (success) {
                showToast("success", { description: "Report archived" })
                onGetReports()
            } else {
                showToast("error", { description: "Failed to archive report" })
            }
        } catch (error) {
            showToast("error", { description: "Something went wrong" })
        } finally {
            setActionLoading(null)
        }
    }

    const deleteReport = async (reportId: string) => {
        if (!confirm("Are you sure you want to delete this report?")) return
        
        setActionLoading(reportId)
        try {
            const success = await api.report.deleteReport(reportId)
            if (success) {
                showToast("success", { description: "Report deleted" })
                onGetReports()
            } else {
                showToast("error", { description: "Failed to delete report" })
            }
        } catch (error) {
            showToast("error", { description: "Something went wrong" })
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return { color: "text-green-600", label: "Approved", icon: CheckCircle }
            case "denied":
                return { color: "text-red-600", label: "Denied", icon: XCircle }
            case "archived":
                return { color: "text-gray-400", label: "Archived", icon: Archive }
            default:
                return { color: "text-amber-600", label: "Pending", icon: null }
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getFilterCount = (status: string) => {
        if (status === "all") return reports.length
        return reports.filter(r => r.status === status).length
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back
                    </button>
                    <h1 className="text-xl font-medium">Reports</h1>
                    <p className="text-xs text-gray-400 mt-1">
                        {project.name} • {project.location.district}
                        {project.location.area && `, ${project.location.area}`}
                    </p>
                </div>

                <div className="mb-6 border-b">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={cn(
                                "pb-2 text-xs transition-colors",
                                filter === "all" 
                                    ? "text-gray-900 border-b-2 border-gray-900" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            All ({getFilterCount("all")})
                        </button>
                        <button
                            onClick={() => setFilter("pending")}
                            className={cn(
                                "pb-2 text-xs transition-colors",
                                filter === "pending" 
                                    ? "text-amber-600 border-b-2 border-amber-600" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Pending ({getFilterCount("pending")})
                        </button>
                        <button
                            onClick={() => setFilter("approved")}
                            className={cn(
                                "pb-2 text-xs transition-colors",
                                filter === "approved" 
                                    ? "text-green-600 border-b-2 border-green-600" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Approved ({getFilterCount("approved")})
                        </button>
                        <button
                            onClick={() => setFilter("denied")}
                            className={cn(
                                "pb-2 text-xs transition-colors",
                                filter === "denied" 
                                    ? "text-red-600 border-b-2 border-red-600" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Denied ({getFilterCount("denied")})
                        </button>
                        <button
                            onClick={() => setFilter("archived")}
                            className={cn(
                                "pb-2 text-xs transition-colors",
                                filter === "archived" 
                                    ? "text-gray-600 border-b-2 border-gray-600" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Archived ({getFilterCount("archived")})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-400">
                            {filter === "all" 
                                ? "No reports yet" 
                                : `No ${filter} reports`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredReports.map((report) => {
                            const status = getStatusBadge(report.status)
                            const StatusIcon = status.icon
                            
                            return (
                                <div
                                    key={report.id}
                                    className="border-b pb-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={cn("text-xs font-medium", status.color)}>
                                                    {StatusIcon && <StatusIcon className="h-3 w-3 inline mr-1" />}
                                                    {status.label}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(report.date)}
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                                {report.description}
                                            </p>
                                            
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>
                                                        {report.coordinates.lat.toFixed(4)}, {report.coordinates.long.toFixed(4)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{report.userId.slice(0, 8)}...</span>
                                                </div>
                                                {report.images && report.images.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        📷 {report.images.length}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/reports/${report.id}`)}
                                                className="h-7 w-7 p-0"
                                            >
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                            
                                            {report.status === "pending" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onApproveReport(report.id)}
                                                        disabled={actionLoading === report.id}
                                                        className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                                                    >
                                                        {actionLoading === report.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDenyReport(report.id)}
                                                        disabled={actionLoading === report.id}
                                                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                                    >
                                                        {actionLoading === report.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <XCircle className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                            
                                            {report.status === "approved" && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onArchiveReport(report.id)}
                                                    disabled={actionLoading === report.id}
                                                    className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                                                >
                                                    {actionLoading === report.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Archive className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            )}
                                            
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteReport(report.id)}
                                                disabled={actionLoading === report.id}
                                                className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                                            >
                                                {actionLoading === report.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-3 w-3" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}