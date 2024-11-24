import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./pages/HeroPage";
import LoginUser from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/HomePage";
import ScanCrop from "./pages/ScanCrop";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Lost from "./pages/Lost";
import Feed from "./pages/Feed";
import Diseases from "./pages/Diseases";

const App = () => {
  return (
    <div className="flex bg-crop h-screen w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage></HeroPage>}></Route>
          <Route path="/login" element={<LoginUser></LoginUser>}></Route>
          <Route
            path="/register"
            element={<RegisterPage></RegisterPage>}
          ></Route>
          <Route path="/home" element={<HomePage></HomePage>}></Route>
          <Route path="/scanCrop" element={<ScanCrop></ScanCrop>}></Route>
          <Route path="/posts" element={<Dashboard></Dashboard>}></Route>
          <Route path="/chat" element={<Chat></Chat>}></Route>
          <Route path="/feed" element={<Feed></Feed>}></Route>
          <Route path="/diseases" element={<Diseases></Diseases>}></Route>

          <Route path="/*" element={<Lost></Lost>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
