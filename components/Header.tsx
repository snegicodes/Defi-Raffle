import React from "react";
import NavButton from "./Navbutton";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";

function Header() {
	const address = useAddress();
	const disconnect = useDisconnect();

	return (
		<header className="grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5">
			<div className="flex items-center space-x-2">
				<img
					className="rounded-full h-20 w-20 object-cover object-top"
					src="https://images.unsplash.com/photo-1683480678001-d2b60353b0fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=726&q=80"
					alt="old man wearing hat and glasses"
				/>
				<div>
					<h1 className="text-2xl  text-[#A7D2CB] font-bold">
						Defi Raffle
					</h1>
					<p className="text-sm text-white truncate font-medium">
						User: {address?.substring(0, 5)}...
						{address?.substring(address.length, address.length - 5)}
					</p>
				</div>
			</div>

			<div className="hidden md:flex md:col-span-3 items-center justify-center rounded-md">
				<div className="bg-[#041f3e] p-4 space-x-2">
					<NavButton title="Buy Tickers" isActive />
					<NavButton onClick={disconnect} title="Log Out" />
				</div>
			</div>

			<div className="flex flex-col ml-auto text-right">
				<Bars3BottomRightIcon className="h-8 w-8 mx-auto text-white cursor-pointer" />
				<span className="md:hidden">
					<NavButton onClick={disconnect} title="Log Out" />
				</span>
			</div>
		</header>
	);
}

export default Header;
