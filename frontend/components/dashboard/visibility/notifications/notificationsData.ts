/**
 * Mock data for the Visibility → Notifications ("Notification rules") page.
 *
 * Each rule fires on a transport event, is scoped to a set of shipments,
 * delivers through one or more channels, and can be toggled on/off.
 * All demo data.
 */

export type EventType =
  | "delay"
  | "eta"
  | "untracked"
  | "temp"
  | "arrival"
  | "departed";

export type Channel = "email" | "sms" | "push";
export type Scope = "all" | "customer" | "reefer" | "cross";

export type Rule = {
  id: string;
  event: EventType;
  scope: Scope;
  channels: Channel[];
  enabled: boolean;
  /** Times this rule fired in the last 7 days. */
  triggers: number;
  /** Minutes since it last fired, or null if it never has. */
  lastMin: number | null;
};

export const RULES: Rule[] = [
  { id: "r1", event: "delay",     scope: "all",      channels: ["email", "push"],         enabled: true,  triggers: 12, lastMin: 35 },
  { id: "r2", event: "eta",       scope: "customer", channels: ["push"],                  enabled: true,  triggers: 8,  lastMin: 120 },
  { id: "r3", event: "untracked", scope: "all",      channels: ["email", "sms"],          enabled: true,  triggers: 5,  lastMin: 18 },
  { id: "r4", event: "temp",      scope: "reefer",   channels: ["email", "sms", "push"],  enabled: true,  triggers: 2,  lastMin: 480 },
  { id: "r5", event: "arrival",   scope: "cross",    channels: ["push"],                  enabled: false, triggers: 0,  lastMin: null },
  { id: "r6", event: "departed",  scope: "all",      channels: ["email"],                 enabled: false, triggers: 0,  lastMin: 2880 },
];
