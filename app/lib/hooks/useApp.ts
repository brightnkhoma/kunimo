import { useContext } from "react"
import { KunimoContext } from "../context/context"


export const useApp = ()=>{
    const data = useContext(KunimoContext);
    return data;
}