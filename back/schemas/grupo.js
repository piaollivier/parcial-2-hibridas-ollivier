import * as yup from "yup";

export const grupoSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre del grupo es obligatorio")
    .min(3, "Debe tener mínimo 3 caracteres"),

  descripcion: yup
    .string()
    .optional(),

  userId: yup
    .string()
    .required("El usuario es obligatorio"),
});
