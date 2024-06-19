import { useState, useEffect } from 'react'
import { Chart as ChartJS, registerables as registerablesChartJS } from 'chart.js'
import LineDataset from './LineDatasets'
import PieDoughnutDatasets from './PieDatasets'
import BarDataset from './BarDatasets'
import ScalesForm from './ScalesForm'
import 'chartjs-adapter-luxon'
import { updateChartOpt, updateChartScaleOpt, dateLabel, modifyDataset } from '@/utils/helpers'
import { lineChartData, pieChartData, barChartData, basicChartOptions, basicChartOptionsR } from '@/utils/chart-settings'

export default function ChartForm({ data, status, onFinalData, onFinalOptions, onChartType }) {
    const [options, setOptions] = useState({})
    const [chartDataset, setChartDataset] = useState({})
    const [datasets, setDatasets] = useState([])
    const [chartData, setChartData] = useState(null)
    const [chartType, setChartType] = useState('line')
    const [datasetTypes, setDatasetTypes] = useState(['line'])
    const [chartOptions, setChartOptions] = useState(null)
    const [processedXAxisIds, setProcessedXAxisIds] = useState(new Set())
    const [processedYAxisIds, setProcessedYAxisIds] = useState(new Set())

    useEffect(() => {
        if (data) {
            const labels = []
            const datasets = []
            const datasetLabel = []
            const datasetData = []
            let datasetKey

            data.forEach(row => {
                Object.entries(row).forEach(([key, value]) => {

                    if (key.includes('MAX') || key.includes('MIN') || key.includes('AVG')
                        || key.includes('SUM') || key.includes('COUNT')) {

                        labels.push(key)

                        let match = key.match(/\(([^)]+)\)/)
                        if (match) datasetKey = match[1]

                        if (!datasetLabel.includes(datasetKey)) datasetLabel.push(datasetKey)

                        datasetData.push(value)

                    } else {
                        if (value instanceof Date || typeof value == 'string') {
                            labels.push(value)

                        } else {
                            const existingDatasetIndex = datasets.findIndex(dataset => dataset.label === key)

                            existingDatasetIndex !== -1
                                ? datasets[existingDatasetIndex].data.push(value)
                                : datasets.push({ label: key, data: [value] })
                        }
                    }
                })
            })

            console.log(datasetData, datasetLabel)

            if (datasets.length == 0) datasets.push(({ label: datasetLabel, data: datasetData }))

            if (labels.length == 0) datasets.forEach(dataset => labels.push(dataset.label))

            const newChartData = {
                labels: labels,
                datasets: datasets
            }

            setChartData(newChartData)
            console.log('DATOS DEL GRAFICO: ', newChartData)
        }
    }, [data])



    useEffect(() => {
        if (chartData && status === 'new') {
            let baseObject
            let type
            let newType = chartType
            setChartOptions(basicChartOptions)
            const construction = chartData.datasets.map((dataset, index) => {
                console.log(datasetTypes[index])
                const currentType = datasetTypes[index] ? datasetTypes[index] : chartType
                switch (currentType) {
                    case 'line':
                        baseObject = lineChartData.datasets[0]
                        chartData.labels = dateLabel(chartData)
                        type = 'line'
                        break
                    case 'pie':
                        baseObject = pieChartData.datasets[0]
                        chartData.labels = dateLabel(chartData)
                        type = 'pie'
                        break
                    case 'doughnut':
                        baseObject = pieChartData.datasets[0]
                        chartData.labels = dateLabel(chartData)
                        baseObject[type] = 'doughnut'
                        type = 'doughnut'
                        break
                    case 'bar':
                        baseObject = barChartData.datasets[0]
                        chartData.labels = dateLabel(chartData)
                        type = 'bar'
                        break
                    default:
                        return null
                }
                return { ...baseObject, type: type, label: dataset.label, data: dataset.data }
            })


            setChartOptions(basicChartOptions)
            setChartData({ ...chartData, datasets: construction })
            onChartType(newType)
        }
    }, [datasetTypes, status])

    useEffect(() => {
        onFinalOptions(chartOptions)
    }, [chartOptions])

    const scalesForms = chartData && chartData.datasets.map((dataset, index) => {
        const { xAxisID, yAxisID } = dataset
        let showXAxisForm = false
        let showYAxisForm = false

        if (dataset.type && (dataset.type === 'line' || dataset.type === 'bar')) {
            if (xAxisID && processedXAxisIds.has(xAxisID)) {
                showXAxisForm = true
            }
            if (yAxisID && processedYAxisIds.has(yAxisID)) {
                showYAxisForm = true
            }
        }
        return (
            <div key={index}>
                {showXAxisForm && (
                    <ScalesForm
                        axisId={xAxisID}
                        axis='x'
                        datasetType={dataset.type}
                        chartLabels={chartData.labels}
                        onOptionsChange={(opt) => updateChartScaleOpt(opt, xAxisID, chartOptions, setChartOptions)}
                    />
                )}
                {showYAxisForm && (
                    <ScalesForm
                        axisId={yAxisID}
                        axis='y'
                        datasetType={dataset.type}
                        chartLabels={chartData.labels}
                        onOptionsChange={(opt) => updateChartScaleOpt(opt, yAxisID, chartOptions, setChartOptions)}
                    />
                )}
            </div>
        )
    })

    useEffect(() => {
        if (chartData && chartData.datasets) {
            chartData.datasets.forEach(dataset => {
                const { xAxisID, yAxisID } = dataset
                if (dataset.type && (dataset.type === 'line' || dataset.type === 'bar')) {
                    if (xAxisID && !processedXAxisIds.has(xAxisID)) {
                        setProcessedXAxisIds(prevIds => new Set([...prevIds, xAxisID]))
                    }
                    if (yAxisID && !processedYAxisIds.has(yAxisID)) {
                        setProcessedYAxisIds(prevIds => new Set([...prevIds, yAxisID]))
                    }
                }
            })
        }
        onFinalData(chartData)
    }, [chartData])



    useEffect(() => {
        if (chartData != null && chartData.datasets != null) {
            const newDatasets = chartData.datasets.map((dataset) => ({
                ...dataset,
                type: chartType,
            }))
            setDatasetTypes(newDatasets.map(() => chartType))
            setChartData({ ...chartData, datasets: newDatasets })
        }
    }, [chartType])



    return (
        <form className="chart-form">
            <div className='chart-form-container'>
                <div className='chart-form-scroll'>
                    <div>
                        <fieldset>
                            <legend>Type: </legend>
                            <div className='form-row'>
                                <label htmlFor="type">
                                    Chart type: </label>
                                <select name='type' onChange={(e) => setChartType(e.target.value)}>
                                    <option value='undefined'>--Select a chart type--</option>
                                    <option value='line'>Line</option>
                                    <option value='pie'>Pie</option>
                                    <option value='doughnut'>Doughnut</option>
                                    <option value='bar'>Bar</option>
                                </select>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Title </legend>
                            <div className='form-row'>
                                <label htmlFor="plugins-title-text">
                                    Chart title:</label>
                                <input type='plugins-title-text' placeholder="Type a title for the chart"
                                    onChange={(e) => updateChartOpt('plugins-title-text', e.target.value, chartOptions, setChartOptions)} />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Legend: </legend>
                            <div className='form-row'>
                                <input type='checkbox' name='plugins-legend-display' value='true' defaultChecked
                                    onChange={(e) => updateChartOpt('plugins-legend-display', e.target.checked, chartOptions, setChartOptions)}></input>
                                <label htmlFor="plugins-legend-display">Enable legend</label>
                                <select name='plugins-legend-position'
                                    onChange={(e) => updateChartOpt('plugins-legend-position', e.target.value, chartOptions, setChartOptions)}>
                                    <option value='null'>--Select the legend position--</option>
                                    <option value='none'>None</option>
                                    <option value='top'>Top</option>
                                    <option value='right'>Right</option>
                                    <option value='left'>Left</option>
                                    <option value='down'>Down</option>
                                </select>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Point information: </legend>
                            <div className='form-row'>
                                <input type='checkbox' name='plugins-tooltip-enabled' value='true' defaultChecked
                                    onChange={(e) => updateChartOpt('plugins-tooltip-enabled', e.target.checked, chartOptions, setChartOptions)}></input>
                                <label htmlFor="plugins-tooltip-enabled">Enable point information when hover</label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Datasets and options: </legend>

                            {chartData && chartData.datasets.map((dataset, index) => (
                                <fieldset key={index}>
                                    <legend>
                                        <div>{dataset?.label}</div>
                                    </legend>

                                    {(chartType == 'line' || datasetTypes[index] == 'line') &&
                                        < LineDataset dataset={dataset} index={index} onTypeChange={(type, index) => {
                                            const newDatasetTypes = [...datasetTypes]
                                            newDatasetTypes[index] = type
                                            setDatasetTypes(newDatasetTypes)
                                            // setChartType(undefined)
                                        }}
                                            onDatasetChange={(updatedDataset) => modifyDataset(index, updatedDataset, chartData, setChartData)} />
                                    }

                                    {(chartType == 'pie' || chartType == 'doughnut' || datasetTypes[index] == 'pie' || datasetTypes[index] == 'doughnut') &&
                                        <PieDoughnutDatasets dataset={dataset} index={index} onTypeChange={(type, index) => {
                                            const newDatasetTypes = [...datasetTypes]
                                            newDatasetTypes[index] = type
                                            setDatasetTypes(newDatasetTypes)
                                            // setChartType(undefined)
                                        }}
                                            onDatasetChange={(updatedDataset) => modifyDataset(index, updatedDataset, chartData, setChartData)} />
                                    }

                                    {(chartType == 'bar' || datasetTypes[index] == 'bar') &&
                                        < BarDataset dataset={dataset} index={index}
                                            onTypeChange={(type, index) => {
                                                const newDatasetTypes = [...datasetTypes]
                                                newDatasetTypes[index] = type
                                                setDatasetTypes(newDatasetTypes)
                                                // setChartType(undefined)
                                            }}
                                            onDatasetChange={(updatedDataset) => modifyDataset(index, updatedDataset, chartData, setChartData)} />
                                    }
                                </fieldset>
                            ))}
                            {/* <button type='button'>Add Dataset</button> */}
                        </fieldset>
                    </div>
                </div>
                <div className='chart-form-scroll'>
                    <div>
                        <fieldset style={{ width: 'auto' }}>
                            <legend>Axis Settings </legend>
                            {scalesForms}
                        </fieldset>
                    </div>
                </div >
            </div >
        </form >
    )
}