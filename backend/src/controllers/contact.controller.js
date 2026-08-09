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
    const hasDeliveredEmail = adminEmailResult.delivered || autoReplyResult.delivered;
    const hasMailFailure =
      (!adminEmailResult.skipped && !adminEmailResult.delivered) ||
      (!autoReplyResult.skipped && !autoReplyResult.delivered);

    return response.status(201).json({
      message: hasDeliveredEmail
        ? "Contact created successfully and email flow was triggered."
        : hasMailFailure
          ? "Contact created successfully, but the email flow could not be completed."
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
