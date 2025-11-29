import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  category: string | null;
  temple_id: string | null;
}

interface Temple {
  id: string;
  name: string;
}

const eventCategories = ["Festival", "Special Darshan", "Rally", "Temple Function", "Procession"];

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    category: "Festival",
    temple_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [eventsRes, templesRes] = await Promise.all([
      supabase.from("festivals").select("*").order("start_date", { ascending: false }),
      supabase.from("temples").select("id, name").order("name"),
    ]);

    if (eventsRes.data) setEvents(eventsRes.data);
    if (templesRes.data) setTemples(templesRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      category: form.category,
      temple_id: form.temple_id || null,
    };

    try {
      if (editingEvent) {
        const { data, error } = await supabase
          .from("festivals")
          .update(payload)
          .eq("id", editingEvent.id)
          .select();

        console.log("Update event result:", { data, error });

        if (error) {
          console.error("Update event error:", error);
          toast({ title: "Error updating event", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Event updated successfully" });
        await fetchData();
        resetForm();
      } else {
        const { data, error } = await supabase
          .from("festivals")
          .insert([payload])
          .select();

        console.log("Insert event result:", { data, error });

        if (error) {
          console.error("Insert event error:", error);
          toast({ title: "Error adding event", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Event added successfully" });
        await fetchData();
        resetForm();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({
      name: event.name,
      description: event.description || "",
      start_date: event.start_date,
      end_date: event.end_date || "",
      category: event.category || "Festival",
      temple_id: event.temple_id || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { data, error } = await supabase
        .from("festivals")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete event result:", { data, error });

      if (error) {
        console.error("Delete event error:", error);
        toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
        return;
      }
      
      toast({ title: "Event deleted successfully" });
      await fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      category: "Festival",
      temple_id: "",
    });
    setEditingEvent(null);
    setDialogOpen(false);
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.category && e.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getTempleName = (templeId: string | null) => {
    if (!templeId) return "All Temples";
    const temple = temples.find((t) => t.id === templeId);
    return temple?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Manage festivals, events, and special darshans</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Event Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Temple (Optional)</Label>
                  <Select value={form.temple_id || "all"} onValueChange={(v) => setForm({ ...form, temple_id: v === "all" ? "" : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Temples" />
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
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingEvent ? "Update" : "Add"} Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <span className="text-muted-foreground">{filteredEvents.length} events</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events found. Add your first event!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Temple</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {event.category}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(event.start_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {event.end_date ? format(new Date(event.end_date), "MMM d, yyyy") : "-"}
                      </TableCell>
                      <TableCell>{getTempleName(event.temple_id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
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
