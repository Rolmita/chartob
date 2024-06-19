import { useState, useEffect } from 'react'
import 'chartjs-adapter-luxon'
import ColorSelect from './ColorSelect'
import { hexToRgba, rgbaToHex, toggleDropdown, modifySetting } from '@/utils/helpers'

//TODO:MOVER XAXISIDS E YAXISIDS
export default function LineDataset({ dataset, onDatasetChange, onTypeChange, index }) {
    const xAxisIDs = ['first-x-axis', 'second-x-axis', 'third-x-axis', 'fourth-x-axis', 'fifth-x-axis']
    const yAxisIDs = ['first-y-axis', 'second-y-axis', 'third-y-axis', 'fourth-y-axis', 'fifth-y-axis']

    const [showLine, setShowLine] = useState(true)
    const [enableBorderDash, setEnableBorderDash] = useState(false)
    const [borderDash, setBorderDash] = useState([])
    const [borderDashLineLength, setBorderDashLineLength] = useState(borderDash[0])
    const [borderDashLineSpacing, setBorderDashLineSpacing] = useState(borderDash[1])
    const [thisDataset, setThisDataset] = useState(dataset)

    const handleCheckboxChange = (name, value) => {
        //TODO: MANEJAR EN EL PROPIO FORM SI ES POSIBLE
        if (value == true && name == 'borderDash') {
            setEnableBorderDash(true, thisDataset, setThisDataset)
            borderDashSettings.style.display = 'flex'
            borderDashSettings.style.flexDirection = 'column'
        } else if (name == 'borderDash') {
            setEnableBorderDash(false)
            setBorderDash([])
            modifySetting('borderDash', [])
            borderDashSettings.style.display = 'none'
        }
    }

    useEffect(() => {
        modifySetting('borderDash', [borderDashLineLength, borderDashLineSpacing], thisDataset, setThisDataset)
    }, [borderDashLineLength, borderDashLineSpacing])

    useEffect(() => {
        onDatasetChange(thisDataset)
    }, [thisDataset])

    return (
        <div>
            <div className='form-row'>
                <label htmlFor="type">
                    Dataset type:</label>
                <select name='type' onChange={(e) => {
                    modifySetting('type', e.target.value, thisDataset, setThisDataset)
                    onTypeChange(e.target.value, index)
                }}>
                    <option value='undefined'>--Select a dataset type--</option>
                    <option value='line'>Line</option>
                    <option value='pie'>Pie</option>
                    <option value='doughnut'>Doughnut</option>
                    <option value='bar'>Bar</option>
                </select>
            </div>

            <div>
                <div className='chart-form-group'>
                    <h4 style={{ marginRight: '10px' }}>Basics settings</h4>
                    <button type='button' className='button btn-form' style={{ height: '25px' }}
                        onClick={() => toggleDropdown(`basicSettings-dropdown-line-${index}`, `down-img-line-${index}-basic`)}>
                        <img id={`down-img-line-${index}-basic`} className='down-img' src='/down.svg' width='10px' /></button>
                </div>

                <div id={`basicSettings-dropdown-line-${index}`} style={{ display: 'none', padding: '5px' }}>
                    <div className='form-row'>
                        <label htmlFor='label'>Dataset label: </label>
                        <input type='text' name='label' defaultValue={thisDataset?.label} onChange={(e) => modifySetting('label', e.target.value, thisDataset, setThisDataset)} />
                    </div>

                    <div className='form-row'>
                        <label htmlFor='indexAxis' title="The base axis of the dataset. 'x' for horizontal lines and 'y' for vertical lines.">Index Axis: </label>
                        <input type='radio' name='indexAxis' value='x' defaultChecked onChange={(e) => modifySetting('indexAxis', e.target.value, thisDataset, setThisDataset)} />
                        <label htmlFor='x'>x</label>
                        <input type='radio' name='indexAxis' value='y' onChange={(e) => modifySetting('indexAxis', e.target.value, thisDataset, setThisDataset)} />
                        <label htmlFor='x'>y</label>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='xAxisID'>xAxisID: </label>
                        <select name='xAxisID' onChange={(e) => modifySetting('xAxisID', e.target.value, thisDataset, setThisDataset)}>
                            {xAxisIDs.map((axis, index) => (<option key={`xAxis${index}`} value={axis}>{axis}</option>))}
                        </select>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='yAxisID'>yAxisID: </label>
                        <select name='yAxisID' onChange={(e) => modifySetting('yAxisID', e.target.value, thisDataset, setThisDataset)}>
                            {yAxisIDs.map((axis, index) => (<option key={`yAxis${index}`} value={axis}>{axis}</option>))}
                        </select>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='order'>Order: </label>
                        <input type='number' name='order' defaultValue={thisDataset?.order} step='1'
                            onChange={(e) => modifySetting('order', e.target.value, thisDataset, setThisDataset, e.target.type)}></input>
                    </div>
                </div>
            </div>

            <div>
                <div className='chart-form-group'>
                    <h4 style={{ marginRight: '10px' }}>Line Settings</h4>
                    <button type='button' className='button btn-form' style={{ height: '25px' }}
                        onClick={() => toggleDropdown(`lineSettings-dropdown-line-${index}`, `down-img-line-${index}-line`)}>
                        <img id={`down-img-line-${index}-line`} className='down-img' src='/down.svg' width='10px' /></button>
                </div>

                <div id={`lineSettings-dropdown-line-${index}`} style={{ display: 'none', padding: '5px' }}>
                    <div className='form-row'>
                        <input type='checkbox' id='showLine' name='showLine' defaultChecked={showLine}
                            onChange={(e) => {
                                const lineSettings = document.getElementById('lineSettings')
                                modifySetting('showLine', e.target.checked, thisDataset, setThisDataset)
                                e.target.checked ? lineSettings.style.display = 'flex' : lineSettings.style.display = 'none'
                            }}>
                        </input>
                        <label htmlFor='showLine'>Show line</label>
                    </div>

                    <div id='lineSettings' style={{ flexDirection: 'column' }}>
                        <div className='form-row'>
                            <label htmlFor='borderCapStyle'>Border cap style: </label>
                            <select name='borderCapStyle' defaultValue={thisDataset?.borderCapStyle}
                                onChange={(e) => modifySetting('borderCapStyle', e.target.value, thisDataset, setThisDataset)}>
                                <option value='butt'>butt</option>
                                <option value='round'>round</option>
                                <option value='square'>square</option>
                            </select>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='borderColor'>Line color: </label>
                            <ColorSelect onChange={(e) => {
                                modifySetting('borderColor', e.target.value, thisDataset, setThisDataset)
                                const picker = document.getElementById('borderColor-picker')
                                picker.value = e.target.value
                            }} />
                            <input type='color' id='borderColor-picker' name='borderColor' defaultValue={thisDataset?.borderColor}
                                onChange={(e) => modifySetting('borderColor', e.target.value, thisDataset, setThisDataset)}></input>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='fill'>Fill: </label>
                            <select name='fill' defaultValue={thisDataset?.fill}
                                onChange={(e) => modifySetting('fill', e.target.value, thisDataset, setThisDataset)}>
                                <option value='false'>disabled</option>
                                <option value='-1'>previous dataset</option>
                                <option value='shape'>shape (inside line)</option>
                                <option value='stack'>stacked value below</option>
                                <option value='start'>boundary start</option>
                                <option value='end'>boundary end</option>
                                <option value='origin'>boundary origin</option>
                            </select>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='backgroundColor'>Fill color: </label>
                            <ColorSelect onChange={(e) => {
                                const value = hexToRgba(e.target.value)
                                modifySetting('backgroundColor', value, thisDataset, setThisDataset)
                                const picker = document.getElementById('backgroundColor-picker')
                                picker.value = rgbaToHex(e.target.value)
                            }} />
                            <input type='color' id='backgroundColor-picker' name='backgroundColor' defaultValue={thisDataset?.backgroundColor}
                                onChange={(e) => {
                                    const value = hexToRgba(e.target.value)
                                    modifySetting('backgroundColor', value, thisDataset, setThisDataset)
                                }}></input>
                        </div>

                        <div className='form-row'>
                            <input type='checkbox' id='borderDash' name='borderDash' defaultChecked={enableBorderDash}
                                onChange={(e) => handleCheckboxChange('borderDash', e.target.checked)}></input>
                            <label htmlFor='borderDash'>Enable border dash</label>
                        </div>

                        <div id='borderDashSettings' style={{ display: 'none' }}>
                            <div className='form-row'>
                                <label htmlFor='borderDash-line'>Border dash line lenght: </label>
                                <input type='number' name='borderDash-line' defaultValue={0}
                                    onChange={(e) => { setBorderDashLineLength(e.target.value) }}></input>
                            </div>

                            <div className='form-row'>
                                <label htmlFor='borderDash-spacing'>Border dash line spacing: </label>
                                <input type='number' name='borderDash-spacing' defaultValue={0}
                                    onChange={(e) => { setBorderDashLineSpacing(e.target.value) }}></input>
                            </div>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='borderWidth'>Border width: </label>
                            <input type='number' name='borderWidth' defaultValue={thisDataset?.borderWidth}
                                onChange={(e) => modifySetting('borderWidth', e.target.value, thisDataset, setThisDataset, e.target.type)}></input>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='borderJoinStyle'>Border cap style: </label>
                            <select name='borderJoinStyle' defaultValue={thisDataset?.borderJoinStyle}
                                onChange={(e) => modifySetting('borderJoinStyle', e.target.value, thisDataset, setThisDataset)}>
                                <option value='butt'>miter</option>
                                <option value='round'>round</option>
                                <option value='bevel'>bevel</option>
                            </select>
                        </div>

                        <div className='form-row'>
                            <label htmlFor='spanGaps'>Draw line between points with no or null data: </label>
                            <input type='radio' name='spanGaps' value='false'
                                onSelect={(e) => modifySetting('spanGaps', e.target.value, thisDataset, setThisDataset)}></input>
                            <label htmlFor='true'>yes</label>
                            <input type='radio' name='spanGaps' value='true'
                                onSelect={(e) => modifySetting('spanGaps', e.target.value, thisDataset, setThisDataset)}></input>
                            <label htmlFor='true'>no</label>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className='chart-form-group'>
                    <h4 style={{ marginRight: '10px' }}>Point Settings</h4>
                    <button type='button' className='button btn-form' style={{ height: '25px' }}
                        onClick={() => toggleDropdown(`pointSettings-dropdown-line-${index}`, `down-img-line-${index}-point`)}>
                        <img id={`down-img-line-${index}-point`} className='down-img' src='/down.svg' width='10px' /></button>
                </div>

                <div id={`pointSettings-dropdown-line-${index}`} style={{ display: 'none', padding: '5px' }}>
                    <div className='form-row'>
                        <label htmlFor='pointStyle'>Point style: </label>
                        <select name='pointStyle' onChange={(e) => modifySetting('pointStyle', e.target.value, thisDataset, setThisDataset)}>
                            <option value='false'>false</option>
                            <option value='circle'>circle</option>
                            <option value='cross'>cross</option>
                            <option value='crossRot'>crossRot</option>
                            <option value='dash'>dash</option>
                            <option value='line'>line</option>
                            <option value='rect'>rect</option>
                            <option value='rectRounded'>rectRounded</option>
                            <option value='rectRot'>rectRot</option>
                            <option value='star'>star</option>
                            <option value='triangle'>triangle</option>
                        </select>
                    </div>

                    <div>
                        <div className='form-row'>
                            <label htmlFor='pointBackgroundColor'>Point background color: </label>
                            <ColorSelect onChange={(e) => {
                                modifySetting('pointBackgroundColor', e.target.value, thisDataset, setThisDataset)
                                const picker = document.getElementById('pointBackgroundColor-picker')
                                picker.value = e.target.value
                            }} />
                            <input type='color' id='pointBackgroundColor-picker' name='pointBackgroundColor-picker' defaultValue={thisDataset?.pointBackgroundColor}
                                onChange={(e) => modifySetting('pointBackgroundColor', e.target.value, thisDataset, setThisDataset)}></input>
                        </div>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='pointBorderColor'>Border color: </label>
                        <ColorSelect onChange={(e) => {
                            modifySetting('pointBorderColor', e.target.value, thisDataset, setThisDataset)
                            const picker = document.getElementById('pointBorderColor-picker')
                            picker.value = e.target.value
                        }} />
                        <input type='color' id='pointBorderColor-picker' name='pointBorderColor-picker' defaultValue={thisDataset?.pointBorderColor}
                            onChange={(e) => modifySetting('pointBorderColor', e.target.value, thisDataset, setThisDataset)}></input>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='pointBorderWidth'>Border width: </label>
                        <input type='number' name='pointBorderWidth' defaultValue={thisDataset?.pointBorderWidth}
                            onChange={(e) => modifySetting('pointBorderWidth', e.target.value, thisDataset, setThisDataset, e.target.type)}></input>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='pointRadius'>Point radius: </label>
                        <input type='number' name='pointRadius' defaultValue={thisDataset?.pointRadius}
                            onChange={(e) => modifySetting('pointRadius', e.target.value, thisDataset, setThisDataset, e.target.type)}></input>
                    </div>

                    <div className='form-row'>
                        <label htmlFor='pointHoverRadius'>Point hover radius: </label>
                        <input type='number' name='pointHoverRadius' defaultValue={thisDataset?.pointHoverRadius}
                            onChange={(e) => modifySetting('pointHoverRadius', e.target.value, thisDataset, setThisDataset, e.target.type)}></input>
                    </div>

                </div>

            </div>
        </div>
    )
}