import { Route, HashRouter, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ToastProvider } from "./components/Toast";
import { About } from "./pages/About";
import { Analyze } from "./pages/Analyze";
import { Evaluations } from "./pages/Evaluations";
import { Overview } from "./pages/Overview";

export default function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}
