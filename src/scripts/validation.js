import moment from "moment";

export const validateMinTomorrow = value => {
  const today = new Date();
  const parsed = value
    .split("/")
    .reverse()
    .join("-");
  const date = new Date(parsed);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return today.getTime() <= date.getTime();
};

export const validateMinLength = {
  params: ["length"],
  validate(value, args) {
    return value.length >= args.length;
  }
};

export const validateDate = value => {
  return moment(value, "DD/MM/YYYY", true).isValid();
};

export const validateFullName = value => {
  const nameList = value.split(" ");
  if (nameList.length < 2) {
    return false;
  }
  return nameList[0].length >= 2 && nameList[1].length >= 2;
};

export const validateCpf = rawValue => {
  if (typeof rawValue !== "string") {
    return false;
  }
  const cpf = rawValue.replace(/[\s.-]*/gim, "");
  if (
    !cpf ||
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false;
  }
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) {
    resto = 0;
  }
  if (resto != parseInt(cpf.substring(9, 10))) {
    return false;
  }
  soma = 0;
  for (let j = 1; j <= 10; j++) {
    soma = soma + parseInt(cpf.substring(j - 1, j)) * (12 - j);
  }
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) {
    resto = 0;
  }
  if (resto != parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
};

export const validateTerms = value => value === true;
