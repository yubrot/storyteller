/**
 * Representations of any structures about projects.
 * @module
 */

export interface Project {
  lastUpdatedAt: number;
  metadata: ProjectMetadata;
  assignees: { [id: string]: Assignee };
  tasks: { [id: string]: Task };
  labels: { [name: string]: Label };
}

export interface ProjectMetadata {
  url?: string | null;
}

export interface Assignee {
  id: string;
  url?: string | null;
  name: string;
  color?: string | null;
  avatarUrl?: string | null;
}

export interface Task {
  id: string;
  url?: string | null;
  title: string;
  createdAt: number;
  completedAt?: number | null;
  storyPoint?: number | null;
  assignees: string[];
  labels: string[];
}

export interface Label {
  name: string;
  color?: string | null;
}
