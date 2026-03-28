


export interface Project{
    id : string;
    name : string;
    location : {
        district : string;
        area ? : string;
        physicalAdress : string;
    };
    description : string;
    image ? : string;
    createdAt : string;
    updatedAt ? : string;
    createdBy : string;
    status : "active" | "inactive" | "archives"
}