import { api, requestConfig } from "../utils/config";

const uploadoXml = async (data) => {
  const config = requestConfig("POST", data, true);

  try {
    const res = await fetch(api + "/validate", config)
      .then((res) => res.json())
      .catch((err) => err);

    // console.log(res)

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getXml = async () => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const deleteXml = async (id) => {
  const config = requestConfig("DELETE");

  try {
    const res = await fetch(api + "/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error)
  }
}

const downloadXml = async (id) => {
  const config = requestConfig("GET");

  try {

    const res = await fetch(api + "/download/" + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res;

  } catch (error) {
    console.log(error)
  }
}

const xmlService = {
  uploadoXml,
  getXml,
  deleteXml,
  downloadXml,
};

export default xmlService;