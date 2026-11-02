import { BASE_DATE } from "@/data/seed";
import type { Application } from "./types";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function dateOf(day: number): Date {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + day);
  return d;
}

/** "Rab, 4 Nov 2026" */
export function fmtDate(day: number): string {
  const d = dateOf(day);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "9 Nov" */
export function fmtShort(day: number): string {
  const d = dateOf(day);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function relDay(day: number, today: number): string {
  const diff = today - day;
  if (diff <= 0) return "hari ini";
  if (diff === 1) return "kemarin";
  if (diff < 7) return `${diff} hari lalu`;
  if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`;
  return `${Math.floor(diff / 30)} bulan lalu`;
}

export type SlaState = "none" | "normal" | "soon" | "overdue";

export interface SlaInfo {
  state: SlaState;
  daysLeft: number;
  /** Teks untuk student (netral) */
  studentText: string;
  /** Pill singkat untuk workspace */
  pill: string;
}

export function slaInfo(app: Application, today: number): SlaInfo {
  const active = app.status === "terkirim" || app.status === "direview" || app.status === "interview";
  if (!active || app.slaDue === null) {
    return { state: "none", daysLeft: 0, studentText: "", pill: "" };
  }
  const daysLeft = app.slaDue - today;
  if (daysLeft < 0) {
    return {
      state: "overdue",
      daysLeft,
      studentText: "Belum ada respons. Dibimbing sedang menindaklanjuti dengan perusahaan.",
      pill: "Lewat tenggat",
    };
  }
  const when = daysLeft === 0 ? "hari ini" : `${daysLeft} hari lagi`;
  return {
    state: daysLeft <= 2 ? "soon" : "normal",
    daysLeft,
    studentText: `Perusahaan diharapkan merespons sebelum ${fmtShort(app.slaDue)} (${when})`,
    pill: daysLeft === 0 ? "Hari ini" : `${daysLeft} hari tersisa`,
  };
}

export const STATUS_LABEL: Record<Application["status"], string> = {
  terkirim: "Terkirim",
  direview: "Sedang direview",
  interview: "Interview",
  penawaran: "Penawaran",
  diterima: "Diterima",
  ditutup: "Ditutup",
};

export const isActive = (a: Application): boolean => a.status !== "ditutup" && a.status !== "diterima";
