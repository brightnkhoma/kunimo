import axios from "axios";
import { Report } from "../types/report";
import { resReturn } from "./project";
import { ReportAggregates } from "../types/report-aggregates";

export class PeportManager{
    async report(report : Report){
        const res = await axios.post("/api/report",{report,type : "create"});
        return resReturn(res);
    }

    async approve(id : string){
        const res = await axios.post("/api/report",{id,type : "approve"});
        return resReturn(res)
    }
    async remove(id : string){
        const res = await axios.post("/api/report",{id,type : "remove"});
        return resReturn(res)
    }
    async deleteReport(id : string){
        const res = await axios.delete("/api/report",{params : {id}});
        return resReturn(res)
    }
    async getProjectReports(id : string){
        const res = await axios.get("/api/report",{params : {id,type : "project"}});
        if(resReturn(res)){
            return res.data.reports as Report[];
        }
        return [];
    }
    async getReportById(id : string){
        const res = await axios.get("/api/report",{params : {id,type : "one"}});
        if(resReturn(res)){
            return res.data.report as Report;
        }
        return null;
    }
    async getReportAggregates(){
        const res = await axios.get("/api/report",{params : {type : "aggregates"}});
        if(resReturn(res)){
            return res.data.aggregates as ReportAggregates[];
        }
        return [];
    }


}