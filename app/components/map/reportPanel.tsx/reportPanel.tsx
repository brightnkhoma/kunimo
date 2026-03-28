"use client"

import { Report } from "@/app/lib/types/report"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Calendar, 
  User, 
  ImageIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Archive,
  Navigation,
  Copy,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { showToast } from "@/app/lib/toast/toast"
import { useApp } from "@/app/lib/hooks/useApp"
import { LatLng } from "leaflet"

export const ReportPanel = ({ report }: { report: Report }) => {
  const [copied, setCopied] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const {setCentre} = useApp()

  const getStatusConfig = () => {
    switch (report.status) {
      case "approved":
        return {
          color: "text-green-600",
          bg: "bg-green-50",
          icon: CheckCircle,
          label: "Approved"
        }
      case "denied":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          icon: XCircle,
          label: "Denied"
        }
      case "pending":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          icon: Clock,
          label: "Pending"
        }
      case "archived":
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          icon: Archive,
          label: "Archived"
        }
      default:
        return {
          color: "text-gray-500",
          bg: "bg-gray-50",
          icon: Clock,
          label: report.status
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCoordinates = (lat: number, long: number) => {
    const latDir = lat >= 0 ? 'N' : 'S'
    const longDir = long >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(long).toFixed(6)}° ${longDir}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    showToast("success", { description: "Coordinates copied" })
    setTimeout(() => setCopied(false), 2000)
  }

  const centerMap = () => {
    const {lat,long} = report.coordinates;
    const coords : any = [lat,long];
    setCentre(coords)
  }

  return (
    <div className="space-y-4">
      
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-medium", statusConfig.color)}>
              <StatusIcon className="h-3 w-3 inline mr-1" />
              {statusConfig.label}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              #{report.id.slice(0, 8)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(report.date)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={centerMap}
          className="h-7 px-2"
        >
          <Navigation className="h-3 w-3 mr-1" />
          Center
        </Button>
      </div>

      
      <div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {report.description}
        </p>
      </div>

      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>Location</span>
        </div>
        <div className="bg-gray-50 rounded p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-600">
              {formatCoordinates(report.coordinates.lat, report.coordinates.long)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(`${report.coordinates.lat}, ${report.coordinates.long}`)}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            {report.projectLoaction.district}
            {report.projectLoaction.area && `, ${report.projectLoaction.area}`}
          </p>
        </div>
      </div>

      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <User className="h-3 w-3" />
        <span>Reported by: {report.userId.slice(0, 8)}...{report.userId.slice(-4)}</span>
      </div>

      
      {report.images && report.images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ImageIcon className="h-3 w-3" />
            <span>Photos ({report.images.length})</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {report.images.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square cursor-pointer rounded border overflow-hidden hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image.uri}
                  alt={image.description || `Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
                    {image.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          {report.images.length > 6 && (
            <p className="text-[10px] text-gray-400 text-center">
              +{report.images.length - 6} more photos
            </p>
          )}
        </div>
      )}

      
      {selectedImage !== null && report.images[selectedImage] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={report.images[selectedImage].uri}
              alt={report.images[selectedImage].description || `Photo ${selectedImage + 1}`}
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            {report.images[selectedImage].description && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 py-2 text-sm">
                {report.images[selectedImage].description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}