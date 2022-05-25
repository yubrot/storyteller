import { useCallback, useState, useMemo } from 'react';

export interface Filters {
  created: boolean;
  completed: boolean;
  completedGroup: CompletedGroup;
  assignee(id: string): boolean;
  unassigned: boolean;
  label(name: string): boolean;
  unlabeled: boolean;

  setCreated(value: boolean): void;
  setCompleted(value: boolean): void;
  setCompletedGroup(value: CompletedGroup): void;
  setAssignee(id: string, value: boolean): void;
  setUnassigned(value: boolean): void;
  setLabel(name: string, value: boolean): void;
  setUnlabeled(value: boolean): void;
}

export type CompletedGroup = 'none' | 'by-assignee' | 'by-label';

export function useFilters(): Filters {
  const [created, setCreated] = useState(true);
  const [completed, setCompleted] = useState(true);
  const [completedGroup, setCompletedGroup] = useState<CompletedGroup>('none');
  const [assignees, setAssignees] = useState<{ [id: string]: boolean }>({});
  const [unassigned, setUnassigned] = useState(true);
  const [labels, setLabels] = useState<{ [name: string]: boolean }>({});
  const [unlabeled, setUnlabeled] = useState(true);

  const assignee = useCallback((id: string) => assignees[id] ?? true, [assignees]);
  const label = useCallback((name: string) => labels[name] ?? true, [labels]);
  const setAssignee = useCallback(
    (id: string, value: boolean) => setAssignees(a => ({ ...a, [id]: value })),
    []
  );
  const setLabel = useCallback(
    (name: string, value: boolean) => setLabels(l => ({ ...l, [name]: value })),
    []
  );

  return useMemo(
    () => ({
      created,
      completed,
      completedGroup,
      assignee,
      unassigned,
      label,
      unlabeled,
      setCreated,
      setCompleted,
      setCompletedGroup,
      setAssignee,
      setUnassigned,
      setLabel,
      setUnlabeled,
    }),
    [
      assignee,
      completed,
      completedGroup,
      created,
      label,
      setAssignee,
      setLabel,
      unassigned,
      unlabeled,
    ]
  );
}
