import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getFollowUpBucket,
  groupFollowUps,
  isOverduePending,
} from "./buckets";
import type { FollowUpStatus } from "./status";

const now = new Date("2026-09-10T16:00:00.000Z");

function followUp(
  scheduledAt: string,
  status: FollowUpStatus = "pending",
) {
  return { status, scheduled_at: scheduledAt };
}

test("relance future → à venir", () => {
  const item = followUp("2026-09-12T08:00:00.000Z");
  assert.equal(getFollowUpBucket(item, now), "upcoming");
  assert.equal(isOverduePending(item, now), false);
});

test("relance plus tard aujourd’hui → aujourd’hui", () => {
  const item = followUp("2026-09-10T18:00:00.000Z");
  assert.equal(getFollowUpBucket(item, now), "today");
  assert.equal(isOverduePending(item, now), false);
});

test("relance passée (jour précédent) → en retard", () => {
  const item = followUp("2026-09-09T08:00:00.000Z");
  assert.equal(getFollowUpBucket(item, now), "overdue");
  assert.equal(isOverduePending(item, now), true);
});

test("relance passée aujourd’hui → en retard", () => {
  const item = followUp("2026-09-10T07:00:00.000Z");
  assert.equal(getFollowUpBucket(item, now), "overdue");
  assert.equal(isOverduePending(item, now), true);
});

test("relance terminée passée → hors listes", () => {
  const item = followUp("2026-09-09T08:00:00.000Z", "completed");
  assert.equal(getFollowUpBucket(item, now), "done");
  assert.equal(isOverduePending(item, now), false);
});

test("relance terminée aujourd’hui → hors listes", () => {
  const item = followUp("2026-09-10T07:00:00.000Z", "completed");
  assert.equal(getFollowUpBucket(item, now), "done");
  assert.equal(isOverduePending(item, now), false);
});

test("groupFollowUps sépare les trois listes sans toucher au statut", () => {
  const items = [
    { id: "future", ...followUp("2026-09-12T08:00:00.000Z") },
    { id: "today", ...followUp("2026-09-10T18:00:00.000Z") },
    { id: "past", ...followUp("2026-09-09T08:00:00.000Z") },
    { id: "done", ...followUp("2026-09-09T08:00:00.000Z", "completed") },
  ];

  const grouped = groupFollowUps(items, now);

  assert.deepEqual(
    grouped.today.map((item) => item.id),
    ["today"],
  );
  assert.deepEqual(
    grouped.overdue.map((item) => item.id),
    ["past"],
  );
  assert.deepEqual(
    grouped.upcoming.map((item) => item.id),
    ["future"],
  );
  assert.equal(items[2]?.status, "pending");
  assert.equal(items[3]?.status, "completed");
});
