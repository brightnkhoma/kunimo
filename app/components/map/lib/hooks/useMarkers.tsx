import { useApp } from "@/app/lib/hooks/useApp"
import { LocationMarker } from "../../components/marker";


export const useMarkers = ()=>{
    const {reports} = useApp();

    return <>{reports.map((x,i)=>(<LocationMarker r={x} key={i}/>))}</>
}