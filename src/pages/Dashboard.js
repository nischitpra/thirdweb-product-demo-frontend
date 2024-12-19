import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Dashboard.scss";
import { MediaRenderer } from "thirdweb/react";
import { client, deployed } from "../constants";
import { defineChain, getContract, readContract } from "thirdweb";
import { download } from "thirdweb/storage";
import { communityAbi } from "../abi/Abi";

const CommunityCard = ({ community }) => {
  console.log(community);
  return (
    <div className="CommunityCard-container">
      <header>
        <div className="background">
          <MediaRenderer className="banner" src={community.image} />
          <h1>{community.name}</h1>
        </div>
        <p>{community.description}</p>
      </header>
      <footer>
        <Link to={`/${community.address}`}>Explore</Link>
      </footer>
    </div>
  );
};

export const Dashboard = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      readContract({
        contract: getContract({
          client,
          address: deployed.communityFactory.address,
          chain: defineChain(deployed.communityFactory.chainId),
        }),
        method: "function communities(uint256) view returns (address)",
        params: [i],
      })
        .then(async (communityAddress) => {
          console.log("communityAddress", communityAddress);
          const tokenUri = await readContract({
            contract: getContract({
              abi: communityAbi,
              client,
              address: communityAddress,
              chain: defineChain(deployed.communityFactory.chainId),
            }),
            method: "function tokenUri() view returns (string)",
            params: [],
          });
          const community = await (
            await download({ client, uri: tokenUri })
          ).json();
          community.address = communityAddress;
          community.chainId = deployed.communityFactory.chainId;
          setCommunities((comm) => [...comm, community]);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, []);

  return (
    <section className="Dashboard-container">
      <h1>Explore communities</h1>

      <div className="communities">
        {communities.length
          ? communities.map((community) => (
              <CommunityCard community={community} />
            ))
          : "Loading..."}
      </div>
    </section>
  );
};

export default Dashboard;
