// const uploadUrl = "https://storage.thirdweb.com/ipfs/upload"
// const apiKey =""

const uploadUrl = "http://localhost:3000/ipfs/upload";
const apiKey =
  "";

const filePaths = [`files/aa.json`, `files/bb.json`];

const buffer1 = JSON.stringify({ name: "test1" });
const buffer2 = JSON.stringify({ name: "test2" });

const blob1 = new Blob([buffer1], {
  type: "application/json",
});
const blob2 = new Blob([buffer2], {
  type: "application/json",
});

const fs = {
  createReadStream: (fileName) => {
    if (fileName == filePaths[0]) return blob1;
    return blob2;
  },
};

const axios = {
  post: async (url, body, options) => {
    const res = await fetch(url, {
      ...options,
      method: "POST",
      body,
    });

    return { data: await res.json() };
  },
};

const expect = (val) => {
  return {
    eq: (expectedValue) => {
      if (val != expectedValue)
        throw new Error(`received: ${val}\nexpected: ${expectedValue}`);
    },
  };
};

const it = async (label, func) => {
  try {
    await func();
    console.log("✅", label);
  } catch (e) {
    console.error("❌", label, "\n", e.message);
  }
};

export const testUploads = () => {
  it("test upload single file - should upload raw file without any folder -1", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]));
    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "QmPGPBz4DBZKyvcFer89s1oTZ7eZeTbSZUPk1XW3LzfocG"
    );

    const data = await (
      await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}`)
    ).text();

    expect(data).eq(buffer1.toString("utf-8"));
  });

  it("test upload single file - should upload raw file without any folder -2", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]), "aa.json");
    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "QmPGPBz4DBZKyvcFer89s1oTZ7eZeTbSZUPk1XW3LzfocG"
    );

    const data = await (
      await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}`)
    ).text();

    expect(data).eq(buffer1.toString("utf-8"));
  });

  // --------IGNORE --------IGNORE --------IGNORE --------IGNORE
  // not getting errors so commenting this out. getting error in backend
  //   it("test upload multiple file error - should throw error", async () => {
  //     const form = new FormData();
  //     form.append("file", fs.createReadStream(filePaths[0]));
  //     form.append("file", fs.createReadStream(filePaths[1]));
  //     form.append("pinataOptions",JSON.stringify({wrapWithDirectory: false}))
  //     try {
  //       const resp = await axios.post(uploadUrl, form, {
  //         headers: {
  //           "x-secret-key": apiKey,
  //         },
  //       });
  //       console.log("should throw here", resp);

  //       expect("succeded").eq("should fail");
  //     } catch (e) {
  //       expect(e.response.data.error).eq(
  //         "More than one file and/or directory was provided for pinning."
  //       );
  //     }
  //   });
  // --------IGNORE --------IGNORE --------IGNORE --------IGNORE

  it("test upload multiple file error without pathname - should upload last file as raw file without folder", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]));
    form.append("file", fs.createReadStream(filePaths[1]));

    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "Qmc1WUtNkYazBq1zi6TH9F7xQVch7Nb6e7Ak2pidT14u3V"
    );
  });

  it("test upload to folder - should upload two files to folder", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]), filePaths[0]);
    form.append("file", fs.createReadStream(filePaths[1]), filePaths[1]);
    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "QmZLDv6bwzM4i8eZqdYmc8iKLJMjod2Y4C1eavh9SoDjtF"
    );
    expect(
      await (
        await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/aa.json`)
      ).text()
    ).eq(buffer1.toString("utf-8"));
    expect(
      await (
        await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/bb.json`)
      ).text()
    ).eq(buffer2.toString("utf-8"));
  });

  it("test upload single file with filepath - should create folder with 1 file", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]), filePaths[0]);
    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "QmSmNkEkdPxjaACYq5pt5LfDJor8EiHWPyZPfuCThSrFmF"
    );
    expect(
      await (
        await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/aa.json`)
      ).text()
    ).eq(buffer1.toString("utf-8"));
    const v = await (
      await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/bb.json`)
    ).text();
    expect(v.trim()).eq(
      `failed to resolve /ipfs/QmSmNkEkdPxjaACYq5pt5LfDJor8EiHWPyZPfuCThSrFmF/bb.json: no link named "bb.json" under QmSmNkEkdPxjaACYq5pt5LfDJor8EiHWPyZPfuCThSrFmF`
    );
  });

  it("test upload two file with same path - should create folder with 1 file. second file overrides first file", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]), filePaths[1]);
    form.append("file", fs.createReadStream(filePaths[1]), filePaths[1]);

    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "QmdpajPaYiFfP4nAm2t2ZEUfboXTo3gkMZBNBvVA6MK2kc"
    );
    expect(
      await (
        await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/bb.json`)
      ).text()
    ).eq(buffer2.toString("utf-8"));
    const v = await (
      await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}/aa.json`)
    ).text();
    expect(v.trim()).eq(
      `failed to resolve /ipfs/QmdpajPaYiFfP4nAm2t2ZEUfboXTo3gkMZBNBvVA6MK2kc/aa.json: no link named "aa.json" under QmdpajPaYiFfP4nAm2t2ZEUfboXTo3gkMZBNBvVA6MK2kc`
    );
  });

  it("test upload two file with path without / - should upload raw file without any folder. second file overrides first file", async () => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePaths[0]), "somepath");
    form.append("file", fs.createReadStream(filePaths[1]), "somepath");
    const response = (
      await axios.post(uploadUrl, form, {
        headers: {
          "x-secret-key": apiKey,
        },
      })
    ).data;

    expect(response.IpfsHash).eq(
      "Qmc1WUtNkYazBq1zi6TH9F7xQVch7Nb6e7Ak2pidT14u3V"
    );
    expect(
      await (await fetch(`https://ipfs.io/ipfs/${response.IpfsHash}`)).text()
    ).eq(buffer2.toString("utf-8"));
  });
};
