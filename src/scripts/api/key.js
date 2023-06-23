import axios from "axios";
import CryptoJS from "crypto-js";
import { getContentAsBase64EncondedMD5Hash, sortQueryParams } from "@/scripts/commonScripts";
import axiosRetry from "axios-retry";

const key = () => ({
  dormakaba_atlas: data => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${localStorage.getItem("settings.addressEncoder")}/api/dormakaba-atlas/card/magnetize`,
          data,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            }
          }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  assaabloySession: data => {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:8080/api/v1/sessions", data, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Aah-Date": new Date().toUTCString(),
            "Content-MD5": getContentAsBase64EncondedMD5Hash(data)
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error));
    });
  },
  assaabloy: (data, session) => {
    const date = new Date().toUTCString();
    const encodedData = getContentAsBase64EncondedMD5Hash(data);
    const encoder = localStorage.getItem("settings.addressEncoder") || "Encoder";
    const queryParams = sortQueryParams(
      `action=encode&encoder=${encoder}&overwriteValidCard=true&autoJoin=true`
    );
    const resourcePath = `/api/v1/cards?${queryParams}`;

    return new Promise((resolve, reject) => {
      const authParams = [
        "POST",
        encodedData,
        "application/json; charset=UTF-8",
        `X-Aah-Date:${date}`,
        resourcePath
      ];

      const auth = createAssaabloyAuthorization(session, authParams);
      axios
        .post(`http://localhost:8080${resourcePath}`, data, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Aah-Date": date,
            "Content-MD5": encodedData,
            Authorization: auth
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  onity: data => {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/api/Onity/card/magnetize", data, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  saga: data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${localStorage.getItem("settings.addressEncoder")}/api/saga/card/magnetize`, data, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  orbita: data => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${localStorage.getItem("settings.addressEncoder")}/api/orbita/card/magnetize`,
          data,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            }
          }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  omnitec: data => {
    return new Promise((resolve, reject) => {
      axiosRetry(axios, { retries: 5 });
      axios
        .post(
          `${localStorage.getItem("settings.addressEncoder")}/api/omnitec/card/magnetize`,
          data,
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            }
          }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  }
});

function createAssaabloyAuthorization(session, authorization) {
  const signature = CryptoJS.HmacSHA1(authorization.join(`\n`), session.accessKey);
  const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);

  return `AWS ${session.id}:${signatureBase64}`;
}
export default key;
