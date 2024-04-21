"use client";
import PlaceBookingIcon from "@mui/icons-material/Place";
import { Text, Container, ThemeIcon, SimpleGrid } from "@mantine/core";
import classes from "./ClientServices.module.css";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import { logout } from "@/api/firebase/functions/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrackBookingIcon from "@mui/icons-material/TrackChanges";
import JobInquiryIcon from "@mui/icons-material/Help";
import PriceJobIcon from "@mui/icons-material/MonetizationOn";
import AddressesIcon from "@mui/icons-material/LocationOn";
import InvoicesIcon from "@mui/icons-material/Receipt";

export default function ClientServices() {
  const router = useRouter();
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
    const role = userDoc.role || null;
    setUserRole(role);
  }, []);

  const logoutUser = async () => {
    await logout();
    router.push(`/Signin`);
  };

  const clientServicesLinks = [
    {
      title: "Price The Job",
      description: "Place a Booking",
      link: "/PriceTheJob",
      icon: <PriceJobIcon />,
    },
    {
      title: "Track Booking",
      description: "Track your recent bookings",
      link: "/TrackBooking",
      icon: <TrackBookingIcon />,
    },
    userRole === "business" || userRole === "admin"
      ? {
          title: "Place Booking",
          description: "Price a booking",
          link: "/PlaceTheBooking",
          icon: <PlaceBookingIcon />,
        }
      : {},
    {
      title: "Invoices",
      description: "View invoices",
      link: "/RecentInvoices",
      icon: <InvoicesIcon />,
    },
    {
      title: "Addresses",
      description: "Manage frequent addresses",
      link: "/FrequentAddresses",
      icon: <AddressesIcon />,
    },
    {
      title: "Logout",
      description: "Log Out",
      link: "#",
      icon: <LogoutIcon />,
      logout: true,
    },
    {
      title: "Job Inquiry",
      description: "Enquire on a specific booking",
      link: "/JobInquiry",
      icon: <JobInquiryIcon />,
    },
  ];

  const items = clientServicesLinks.map((item, index) => (
    <Link
      href={item?.link || "/"}
      key={index}
      onClick={() => (item?.logout ? logoutUser() : null)}
      passHref
      style={{ textDecoration: "none" }}
    >
      <div className={`${classes.item} ${classes.link}`}>
        <ThemeIcon
          variant="light"
          color="#F14902"
          className={classes.itemIcon}
          size={60}
          radius="md"
        >
          {item?.icon}
        </ThemeIcon>

        <div>
          <Text
            fw={700}
            fz="lg"
            style={{ color: "black" }}
            className={classes.itemTitle}
          >
            {item?.title}
          </Text>
          <Text c="dimmed">{item?.description}</Text>
        </div>
      </div>
    </Link>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Client Services</Text>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
