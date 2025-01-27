import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Dashboard.scss";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { client, deployed } from "../constants";
import {
  defineChain,
  eth_getTransactionReceipt,
  getContract,
  getRpcClient,
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { download } from "thirdweb/storage";
import { communityAbi } from "../abi/Abi";
import { testUploads } from "./IpfsUploadHelper";

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
  const account = useActiveAccount();

  const test = async () => {
    // const transaction = prepareContractCall({
    //   contract: getContract({
    //     address: "0x0bfA6ECe4E19939c6D7b9eE1f64aEd8124dca485",
    //     chain: defineChain(247253),
    //     client,
    //   }),
    //   method:
    //     "function mintTo(address _to, uint256 _tokenId, string _uri, uint256 _amount)",
    //   params: [account.address, 0, "ipfs://QmTzZgf9SdsuUpg7G51aEEiu4U79L5wNtS859VuipGu7yC/0", 1],
    // });
    // const txn = await transaction.data();
    // console.log(transaction, txn);


    const request = getRpcClient({ client, chain: defineChain(247253)});
    const receipt = await eth_getTransactionReceipt(request, {
      hash: "0x899898f30c7cb13a34d0fd595d6ca598666345fd6586a180a2e679958efc0f15",
    });

    // const receipt = await sendAndConfirmTransaction({
    //   account,
    //   transaction,
    // });

    console.log(receipt);
  };

  const testStorage = async()=>{
    testUploads()
  }

  // useEffect(() => {
  //   for (let i = 0; i < 10; i++) {
  //     readContract({
  //       contract: getContract({
  //         client,
  //         address: deployed.communityFactory.address,
  //         chain: defineChain(deployed.communityFactory.chainId),
  //       }),
  //       method: "function communities(uint256) view returns (address)",
  //       params: [i],
  //     })
  //       .then(async (communityAddress) => {
  //         console.log("communityAddress", communityAddress);
  //         const tokenUri = await readContract({
  //           contract: getContract({
  //             abi: communityAbi,
  //             client,
  //             address: communityAddress,
  //             chain: defineChain(deployed.communityFactory.chainId),
  //           }),
  //           method: "function tokenUri() view returns (string)",
  //           params: [],
  //         });
  //         const community = await (
  //           await download({ client, uri: tokenUri })
  //         ).json();
  //         community.address = communityAddress;
  //         community.chainId = deployed.communityFactory.chainId;
  //         setCommunities((comm) => [...comm, community]);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   }
  // }, []);

  return (
    <section className="Dashboard-container">
      <button onClick={test}>Test Contract</button>
      <button onClick={testUploads}>Test Uploads</button>
      {/* <h1>Explore communities</h1>

      <div className="communities">
        {communities.length
          ? communities.map((community) => (
              <CommunityCard community={community} />
            ))
          : "Loading..."}
      </div> */}
    </section>
  );
};

export default Dashboard;
