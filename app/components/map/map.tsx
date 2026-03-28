"use client"

import { useApp } from "@/app/lib/hooks/useApp";
import { BaseMap } from "./basemap/mapWrapper";
import { MapSideBar } from "./components/ui/mapSideBar";
import { tileLayers } from "./lib/tilelayers";
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";
import { AggregatePanel } from "./aggregatePanel/aggregate-panel";
import { ReportPanel } from "./reportPanel.tsx/reportPanel";

export const MapPage = () => {
  const {setComponents,components,selectedReport} = useApp();

  useEffect(()=>{
    const cmt = [{id : "ag",node : <AggregatePanel/>},...components]
    const ids = [... new Set(cmt.map(i=>i.id))];
    const y = ids.map(i=> cmt.find(z=> z.id == i)).filter(x=> x != null);
    setComponents(y)
  },[])

  useEffect(()=>{
    if(!selectedReport) return;
    const cmt = [{id : "rp",node : <ReportPanel report={selectedReport}/>},...components]
    const ids = [... new Set(cmt.map(i=>i.id))];
    const y = ids.map(i=> cmt.find(z=> z.id == i)).filter(x=> x != null);
    setComponents(y)
  },[selectedReport])
  return (
<div className="h-[100dvh] w-full flex flex-row">
  <MapSideBar />
  {/* <div className="flex-1 h-full"> */}
    <BaseMap
      center={[51.505, -0.09]}
      zoom={13}
      tileLayers={tileLayers}
    />
  {/* </div> */}
</div>
  );
};

export default MapPage;