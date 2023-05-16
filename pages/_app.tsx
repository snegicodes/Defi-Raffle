import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThirdwebProvider activeChain="avalanche-fuji">
			<Component {...pageProps} />
			<Toaster />
		</ThirdwebProvider>
	);
}

export default MyApp;
