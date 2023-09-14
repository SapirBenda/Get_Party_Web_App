import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "../../Pages/Profile/Profile";
import AddEvent from "../../Pages/Event/AddEvent";
import UpdateEvent from "../../Pages/Event/UpdateEvent";
import Event from "../../Pages/Event/Event";
import Home from "../../Pages/Home/Home";
import SearchResult from "../../Pages/Home/SearchResult";
import ProductionProfile from "../../Pages/Profile/ProductionProfile";
import SignUp from "../Register/SignUp";
import SignIn from "../Register/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { getMusicTypes, getPlaceTypes, getProductions, getRegions } from "../Fetches/StaticFetch";

// if user is not logged in he can't access Proteced Routes, when trying to access this route they will be navigated to the Home page. 
export default function AppRoutes() {

  useQuery({
    queryKey: ["placeTypes"],
    queryFn: getPlaceTypes,
    placeholderData: [],
    staleTime: Infinity
  });
  useQuery({
    queryKey: ["musicTypes"],
    queryFn: getMusicTypes,
    placeholderData: [],
    staleTime: Infinity
  });
  useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
    placeholderData: [],
    staleTime: Infinity
  });
  useQuery({
    queryKey: ["allProductions"],
    queryFn: getProductions,
    placeholderData: [],
    staleTime: 300000
  });

  return (
    <Routes>
      <Route path={"/"} element={<Home />}></Route>
      <Route
        path={"/SearchResult/:searchData"}
        element={<SearchResult />}
      ></Route>
      <Route path={"/Profile/:userId"} element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
      <Route path={"/AddEvent"} element={<ProtectedRoute><AddEvent /></ProtectedRoute>}></Route>
      <Route path={"/Event/:event_id"} element={<Event />}></Route>
      <Route path={"/UpdateEvent/:event_id"} element={<ProtectedRoute><UpdateEvent /></ProtectedRoute>}></Route>
      <Route path={"/SignUp"} element={<SignUp />}></Route>
      <Route path={"/SignIn"} element={<SignIn />}></Route>
      <Route path={"/SignOut"} element={<Home />}></Route>
      <Route
        path={"/ProductionProfile/:production_id"}
        element={<ProductionProfile />}
      ></Route>
    </Routes>
  );
}
