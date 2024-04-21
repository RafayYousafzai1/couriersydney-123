"use client";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../config";
import { toast } from "react-toastify";
import { fetchAllFirstNames, fetchDocById } from "./fetch";
import { deleteDocument } from "./upload";
// useRouter

const auth = getAuth(app);
const db = getFirestore();

const notify = (msg) => toast(msg);

async function signUpWithEmail(email, password, userData) {
  try {
    const existingFirstNames = await fetchAllFirstNames();
    if (existingFirstNames.includes(userData.firstName)) {
      throw new Error("Username already exists");
    }

    await saveUserDataToUserDoc(email, userData);

    // window.location.href = "https://courierssydney.com.au/account-opening/";
    notify("Sign up successful!");
    return true;
  } catch (error) {
    notify(error.message);
    throw error;
  }
}

async function signInWithEmail(username, password) {
  try {
    const q = query(
      collection(db, "users"),
      where("firstName", "==", username),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      notify("User not found or invalid credentials");
    }

    const userData = querySnapshot.docs[0].data();

    await saveUserDataToUserDoc(userData.email, userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchUserData();
    // location.reload();
    window.location.href = "/";
    notify("Sign in successful!");
    return true;
  } catch (error) {
    notify(error.message);
    throw error;
  }
}

async function saveUserDataToUserDoc(email, userData) {
  try {
    const userDocRef = doc(db, "users", email);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // The document exists, update it
      for (const key in userData) {
        if (userData.hasOwnProperty(key)) {
          await updateDoc(userDocRef, { [key]: userData[key] });
        }
      }
    } else {
      // The document doesn't exist, create a new one
      await setDoc(userDocRef, userData);
    }

    notify("Info Updated!");
  } catch (error) {
    notify(error.message);
  }
}

async function fetchUserData() {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const userData = await fetchDocById(user.email, "users");
    localStorage.setItem("userDoc", JSON.stringify(userData));
    return userData;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function userRole() {
  try {
    const role =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    (JSON.parse(localStorage.getItem("user")) || {}).role || null;
    return role;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function logout() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("userDoc");
    location.reload();
    notify("Logout Succesfully");
    return true;
  } catch (error) {
    notify(error.message);
    return null;
  }
}

async function sendPasswordResetEmailLink(email, password) {
  try {
    notify(`Password reset email sent to ${email}`);
  } catch (error) {
    notify(error.message);
  }
}
async function ResetPassword(email, oldPassword, newPassword) {
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", email),
      where("password", "==", oldPassword) // Changed 'password' to 'oldPassword'
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      notify("User not found or invalid credentials");
    }

    const userData = querySnapshot.docs[0].data();

    await saveUserDataToUserDoc(email, {
      ...userData,
      password: newPassword,
      oldPassword: oldPassword, // Added oldPassword to update
    });

    notify("Password changed"); // Corrected the spelling of 'changed'

    // Password reset successful
    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    // Password reset failed
    return { success: false, message: error.message };
  }
}

const deleteUserAcc = async (email, pass) => {
  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);

    if (!userCredential || !userCredential.user) {
      console.log("Invalid user credentials or error during authentication.");
      return false;
    }

    const user = await fetchDocById(email, "users");

    if (!user) {
      notify("No matching user document found.");
      return false;
    }

    // Delete user account
    await userCredential.user.delete();
    console.log("User account deleted successfully.");

    await deleteDocument("users", email);

    notify(`Successfully deleted ${user.email}.`);

    return true;
  } catch (error) {
    console.log("Error deleting user", error);
    notify(error.message); // Notify the user about the error
    return false;
  }
};

async function verifyAuth() {
  const storedUserData = localStorage.getItem("user");

  if (!storedUserData) {
    window.location.href = "/Signin";
    console.log("go Signin");
    return null;
  }

  try {
    const user = JSON.parse(storedUserData);

    const userData = await fetchDocById(user.email, "users");

    localStorage.setItem("userDoc", JSON.stringify(userData));

    return userData;
  } catch (error) {
    notify(error.message);
    localStorage.removeItem("user");
    localStorage.removeItem("userDoc");
    window.location.href = "/Signin";
    console.log("go Signin");

    return null;
  }
}

export {
  signUpWithEmail,
  signInWithEmail,
  saveUserDataToUserDoc,
  fetchUserData,
  userRole,
  ResetPassword,
  logout,
  sendPasswordResetEmailLink,
  deleteUserAcc,
  verifyAuth,
};
