"use client";

import { TaskForm } from "@/components/tasks/task-form";
import { TaskHeader } from "@/components/tasks/task-header";
import { TaskList } from "@/components/tasks/task-list";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "scheduled" | "running" | "completed" | "failed";
export type AgentMode = "single" | "collaborative";
export type AgentRole = "coordinator" | "researcher" | "analyst" | "writer" | "reviewer";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  model: string;
  provider: string;
}

export interface TaskSchedule {
  startAt?: Date;
  recurringPattern?: "daily" | "weekly" | "monthly";
  nextRun?: Date;
}

export interface TaskResult {
  summary: string;
  details: string;
  artifacts?: string[];
  agentContributions?: {
    agentId: string;
    contribution: string;
    timestamp: Date;
  }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  mode: AgentMode;
  agents: Agent[];
  schedule?: TaskSchedule;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: TaskResult;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleCreateTask = async (
    title: string,
    description: string,
    priority: TaskPriority,
    mode: AgentMode,
    agents: Agent[],
    schedule?: TaskSchedule
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: schedule ? "scheduled" : "pending",
      mode,
      agents,
      schedule,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);

    toast({
      title: "Task created",
      description: schedule
        ? "Task has been scheduled and will start at the specified time."
        : "The AI agents will start processing your task shortly.",
    });

    if (!schedule) {
      // Simulate task execution with multiple agents
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === newTask.id
              ? {
                  ...task,
                  status: "running",
                  startedAt: new Date(),
                }
              : task
          )
        );

        // Simulate agent collaboration
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === newTask.id
                ? {
                    ...task,
                    status: "completed",
                    completedAt: new Date(),
                    result: {
                      summary: "Task completed successfully",
                      details: "Detailed analysis and results...",
                      agentContributions: task.agents.map((agent) => ({
                        agentId: agent.id,
                        contribution: `${agent.role} contribution to the task...`,
                        timestamp: new Date(),
                      })),
                    },
                  }
                : task
            )
          );
        }, 5000);
      }, 1000);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task and its history have been removed.",
    });
  };

  return (
    <div className="flex h-full flex-col">
      <TaskHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
          <TaskForm onSubmit={handleCreateTask} className="lg:col-span-4" />
        </div>
        <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      </div>
    </div>
  );
}