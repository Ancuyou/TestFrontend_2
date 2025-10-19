// ancuyou/test_fe_rapchieuphim/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("--- AuthContext useEffect RUNS ---");

    const verifyUserSession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      console.log(
        "1. Checking localStorage. AccessToken found:",
        accessToken ? "Yes" : "No"
      );

      // Nếu không có token, đây là con đường đúng cho người dùng đã logout
      if (!accessToken) {
        console.log(
          "2. No AccessToken. Setting loading to false. User is logged out."
        );
        setLoading(false);
        return;
      }

      // Nếu có token, chúng ta phải hỏi server
      console.log("2. AccessToken found. Asking server via /introspect...");
      try {
        const response = await apiClient.post("/auth/introspect", {
          token: accessToken,
        });
        console.log("3. Server response from /introspect:", response.data);

        if (response.data.data.valid) {
          console.log("4. Token is VALID. Restoring user session.");
          const decodedUser = jwtDecode(accessToken);
          const roles = decodedUser.scope ? decodedUser.scope.split(" ") : [];
          setUser({ username: decodedUser.sub, roles });
        } else {
          console.log(
            "4. Token is INVALID (logged out/expired). Calling logOut()."
          );
          logOut(); // Server báo token không hợp lệ -> logout
        }
      } catch (error) {
        console.error(
          "5. API Error during /introspect. Calling logOut().",
          error
        );
        logOut(); // API lỗi -> logout
      } finally {
        console.log("6. Verification finished. Setting loading to false.");
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []); // Chỉ chạy 1 lần

  const loginAction = (data) => {
    console.log("--- loginAction called ---");
    const { accessToken, refreshToken } = data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const decodedUser = jwtDecode(accessToken);
    const roles = decodedUser.scope ? decodedUser.scope.split(" ") : [];
    setUser({ username: decodedUser.sub, roles });
  };

  const logOut = () => {
    console.log("--- logOut called ---");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("User state set to null and localStorage cleared.");
  };

  const value = { user, loading, loginAction, logOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
