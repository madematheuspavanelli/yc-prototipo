const short = {
  year: "numeric",
  month: "numeric",
  day: "numeric"
};

const long = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric"
};

const dateTimeFormats = {
  "pt-BR": {
    short,
    long
  },
  "en-US": {
    short,
    long
  },
  "es-ES": {
    short,
    long
  }
};

export default dateTimeFormats;
