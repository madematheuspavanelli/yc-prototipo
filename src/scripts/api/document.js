const document = instance => ({
  documentRecognition: data =>
    new Promise((resolve, reject) =>
      instance.$http
        .post("/document/recognize", data)
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error))
    )
});

export default document;
