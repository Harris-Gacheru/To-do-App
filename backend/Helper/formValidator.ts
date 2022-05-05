import Joi from "joi";

export const FormSchema = Joi.object({
    title: Joi.string().required().max(30),
    description: Joi.string().required(),
    due_date: Joi.date().required()
})