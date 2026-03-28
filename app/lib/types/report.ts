import { Project } from "./project";

export interface Report{
    id :string;
    userId : string;
    projectId : string;
    date : string;
    status : "pending" | "approved" | "denied" | "archived";
    description : string;
    images : {
        uri : string;
        description ? : string;
    }[];
    projectLoaction : Project["location"];
    coordinates : {lat : number, long : number}
}