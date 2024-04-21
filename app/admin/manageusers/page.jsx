"use client";
import { useState, useEffect } from "react";
import { getCollection } from "@/api/firebase/functions/fetch";
import { Users, Stats, CAP } from "@/components/Index";

export default function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await getCollection("users");
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const [role, setRole] = useState(null);
  useEffect(() => {
    const role = (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(role)
  }, []);

  if (role === null) {
    return <CAP status={"notLoggedIn"} />;
  }

  return (
    <>
      <Stats />
      <Users users={users} />;
    </>
  );
}
