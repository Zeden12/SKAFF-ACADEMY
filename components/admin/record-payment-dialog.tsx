"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants/student-portal";
import { recordPaymentAction } from "@/lib/actions/fees-actions";
import type { PaymentMethod } from "@/lib/types";

const METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeRecordId: string;
  studentName: string;
  balance: number;
  currency: string;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  feeRecordId,
  studentName,
  balance,
  currency,
}: RecordPaymentDialogProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mobile_money");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const amountNumber = Number(amount);
    if (!amount.trim() || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Enter a payment amount greater than 0.");
      return;
    }
    if (amountNumber > balance) {
      setError(`Amount cannot exceed the outstanding balance of ${currency} ${balance.toLocaleString()}.`);
      return;
    }
    if (!reference.trim()) {
      setError("A payment reference is required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await recordPaymentAction({
          feeRecordId,
          amount: amountNumber,
          method,
          reference: reference.trim(),
          note: note.trim() || undefined,
        });
        router.refresh();
        onOpenChange(false);
        setAmount("");
        setReference("");
        setNote("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not record this payment.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment — {studentName}</DialogTitle>
          <DialogDescription>
            Outstanding balance: {currency} {balance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Amount ({currency})</Label>
            <Input id="payment-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-method">Method</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
              <SelectTrigger id="payment-method" className="w-full">
                <SelectValue>{PAYMENT_METHOD_LABELS[method]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-reference">Reference</Label>
            <Input
              id="payment-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. MM-2026-99213"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-note">Note (optional)</Label>
            <Textarea id="payment-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            <CircleDollarSign className="size-4" />
            {isPending ? "Saving…" : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
