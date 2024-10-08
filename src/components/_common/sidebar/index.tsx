"use client";

import { CircleStackIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ThemeSwitch from "../themeSwitch";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	Chip,
	DropdownSection,
} from "@nextui-org/react";
import { useAuthStore } from "@/store/auth";

const SidebarItem = ({
	icon,
	text,
	href,
	open,
}: {
	readonly icon: React.ReactNode;
	readonly text: string;
	readonly href: string;
	readonly open?: boolean;
}) => {
	const pathname = usePathname();

	const active = useMemo(() => href === pathname, [href, pathname]);
	return (
		<Link
			href={href}
			className={`self-end p-2 ${
				open ? "justify-start w-full pl-8" : "justify-center w-12"
			} ${
				active ? "-mr-3" : ""
			} hover:-mr-4 text-white hover:text-purple-500 dark:hover:text-blue-500 bg-[#1E293B] rounded-full transform ease-in-out duration-300 flex flex-row items-center space-x-3`}
		>
			{icon}
			{open && <div>{text}</div>}
		</Link>
	);
};

const KeyItem = () => {
	const { nodes, deactivate } = useAuthStore((state) => state);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button size="sm" variant="bordered">
					<KeyIcon className="w-4 h-4" />
					<span className="hidden md:block">Connection</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Action event example"
				onAction={(key) => {
					if (key === "deactivate") {
						deactivate();
					}
				}}
			>
				<DropdownItem
					isReadOnly
					key="new"
					className="border-b rounded-none pb-3"
				>
					<div className="flex justify-between gap-2">
						Nodes
						<Chip size="sm">{nodes.length}</Chip>
					</div>
				</DropdownItem>
				<DropdownSection>
					<DropdownItem key="deactivate" className="text-danger" color="danger">
						Disconnect
					</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
};

export function Sidebar({ children }: { readonly children: React.ReactNode }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {}, [open]);

	return (
		<>
			{/* {header} */}
			<div className="fixed w-full z-30 flex bg-white dark:bg-[#1E293B] p-2 items-center justify-center h-16 pl-10 pr-4 md:pr-10">
				<div
					className={`logo ${
						!open ? "ml-12" : ""
					} dark:text-white  transform ease-in-out duration-500 flex-none h-full flex items-center justify-center`}
				>
					NERVE
				</div>
				<div className="grow h-full flex items-center justify-center"></div>
				<div className="flex-none h-full text-center flex items-center justify-center">
					<div className="flex space-x-3 items-center px-3">
						<KeyItem />
					</div>
				</div>
			</div>

			<aside
				className={`w-60 fixed transition transform ease-in-out duration-1000 z-50 flex h-screen bg-[#1E293B] ${
					open ? "translate-x-none" : "-translate-x-48"
				}`}
			>
				{/* <!-- open sidebar button --> */}
				<div
					className={`max-toolbar ${
						open ? "translate-x-0" : "translate-x-24 scale-x-0"
					} w-full -right-6 transition transform ease-in duration-300 flex items-center justify-between border-4 border-white dark:border-[#0F172A] bg-[#1E293B]  absolute top-2 rounded-full h-12`}
				>
					<div className="flex pl-4 items-center space-x-2 ">
						<ThemeSwitch />
					</div>
					<div className="flex items-center space-x-3 group bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-purple-500  pl-10 pr-2 py-1 rounded-full text-white  ">
						<div className="transform ease-in-out duration-300 mr-12">
							NERVE
						</div>
					</div>
				</div>
				<button
					onClick={() => setOpen(!open)}
					className="-right-6 transition transform ease-in-out duration-500 flex border-4 border-white dark:border-[#0F172A] bg-[#1E293B] dark:hover:bg-blue-500 hover:bg-purple-500 absolute top-2 p-3 rounded-full text-white hover:rotate-45"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={3}
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
						/>
					</svg>
				</button>
				{/* <!-- SIDEBAR--> */}
				<div className="flex max text-white mt-20 flex-col space-y-2 w-full h-[calc(100vh)]">
					<SidebarItem
						icon={<HomeIcon className="w-4 h-4" />}
						text="Home"
						href="/"
						open={open}
					/>

					<SidebarItem
						icon={<CircleStackIcon className="w-4 h-4" />}
						text="Collections"
						href="/collections"
						open={open}
					/>
				</div>
			</aside>

			<main
				className={`content ml-12 ${
					open && "md:ml-60"
				} transform ease-in-out duration-500 pt-24 px-2 md:px-8 pb-4`}
			>
				{children}
			</main>
		</>
	);
}
