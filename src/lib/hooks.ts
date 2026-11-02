"use client";

import { useStore } from "./store";
import type { Student } from "./types";

/** Student aktif (persona dari Demo Panel). */
export function useMe(): Student {
  const students = useStore((s) => s.students);
  const id = useStore((s) => s.studentId);
  return students.find((x) => x.id === id) ?? students[0];
}
