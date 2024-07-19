import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CompanyFrom() {
  return (
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Comany Name</Label>
          <Input id="comapny-name" placeholder="Google" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Location</Label>
          <Input id="last-name" placeholder="Accra" required />
        </div>
      </div>
  );
}
