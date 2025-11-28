import * as repo from "./repo.js";

export const notify = (userId, scheduleId, type, message) => {
  return repo.create({ user_id: userId, schedule_id: scheduleId, type, message });
};

export const list = repo.list;

export const markAsRead = repo.markAsRead;
