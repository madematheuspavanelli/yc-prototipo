const transaction = instance => ({
  realizeTransaction: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/transaction", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    )
});

export default transaction;
