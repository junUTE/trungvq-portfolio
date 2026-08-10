import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createAdminArticle,
  createAdminCodeItem,
  createAdminProject,
  createAdminWorkItem,
  deleteAdminArticle,
  deleteAdminCodeItem,
  deleteAdminProject,
  deleteAdminWorkItem,
  getAdminArticles,
  getAdminCodeItems,
  extractErrorMessage,
  getAdminContacts,
  getAdminProfile,
  getAdminProjects,
  getAdminWorkItems,
  updateAdminArticle,
  updateAdminCodeItem,
  updateAdminProfile,
  updateAdminAvatar,
  updateAdminContact,
  updateAdminProject,
  updateAdminWorkItem,
  uploadProjectImageAsset
} from "../services/portfolioApi";

const emptyProjectForm = {
  titleVi: "",
  titleEn: "",
  slug: "",
  summaryVi: "",
  summaryEn: "",
  contentVi: "",
  contentEn: "",
  myRoleVi: "",
  myRoleEn: "",
  technologies: "",
  githubLink: "",
  githubLinkSecondary: "",
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
  heroTitleVi: "",
  heroTitleEn: "",
  introSegmentsJson: JSON.stringify(
    [
      { text: { vi: "Mình xây dựng web app với ", en: "I build web apps with " } },
      { text: { vi: "React", en: "React" }, tone: "text-sky-600" },
      { text: { vi: ", ", en: ", " } },
      { text: { vi: "Tailwind CSS", en: "Tailwind CSS" }, tone: "text-cyan-600" },
      { text: { vi: ", ", en: ", " } },
      { text: { vi: "Node.js", en: "Node.js" }, tone: "text-emerald-600" },
      { text: { vi: " và ", en: " and " } },
      { text: { vi: "Express", en: "Express" }, tone: "text-violet-600" },
      {
        text: {
          vi: ", tập trung vào trải nghiệm mượt, giao diện rõ ràng và luồng quản trị nội dung thật để sản phẩm có thể vận hành như một ứng dụng hoàn chỉnh.",
          en: ", with a focus on smooth UX, clear interfaces, and real content workflows so the product can operate like a complete application."
        }
      }
    ],
    null,
    2
  ),
  goalDescriptionVi: "",
  goalDescriptionEn: "",
  githubUrl: "",
  linkedinUrl: ""
};

const emptyArticleForm = {
  titleVi: "",
  titleEn: "",
  slug: "",
  categoryVi: "",
  categoryEn: "",
  readTimeVi: "",
  readTimeEn: "",
  excerptVi: "",
  excerptEn: "",
  tone: "from-slate-200 to-slate-100",
  publishedAt: "",
  status: "draft",
  order: 0
};

const emptyWorkForm = {
  titleVi: "",
  titleEn: "",
  companyVi: "",
  companyEn: "",
  periodVi: "",
  periodEn: "",
  summaryVi: "",
  summaryEn: "",
  highlightsVi: "",
  highlightsEn: "",
  status: "draft",
  order: 0
};

const emptyCodeForm = {
  owner: "",
  name: "",
  summaryVi: "",
  summaryEn: "",
  repositoryUrl: "",
  tags: "",
  status: "draft",
  order: 0
};

function toProjectForm(project) {
  if (!project) {
    return emptyProjectForm;
  }

  return {
    titleVi: getLocalizedFormValue(project.title, "vi"),
    titleEn: getLocalizedFormValue(project.title, "en"),
    slug: project.slug || "",
    summaryVi: getLocalizedFormValue(project.summary, "vi"),
    summaryEn: getLocalizedFormValue(project.summary, "en"),
    contentVi: getLocalizedFormValue(project.content, "vi"),
    contentEn: getLocalizedFormValue(project.content, "en"),
    myRoleVi: getLocalizedFormValue(project.myRole, "vi"),
    myRoleEn: getLocalizedFormValue(project.myRole, "en"),
    technologies: Array.isArray(project.technologies) ? project.technologies.join("\n") : "",
    githubLink: project.githubLink || "",
    githubLinkSecondary: project.githubLinkSecondary || "",
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
    title: toLocalizedPayload(form.titleVi, form.titleEn),
    slug: form.slug,
    summary: toLocalizedPayload(form.summaryVi, form.summaryEn),
    description: toLocalizedPayload(form.summaryVi, form.summaryEn),
    content: toLocalizedPayload(form.contentVi, form.contentEn),
    myRole: toLocalizedPayload(form.myRoleVi, form.myRoleEn),
    technologies: form.technologies
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean),
    githubLink: form.githubLink,
    githubLinkSecondary: form.githubLinkSecondary,
    demoLink: form.demoLink,
    image: form.image,
    imagePublicId: form.imagePublicId,
    featured: form.featured,
    status: form.status,
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
    heroTitleVi: getLocalizedFormValue(profile.heroTitle, "vi"),
    heroTitleEn: getLocalizedFormValue(profile.heroTitle, "en"),
    introSegmentsJson: JSON.stringify(profile.introSegments || [], null, 2),
    goalDescriptionVi: getLocalizedFormValue(profile.goalDescription, "vi"),
    goalDescriptionEn: getLocalizedFormValue(profile.goalDescription, "en"),
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
    heroTitle: toLocalizedPayload(form.heroTitleVi, form.heroTitleEn),
    introSegments,
    goalDescription: toLocalizedPayload(form.goalDescriptionVi, form.goalDescriptionEn),
    githubUrl: form.githubUrl,
    linkedinUrl: form.linkedinUrl
  };
}

function toCodeForm(codeItem) {
  if (!codeItem) {
    return emptyCodeForm;
  }

  return {
    owner: codeItem.owner || "",
    name: codeItem.name || "",
    summaryVi: getLocalizedFormValue(codeItem.summary, "vi"),
    summaryEn: getLocalizedFormValue(codeItem.summary, "en"),
    repositoryUrl: codeItem.repositoryUrl || "",
    tags: Array.isArray(codeItem.tags) ? codeItem.tags.map((tag) => `${getLocalizedFormValue(tag.label, "vi")}|${getLocalizedFormValue(tag.label, "en")}|${tag.color || "bg-slate-500"}`).join("\n") : "",
    status: codeItem.status || "draft",
    order: Number.isFinite(codeItem.order) ? codeItem.order : 0
  };
}

function toCodePayload(form) {
  return {
    owner: form.owner,
    name: form.name,
    summary: toLocalizedPayload(form.summaryVi, form.summaryEn),
    repositoryUrl: form.repositoryUrl,
    tags: form.tags
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [labelViPart, labelEnPart, colorPart] = item.split("|");

        return {
          label: toLocalizedPayload((labelViPart || "").trim(), (labelEnPart || "").trim()),
          color: (colorPart || "bg-slate-500").trim() || "bg-slate-500"
        };
      })
      .filter((tag) => tag.label.vi || tag.label.en),
    status: form.status,
    order: Number(form.order) || 0
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
  const [projectAssetPreviewUrl, setProjectAssetPreviewUrl] = useState("");
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
  const [codeItems, setCodeItems] = useState([]);
  const [articleForm, setArticleForm] = useState(emptyArticleForm);
  const [workForm, setWorkForm] = useState(emptyWorkForm);
  const [codeForm, setCodeForm] = useState(emptyCodeForm);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [selectedWorkItemId, setSelectedWorkItemId] = useState("");
  const [selectedCodeItemId, setSelectedCodeItemId] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoadingProjects(true);
      setLoadingContacts(true);
      setError("");

      try {
        const [projectsPayload, contactsPayload, profilePayload, articlesPayload, workPayload, codePayload] = await Promise.all([
          getAdminProjects(),
          getAdminContacts(),
          getAdminProfile(),
          getAdminArticles(),
          getAdminWorkItems(),
          getAdminCodeItems()
        ]);

        if (active) {
          setProjects(projectsPayload.data || []);
          setContacts(contactsPayload.data || []);
          setProfileForm(toProfileForm(profilePayload.data));
          setArticles(articlesPayload.data || []);
          setWorkItems(workPayload.data || []);
          setCodeItems(codePayload.data || []);
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

  useEffect(() => {
    if (!projectAssetFile) {
      setProjectAssetPreviewUrl("");
      return undefined;
    }

    const nextObjectUrl = URL.createObjectURL(projectAssetFile);
    setProjectAssetPreviewUrl(nextObjectUrl);

    return () => {
      URL.revokeObjectURL(nextObjectUrl);
    };
  }, [projectAssetFile]);

  const metrics = useMemo(
    () => [
      { label: "Authentication", value: "JWT active", helper: "Bearer token + server guard" },
      { label: "Projects", value: String(projects.length), helper: "Draft and published items" },
      { label: "Code repos", value: String(codeItems.length), helper: "Public repositories and experiments" },
      { label: "Unread contacts", value: String(contacts.filter((item) => item.status !== "replied").length), helper: "Needs admin follow-up" },
      { label: "Last login", value: formatAdminDate(user?.lastLogin), helper: "Updated after successful login" }
    ],
    [codeItems.length, contacts, projects.length, user?.lastLogin]
  );

  const dashboardTabs = [
    { id: "overview", label: "Overview", helper: "Metrics and shortcuts" },
    { id: "projects", label: "Projects", helper: "Portfolio items and assets" },
    { id: "contacts", label: "Inbox", helper: "Messages in table view" },
    { id: "profile", label: "Profile", helper: "Admin and public profile" },
    { id: "content", label: "Content", helper: "Articles, work, code" }
  ];

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

  function handleCodeFieldChange(event) {
    const { name, value } = event.target;

    setCodeForm((current) => ({
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
      const payload = await uploadProjectAsset();

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

  async function uploadProjectAsset() {
    return uploadProjectImageAsset(
      projectAssetFile
        ? {
            file: await readFileAsDataUrl(projectAssetFile),
            fileName: projectAssetFile.name,
            folder: "portfolio/projects"
          }
        : assetForm
    );
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
      let nextProjectForm = projectForm;

      if (projectAssetFile) {
        const assetPayload = await uploadProjectAsset();
        nextProjectForm = {
          ...projectForm,
          image: assetPayload.data.url,
          imagePublicId: assetPayload.data.publicId
        };
        setProjectForm(nextProjectForm);
        setAssetForm({
          url: assetPayload.data.url,
          publicId: assetPayload.data.publicId
        });
        setProjectAssetFile(null);
      }

      const payload = selectedProjectId
        ? await updateAdminProject(selectedProjectId, toProjectPayload(nextProjectForm))
        : await createAdminProject(toProjectPayload(nextProjectForm));

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

  async function handleCodeSubmit(event) {
    event.preventDefault();
    setContentFeedback("");

    try {
      const payload = selectedCodeItemId
        ? await updateAdminCodeItem(selectedCodeItemId, toCodePayload(codeForm))
        : await createAdminCodeItem(toCodePayload(codeForm));
      const savedCodeItem = payload.data;

      setCodeItems((current) => {
        if (selectedCodeItemId) {
          return current.map((item) => (item._id === savedCodeItem._id ? savedCodeItem : item)).sort(sortContentByOrderAndDate);
        }

        return [savedCodeItem, ...current].sort(sortContentByOrderAndDate);
      });
      setSelectedCodeItemId(savedCodeItem._id);
      setCodeForm(toCodeForm(savedCodeItem));
      setContentFeedback(payload.message || "Code item saved successfully.");
    } catch (saveError) {
      setContentFeedback(extractErrorMessage(saveError));
    }
  }

  async function handleCodeDelete(codeItemId) {
    const codeItem = codeItems.find((item) => item._id === codeItemId);

    if (!codeItem || !window.confirm(`Delete code item "${codeItem.name}"?`)) {
      return;
    }

    setContentFeedback("");

    try {
      const payload = await deleteAdminCodeItem(codeItemId);
      setCodeItems((current) => current.filter((item) => item._id !== codeItemId));

      if (selectedCodeItemId === codeItemId) {
        setSelectedCodeItemId("");
        setCodeForm(emptyCodeForm);
      }

      setContentFeedback(payload.message || "Code item deleted successfully.");
    } catch (deleteError) {
      setContentFeedback(extractErrorMessage(deleteError));
    }
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-slate-800 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(255,255,255,0.94),_rgba(240,249,255,0.96))] p-8 shadow-[0_24px_70px_rgba(148,163,184,0.2)] sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Admin Dashboard</p>
              <h1 className="mt-4 text-4xl font-light text-slate-900 sm:text-5xl">Welcome back, {user?.username}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Chuyển giữa từng khu vực theo chủ đề để quản lý portfolio, inbox và nội dung mà không cần cuộn qua một trang dài.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-700"
              >
                View public site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={status === "submitting"}
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {error ? <InfoCard className="mt-6" tone="error" message={error} /> : null}

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
              <article key={metric.label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                <p className="mt-4 text-2xl font-light text-slate-900">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{metric.helper}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {dashboardTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-3xl border px-5 py-4 text-left transition ${
                  activeTab === tab.id
                    ? "border-sky-400 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{tab.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tab.helper}</p>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Quick status</p>
              <h2 className="mt-3 text-3xl font-light text-slate-900">What needs attention today</h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Inbox</p>
                  <p className="mt-3 text-2xl font-light text-slate-900">
                    {contacts.filter((item) => item.status !== "replied").length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Tin nhắn chưa phản hồi đang chờ xử lý trong tab Inbox.</p>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Projects</p>
                  <p className="mt-3 text-2xl font-light text-slate-900">
                    {projects.filter((item) => item.status === "published").length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Dự án đã publish và đang hiển thị ngoài trang public.</p>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Content</p>
                  <p className="mt-3 text-2xl font-light text-slate-900">
                    {articles.length + workItems.length + codeItems.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Tổng số bài viết, work item và repository đang được quản lý.</p>
                </article>
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
                  <p className="mt-3 text-lg font-medium text-slate-900">{profileForm.displayName || user?.username}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Avatar, hero copy và social links nằm trong tab Profile.</p>
                </article>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Recent inbox</p>
              <h2 className="mt-3 text-3xl font-light text-slate-900">Latest messages</h2>

              <div className="mt-6 space-y-4">
                {contacts.slice(0, 4).map((contact) => (
                  <article key={contact._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-slate-900">{contact.name}</h3>
                          <StatusBadge value={contact.status} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{contact.email}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{truncateText(contact.message, 120)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("contacts")}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700"
                      >
                        Open inbox
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === "projects" ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Project editor</p>
                  <h2 className="mt-3 text-3xl font-light text-slate-900">
                    {selectedProjectId ? "Update project" : "Create new project"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleProjectReset}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm uppercase tracking-[0.18em] text-slate-700"
                >
                  Reset form
                </button>
              </div>

              <form onSubmit={handleProjectAssetSubmit} className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Project image asset</p>
                {projectAssetFile ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="aspect-[16/9] bg-slate-100">
                      <img
                        src={projectAssetPreviewUrl}
                        alt="Selected project asset preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <p className="text-sm text-slate-500">Preview ảnh mới trước khi upload vào project.</p>
                      <button
                        type="button"
                        onClick={() => setProjectAssetFile(null)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700"
                      >
                        Clear selection
                      </button>
                    </div>
                  </div>
                ) : null}
                {(projectForm.image || assetForm.url) && !projectAssetFile ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="aspect-[16/9] bg-slate-100">
                      <img
                        src={projectForm.image || assetForm.url}
                        alt="Current project asset"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <p className="text-sm text-slate-500">Ảnh hiện tại của project đang được dùng trên site.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setProjectForm((current) => ({
                            ...current,
                            image: "",
                            imagePublicId: ""
                          }));
                          setAssetForm(emptyAssetForm);
                          setProjectFeedback("Image cleared. Save project or upload a new file to apply the change.");
                        }}
                        className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : null}
                <label className="grid gap-2">
                  <span className="text-sm text-slate-700">Choose image file</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleProjectAssetFileChange}
                    className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white"
                  >
                    {projectAssetFile ? "Upload image now" : "Keep current image"}
                  </button>
                </div>
              </form>

              <form onSubmit={handleProjectSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Title (VI)">
                    <input name="titleVi" value={projectForm.titleVi} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                  <Field label="Title (EN)">
                    <input name="titleEn" value={projectForm.titleEn} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                  <Field label="Slug">
                    <input name="slug" value={projectForm.slug} onChange={handleProjectFieldChange} className={fieldClassName} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Summary (VI)">
                    <textarea name="summaryVi" rows="3" value={projectForm.summaryVi} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                  <Field label="Summary (EN)">
                    <textarea name="summaryEn" rows="3" value={projectForm.summaryEn} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Content (VI)">
                    <textarea name="contentVi" rows="6" value={projectForm.contentVi} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                  <Field label="Content (EN)">
                    <textarea name="contentEn" rows="6" value={projectForm.contentEn} onChange={handleProjectFieldChange} required className={fieldClassName} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="My role (VI)">
                    <textarea name="myRoleVi" rows="4" value={projectForm.myRoleVi} onChange={handleProjectFieldChange} className={fieldClassName} />
                  </Field>
                  <Field label="My role (EN)">
                    <textarea name="myRoleEn" rows="4" value={projectForm.myRoleEn} onChange={handleProjectFieldChange} className={fieldClassName} />
                  </Field>
                </div>

                <Field label="Technologies (one per line)">
                  <textarea name="technologies" rows="5" value={projectForm.technologies} onChange={handleProjectFieldChange} className={fieldClassName} placeholder={"React\nNode.js\nMongoDB"} />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Repository URL 1">
                    <input name="githubLink" value={projectForm.githubLink} onChange={handleProjectFieldChange} className={fieldClassName} />
                  </Field>
                  <Field label="Repository URL 2">
                    <input name="githubLinkSecondary" value={projectForm.githubLinkSecondary} onChange={handleProjectFieldChange} className={fieldClassName} />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Demo URL">
                    <input name="demoLink" value={projectForm.demoLink} onChange={handleProjectFieldChange} className={fieldClassName} />
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
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <input name="featured" type="checkbox" checked={projectForm.featured} onChange={handleProjectFieldChange} className="h-4 w-4 rounded border-slate-300" />
                    Featured project
                  </label>
                </div>

                {projectFeedback ? <InfoCard tone={projectFeedback.includes("success") ? "success" : "default"} message={projectFeedback} /> : null}

                <button type="submit" className="w-fit rounded-full bg-slate-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                  {selectedProjectId ? "Update project" : "Create project"}
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
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
                            <h3 className="text-xl font-medium text-slate-900">{getLocalizedFormValue(project.title, "vi")}</h3>
                            <StatusBadge value={project.status} />
                            {project.featured ? <StatusBadge value="featured" /> : null}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{getLocalizedFormValue(project.summary, "vi")}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-400">{project.slug} · order {project.order || 0}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleProjectEdit(project)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
                            Edit
                          </button>
                          <button type="button" onClick={() => handleProjectDelete(project._id)} className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600">
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        ) : null}

        {activeTab === "contacts" ? (
          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Contact management</p>
                <h2 className="mt-3 text-3xl font-light text-slate-900">Inbox table</h2>
              </div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{contacts.length} messages</p>
            </div>

            {contactFeedback ? <InfoCard className="mt-6" message={contactFeedback} /> : null}
            {loadingContacts ? <InfoCard className="mt-6" message="Loading contacts..." /> : null}

            {!loadingContacts ? (
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse bg-white">
                    <thead className="bg-slate-50">
                      <tr className="text-left">
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sender</th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Message</th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Received</th>
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr key={contact._id} className={index !== contacts.length - 1 ? "border-t border-slate-200" : ""}>
                          <td className="px-5 py-4 align-top">
                            <p className="font-medium text-slate-900">{contact.name}</p>
                            <a href={`mailto:${contact.email}`} className="mt-1 inline-flex text-sm text-sky-600 hover:opacity-70">
                              {contact.email}
                            </a>
                          </td>
                          <td className="max-w-[420px] px-5 py-4 align-top text-sm leading-6 text-slate-600">
                            {truncateText(contact.message, 180)}
                          </td>
                          <td className="px-5 py-4 align-top">
                            <StatusBadge value={contact.status} />
                          </td>
                          <td className="px-5 py-4 align-top text-sm leading-6 text-slate-500">
                            <p>{formatAdminDate(contact.createdAt)}</p>
                            {contact.repliedAt ? <p className="mt-1">Replied {formatAdminDate(contact.repliedAt)}</p> : null}
                          </td>
                          <td className="px-5 py-4 align-top">
                            <div className="flex min-w-[180px] flex-col gap-2">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {activeTab === "profile" ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
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
                <button type="submit" className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                  Save avatar
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Profile content</p>
              <h2 className="mt-3 text-3xl font-light text-slate-900">Public profile settings</h2>

              <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Display name">
                    <input name="displayName" value={profileForm.displayName} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                  <Field label="Brand initials">
                    <input name="brandInitials" value={profileForm.brandInitials} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Hero title (VI)">
                    <input name="heroTitleVi" value={profileForm.heroTitleVi} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                  <Field label="Hero title (EN)">
                    <input name="heroTitleEn" value={profileForm.heroTitleEn} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                </div>
                <Field label="Intro segments JSON">
                  <textarea name="introSegmentsJson" rows="10" value={profileForm.introSegmentsJson} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Goal description (VI)">
                    <textarea name="goalDescriptionVi" rows="4" value={profileForm.goalDescriptionVi} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                  <Field label="Goal description (EN)">
                    <textarea name="goalDescriptionEn" rows="4" value={profileForm.goalDescriptionEn} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                  </Field>
                </div>
                <Field label="GitHub URL">
                  <input name="githubUrl" value={profileForm.githubUrl} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                </Field>
                <Field label="LinkedIn URL">
                  <input name="linkedinUrl" value={profileForm.linkedinUrl} onChange={handleProfileFieldChange} className={lightFieldClassName} />
                </Field>
                {contentFeedback ? <InfoCard message={contentFeedback} /> : null}
                <button type="submit" className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                  Save profile content
                </button>
              </form>
            </section>
          </div>
        ) : null}

        {activeTab === "content" ? (
          <div className="mt-8 space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800 shadow-sm">
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
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title (VI)"><input name="titleVi" value={articleForm.titleVi} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Title (EN)"><input name="titleEn" value={articleForm.titleEn} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <Field label="Slug"><input name="slug" value={articleForm.slug} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Category (VI)"><input name="categoryVi" value={articleForm.categoryVi} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Category (EN)"><input name="categoryEn" value={articleForm.categoryEn} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Read time (VI)"><input name="readTimeVi" value={articleForm.readTimeVi} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Read time (EN)"><input name="readTimeEn" value={articleForm.readTimeEn} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Excerpt (VI)"><textarea name="excerptVi" rows="4" value={articleForm.excerptVi} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Excerpt (EN)"><textarea name="excerptEn" rows="4" value={articleForm.excerptEn} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Tone"><input name="tone" value={articleForm.tone} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Published at"><input name="publishedAt" type="date" value={articleForm.publishedAt} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Order"><input name="order" type="number" value={articleForm.order} onChange={handleArticleFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <Field label="Status">
                      <select name="status" value={articleForm.status} onChange={handleArticleFieldChange} className={lightFieldClassName}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </Field>
                    <button type="submit" className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                      {selectedArticleId ? "Update article" : "Create article"}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {[...articles].sort(sortContentByOrderAndDate).map((article) => (
                    <article key={article._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-medium text-slate-900">{getLocalizedFormValue(article.title, "vi")}</h3>
                          <p className="mt-2 text-sm text-slate-500">{getLocalizedFormValue(article.category, "vi")} · {getLocalizedFormValue(article.readTime, "vi")}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{getLocalizedFormValue(article.excerpt, "vi")}</p>
                        </div>
                        <StatusBadge value={article.status} />
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => { setSelectedArticleId(article._id); setArticleForm(toArticleForm(article)); }} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleArticleDelete(article._id)} className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600">
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800 shadow-sm">
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
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title (VI)"><input name="titleVi" value={workForm.titleVi} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Title (EN)"><input name="titleEn" value={workForm.titleEn} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Company (VI)"><input name="companyVi" value={workForm.companyVi} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Company (EN)"><input name="companyEn" value={workForm.companyEn} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Period (VI)"><input name="periodVi" value={workForm.periodVi} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Period (EN)"><input name="periodEn" value={workForm.periodEn} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Summary (VI)"><textarea name="summaryVi" rows="4" value={workForm.summaryVi} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Summary (EN)"><textarea name="summaryEn" rows="4" value={workForm.summaryEn} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Highlights (VI, one per line)"><textarea name="highlightsVi" rows="5" value={workForm.highlightsVi} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Highlights (EN, one per line)"><textarea name="highlightsEn" rows="5" value={workForm.highlightsEn} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Status">
                        <select name="status" value={workForm.status} onChange={handleWorkFieldChange} className={lightFieldClassName}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </Field>
                      <Field label="Order"><input name="order" type="number" value={workForm.order} onChange={handleWorkFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <button type="submit" className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                      {selectedWorkItemId ? "Update work item" : "Create work item"}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {[...workItems].sort(sortContentByOrderAndDate).map((item) => (
                    <article key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-medium text-slate-900">{getLocalizedFormValue(item.title, "vi")}</h3>
                          <p className="mt-2 text-sm text-slate-500">{[getLocalizedFormValue(item.company, "vi"), getLocalizedFormValue(item.period, "vi")].filter(Boolean).join(" · ")}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{getLocalizedFormValue(item.summary, "vi")}</p>
                        </div>
                        <StatusBadge value={item.status} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.highlights || []).map((highlight) => (
                          <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                            {getLocalizedFormValue(highlight, "vi")}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => { setSelectedWorkItemId(item._id); setWorkForm(toWorkForm(item)); }} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleWorkDelete(item._id)} className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600">
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-800 shadow-sm">
              <div className="grid gap-6 xl:grid-cols-2">
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Code</p>
                      <h2 className="mt-3 text-3xl font-light text-slate-900">Manage code repositories</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCodeItemId("");
                        setCodeForm(emptyCodeForm);
                      }}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700"
                    >
                      New code item
                    </button>
                  </div>

                  <form onSubmit={handleCodeSubmit} className="mt-6 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Owner"><input name="owner" value={codeForm.owner} onChange={handleCodeFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Repository name"><input name="name" value={codeForm.name} onChange={handleCodeFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Summary (VI)"><textarea name="summaryVi" rows="4" value={codeForm.summaryVi} onChange={handleCodeFieldChange} className={lightFieldClassName} /></Field>
                      <Field label="Summary (EN)"><textarea name="summaryEn" rows="4" value={codeForm.summaryEn} onChange={handleCodeFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <Field label="Repository URL">
                      <input name="repositoryUrl" value={codeForm.repositoryUrl} onChange={handleCodeFieldChange} className={lightFieldClassName} placeholder="https://github.com/username/repository" />
                    </Field>
                    <Field label="Tags (one per line: vi|en|bg-color)">
                      <textarea name="tags" rows="6" value={codeForm.tags} onChange={handleCodeFieldChange} className={lightFieldClassName} placeholder={"React|React|bg-sky-500\nNút UI|UI Button|bg-emerald-500"} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Status">
                        <select name="status" value={codeForm.status} onChange={handleCodeFieldChange} className={lightFieldClassName}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </Field>
                      <Field label="Order"><input name="order" type="number" value={codeForm.order} onChange={handleCodeFieldChange} className={lightFieldClassName} /></Field>
                    </div>
                    <button type="submit" className="w-fit rounded-full bg-slate-900 px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-white">
                      {selectedCodeItemId ? "Update code item" : "Create code item"}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {[...codeItems].sort(sortContentByOrderAndDate).map((item) => (
                    <article key={item._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-medium text-slate-900">{item.owner}/{item.name}</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{getLocalizedFormValue(item.summary, "vi")}</p>
                          <a href={item.repositoryUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-sky-600 transition hover:opacity-70">
                            {item.repositoryUrl}
                          </a>
                        </div>
                        <StatusBadge value={item.status} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(item.tags || []).map((tag) => (
                          <span key={`${item._id}-${getLocalizedFormValue(tag.label, "vi")}`} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
                            <span className={`h-2.5 w-2.5 rounded-full ${tag.color || "bg-slate-500"}`}></span>
                            {getLocalizedFormValue(tag.label, "vi")}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => { setSelectedCodeItemId(item._id); setCodeForm(toCodeForm(item)); }} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleCodeDelete(item._id)} className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-rose-600">
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : null}
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

function Field({ label, children, labelClassName = "text-sm font-medium text-slate-700" }) {
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
      : value === "unread"
        ? "bg-amber-100 text-amber-700"
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

function truncateText(value, maxLength = 140) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
}

function toArticleForm(article) {
  if (!article) {
    return emptyArticleForm;
  }

  return {
    titleVi: getLocalizedFormValue(article.title, "vi"),
    titleEn: getLocalizedFormValue(article.title, "en"),
    slug: article.slug || "",
    categoryVi: getLocalizedFormValue(article.category, "vi"),
    categoryEn: getLocalizedFormValue(article.category, "en"),
    readTimeVi: getLocalizedFormValue(article.readTime, "vi"),
    readTimeEn: getLocalizedFormValue(article.readTime, "en"),
    excerptVi: getLocalizedFormValue(article.excerpt, "vi"),
    excerptEn: getLocalizedFormValue(article.excerpt, "en"),
    tone: article.tone || "from-slate-200 to-slate-100",
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : "",
    status: article.status || "draft",
    order: Number.isFinite(article.order) ? article.order : 0
  };
}

function toArticlePayload(form) {
  return {
    title: toLocalizedPayload(form.titleVi, form.titleEn),
    slug: form.slug,
    category: toLocalizedPayload(form.categoryVi, form.categoryEn),
    readTime: toLocalizedPayload(form.readTimeVi, form.readTimeEn),
    excerpt: toLocalizedPayload(form.excerptVi, form.excerptEn),
    tone: form.tone,
    publishedAt: form.publishedAt,
    status: form.status,
    order: Number(form.order) || 0
  };
}

function toWorkForm(workItem) {
  if (!workItem) {
    return emptyWorkForm;
  }

  return {
    titleVi: getLocalizedFormValue(workItem.title, "vi"),
    titleEn: getLocalizedFormValue(workItem.title, "en"),
    companyVi: getLocalizedFormValue(workItem.company, "vi"),
    companyEn: getLocalizedFormValue(workItem.company, "en"),
    periodVi: getLocalizedFormValue(workItem.period, "vi"),
    periodEn: getLocalizedFormValue(workItem.period, "en"),
    summaryVi: getLocalizedFormValue(workItem.summary, "vi"),
    summaryEn: getLocalizedFormValue(workItem.summary, "en"),
    highlightsVi: Array.isArray(workItem.highlights) ? workItem.highlights.map((item) => getLocalizedFormValue(item, "vi")).join("\n") : "",
    highlightsEn: Array.isArray(workItem.highlights) ? workItem.highlights.map((item) => getLocalizedFormValue(item, "en")).join("\n") : "",
    status: workItem.status || "draft",
    order: Number.isFinite(workItem.order) ? workItem.order : 0
  };
}

function toWorkPayload(form) {
  const highlightViItems = form.highlightsVi
    .split(/\r?\n/)
    .map((item) => item.trim());
  const highlightEnItems = form.highlightsEn
    .split(/\r?\n/)
    .map((item) => item.trim());
  const highlightCount = Math.max(highlightViItems.length, highlightEnItems.length);

  return {
    title: toLocalizedPayload(form.titleVi, form.titleEn),
    company: toLocalizedPayload(form.companyVi, form.companyEn),
    period: toLocalizedPayload(form.periodVi, form.periodEn),
    summary: toLocalizedPayload(form.summaryVi, form.summaryEn),
    highlights: Array.from({ length: highlightCount }, (_, index) =>
      toLocalizedPayload(highlightViItems[index] || "", highlightEnItems[index] || "")
    ).filter((item) => item.vi || item.en),
    status: form.status,
    order: Number(form.order) || 0
  };
}

function toLocalizedPayload(vi, en) {
  return {
    vi: typeof vi === "string" ? vi.trim() : "",
    en: typeof en === "string" ? en.trim() : ""
  };
}

function getLocalizedFormValue(value, language = "vi") {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value[language] || value.vi || value.en || "";
  }

  return String(value);
}

function sortContentByOrderAndDate(left, right) {
  if ((left.order || 0) !== (right.order || 0)) {
    return (left.order || 0) - (right.order || 0);
  }

  return new Date(right.publishedAt || right.createdAt || 0).getTime() - new Date(left.publishedAt || left.createdAt || 0).getTime();
}

const fieldClassName =
  "w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white";

const lightFieldClassName =
  "w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white";
