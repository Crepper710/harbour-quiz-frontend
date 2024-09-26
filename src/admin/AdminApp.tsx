import {NavBar} from "../common/NavBar.tsx";
import {Login} from "./Login.tsx";
import {AuthContext} from "./AuthContext.ts";
import {useState} from "react";

export function AdminApp() {
    const [token, setToken] = useState<string>();

    return (
        <AuthContext.Provider value={token}>
            <NavBar currentPage="admin"/>
            <Login setToken={setToken}/>
        </AuthContext.Provider>
    )
}