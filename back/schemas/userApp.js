import yup from "yup"

export const userAppSchema = yup.object().shape({
    username: yup.string().optional().min(3, "El nombre de usuario no puede estar vacío"),
    email: yup.string().email("El correo electrónico no es válido").required("El correo electrónico es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres")
        .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .matches(/[0-9]/, "La contraseña debe contener al menos un número")
        .matches(/[@$!%*?&]/, "La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &)"),
    confirmPassword: yup.string().required("La confirmación de la contraseña es obligatoria")
        .oneOf([yup.ref("password")], "Las contraseñas deben coincidir").min(1),
});

export const userAppLogin = yup.object().shape({
    email: yup.string().email("El correo electrónico no es válido").required("El correo electrónico es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria"),
}); 