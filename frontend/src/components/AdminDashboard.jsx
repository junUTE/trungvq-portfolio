import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createAdminArticle,
  createAdminProject,
  createAdminWorkItem,
  deleteAdminArticle,
  deleteAdminProject,
  deleteAdminWorkItem,
  getAdminArticles,
  extractErrorMessage,
  getAdminContacts,
  getAdminProfile,
  getAdminProjects,
  getAdminWorkItems,
  updateAdminArticle,
  updateAdminProfile,
  updateAdminAvatar,
  updateAdminContact,
  updateAdminProject,
  updateAdminWorkItem,
  uploadProjectImageAsset
} from "../services/portfolioApi";

const emptyProjectForm = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  content: "",
  technologies: "",
  githubLink: "",
  demoLink: "",
  image: "",
  imagePublicId: "",
  featured: false,
  status: "draft",
  order: 0
};

const emptyAssetForm = {
  url: "",
  publicId: ""
};

const emptyProfileForm = {
  displayName: "",
  brandInitials: "",
  headerAvatarUrl: "",
  heroTitle: "",
  introSegmentsJson: JSON.stringify(
    [
      { text: "Mình xây dựng web app với " },
      { text: "React", tone: "text-sky-600" },
      { text: ", " },
      { text: "Tailwind CSS", tone: "text-cyan-600" },
      { text: ", " },
      { text: "Node.js", tone: "text-emerald-600" },
      { text: " và " },
      { text: "Express", tone: "text-violet-600" },
      { text: ", tập trung vào trải nghiệm mượt, giao diện rõ ràng và luồng quản trị nội dung thật để sản phẩm có thể vận hành như một ứng dụng hoàn chỉnh." }
    ],
    null,
    2
  ),
  goalDescription: "",
  githubUrl: "",
  linkedinUrl: ""
};

const emptyArticleForm = {
  title: "",
  slug: "",
  category: "",
  readTime: "",
  excerpt: "",
  tone: "from-slate-200 to-slate-100",
  publishedAt: "",
  status: "draft",
  order: 0
};

const emptyWorkForm = {
  title: "",
  company: "",
  period: "",
  summary: "",
  highlights: "",
  status: "draft",
  order: 0
};

function toProjectForm(project) {
  if (!project) {
    return emptyProjectForm;
  }

  return {
    title: project.title || "",
    slug: project.slug || "",
    summary: project.summary || "",
    description: project.description || "",
    content: project.content || "",
    technologies: Array.isArray(project.technologies) ? project.technologies.join("\n") : "",
    githubLink: project.githubLink || "",
    demoLink: project.demoLink || "",
    image: project.image || "",
    imagePublicId: project.imagePublicId || "",
    featured: Boolean(project.featured),
    status: project.status || "draft",
    order: Number.isFinite(project.order) ? project.order : 0
  };
}

function toProjectPayload(form) {
  return {
    ...form,
    technologies: form.technologies
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean),
    order: Number(form.order) || 0
  };
}

function toProfileForm(profile) {
  if (!profile) {
    return emptyProfileForm;
  }

  return {
    displayName: profile.displayName || "",
    brandInitials: profile.brandInitials || "",
    headerAvatarUrl: profile.headerAvatarUrl || "",
    heroTitle: profile.heroTitle || "",
    introSegmentsJson: JSON.stringify(profile.introSegments || [], null, 2),
    goalDescription: profile.goalDescription || "",
    githubUrl: profile.githubUrl || "",
    linkedinUrl: profile.linkedinUrl || ""
  };
}

function toProfilePayload(form) {
  let introSegments = [];

  try {
    const parsed = JSON.parse(form.introSegmentsJson);
    introSegments = Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new Error("Intro segments JSON is invalid.");
  }

  return {
    displayName: form.displayName,
    brandInitials: form.brandInitials,
    headerAvatarUrl: form.headerAvatarUrl,
    heroTitle: form.heroTitle,
    introSegments,
    goalDescription: form.goalDescription,
    githubUrl: form.githubUrl,
    linkedinUrl: form.linkedinUrl
  };
}

export default function AdminDashboard({ user, onLogout, onUserChange, onPublicProfileChange }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [projectAssetFile, setProjectAssetFile] = useState(null);
  const [avatarForm, setAvatarForm] = useState({
    url: user?.avatar || "",
    publicId: user?.avatarPublicId || ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [projectFeedback, setProjectFeedback] = useState("");
  const [contactFeedback, setContactFeedback] = useState("");
  const [profileFeedback, setProfileFeedback] = useState("");
  const [contentFeedback, setContentFeedback] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [articles, setArticles] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [articleForm, setArticleForm] = useState(emptyArticleForm);
  const [workForm, setWorkForm] = useState(emptyWorkForm);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [selectedWorkItemId, setSelectedWorkItemId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoadingProjects(true);
      setLoadingContacts(true);
      setError("");

      try {
        const [projectsPayload, contactsPayload, profilePayload, articlesPayload, workPayload] = await Promise.all([
          getAdminProjects(),
          getAdminContacts(),
          getAdminProfile(),
          getAdminArticles(),
          getAdminWorkItems()
        ]);

        if (active) {
          setProjects(projectsPayload.data || []);
          setContacts(contactsPayload.data || []);
          setProfileForm(toProfileForm(profilePayload.data));
          setArticles(articlesPayload.data || []);
          setWorkItems(workPayload.data || []);
        }
      } catch (requestError) {
        if (active) {
          setError(extractErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoadingProjects(false);
          setLoadingContacts(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setAvatarForm({
      url: user?.avatar || "",
      publicId: user?.avatarPublicId || ""
    });
  }, [user?.avatar, user?.avatarPublicId]);

  const metrics = useMemo(
    () => [
      { label: "Authentication", value: "JWT active", helper: "Bearer token + server guard" },
      { label: "Projects", value: String(projects.length), helper: "Draft and published items" },
      { label: "Unread contacts", value: String(contacts.filter((item) => item.status !== "replied").length), helper: "Needs admin follow-up" },
      { label: "Last login", value: formatAdminDate(user?.lastLogin), helper: "Updated after successful login" }
    ],
    [contacts, projects.length, user?.lastLogin]
  );

  async function handleLogout() {
    setStatus("submitting");
    setError("");

    try {
      await onLogout();
      navigate("/admin-login", { replace: true });
    } catch (logoutError) {
      setError(extractErrorMessage(logoutError));
    } finally {
      setStatus("idle");
    }
  }

  function handleProjectFieldChange(event) {
    const { name, value, type, checked } = event.target;

    setProjectForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleAssetFieldChange(event) {
    const { name, value } = event.target;

    setAssetForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleAvatarFieldChange(event) {
    const { name, value } = event.target;

    setAvatarForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleProfileFieldChange(event) {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleArticleFieldChange(event) {
    const { name, value } = event.target;

    setArticleForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleWorkFieldChange(event) {
    const { name, value } = event.target;

    setWorkForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleProjectAssetFileChange(event) {
    setProjectAssetFile(event.target.files?.[0] || null);
  }

  function handleAvatarFileChange(event) {
    setAvatarFile(event.target.files?.[0] || null);
  }

  async function handleProjectAssetSubmit(event) {
    event.preventDefault();
    setProjectFeedback("");

    try {
      const payload = await uploadProjectImageAsset(
        projectAssetFile
          ? {
              file: await readFileAsDataUrl(projectAssetFile),
              fileName: projectAssetFile.name,
              folder: "portfolio/projects"
            }
          : assetForm
      );

      setProjectForm((current) => ({
        ...current,
        image: payload.data.url,
        imagePublicId: payload.data.publicId
      }));
      setAssetForm({
        url: payload.data.url,
        publicId: payload.data.publicId
      });
      setProjectAssetFile(null);
      setProjectFeedback(payload.message || "Project image asset is ready.");
    } catch (uploadError) {
      setProjectFeedback(extractErrorMessage(uploadError));
    }
  }

  async function handleAvatarSubmit(event) {
    event.preventDefault();
    setProfileFeedback("");

    try {
      const payload = await updateAdminAvatar(
        avatarFile
          ? {
              file: await readFileAsDataUrl(avatarFile),
              fileName: avatarFile.name,
              folder: "portfolio/avatars"
            }
          : avatarForm
      );
      onUserChange?.(payload.data.user);
      onPublicProfileChange?.((current) =>
        current
          ? {
              ...current,
              headerAvatarUrl: payload.data.user.avatar || "",
            }
          : current
      );
      setAvatarForm({
        url: payload.data.user.avatar || "",
        publicId: payload.data.user.avatarPublicId || ""
      });
      setAvatarFile(null);
      setProfileFeedback(payload.message || "Avatar updated successfully.");
    } catch (uploadError) {
      setProfileFeedback(extractErrorMessage(uploadError));
    }
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    setProjectFeedback("");

    try {
      const payload = selectedProjectId
        ? await updateAdminProject(selectedProjectId, toProjectPayload(projectForm))
        : await createAdminProject(toProjectPayload(projectForm));

      const savedProject = payload.data;

      setProjects((current) => {
        if (selectedProjectId) {
          return current.map((item) => (item._id === savedProject._id ? savedProject : item));
        }

        return [savedProject, ...current].sort(sortProjects);
      });
      setSelectedProjectId(savedProject._id);
      setProjectForm(toProjectForm(savedProject));
      setProjectFeedback(payload.message || "Project saved successfully.");
    } catch (saveError) {
      setProjectFeedback(extractErrorMessage(saveError));
    }
  }

  function handleProjectEdit(project) {
    setSelectedProjectId(project._id);
    setProjectForm(toProjectForm(project));
    setAssetForm({
      url: project.image || "",
      publicId: project.imagePublicId || ""
    });
    setProjectAssetFile(null);
    setProjectFeedback(`Editing ${project.title}.`);
  }

  function handleProjectReset() {
    setSelectedProjectId("");
    setProjectForm(emptyProjectForm);
    setAssetForm(emptyAssetForm);
    setProjectAssetFile(null);
    setProjectFeedback("Ready to create a new project.");
  }

  async function handleProjectDelete(projectId) {
    const project = projects.find((item) => item._id === projectId);

    if (!project || !window.confirm(`Delete project "${project.title}"?`)) {
      return;
    }

    setProjectFeedback("");

    try {
      const payload = await deleteAdminProject(projectId);

      setProjects((current) => current.filter((item) => item._id !== projectId));

      if (selectedProjectId === projectId) {
        handleProjectReset();
      }

      setProjectFeedback(payload.message || "Project deleted successfully.");
    } catch (deleteError) {
      setProjectFeedback(extractErrorMessage(deleteError));
    }
  }

  async function handleContactStatusChange(contactId, statusValue) {
    setContactFeedback("");

    try {
      const payload = await updateAdminContact(contactId, { status: statusValue });
      const updatedContact = payload.data;

      setContacts((current) => current.map((item) => (item._id === updatedContact._id ? updatedContact : item)));
      setContactFeedback(payload.message || "Contact updated successfully.");
    } catch (updateError) {
      setContactFeedback(extractErrorMessage(updateError));
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setContentFeedback("");

    try {
      const payload = await updateAdminProfile(toProfilePayload(profileForm));
      setProfileForm(toProfileForm(payload.data));
      onPublicProfileChange?.(payload.data);
      setContentFeedback(payload.message || "Profile updated successfully.");
    } catch (updateError) {
      setContentFeedback(extractErrorMessage(updateError));
    }
  }

  async function handleArticleSubmit(event) {
    event.preventDefault();
    setContentFeedback("");

    try {
      const payload = selectedArticleId
        ? await updateAdminArticle(selectedArticleId, toArticlePayload(articleForm))
        : await createAdminArticle(toArticlePayload(articleForm));
      const savedArticle = payload.data;

      setArticles((current) => {
        if (selectedArticleId) {
          return current.map((item) => (item._id === savedArticle._id ? savedArticle : item)).sort(sortContentByOrderAndDate);
        }

        return [savedArticle, ...current].sort(sortContentByOrderAndDate);
      });
      setSelectedArticleId(savedArticle._id);
      setArticleForm(toArticleForm(savedArticle));
      setContentFeedback(payload.message || "Article saved successfully.");
    } catch (saveError) {
      setContentFeedback(extractErrorMessage(saveError));
    }
  }

  async function handleArticleDelete(articleId) {
    const article = articles.find((item) => item._id === articleId);

    if (!article || !window.confirm(`Delete article "${article.title}"?`)) {
      return;
    }

    setContentFeedback("");

    try {
      const payload = await deleteAdminArticle(articleId);
      setArticles((current) => current.filter((item) => item._id !== articleId));

      if (selectedArticleId === articleId) {
        setSelectedArticleId("");
        setArticleForm(emptyArticleForm);
      }

      setContentFeedback(payload.message || "Article deleted successfully.");
    } catch (deleteError) {
      setContentFeedback(extractErrorMessage(deleteError));
    }
  }

  async function handleWorkSubmit(event) {
    event.preventDefault();
    setContentFeedback("");

    try {
      const payload = selectedWorkItemId
        ? await updateAdminWorkItem(selectedWorkItemId, toWorkPayload(workForm))
        : await createAdminWorkItem(toWorkPayload(workForm));
      const savedWorkItem = payload.data;

      setWorkItems((current) => {
        if (selectedWorkItemId) {
          return current.map((item) => (item._id === savedWorkItem._id ? savedWorkItem : item)).sort(sortContentByOrderAndDate);
        }

        return [savedWorkItem, ...current].sort(sortContentByOrderAndDate);
      });
      setSelectedWorkItemId(savedWorkItem._id);
      setWorkForm(toWorkForm(savedWorkItem));
      setContentFeedback(payload.message || "Work item saved successfully.");
    } catch (saveError) {
      setContentFeedback(extractErrorMessage(saveError));
    }
  }

  async function handleWorkDelete(workItemId) {
    const workItem = workItems.find((item) => item._id === workItemId);

    if (!workItem || !window.confirm(`Delete work item "${workItem.title}"?`)) {
      return;
    }

    setContentFeedback("");

    try {
      const payload = await deleteAdminWorkItem(workItemId);
      setWorkItems((current) => current.filter((item) => item._id !== workItemId));

      if (selectedWorkItemId === workItemId) {
        setSelectedWorkItemId("");
        setWorkForm(emptyWorkForm);
      }

      setContentFeedback(payload.message || "Work item deleted successfully.");
    } catch (deleteError) {
      setContentFeedback(extractErrorMessage(deleteError));
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.96))] p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-light text-white sm:text-5xl">Welcome back, {user?.username}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Manage projects, contacts, articles, work items, and media assets from one place without editing source code manually.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-100"
              >
                View public site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={status === "submitting"}
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {error ? <InfoCard className="mt-6" tone="error" message={error} /> : null}

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                <p className="mt-4 text-2xl font-light text-white">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{metric.helper}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Project editor</p>
                <h2 className="mt-3 text-3xl font-light text-white">
                  {selectedProjectId ? "Update project" : "Create new project"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleProjectReset}
                className="rounded-full border border-white/15 px-4 py-2 text-sm uppercase tracking-[0.18em] text-slate-200"
              >
                Reset form
              </button>
            </div>

            <form onSubmit={handleProjectAssetSubmit} className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Project image asset</p>
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Upload image file</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleProjectAssetFileChange}
                  className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Existing Image URL</span>
                  <input
                    name="url"
                    value={assetForm.url}
                    onChange={handleAssetFieldChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="https://..."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Existing Public ID</span>
                  <input
                    name="publicId"
                    value={assetForm.publicId}
                    onChange={handleAssetFieldChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="portfolio/projects/project-name"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-fit rounded-full bg-sky-500 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-950"
              >
                {projectAssetFile ? "Upload project image" : "Save existing image asset"}
              </button>
            </form>

            <form onSubmit={handleProjectSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title" labelClassName="text-sm font-medium text-slate-700">
                  <input
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectFieldChange}
                    required
                    className={fieldClassName}
                  />
                </Field>
                <Field label="Slug">
                  <input name="slug" value={projectForm.slug} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
              </div>

              <Field label="Summary">
                <input name="summary" value={projectForm.summary} onChange={handleProjectFieldChange} required className={fieldClassName} />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  rows="3"
                  value={projectForm.description}
                  onChange={handleProjectFieldChange}
                  required
                  className={fieldClassName}
                />
              </Field>

              <Field label="Content">
                <textarea
                  name="content"
                  rows="5"
                  value={projectForm.content}
                  onChange={handleProjectFieldChange}
                  required
                  className={fieldClassName}
                />
              </Field>

              <Field label="Technologies (one per line)">
                <textarea
                  name="technologies"
                  rows="5"
                  value={projectForm.technologies}
                  onChange={handleProjectFieldChange}
                  className={fieldClassName}
                  placeholder={"React\nNode.js\nMongoDB"}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="GitHub URL">
                  <input name="githubLink" value={projectForm.githubLink} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
                <Field label="Demo URL">
                  <input name="demoLink" value={projectForm.demoLink} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Image URL">
                  <input name="image" value={projectForm.image} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
                <Field label="Image Public ID">
                  <input name="imagePublicId" value={projectForm.imagePublicId} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Status">
                  <select name="status" value={projectForm.status} onChange={handleProjectFieldChange} className={fieldClassName}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </Field>
                <Field label="Order">
                  <input name="order" type="number" value={projectForm.order} onChange={handleProjectFieldChange} className={fieldClassName} />
                </Field>
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <input
                    name="featured"
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={handleProjectFieldChange}
                    className="h-4 w-4 rounded border-white/20 bg-slate-950/60"
                  />
                  Featured project
                </label>
              </div>

              {projectFeedback ? <InfoCard tone={projectFeedback.includes("success") ? "success" : "default"} message={projectFeedback} /> : null}

              <button
                type="submit"
                className="w-fit rounded-full bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-900"
              >
                {selectedProjectId ? "Update project" : "Create project"}
              </button>
            </form>
          </section>

          <section className="grid gap-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Admin profile</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-slate-500">{user?.username?.slice(0, 1)?.toUpperCase() || "A"}</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900">{user?.username}</p>
                  <p className="text-sm text-slate-500">{user?.role}</p>
                </div>
              </div>

              <form onSubmit={handleAvatarSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-700">Upload avatar file</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleAvatarFileChange}
                    className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                </label>
                <Field label="Avatar URL">
                  <input name="url" value={avatarForm.url} onChange={handleAvatarFieldChange} className={lightFieldClassName} />
                </Field>
                <Field label="Avatar Public ID">
                  <input name="publicId" value={avatarForm.publicId} onChange={handleAvatarFieldChange} className={lightFieldClassName} />
                </Field>
                {profileFeedback ? <InfoCard message={profileFeedback} /> : null}
                <button
                  type="submit"
                  className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
                >
                  Save avatar
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Project list</p>
                  <h2 className="mt-3 text-3xl font-light text-slate-900">All projects</h2>
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{projects.length} items</p>
              </div>

              {loadingProjects ? <InfoCard className="mt-6" message="Loading projects..." /> : null}

              {!loadingProjects ? (
                <div className="mt-6 space-y-4">
                  {[...projects].sort(sortProjects).map((project) => (
                    <article key={project._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-medium text-slate-900">{project.title}</h3>
                            <StatusBadge value={project.status} />
                            {project.featured ? <StatusBadge value="featured" /> : null}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                            {project.slug} · order {project.order || 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleProjectEdit(project)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProjectDelete(project._id)}
                            className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Contact management</p>
              <h2 className="mt-3 text-3xl font-light text-slate-900">Inbox</h2>
            </div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{contacts.length} messages</p>
          </div>

          {contactFeedback ? <InfoCard className="mt-6" message={contactFeedback} /> : null}
          {loadingContacts ? <InfoCard className="mt-6" message="Loading contacts..." /> : null}

          {!loadingContacts ? (
            <div className="mt-6 grid gap-4">
              {contacts.map((contact) => (
                <article key={contact._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-medium text-slate-900">{contact.name}</h3>
                        <StatusBadge value={contact.status} />
                        <span className="text-sm text-slate-500">{contact.email}</span>
                      </div>
                      <p className="mt-4 text-base leading-7 text-slate-600">{contact.message}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                        Received {formatAdminDate(contact.createdAt)}
                        {contact.repliedAt ? ` · replied ${formatAdminDate(contact.repliedAt)}` : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleContactStatusChange(contact._id, "replied")}
                        disabled={contact.status === "replied"}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Mark replied
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContactStatusChange(contact._id, "unread")}
                        disabled={contact.status === "unread"}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Mark unread
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800 xl:col-span-1">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Profile content</p>
            <h2 className="mt-3 text-3xl font-light text-slate-900">Profile settings</h2>

            <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Display name" labelClassName="text-sm font-medium text-slate-700">
                  <input name="displayName" value={profileForm.displayName} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                </Field>
                <Field label="Brand initials" labelClassName="text-sm font-medium text-slate-700">
                  <input name="brandInitials" value={profileForm.brandInitials} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                </Field>
              </div>
              <Field label="Hero title" labelClassName="text-sm font-medium text-slate-700">
                <input name="heroTitle" value={profileForm.heroTitle} onChange={handleProfileFieldChange} className={lightFieldClassName} />
              </Field>
              <Field label="Intro segments JSON" labelClassName="text-sm font-medium text-slate-700">
                <textarea
                  name="introSegmentsJson"
                  rows="10"
                  value={profileForm.introSegmentsJson}
                  onChange={handleProfileFieldChange}
                  className={lightFieldClassName}
                />
              </Field>
              <Field label="Goal description" labelClassName="text-sm font-medium text-slate-700">
                <textarea
                  name="goalDescription"
                  rows="4"
                  value={profileForm.goalDescription}
                  onChange={handleProfileFieldChange}
                  className={lightFieldClassName}
                />
              </Field>
              <Field label="GitHub URL" labelClassName="text-sm font-medium text-slate-700">
                <input name="githubUrl" value={profileForm.githubUrl} onChange={handleProfileFieldChange} className={lightFieldClassName} />
              </Field>
              <Field label="LinkedIn URL" labelClassName="text-sm font-medium text-slate-700">
                <input name="linkedinUrl" value={profileForm.linkedinUrl} onChange={handleProfileFieldChange} className={lightFieldClassName} />
              </Field>
              {contentFeedback ? <InfoCard message={contentFeedback} /> : null}
              <button
                type="submit"
                className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
              >
                Save profile content
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800 xl:col-span-2">
            <div className="grid gap-6 2xl:grid-cols-2">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Articles</p>
                    <h2 className="mt-3 text-3xl font-light text-slate-900">Manage articles</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArticleId("");
                      setArticleForm(emptyArticleForm);
                    }}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700"
                  >
                    New article
                  </button>
                </div>

                <form onSubmit={handleArticleSubmit} className="mt-6 grid gap-4">
                  <Field label="Title" labelClassName="text-sm font-medium text-slate-700">
                    <input name="title" value={articleForm.title} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                  </Field>
                  <Field label="Slug" labelClassName="text-sm font-medium text-slate-700">
                    <input name="slug" value={articleForm.slug} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Category" labelClassName="text-sm font-medium text-slate-700">
                      <input name="category" value={articleForm.category} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                    </Field>
                    <Field label="Read time" labelClassName="text-sm font-medium text-slate-700">
                      <input name="readTime" value={articleForm.readTime} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                    </Field>
                  </div>
                  <Field label="Excerpt" labelClassName="text-sm font-medium text-slate-700">
                    <textarea name="excerpt" rows="4" value={articleForm.excerpt} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Tone" labelClassName="text-sm font-medium text-slate-700">
                      <input name="tone" value={articleForm.tone} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                    </Field>
                    <Field label="Published at" labelClassName="text-sm font-medium text-slate-700">
                      <input
                        name="publishedAt"
                        type="date"
                        value={articleForm.publishedAt}
                        onChange={handleArticleFieldChange}
                        className={lightFieldClassName}
                      />
                    </Field>
                    <Field label="Order" labelClassName="text-sm font-medium text-slate-700">
                      <input name="order" type="number" value={articleForm.order} onChange={handleArticleFieldChange} className={lightFieldClassName} />
                    </Field>
                  </div>
                  <Field label="Status" labelClassName="text-sm font-medium text-slate-700">
                    <select name="status" value={articleForm.status} onChange={handleArticleFieldChange} className={lightFieldClassName}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </Field>
                  <button
                    type="submit"
                    className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
                  >
                    {selectedArticleId ? "Update article" : "Create article"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {[...articles].sort(sortContentByOrderAndDate).map((article) => (
                  <article key={article._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-medium text-slate-900">{article.title}</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {article.category} · {article.readTime}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                      </div>
                      <StatusBadge value={article.status} />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedArticleId(article._id);
                          setArticleForm(toArticleForm(article));
                        }}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArticleDelete(article._id)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800">
          <div className="grid gap-6 xl:grid-cols-2">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Work</p>
                  <h2 className="mt-3 text-3xl font-light text-slate-900">Manage work items</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWorkItemId("");
                    setWorkForm(emptyWorkForm);
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700"
                >
                  New work item
                </button>
              </div>

              <form onSubmit={handleWorkSubmit} className="mt-6 grid gap-4">
                <Field label="Title">
                  <input name="title" value={workForm.title} onChange={handleWorkFieldChange} className={lightFieldClassName} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Company" labelClassName="text-sm font-medium text-slate-700">
                    <input name="company" value={workForm.company} onChange={handleWorkFieldChange} className={lightFieldClassName} />
                  </Field>
                  <Field label="Period" labelClassName="text-sm font-medium text-slate-700">
                    <input name="period" value={workForm.period} onChange={handleWorkFieldChange} className={lightFieldClassName} />
                  </Field>
                </div>
                <Field label="Summary" labelClassName="text-sm font-medium text-slate-700">
                  <textarea name="summary" rows="4" value={workForm.summary} onChange={handleWorkFieldChange} className={lightFieldClassName} />
                </Field>
                <Field label="Highlights (comma separated)" labelClassName="text-sm font-medium text-slate-700">
                  <input
                    name="highlights"
                    value={workForm.highlights}
                    onChange={handleWorkFieldChange}
                    className={lightFieldClassName}
                    placeholder="React, CRUD workflows, Dashboard UI"
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Status" labelClassName="text-sm font-medium text-slate-700">
                    <select name="status" value={workForm.status} onChange={handleWorkFieldChange} className={lightFieldClassName}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </Field>
                  <Field label="Order" labelClassName="text-sm font-medium text-slate-700">
                    <input name="order" type="number" value={workForm.order} onChange={handleWorkFieldChange} className={lightFieldClassName} />
                  </Field>
                </div>
                <button
                  type="submit"
                  className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
                >
                  {selectedWorkItemId ? "Update work item" : "Create work item"}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {[...workItems].sort(sortContentByOrderAndDate).map((item) => (
                <article key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{[item.company, item.period].filter(Boolean).join(" · ")}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                    </div>
                    <StatusBadge value={item.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(item.highlights || []).map((highlight) => (
                      <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWorkItemId(item._id);
                        setWorkForm(toWorkForm(item));
                      }}
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWorkDelete(item._id)}
                      className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

async function readFileAsDataUrl(file) {
  if (!file) {
    return "";
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5MB.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

function Field({ label, children, labelClassName = "text-sm text-slate-300" }) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className={labelClassName}>{label}</span>
      {children}
    </label>
  );
}

function InfoCard({ message, tone = "default", className = "" }) {
  const palette =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-600";

  return <div className={`rounded-2xl border p-5 text-sm ${palette} ${className}`.trim()}>{message}</div>;
}

function StatusBadge({ value }) {
  const palette =
    value === "published" || value === "replied"
      ? "bg-emerald-100 text-emerald-700"
      : value === "featured"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-200 text-slate-600";

  return <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${palette}`}>{value}</span>;
}

function sortProjects(left, right) {
  if ((left.order || 0) !== (right.order || 0)) {
    return (left.order || 0) - (right.order || 0);
  }

  return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
}

function formatAdminDate(value) {
  if (!value) {
    return "Just created";
  }

  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function toArticleForm(article) {
  if (!article) {
    return emptyArticleForm;
  }

  return {
    title: article.title || "",
    slug: article.slug || "",
    category: article.category || "",
    readTime: article.readTime || "",
    excerpt: article.excerpt || "",
    tone: article.tone || "from-slate-200 to-slate-100",
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : "",
    status: article.status || "draft",
    order: Number.isFinite(article.order) ? article.order : 0
  };
}

function toArticlePayload(form) {
  return {
    ...form,
    order: Number(form.order) || 0
  };
}

function toWorkForm(workItem) {
  if (!workItem) {
    return emptyWorkForm;
  }

  return {
    title: workItem.title || "",
    company: workItem.company || "",
    period: workItem.period || "",
    summary: workItem.summary || "",
    highlights: Array.isArray(workItem.highlights) ? workItem.highlights.join(", ") : "",
    status: workItem.status || "draft",
    order: Number.isFinite(workItem.order) ? workItem.order : 0
  };
}

function toWorkPayload(form) {
  return {
    ...form,
    highlights: form.highlights
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    order: Number(form.order) || 0
  };
}

function sortContentByOrderAndDate(left, right) {
  if ((left.order || 0) !== (right.order || 0)) {
    return (left.order || 0) - (right.order || 0);
  }

  return new Date(right.publishedAt || right.createdAt || 0).getTime() - new Date(left.publishedAt || left.createdAt || 0).getTime();
}

const fieldClassName =
  "w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400";

const lightFieldClassName =
  "w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white";
