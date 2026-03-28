"use client"

import { useApp } from "@/app/lib/hooks/useApp";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const Center = ()=>{
    const {centre} = useApp();
    const map = useMap();

    useEffect(()=>{
        if(centre){
            map.flyTo(centre)
        }
    },[centre])

    return null;
}