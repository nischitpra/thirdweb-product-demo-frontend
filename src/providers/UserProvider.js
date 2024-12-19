import { useMemo, useState } from "react";
import { createContainer } from "react-tracked";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "../constants";

const useUserState = () => {
  const [user, setUser] = useState();
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const walletConfig = useMemo(() => [
    inAppWallet({
      auth: { options: ["email", "passkey", "google"] },
    }),
  ]);

  const login = async () => {
    if (account) return;
    try {
      await connect({
        client,
        wallets: walletConfig,
      });
    } catch (e) {
      console.error(e);
      alert.error("Login failed");
      throw e;
    }
  };

  return [{ user, walletConfig, login }, setUser];
};

const { Provider, useTracked } = createContainer(() => useUserState());

export const useUser = useTracked;
export const UserProvider = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default UserProvider;
