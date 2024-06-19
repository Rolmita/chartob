import { useState, useEffect } from "react"
import { timeScaleOptions, linearScaleOptions, categoryScaleOptions, logarithmicScaleoptions } from "@/utils/chart-settings"
import { modifyScale, toggleDropdown } from "@/utils/helpers"
import 'chartjs-adapter-luxon'
import ColorSelect from "./ColorSelect"

export default function ScalesForm({ axisId, axis, datasetType, onOptionsChange, chartLabels }) {
    let axisScale = { axis: axis, display: 'auto', type: undefined }
    let isBar = false
    let offset = false

    if (datasetType == 'bar') {
        isBar = true
        offset = true
    } else {
        isBar = false
        offset = false
    }
    const [axisIdScale, setAxisIdScale] = useState(axisScale)
    const [scaleType, setScaleType] = useState(undefined)
    const [inputType, setInputType] = useState(null)

    useEffect(() => {
        setAxisIdScale(axisScale)
    }, [axisId])

    useEffect(() => {
        onOptionsChange(axisIdScale)
    }, [axisIdScale])

    useEffect(() => {
        switch (scaleType) {
            case 'linear':
                setAxisIdScale({ ...linearScaleOptions, axis: axis, type: 'linear', offset: isBar, grid: { ...linearScaleOptions.grid, offset: isBar } })
                setInputType('number')
                break
            case 'time':
                setAxisIdScale({ ...timeScaleOptions, axis: axis, type: 'time', offset: isBar, grid: { ...timeScaleOptions.grid, offset: isBar } })
                setInputType('datetime-local')
                break
            case 'timeseries':
                setAxisIdScale({ ...timeScaleOptions, axis: axis, type: 'timeseries', offset: isBar, grid: { ...timeScaleOptions.grid, offset: isBar } })
                setInputType('datetime-local')
                break
            case 'category':
                setAxisIdScale({ ...categoryScaleOptions, axis: axis, type: undefined, offset: isBar, grid: { ...categoryScaleOptions.grid, offset: isBar } })
                setInputType('text')
                break
            case 'logarithmic':
                setAxisIdScale({ ...logarithmicScaleoptions, axis: axis, type: 'logarithmic', offset: isBar, grid: { ...logarithmicScaleoptions.grid, offset: isBar } })
                setInputType('number')
                break
        }
    }, [scaleType])

    return (
        <fieldset>
            <legend>{axisId}</legend>
            <div>
                <div className='form-row' style={{ padding: '5px' }}>
                    <label htmlFor="display">
                        Display:</label>
                    <select name='display' defaultValue={axisIdScale?.display}
                        onChange={(e) => modifyScale('display', e.target.value, axisIdScale, setAxisIdScale)}>
                        <option value='auto' title='When a dataset is asociated'>Auto</option>
                        <option value='true' title='Allways'>True</option>
                        <option value='false' title='Never'>False</option>
                    </select>
                </div>
                <div className='form-row' style={{ padding: '5px' }}>
                    <label htmlFor="type">
                        Type: </label>
                    <select name='type' defaultValue={axisIdScale?.type}
                        onChange={(e) => {
                            setScaleType(e.target.value)
                        }}>
                        <option value='undefined'>--Select an axis type--</option>
                        <option value='time' title='For uniform time intervals'>time</option>
                        <option value='timeseries' title='For non uniform or scattered time intervals'>timeseries</option>
                        <option value='logarithmic' title='For wide range of values with exponential variation'>logarithmic</option>
                        <option value='linear' title='For linear progression of numerical values'>linear</option>
                        <option value='category' title='For categorical or label data (non numerical)'>category</option>
                    </select>
                </div>
            </div>
            {axisIdScale.type &&
                (<div>
                    <div>
                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Axis title</h4>
                            <button type='button' onClick={() => toggleDropdown(`title-dropdown-${axisId}`, 'down-img-1')}>
                                <img id='down-img-1' className='down-img' src='/down.svg' width='10px' /></button>
                        </div>
                        <div id={`title-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>
                            <div className='form-row'>
                                <label htmlFor="title-text">
                                    Title: </label>
                                <input name='title-text' type='text' placeholder='Type a title for the scale'
                                    defaultValue={axisIdScale?.title.text}
                                    onChange={(e) =>
                                        modifyScale('title-text', e.target.value, axisIdScale, setAxisIdScale, e.target.type)
                                    }></input>
                            </div>
                            <div className='form-row'>
                                <label htmlFor="title-display" title='¿Must be shown the title of the scale?'>
                                    Display: </label>
                                <input name='title-display' value='true' type='radio' title='Title must be shown'
                                    defaultChecked={axisIdScale?.title.display}
                                    onChange={(e) => modifyScale('title-display', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                <label htmlFor="true">True</label>
                                <input name='title-display' value='false' type='radio' title="Title mustn't be shown"
                                    defaultChecked={axisIdScale?.title.display ? false : true}
                                    onChange={(e) => modifyScale('title-display', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                <label htmlFor="false">False</label>
                            </div>
                            <div className='form-row'>
                                <label htmlFor="title-align" title='Alignment of the axis title.'>
                                    Align:</label>
                                <select name='title-align'
                                    defaultValue={axisIdScale?.title.align}
                                    onChange={(e) => modifyScale('title-align', e.target.value, axisIdScale, setAxisIdScale)}>
                                    <option value='start' >Start</option>
                                    <option value='center' >Center</option>
                                    <option value='end' >End</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {(axisIdScale.type == 'time' || axisIdScale.type == 'timeseries') &&
                        (<div>
                            <div className='chart-form-group'>
                                <h4 style={{ marginRight: '10px' }}>Time values:</h4>
                                <button type='button' onClick={() => toggleDropdown(`time-dropdown-${axisId}`, 'down-img-2')}>
                                    <img id='down-img-2' className='down-img' src='/down.svg' width='10px' /></button>
                            </div>
                            <div id={`time-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>
                                <div className='form-row'>
                                    <label htmlFor="time-parser">
                                        Your data format: </label>
                                    <select name='time-parser'
                                        onChange={(e) => modifyScale('time-parser', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='undefined'>--Select your data format--</option>
                                        <option value="yyyy-MM-dd'T'HH:mm:ss:SSS">YYYY-MM-DDTHH:mm:ss</option>
                                        <option value="yyyy-MM-dd'T'HH:mm">YYYY-MM-DDTHH:mm</option>
                                        <option value='yyyy-MM-dd'>YYYY-MM-DD</option>
                                        <option value='HH:mm:ss'>HH:mm:ss</option>
                                        <option value='HH:mm'>HH:mm</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor="time-unit">
                                        Unit </label>
                                    <select name='time-unit' defaultValue={axisIdScale?.time.unit}
                                        onChange={(e) => modifyScale('time-unit', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='undefined'>--Select your unit--</option>
                                        <option value='millisecond'>millisecond</option>
                                        <option value='second'>second</option>
                                        <option value='minute'>minute</option>
                                        <option value='hour'>hour</option>
                                        <option value='day'>day</option>
                                        <option value='week'>week</option>
                                        <option value='month'>month</option>
                                        <option value='quarter'>quarter</option>
                                        <option value='year'>year</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='time-minUnit'>Min unit: </label>
                                    <select name='time-minUnit' defaultValue={axisIdScale?.time.minUnit}
                                        onChange={(e) => modifyScale('time-minUnit', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='undefined'>--Select your min unit--</option>
                                        <option value='millisecond'>millisecond</option>
                                        <option value='second'>second</option>
                                        <option value='minute'>minute</option>
                                        <option value='hour'>hour</option>
                                        <option value='day'>day</option>
                                        <option value='week'>week</option>
                                        <option value='month'>month</option>
                                        <option value='quarter'>quarter</option>
                                        <option value='year'>year</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor="time-round"
                                        title='If defined, dates will be rounded to the start of this unit'>
                                        Round: </label>
                                    <select name="time-round" defaultValue={axisIdScale?.time.round}
                                        onChange={(e) => modifyScale('time-round', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='false'>--Select a unit to round--</option>
                                        <option value='millisecond'>millisecond</option>
                                        <option value='second'>second</option>
                                        <option value='minute'>minute</option>
                                        <option value='hour'>hour</option>
                                        <option value='day'>day</option>
                                        <option value='week'>week</option>
                                        <option value='month'>month</option>
                                        <option value='quarter'>quarter</option>
                                        <option value='year'>year</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor="time-tooltipFormat">
                                        Tooltip format: </label>
                                    <select name='time-tooltipFormat' defaultValue={axisIdScale?.time.tooltipFormat}
                                        onChange={(e) => modifyScale('time-tooltipFormat', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='undefined'>--Select your data format--</option>
                                        <option value='dd-MM-yyyy HH:mm'>dd-MM-yyyy HH:mm</option>
                                        <option value='HH:mm dd-MM-yyyy'>HH:mm dd-MM-yyyy</option>
                                        <option value='dd/MM/yyyy HH:mm'>dd/MM/yyyy HH:mm</option>
                                        <option value='dd/MM/yyyy HH:mm'>HH:mm dd/MM/yyyy</option>
                                        <option value='yyyy-MM-ddTHH:mm:ss'>yyyy-MM-ddTHH:mm:ss</option>
                                        <option value='yyyy-MM-ddTHH:mm'>yyyy-MM-ddTHH:mm</option>
                                        <option value='yyyy/MM/dd'>yyyy/MM/dd</option>
                                        <option value='dd/MM/yyyy'>dd/MM/yyyy</option>
                                        <option value='dd/MM/yyyy'>dd/MM</option>
                                        <option value='yyyy-MM-dd'>yyyy-MM-dd</option>
                                        <option value='dd-MM-yyyy'>dd-MM-yyyy</option>
                                        <option value='dd-MM'>dd-MM</option>
                                        <option value='MMM D, YYYY'>MMM D, YYYY</option>
                                        <option value='HH:mm:ss'>HH:mm:ss</option>
                                        <option value='HH:mm'>HH:mm</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        )}

                    <div>
                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Data:</h4>
                            <button type='button' onClick={() => toggleDropdown(`data-dropdown-${axisId}`, 'down-img-3')}>
                                <img id='down-img-3' className='down-img-3' src='/down.svg' width='10px' /></button>
                        </div>

                        {inputType &&
                            <div id={`data-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>
                                <div className='form-row'>
                                    <label htmlFor='min'>Min:</label>
                                    <input name='min' type={inputType} defaultValue={axisIdScale?.min}
                                        step='any' onChange={(e) => modifyScale('min', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='max'>Max:</label>
                                    <input name='max' type={inputType} defaultValue={axisIdScale?.max}
                                        onChange={(e) => modifyScale('max', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                </div>
                                {axisIdScale?.type == 'linear' &&
                                    (<div className='form-row'>
                                        <label htmlFor='beginAtZero' title='Begin at zero the scale.'>
                                            Begin at zero: </label>
                                        <input name='beginAtZero' type='radio' value='true' defaultChecked={axisIdScale?.beginAtZero}
                                            onChange={(e) => {
                                                modifyScale('beginAtZero', e.target.value, axisIdScale, setAxisIdScale)
                                            }}></input>
                                        <label htmlFor="true">True</label>
                                        <input name='beginAtZero' type='radio' value='false'
                                            defaultChecked={axisIdScale?.beginAtZero ? false : true}
                                            onChange={(e) => {
                                                modifyScale('beginAtZero', e.target.value, axisIdScale, setAxisIdScale)
                                                setAxisIdScale(prevAxis => {
                                                    const updatedAxis = { ...prevAxis }
                                                    delete updatedAxis['min']
                                                    return updatedAxis
                                                });
                                            }}></input>
                                        <label htmlFor="false">False</label>
                                    </div>)
                                }
                                <div className="form-row">
                                    <button type='button' className="button btn-form" onClick={
                                        (e) => {
                                            modifyScale('beginAtZero', 'false', axisIdScale, setAxisIdScale)
                                            setAxisIdScale(prevAxis => {
                                                const updatedAxis = { ...prevAxis }
                                                delete updatedAxis['min']
                                                delete updatedAxis['max']
                                                return updatedAxis
                                            });
                                        }
                                    }>Reset</button>
                                </div>
                            </div>
                        }
                    </div>

                    <div>
                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Style</h4>
                            <button type='button' onClick={() => toggleDropdown(`style-dropdown-${axisId}`, 'down-img-4')}>
                                <img id='down-img-4' className='down-img' src='/down.svg' width='10px' /></button>
                        </div>

                        <div id={`style-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>
                            <div className='form-row'>
                                <label htmlFor='position'>
                                    Position: </label>
                                <select name='position' defaultValue={axisIdScale?.position}
                                    onChange={(e) => modifyScale('position', e.target.value, axisIdScale, setAxisIdScale)}>
                                    <option value='undefined'>-- Select the position for the scale-</option>
                                    <option value='bottom'>Bottom</option>
                                    <option value='top'>Top</option>
                                    <option value='rigth'>Right</option>
                                    <option value='left'>Left</option>
                                    <option value='center'>Center</option>
                                </select>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='weight'
                                    title='The weight used to sort the axis. Higher weights are further away from the chart area.'>
                                    Axis sort: </label>
                                <input type='number' name='weight' defaultValue={axisIdScale?.weight}
                                    onChange={(e) => modifyScale('weight', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='reverse' title='Reverse the scale.'>
                                    Reverse: </label>
                                <input name='reverse' type='radio' value='true' defaultChecked={axisIdScale?.reverse}
                                    onChange={(e) => modifyScale('reverse', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor="true">True</label>
                                <input name='reverse' type='radio' value='false'
                                    onChange={(e) => modifyScale('reverse', e.target.value, axisIdScale, setAxisIdScale)}
                                    defaultChecked={axisIdScale?.reverse ? false : true}></input>
                                <label htmlFor="false">False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='clip' title='If true, clip the dataset drawing against the size of the scale instead of chart area.'>
                                    Clip dataset against scale size: </label>
                                <select name='clip' defaultValue={axisIdScale?.clip}
                                    onChange={(e) => modifyScale('clip', e.target.value, axisIdScale, setAxisIdScale)}>
                                    <option value='true'>True</option>
                                    <option value='false'>False</option>
                                </select>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='bounds' title='Controls the scale boundary strategy (bypassed by min/max options).'>
                                    Bounds: </label>
                                <select name='bounds' defaultValue={axisIdScale?.bounds}
                                    onChange={(e) => modifyScale('bounds', e.target.value, axisIdScale, setAxisIdScale)}>
                                    <option value='ticks' title='Makes sure ticks are fully visible, data outside are truncated.'>Ticks</option>
                                    <option value='data' title='Makes sure data are fully visible, labels outside are removed.'>Data</option>
                                </select>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='offset' title='Set if extra space must be added to the both edges and if the axis must be scaled to fit into the chart area.'>
                                    Offset: </label>
                                <select name='offset' defaultValue={axisIdScale?.offset}
                                    onChange={(e) => modifyScale('offset', e.target.value, axisIdScale, setAxisIdScale)}>
                                    <option value='false'>False</option>
                                    <option value='true'>True</option>
                                </select>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='backgroundColor'>
                                    Background color: </label>
                                <ColorSelect onChange={(e) => modifyScale('backgroundColor', e.target.value, axisIdScale, setAxisIdScale)}></ColorSelect>
                                <input name='backgroundColor' type='color' defaultValue={axisIdScale?.backgroundColor}
                                    onChange={(e) => modifyScale('backgroundColor', e.target.value, axisIdScale, setAxisIdScale)} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Border style</h4>
                            <button type='button' onClick={() => toggleDropdown(`border-style-dropdown-${axisId}`, 'down-img-5')}>
                                <img id='down-img-5' className='down-img' src='/down.svg' width='10px' /></button>
                        </div>

                        <div id={`border-style-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>

                            <div className='form-row'>
                                <label htmlFor='border-display'>Border display:</label>
                                <input type='radio' name='border-display' value='true' defaultChecked={axisIdScale?.border.display}
                                    onChange={(e) => modifyScale('border-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor="true">True</label>
                                <input type='radio' name='border-display' value='false'
                                    defaultChecked={axisIdScale?.border.display ? false : true}
                                    onChange={(e) => modifyScale('border-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor="false">False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='border-color'>Color: </label>
                                <ColorSelect onChange={(e) => modifyScale('border-color', e.target.value, axisIdScale, setAxisIdScale)} />
                                <input type='color' name='border-color' defaultValue={axisIdScale?.border.color}
                                    onChange={(e) => modifyScale('border-color', e.target.value, axisIdScale, setAxisIdScale)} />
                            </div>

                            <div className='form-row'>
                                <label htmlFor='border-width'>Width: </label>
                                <input type='range' name='border-width' min='0' max='5' list='border-width-markers'
                                    defaultValue={axisIdScale?.border.width}
                                    onChange={(e) =>
                                        modifyScale('border-width', e.target.value, axisIdScale, setAxisIdScale, e.target.type)
                                    }></input>
                                <datalist id="border-width-markers">
                                    <option value="0"></option>
                                    <option value="1"></option>
                                    <option value="2"></option>
                                    <option value="3"></option>
                                    <option value="4"></option>
                                    <option value="5"></option>
                                </datalist>
                                <input type='text' name='range-result' disabled value={axisIdScale?.border.width} />
                            </div>

                        </div>
                    </div>

                    <div>

                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Grid style</h4>
                            <button type='button' onClick={() => toggleDropdown(`grid-style-dropdown-${axisId}`, 'down-img-6')}>
                                <img id='down-img-6' className='down-img' src='/down.svg' width='10px' /></button>
                        </div>

                        <div id={`grid-style-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>

                            <div className='form-row'>
                                <label htmlFor='grid-display'>Grid display: </label>
                                <input type='radio' name='grid-display' value='true'
                                    defaultChecked={axisIdScale?.grid.display}
                                    onChange={(e) => modifyScale('grid-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='grid-display' value='false'
                                    defaultChecked={axisIdScale?.grid.display ? false : true}
                                    onChange={(e) => modifyScale('grid-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-color'>Grid color: </label>
                                <ColorSelect onChange={(e) => modifyScale('grid-color', e.target.value, axisIdScale, setAxisIdScale)}></ColorSelect>
                                <input type='color' name='grid-color' defaultValue={axisIdScale?.grid.color}
                                    onChange={(e) => modifyScale('grid-color', e.target.value, axisIdScale, setAxisIdScale)} />
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-drawOnChartArea'
                                    title='If true, draw lines on the chart area inside the axis lines.
                                            This is useful when there are multiple axes and you need to control which grid lines are drawn.'>
                                    Draw on chart area: </label>
                                <input type='radio' name='grid-drawOnChartArea' value='true'
                                    defaultChecked={axisIdScale?.grid.drawOnChartArea}
                                    onChange={(e) => modifyScale('grid-drawOnChartArea', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='grid-drawOnChartArea' value='false'
                                    defaultChecked={axisIdScale?.grid.drawOnChartArea ? false : true}
                                    onChange={(e) => modifyScale('grid-drawOnChartArea', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-lineWidth'>Grid line width: </label>
                                <input type='number' name='grid-lineWidth'
                                    defaultValue={axisIdScale?.grid.lineWidth}
                                    onChange={(e) => modifyScale('grid-lineWidth', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-offset'
                                    title='If true, grid lines will be shifted to be between labels. This is set to true for a bar chart by default.'>
                                    Grid offset: </label>
                                <input type='radio' name='grid-offset' value='true'
                                    defaultChecked={isBar}
                                    onChange={(e) => modifyScale('grid-offset', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='grid-offset' value='false'
                                    defaultChecked={isBar ? false : true}
                                    onChange={(e) => modifyScale('grid-offset', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-drawTicks'
                                    title='If true, draw lines beside the ticks in the axis area beside the chart.'>
                                    Draw ticks: </label>
                                <input type='radio' name='grid-drawTicks' value='true'
                                    defaultChecked={axisIdScale?.grid.drawTicks}
                                    onChange={(e) => modifyScale('grid-drawTicks', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='grid-drawTicks' value='false'
                                    defaultChecked={axisIdScale?.grid.drawTicks ? false : true}
                                    onChange={(e) => modifyScale('grid-drawTicks', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-tickColor'>Grid tick color: </label>
                                <ColorSelect onChange={(e) => modifyScale('grid-tickColor', e.target.value, axisIdScale, setAxisIdScale)}></ColorSelect>
                                <input type='color' name='grid-tickColor'
                                    defaultValue={axisIdScale?.grid.tickColor}
                                    onChange={(e) => modifyScale('grid-tickColor', e.target.value, axisIdScale, setAxisIdScale)} />
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-tickLength' title='Length in pixels that the grid lines will draw into the axis area.'>Grid tick length: </label>
                                <input name='grid-tickLength' type='number' min='1' max='20'
                                    defaultValue={axisIdScale?.grid.tickLength}
                                    onChange={(e) => modifyScale('grid-tickLength', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='grid-tickWidth' title='Width of the tick mark in pixels. If unset, defaults to the grid line width.'>Grid tick width: </label>
                                <input name='grid-tickWidth' type='number' min='1' max='20'
                                    defaultValue={axisIdScale?.grid.tickWidth}
                                    onChange={(e) => modifyScale('grid-tickWidth', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='chart-form-group'>
                            <h4 style={{ marginRight: '10px' }}>Ticks</h4>
                            <button type='button' onClick={() => toggleDropdown(`ticks-dropdown-${axisId}`, 'down-img-7')}>
                                <img id='down-img-7' className='down-img' src='/down.svg' width='10px' /></button>
                        </div>

                        <div id={`ticks-dropdown-${axisId}`} style={{ display: 'none', padding: '5px' }}>

                            <div className='form-row'>
                                <label htmlFor='ticks-display'>Ticks display: </label>
                                <input type='radio' name='ticks-display' value='true'
                                    defaultChecked={axisIdScale?.ticks.display}
                                    onChange={(e) => modifyScale('ticks-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='ticks-display' value='false'
                                    defaultChecked={axisIdScale?.ticks.display ? false : true}
                                    onChange={(e) => modifyScale('ticks-display', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='ticks-color' title='The colour of the ticks.'>Ticks color:</label>
                                <ColorSelect onChange={(e) => modifyScale('ticks-color', e.target.value, axisIdScale, setAxisIdScale)}></ColorSelect>
                                <input type='color' name='ticks-color' defaultValue={axisIdScale?.ticks.color}
                                    onChange={(e) => modifyScale('ticks-color', e.target.value, axisIdScale, setAxisIdScale)}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='ticks-padding'
                                    title='Padding between the tick label and the axis. 
                                        When set on a vertical axis, this applies in the horizontal (X) direction. 
                                        When set on a horizontal axis, this applies in the vertical (Y) direction.'>Ticks padding:</label>
                                <input name='ticks-padding' type='number' min='0' max='20' defaultValue={axisIdScale?.ticks.padding}
                                    onChange={(e) => modifyScale('ticks-padding', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='ticks-major-enabled'
                                    title='If true, major ticks are generated. 
                                        A major tick will affect autoskipping and major will be defined on ticks in the scriptable options context'>
                                    Major ticks enabled: </label>
                                <input type='radio' name='ticks-major-enabled' value='true'
                                    defaultChecked={axisIdScale?.ticks.major.enabled}
                                    onChange={(e) => modifyScale('ticks-major-enabled', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='true'>True</label>
                                <input type='radio' name='ticks-major-enabled' value='false'
                                    defaultChecked={axisIdScale?.ticks.major.enabled ? false : true}
                                    onChange={(e) => modifyScale('ticks-major-enabled', e.target.value, axisIdScale, setAxisIdScale)}></input>
                                <label htmlFor='false'>False</label>
                            </div>

                            <div>
                                <div className='form-row'>
                                    <label htmlFor='ticks-align'
                                        title="The align setting configures how labels align with the tick mark along the axis direction
                                             (i.e. horizontal for a horizontal axis and vertical for a vertical axis).
                                             Is only effective when these preconditions are met: tick rotation is 0 and axis position is 'top', 'left', 'bottom' or 'right'"
                                    >Ticks align: </label>
                                    <select name='ticks-align' defaultValue={axisIdScale?.ticks.align}
                                        onChange={(e) => modifyScale('ticks-align', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='start'>Start</option>
                                        <option value='center'>Center</option>
                                        <option value='end'>End</option>
                                        <option value='inner'>Inner</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-crossAlign'
                                        title='The crossAlign setting configures how labels align with the tick mark in the perpendicular direction 
                                            (i.e. vertical for a horizontal axis and horizontal for a vertical axis).'>
                                        Cross align: </label>
                                    <select name='ticks-crossAlign' defaultValue={axisIdScale?.ticks.crossAlign}
                                        onChange={(e) => modifyScale('ticks-crossAlign', e.target.value, axisIdScale, setAxisIdScale)}>
                                        <option value='near'>Near</option>
                                        <option value='center'>Center</option>
                                        <option value='far'>Far</option>
                                    </select>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-autoSkip'
                                        title='If true, automatically calculates how many labels can be shown and hides labels accordingly. 
                                                Labels will be rotated up to maxRotation before skipping any. 
                                                Turn autoSkip off to show all labels no matter what.'>
                                        Auto skip: </label>
                                    <input type='radio' name='ticks-autoSkip' value='true'
                                        defaultChecked={axisIdScale?.ticks.autoSkip}
                                        onChange={(e) => modifyScale('ticks-autoSkip', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='true'>True</label>
                                    <input type='radio' name='ticks-autoSkip' value='false'
                                        defaultChecked={axisIdScale?.ticks.autoSkip ? false : true}
                                        onChange={(e) => modifyScale('ticks-autoSkip', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='false'>False</label>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-autoSkipPadding'
                                        title='Padding between the ticks on the horizontal axis when autoSkip is enabled.'>
                                        Auto skip padding:</label>
                                    <input name='ticks-autoSkipPadding' type='number' min='0' max='20'
                                        defaultValue={axisIdScale?.ticks.autoSkipPadding}
                                        onChange={(e) => modifyScale('ticks-autoSkipPadding', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-includeBounds'
                                        title='Should the defined min and max values be presented as ticks even if they are not "nice".'>
                                        Include bounds: </label>
                                    <input type='radio' name='ticks-includeBounds' value='true'
                                        defaultChecked={axisIdScale?.ticks.includeBounds}
                                        onChange={(e) => modifyScale('ticks-includeBounds', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='true'>True</label>
                                    <input type='radio' name='ticks-includeBounds' value='false'
                                        defaultChecked={axisIdScale?.ticks.includeBounds ? false : true}
                                        onChange={(e) => modifyScale('ticks-includeBounds', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='false'>False</label>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-labelOffset'
                                        title='Distance in pixels to offset the label from the centre point of the tick 
                                                (in the x-direction for the x-axis, and the y-direction for the y-axis).'>
                                        Label offset:</label>
                                    <input name='ticks-labelOffset' type='number' min='0' max='20'
                                        defaultValue={axisIdScale?.ticks.labelOffset}
                                        onChange={(e) => modifyScale('ticks-labelOffset', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-maxRotation'
                                        title="Maximum rotation for tick labels when rotating to condense labels. 
                                                Note: Rotation doesn't occur until necessary. Note: Only applicable to horizontal scales.">
                                        Max rotation:</label>
                                    <input name='ticks-maxRotation' type='number' min='0' defaultValue={axisIdScale?.ticks.maxRotation}
                                        onChange={(e) => modifyScale('ticks-maxRotation', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-minRotation'
                                        title="Minimum rotation for tick labels. Note: Only applicable to horizontal scales.">
                                        Min rotation:</label>
                                    <input name='ticks-minRotation' type='number' min='0'
                                        defaultValue={axisIdScale?.ticks.minRotation}
                                        onChange={(e) => modifyScale('ticks-minRotation', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-mirror'
                                        title='Flips tick labels around axis, displaying the labels inside the chart instead of outside.
                                                Note: Only applicable to vertical scales.'>
                                        Mirror: </label>
                                    <input type='radio' name='ticks-mirror' value='true'
                                        defaultChecked={axisIdScale?.ticks.mirror}
                                        onChange={(e) => modifyScale('ticks-mirror', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='true'>True</label>
                                    <input type='radio' name='ticks-mirror' value='false'
                                        defaultChecked={axisIdScale?.ticks.mirror ? false : true}
                                        onChange={(e) => modifyScale('ticks-mirror', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    <label htmlFor='false'>False</label>
                                </div>

                                <div className='form-row'>
                                    <label htmlFor='ticks-maxTicksLimit'
                                        title="Maximum number of ticks and gridlines to show.">
                                        Max ticks limit:</label>
                                    <input name='ticks-maxTicksLimit' type='number' min='0'
                                        defaultValue={axisIdScale?.ticks.maxTicksLimit}
                                        onChange={(e) => modifyScale('ticks-maxTicksLimit', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                </div>
                            </div>

                            {(axisIdScale.type == 'time' || axisIdScale.type == 'timeseries') &&
                                (< div >
                                    <div className='form-row'>
                                        <label htmlFor='ticks-source'
                                            title=''>
                                            Ticks source: </label>
                                        <select name='ticks-source' defaultValue={axisIdScale?.ticks.source}
                                            onChange={(e) => modifyScale('ticks-source', e.target.value, axisIdScale, setAxisIdScale)}>
                                            <option value='auto' title='Generates "optimal" ticks based on scale size and time options'>
                                                Auto
                                            </option>
                                            <option value='data' title='Generates ticks from data (including labels from data {x|y} objects)'>
                                                Data</option>
                                            <option value='labels' title='Generates ticks from user given labels ONLY'>
                                                Labels
                                            </option>
                                        </select>
                                    </div>
                                </div>)
                            }

                            {axisIdScale.type == 'linear' &&
                                (< div >
                                    <div className='form-row'>
                                        <label htmlFor='ticks-precision'
                                            title='If defined and stepSize is not specified, the step size will be rounded to this many decimal places.'>
                                            Precision: </label>
                                        <input type='number' id='ticks-precision' name='ticks-precision' defaultValue={axisIdScale?.ticks.precision}
                                            onChange={(e) => modifyScale('ticks-precision', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    </div>

                                    <div className='form-row'>
                                        <label htmlFor='ticks-stepSize'
                                            title='User-defined fixed step size for the scale, having one tick per increment. 
                                            If not set, the ticks are labeled automatically using the nice numbers algorithm.'>
                                            Step size: </label>
                                        <input type='number' id='ticks-stepSize' name='ticks-stepSize' defaultValue={axisIdScale?.ticks.stepSize} min='0' step='0.1'
                                            onChange={(e) => modifyScale('ticks-stepSize', e.target.value, axisIdScale, setAxisIdScale, e.target.type)}></input>
                                    </div>

                                    <div className='form-row'>
                                        <label htmlFor='ticks-count'
                                            title='The number of ticks to generate. If specified, this overrides the automatic generation.'>
                                            Count: </label>
                                        <input type='number' id='ticks-count' name='ticks-count' defaultValue={axisIdScale?.ticks.count} min='2'
                                            onChange={(e) => modifyScale('ticks-count', e.target.value, axisIdScale, setAxisIdScale, e.target.type)} />
                                    </div>

                                    <button type='button' className="button btn-form"
                                        onClick={() => {
                                            setAxisIdScale(prevAxis => {
                                                const countInput = document.getElementById('ticks-count')
                                                const stepSizetInput = document.getElementById('ticks-stepSize')
                                                const precisionInput = document.getElementById('ticks-precision')
                                                const updatedAxis = { ...prevAxis }

                                                countInput.value = ''
                                                stepSizetInput.value = ''
                                                precisionInput.value = ''

                                                delete updatedAxis['ticks']['count']
                                                delete updatedAxis['ticks']['stepSize']
                                                delete updatedAxis['ticks']['precision']

                                                return updatedAxis
                                            })
                                        }}>Reset
                                    </button>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                )
            }
        </fieldset >
    )
}