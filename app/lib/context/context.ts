import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { User } from "../types/user";
import { Server } from "../server/server";
import { Report } from "../types/report";
import { ReportAggregates } from "../types/report-aggregates";
import { LatLng } from "leaflet";

interface kunimoContextProps{
     user: User | null;
     api : Server;
     selectedReport: Report | null;
     setSelectedReport: Dispatch<SetStateAction<Report | null>>;
     components: {
    id: string;
    node: ReactNode;
}[],
setComponents: Dispatch<SetStateAction<{
    id: string;
    node: ReactNode;
}[]>>;
 reports: Report[];
 loadingAggregates: boolean;
 isExtractingAggregate: {
    aggregateId: string;
    loading: boolean;
};
aggregates: ReportAggregates[];
extractAggregate: (id: string, append: boolean) => Promise<void>;
onGetAggregates: () => Promise<void>;
extractedAggregates: string[];
isCollapsed: boolean;
setIsCollapsed: Dispatch<SetStateAction<boolean>>;
 centre: LatLng | null;
 setCentre: Dispatch<SetStateAction<LatLng | null>>;
 isAdmin: boolean;
 isAuthenticating: boolean
 

};

const initialState : kunimoContextProps = {
    user: null,
    api: new Server,
    selectedReport: null,
    setSelectedReport: function (value: SetStateAction<Report | null>): void {
        throw new Error("Function not implemented.");
    },
    components: [],
    setComponents: function (value: SetStateAction<{ id: string; node: ReactNode; }[]>): void {
        throw new Error("Function not implemented.");
    },
    reports: [],
    loadingAggregates: false,
    isExtractingAggregate: {
        aggregateId: "",
        loading: false
    },
    aggregates: [],
    extractAggregate: function (id: string, append: boolean): Promise<void> {
        throw new Error("Function not implemented.");
    },
    onGetAggregates: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    extractedAggregates: [],
    isCollapsed: false,
    setIsCollapsed: function (value: SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
    },
    centre: null,
    setCentre: function (value: SetStateAction<LatLng | null>): void {
        throw new Error("Function not implemented.");
    },
    isAdmin: false,
    isAuthenticating: false
};

const KunimoContext = createContext(initialState);

export {KunimoContext};