"use client";

import dynamic from "next/dynamic";

// Client-only: the app uses localStorage, so skip server rendering
// (behaves exactly like the Vite SPA).
const App = dynamic(() => import("../crm/App"), { ssr: false });

export default function Page() {
  return <App />;
}
