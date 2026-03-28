import { approveReport, createReport, deleteReport, getProjectReports, getReportAggregates, getReportById, removeReport } from "@/app/lib/server/endPoint/report";
import { NextRequest } from "next/server";


export async function POST(req : NextRequest) {
    const data = await req.json();
    const type = data.type as "create" | "approve" | "remove";
    switch(type){
        case "create": return await createReport(data);
        case "approve":return await approveReport(data);
        case "remove": return await removeReport(data);
    } 
}
export async function GET(req : NextRequest) {
const type = req.nextUrl.searchParams.get("type") as "one" | "project" | "aggregates";
switch(type){
    case "one": return await getReportById(req);
    case "project":return await getProjectReports(req);
    case "aggregates": return await getReportAggregates(req);
}

}
export async function DELETE(req : NextRequest) {

return await deleteReport(req);

}