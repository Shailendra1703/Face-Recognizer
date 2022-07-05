const screen = document.getElementById("screen");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("models"),
  faceapi.nets.faceExpressionNet.loadFromUri("models"),
]).then(startScreen);

function startScreen() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (screen.srcObject = stream),
    (err) => console.log(err)
  );
}

screen.addEventListener("play", () => {
  console.log("The video is playing");
  const canvas = faceapi.createCanvasFromMedia(screen);
  document.body.append(canvas);
  const displaySize = { width: screen.width, height: screen.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(screen, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
    console.log(detections);

    const resizeDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizeDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
    // faceapi.draw.drawAgeAndGender(canvas, resizeDetections);
  }, 100);
});
