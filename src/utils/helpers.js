import ScalesForm from "@/components/charts/ScalesForm";
// HELPERS FOR SCALES

export const processDatasets = (chartData, updateChartScaleOpt) => {
    return chartData?.datasets.map((dataset, index) => {
        let processedXAxisIds = new Set()
        let processedYAxisIds = new Set()
        const { xAxisID, yAxisID } = dataset;
        let showXAxisForm = false;
        let showYAxisForm = false;

        if (dataset.type && (dataset.type === 'line' || dataset.type === 'bar')) {
            if (xAxisID && !processedXAxisIds.has(xAxisID)) {
                processedXAxisIds.add(xAxisID);
                showXAxisForm = true;
            }
            if (yAxisID && !processedYAxisIds.has(yAxisID)) {
                processedYAxisIds.add(yAxisID);
                showYAxisForm = true;
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
        );
    });
};

const parseValue = (value, type) => {
    if (type === 'number' || type === 'range') return Number(value)
    switch (value) {
        case 'false':
            return false
        case 'true':
            return true;
        case 'undefined':
            return undefined
        default:
            return value
    }
};

export const modifyScale = (key, value, axisIdScale, setAxisIdScale, type) => {
    let updatedProp

    let finalValue = parseValue(value, type)

    if (axisIdScale?.type == 'time' && key == 'time-displayFormats') key = `time-displayFormats-${axisIdScale.time.unit}`

    try {
        if (key.includes('-')) {

            let arr = []
            arr = key.split('-')
            let prop1 = arr[0]
            let prop2 = arr[1]
            let prop3 = arr[2]

            switch (arr.length) {
                case 2:
                    updatedProp = {
                        ...axisIdScale, [prop1]: { ...axisIdScale[prop1], [prop2]: finalValue }
                    }
                    break
                case 3:
                    console.log(arr[0], arr[1], arr[2]);
                    updatedProp = {
                        ...axisIdScale, [prop1]: { ...axisIdScale[prop1], [prop2]: { ...axisIdScale[prop1][prop2], [prop3]: finalValue } }
                    }
                    break
            }

        } else {
            updatedProp = { ...axisIdScale, [key]: finalValue }
        }

        setAxisIdScale(updatedProp)

    } catch (e) {
        console.log(e);
    }
}

export const toggleDropdown = (divId, imgId) => {
    const element = document.getElementById(divId);
    const img = document.getElementById(imgId)
    element.style.display === 'none' ? element.style.display = 'block' : element.style.display = 'none'
    img.style.transform == 'rotate(180deg)' ? img.style.transform = 'rotate(0deg)' : img.style.transform = 'rotate(180deg)'
};

//HELPERS FOR CHART DATA VIEW
export const updateChartOpt = (key, value, chartOptions, setChartOptions) => {
    let updatedProp

    try {
        const finalValue = parseValue(value)

        if (key.includes('-')) {

            let arr = []
            arr = key.split('-')
            let prop1 = arr[0]
            let prop2 = arr[1]
            let prop3 = arr[2]

            switch (arr.length) {
                case 2:
                    updatedProp = {
                        ...chartOptions, [prop1]: { ...chartOptions[prop1], [prop2]: finalValue }
                    }
                    break
                case 3:
                    console.log(arr[0], arr[1], arr[2]);
                    updatedProp = {
                        ...chartOptions, [prop1]: { ...chartOptions[prop1], [prop2]: { ...chartOptions[prop1][prop2], [prop3]: finalValue } }
                    }
                    break
            }
        } else {
            updatedProp = { ...chartOptions, [key]: finalValue }

        }

        setChartOptions(updatedProp)
    } catch (e) {
        console.log(e);
    }
}

export const dateLabel = (chartData) => {
    chartData.labels = chartData.labels.map(label => {
        if (label instanceof Date) {
            let date = new Date(label)
            date.toLocaleString()
            return label = date
        } else { return label }
    });
    return chartData.labels
}

export const modifyDataset = (index, updatedDataset, chartData, setChartData) => {
    setChartData(() => {
        const newDatasets = [...chartData.datasets]
        newDatasets[index] = updatedDataset
        return { ...chartData, datasets: newDatasets }
    });
};

export const updateChartScaleOpt = (opt, axisId, chartOptions, setChartOptions) => {
    setChartOptions({ ...chartOptions, scales: { ...chartOptions.scales, [axisId]: opt } })
}

export const handleColorCheckboxChange = (event, setSelectedColors, selectedColors) => {
    const { value, checked } = event.target;
    const colorsArray = value.split(',').map(color => color.trim().replace(/'/g, ''));
    if (checked) {
        setSelectedColors(prevSelectedColors => [...prevSelectedColors, ...colorsArray]);
    } else {
        setSelectedColors(prevSelectedColors =>
            prevSelectedColors.filter(color => !colorsArray.includes(color))
        );
    }
};