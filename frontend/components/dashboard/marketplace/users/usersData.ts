/**
 * Mock data for the Marketplace → User Management page.
 * All demo data — your company's marketplace team.
 */

export type Role = "admin" | "manager" | "operator" | "viewer";
export type UserStatus = "active" | "invited" | "inactive";

export type TeamUser = {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: Role;
  status: UserStatus;
  /** Minutes since last activity, or null when never (invited). */
  lastMin: number | null;
};

export const USERS: TeamUser[] = [
  { id: "u1", name: "Nasser Al-Marri", nameAr: "ناصر المرّي", email: "nasser@shenatech.com", role: "admin", status: "active", lastMin: 5 },
  { id: "u2", name: "Sara Al-Jaber", nameAr: "سارة الجابر", email: "sara@shenatech.com", role: "manager", status: "active", lastMin: 40 },
  { id: "u3", name: "Khalid Al-Abdulla", nameAr: "خالد العبدالله", email: "khalid@shenatech.com", role: "operator", status: "active", lastMin: 120 },
  { id: "u4", name: "Fatima Al-Qahtani", nameAr: "فاطمة القحطاني", email: "fatima@shenatech.com", role: "viewer", status: "active", lastMin: 180 },
  { id: "u5", name: "Omar Farooq", nameAr: "عمر فاروق", email: "omar@shenatech.com", role: "operator", status: "active", lastMin: 1440 },
  { id: "u6", name: "Yousef Al-Dossari", nameAr: "يوسف الدوسري", email: "yousef@shenatech.com", role: "operator", status: "invited", lastMin: null },
  { id: "u7", name: "Layla Bahjet", nameAr: "ليلى بهجت", email: "layla@shenatech.com", role: "manager", status: "inactive", lastMin: 20160 },
];

export const ROLES: Role[] = ["admin", "manager", "operator", "viewer"];

export function userStats(users: TeamUser[]) {
  return {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "invited").length,
  };
}
