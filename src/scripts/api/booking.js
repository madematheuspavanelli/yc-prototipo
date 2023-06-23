const booking = instance => ({
  searchGuest: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .get("/booking/guests/search", {
          params: data
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  searchGuestReserve: (data, step) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/booking/guests/?reservationNumber=${data}&step=${step}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  searchGuestDoc: (type, number) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/booking/guest?type=${type}&number=${number}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    ),
  getBooking: (id, step) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/booking/${id}?requireRoomNumber=true&step=${step}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    ),
  getBookingGuestList: (id, step) =>
    new Promise((resolve, reject) =>
      instance.$http
        .get(`/booking/${id}/guests?step=${step}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        })
    )
});

export default booking;
