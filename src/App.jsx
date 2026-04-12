import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JwtContext } from "./jwt-context";
import "./App.css";
import { Header } from "./header/Header";
import { useState } from "react";

function App() {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken"));
  const value = { jwtToken, setJwtToken };

  // check if token is expired
  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const currentDate = new Date();
    const secondsSinceEpoch = currentDate.getTime() / 1000;
    if (secondsSinceEpoch > decoded.exp) {
      console.log("Expired!");
      localStorage.removeItem("jwtToken");
      setJwtToken(null);
    }
  }

  return (
    <JwtContext value={value}>
      <Header />
      <main>
        <Outlet />
      </main>
    </JwtContext>
  );
}

export { App };
