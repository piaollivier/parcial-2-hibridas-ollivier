import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient("mongodb+srv://admin:admin@hibridas.qaozghl.mongodb.net/")
const db = client.db("AH20232CP1")


export async function getUsuarios(filter = {}) {
    const filterMongo = { eliminado: { $ne: true } }

    if (filter.nombre) {
        filterMongo.nombre = { $regex: filter.nombre, $options: 'i' }
    }

    if (filter.alergias) {
        filterMongo.alergias = { $regex: filter.alergias, $options: 'i' }
    }

    if (filter.sexo) {
        filterMongo.sexo = { $regex: filter.sexo, $options: 'i' }
    }

    await client.connect()
    return db.collection("usuarios").find(filterMongo).toArray()
}

export async function getUsuariosById(id) {
    await client.connect()
    return db.collection("usuarios").findOne({ _id: new ObjectId(id) })
}

export async function guardarUsuario(usuario) {
    await client.connect()
    return db.collection("usuarios").insertOne(usuario)
}

export function editarUsuario(usuario, id) {
    return db.collection("usuarios").replaceOne({ _id: new ObjectId(id) }, usuario)
}

export function eliminarUsuarioLogico(id) {
    return db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, {
        $set: { eliminado: true }
    })
}

export function editarUsuarioParcial(id, usuario) {
    return db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, { $set: usuario })
}

export function agregarVacunaColocada(idCliente, vacuna) {
    return db.collection("usuarios").updateOne({ _id: new ObjectId(idCliente) }, 
    { $addToSet: { vacunas_colocadas: vacuna } }, { upsert: true } )
}


