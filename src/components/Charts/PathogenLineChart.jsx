import {React, useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis 
  PointElement,
  Legend
} from 'chart.js'; 

ChartJS.register(  
  LineElement,
  CategoryScale, 
  LinearScale, 
  PointElement,
  Legend)

  export default function PathogenLineChart() {
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
      const [id_maquina, setIDMaquina] = useState('AA-202310-001');
  
    useEffect(() => {
      // Replace 'API_URL' with the actual API endpoint
      async function fetchData() {
        const response = await fetch('http://37.187.176.243:8001/get_machine_predictions?serial_num='+id_maquina+'&range='+range);
        const resData = await response.json();
        const resChartData = {
          labels: resData.map((item,index) => item.TIME_STAMP),
          datasets: [
            {
              label: 'Aeromonas',
              data: resData.map(item => JSON.parse(item.PRED_BA).asalmonicida),
              borderColor: 'rgba(27, 156, 247, 0.8)',
            },
            {
              label: 'Photobactereum',
              data: resData.map(item => JSON.parse(item.PRED_BA).pddamselae),
              borderColor: 'rgba(28, 227, 255, 0.76)',
            },
            {
              label: 'Staphyloccocus',
              data: resData.map(item => JSON.parse(item.PRED_BA)['staphylo-']),
              borderColor: 'rgba(75, 192, 192, 1)',
            }
          ]}
        setChartData(resChartData);
      }
      fetchData();
    }, [range, id_maquina]);
  
    console.log("chartData", chartData)
  
    const options = {
      maintainAspectRatio: true,
      tension: 0.4,
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50,
        },
      },
    };

  
    return (
      <div>
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
          <option value='AA-202310-001'> Machine 1 </option>
          <option value='AA-202310-002'> Machine 2 </option>
          <option value='AA-202310-003'> Machine 3 </option>
        </select>

        <Line data={chartData} options={options} />
      </div>
    );
  }
  
