import { onGet, onPost, onPut } from "@/app/lib/server/api";
import { NextRequest } from "next/server";


export async function POST(req : NextRequest) {
    const data = await req.json();
    const endPoint = `project`
    return await onPost(endPoint,data,"success")
    
}
export async function PUT(req : NextRequest) {
    const data = await req.json();
    const endPoint = `project`
    return await onPut(endPoint,data,"success")
    
}
export async function GET(req : NextRequest) {
    const onGetOne = async()=>{
        const id = req.nextUrl.searchParams.get("id");
        const endPoint = `project/${id}`;
        return await onGet(endPoint,"project",false);
    }
    
    const onGetAll = async()=>{
        const endPoint = `project`;
        return await onGet(endPoint,"projects",false);
    }
    const type = req.nextUrl.searchParams.get("type") as "all" | "one";
    switch(type){
        case "all": return await onGetAll();
        case "one":return await onGetOne();
    }
    
}