import React from "react";
import {
  PlusCircleFill,
  BarChartFill,
  Basket2,
  FilePerson,
  Shop,
  HouseFill,
} from "react-bootstrap-icons";

export const SideNavBarData = [
  {
    title: "Home",
    icon: <HouseFill />,
    link: "/#",
  },
  {
    title: "Orders",
    icon: <Basket2 />,
    link: "/orders",
  },
  {
    title: "Items",
    icon: <Shop />,
    link: "/items",
  },
  {
    title: "Users",
    icon: <FilePerson />,
    link: "/users",
  },
  {
    title: "Statistics",
    icon: <BarChartFill />,
    link: "/stats",
  },
  {
    title: "Create Item",
    icon: <PlusCircleFill />,
    link: "/create_item",
  },
];
