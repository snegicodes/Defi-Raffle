import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";

import { ethers } from "ethers";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import {
	useAddress,
	useContract,
	useContractRead,
	useContractWrite,
} from "@thirdweb-dev/react";

import { currency } from "../constants";
import Header from "../components/Header";
import Login from "../components/Login";
import Loading from "../components/Loading";
import CountdownTimer from "../components/CountdownTimer";
import { ClimbingBoxLoader } from "react-spinners";
import AdminControls from "../components/AdminControls";

const Home: NextPage = () => {
	const address = useAddress();
	const [userTickets, setUserTickets] = useState(0);
	const [quantity, setQuantity] = React.useState<number>(1);
	const { contract, isLoading } = useContract(
		process.env.NEXT_PUBLIC_WALLET_ADDRESS
	);

	const { data: remainingTickets } = useContractRead(
		contract,
		"RemainingTickets"
	);
	const { data: currentWinningReward } = useContractRead(
		contract,
		"CurrentWinningReward"
	);
	const { data: ticketCommission } = useContractRead(
		contract,
		"ticketCommission"
	);
	const { data: expiration } = useContractRead(contract, "expiration");
	const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
	const { data: totalCommission } = useContractRead(
		contract,
		"operatorTotalCommission"
	);
	const { mutateAsync: BuyTickets } = useContractWrite(
		contract,
		"BuyTickets"
	);
	const { data: tickets } = useContractRead(contract, "getTickets");
	const { data: winnings } = useContractRead(
		contract,
		"getWinningsForAddress",
		[address]
	);
	const { mutateAsync: WithdrawWinnings } = useContractWrite(
		contract,
		"WithdrawWinnings"
	);
	const { data: lastWinner } = useContractRead(contract, "lastWinner");
	const { data: lastWinnerAmount } = useContractRead(
		contract,
		"lastWinnerAmount"
	);
	const { data: isLotteryOperator } = useContractRead(
		contract,
		"lotteryOperator"
	);

	useEffect(() => {
		if (!tickets) return;

		const totalTickets: string[] = tickets;
		const userTicketsCount = totalTickets.reduce(
			(total, ticketAddress) =>
				ticketAddress === address ? total + 1 : total,
			0
		);

		setUserTickets(userTicketsCount);
	}, [tickets, address]);

	const handleClick = async () => {
		if (!ticketPrice) return;

		const notification = toast.loading("Buying your tickets...");
		const totalPrice = (
			Number(ethers.utils.formatEther(ticketPrice)) * quantity
		).toString();
		const payValue = ethers.utils.parseEther(totalPrice);

		try {
			const data = await BuyTickets({
				args: [quantity],
				overrides: {
					value: payValue,
				},
			});

			toast.success("Tickets purchased successfully!", {
				id: notification,
			});

			console.log("Contract call success", data);
		} catch (err) {
			toast.error("Whoops, something went wrong!", { id: notification });

			console.error("Contract call failure", err);
		}
	};

	const onWithdrawWinnings = async () => {
		const notification = toast.loading("Withdrawing your winnings...");

		try {
			const data = await WithdrawWinnings({});

			toast.success("Winning withdrawn successfully!", {
				id: notification,
			});
		} catch (err) {
			toast.error("Whoops, something went wrong!", { id: notification });

			console.error("Contract call failure", err);
		}
	};

	if (isLoading) return <Loading />;
	if (!address) return <Login />;

	return (
		<div className="bg-[#16213E] min-h-screen flex flex-col">
			<Head>
				<title>Defi Raffle</title>
			</Head>

			<div className="flex-1">
				<Header />

				<Marquee
					className="bg-[#0a396f] p-5 mb-5"
					gradient={false}
					speed={100}
				>
					<div className="flex space-x-2 mx-10">
						<h4 className="text-white font-bold">
							Last Winner: {lastWinner?.toString()}
						</h4>
						<h4 className="text-white font-bold">
							Previous Winnings:{" "}
							{lastWinnerAmount &&
								ethers.utils.formatEther(
									lastWinnerAmount?.toString()
								)}{" "}
							{currency}
						</h4>
					</div>
				</Marquee>

				{isLotteryOperator === address && (
					<div className="flex justify-center">
						<AdminControls />
					</div>
				)}

				{winnings > 0 && (
					<div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
						<button
							onClick={onWithdrawWinnings}
							className="p-5 bg-gradient-to-b from-emerald-500 to-cyan-600 animate-pulse
										text-center rounded-xl w-full"
						>
							<p className="font-bold">
								Winner Winner Chicken Dinner
							</p>
							<p>
								Total Winnings :{" "}
								{ethers.utils.formatEther(winnings.toString())}{" "}
								{currency}
							</p>
							<br />
							<p className="font-semibold">
								Click here to withdraw
							</p>
						</button>
					</div>
				)}

				<div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
					<div className="stats-container">
						<h1 className="text-5xl text-white font-semibold text-center">
							The Next Draw
						</h1>
						<div className="flex justify-between p-2 space-x-2">
							<div className="stats">
								<h2 className="text-sm">Total Pool</h2>
								<p className="text-xl">
									{currentWinningReward &&
										ethers.utils.formatEther(
											currentWinningReward.toString()
										)}{" "}
									{currency}
								</p>
							</div>
							<div className="stats">
								<h2 className="text-sm">Tickets Remaining</h2>
								<p className="text-xl">
									{remainingTickets?.toNumber()}
								</p>
							</div>
						</div>

						<div className="mt-5 mb-3">
							<CountdownTimer />
						</div>
					</div>

					<div className="stats-container space-y-2">
						<div className="stats-container">
							<div className="flex justify-between items-center text-white pb-2">
								<h2>Price per ticket</h2>
								<p>
									{ticketPrice &&
										ethers.utils.formatEther(
											ticketPrice.toString()
										)}{" "}
									{currency}
								</p>
							</div>

							<div className="flex text-white items-center space-x-2 bg-[#041f3e] border-[#0a396f] border p-4">
								<p>TICKETS</p>
								<input
									className="flex w-full bg-transparent text-right outline-none"
									type="number"
									min={1}
									max={10}
									value={quantity}
									onChange={(e) =>
										setQuantity(Number(e.target.value))
									}
								/>
							</div>

							<div className="space-y-2 mt-5">
								<div className="flex items-center justify-between text-cyan-300 text-sm italic font-extrabold">
									<p>Total cost of tickets</p>
									<p>
										{ticketPrice &&
											Number(
												ethers.utils.formatEther(
													ticketPrice.toString()
												)
											) * quantity}{" "}
										{currency}
									</p>
								</div>

								<div className="flex items-center justify-between text-cyan-300 text-xs italic">
									<p>Service fees</p>
									<p>
										{ticketCommission &&
											ethers.utils.formatEther(
												ticketCommission.toString()
											)}{" "}
										{currency}
									</p>
								</div>

								<div className="flex items-center justify-between text-cyan-300 text-xs italic">
									<p>+ Network Fees</p>
									<p>
										{totalCommission &&
											ethers.utils.formatEther(
												totalCommission.toString()
											)}{" "}
										{currency}
									</p>
								</div>
							</div>

							<button
								disabled={
									expiration?.toString() <
										Date.now().toString() ||
									remainingTickets?.toNumber() === 0
								}
								onClick={handleClick}
								className="mt-5 w-full bg-gradient-to-br font-semibold from-emerald-500 to-cyan-600 px-10 py-5
											rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600
											disabled:text-gray-100 disabled:cursor-not-allowed"
							>
								Buy {quantity} Tickets for{" "}
								{ticketPrice &&
									Number(
										ethers.utils.formatEther(
											ticketPrice.toString()
										)
									) * quantity}{" "}
								{currency}
							</button>
						</div>

						{userTickets > 0 && (
							<div className="stats">
								<p className="text-lg mb-2 text-center">
									You have {userTickets} Tickets in this draw.
								</p>
								<div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
									{Array(userTickets)
										.fill("")
										.map((_, index) => (
											<p
												key={index}
												className="text-cyan-300 h-7 w-[1.95rem] bg-[#0a396f]/70 rounded-lg
												flex flex-shrink-0 items-center justify-center text-xs italic"
											>
												{index + 1}
											</p>
										))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div></div>
		</div>
	);
};

export default Home;
