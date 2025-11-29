import * as yup from "yup"
import { vacunaSchema } from "./vacuna.js"

export const vacunaPatchSchema = vacunaSchema.noUnknown().shape({
    nombre: yup.string().notRequired(),
    previene: yup.string().notRequired(),
    edad_aplicacion: yup.array().of(yup.string()).notRequired(),
    dosis: yup.string().notRequired(),
    grupo: yup.string().notRequired(),
    obligatoria: yup.boolean().notRequired(),
    imagen: yup.string().notRequired(),
    link: yup.string().url("El campo 'link' debe ser una URL válida").notRequired(),
});
