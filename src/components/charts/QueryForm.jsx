'use client'
import { useState, useEffect } from 'react';
import { searchTables, searchColumns, createQuery, executeQuery } from '@/lib/db-actions';
import QueryFilterForm from '@/components/charts/QueryFilterForm';

function QueryForm({ databases, onQueryResults, onQuery, onDb, prevQuery, prevDb }) {
    const [db, setDb] = useState(null);
    const [tables, setTables] = useState(null)
    const [table, setTable] = useState(null)
    const [columns, setColumns] = useState(null)
    const [columnsCount, setColumnsCount] = useState(2)
    const [numColumns, setNumColumns] = useState([])
    const [query, setQuery] = useState(null)
    const [formData, setFormData] = useState(null);
    const [buttonName, setButtonName] = useState('Display query')
    const [filterResult, setFilterResult] = useState('')
    const [numQuery, setNumQuery] = useState([])
    const [queryCount, setQueryCount] = useState(1)

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            setFormData(formData)
            const query = await createQuery(formData, filterResult);
            setQuery(query)
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
        }
    };

    const handleButtonChange = () => {
        (buttonName === 'Display query') ? setButtonName('Run query') : setButtonName('Display query')
    }

    const handleDbChange = (event) => {
        const selectedDB = event.target.value;
        setDb(selectedDB);
        onDb(selectedDB)
    };

    const handleTableChange = (event) => {
        const selectedTable = event.target.value;
        setTable(selectedTable);
    };

    const handleAddSelect = () => {
        setColumnsCount(prevCount => prevCount + 1);
    };

    useEffect(() => {
        if (prevQuery != null) {
            setQuery(prevQuery)
            onQuery(prevQuery)
        }
    }, [prevQuery])

    useEffect(() => {
        if (prevDb != null) {
            setDb(prevDb)
            onDb(prevDb)
        }
    }, [prevDb])

    useEffect(() => {
        async function fetchResult() {
            try {
                if (formData !== null) {
                    const formDataEntries = formData.entries();
                    console.log('formDataEntries', formDataEntries);
                    const formDataArray = Array.from(formDataEntries);
                    console.log('formDataArray', formDataArray);
                    const lastPair = formDataArray.pop();
                    console.log('lastPair', lastPair);
                    const lastValue = lastPair[1];
                    console.log(lastValue, lastValue);
                    if (query != null && lastValue !== '') {
                        const result = await executeQuery(databases, formData)
                        onQueryResults(result);
                        onQuery(query)
                    }
                }

            } catch (error) {
                console.error('Error al obtener el resultado de la consulta:', error);
            }
        }
        fetchResult();
    }, [query, formData, databases, onQueryResults]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (columnsCount != null) {
                    setNumColumns([...Array(columnsCount)]);
                }
                if (db != null) {
                    setTables(await searchTables(db));
                }
                if (db != null && table != null) {
                    setColumns(await searchColumns(db, table));
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchData();
    }, [columnsCount, db, table]);

    useEffect(() => {
        if (query !== null) {
            document.getElementById('query-area').value = query;
        }
    }, [query]);

    return (
        <div className="tab-content">
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
                <div className="form-row" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <label>Database name: </label>
                    <select name='database' onChange={handleDbChange} defaultValue={prevDb && prevDb}>
                        {prevDb
                            ? <option value={prevDb}>{prevDb}</option>
                            : <option value={null}>-- Choose a database --</option>}
                        {databases
                            ? (Object.keys(databases).map(dbName => (
                                <option key={dbName} value={dbName}>
                                    {dbName}
                                </option>
                            )))
                            : ''}
                    </select>
                </div>

                <div className="form-row" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <label>Table name: </label>
                    <select name='table' onChange={handleTableChange}>
                        <option value='null'>-- Choose a table --</option>
                        {tables != null && Object.keys(tables).map(index => (
                            <option key={tables[index].TABLE_NAME} value={tables[index].TABLE_NAME}>
                                {tables[index].TABLE_NAME}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='form-row'>
                    <label style={{ marginRight: '5px' }}>Columns: </label>
                    <button type="button" className='button  btn-form' onClick={handleAddSelect}>Add column</button>
                </div>
                <div className="form-row columns">

                    {numColumns.map((_, index) => (
                        <div key={`column-${index}`} className='column-choose'>
                            <div className='form-row'>
                                <select name='column' key={index}>
                                    <option value='null'>-- Choose a column --</option>
                                    {columns != null && Object.keys(columns).map(index => (
                                        <option key={columns[index].COLUMN_NAME} value={columns[index].COLUMN_NAME}>
                                            {columns[index].COLUMN_NAME}
                                        </option>
                                    ))}
                                </select>
                                <div className='form-row'>
                                    <input id={`enable-modifier-${index}`} type='checkbox' defaultChecked={false}
                                        onChange={(e) => {
                                            const elemento = document.getElementById(`modifiers-${index}`)
                                            console.log(e.target.checked);
                                            e.target.checked == true ? e.target.checked == false : e.target.checked == true
                                            e.target.checked == true
                                                ? elemento.style.display = 'flex'
                                                : elemento.style.display = 'none'
                                        }}></input>
                                    <label>Modifiers</label>
                                </div>
                            </div>
                            <div key={`modifiers-${index}`} id={`modifiers-${index}`} style={{ display: 'none' }}>

                                <div className='modifiers-type'>
                                    <input type='checkbox' name={`modifiers-${index}`} value='SUM'></input>
                                    <label htmlFor={`modifiers-${index}`}>Sum</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' name={`modifiers-${index}`} value='COUNT'></input>
                                    <label htmlFor={`modifiers-${index}`}>Count</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' name={`modifiers-${index}`} value='MAX'></input>
                                    <label htmlFor={`modifiers-${index}`}>Max</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' name={`modifiers-${index}`} value='AVG'></input>
                                    <label htmlFor={`modifiers-${index}`}>AVG</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' name={`modifiers-${index}`} value='MIN'></input>
                                    <label htmlFor={`modifiers-${index}`}>Min</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' id={`cumulative-modifier-${index}`} name={`modifiers-${index}`} value='CUMULATIVE'
                                        onChange={(e) => {
                                            const cumulativeDiv = document.getElementById(`cumulative-total-${index}`)
                                            e.target.checked ? cumulativeDiv.style.display = 'flex' : cumulativeDiv.style.display = 'none'
                                        }}>
                                    </input>
                                    <label htmlFor={`modifiers-${index}`}>Cumulative sum</label>
                                </div>
                                <div className='modifiers-type'>
                                    <input type='checkbox' id={`variation-modifier-${index}`} name={`modifiers-${index}`} value='variation'
                                        onChange={(e) => {
                                            const variationDiv = document.getElementById(`variation-${index}`)
                                            e.target.checked ? variationDiv.style.display = 'flex' : variationDiv.style.display = 'none'
                                        }}>
                                    </input>
                                    <label htmlFor={`modifiers-${index}`}>Variation</label>
                                </div>
                            </div>
                            <div id={`variation-${index}`} style={{ display: 'none' }} className='form-row'>
                                <div className='form-row'>
                                    <h4>Variation</h4>
                                </div>
                                <div className='form-row columns'>
                                    <div>
                                        <label htmlFor='partition'>Partition: </label>
                                        <select name={`variation-partition-${index}`}
                                            onChange={(e) => console.log('selected partition: ', e.target.value)}>
                                            <option value='null'>-- Partition column --</option>
                                            {columns != null && Object.keys(columns).map(index => (
                                                <option key={`partition-${columns[index].COLUMN_NAME}`} value={columns[index].COLUMN_NAME}>
                                                    {columns[index].COLUMN_NAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div >
                                        <label htmlFor='order'>Order: </label>
                                        <select name={`variation-order-${index}`}
                                            onChange={(e) => console.log('selected order column: ', e.target.value)}>
                                            <option value='null'>-- Order column --</option>
                                            {columns != null && Object.keys(columns).map(index => (
                                                <option key={`order-${columns[index].COLUMN_NAME}`} value={columns[index].COLUMN_NAME}>
                                                    {columns[index].COLUMN_NAME}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor='variation'>Variation order:</label>
                                        <select name={`variation-order-${index}-class`}>
                                            <option value='ASC'>-- Order classification --</option>
                                            <option value='ASC'> ASCENDENT</option>
                                            <option value='DESC'>DESCENDENT</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div id={`cumulative-total-${index}`} style={{ display: 'none' }} className='form-row'>
                                <div className='form-row'>
                                    <h4>Cumulative total</h4>
                                </div>
                                <div className='form-row columns'>
                                    <div >
                                        <label htmlFor='partition'>Partition: </label>
                                        <select name={`cumulative-partition-${index}`}
                                            onChange={(e) => console.log('selected partition: ', e.target.value)}>
                                            <option value='null'>-- Partition column --</option>
                                            {columns != null && Object.keys(columns).map(index => (
                                                <option key={`partition-${columns[index].COLUMN_NAME}`} value={columns[index].COLUMN_NAME}>
                                                    {columns[index].COLUMN_NAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div >
                                        <label htmlFor='order'>Order: </label>
                                        <select name={`cumulative-order-${index}`}
                                            onChange={(e) => console.log('selected order column: ', e.target.value)}
                                            required={() => {
                                                const check = document.getElementById(`cumulative-modifier-${index}`)
                                                if (check.checked) {
                                                    return true
                                                } else {
                                                    return false
                                                }
                                            }}>
                                            <option value='null'>-- Order column --</option>
                                            {columns != null && Object.keys(columns).map(index => (
                                                <option key={`order-${columns[index].COLUMN_NAME}`} value={columns[index].COLUMN_NAME}>
                                                    {columns[index].COLUMN_NAME}
                                                </option>
                                            ))}
                                        </select>
                                        <select name={`cumulative-order-${index}-class`}>
                                            <option value='ASC'>-- Order classification --</option>
                                            <option value='ASC'> ASCENDENT</option>
                                            <option value='DESC'>DESCENDENT</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='form-row'>
                        <input name='all-columns' type='checkbox' value='*' style={{ margin: '0 5px' }}></input>
                        <label>All columns</label>
                    </div>
                </div>
                <QueryFilterForm columns={columns} db={db} table={table} onFilter={setFilterResult} />
                <div className='form-row'>
                    <textarea name='query-area' id='query-area' defaultValue={query} style={{ marginBottom: '10px' }}></textarea>
                </div>
                <button type='submit' className='button' onClick={handleButtonChange}>{buttonName}</button>
            </form>
        </div>
    )
}

export default QueryForm;