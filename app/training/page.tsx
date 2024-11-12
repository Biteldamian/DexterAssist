"use client";

import { TrainingForm } from "@/components/training/training-form";
import { TrainingHeader } from "@/components/training/training-header";
import { TrainingStatus } from "@/components/training/training-status";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface TrainingSession {
  id: string;
  status: "idle" | "training" | "completed" | "error";
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  metrics?: {
    loss: number;
    accuracy: number;
    epochsCompleted: number;
  };
}

export default function TrainingPage() {
  const [session, setSession] = useState<TrainingSession>({
    id: "1",
    status: "idle",
    progress: 0,
  });
  const { toast } = useToast();

  const handleStartTraining = async (epochs: number) => {
    if (session.status === "training") {
      toast({
        title: "Training in progress",
        description: "Please wait for the current training session to complete.",
        variant: "destructive",
      });
      return;
    }

    setSession({
      id: Date.now().toString(),
      status: "training",
      progress: 0,
      startedAt: new Date(),
    });

    toast({
      title: "Training started",
      description: "The model will be trained on your knowledge base.",
    });

    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSession((prev) => ({
        ...prev,
        progress,
        metrics: {
          loss: Math.random() * 0.5,
          accuracy: 0.5 + Math.random() * 0.5,
          epochsCompleted: Math.floor((progress / 100) * epochs),
        },
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setSession((prev) => ({
          ...prev,
          status: "completed",
          progress: 100,
          completedAt: new Date(),
        }));
        toast({
          title: "Training completed",
          description: "The model has been successfully updated.",
        });
      }
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <TrainingHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Model Training</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <TrainingForm onSubmit={handleStartTraining} className="lg:col-span-4" />
          <TrainingStatus session={session} className="lg:col-span-3" />
        </div>
      </div>
    </div>
  );
}