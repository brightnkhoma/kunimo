"use client"
import dynamic from "next/dynamic";

const MapPage = dynamic(()=>import("./components/map/map").then(mod => mod.MapPage))
export default function Page (){

    return(
        <MapPage/>
    )



}