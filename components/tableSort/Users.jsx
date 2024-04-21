"use client";
import { useEffect, useState } from "react";
import { TextField, InputAdornment, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button, Modal } from "@mantine/core";
import { updateDoc } from "@/api/firebase/functions/upload";
import { useDisclosure } from "@mantine/hooks";
import { AddUser } from "../Index";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import sendResetPasswordEmail from "@/api/sendResetPasswordEmail";

// Role options for the Select component
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "business", label: "Business" },
  { value: "user", label: "User" },
];

// Users component
export default function Users({ users }) {
  // State for search term and filtered users
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState({});
  // Effect to update filtered users when users prop changes
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Handler for search input change
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter users based on email
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Handler for role change
  const handleStatusChange = async (event, index) => {
    const selectedRole = event.target.value;

    // Update the selected user's role
    const updatedUsers = [...filteredUsers];
    const changedUser = updatedUsers[index];
    changedUser.role = selectedRole;
    setFilteredUsers(updatedUsers);

    // Update user role in the database
    await updateDoc("users", changedUser.email, changedUser);
    console.log("User Info:", changedUser);
  };

  const handlePassReset = (email, password) => {
    sendResetPasswordEmail(email, password);
  };

  const handleDeleteUser = (email, pass) => {
    deleteUserAcc(email, pass);
  };

  // Render component
  return (
    <div style={{ width: "80%", margin: "2rem auto" }}>
      <Modal
        opened={opened}
        onClose={close}
        title={selectedUser ? "Modify User" : "Create User"}
        centered
      >
        <AddUser data={selectedUser} />
      </Modal>

      {/* Styled Search Bar */}
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by Email"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ margin: "1rem 0", width: "80%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          style={{ width: "20%", margin: ".2rem" }}
          variant="light"
          color="teal"
          size="lg"
          onClick={(e) => {
            open(), setSelectedUser(false);
          }}
        >
          Add User
        </Button>
      </div>

      {/* Table displaying user information */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              {/* <TableCell>All Addresses</TableCell> */}
              <TableCell>Reset Password Link</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers &&
              filteredUsers.map((row, index) => {
                const { firstName, lastName, email, role, frequentAddresses } =
                  row;
                return (
                  <TableRow key={index + 1}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      onClick={(e) => {
                        setSelectedUser(row);
                        open();
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "skyblue",
                          borderBottom: "1px solid blue",
                        }}
                      >{`${firstName}`}</p>
                    </TableCell>
                    <TableCell>{email}</TableCell>
                    {/* <TableCell>
                      {frequentAddresses && frequentAddresses.length + 1}
                    </TableCell> */}
                    <TableCell>
                      <Button
                        variant="filled"
                        color="#F14902"
                        onClick={() => handlePassReset(row.email, row.password)}
                      >
                        Send
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="filled"
                        color="#F14902"
                        onClick={() =>
                          handleDeleteUser(row.email, row.password)
                        }
                      >
                        Delete User
                      </Button>
                    </TableCell>
                    <TableCell>
                      {/* Select component for role change */}
                      <Select
                        value={role}
                        onChange={(event) => handleStatusChange(event, index)}
                        style={{
                          width: "100%",
                          height: 36,
                          backgroundColor: "#339af0",
                          borderRadius: 4,
                          color: "#fff",
                        }}
                      >
                        {roleOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            style={{
                              backgroundColor: "#339af0",
                              padding: 15,
                              color: "#fff",
                              borderRadius: 10,
                              margin: 5,
                            }}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
