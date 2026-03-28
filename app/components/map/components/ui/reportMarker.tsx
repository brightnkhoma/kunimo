import { Report } from "@/app/lib/types/report"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useApp } from "@/app/lib/hooks/useApp";

const ReportCard: React.FC<Report> = ({
  coordinates,
  date,
  description,
  id,
  images,
  projectLoaction,
  status,
  userId,
  projectId
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const {setSelectedReport} = useApp();

  const getStatusLabel = () => {
    switch (status) {
      case "approved": return "Approved";
      case "denied": return "Denied";
      case "pending": return "Pending";
      case "archived": return "Archived";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="absolute w-[20rem] bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-4 md:w-80">
      <Card className="rounded-xl shadow-2xl border-0 overflow-hidden">
        
        {images && images.length > 0 && (
          <div 
            className="relative h-40 cursor-pointer"
            onClick={() => setSelectedImage(0)}
          >
            <Image
              src={images[0].uri}
              alt=""
              fill
              className="object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                +{images.length - 1}
              </div>
            )}
          </div>
        )}

        <CardContent className="p-3 space-y-2">
          
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-sm">
                Report
              </h3>
              <p className="text-xs text-muted-foreground">
                {projectLoaction.district}, {projectLoaction.area}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-xs font-normal"
            >
              {getStatusLabel()}
            </Badge>
          </div>

          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{coordinates.lat.toFixed(4)}, {coordinates.long.toFixed(4)}</span>
            </div>
          </div>

          
          <div className="flex gap-2 pt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 h-8 text-xs"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('centerMap', { 
                  detail: { lat: coordinates.lat, lng: coordinates.long } 
                }));
              }}
            >
              <MapPin className="w-3 h-3 mr-1" />
              Directions
            </Button>
            <Button 
              onClick={()=> setSelectedReport({coordinates,date,description,id,images,projectId ,projectLoaction,status,userId})}
              size="sm" 
              className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
            >
              More info
            </Button>
          </div>
        </CardContent>
      </Card>

      
      {selectedImage !== null && images && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-5xl">
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10 hover:bg-black/70 transition"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage].uri}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            
            
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2">
                <div className="flex gap-2 justify-center">
                  {images.map((image, idx) => (
                    <button
                      key={idx}
                      className={`relative w-12 h-12 rounded-md overflow-hidden border-2 transition ${
                        idx === selectedImage ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(idx);
                      }}
                    >
                      <Image
                        src={image.uri}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCard;