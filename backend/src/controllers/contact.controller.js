import Contact from "../models/contact.model.js";
import { validateContactPayload } from "../utils/validators.js";

export async function createContact(request, response, next) {
  try {
    const errors = validateContactPayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({
        message: "Validation failed.",
        errors
      });
    }

    const contact = await Contact.create({
      name: request.body.name.trim(),
      email: request.body.email.trim().toLowerCase(),
      message: request.body.message.trim()
    });

    return response.status(201).json({
      message: "Contact created successfully.",
      data: contact
    });
  } catch (error) {
    return next(error);
  }
}
