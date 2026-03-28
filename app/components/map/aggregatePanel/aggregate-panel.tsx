"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Layers, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportAggregates } from "@/app/lib/types/report-aggregates"

export const AggregatePanel = () => {
    const { 
        aggregates, 
        onGetAggregates, 
        extractedAggregates, 
        extractAggregate,
        loadingAggregates,
        isExtractingAggregate,
        setComponents,
        components
    } = useApp()
    
    const [expandedAggregates, setExpandedAggregates] = useState<Set<string>>(new Set())

    useEffect(() => {
        onGetAggregates()
    }, [])

    const toggleExpand = (aggregateId: string) => {
        setExpandedAggregates(prev => {
            const newSet = new Set(prev)
            if (newSet.has(aggregateId)) {
                newSet.delete(aggregateId)
            } else {
                newSet.add(aggregateId)
            }
            return newSet
        })
    }

    const handleExtractAggregate = async (aggregateId: string) => {
        await extractAggregate(aggregateId, true)
    }

    const addToSidebar = (reportId: string) => {
        if (components.some(comp => comp.id === reportId)) return
        
        const loadAndAddReport = async () => {
            const report = await useApp().api.report.getReportById(reportId)
            if (report) {
                const SimpleReportCard = () => (
                    <div className="border-b pb-2">
                        <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(report.date).toLocaleDateString()}
                        </p>
                    </div>
                )
                setComponents(prev => [...prev, {
                    id: report.id,
                    node: <SimpleReportCard />
                }])
            }
        }
        loadAndAddReport()
    }

    if (loadingAggregates) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!aggregates || aggregates.length === 0) {
        return (
            <div className="text-center py-6">
                <Layers className="h-5 w-5 text-gray-300 mx-auto mb-1" />
                <p className="text-xs text-gray-400">No clusters</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {aggregates.map((aggregate: ReportAggregates) => {
                const isExpanded = expandedAggregates.has(aggregate.id)
                const isExtracted = extractedAggregates.includes(aggregate.id)
                const isLoading = isExtractingAggregate.aggregateId === aggregate.id && isExtractingAggregate.loading
                const reportCount = aggregate.reports.length
                
                return (
                    <div key={aggregate.id} className=" rounded-lg overflow-hidden">
                        
                        <div 
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleExpand(aggregate.id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                        <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                                    ) : (
                                        <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
                                    )}
                                    <span className="text-xs font-medium truncate">
                                        {aggregate.projectName}
                                    </span>
                                    <span className="text-[10px] text-gray-400 shrink-0">
                                        ({reportCount})
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 ml-5">
                                    <MapPin className="h-2.5 w-2.5 text-gray-400" />
                                    <span className="text-[10px] text-gray-400 truncate">
                                        {aggregate.location.district}
                                        {aggregate.location.area && `, ${aggregate.location.area}`}
                                    </span>
                                </div>
                            </div>
                            
                            {!isExtracted && reportCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleExtractAggregate(aggregate.id)
                                    }}
                                    disabled={isLoading}
                                    className="h-6 px-2 text-[10px] shrink-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        "extract"
                                    )}
                                </Button>
                            )}
                            
                            {isExtracted && (
                                <span className="text-[10px] text-green-600 shrink-0 ml-2">
                                    extracted
                                </span>
                            )}
                        </div>
                        
                        
                        {isExpanded && (
                            <div className="border-t bg-gray-50 p-2 space-y-1">
                                {aggregate.reports.map((reportId, idx) => (
                                    <div 
                                        key={reportId}
                                        className="flex items-center justify-between group cursor-pointer px-2 py-1 hover:bg-white rounded transition-colors"
                                        onClick={() => addToSidebar(reportId)}
                                    >
                                        <span className="text-[10px] font-mono text-gray-500">
                                            {reportId.slice(0, 8)}...
                                        </span>
                                        <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100">
                                            add
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}