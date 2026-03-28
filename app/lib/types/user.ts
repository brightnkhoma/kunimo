

export interface User{
    name : string;
    id : string;
    email : string;
    phoneNumber? : string;
    location : UserLocation;
    ip? : string;
    useName : string;
    token ? : string

}


export interface UserLocation{
    district : string;
    area : string;
}




export type PublicUser = Pick<User,"phoneNumber" | "email" | "name" | "location" | "useName">