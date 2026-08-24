"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecordPaymentDialog } from "./record-payment-dialog";

interface FeeRowActionsProps {
  feeRecordId: string;
  studentName: string;
  balance: number;
  currency: string;
}

export function FeeRowActions({ feeRecordId, studentName, balance, currency }: FeeRowActionsProps) {
  const [open, setOpen] = useState(false);

  if (balance <= 0) {
    return <span className="text-xs text-muted-foreground">Fully paid</span>;
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Record Payment
      </Button>
      <RecordPaymentDialog
        open={open}
        onOpenChange={setOpen}
        feeRecordId={feeRecordId}
        studentName={studentName}
        balance={balance}
        currency={currency}
      />
    </>
  );
}
