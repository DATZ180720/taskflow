const PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates a task payload. With partial=true (PATCH) only the
 * fields present are checked. Returns { value, errors }.
 */
export function validateTask(body, { partial = false } = {}) {
  const errors = [];
  const value = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has('title')) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push('title is required');
    } else if (body.title.trim().length > 120) {
      errors.push('title must be 120 characters or less');
    } else {
      value.title = body.title.trim();
    }
  }

  if (has('description')) {
    if (typeof body.description !== 'string') errors.push('description must be a string');
    else value.description = body.description.trim();
  }

  if (has('priority')) {
    if (!PRIORITIES.includes(body.priority)) errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
    else value.priority = body.priority;
  }

  if (has('dueDate')) {
    if (body.dueDate !== null && Number.isNaN(Date.parse(body.dueDate))) errors.push('dueDate must be a valid date');
    else value.dueDate = body.dueDate;
  }

  if (has('done')) {
    if (typeof body.done !== 'boolean') errors.push('done must be a boolean');
    else value.done = body.done;
  }

  return { value, errors };
}
