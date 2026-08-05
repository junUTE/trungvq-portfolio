import Article from "../models/article.model.js";
import Profile from "../models/profile.model.js";
import Work from "../models/work.model.js";

export async function getPublicProfile(_request, response, next) {
  try {
    const profile = await Profile.findOne({ key: "main" }).lean();

    return response.status(200).json({
      data: profile
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPublishedArticles(_request, response, next) {
  try {
    const articles = await Article.find({ status: "published" })
      .sort({ order: 1, publishedAt: -1, createdAt: -1 })
      .lean();

    return response.status(200).json({
      data: articles
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPublishedWorkItems(_request, response, next) {
  try {
    const workItems = await Work.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return response.status(200).json({
      data: workItems
    });
  } catch (error) {
    return next(error);
  }
}
