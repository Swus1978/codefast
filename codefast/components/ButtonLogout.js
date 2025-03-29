"use client";

import React from "react";
import { signOut } from "next-auth/react";

const ButtonLogout = () => {
  return (
    <button className="btn btn-ghost" onClick={() => signOut()}>
      Logout
    </button>
  );
};

export default ButtonLogout;
