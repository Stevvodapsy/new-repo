import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
} from "./icons/HeroIcons.jsx";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const DwelloLogo = () => (
  <Link to="/" className="flex items-center gap-2">
    <div className="bg-primary p-2 rounded-lg">
      <HomeIcon className="w-6 h-6 text-white" />
    </div>
    <span className="text-2xl font-bold text-primary-dark tracking-tight">
      Dwello
    </span>
  </Link>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-dark text-white"
        : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <DwelloLogo />
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/listings" className={navLinkClasses}>
              <BuildingOffice2Icon className="w-5 h-5" />
              Listings
            </NavLink>
          </nav>
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Get Started
              </NavLink>
            ) : (
              <>
                {(user.profileType === "landlord" ||
                  user.profileType === "agent") && (
                  <NavLink
                    to="/post-listing"
                    className="px-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-md hover:bg-secondary hover:text-white transition-colors"
                  >
                    Post Listing
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/chat"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Chat
                </NavLink>
                <button
                  onClick={() => dispatch(logout())}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-neutral-600 hover:bg-neutral-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/listings" className={navLinkClasses}>
              <BuildingOffice2Icon className="w-5 h-5" />
              Listings
            </NavLink>
          </div>
          <div className="py-4 px-2 border-t border-neutral-200 flex flex-col space-y-2">
            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Get Started
              </NavLink>
            ) : (
              <>
                {(user.profileType === "landlord" ||
                  user.profileType === "agent") && (
                  <NavLink
                    to="/post-listing"
                    className="w-full px-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-md hover:bg-secondary hover:text-white transition-colors"
                  >
                    Post Listing
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className="w-full px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/chat"
                  className="w-full px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  Chat
                </NavLink>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    dispatch(logout());
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
