import { vacunaPatchSchema } from "../schemas/vacunaPatch.js";

export const vacunasValidatePatch = (req, res, next) => {
    if (req.body._id) delete req.body._id;
    vacunaPatchSchema
        .validate(req.body, { abortEarly: false, stripUnknown: true })
        .then(() => next())
        .catch(err => res.status(400).json({ message: err.errors }));
};
