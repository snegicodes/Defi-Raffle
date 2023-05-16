import React from "react";

interface Props {
	title: string;
	isActive?: boolean;
	onClick?: () => void;
}

function NavButton({ title, isActive, onClick }: Props) {
	return (
		<button
			onClick={onClick}
			className={`${isActive && "bg-[#87A2FB] text-gray-800"} ${
				!isActive && "text-stone-300"
			} hover:bg-[#87A2FB] hover:text-gray-800 font-medium py-2 px-4 rounded`}
		>
			{title}
		</button>
	);
}

export default NavButton;
