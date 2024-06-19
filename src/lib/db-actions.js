'use server'
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getUserByEmail, getUserById } from '@/lib/data';
import { redirect } from 'next/navigation';
import mysql from 'mysql2/promise'

// CONEXIONES A LAS BBDD

function dBConnConfig(formData) {
    const dbName = formData.get('name');
    const hostName = formData.get('host');
    const connPort = Number(formData.get('port'))
    const connUser = formData.get('user')
    const userPass = formData.get('password')

    const config = {
        host: hostName,
        user: connUser,
        password: userPass,
        database: dbName,
        port: connPort,
        supportBigNumbers: true,
        decimalNumbers: true,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    };

    return config
}

export async function saveDbConnection(formData) {
    const userId = formData.get('userId');
    const foundUser = await getUserById(userId);
    const dbConfig = dBConnConfig(formData);

    if (!foundUser.databases) {
        foundUser.databases = {};
    }

    foundUser.databases[dbConfig.database] = dbConfig;

    const result = await updateDb(foundUser.databases, userId);

    revalidatePath('/databases');
    redirect('/databases');
}

async function updateDb(databases, userId) {

    const result = await prisma.user.update({
        data: {
            databases: databases
        },
        where: {
            id: userId
        }
    })

    return result
}

export async function editDbConnection(formData) {
    const userId = formData.get('userId')
    const dBPrevName = formData.get('dbPrev')
    const foundUser = await getUserById(userId)
    const dbConfig = dBConnConfig(formData)

    updateDbConfig(foundUser, dBPrevName, dbConfig)

    const result = await updateDb(foundUser.databases, userId)

    revalidatePath('/databases')
    redirect('/databases')
}

function updateDbConfig(foundUser, dBPrevName, dbConfig) {

    if (!foundUser.databases) return;

    const dbToUpdate = foundUser.databases[dBPrevName]

    if (dbToUpdate) {
        dbToUpdate.host = dbConfig.host
        dbToUpdate.user = dbConfig.user
        dbToUpdate.password = dbConfig.password
        dbToUpdate.database = dbConfig.database
        dbToUpdate.port = dbConfig.port
        dbToUpdate.supportBigNumbers = dbConfig.supportBigNumbers
        dbToUpdate.decimalNumbers = dbConfig.decimalNumbers
        dbToUpdate.waitForConnections = dbConfig.waitForConnections
        dbToUpdate.connectionLimit = dbConfig.connectionLimit
        dbToUpdate.maxIdle = dbConfig.maxIdle
        dbToUpdate.idleTimeout = dbConfig.idleTimeout
        dbToUpdate.queueLimit = dbConfig.queueLimit
        dbToUpdate.enableKeepAlive = dbConfig.enableKeepAlive
        dbToUpdate.keepAliveInitialDelay = dbConfig.keepAliveInitialDelay
    }
}

export async function deleteDB(formData) {
    const userId = formData.get('userId');
    const dBPrevName = formData.get('dbPrev');

    const foundUser = await getUserById(userId);

    deleteDBobject(foundUser, dBPrevName);

    const result = await updateDb(foundUser.databases, userId);

    revalidatePath('/databases');
    redirect('/databases');
}

function deleteDBobject(foundUser, dBPrevName) {
    if (!foundUser.databases) return;

    delete foundUser.databases[dBPrevName];
}

export async function searchTables(db) {

    const session = await auth()

    const user = await getUserByEmail(session.user.email)

    const databaseConfig = user.databases[db]

    const connection = await mysql.createConnection(databaseConfig);

    try {
        const [results, fields] = await connection.query(
            `SELECT TABLE_NAME
            FROM information_schema.tables
            WHERE TABLE_SCHEMA = '${db}'`
        );

        await connection.end()

        return results;

    } catch (err) {
        console.log(err);
    }
}

export async function searchColumns(db, table) {
    const session = await auth()

    const user = await getUserByEmail(session.user.email)

    const databaseConfig = user.databases[db]

    const connection = await mysql.createConnection(databaseConfig);

    try {
        const [results, fields] = await connection.query(
            `SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = '${table}'`
        );

        console.log(results)
        await connection.end()
        return results;

    } catch (err) {
        console.log(err);
    }
}

export async function searchColumnType(db, table, column) {
    const session = await auth()
    const user = await getUserByEmail(session.user.email)
    const databaseConfig = user.databases[db]
    const connection = await mysql.createConnection(databaseConfig);

    try {
        const [results, fields] = await connection.query(
            `SELECT DATA_TYPE,CHARACTER_MAXIMUM_LENGTH
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA='${db}'
            AND TABLE_NAME='${table}'
            AND COLUMN_NAME='${column}'`
        );

        await connection.end()
        return results;

    } catch (err) {
        console.log(err);
    }
}

export async function createQuery(formData, filterResult) {

    try {
        const db = formData.get('database')
        const table = formData.get('table')
        const columns = formData.getAll('column')
        let modifiers = {}

        columns.forEach((column, index) => {
            if (formData.getAll(`modifiers-${index}`).length > 0) {
                modifiers[`modifiers-${index}`] = formData.getAll(`modifiers-${index}`)
            }
        })

        const allColumns = formData.get('all-columns')

        let cols = ''

        if (allColumns) {
            cols = '*'

        } else {
            if (modifiers && Object.keys(modifiers).length > 0) {

                columns.forEach((column, index) => {

                    if (modifiers[`modifiers-${index}`]) {
                        modifiers[`modifiers-${index}`].forEach((modifier, i) => {
                            modifier == 'CUMULATIVE' ? console.log(modifier) : console.log('NO ES CUMULATIVE');

                            if (index == 0 && i == 0) {
                                (modifier == 'CUMULATIVE' || modifier == 'variation')
                                    ? modifier == 'CUMULATIVE'
                                        ? cols += cumulativeModifier(column, index, formData)
                                        : cols += variation(column, index, formData)
                                    : cols += `${modifier}(${column})`

                            } else {
                                (modifier == 'CUMULATIVE' || modifier == 'variation')
                                    ? modifier == 'CUMULATIVE'
                                        ? cols += `, ${cumulativeModifier(column, index, formData)}`
                                        : cols += `, ${variation(column, index, formData)}`
                                    : cols += `, ${modifier}(${column})`
                            }
                        })

                    } else {
                        if (columns[index] != 'null') index == 0 ? cols += `${column}` : cols += `, ${column}`
                    }

                })

            } else {

                for (let i = 0; i < columns.length; i++) {
                    if (columns[i] != 'null') i == 0 ? cols = columns[i] : cols += `, ${columns[i]}`
                }
            }
        }

        let theQuery = `SELECT ${cols} FROM ${table}`
        filterResult != [] ? theQuery += ` ${filterResult}` : theQuery
        console.log('QUERY: ', theQuery);
        return theQuery

    } catch (err) {
        console.log(err);
    }
}

function variation(column, index, formData) {
    const partition = formData.get(`variation-partition-${index}`)
    const order = formData.get(`variation-order-${index}`)
    const classification = formData.get(`variation-order-${index}-class`)
    let col
    // SELECT fecha, cantidad, cantidad - LAG(cantidad) OVER (ORDER BY fecha) AS variación
    if (partition != 'null') {
        return col = `${column} - LAG(${column}) OVER (PARTITION BY ${partition} ORDER BY ${order} ${classification}) AS variation_${column}`
    } else {
        return col = `${column} - LAG(${column}) OVER (ORDER BY ${order} ${classification}) AS variation_${column}`
    }
}

function cumulativeModifier(column, index, formData) {
    const partition = formData.get(`cumulative-partition-${index}`)
    const order = formData.get(`cumulative-order-${index}`)
    const classification = formData.get(`cumulative-order-${index}-class`)
    let col

    if (partition != 'null') {
        return col = `SUM(${column}) OVER (PARTITION BY ${partition} ORDER BY ${order} ${classification}) AS total_${column}`
    } else {
        return col = `SUM(${column}) OVER (ORDER BY ${order} ${classification}) AS total_${column}`
    }

}

export async function executeQuery(databases, formData) {

    const query = formData.get('query-area')
    const db = formData.get('database')

    const databaseConfig = databases[db]

    const connection = await mysql.createConnection(databaseConfig);

    const [results, fields] = await connection.query(query);

    await connection.end()

    console.log(results)
    return results
}

async function getDatabase(db) {
    const session = await auth()

    const user = await getUserByEmail(session.user.email)

    const databaseConfig = user.databases[db]

    return databaseConfig
}

export async function reloadQuery(databases, db, query) {

    const databaseConfig = databases[db]

    const connection = await mysql.createConnection(databaseConfig);

    const [results, fields] = await connection.query(query);

    await connection.end()

    console.log(results)
    return results
}