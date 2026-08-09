import Code from "../models/code.model.js";

export async function getPublishedCodeItems(_request, response, next) {
  try {
    const codeItems = await Code.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return response.status(200).json({
      data: codeItems
    });
  } catch (error) {
    return next(error);
  }
}
