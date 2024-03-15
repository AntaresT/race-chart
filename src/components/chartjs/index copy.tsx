/* eslint-disable @typescript-eslint/no-explicit-any */
// https://www.chartjs.org/docs/2.9.4/developers/plugins.html
// https://stackoverflow.com/questions/4781602/capturing-html5-canvas-output-as-video-or-swf-or-png-sequence
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  Legend,
  LinearScale,
  PluginChartOptions,
  ScaleChartOptions,
  Title,
  Tooltip,
  TooltipItem,
  BarControllerChartOptions,
} from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
);

type OptionsType = BarControllerChartOptions &
    CoreChartOptions<'bar'> &
    ElementChartOptions<'bar'> &
    PluginChartOptions<'bar'> &
    DatasetChartOptions<'bar'> &
    ScaleChartOptions<'bar'>
;

interface DataInterface {
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
    },
  ],
}

interface DataInterfaceApi {
  date: string;
  values:{
    coca: number;
    monster: number;
    agua: number;
    suco: number;
    redbull: number;
    fanta: number
  } 
}

interface DataChartInterface {
  data: DataInterface
}

interface Props {
  className?: string;
  stacked?: boolean;
  labels: string[];
  data: DataInterface;
  apiData: DataInterfaceApi[];
  callbackTooltipLabel?: (context: TooltipItem<'bar'>) => string;
  callbackTooltipTitle?: (context: TooltipItem<'bar'>[]) => string;
}

export function ChartBar({data, stacked = false, apiData}: Props) {

  let countNumber: number = 0
  const chartRef = useRef(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
 
  const afterPlugin = {
    id: 'race',
    beforeInit: () => {
      startRecording();
    },
    afterRender: (chart: any) => {
      const chartData = chart.config._config
      handleUpdateData(chartData, chart, apiData)
    },
  }

  const plugins = [
    afterPlugin,
  ]

  const options = {
    responsive: true,
    interaction: {
      mode: 'x' as const,
      intersect: false,
    },
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked,
        grid: {
          display: false,
        },
      },
      y: {
        stacked,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
    animations: {
      onComplete: ({initial}: {initial: any}) => {
        if (initial) console.log(initial, 'acabou')
      }
    }
  } as unknown as OptionsType;

  // function recorder2() {
  //   const canvasElt = document.querySelector("canvas");
  //   const streamCanva = canvasElt!.captureStream();
  //   const recorder = new MediaRecorder(streamCanva)
  //   const chunksSeted: BlobPart[] | undefined = []

  //   recorder.ondataavailable = (e) => { chunksSeted.push(e.data); };
  //   setChunks(chunksSeted)
    
  //   recorder.start();

  //   setTimeout(() => {
  //     recorder.onstop = () => exportVideo(new Blob(chunks, {type: "video/webm"}));
  //     recorder.stop();
  //   }, 15000);

  // }

  // function exportVideo(blob: Blob | MediaSource){
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

  function handleUpdateData(data: DataChartInterface, chart: any, fromApi: DataInterfaceApi[]) {

    setInterval(() => {
      const merged = data.data.labels.map((_, i) => {
        return {
          'labels': data.data.labels[i],
          'dataPoints': data.data.datasets[0].data[i],
          'backgroundColor': data.data.datasets[0].backgroundColor[i],
          'borderColor': data.data.datasets[0].borderColor[i]
        }
      })

      const labelRace: string[] = [];
      const dataRaceArray: number[] = [];
      const bgColorRace: string[] = [];
      const borderColorRace: string[] = [];

       const dataSort = merged.sort((b, a) => {
        return a.dataPoints - b.dataPoints
      });

      for(let count = 0; count < dataSort.length; count++ ){
        labelRace.push(dataSort[count].labels);
        dataRaceArray.push(dataSort[count].dataPoints);
        bgColorRace.push(dataSort[count].backgroundColor);
        borderColorRace.push(dataSort[count].borderColor)
      }

      data.data.labels = labelRace;
      data.data.datasets[0].data = dataRaceArray;
      data.data.datasets[0].backgroundColor = bgColorRace;
      data.data.datasets[0].borderColor = borderColorRace;
      
      if(countNumber !== fromApi.length + 1) {    
        countNumber+=1

        dataRaceArray[labelRace.indexOf("coca")] = fromApi[countNumber].values.coca
        dataRaceArray[labelRace.indexOf("monster")] = fromApi[countNumber].values.monster
        dataRaceArray[labelRace.indexOf("agua")] = fromApi[countNumber].values.agua
        dataRaceArray[labelRace.indexOf("suco")] = fromApi[countNumber].values.suco
        dataRaceArray[labelRace.indexOf("redbull")] = fromApi[countNumber].values.redbull
        dataRaceArray[labelRace.indexOf("fanta")] = fromApi[countNumber].values.fanta

        chart.update();
      }
      
      if(countNumber === fromApi.length + 1){
        console.log(countNumber, "countNumber")
        console.log(fromApi.length, 'fromApi')
        stopRecording();
        exportVideo();
      }

      chart.update();
      
    }, 2000)

  }
  console.log(chartRef, "chart ref")

  const startRecording = () => {
    console.log('começou a gravar')
    if(recorder){
      recorder.start();
    }else{
      console.error('Recorder não iniciado')
    }
  }

  const stopRecording = () => {
    console.log('parou de gravar')
    if(recorder && recorder.state !== 'inactive'){
      recorder.stop();
    }else{
      console.error('Recorder não está gravando');
    }
  }

  function exportVideo(){
    console.log('chamouExport = ', chunks)
    if(chunks.length > 0){
      const blob = new Blob(chunks, { type: 'video/webm'})
      // const url = URL.createObjectURL(blob)
      const vid = document.createElement('video');
      vid.src = URL.createObjectURL(blob);
      vid.controls = true;
      document.body.appendChild(vid);
      const a = document.createElement('a');
      a.download = 'myvid.webm';
      a.href = vid.src;
      a.textContent = 'download the video';
      document.body.appendChild(a);
    }
  } 

  useEffect(() => {
    const canvasElmnt = document.querySelector('canvas')
    if(!canvasElmnt) {
      console.log("Not found element")
      return
    }
    const streamCanva = canvasElmnt.captureStream()
    const mediaRecorder = new MediaRecorder(streamCanva)
    // mediaRecorder.ondataavailable = (e) => {
    //   if(e.data.size > 0){
    //     setChunks((prevChunks) => [...prevChunks, e.data]);
    //     console.log(chunks)
    //   }
    // }
    mediaRecorder.ondataavailable = (e) => { chunks.push(e.data); };

    mediaRecorder.start()

    setRecorder(mediaRecorder)

    return () => {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.stop();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Bar options={options} plugins={plugins} data={data} ref={chartRef} />
    </div>
  );
}
