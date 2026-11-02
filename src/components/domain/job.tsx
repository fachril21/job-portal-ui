"use client";

import { Briefcase, MapPin, Wallet } from "lucide-react";
import Link from "next/link";
import { matchJob } from "@/lib/match";
import { useMe } from "@/lib/hooks";
import { partnerOf } from "@/lib/select";
import { useStore } from "@/lib/store";
import type { Job } from "@/lib/types";
import { Chip, CompanyMark } from "@/components/ui/primitives";
import { MatchSummary } from "./skills";

export function JobCard({ job }: { job: Job }) {
  const s = useStore();
  const me = useMe();
  const partner = partnerOf(s, job.partnerId);
  const match = matchJob(me, job);
  return (
    <Link
      href={`/student/jobs/${job.id}`}
      className="group flex flex-col gap-4 rounded-tile border border-line bg-surface p-5 shadow-xs transition-[box-shadow,transform,border-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <CompanyMark name={partner?.name ?? "?"} tone={partner?.logoTone ?? "brand"} />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight group-hover:text-brand-700">{job.title}</h3>
          <p className="truncate text-sm text-muted">{partner?.name}</p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
        <li className="flex items-center gap-1.5"><MapPin size={14} aria-hidden />{job.location}</li>
        <li className="flex items-center gap-1.5"><Briefcase size={14} aria-hidden />{job.workType} · {job.level}</li>
        {job.salary && <li className="flex items-center gap-1.5"><Wallet size={14} aria-hidden />{job.salary}</li>}
      </ul>
      <div className="mt-auto border-t border-line pt-3.5">
        <MatchSummary match={match} />
      </div>
    </Link>
  );
}

export function JobMeta({ job }: { job: Job }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip>{job.workType}</Chip>
      <Chip>{job.level}</Chip>
      <Chip tone="plain">{job.location}</Chip>
      {job.salary && <Chip tone="plain">{job.salary}</Chip>}
    </div>
  );
}
