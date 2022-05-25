import { interpolateBuGn as barColor } from 'd3-scale-chromatic';
import { useMemo } from 'react';
import { ProjectReader, Query } from '../../project-reader';
import { Filters } from './filters';

const palette = {
  created: 'url(#created)',
  completedDefault: barColor(0.55),
  void: '#999999',
};

export interface Segments {
  sources: SegmentSource[];
  Defs(): React.ReactElement;
}

export function useSegments(project: ProjectReader, filters: Filters): Segments {
  const sources = useMemo(() => computeSegmentSources(project, filters), [project, filters]);
  const Defs = SegmentDefs;
  return { sources, Defs };
}

export interface SegmentSource {
  active: boolean;
  query: Query;
  color: string;
  tooltipText(value: number): string;
}

export function computeSegmentSources(project: ProjectReader, filters: Filters): SegmentSource[] {
  const sources: SegmentSource[] = [];

  function put(
    active: boolean,
    query: Query,
    color: string,
    tooltipText: (value: number) => string
  ): void {
    sources.push({ active, color, query, tooltipText });
  }

  switch (filters.completedGroup) {
    case 'none':
      put(
        filters.completed,
        project.completed,
        palette.completedDefault,
        v => `Completed ${v} story points`
      );
      break;
    case 'by-assignee':
      put(
        filters.completed && filters.unassigned,
        project.query({ type: 'completed', assignee: null }),
        palette.void,
        v => `Completed ${v} no one assigned story points`
      );
      for (const { id, name, color } of project.assignees) {
        put(
          filters.completed && filters.assignee(id),
          project.query({ type: 'completed', assignee: id }),
          color,
          v => `Completed ${v} story points by ${name}`
        );
      }
      break;
    case 'by-label':
      put(
        filters.completed && filters.unlabeled,
        project.query({ type: 'completed', label: null }),
        palette.void,
        v => `Completed ${v} unlabeled story points`
      );
      for (const { name, color } of project.labels) {
        put(
          filters.completed && filters.label(name),
          project.query({ type: 'completed', label: name }),
          color,
          v => `Completed ${v} ${name} story points`
        );
      }
      break;
  }

  put(filters.created, project.total, palette.created, v => `Created ${v} story points`);

  return sources;
}

function SegmentDefs(): React.ReactElement {
  return (
    <defs>
      <pattern
        id="created"
        width="5"
        height="5"
        patternTransform="rotate(-45)"
        patternUnits="userSpaceOnUse"
        viewBox="0 0 5 5"
      >
        <rect width="5" height="5" fill={barColor(0.05)} />
        <rect width="5" height="2" fill={barColor(0.45)} />
      </pattern>
    </defs>
  );
}

export interface SegmentColors {
  created: string;
  completedDefault: string;
  void: string;
  assignees: string[];
  labels: string[];
}

export function getSegmentColors(project: ProjectReader): SegmentColors {
  return {
    ...palette,
    assignees: [palette.void, ...project.assignees.map(assignee => assignee.color)],
    labels: [palette.void, ...project.labels.map(label => label.color)],
  };
}
