// import { useRef } from "react";
import { ChartBar } from "./components/chartjs";
import { useDataProvider } from "./provider/dataChart";
import './style.css'
import { labels } from "./labels";

interface DataType {
  labels: string[];
  datasets: [
    {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      datalabels: {
        anchor: string;
      }
    }
  ]
}

function App() {

  const { dataApi } = useDataProvider();

  console.log(dataApi, "data api")

  const graphData = Array(labels.length).fill(0)

  const graphBackgroundColors = [
    "RGB(244, 67, 54, 0.8)",
    "RGB(15, 255, 12, 0.8)",
    "RGB(21, 101, 192, 0.8)",
    "RGB(255, 255, 0, 0.8)",
    "RGB(255, 192, 203, 0.8)",
    "RGB(128, 0, 128, 0.8)",
    "RGB(255, 165, 0, 0.8)",
    "RGB(12, 255, 180, 0.8)",
    "RGB(165, 42, 42, 0.8)",
    "RGB(128, 128, 128, 0.8)"
  ]

  const graphBorderColors = [
    "RGB(255, 0, 0, 1)",
    "RGB(0, 255, 0, 1)",
    "RGB(0, 0, 255, 1)",
    "RGB(255, 255, 0, 1)",
    "RGB(255, 192, 203, 1)",
    "RGB(128, 0, 128, 1)",
    "RGB(255, 165, 0, 1)",
    "RGB(0, 255, 255, 1)",
    "RGB(165, 42, 42, 1)",
    "RGB(128, 128, 128, 1)"
  ]

  const data: DataType = {
    labels: labels,
    datasets: [
      {
        data: graphData,
        backgroundColor: graphBackgroundColors,
        borderColor: graphBorderColors,
        borderWidth: 1,
        datalabels: {
          anchor: "start"
        },
      },
    ],
  };


  // function recorder() {
  //   navigator.mediaDevices.getDisplayMedia({
  //     video: true,
  //     audio: false,
  //   })
  //   .then((stream) => {

  //     console.log(stream, 'STREAM')
  //     const canvasElt = document.querySelector("canvas");
  //     const streamCanva = canvasElt.captureStream(); // 25 FPS
      
  //     const recorder = new MediaRecorder(stream)
  //     const buffer: BlobPart[] | undefined = []

  //     console.log(canvasElt, "element")
  //     console.log(streamCanva, "canva")

  //     recorder.addEventListener('dataavailable', (event) => {
  //       buffer.push(event.data)
  //     })

  //     recorder.start()

  //     recorder.addEventListener('stop', () => {
  //       const blob = new Blob(buffer, {
  //         type: 'video/mp4'
  //       })

  //       const a = document.createElement('a')
  //       a.href = URL.createObjectURL(blob);
  //       a.download = 'record.mp4'
  //       a.click();
  //     })
  //   })
  // }

  // console.log(refChart, "asdaadasdasdsa")

  // function recorder2() {
  //   console.log("chamou")
  //   const canvasElt = document.querySelector("canvas");
  //   const streamCanva = canvasElt!.captureStream();
  //   const recorder = new MediaRecorder(streamCanva)
  //   const chunks: BlobPart[] | undefined = []
  //   recorder.ondataavailable = (e) => chunks.push(e.data)

  //   recorder.ondataavailable = (e) => {
  //     chunks.push(e.data);
  //     console.log(chunks); // Verifica se os chunks estão sendo adicionados corretamente
  //   };

  //   recorder.start();

  //   setTimeout(() => {
  //       recorder.onstop = () => exportVideo(new Blob(chunks, {type: "video/webm"}));
  //       recorder.stop();
  //   }, 5000);
    
  // }

  // function exportVideo(blob: Blob | MediaSource){
  //   console.log(blob)
  //   const vid = document.createElement('video');
  //   vid.src = URL.createObjectURL(blob);
  //   vid.controls = true;
  //   document.body.appendChild(vid);
  //   const a = document.createElement('a');
  //   a.download = 'myvid.webm';
  //   a.href = vid.src;
  //   a.textContent = 'download the video';
  //   document.body.appendChild(a);
  // }
  
  return (
    <>
    {
      Object.keys(dataApi).length !== 0 && 
      <>
        <ChartBar labels={labels} data={data} apiData={dataApi} />
        {/* <button onClick={recorder2}>BUTTON</button> */}
      </>
    }
    </>
  )
}

export default App;
