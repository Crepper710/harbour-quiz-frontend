import {createContext} from "react";

export type LobbyInfo = {
    id: string,
    name: string,
};

export const LobbyContext = createContext<LobbyInfo | undefined>(undefined);