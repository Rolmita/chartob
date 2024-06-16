'use client'
import { useState, useEffect } from 'react'

export default function SelectDatabase({ databases }) {
    const [db, setDb] = useState(null)

    const handleChange = (event) => {
        const selectedDB = event.target.value
        console.log('Base de datos seleccionada:', selectedDB)
        setDb(selectedDB)
        console.log('esta es la base que esta', db)
    }

    useEffect(() => {

    })

    return (
        <div className="form-row" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <label>Database name: </label>
            <select name='database' onChange={handleChange}>
                <option value={null}>-- Choose a database --</option>
                {Object.keys(databases).map(dbName => (
                    <option key={dbName} value={dbName}>
                        {dbName}
                    </option>
                ))}
            </select>
        </div>
    )
}