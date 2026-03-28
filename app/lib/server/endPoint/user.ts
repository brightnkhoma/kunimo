import { NextRequest, NextResponse } from "next/server";
import { onGet, onPost } from "../api";
import axios from "axios";
import { mainPath } from "@/constants";

export async function login(data: any) {
  try {

    const res = await axios.post(`${mainPath}/user/login`, data);

    if (res.status === 200) {
      const token = res.data.token;
      if (token) {
        const response = NextResponse.json({ success: true, message:res.data.message || "Login success" });

        response.cookies.set({
            name: "kunimo",
            value: token,
            httpOnly: true,
            secure: false,      
            sameSite: "lax",      
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            });


        return response;
      }
    }

    return NextResponse.json({
      success: false,
      message:res.data.message || "Login Failed, Please make sure credentials are correct",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Login Failed, Something went wrong, please try again later.",
    });
  }
}


export const signUp = async(data : any)=>{
    const endpoint = `user/signup`;
    return await onPost(endpoint,data,"success",false)
}


export const me = async ()=>{
    return await onGet("user/me","user")
}
export const isAdmin = async ()=>{
    return await onGet("user/admin","isAdmin")
}