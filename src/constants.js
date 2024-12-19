import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: "bb0f1cd82a39919a844550ea38aa6dfd",
});

export const deployed = {
  communityFactory: {
    address: "0xbFac8F89b3960bbAfaB45BFa5325cC66544B9ffC",
    chainId: 17000,
  },
};

export default {
  client,
  deployed,
};
