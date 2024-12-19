import { client } from "../constants";
import { useUser } from "../providers/UserProvider";
import { ConnectButton } from "thirdweb/react";

export const LoginButton = () => {
  const [{ walletConfig }] = useUser();

  return <ConnectButton theme="light" client={client} wallets={walletConfig} />;
};

export default LoginButton;
