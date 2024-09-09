import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <div>
            <App />
            <Toaster position="top-center" richColors />
        </div>
    </StrictMode>,
)
