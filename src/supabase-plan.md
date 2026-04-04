# Supabase Migration Plan for Vertis CRM

## 1. Database Schema (PostgreSQL)

### Tables

#### `profiles`
- `id`: uuid (references auth.users)
- `name`: text
- `email`: text (unique)
- `role`: text
- `role_level`: integer
- `department_id`: uuid (references departments.id)
- `avatar_url`: text
- `updated_at`: timestamp

#### `departments`
- `id`: uuid (primary key)
- `name`: text (unique)
- `created_at`: timestamp

#### `tasks`
- `id`: uuid (primary key)
- `title`: text
- `description`: text
- `assigned_by`: uuid (references profiles.id)
- `assigned_to`: uuid (references profiles.id)
- `status`: text (pending, in_progress, completed, reviewed)
- `priority`: text (low, medium, high)
- `deadline`: timestamp
- `created_at`: timestamp
- `updated_at`: timestamp

#### `comments`
- `id`: uuid (primary key)
- `task_id`: uuid (references tasks.id)
- `user_id`: uuid (references profiles.id)
- `text`: text
- `created_at`: timestamp

#### `notifications`
- `id`: uuid (primary key)
- `user_id`: uuid (references profiles.id)
- `message`: text
- `read`: boolean
- `type`: text (assignment, deadline, mention)
- `created_at`: timestamp

## 2. Row Level Security (RLS)

### `profiles`
- `SELECT`: Authenticated users can view all profiles.
- `UPDATE`: Users can only update their own profile (except for `role_level` which requires Admin level 0).

### `tasks`
- `SELECT`: Users can see tasks assigned to them or created by them.
- `INSERT`: Users can create tasks if `canAssignTask` logic passes.
- `UPDATE`: Assignees can update status. Creators/Admins can update all fields.

## 3. Authentication
- Use Supabase Auth with Google/Email providers.
- Implement a `handle_new_user` trigger to create a profile entry on signup.

## 4. Frontend Integration
- Replace `StoreContext.tsx` local state with Supabase real-time subscriptions.
- Use `@supabase/supabase-js` client.
