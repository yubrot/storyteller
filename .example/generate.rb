#!/usr/bin/env ruby

# Generates a example project source

require "json"
require "date"

def main()
  labels = [
    "label-a",
    "label-b",
    "label-c",
    "label-d",
    "label-e",
  ]

  assignees = [
      ["a1", "Assignee A", "https://picsum.photos/id/1024/20"],
      ["a2", "Assignee B", "https://picsum.photos/id/1019/20"],
      ["a3", "Assignee C", "https://picsum.photos/id/1049/20"],
      ["a4", "Assignee D", "https://picsum.photos/id/1067/20"],
  ]

  generate "01.json", labels[0, 2], assignees[0, 2], 25, 30, 100, 3
  generate "02.json", labels[0, 4], assignees[0, 3], 150, 180, 120, 4
  generate "03.json", labels, assignees, 250, 360, 240, 3
end

def generate(path, labels, assignees, num_tasks, p1, p2, p3)
  labels = labels.map { |name| [name, { name: name }] }.to_h
  assignees = assignees.map { |id, name, url| [id, { id: id, name: name, url: url, avatarUrl: url }] }.to_h

  now = Time.now.to_i
  last_task_id = 0
  tasks = {}
  num_tasks.times do
    last_task_id += 1
    id = last_task_id.to_s
    created_at = now - (60 * 60 * 24 * p1 * (1 - rand ** p3)).floor
    completed_at = now - (60 * 60 * 24 * p2 * rand).floor
    completed_at = nil if completed_at < created_at

    tasks[id] = {
      id: id,
      title: "Task #{id}",
      createdAt: created_at * 1000,
      completedAt: completed_at ? completed_at * 1000 : nil,
      storyPoint: [1,1,1,1,2,2,2,2,3,3,3,5,8,nil].sample,
      assignees: assignees.filter { rand < 0.2 }.map { |k, _| k },
      labels: labels.filter { rand < 0.2 }.map { |k, _| k },
    }
  end

  IO.write(path, JSON.pretty_generate({
    metadata: {
      url: "https://github.com/yubrot/storyteller",
    },
    assignees: assignees,
    labels: labels,
    tasks: tasks,
  }))
end

main
