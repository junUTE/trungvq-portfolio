import Contact from "../models/contact.model.js";
import { sendContactNotification } from "../services/mail.service.js";
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

    const emailResult = await sendContactNotification(contact);

    return response.status(201).json({
      message: emailResult.delivered
        ? "Contact created successfully and email notification sent."
        : "Contact created successfully.",
      data: {
        contact,
        emailDelivery: emailResult
      }
    });
  } catch (error) {
    return next(error);
  }
}
