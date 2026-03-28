
import axios, { AxiosResponse } from "axios";
import { Project } from "../types/project";
import { showToast } from "../toast/toast";

export const resReturn = (res: AxiosResponse<any, any, {}> )=>{
    if(!res.data.success){
        showToast("info",{description : res.data.message})
    }
    return res.data.success as boolean;

}
export class AppProject{

    async createProject(project : Project){
        const res = await axios.post("/api/project",{project});
        return resReturn(res);
    }
    async updateProject(_id : string,_updates : Partial<Project>){
        const {id,...updates} = _updates
        const res = await axios.put("/api/project",{id : _id, updates});
        return resReturn(res);
    }
    async getProject(id : string){
        const res = await axios.get("/api/project",{params : {id,type : "one"}});
        if(resReturn(res)){
            return res.data.project as Project
        }
        return null
    }

    async getProjects(){
         const res = await axios.get("/api/project",{params : {type : "all"}});
        if(resReturn(res)){
            return res.data.projects as Project[]
        }
        return []
    }
}