
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from "./contexts/ContextProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <ContextProvider>
            <GoogleOAuthProvider clientId='226721375496-asc09j02mev55c2a02ls7a3d36age8mq.apps.googleusercontent.com'>
                <App />
            </GoogleOAuthProvider >
        </ContextProvider>
    </BrowserRouter >
);

