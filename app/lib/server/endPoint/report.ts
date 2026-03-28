"use server";

import { NextRequest } from "next/server";
import { onDelete, onGet, onPost } from "../api";



export const createReport =async (data : any)=>{
    const endPoint = `report`;
    return await onPost(endPoint,data,"id")
}

export const getProjectReports =async (req : NextRequest)=>{
    const id = req.nextUrl.searchParams.get("id");
    const endPoint = `report/project/${id}`;
    return await onGet(endPoint,"reports")
}
export const getReportById =async (req : NextRequest)=>{
    const id = req.nextUrl.searchParams.get("id");
    const endPoint = `report/one/${id}`;
    return await onGet(endPoint,"report",false)
}
export const getReportAggregates =async (req : NextRequest)=>{
    const endPoint = `report/aggregates`;
    return await onGet(endPoint,"aggregates",false)
}

export const approveReport =async (data : any)=>{
    const endPoint = `report/approve`;
    return await onPost(endPoint,data,"success")
}
export const removeReport =async (data : any)=>{
    const endPoint = `report/remove`;
    return await onPost(endPoint,data,"success")
}

export const deleteReport = async(req : NextRequest) =>{
    const id = req.nextUrl.searchParams.get("id")
    const endPoint = `report/${id}`;
    return await onDelete(endPoint)
}
