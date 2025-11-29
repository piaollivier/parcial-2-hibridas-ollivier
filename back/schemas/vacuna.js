import yup from "yup"

export const vacunaSchema = yup.object().shape({
    nombre: yup.string()
        .required("El nombre de la vacuna es obligatorio")
        .min(3, "El nombre no puede estar vacío"),

    previene: yup.string()
        .required("El campo 'previene' es obligatorio")
        .min(2, "El campo 'previene' no puede estar vacío"),

    edad_aplicacion: yup
        .string()  
        .required("La edad de aplicación es obligatoria"),

    dosis: yup.string()
        .required("El campo 'dosis' es obligatorio"),    

    grupo: yup.string()
        .required("El campo 'grupo' es obligatorio"),

    obligatoria: yup
        .boolean()
        .notRequired(),  

    fecha_colocacion: yup
        .string()
        .notRequired(),  

    imagen: yup.string()
        .notRequired(),   

    link: yup.string()
        .url("El campo 'link' debe ser una URL válida")
        .notRequired(),
});