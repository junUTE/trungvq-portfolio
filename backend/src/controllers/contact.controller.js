import Contact from "../models/contact.model.js";
import { sendContactAutoReply, sendContactNotification } from "../services/mail.service.js";
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

    const [adminEmailResult, autoReplyResult] = await Promise.all([
      sendContactNotification(contact),
      sendContactAutoReply(contact)
    ]);

    return response.status(201).json({
      message:
        adminEmailResult.delivered || autoReplyResult.delivered
          ? "Contact created successfully and email flow was triggered."
          : "Contact created successfully.",
      data: {
        contact,
        emailDelivery: {
          adminNotification: adminEmailResult,
          autoReply: autoReplyResult
        }
      }
    });
  } catch (error) {
    return next(error);
  }
}
