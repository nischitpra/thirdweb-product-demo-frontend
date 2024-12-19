import { Link, useLocation } from "react-router-dom";
import LoginButton from "./LoginButton";
import "./Navbar.scss";

const Nav = ({ className, to, children }) => {
  const { pathname } = useLocation();

  const isActive = pathname == to;
  return (
    <Link className={`${className} ${isActive ? "active" : ""}`} to={to}>
      {children}
    </Link>
  );
};

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-content">
        <div>
          <Nav className="logo" to="/">
            Thirdweb Quests
          </Nav>
          <Nav className="nav" to="/">
            Explore
          </Nav>
          <Nav className="nav" to="/create">
            Create
          </Nav>
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default Navbar;
