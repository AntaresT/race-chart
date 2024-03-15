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
    // beforeInit: () => {
    //   recorder2();
    // },
    afterRender: (chart: any) => {
      console.log("chamou o after render")
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

  // const startRecording = () => {
  //   console.log('começou a gravar')
  //   if(recorder){
  //     recorder.start();
  //   }else{
  //     console.error('Recorder não iniciado')
  //   }
  // }

  const recorder2 = () => {
    console.log("RECORDER INICIOU")
    console.log(chartRef.current)
    const canvasElt: HTMLCanvasElement | null = document.querySelector("canvas");
    const streamCanva = canvasElt!.captureStream();
    const recorderMedia = new MediaRecorder(streamCanva)
    const chunksSeted: BlobPart[] | undefined = []

    console.log(recorder, 'RECORDER STATE')
    console.log(recorderMedia.state, 'MEDIA STATE')

    recorderMedia.ondataavailable = (e) => { 
      console.log(e.data, 'DATA')
      chunksSeted.push(e.data); 
    };

    recorderMedia.start();

    console.log(chunksSeted, "CHUNKS SETED")

    setRecorder(recorderMedia)
    setChunks(chunksSeted)

    // setTimeout(() => {
    //   recorderMedia.onstop = () => exportVideo(new Blob(chunksSeted, {type: "video/webm"}));
    //   recorderMedia.stop();
    // }, 15000); 
  }

  const exportVideo = (blob: Blob | MediaSource) =>{
    console.log(blob, 'Blob from export')
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

  function handleUpdateData(data: DataChartInterface, chart: any, fromApi: DataInterfaceApi[]) {

    console.log("atualizando")
    const timer = setInterval(() => {
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
      
      if(countNumber !== fromApi.length) {    
        console.log(countNumber, 'COUNT NUMBER')
        countNumber+=1

        dataRaceArray[labelRace.indexOf("coca")] = fromApi[countNumber].values.coca
        dataRaceArray[labelRace.indexOf("monster")] = fromApi[countNumber].values.monster
        dataRaceArray[labelRace.indexOf("agua")] = fromApi[countNumber].values.agua
        dataRaceArray[labelRace.indexOf("suco")] = fromApi[countNumber].values.suco
        dataRaceArray[labelRace.indexOf("redbull")] = fromApi[countNumber].values.redbull
        dataRaceArray[labelRace.indexOf("fanta")] = fromApi[countNumber].values.fanta

        chart.update();
      }else{
        console.log("else do handle update")        
        clearInterval(timer)
      }
      // chart.update();
    }, 2000)

  }

  console.log(chartRef, "chart ref")

  // const stopRecording = () => {
  //   console.log('parou de gravar')
  //   if(recorder && recorder.state !== 'inactive'){
  //     recorder.stop();
  //   }else{
  //     console.error('Recorder não está gravando');
  //   }
  // }

  // const exportVideo = () => {
  //   console.log('chamouExport = ', chunks)
  //   if(chunks.length > 0){
  //     const blob = new Blob(chunks, { type: 'video/webm'})
  //     // const url = URL.createObjectURL(blob)
  //     const vid = document.createElement('video');
  //     vid.src = URL.createObjectURL(blob);
  //     vid.controls = true;
  //     document.body.appendChild(vid);
  //     const a = document.createElement('a');
  //     a.download = 'myvid.webm';
  //     a.href = vid.src;
  //     a.textContent = 'download the video';
  //     document.body.appendChild(a);
  //   }else{
  //     console.error('nenhum dado pra gravar')
  //   }
  // } 

  useEffect(() => {
    console.log('useEffect')
  
    // const canvasElmnt = document.querySelector('canvas')
    // if(!canvasElmnt) {
    //   console.log("Not found element")
    //   return
    // }
    
    // const streamCanva = canvasElmnt.captureStream()
    // const mediaRecorder = new MediaRecorder(streamCanva)
    // const chunksSeted: BlobPart[] | undefined = []

    // mediaRecorder.ondataavailable = (e) => chunksSeted.push(e.data)

    // setChunks(chunksSeted)
    // // mediaRecorder.ondataavailable = (e) => {
    // //   setChunks((prevChunks) => [...prevChunks, e.data])
    // // }

    // mediaRecorder.start()

    // setRecorder(mediaRecorder)

    // return () => {
    //   mediaRecorder.ondataavailable = null;
    //   mediaRecorder.stop();
    // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={chartRef}>
      <Bar options={options} plugins={plugins} data={data}  />
    </div>
  );
}
