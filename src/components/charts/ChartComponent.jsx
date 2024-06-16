'use client'
import { Line, Pie, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables as registerablesChartJS } from 'chart.js';
import 'chartjs-adapter-luxon';
import { useState, useEffect } from 'react'

const ChartComponent = ({ data, options, type }) => {
    const [typeOfChart, setTypeOfChart] = useState(type)

    ChartJS.register(...registerablesChartJS);

    ChartJS.defaults.font = {
        family: 'Lexend, sans-serif',
        size: 14,
        style: 'normal',
        weight: 'normal',
        lineHeight: 1.2,
    };

    useEffect(() => {
        if (!type) {
            const typeOrder0 = data.datasets.map(dataset => dataset.type)[0];
            setTypeOfChart(typeOrder0);
        } else {
            setTypeOfChart(type);
        }
    }, [type, data]);

    return (
        <div style={{ width: '100%', height: '100%' }}>

            {data && options
                ? <div style={{ width: '100%', height: '100%' }}>
                    {typeOfChart == 'line' && <Line datasetIdKey='id' data={data} options={options} style={{ width: '100%', height: '100%' }}></Line>}
                    {typeOfChart == 'pie' && <Pie datasetIdKey='id' data={data} options={options} style={{ width: '100%', height: '100%' }}></Pie>}
                    {typeOfChart == 'doughnut' && <Doughnut datasetIdKey='id' data={data} options={options} style={{ width: '100%', height: '100%' }}></Doughnut>}
                    {typeOfChart == 'bar' && <Bar datasetIdKey='id' data={data} options={options} style={{ width: '100%', height: '100%' }}></Bar>}
                </div>
                : <p>'No hay ningún gráfico para mostrar'</p>
            }

        </div>
    )
}

export default ChartComponent

