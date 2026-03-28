import { Project } from "./project";

export interface ReportAggregates{
    id : string;
    projectId : string;
    projectName : string;
    location : Project["location"]
    reports : string[];
}