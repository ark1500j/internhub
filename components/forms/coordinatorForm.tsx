import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function CoordinatorForm() {
  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="refNum">Refernce number</Label>
            <Input id="refNum" placeholder="20735275" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="Comuter Engineering" required />
          </div>
        </div>
      </div>
    </div>
  );
}
