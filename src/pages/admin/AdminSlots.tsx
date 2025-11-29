import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";

interface Slot {
  id: string;
  temple_id: string;
  slot_name: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  status: string;
}

interface Temple {
  id: string;
  name: string;
}

export default function AdminSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemple, setSelectedTemple] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    temple_id: "",
    slot_name: "",
    start_time: "",
    end_time: "",
    max_capacity: 100,
    status: "open",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [slotsRes, templesRes] = await Promise.all([
      supabase.from("temple_slots").select("*").order("start_time"),
      supabase.from("temples").select("id, name").order("name"),
    ]);

    if (slotsRes.data) setSlots(slotsRes.data);
    if (templesRes.data) setTemples(templesRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      temple_id: form.temple_id,
      slot_name: form.slot_name,
      start_time: form.start_time,
      end_time: form.end_time,
      max_capacity: form.max_capacity,
      status: form.status,
    };

    try {
      if (editingSlot) {
        const { data, error } = await supabase
          .from("temple_slots")
          .update(payload)
          .eq("id", editingSlot.id)
          .select();

        console.log("Update slot result:", { data, error });

        if (error) {
          console.error("Update slot error:", error);
          toast({ title: "Error updating slot", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Slot updated successfully" });
        await fetchData();
        resetForm();
      } else {
        const { data, error } = await supabase
          .from("temple_slots")
          .insert([payload])
          .select();

        console.log("Insert slot result:", { data, error });

        if (error) {
          console.error("Insert slot error:", error);
          toast({ title: "Error adding slot", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Slot added successfully" });
        await fetchData();
        resetForm();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const handleEdit = (slot: Slot) => {
    setEditingSlot(slot);
    setForm({
      temple_id: slot.temple_id,
      slot_name: slot.slot_name,
      start_time: slot.start_time,
      end_time: slot.end_time,
      max_capacity: slot.max_capacity,
      status: slot.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const { data, error } = await supabase
        .from("temple_slots")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete slot result:", { data, error });

      if (error) {
        console.error("Delete slot error:", error);
        toast({ title: "Error deleting slot", description: error.message, variant: "destructive" });
        return;
      }
      
      toast({ title: "Slot deleted successfully" });
      await fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({
      temple_id: "",
      slot_name: "",
      start_time: "",
      end_time: "",
      max_capacity: 100,
      status: "open",
    });
    setEditingSlot(null);
    setDialogOpen(false);
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find((t) => t.id === templeId);
    return temple?.name || "Unknown";
  };

  const filteredSlots =
    selectedTemple === "all"
      ? slots
      : slots.filter((s) => s.temple_id === selectedTemple);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-red-100 text-red-700";
      case "special":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Slots & Timings</h1>
          <p className="text-muted-foreground">Manage darshan time slots for temples</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingSlot ? "Edit Slot" : "Add New Slot"}</DialogTitle>
              <DialogDescription>
                {editingSlot ? "Update slot timing and capacity" : "Add a new darshan time slot"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Temple *</Label>
                <Select
                  value={form.temple_id}
                  onValueChange={(v) => setForm({ ...form, temple_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select temple" />
                  </SelectTrigger>
                  <SelectContent>
                    {temples.map((temple) => (
                      <SelectItem key={temple.id} value={temple.id}>
                        {temple.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Slot Name *</Label>
                <Input
                  value={form.slot_name}
                  onChange={(e) => setForm({ ...form, slot_name: e.target.value })}
                  placeholder="e.g., Morning Darshan, Evening Aarti"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time *</Label>
                  <Input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Capacity</Label>
                  <Input
                    type="number"
                    value={form.max_capacity}
                    onChange={(e) => setForm({ ...form, max_capacity: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="special">Special Darshan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingSlot ? "Update" : "Add"} Slot</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={selectedTemple} onValueChange={setSelectedTemple}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by temple" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Temples</SelectItem>
                {temples.map((temple) => (
                  <SelectItem key={temple.id} value={temple.id}>
                    {temple.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">{filteredSlots.length} slots</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : temples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No temples found. Please add temples first before managing slots.
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No slots found. Add your first time slot!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Temple</TableHead>
                    <TableHead>Slot Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">{getTempleName(slot.temple_id)}</TableCell>
                      <TableCell>{slot.slot_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {slot.start_time} - {slot.end_time}
                        </div>
                      </TableCell>
                      <TableCell>{slot.max_capacity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(slot.status)}`}>
                          {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(slot)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(slot.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
