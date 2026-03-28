"use client"
import { ReactNode, useEffect, useState } from "react"
import { KunimoContext } from "./lib/context/context"
import { User } from "./lib/types/user";
import { Server } from "./lib/server/server";
import { Report } from "./lib/types/report";
import { ReportAggregates } from "./lib/types/report-aggregates";
import { LatLng } from "leaflet";

const server = new Server();
export const Wrapper = ({children} : {children : ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)
    const [components, setComponents] = useState<{id : string,node : ReactNode}[]>([])
    const [reports, setReports] = useState<Report[]>([]);
    const [aggregates, setAggregates] = useState<ReportAggregates[]>([]);
    const [loadingAggregates, setLoadingAggregates] = useState<boolean>(false);
    const [isExtractingAggregate, setIsExtractingAggregate] = useState<{aggregateId : string,loading : boolean}>({aggregateId : "",loading : false})
    const [extractedAggregates, setExtractedAgregates] = useState<string[]>([])
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [centre, setCentre] = useState<LatLng | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)



    const refresh = async()=>{
        const _user = await server.user.me();
        setUser(_user)
        setIsAuthenticating(false)
    }

    const onCheckIfAdmin = async()=>{
        const check = await server.user.isAsdmin();
        setIsAdmin(check)
    }

    const onGetAggregates = async()=>{
        if(loadingAggregates) return;
        setLoadingAggregates(true);
        const ag = await server.report.getReportAggregates();
        setAggregates(ag);
        setLoadingAggregates(false)


    }

    const extractAggregate = async(id : string,append : boolean)=>{
        if(isExtractingAggregate.aggregateId == id && isExtractingAggregate.loading) return;
        setIsExtractingAggregate({aggregateId : id,loading : true})
        const ag = aggregates.find(x=> x.id == id);
        if(!ag) return;
        const rs = (await Promise.all(ag.reports.map(r=>server.report.getReportById(r)))).filter(r=> r!= null);
        if(append){
            setReports(r=>([...r,...rs]))
        }else(
            setReports(rs)
        )
        if(rs.length > 0){
            setExtractedAgregates(e=>([...new Set([...e,id])]))
            setIsCollapsed(true)
        }
        setIsExtractingAggregate({aggregateId : id,loading : false})
    }


    useEffect(()=>{
        refresh()
        onGetAggregates()
        onCheckIfAdmin()
    },[]);

    useEffect(()=>{
        if(selectedReport){
            setIsCollapsed(false)
        }
    },[selectedReport])


    return(
        <KunimoContext.Provider value={{user,api : server,selectedReport,setSelectedReport,components,setComponents,aggregates,isExtractingAggregate,loadingAggregates,reports,extractAggregate,onGetAggregates,extractedAggregates,isCollapsed,setIsCollapsed,centre,setCentre,isAdmin,isAuthenticating,refresh}}>
            {children}
        </KunimoContext.Provider>
    )

}