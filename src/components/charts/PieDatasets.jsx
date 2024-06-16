import { useState, useEffect } from "react"
import { toggleDropdown, handleColorCheckboxChange } from "@/utils/helpers";

export default function PieDoughnutDatasets({ dataset, onDatasetChange, onTypeChange, index }) {
    const [thisDataset, setThisDataset] = useState(dataset)

    const [selectedColors, setSelectedColors] = useState([]);

    const handleRadioChange = (e) => {
        modifySetting('borderAlign', e.target.value, e.target.type)
    }

    const onTypeChangeInner = (chartType) => {
        modifySetting('type', chartType);
        onTypeChange(chartType, index);
    };

    const modifySetting = (key, value, type) => {
        if (key == 'type') onTypeChange(value)
        let updatedDataset
        console.log(type);
        if (type == 'number') {
            const numValue = Number(value)
            updatedDataset = { ...thisDataset, [key]: numValue }
        } else {
            updatedDataset = { ...thisDataset, [key]: value }
        }
        setThisDataset(updatedDataset)
        onDatasetChange(updatedDataset)
    }

    useEffect(() => {
        modifySetting('backgroundColor', selectedColors)
    }, [selectedColors])

    return (
        <div>
            <div className='form-row'>
                <label htmlFor="type">
                    Type of dataset:</label>
                <select name='type' onChange={(e) => onTypeChangeInner(e.target.value)}>
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
                    <button type='button' onClick={() => toggleDropdown(`basicSettings-dropdown-pie-${index}`, `down-img-pie-${index}-basic`)}>
                        <img id={`down-img-pie-${index}-basic`} className='down-img' src='/down.svg' width='10px' /></button>
                </div>
                <div id={`basicSettings-dropdown-pie-${index}`} style={{ display: 'none', padding: '5px' }}>
                    <div className='form-row'>
                        <label htmlFor='label'>Dataset label: </label>
                        <input type='text' name='label' defaultValue={thisDataset?.label}
                            onChange={(e) => modifySetting('label', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='circumference'>Circumference: </label>
                        <input type='number' name='circumference' defaultValue={thisDataset?.circumference}
                            onChange={(e) => modifySetting('circumference', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='offset'>Offset: </label>
                        <input type='number' name='offset' defaultValue={thisDataset?.offset}
                            onChange={(e) => modifySetting('offset', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='hoverOffset'>Hover offset: </label>
                        <input type='number' name='hoverOffset' defaultValue={thisDataset?.hoverOffset}
                            onChange={(e) => modifySetting('hoverOffset', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='rotation'>Rotation: </label>
                        <input type='number' name='rotation' defaultValue={thisDataset?.rotation}
                            onChange={(e) => modifySetting('rotation', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='spacing'>Spacing: </label>
                        <input type='number' name='spacing' defaultValue={thisDataset?.spacing}
                            onChange={(e) => modifySetting('spacing', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='weight'>Weight: </label>
                        <input type='number' name='weight' defaultValue={thisDataset?.weight}
                            onChange={(e) => modifySetting('weight', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row' style={{ display: 'flex', flexDirection: 'row' }}>
                        <label htmlFor='backgroundColor'>Background color: </label>
                        <div style={{ backgroundColor: 'white', padding: '3px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
                                <input type='checkbox' name='backgroundColor' style={{ marginRight: '5px' }}
                                    value="'#f0a202', '#f18805', '#d95d39', '#202c59', '#581f18'"
                                    onChange={(e) => handleColorCheckboxChange(e, setSelectedColors, selectedColors)}></input>
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#f0a202' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#f18805' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#d95d39' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#202c59' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#581f18' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
                                <input type='checkbox' name='backgroundColor' style={{ marginRight: '5px' }}
                                    value="'#cfffb3', '#ade25d', '#fcec52', '#3b7080', '#3a5743'"
                                    onChange={(e) => handleColorCheckboxChange(e, setSelectedColors, selectedColors)}></input>
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#cfffb3' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#ade25d' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#fcec52' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#3b7080' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#3a5743' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
                                <input type='checkbox' name='backgroundColor' style={{ marginRight: '5px' }}
                                    value="'#a4243b', '#d8c99b', '#d8973c', '#bd632f', '#273e47'"
                                    onChange={(e) => handleColorCheckboxChange(e, setSelectedColors, selectedColors)}></input>
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#a4243b' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#d8c99b' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#d8973c' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#bd632f' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#273e47' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
                                <input type='checkbox' name='backgroundColor' style={{ marginRight: '5px' }}
                                    value="'#21294A', '#4D688F', '#37a35d', '#edeff2', '#ebb93b'"
                                    onChange={(e) => handleColorCheckboxChange(e, setSelectedColors, selectedColors)}></input>
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#21294A' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#4D688F' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#37a35d' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#edeff2' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#ebb93b' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '5px' }}>
                                <input type='checkbox' name='backgroundColor' style={{ marginRight: '5px' }}
                                    value="'#0e2e2b', '#254656', '#74b39c', '#38a889', '#fe8451', '#f1a93c'"
                                    onChange={(e) => handleColorCheckboxChange(e, setSelectedColors, selectedColors)}></input>
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#0e2e2b' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#254656' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#74b39c' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#38a889' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#fe8451' }} />
                                <div style={{ width: '15px', height: '15px', backgroundColor: '#f1a93c' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='chart-form-group'>
                    <h4 style={{ marginRight: '10px' }}>Border settings</h4>
                    <button type='button' onClick={() => toggleDropdown(`borderSettings-dropdown-bar-${index}`, `down-img-pie-${index}-border`)}>
                        <img id={`down-img-pie-${index}-border`} className='down-img' src='/down.svg' width='10px' /></button>
                </div>
                <div id={`borderSettings-dropdown-bar-${index}`} style={{ display: 'none', padding: '5px' }}>
                    <div className='form-row'>
                        <label htmlFor='borderAlign'>Border align: </label>
                        <input type='radio' name='borderAlign' value='center' defaultChecked
                            onChange={handleRadioChange} />
                        <label htmlFor="center">center</label>
                        <input type='radio' name='borderAlign' value='inner'
                            onChange={handleRadioChange} />
                        <label htmlFor="inner">inner</label>
                    </div>
                    <div className='form-row'>
                        <label htmlFor='borderRadius'>Border radius: </label>
                        <input type='number' name='borderRadius' defaultValue={thisDataset?.borderRadius}
                            onChange={(e) => modifySetting('borderRadius', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='borderWidth'>Border width: </label>
                        <input type='number' name='borderWidth' defaultValue={thisDataset?.borderWidth}
                            onChange={(e) => modifySetting('borderWidth', e.target.value, e.target.type)} />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='borderJoinStyle'>Border join style: </label>
                        <select name='borderJoinStyle' defaultValue={thisDataset?.borderJoinStyle}
                            onChange={(e) => modifySetting('borderJoinStyle', e.target.value, e.target.type)} >
                            <option value='miter'>miter</option>
                            <option value='round'>round</option>
                            <option value='bevel'>bevel</option>
                        </select>
                    </div>
                </div>
            </div>

        </div >
    )
}