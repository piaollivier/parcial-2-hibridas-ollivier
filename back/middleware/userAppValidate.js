import { userAppSchema } from "../schemas/userApp.js"

export async function validateUserApp(req, res, next) { 
    try {
        const userAppValidate = await userAppSchema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true
        })
        req.body = userAppValidate
        next()
    } catch (err) {
        res.status(400).json({ error: err.errors })
    }
}   

