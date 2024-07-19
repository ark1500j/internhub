import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function StudentForm() {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Programme</Label>
          <Input
            id="comapny-name"
            placeholder="Computer Engineering"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="department">Department</Label>
          <Input id="last-name" placeholder="Comuter Engineering" required />
        </div>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="refNum">Reference number</Label>
        <Input id="refNum" type="text" placeholder="20723275" required />
      </div>
    </div>
  );
}