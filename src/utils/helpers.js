import ScalesForm from "@/components/charts/ScalesForm"
// HELPERS FOR SCALES

export const processDatasets = (chartData, updateChartScaleOpt) => {
    return chartData?.datasets.map((dataset, index) => {
        let processedXAxisIds = new Set()
        let processedYAxisIds = new Set()
        let showXAxisForm = false
        let showYAxisForm = false
        const { xAxisID, yAxisID } = dataset

        if (dataset.type && (dataset.type === 'line' || dataset.type === 'bar')) {
            if (xAxisID && !processedXAxisIds.has(xAxisID)) {
                processedXAxisIds.add(xAxisID)
                showXAxisForm = true
            }
            if (yAxisID && !processedYAxisIds.has(yAxisID)) {
                processedYAxisIds.add(yAxisID)
                showYAxisForm = true
            }
        }

        return (
            <div key={index}>
                {showXAxisForm && (
                    <ScalesForm axisId={xAxisID} axis='x' datasetType={dataset.type} chartLabels={chartData.labels}
                        onOptionsChange={(opt) => updateChartScaleOpt(opt, xAxisID)} />
                )}
                {showYAxisForm && (
                    <ScalesForm axisId={yAxisID} axis='y' datasetType={dataset.type} chartLabels={chartData.labels}
                        onOptionsChange={(opt) => updateChartScaleOpt(opt, yAxisID)} />
                )}
            </div>
        )
    })
}

const parseValue = (value, type) => {
    if (type === 'number' || type === 'range') return Number(value)
    switch (value) {
        case 'false':
            return false
        case 'true':
            return true
        case 'undefined':
            return undefined
        case 'null':
            return null
        default:
            return value
    }
}

export const toggleDropdown = (divId, imgId) => {
    const element = document.getElementById(divId)
    const img = document.getElementById(imgId)

    element.style.display === 'none'
        ? element.style.display = 'block'
        : element.style.display = 'none'

    img.style.transform == 'rotate(180deg)'
        ? img.style.transform = 'rotate(0deg)'
        : img.style.transform = 'rotate(180deg)'
}

export const dateLabel = (chartData) => {
    chartData.labels = chartData.labels.map(label => {
        if (label instanceof Date) {
            let date = new Date(label)
            date.toLocaleString()
            return label = date
        } else {
            return label
        }
    })
    return chartData.labels
}

export const modifyDataset = (index, updatedDataset, chartData, setChartData) => {
    setChartData(() => {
        const newDatasets = [...chartData.datasets]
        newDatasets[index] = updatedDataset
        return {
            ...chartData,
            datasets: newDatasets
        }
    })
}

export const updateChartScaleOpt = (opt, axisId, chartOptions, setChartOptions) => {
    setChartOptions({
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            [axisId]: opt
        }
    })
}

export const handleColorCheckboxChange = (event, setSelectedColors, selectedColors) => {
    const { value, checked } = event.target
    const colorsArray = value.split(',').map(color => color.trim().replace(/'/g, ''))
    if (checked) {
        setSelectedColors(prevSelectedColors => [...prevSelectedColors, ...colorsArray])
    } else {
        setSelectedColors(prevSelectedColors =>
            prevSelectedColors.filter(color => !colorsArray.includes(color))
        )
    }
}


//TODO: PRUEBA PARA SIMPLIFICACION
export const updateNestedProperty = (obj, key, value, type) => {
    const finalValue = parseValue(value, type)

    if (key.includes('-')) {
        const keys = key.split('-')
        let updatedObj = { ...obj }
        let tempObj = updatedObj

        keys.forEach((k, index) => {
            if (index === keys.length - 1) {
                tempObj[k] = finalValue
            } else {
                tempObj[k] = { ...tempObj[k] }
                tempObj = tempObj[k]
            }
        })

        return updatedObj
    } else {
        return { ...obj, [key]: finalValue }
    }
}

export const modifyScale = (key, value, axisIdScale, setAxisIdScale, type) => {
    if (axisIdScale?.type === 'time' && key === 'time-displayFormats') {
        key = `time-displayFormats-${axisIdScale.time.unit}`
    }
    const updatedProp = updateNestedProperty(axisIdScale, key, value, type)
    setAxisIdScale(updatedProp)
}

export const updateChartOpt = (key, value, chartOptions, setChartOptions) => {
    try {
        const updatedProp = updateNestedProperty(chartOptions, key, value)
        setChartOptions(updatedProp)
    } catch (e) {
        console.log(e)
    }
}

export const modifySetting = (key, value, thisDataset, setThisDataset, type) => {
    console.log('key, value, type: ', key, value, type)
    const updatedProp = updateNestedProperty(thisDataset, key, value, type)
    console.log('dataset actualizado:', updatedProp)
    setThisDataset(updatedProp)
}

export const hexToRgba = (hex) => {
    if (hex.includes('#')) {
        hex = hex.replace(/^#/, '')
        console.log(hex)
        console.log(hex.length)
        if (hex.length !== 6) throw new Error('Invalid hexadecimal color')

        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)

        return `rgba(${r}, ${g}, ${b}, 0.2)`
    } else {
        return hex
    }
}

export const rgbaToHex = (rgba) => {
    if (!rgba.includes('#')) {
        const result = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)?\)$/)

        if (!result) {
            throw new Error('Invalid RGBA color')
        }

        const r = parseInt(result[1]).toString(16).padStart(2, '0')
        const g = parseInt(result[2]).toString(16).padStart(2, '0')
        const b = parseInt(result[3]).toString(16).padStart(2, '0')

        return `#${r}${g}${b}`
    } else {
        return rgba
    }
}

