"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileContactAction } from "@/lib/actions/student-actions";

interface ContactFormProps {
  initialPhone: string;
  initialAddress: string;
  initialEmergencyContactName: string;
  initialEmergencyContactPhone: string;
}

export function ContactForm({
  initialPhone,
  initialAddress,
  initialEmergencyContactName,
  initialEmergencyContactPhone,
}: ContactFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [emergencyContactName, setEmergencyContactName] = useState(initialEmergencyContactName);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialEmergencyContactPhone);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateProfileContactAction({
        phone,
        address,
        emergencyContactName,
        emergencyContactPhone,
      });
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setSaved(false); }} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => { setAddress(e.target.value); setSaved(false); }} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="emergency-name">Emergency Contact Name</Label>
        <Input
          id="emergency-name"
          value={emergencyContactName}
          onChange={(e) => { setEmergencyContactName(e.target.value); setSaved(false); }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
        <Input
          id="emergency-phone"
          type="tel"
          value={emergencyContactPhone}
          onChange={(e) => { setEmergencyContactPhone(e.target.value); setSaved(false); }}
        />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
          <Save className="size-3.5" />
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
        {saved && <span className="text-xs text-muted-foreground">Saved</span>}
      </div>
    </div>
  );
}
