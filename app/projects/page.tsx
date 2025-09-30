"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Project = {
  id: string;
  fields: {
    Name?: string;
    "Project Code"?: string;
    Organisation?: string;
    Status?: string;
  };
};

const STATUSES = ["Discovery", "In flight", "Parked", "Closed"] as const;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    organisation: "",
    status: "Discovery" as (typeof STATUSES)[number],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const data = await apiGet<Project[]>("/api/projects");
      setProjects(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      await apiPost("/api/projects", form);
      setForm({ name: "", code: "", organisation: "", status: "Discovery", notes: "" });
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 12 }}>Projects</h1>

      <section style={{ padding: 16, border: "1px solid #eee", borderRadius: 10, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create a new project</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Project Name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <input
              placeholder="Project Code"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
            />
            <input
              placeholder="Organisation"
              value={form.organisation}
              onChange={e => setForm({ ...form, organisation: e.target.value })}
            />
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as typeof form.status })}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
          <button disabled={submitting}>{submitting ? "Creating..." : "Create Project"}</button>
        </form>
      </section>

      {err && <div style={{ color: "#b00020", marginBottom: 12 }}>⚠️ {err}</div>}
      {loading ? (
        <div>Loading projects…</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {projects.map(p => (
            <li key={p.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <strong>{p.fields.Name || "Untitled"}</strong>{" "}
                  {p.fields["Project Code"] && <small>({p.fields["Project Code"]})</small>}
                  <div style={{ color: "#666" }}>
                    {p.fields.Organisation || "—"} • {p.fields.Status || "—"}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {projects.length === 0 && <li>No projects yet.</li>}
        </ul>
      )}
    </main>
  );
}
