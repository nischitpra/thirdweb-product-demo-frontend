import { Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import "./App.scss";
import CreateCommunity from "./pages/CreateCommunity";

const AppProvider = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="App-content">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<AppProvider />}>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/create" element={<CreateCommunity />}></Route>
        <Route path="/:communityAddress" element={<Community />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
