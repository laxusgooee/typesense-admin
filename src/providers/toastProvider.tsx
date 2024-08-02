"use client";

import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

export function ToastProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<ToastContainer />
		</>
	);
}
