import '../common/index.css'
import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {AdminApp} from "./AdminApp.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AdminApp />
    </StrictMode>
)