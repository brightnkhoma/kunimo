"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const MapSideBar = () => {
  const { components, setComponents ,isCollapsed,setIsCollapsed} = useApp();
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  useEffect(() => {
    if (isMobile && components.length === 0) {
      setIsCollapsed(true);
    }
  }, [isMobile, components.length]);

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
  };

  const clearAllComponents = () => {
    setComponents([]);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-50 bg-white border rounded-r-lg shadow-md p-2 hover:bg-accent transition-all duration-300",
          isCollapsed ? "left-0 top-1/2 -translate-y-1/2" : "left-96 top-1/2 -translate-y-1/2",
          isMobile && !isCollapsed && "hidden"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      
      <div
        className={cn(
          "h-full bg-white border-r shadow-sm flex flex-col transition-all duration-300 z-40",
          isCollapsed ? "w-0 overflow-hidden border-r-0" : "w-80 md:w-96",
          isMobile && !isCollapsed && "fixed inset-y-0 left-0 z-50 shadow-2xl"
        )}
      >
        
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">
            Details
          </h2>
          <div className="flex items-center gap-2">
            {components.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllComponents}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
            
            {isMobile && !isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-sm">No details selected</p>
                <p className="text-xs">Click on a marker to view report details</p>
              </div>
            ) : (
              components.map((component) => (
                <div
                  key={component.id}
                  className="relative group"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => removeComponent(component.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {component.node}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};