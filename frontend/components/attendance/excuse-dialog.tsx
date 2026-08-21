/**
 * @file excuse-dialog.tsx
 * @module frontend/components/attendance
 *
 * Shared Add/Edit excuse dialog (description + minutes).
 * Callers own the save path (attendance API).
 */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ExcuseDialogValues = {
  description: string | null;
  excuse_min: number | null;
};

export type ExcuseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kindLabel: string;
  scholarLabel: string;
  weekNum: number;
  initialDescription?: string | null;
  initialExcuseMin?: number | null;
  onSubmit: (values: ExcuseDialogValues) => Promise<void>;
};

export function ExcuseDialog({
  open,
  onOpenChange,
  kindLabel,
  scholarLabel,
  weekNum,
  initialDescription = null,
  initialExcuseMin = null,
  onSubmit,
}: ExcuseDialogProps) {
  const [description, setDescription] = useState("");
  const [excuseMin, setExcuseMin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDescription(initialDescription ?? "");
      setExcuseMin(
        initialExcuseMin != null ? String(initialExcuseMin) : ""
      );
      setError(null);
    }
  }, [open, initialDescription, initialExcuseMin]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const excuseMinNum =
      excuseMin.trim() === "" ? null : parseInt(excuseMin, 10);
    const values: ExcuseDialogValues = {
      description: description.trim() || null,
      excuse_min:
        excuseMinNum != null && !Number.isNaN(excuseMinNum)
          ? excuseMinNum
          : null,
    };
    if (
      values.excuse_min != null &&
      values.excuse_min > 0 &&
      !values.description
    ) {
      setError("Description is required when minutes excused is greater than 0.");
      setSubmitting(false);
      return;
    }
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isEdit = Boolean(initialDescription || (initialExcuseMin ?? 0) > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit excuse" : "Add excuse"}</DialogTitle>
          <DialogDescription>
            {kindLabel} · Week {weekNum} · {scholarLabel}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excuse-dialog-description">
              Excuse (reason / description)
            </Label>
            <Input
              id="excuse-dialog-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Sick day, family event"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excuse-dialog-min">Minutes excused (optional)</Label>
            <Input
              id="excuse-dialog-min"
              type="number"
              min={0}
              value={excuseMin}
              onChange={(e) => setExcuseMin(e.target.value)}
              placeholder="e.g. 60"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save excuse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
