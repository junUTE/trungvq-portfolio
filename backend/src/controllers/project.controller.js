import Project from "../models/project.model.js";

export async function getPublishedProjects(_request, response, next) {
  try {
    const projects = await Project.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    response.status(200).json({
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectBySlug(request, response, next) {
  try {
    const project = await Project.findOne({
      slug: request.params.slug,
      status: "published"
    }).lean();

    if (!project) {
      return response.status(404).json({
        message: "Project not found."
      });
    }

    return response.status(200).json({
      data: project
    });
  } catch (error) {
    return next(error);
  }
}
