import ThemeSwitch from "@/components/_common/themeSwitch";
import { LoginForm } from "@/components/login/form";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

export default function Page() {
	return (
		<div className="flex flex-col min-h-screen py-12 px-4 sm:px-6 lg:px-8">
			<div className="flex justify-end">
				<ThemeSwitch />
			</div>
			<div className="flex-1 flex flex-col items-center justify-center ">
				<Card className="w-full max-w-lg space-y-2 py-5">
					<CardHeader className="flex-col pt-5">
						<h1 className="text-center text-2xl font-black">ADMIN</h1>
						<h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
							Sign in to your instance
						</h2>
					</CardHeader>
					<CardBody>
						<LoginForm />
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
