import {React, useState, useEffect} from 'react';

import { lineCustomSeries, LinePrimaryXAxis, LinePrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis 
  PointElement
} from 'chart.js'; 

ChartJS.register(  
  LineElement,
  CategoryScale, 
  LinearScale, 
  PointElement)

  export default function LineChart() {
    const [chartData, setChartData] = useState({labels: [],
      datasets: [
        {
          label: 'Data',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ]}); // Initialize chartdata with empty data

      const [range, setRange] = useState('30');
      const [id_maquina, setIDMaquina] = useState('489');
  
    useEffect(() => {
      // Replace 'API_URL' with the actual API endpoint
      async function fetchData() {
        const response = await fetch('http://37.187.176.243:8001/get_machine_variables?topic=estat&range='+range+'&id_maquina='+id_maquina);
        const resData = await response.json();
        const resChartData = {
          labels: resData.map((item,index) => item.TIME_STAMP),
          datasets: [
            {
              label: 'Data',
              data: resData.map(item => item.TEMP_ACT),
              borderColor: 'rgba(75, 192, 192, 1)',
            },
          ]}
        setChartData(resChartData);
      }
      fetchData();
    }, [range, id_maquina]);
  
    console.log("chartData", chartData)
  
    const options = {
      maintainAspectRatio: true,
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 25,
          bottom: 50,
        },
      }
    };

  
    return (
      <div>
        <h2 class="centered-text">Temperature Chart</h2>
        <select onChange={(e)=>{
          setRange(e.target.value);
        }}> 
          <option value='30'> 30 days </option>
          <option value='7'> 7 days </option>
          <option value='1'> 1 day </option>
        </select>

        <select onChange={(e)=>{
          setIDMaquina(e.target.value);
        }}> 
          <option value='489'> Machine 1 </option>
          <option value='490'> Machine 2 </option>
          <option value='506'> Machine 3 </option>
        </select>
        <Line data={chartData} options={options} />
      </div>
    );
  }
  
