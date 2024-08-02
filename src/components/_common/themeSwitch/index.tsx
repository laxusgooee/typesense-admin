"use client";

import React from "react";
import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeSwitch() {
	return (
		<Switch
			defaultSelected
			size="lg"
			color="primary"
			startContent={<SunIcon />}
			endContent={<MoonIcon />}
			onValueChange={(isLight) => {
				if (isLight) {
					document.documentElement.classList.remove("dark");
				} else {
					document.documentElement.classList.add("dark");
				}
			}}
		></Switch>
	);
}
