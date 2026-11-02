"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeSeed, PARTNER_ME, type SeedState } from "@/data/seed";
import { DEFAULT_MAPPING, setTagLabels } from "@/data/taxonomy";
import type { JobDraft } from "./jobdraft";
import type {
  AppStatus,
  Bootcamp,
  CustomSkill,
  ModerationRecord,
  ReminderRecord,
  Application,
  Job,
  LogEntry,
  Offer,
  ModuleMapping,
  Requirement,
  Role,
  ScreenState,
  ToastMsg,
} from "./types";

let counter = Date.now() % 100000;
const uid = (p: string): string => `${p}${++counter}`;

export type ScenarioId = "A" | "B" | "C";

interface DraftApply {
  studentId: string;
  jobId: string;
  answers: string[];
  withCv: boolean;
}

export interface NewJobInput {
  title: string;
  field: Job["field"];
  location: string;
  workType: Job["workType"];
  level: Job["level"];
  salary?: string;
  description: string;
  requirements: Requirement[];
  screening: string[];
  reapplyWaitDays: number;
}

export interface AppStore extends SeedState {
  day: number;
  role: Role;
  studentId: string;
  mappings: ModuleMapping[];
  screenState: ScreenState;
  demoEnabled: boolean;
  demoOpen: boolean;
  scenario: ScenarioId | null;
  flags: Record<string, boolean>;
  toasts: ToastMsg[];
  log: LogEntry[];
  reminded: Record<string, number>;
  draft: DraftApply | null;
  revision: Record<string, string>;
  jobDrafts: Record<string, JobDraft>;
  moderationLog: ModerationRecord[];
  reminders: ReminderRecord[];
  customSkills: CustomSkill[];
  tagLabels: Record<string, string>;
  /** Talent yang disimpan partner */
  shortlist: string[];

  // navigasi & demo
  setRole: (r: Role) => void;
  setStudent: (id: string) => void;
  setScreenState: (s: ScreenState) => void;
  setDemoOpen: (o: boolean) => void;
  setDemoEnabled: (e: boolean) => void;
  advanceDays: (n: number) => void;
  resetDay: () => void;
  resetAll: () => void;
  startScenario: (s: ScenarioId) => void;
  setFlag: (k: string) => void;
  toast: (text: string, tone?: ToastMsg["tone"], who?: Role) => void;
  dismissToast: (id: string) => void;
  addLog: (text: string) => void;

  // student
  apply: (jobId: string, answers: string[], withCv: boolean) => "ok" | "draft";
  retryDraft: () => void;
  withdraw: (appId: string) => void;
  acceptOffer: (appId: string) => void;
  requestFollowUp: (appId: string) => void;
  toggleProjectVisible: (studentId: string, projectId: string) => void;
  toggleEndorsementVisible: (studentId: string, endorsementId: string) => void;
  toggleOpenToBeFound: (studentId: string) => void;

  // aksi pihak lain (partner / mentor / admin / sistem)
  partnerOpen: (appId: string) => void;
  partnerInvite: (appId: string) => void;
  partnerOffer: (appId: string, offer?: Partial<Offer>) => void;
  partnerClose: (appId: string, tagIds: string[], note?: string) => void;
  jobClosedByCompany: (appId: string) => void;
  talentSupportReply: (appId: string) => void;
  newCandidate: () => void;
  approveJob: (jobId: string, ok: boolean, note?: string) => void;
  rejectJob: (jobId: string, note: string) => void;
  saveFollowNote: (appId: string, note: string) => void;
  addSkill: (name: string, field: Bootcamp) => void;
  renameSkill: (oldName: string, name: string) => void;
  renameTag: (id: string, label: string) => void;
  sendReminder: (partnerId: string) => void;
  editMapping: (tagId: string, index: number, title: string) => void;
  createJob: (input: NewJobInput) => string;
  reviseJob: (jobId: string, input: NewJobInput) => void;
  saveJobDraft: (draft: JobDraft) => void;
  deleteJobDraft: (id: string) => void;
  toggleShortlist: (studentId: string) => void;
}

const initial = () => ({
  ...makeSeed(),
  day: 0,
  mappings: structuredClone(DEFAULT_MAPPING),
  flags: {} as Record<string, boolean>,
  reminded: {} as Record<string, number>,
  draft: null as DraftApply | null,
  revision: { j15: "Rentang gaji perlu dicantumkan dan tugas harian diperjelas." } as Record<string, string>,
  shortlist: [] as string[],
  jobDrafts: {} as Record<string, JobDraft>,
  moderationLog: [
    { jobId: "j3", decision: "disetujui", day: -21 },
    { jobId: "j5", decision: "disetujui", day: -9 },
    { jobId: "j12", decision: "disetujui", day: -10 },
    { jobId: "j14", decision: "ditolak", day: -4, note: "Mencantumkan syarat usia dan penampilan, yang tidak diperbolehkan di Career Hub." },
    { jobId: "j15", decision: "revisi", day: -3, note: "Rentang gaji perlu dicantumkan dan tugas harian diperjelas." },
  ] as ModerationRecord[],
  reminders: [
    { partnerId: "p4", day: -9 },
    { partnerId: "p4", day: -4 },
    { partnerId: "p2", day: -5 },
    { partnerId: "p6", day: -2 },
  ] as ReminderRecord[],
  customSkills: [] as CustomSkill[],
  tagLabels: {} as Record<string, string>,
  scenario: null as ScenarioId | null,
});

function patchApp(apps: Application[], id: string, fn: (a: Application) => Application): Application[] {
  return apps.map((a) => (a.id === id ? fn(a) : a));
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => {
      const log = (text: string) =>
        set((s) => ({ log: [{ id: uid("l"), day: s.day, text }, ...s.log].slice(0, 40) }));
      const toast = (text: string, tone: ToastMsg["tone"] = "info", who?: Role) =>
        set((s) => ({ toasts: [...s.toasts, { id: uid("t"), text, tone, who }].slice(-3) }));
      const jobName = (appId: string): string => {
        const s = get();
        const a = s.applications.find((x) => x.id === appId);
        const j = s.jobs.find((x) => x.id === a?.jobId);
        const p = s.partners.find((x) => x.id === j?.partnerId);
        return j && p ? `${j.title} di ${p.name}` : "lowongan";
      };

      return {
        ...initial(),
        role: "student",
        studentId: "s1",
        screenState: "normal",
        demoEnabled: true,
        demoOpen: false,
        toasts: [],
        log: [],

        setRole: (role) => set({ role }),
        setStudent: (studentId) => set({ studentId, flags: {} }),
        setScreenState: (screenState) => set({ screenState }),
        setDemoOpen: (demoOpen) => set({ demoOpen }),
        setDemoEnabled: (demoEnabled) => set({ demoEnabled, demoOpen: demoEnabled ? get().demoOpen : false }),
        advanceDays: (n) => {
          set((s) => ({ day: s.day + n }));
          log(`Waktu maju ${n} hari`);
        },
        resetDay: () => {
          set({ day: 0 });
          log("Waktu dikembalikan ke 4 Nov 2026");
        },
        resetAll: () => {
          set({ ...initial(), log: [], toasts: [], studentId: "s1", screenState: "normal" });
          toast("Semua data dikembalikan ke awal.", "info");
        },
        startScenario: (scenario) => {
          set({ ...initial(), scenario, log: [], toasts: [], studentId: "s1", role: "student", screenState: "normal" });
          log(`Skenario ${scenario} dimulai`);
        },
        setFlag: (k) => {
          if (!get().flags[k]) set((s) => ({ flags: { ...s.flags, [k]: true } }));
        },
        toast,
        dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
        addLog: log,

        apply: (jobId, answers, withCv) => {
          const s = get();
          if (s.screenState === "offline") {
            set({ draft: { studentId: s.studentId, jobId, answers, withCv } });
            return "draft";
          }
          const prior = s.applications
            .filter((a) => a.studentId === s.studentId && a.jobId === jobId && a.status === "ditutup")
            .sort((a, b) => (b.closure?.day ?? 0) - (a.closure?.day ?? 0))[0];
          const app: Application = {
            id: uid("a"),
            studentId: s.studentId,
            jobId,
            status: "terkirim",
            sentDay: s.day,
            slaDue: s.day + 7,
            timeline: [{ status: "terkirim", day: s.day }],
            followUpRequested: false,
            followUpAnswered: false,
            reapplyOf: prior?.id,
            answers,
            withCv,
          };
          set({ applications: [app, ...s.applications], draft: null });
          log(`Lamaran terkirim: ${jobName(app.id)}`);
          return "ok";
        },
        retryDraft: () => {
          const d = get().draft;
          if (!d) return;
          set({ screenState: "normal" });
          get().apply(d.jobId, d.answers, d.withCv);
          toast("Lamaran terkirim.", "ok", "student");
        },
        withdraw: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (a) => ({
              ...a,
              status: "ditutup",
              slaDue: null,
              timeline: [...a.timeline, { status: "ditutup", day, note: "Kamu mengundurkan diri" }],
              closure: { tagIds: [], day, by: "student" },
            })),
          }));
          log(`Student mengundurkan diri: ${jobName(appId)}`);
        },
        acceptOffer: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (a) => ({
              ...a,
              status: "diterima",
              slaDue: null,
              timeline: [...a.timeline, { status: "diterima", day }],
            })),
          }));
          log(`Penawaran diterima: ${jobName(appId)}`);
        },
        requestFollowUp: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (a) =>
              a.followUpRequested
                ? a
                : { ...a, followUpRequested: true, followUpDay: day, followUpMessage: "Belum ada respons dari perusahaan. Mohon bantuannya.", timeline: [...a.timeline, { status: "followup", day }] },
            ),
          }));
          log(`Follow up diminta: ${jobName(appId)}`);
        },
        toggleProjectVisible: (studentId, projectId) =>
          set((s) => ({
            students: s.students.map((st) =>
              st.id !== studentId
                ? st
                : { ...st, projects: st.projects.map((p) => (p.id === projectId ? { ...p, visible: !p.visible } : p)) },
            ),
          })),
        toggleEndorsementVisible: (studentId, endorsementId) =>
          set((s) => ({
            students: s.students.map((st) =>
              st.id !== studentId
                ? st
                : { ...st, endorsements: st.endorsements.map((e) => (e.id === endorsementId ? { ...e, visible: !e.visible } : e)) },
            ),
          })),
        toggleOpenToBeFound: (studentId) =>
          set((s) => ({
            students: s.students.map((st) => (st.id === studentId ? { ...st, openToBeFound: !st.openToBeFound } : st)),
          })),

        partnerOpen: (appId) => {
          const { day, applications } = get();
          const a = applications.find((x) => x.id === appId);
          if (!a || a.status !== "terkirim") return;
          set((s) => ({
            applications: patchApp(s.applications, appId, (x) => ({
              ...x,
              status: "direview",
              timeline: [...x.timeline, { status: "direview", day }],
            })),
          }));
          toast(`Lamaranmu ke ${jobName(appId)} sedang direview.`, "info", "student");
          log(`Partner membuka lamaran: ${jobName(appId)}`);
        },
        partnerInvite: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (x) => ({
              ...x,
              status: "interview",
              slaDue: day + 7,
              timeline: [...x.timeline, { status: "interview", day }],
            })),
          }));
          toast(`Kamu diundang interview: ${jobName(appId)}.`, "ok", "student");
          log(`Partner mengundang interview: ${jobName(appId)}`);
        },
        partnerOffer: (appId, input) => {
          const s = get();
          const day = s.day;
          const app = s.applications.find((x) => x.id === appId);
          const job = s.jobs.find((j) => j.id === app?.jobId);
          const offer: Offer = {
            letterNo: `OL/DCC/2026/${String(++counter).slice(-4)}`,
            salary: job?.salary ?? "Sesuai kesepakatan",
            workType: job?.workType ?? "Hybrid",
            startDay: day + 21,
            deadlineDay: day + 7,
            probation: "3 bulan",
            note: "Kami senang dengan proses seleksi bersamamu dan berharap kamu bergabung dengan tim kami.",
            sentDay: day,
            ...input,
          };
          set((st) => ({
            applications: patchApp(st.applications, appId, (x) => ({
              ...x,
              status: "penawaran",
              slaDue: null,
              offer,
              timeline: [...x.timeline, { status: "penawaran", day }],
            })),
          }));
          toast(`Penawaran masuk dari ${jobName(appId)}.`, "ok", "student");
          log(`Partner mengirim penawaran: ${jobName(appId)}`);
        },
        partnerClose: (appId, tagIds, note) => {
          const s = get();
          const app = s.applications.find((x) => x.id === appId);
          if (!app) return;
          set({
            applications: patchApp(s.applications, appId, (x) => ({
              ...x,
              status: "ditutup",
              slaDue: null,
              timeline: [...x.timeline, { status: "ditutup", day: s.day }],
              closure: { tagIds, note, day: s.day, by: "perusahaan" },
            })),
          });
          toast(`Lamaran ke ${jobName(appId)} sudah ditutup. Lihat umpan balik.`, "info", "student");
          log(`Lamaran ditutup dengan ${tagIds.length} tag: ${jobName(appId)}`);
        },
        jobClosedByCompany: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (x) => ({
              ...x,
              status: "ditutup",
              slaDue: null,
              timeline: [...x.timeline, { status: "ditutup", day, note: "Lowongan ditutup perusahaan" }],
              closure: { tagIds: [], day, by: "sistem" },
            })),
          }));
          toast(`Lowongan ${jobName(appId)} ditutup perusahaan.`, "info", "student");
          log(`Lowongan ditutup perusahaan: ${jobName(appId)}`);
        },
        talentSupportReply: (appId) => {
          const day = get().day;
          set((s) => ({
            applications: patchApp(s.applications, appId, (x) =>
              !x.followUpRequested || x.followUpAnswered
                ? x
                : { ...x, followUpAnswered: true, followUpAnsweredDay: day, slaDue: day + 3, timeline: [...x.timeline, { status: "followup-dibalas", day }] },
            ),
          }));
          toast("Talent Support sudah menghubungi perusahaan. Tenggat baru 3 hari.", "ok", "student");
          log(`Talent Support menanggapi follow up: ${jobName(appId)}`);
        },
        newCandidate: () => {
          const s = get();
          const taken = new Set(s.applications.filter((a) => a.jobId === "j1").map((a) => a.studentId));
          const next = s.students.find((st) => st.id.startsWith("c") && !taken.has(st.id));
          if (!next) {
            toast("Tidak ada kandidat sintetis tersisa.", "warn");
            return;
          }
          const app: Application = {
            id: uid("k"),
            studentId: next.id,
            jobId: "j1",
            status: "terkirim",
            sentDay: s.day,
            slaDue: s.day + 7,
            timeline: [{ status: "terkirim", day: s.day }],
            followUpRequested: false,
            followUpAnswered: false,
            withCv: true,
          };
          set({ applications: [app, ...s.applications] });
          toast(`${next.name} melamar Junior Data Analyst.`, "info", "partner");
          log(`Kandidat baru: ${next.name}`);
        },
        approveJob: (jobId, ok, note) => {
          set((s) => ({
            jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, moderation: ok ? ("tayang" as const) : ("revisi" as const) } : j)),
            revision: note ? { ...s.revision, [jobId]: note } : s.revision,
            moderationLog: [{ jobId, decision: ok ? ("disetujui" as const) : ("revisi" as const), note, day: s.day }, ...s.moderationLog],
          }));
          toast(ok ? "Lowongan disetujui dan tayang." : "Permintaan revisi dikirim ke partner.", ok ? "ok" : "info", "admin");
          log(ok ? "Admin menyetujui lowongan" : "Admin meminta revisi lowongan");
        },
        rejectJob: (jobId, note) => {
          set((s) => ({
            jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, moderation: "ditolak" as const } : j)),
            moderationLog: [{ jobId, decision: "ditolak" as const, note, day: s.day }, ...s.moderationLog],
          }));
          toast("Lowongan ditolak. Partner menerima alasannya.", "info", "admin");
          log("Admin menolak lowongan");
        },
        saveFollowNote: (appId, note) => {
          set((s) => ({ applications: patchApp(s.applications, appId, (a) => ({ ...a, followUpNote: note })) }));
          toast("Catatan internal disimpan.", "ok", "admin");
        },
        addSkill: (name, field) => {
          const clean = name.trim();
          if (!clean) return;
          set((s) => (s.customSkills.some((k) => k.name.toLowerCase() === clean.toLowerCase()) ? s : { customSkills: [...s.customSkills, { name: clean, field }] }));
          toast(`Skill "${clean}" ditambahkan ke taksonomi.`, "ok", "admin");
        },
        renameSkill: (oldName, name) =>
          set((s) => ({ customSkills: s.customSkills.map((k) => (k.name === oldName ? { ...k, name } : k)) })),
        renameTag: (id, label) => {
          const next = { ...get().tagLabels, [id]: label };
          setTagLabels(next);
          set({ tagLabels: next });
        },
        sendReminder: (partnerId) => {
          set((s) => ({ reminded: { ...s.reminded, [partnerId]: s.day }, reminders: [{ partnerId, day: s.day }, ...s.reminders] }));
          toast("Pengingat dikirim ke partner.", "ok", "admin");
          log("Admin mengirim pengingat SLA");
        },
        editMapping: (tagId, index, title) =>
          set((s) => ({
            mappings: s.mappings.map((m) =>
              m.tagId !== tagId ? m : { ...m, items: m.items.map((it, i) => (i === index ? { ...it, title } : it)) },
            ),
          })),
        toggleShortlist: (studentId) =>
          set((s) => ({ shortlist: s.shortlist.includes(studentId) ? s.shortlist.filter((x) => x !== studentId) : [...s.shortlist, studentId] })),
        saveJobDraft: (draft) => set((s) => ({ jobDrafts: { ...s.jobDrafts, [draft.id]: { ...draft, updatedDay: s.day } } })),
        deleteJobDraft: (id) =>
          set((s) => {
            const { [id]: _gone, ...rest } = s.jobDrafts;
            return { jobDrafts: rest };
          }),
        reviseJob: (jobId, input) => {
          set((s) => ({
            jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, ...input, moderation: "menunggu" as const } : j)),
            revision: Object.fromEntries(Object.entries(s.revision).filter(([k]) => k !== jobId)),
          }));
          log(`Lowongan direvisi dan dikirim ulang: ${input.title}`);
        },
        createJob: (input) => {
          const id = uid("j");
          const s = get();
          const job: Job = {
            id,
            partnerId: PARTNER_ME,
            moderation: "menunggu",
            postedDay: s.day,
            ...input,
          };
          set({ jobs: [job, ...s.jobs] });
          log(`Lowongan baru dikirim ke moderasi: ${input.title}`);
          return id;
        },
      };
    },
    {
      name: "dcc-prototype-v1",
      version: 5,
      // Data demo lama dibuang; state dibangun ulang dari seed.
      migrate: () => ({}) as never,
      onRehydrateStorage: () => (state) => {
        if (state?.tagLabels) setTagLabels(state.tagLabels);
      },
      partialize: (s) => {
        const { toasts: _t, demoOpen: _o, ...rest } = s;
        void _t;
        void _o;
        return Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== "function"));
      },
    },
  ),
);

export type { AppStatus };
