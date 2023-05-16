import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Loading() {
	return (
		<div className="bg-[#16213E] h-screen flex flex-col items-center justify-center">
			<div className="flex items-center space-x-10 mb-10">
				<img
					className="rounded-full h-20 w-20"
					src="https://images.unsplash.com/photo-1626775238053-4315516eedc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80"
					alt="Cards and casino chips"
				/>
				<h1 className="text-lg text-white font-bold">
					Loading the Raffle, hold on tight!
				</h1>
			</div>
			<ClipLoader color="white" size={90} speedMultiplier={1.5} />
		</div>
	);
}

export default Loading;
