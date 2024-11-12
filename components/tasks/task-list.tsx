"use client";

import { Task } from "@/app/tasks/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock, PlayCircle, StopCircle, Trash2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  className?: string;
}

export function TaskList({ tasks, className }: TaskListProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      case "running":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "running":
        return <PlayCircle className="size-4" />;
      case "pending":
        return <Clock className="size-4" />;
      default:
        return <StopCircle className="size-4" />;
    }
  };

  return (
    <ScrollArea className={cn("h-[calc(100vh-24rem)]", className)}>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{task.title}</CardTitle>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    getStatusColor(task.status)
                  )}
                >
                  {getStatusIcon(task.status)}
                  <span className="text-sm font-medium">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </div>
              <CardDescription>
                Created: {task.createdAt.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              {task.result && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <p className="text-sm">{task.result}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" size="sm" className="ml-auto">
                <Trash2 className="size-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}