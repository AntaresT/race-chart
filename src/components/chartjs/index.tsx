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
import { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { labels } from '../../labels';


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
  values: any 
}

// interface DataInterfaceApi {
//   date: string;
//   values:{
//     "001BC50169D7": number,
//     "B4A2EB48A5BA": number,
//     "001BC5017236": number,
//     "001BC5017BF2": number,
//     "001BC5017BB5": number,
//     "001BC501EC2B": number,
//     "001BC5021D57": number,
//     "001BC5021D5A": number, 
//     "001BC5023789": number,
//     "001BC5024096": number
//   } 
// }

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
  let recorderMedia: any = {}
  const chunksSeted: BlobPart[] = []


  const afterPlugin = {
    id: 'race',
    afterInit: () => {
      recorder();
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
  } as unknown as OptionsType;

  function recorder ()  {

    const canvasElt: HTMLCanvasElement | null = document.querySelector("canvas");
    const streamCanva = canvasElt!.captureStream();
    recorderMedia = new MediaRecorder(streamCanva)

    recorderMedia.ondataavailable = (e: any) => { 
      chunksSeted.push(e.data); 
    };
    recorderMedia.start();
    
  }

  const exportVideo = (blob: Blob | MediaSource) =>{
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    vid.controls = true;
    document.body.appendChild(vid);
    const a = document.createElement('a');
    a.download = 'race-chart.webm';
    a.href = vid.src;
    a.textContent = 'download the video';
    document.body.appendChild(a);
  }

  function handleUpdateData(data: DataChartInterface, chart: any, fromApi: DataInterfaceApi[]) {

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
      
      if(countNumber !== fromApi.length+1) {    
        
        if(fromApi[countNumber] !== undefined) {
          dataRaceArray[labelRace.indexOf(labels[0])] = fromApi[countNumber].values[labels[0]]
          dataRaceArray[labelRace.indexOf(labels[1])] = fromApi[countNumber].values[labels[1]]
          dataRaceArray[labelRace.indexOf(labels[2])] = fromApi[countNumber].values[labels[2]]
          dataRaceArray[labelRace.indexOf(labels[3])] = fromApi[countNumber].values[labels[3]]
          dataRaceArray[labelRace.indexOf(labels[4])] = fromApi[countNumber].values[labels[4]]
          dataRaceArray[labelRace.indexOf(labels[5])] = fromApi[countNumber].values[labels[5]]
          dataRaceArray[labelRace.indexOf(labels[6])] = fromApi[countNumber].values[labels[6]]
          dataRaceArray[labelRace.indexOf(labels[7])] = fromApi[countNumber].values[labels[7]]
          dataRaceArray[labelRace.indexOf(labels[8])] = fromApi[countNumber].values[labels[8]]
          dataRaceArray[labelRace.indexOf(labels[9])] = fromApi[countNumber].values[labels[9]]

  
          chart.update();
        }
        countNumber+=1
        
        chart.update();
      }else{
        chart.update();
        clearInterval(timer)
        recorderMedia.onstop = () => exportVideo(new Blob(chunksSeted, {type: "video/webm"}));
        recorderMedia.stop();
      }
    }, 2000)

  }

  return (
    <div ref={chartRef}>
      <Bar options={options} plugins={plugins} data={data}  />
    </div>
  );
}
