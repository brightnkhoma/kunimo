import axios from "axios";
import { LoginProps } from "../types/loginProps";
import { resReturn } from "./project";
import { SignUpProps } from "../types/signUpProps";
import { User } from "../types/user";


export class UserManager{

    async login(loginProps : LoginProps){
        const res = await axios.post("/api/user",{...loginProps,type : "login"});
        return resReturn(res)
    }
    async signUp(signUpProps : SignUpProps){
        const res = await axios.post("/api/user",{...signUpProps,type : "signup"});
        return resReturn(res)
    }
    async me(){
        const res = await axios.get("/api/user",{params : {type : "me"}});
        if(resReturn(res)){
            return res.data.user as User;
        }
        return null
    }
    async logout(){
        const res = await axios.delete("/api/user");
        return resReturn(res)
    }

    async isAsdmin(){
          const res = await axios.get("/api/user",{params : {type : "admin"}});
        if(resReturn(res)){
            return res.data.isAdmin as boolean;
        }
        return false 
    }
}