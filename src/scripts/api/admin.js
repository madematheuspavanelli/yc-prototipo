const admin = instance => ({
  listGuests: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .get("/Admin/guests", {
          params: data
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  dashboard: () =>
    new Promise((resolve, reject) =>
      instance.$http
        .get("/Admin/dashboard")
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  getHotelSettings: () =>
    new Promise((resolve, reject) =>
      instance.$http
        .get("/Admin/hotel/config")
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  updateHotelSettings: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/Admin/hotel/config", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  login: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/Admin/login", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  listReservations: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .get("/Admin/reservations", {
          params: data
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  getReservation: id =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/Admin/reservations/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  reservationsPeriod: (start, end) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/Admin/reservationsPeriod?Start=${start}&End=${end}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  getGuest: id =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/Admin/guests/${id}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    ),
  createExpense: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/Admin/payment", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  listExpense: (userId, bookingId) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/Admin/transaction/?bookingId=${bookingId}&userId=${userId}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error))
    )
});

export default admin;
