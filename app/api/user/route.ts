import { isAdmin, login,me,signUp } from "@/app/lib/server/endPoint/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function  POST(req : NextRequest) {
    const data = await req.json();
    const type = data.type as "login" | "signup";
    switch(type){
        case "login": return await login(data);
        case "signup": return await signUp(data);
    }
    
}
export async function  GET(req : NextRequest) {
    const type = req.nextUrl.searchParams.get("type") as "admin" | "me";
    switch(type){
        case "admin": return await isAdmin();
        case "me": return await me()
    }
       
}
export async function  DELETE(req : NextRequest) {
    (await cookies()).delete("kunimo");
    return NextResponse.json({success : true})
       
}