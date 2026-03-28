"use client"

import { useApp } from "@/app/lib/hooks/useApp";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const Fly = ()=>{
    const map = useMap();
    const {reports} = useApp();

    useEffect(()=>{
        const r = reports[0];
        if(r){
            map.flyTo([r.coordinates.lat,r.coordinates.long])
        }
    },[reports])

    return null;
}