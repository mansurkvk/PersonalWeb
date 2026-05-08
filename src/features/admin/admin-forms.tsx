"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostStatus, ProjectStatus } from "@/types/database";

type BlogPostFormInitial = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  status?: BlogPostStatus;
  featured?: boolean;
};

type ProjectFormInitial = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  technologies?: string[];
  category?: string;
  status?: ProjectStatus;
  links?: {
    github?: string;
    demo?: string;
    article?: string;
    oldSite?: string;
  };
  featured?: boolean;
};

type SettingsFormInitial = {
  siteTitle: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  oldSiteUrl: string;
  theme: "dark" | "light" | "system";
};

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function BlogPostForm({ initial, id }: { initial?: BlogPostFormInitial; id?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch(id ? `/api/blog/${id}` : "/api/blog", {
      method: id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug") || undefined,
        excerpt: form.get("excerpt"),
        content: form.get("content"),
        coverImage: form.get("coverImage") || undefined,
        tags: splitList(form.get("tags")),
        category: form.get("category"),
        status: form.get("status"),
        featured: form.get("featured") === "on"
      })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? "Kayit tamamlandi." : data.error ?? "Islem basarisiz.");
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Baslik" name="title" defaultValue={initial?.title} required />
        <Field label="Slug" name="slug" defaultValue={initial?.slug} />
        <Field label="Kategori" name="category" defaultValue={initial?.category ?? "Engineering Notes"} required />
        <Field label="Cover image URL" name="coverImage" defaultValue={initial?.coverImage} />
      </div>
      <label className="mt-4 block text-sm text-slate-300">Ozet</label>
      <textarea name="excerpt" required defaultValue={initial?.excerpt} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <label className="mt-4 block text-sm text-slate-300">Icerik</label>
      <textarea name="content" required defaultValue={initial?.content} rows={12} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <label className="mt-4 block text-sm text-slate-300">Etiketler</label>
      <input name="tags" defaultValue={initial?.tags?.join(", ")} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <select name="status" defaultValue={initial?.status ?? "draft"} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="featured" type="checkbox" defaultChecked={initial?.featured} /> Featured
        </label>
      </div>
      <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Kaydet</button>
      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}

export function ProjectForm({ initial, id }: { initial?: ProjectFormInitial; id?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch(id ? `/api/projects/${id}` : "/api/projects", {
      method: id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug") || undefined,
        summary: form.get("summary"),
        description: form.get("description"),
        coverImage: form.get("coverImage") || undefined,
        images: splitList(form.get("images")),
        technologies: splitList(form.get("technologies")),
        category: form.get("category"),
        status: form.get("status"),
        links: {
          github: form.get("github") || undefined,
          demo: form.get("demo") || undefined,
          article: form.get("article") || undefined,
          oldSite: form.get("oldSite") || undefined
        },
        featured: form.get("featured") === "on"
      })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? "Kayit tamamlandi." : data.error ?? "Islem basarisiz.");
    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Baslik" name="title" defaultValue={initial?.title} required />
        <Field label="Slug" name="slug" defaultValue={initial?.slug} />
        <Field label="Kategori" name="category" defaultValue={initial?.category ?? "Web Platform"} required />
        <Field label="Cover image URL" name="coverImage" defaultValue={initial?.coverImage} />
      </div>
      <label className="mt-4 block text-sm text-slate-300">Ozet</label>
      <textarea name="summary" required defaultValue={initial?.summary} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <label className="mt-4 block text-sm text-slate-300">Aciklama</label>
      <textarea name="description" required defaultValue={initial?.description} rows={10} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Teknolojiler" name="technologies" defaultValue={initial?.technologies?.join(", ")} />
        <Field label="Images" name="images" defaultValue={initial?.images?.join(", ")} />
        <Field label="GitHub" name="github" defaultValue={initial?.links?.github} />
        <Field label="Demo" name="demo" defaultValue={initial?.links?.demo} />
        <Field label="Article" name="article" defaultValue={initial?.links?.article} />
        <Field label="Old site" name="oldSite" defaultValue={initial?.links?.oldSite} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <select name="status" defaultValue={initial?.status ?? "active"} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <option value="idea">Idea</option>
          <option value="prototype">Prototype</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="featured" type="checkbox" defaultChecked={initial?.featured} /> Featured
        </label>
      </div>
      <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Kaydet</button>
      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}

export function DeviceForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/iot/devices", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        deviceId: form.get("deviceId"),
        name: form.get("name"),
        description: form.get("description") || undefined,
        deviceKey: form.get("deviceKey") || undefined,
        type: form.get("type") || "esp32",
        location: form.get("location") || undefined,
        locationLabel: form.get("locationLabel") || undefined,
        firmwareVersion: form.get("firmwareVersion") || undefined,
        isActive: true
      })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? "Cihaz eklendi." : data.error ?? "Cihaz eklenemedi.");
    if (res.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Device ID" name="deviceId" required />
        <Field label="Name" name="name" required />
        <Field label="Type" name="type" defaultValue="esp32" />
        <Field label="Location" name="location" />
        <Field label="Location label" name="locationLabel" />
        <Field label="Firmware version" name="firmwareVersion" />
        <Field label="Device key" name="deviceKey" />
        <Field label="Description" name="description" />
      </div>
      <button className="mt-6 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Cihaz ekle</button>
      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}

export function SettingsForm({ initial }: { initial: SettingsFormInitial }) {
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        siteTitle: form.get("siteTitle"),
        siteDescription: form.get("siteDescription"),
        heroTitle: form.get("heroTitle"),
        heroSubtitle: form.get("heroSubtitle"),
        oldSiteUrl: form.get("oldSiteUrl"),
        theme: form.get("theme")
      })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? "Ayarlar kaydedildi." : data.error ?? "Ayarlar kaydedilemedi.");
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-[2rem] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Site title" name="siteTitle" defaultValue={initial.siteTitle} required />
        <Field label="Old site URL" name="oldSiteUrl" defaultValue={initial.oldSiteUrl} required />
      </div>
      <label className="mt-4 block text-sm text-slate-300">Site description</label>
      <textarea name="siteDescription" required defaultValue={initial.siteDescription} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <label className="mt-4 block text-sm text-slate-300">Hero title</label>
      <textarea name="heroTitle" required defaultValue={initial.heroTitle} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <label className="mt-4 block text-sm text-slate-300">Hero subtitle</label>
      <textarea name="heroSubtitle" required defaultValue={initial.heroSubtitle} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
      <select name="theme" defaultValue={initial.theme} className="mt-4 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
      <button className="ml-3 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Kaydet</button>
      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </form>
  );
}

export function CommentModerationActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  async function setStatus(nextStatus: string) {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setStatus(status === "visible" ? "hidden" : "visible")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
        {status === "visible" ? "Gizle" : "Gorunur yap"}
      </button>
      <button onClick={() => setStatus("pending")} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
        Pending
      </button>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <input name={name} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none" />
    </label>
  );
}
