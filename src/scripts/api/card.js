const card = instance => ({
  saveCard: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/transaction/card", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  transaction: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/transaction", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    )
});

export default card;
