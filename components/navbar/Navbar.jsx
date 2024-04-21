"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminPages, authPages, businessPages, userPages } from "../static";
import { Hidden, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mantine/core";
import Image from "next/image";

const Navbar = () => {
  const [userPagesToRender, setUserPagesToRender] = useState([]);

  useEffect(() => {
    const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
    const role = userDoc.role || null;
    const pages = {
      admin: adminPages,
      business: businessPages,
      user: userPages,
      auth: authPages,
    };
    setUserPagesToRender(pages[role] || authPages);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Link href={userPagesToRender ? "http://courierssydney.com.au" : "/"}>
        <Image
          src={"/logo.png"}
          alt="logo"
          width={150}
          height={150}
          style={{ width: "80%", height: "auto" }}
        />
      </Link>
      <Hidden mdDown>
        <ButtonsSection userPagesToRender={userPagesToRender} />
      </Hidden>
      <Hidden mdUp>
        <MenuSection userPagesToRender={userPagesToRender} />
      </Hidden>
    </nav>
  );
};

export default Navbar;

const ButtonsSection = ({ userPagesToRender }) => (
  <div>
    {userPagesToRender.map((val, ind) => (
      <Link key={ind} href={val.link}>
        <Button variant="light" color="#F14902" style={{ margin: "2px" }}>
          {val.label}
        </Button>
      </Link>
    ))}
  </div>
);

const MenuSection = ({ userPagesToRender }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button variant="light" color="#F14902" onClick={handleMenuOpen}>
        <MenuIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {userPagesToRender.map((val, ind) => (
          <Link style={{ textDecoration: "none" }} key={ind} href={val.link}>
            <MenuItem style={{ color: "grey" }} onClick={handleMenuClose}>
              {val.label}
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </>
  );
};
