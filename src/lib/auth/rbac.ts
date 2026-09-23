import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 5,
  ADMIN: 4,
  MANAGER: 3,
  SALES_REP: 2,
  VIEWER: 1,
};

export function hasRoleAtLeast(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const PERMISSIONS = {
  // Leads & Pipeline
  VIEW_LEADS: (r: Role) => hasRoleAtLeast(r, Role.VIEWER),
  CREATE_LEAD: (r: Role) => hasRoleAtLeast(r, Role.SALES_REP),
  EDIT_LEAD: (r: Role) => hasRoleAtLeast(r, Role.SALES_REP),
  DELETE_LEAD: (r: Role) => hasRoleAtLeast(r, Role.MANAGER),
  ASSIGN_LEAD: (r: Role) => hasRoleAtLeast(r, Role.MANAGER),

  // Sequences & Automations
  VIEW_SEQUENCES: (r: Role) => hasRoleAtLeast(r, Role.VIEWER),
  MANAGE_SEQUENCES: (r: Role) => hasRoleAtLeast(r, Role.SALES_REP),
  MANAGE_AUTOMATIONS: (r: Role) => hasRoleAtLeast(r, Role.MANAGER),

  // Analytics & AI
  VIEW_ANALYTICS: (r: Role) => hasRoleAtLeast(r, Role.VIEWER),
  USE_COPILOT: (r: Role) => hasRoleAtLeast(r, Role.SALES_REP),

  // Settings & Admin
  MANAGE_WORKSPACE: (r: Role) => hasRoleAtLeast(r, Role.ADMIN),
  MANAGE_TEAM: (r: Role) => hasRoleAtLeast(r, Role.ADMIN),
  MANAGE_API_KEYS: (r: Role) => hasRoleAtLeast(r, Role.ADMIN),
  MANAGE_BILLING: (r: Role) => hasRoleAtLeast(r, Role.OWNER),
};
