import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createAdminProject,
  deleteAdminProject,
  extractErrorMessage,
  getAdminContacts,
  getAdminProjects,
  updateAdminAvatar,
  updateAdminContact,
  updateAdminProject,
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
    technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : "",
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
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    order: Number(form.order) || 0
  };
}

export default function AdminDashboard({ user, onLogout, onUserChange }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [avatarForm, setAvatarForm] = useState({
    url: user?.avatar || "",
    publicId: user?.avatarPublicId || ""
  });
  const [projectFeedback, setProjectFeedback] = useState("");
  const [contactFeedback, setContactFeedback] = useState("");
  const [profileFeedback, setProfileFeedback] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoadingProjects(true);
      setLoadingContacts(true);
      setError("");

      try {
        const [projectsPayload, contactsPayload] = await Promise.all([getAdminProjects(), getAdminContacts()]);

        if (active) {
          setProjects(projectsPayload.data || []);
          setContacts(contactsPayload.data || []);
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

  async function handleProjectAssetSubmit(event) {
    event.preventDefault();
    setProjectFeedback("");

    try {
      const payload = await uploadProjectImageAsset(assetForm);

      setProjectForm((current) => ({
        ...current,
        image: payload.data.url,
        imagePublicId: payload.data.publicId
      }));
      setProjectFeedback(payload.message || "Project image asset is ready.");
    } catch (uploadError) {
      setProjectFeedback(extractErrorMessage(uploadError));
    }
  }

  async function handleAvatarSubmit(event) {
    event.preventDefault();
    setProfileFeedback("");

    try {
      const payload = await updateAdminAvatar(avatarForm);
      onUserChange?.(payload.data.user);
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
    setProjectFeedback(`Editing ${project.title}.`);
  }

  function handleProjectReset() {
    setSelectedProjectId("");
    setProjectForm(emptyProjectForm);
    setAssetForm(emptyAssetForm);
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

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.96))] p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-light text-white sm:text-5xl">Xin chao, {user?.username}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Khu vuc quan tri da co CRUD project, quan ly contact va API upload asset de ban khong can sua code tay nua.
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
                  {selectedProjectId ? "Cap nhat project" : "Tao project moi"}
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
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Image URL</span>
                  <input
                    name="url"
                    value={assetForm.url}
                    onChange={handleAssetFieldChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
                    placeholder="https://..."
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-slate-300">Public ID</span>
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
                Save image asset
              </button>
            </form>

            <form onSubmit={handleProjectSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
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

              <Field label="Technologies">
                <input
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleProjectFieldChange}
                  className={fieldClassName}
                  placeholder="React, Node.js, MongoDB"
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
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-slate-300">{label}</span>
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
    return "Just seeded";
  }

  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

const fieldClassName =
  "rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400";

const lightFieldClassName =
  "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-400";
