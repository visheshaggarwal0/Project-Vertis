import { User, Task, DEPARTMENTS, ROLES, Lead, Contact } from './types';

export { DEPARTMENTS, ROLES };

/**
 * RBAC Rules:
 * - Administrator (Level 0): Full control over everything.
 * - CEO/CSO/COO (Level 1): Can assign tasks to all.
 * - COO Associates (Level 2): Can assign tasks to Level 3, 4, 5.
 * - Department Heads (Level 3): Can assign tasks to Level 4, 5 within their department.
 * - Senior Associates (Level 4): Can assign tasks to Level 5 within their department.
 * - Junior Associates (Level 5): Cannot assign tasks.
 */

export const canAssignTask = (assigner: User, assignee: User): boolean => {
  if (assigner.id === assignee.id) return true; // Self-assignment is always allowed
  const assignerLevel = assigner.roleLevel;
  const assigneeLevel = assignee.roleLevel;

  if (assignerLevel === 0) return true; // Admin is mastermind
  if (assignerLevel === 1) return true; // C-Suite can assign to all
  if (assignerLevel === 5) return false; // Junior Associate can't assign

  // Level 2 (COO Associate) can assign to 3, 4, 5
  if (assignerLevel === 2) return assigneeLevel >= 3;

  // Level 3 & 4 must be in the same department
  if (assignerLevel === 3 || assignerLevel === 4) {
    if (assigner.departmentId !== assignee.departmentId) return false;
    return assignerLevel < assigneeLevel;
  }

  return false;
};

export const canEditTask = (user: User, task: Task): boolean => {
  if (user.roleLevel === 0) return true; // Admin can edit anything
  if (task.assignedBy === user.id) return true; // Assigner can edit
  return false; // Assignee can only update status (handled in UI)
};

export const canDeleteTask = (user: User, task: Task): boolean => {
  if (user.roleLevel === 0) return true; // Admin can delete anything
  if (task.assignedBy === user.id) return true; // Assigner can delete
  return false;
};

export const canManageUsers = (user: User): boolean => {
  return user.roleLevel === 0; // Only Admin can manage users
};

export const canViewTask = (user: User, task: Task): boolean => {
  if (user.roleLevel <= 2) return true; // Admin, C-Suite, COO Associate see all
  if (user.roleLevel === 3) {
    // Dept Heads see all tasks in their department
    const assignee = task.assignedTo; // This would require looking up the user, or we can check if the task is tagged with a department
    // For now, let's assume tasks are visible if the user is the assigner, assignee, or if they are a Dept Head
    return true; // We will refine this in the component filtering logic
  }
  return task.assignedTo === user.id || task.assignedBy === user.id;
};

/**
 * Visibility Rules:
 * - Level 0, 1, 2: See everything.
 * - Level 3: See everything in their department.
 * - Level 4, 5: See only their assigned items.
 */
export const getVisibleTasks = (user: User, tasks: Task[], allUsers: User[]) => {
  if (user.roleLevel <= 2) return tasks;
  
  return tasks.filter(task => {
    if (task.assignedTo === user.id || task.assignedBy === user.id) return true;
    
    if (user.roleLevel === 3) {
      const assignee = allUsers.find(u => u.id === task.assignedTo);
      return assignee?.departmentId === user.departmentId;
    }
    
    return false;
  });
};

export const getVisibleLeads = (user: User, leads: Lead[]) => {
  // Leads and Contacts are currently global, but we can restrict them by department if needed.
  // For now, let's keep them visible to Level 0-3, and restricted for 4-5.
  if (user.roleLevel <= 3) return leads;
  return []; // Junior/Senior associates don't see leads unless assigned
};

export const getVisibleContacts = (user: User, contacts: Contact[]) => {
  const userLevel = user.roleLevel;
  const userDept = user.departmentId;

  return contacts.filter(contact => {
    // External contacts are visible to Level 0-3, or if the user is an admin/executive
    if (contact.status !== 'employee') {
      return userLevel <= 3;
    }

    // Employee contact visibility rules
    const contactLevel = contact.roleLevel ?? 5;
    const contactDept = contact.departmentId;

    // Admin and Executives (Level 0-1) can access all employees
    if (userLevel <= 1) return true;

    // COO Associate (Level 2) can access all Dept Heads (Level 3) and Executives (Level 0-1)
    if (userLevel === 2) {
      return contactLevel === 3 || contactLevel <= 1;
    }

    // Department Heads (Level 3) can access:
    // - Their department members
    // - Fellow department heads (Level 3)
    // - COO Associate (Level 2)
    if (userLevel === 3) {
      if (contactDept === userDept) return true;
      if (contactLevel === 3) return true;
      if (contactLevel === 2) return true;
      return false;
    }

    // Associate (Level 4-5) can access L3, L4, L5 contacts of their own department members
    if (userLevel === 4 || userLevel === 5) {
      return contactDept === userDept && contactLevel >= 3;
    }

    return false;
  });
};
