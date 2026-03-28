import { AppProject } from "./project";
import { PeportManager } from "./report";
import { UserManager } from "./user";


export class Server{
    project :AppProject;
    user : UserManager;
    report : PeportManager
    constructor(){
        this.project = new AppProject();
        this.user = new UserManager();
        this.report = new PeportManager();
    }
}