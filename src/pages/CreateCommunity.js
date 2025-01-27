import { useState } from "react";

import "./CreateCommunity.scss";
import { getElementValue } from "../utils";
import { client, deployed } from "../constants";
import Task from "../components/Task";
import Hr from "../components/Hr";
import { useUser } from "../providers/UserProvider";
import { upload } from "thirdweb/storage";
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { communityFactoryAbi } from "../abi/Abi";
import { useNavigate } from "react-router-dom";
import { setThirdwebDomains } from "thirdweb/utils";
setThirdwebDomains({ storage: "storage.preview.thirdweb.com" });

const Input = (props) => {
  return (
    <div className="Input-container">
      <h1>{props.label}</h1>
      {props.type == "area" ? <textarea {...props} /> : <input {...props} />}
    </div>
  );
};

const ViewTasks = ({ tasks, removeTask }) => {
  return (
    <div className="ViewTasks-container">
      <h1>Quests</h1>
      {tasks.length ? (
        tasks.map((task, i) => (
          <div className="TaskEdit-container">
            <Task task={task} />
            <button className="delete" onClick={() => removeTask(i)}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <>
          No tasks to do
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
};

const TaskForm = ({ onCreate }) => {
  const addTask = () => {
    const title = getElementValue("input.createCommunity.task.title");
    const description = getElementValue(
      "input.createCommunity.task.description"
    );
    const link = getElementValue("input.createCommunity.task.link");
    const actionText = getElementValue("input.createCommunity.task.actionText");

    if (!title) return alert.error("Task title missing");
    if (!description) return alert.error("Task description missing");
    if (!link) return alert.error("Task link missing");
    if (!actionText) return alert.error("Task actionText missing");

    onCreate({ title, description, link, actionText });
  };

  return (
    <div className="TaskForm-container">
      <h1>Task Form</h1>
      <Input
        id="input.createCommunity.task.title"
        label="Title"
        placeholder="Visit my website"
      />
      <Input
        id="input.createCommunity.task.description"
        label="Description"
        placeholder="Go visit my website and do..."
      />
      <Input
        id="input.createCommunity.task.link"
        label="Redirect Link"
        placeholder="https://mywebsite.com"
      />
      <Input
        id="input.createCommunity.task.actionText"
        label="Action Button Text"
        placeholder="Visit Now"
      />

      <button onClick={addTask}>Add Task</button>
    </div>
  );
};

export const CreateCommunity = () => {
  const [{ login }] = useUser();
  const [tasks, setTasks] = useState([]);
  const account = useActiveAccount();
  const navigate = useNavigate();

  const onCreateTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const removeTask = (taskIdx) => {
    const _tasks = [...tasks];
    _tasks.splice(taskIdx, 1);

    setTasks([..._tasks]);
  };

  const createCommunity = async () => {
    try {
      await login();
    } catch (e) {
      return;
    }

    const logo = getElementValue("input.createCommunity.logo", "files")[0];
    const name = getElementValue("input.createCommunity.name");
    const description = getElementValue("input.createCommunity.description");
    const nftImage = getElementValue(
      "input.createCommunity.nftImage",
      "files"
    )[0];

    if (!logo) return alert.error("Logo is required");
    if (!name) return alert.error("Name is required");
    if (!description) return alert.error("Description is required");
    if (!nftImage) return alert.error("Nft image is required");
    if (!tasks?.length) return alert.error("Quest is empty");

    const toastId = alert.loading("Creating community");

    try {
      const [logoUrl, nftImageUrl] = await upload({
        client,
        files: [logo, nftImage],
      });

      const data = {
        name,
        image: logoUrl,
        description,
        animation_url: nftImageUrl,
        tasks,
      };

      const tokenUri = await upload({
        client,
        files: [data],
      });

      const transaction = prepareContractCall({
        contract: getContract({
          abi: communityFactoryAbi,
          address: deployed.communityFactory.address,
          chain: defineChain(deployed.communityFactory.chainId),
          client,
        }),
        method:
          "function createCommunity(address _creator, string _name, string _tokenUri)",
        params: [account.address, data.name, tokenUri],
      });
      console.log(
        tokenUri,
        account.address,
        data.name,
        tokenUri,
        await transaction.data()
      );

      const receipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });

      console.log(receipt);
      alert.update(toastId, {
        render: "Community created",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      navigate(`/${receipt.logs[0].address}`);
    } catch (e) {
      console.error(e);
      alert.update(toastId, {
        render: "Could not create community",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  const testUpload = async () => {
    const logo = getElementValue("input.createCommunity.logo", "files")[0];
    if (!logo) return alert.error("Logo is required");

    const uploadResponse = await upload({
      client,
      files: [logo],
      uploadWithoutDirectory: true
    });
    console.log(uploadResponse);
  };

  return (
    <section className="CreateCommunity-container">
      <h1>Create Your Community</h1>

      <Input id="input.createCommunity.logo" label="Logo" type="file" />
      <button onClick={testUpload}>Test Upload</button>
      <Input
        id="input.createCommunity.name"
        label="Name"
        placeholder="PumpKins"
      />
      <Input
        id="input.createCommunity.description"
        label="Description"
        type="area"
        placeholder="PumpKins is a traders only exclusive group where we make atleast 30% ROI per month and no less. Do you have what it takes? Do the tasks and prove to us that you're serious!"
      />
      <Input
        id="input.createCommunity.nftImage"
        label="NFT Profile Image"
        type="file"
      />

      <Hr />
      <ViewTasks tasks={tasks} removeTask={removeTask} />
      <TaskForm onCreate={onCreateTask} />
      <Hr />

      <button className="create-community" onClick={createCommunity}>
        Create Community (In App Wallet needs ETH in Holesky)
      </button>
    </section>
  );
};

export default CreateCommunity;
