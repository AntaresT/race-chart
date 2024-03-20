# React Race Chart With ChartJS

This project was created to resolve the gap to have a race chart and export it as a webm video.
The export code was created using the MediaRecorder with JavaScript, that allows to record the screen
and more specific part of the screen, in this case, the canvas tag that is responsible to show the Chart.

## How to run
```bash 
  npm install 
```
To install all dependencies.

Consider using PNPM for a faster installation
> https://pnpm.io/

After the installation  you can use

```bash
  npm run dev
```
or 

```bash
  pnpm run dev
```

This project uses JSON Server to store the mockup data.
After started the project you can run the following command
```bash
  npx json-server db.json
```
> db.json is the name of the file that contains the data


## Dependencies 
- [React Chart JS](https://react-chartjs-2.js.org/)
- [ChartJS](https://www.chartjs.org/)
- [JSON Server](https://github.com/typicode/json-server)
  
