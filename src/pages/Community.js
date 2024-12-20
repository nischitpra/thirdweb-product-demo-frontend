import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./Community.scss";
import Hr from "../components/Hr";
import Task from "../components/Task";
import { defineChain, getContract, readContract } from "thirdweb";
import { client, deployed } from "../constants";
import { download } from "thirdweb/storage";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { useUser } from "../providers/UserProvider";
import { communityAbi } from "../abi/Abi";

const MintProfile = ({ communityAddress, animationUrl }) => {
  const [tokenId, setTokenId] = useState();
  const [{ login }] = useUser();
  const account = useActiveAccount();

  const fetchTokenId = async () => {
    try {
      const tokenId = await readContract({
        contract: getContract({
          abi: communityAbi,
          address: communityAddress,
          chain: defineChain(deployed.communityFactory.chainId),
          client,
        }),
        method:
          "function getActiveTokenId(address owner) view returns (uint256)",
        params: [account.address],
      });
      setTokenId(tokenId);
    } catch (e) {
      console.error(e);
      setTokenId(null);
    }
  };

  const mint = async () => {
    try {
      await login();
    } catch (e) {
      return;
    }

    const toastId = alert.loading("Minting your NFT");

    try {
      const receipt = await (
        await fetch("https://thirdweb-product-demo-backend.onrender.com/mint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            communityAddress,
            chainId: deployed.communityFactory.chainId,
            userAddress: account.address,
          }),
        })
      ).json();

      console.log(receipt);
      fetchTokenId();

      alert.update(toastId, {
        render: "NFT minted",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (e) {
      console.error(e);
      alert.update(toastId, {
        render: "Could not mint",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    fetchTokenId();
  }, [account?.address]);

  return (
    <div className="MintProfile-container">
      <h1>Mint your profile (gassless)</h1>
      <MediaRenderer className="nft-preview" src={animationUrl} />
      {tokenId === null ? (
        <button onClick={mint}>Mint Now</button>
      ) : !tokenId ? (
        "Loading..."
      ) : (
        <h1>Profile Id #{tokenId}</h1>
      )}
    </div>
  );
};

export const Tasks = ({ tasks }) => {
  return (
    <div className="Tasks-container">
      <h1>Quests</h1>
      {tasks.map((task) => (
        <Task task={task} />
      ))}
    </div>
  );
};

export const Community = () => {
  const { communityAddress } = useParams();
  const [community, setCommunity] = useState();

  useEffect(() => {
    readContract({
      contract: getContract({
        client,
        address: communityAddress,
        chain: defineChain(deployed.communityFactory.chainId),
      }),
      method: "function tokenUri() view returns (string)",
      params: [],
    })
      .then(async (tokenUri) => {
        const community = await (
          await download({ client, uri: tokenUri })
        ).json();
        community.address = communityAddress;
        community.chainId = deployed.communityFactory.chainId;
        setCommunity(community);
      })
      .catch((e) => {
        console.error(e);
        setCommunity(null);
      });
  }, []);

  if (community === null)
    return <section className="Community-container">404: NOT FOUND</section>;
  if (!community)
    return <section className="Community-container">Loading...</section>;
  return (
    <section className="Community-container">
      <header>
        <div className="community-details">
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          <Hr />
          <Tasks tasks={community.tasks} />
        </div>
        <MintProfile
          communityAddress={community.address}
          animationUrl={community.animation_url}
        />
      </header>
    </section>
  );
};

export default Community;
