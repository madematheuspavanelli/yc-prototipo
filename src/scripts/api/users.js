const user = instance => ({
  getUser: id =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/user/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  getUserByCPF: cpf =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/user/cpf/${cpf}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  userRecognition: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/user/photo", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  newUser: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/user", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  updateUser: (data, id) =>
    new Promise((resolve, reject) =>
      instance.$http
        .put(`/user/${id}`, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  registerCard: (data, id) =>
    new Promise((resolve, reject) =>
      instance.$http
        .patch(`/user/${id}/card`, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  getCard: id =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/user/${id}/cards`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  registerDocument: (id, data) =>
    new Promise((resolve, reject) =>
      instance.$http
        .post(`/user/${id}/document`, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  documentExist: id =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/user/${id}/document`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  registerInvoice: (id, bookingId, step, data) =>
    new Promise((resolve, reject) =>
      instance.$http
        .post(`/user/${id}/invoice?step=${step}&bookingId=${bookingId}`, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  registerSignature: (id, data) =>
    new Promise((resolve, reject) =>
      instance.$http
        .patch(`/user/${id}/signature`, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    )
});

export default user;
