import CryptoJS from "crypto-js";

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function formatReadonlyCPF(cpf) {
  const value = cpf.replace(/[^\d]/g, "");
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatReadonlyPhone(value) {
  if (!value) {
    return "";
  }
  // const countryCode = value.countryCode ? `+${value.countryCode} ` : "";
  // const areaCode = value.areaCode ? `(${value.areaCode}) ` : "";
  const countryCode = value.countryCode ? `${value.countryCode} ` : "";
  const areaCode = value.areaCode ? `${value.areaCode} ` : "";
  return `${countryCode}${areaCode}${value.phoneNumber || ""}`;
}

export function getContentAsBase64EncondedMD5Hash(body) {
  let md5checksum = CryptoJS.MD5(JSON.stringify(body));
  let base64value = CryptoJS.enc.Base64.stringify(md5checksum);
  return base64value;
}

export function getISOStringWithoutZoneDesignator(dateString) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, -1);
}

export function sortQueryParams(paramString) {
  return paramString
    .split("&")
    .sort()
    .join("&");
}

export function getRecognitionErrorMessage(err) {
  if (
    err === "o rosto idenficado está usando máscara" ||
    err === "o rosto idenficado está usando chapéu" ||
    err === "o rosto idenficado está usando óculos de sol" ||
    err === "o rosto idenficado está usando óculos" ||
    err === "o rosto idenficado está com a boca aberta"
  ) {
    return "message.removeAccessories";
  }

  return "message.frameFace";
}

export function getUUID() {
  var uuidValue = "",
    k,
    randomValue;
  for (k = 0; k < 32; k++) {
    randomValue = (Math.random() * 16) | 0;

    if (k == 8 || k == 12 || k == 16 || k == 20) {
      uuidValue += "-";
    }
    uuidValue += (k == 12 ? 4 : k == 16 ? (randomValue & 3) | 8 : randomValue).toString(16);
  }
  return uuidValue;
}
