// import { useRef } from "react";
import { ChartBar } from "./components/chartjs";
import { useDataProvider } from "./provider/dataChart";
import './style.css'

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

  const labels = ['coca', 'monster', 'agua', 'suco', 'redbull', 'fanta'];

  const graphData: number[] = [0,0,0,0,0,0];

  const graphBackgroundColors = [
    'rgba(158, 158, 158, 0.8)',
    'rgba(244, 67, 54, 0.8)',
    'rgba(255, 235, 59, 0.8)',
    'rgba(255, 152, 0, 0.8)',
    'rgba(76, 175, 80, 0.8)',
    'rgba(21, 101, 192, 0.8)'
  ]

  const graphBorderColors = [
    'rgba(158, 158, 158, 1)',
    'rgba(244, 67, 54, 1)',
    'rgba(255, 235, 59, 1)',
    'rgba(255, 152, 0, 1)',
    'rgba(76, 175, 80, 1)',
    'rgba(21, 101, 192, 1)'
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
