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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Temple {
  id: string;
  name: string;
  slug: string;
  district: string;
  type: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  virtual_darshan_url: string | null;
  map_url: string | null;
  is_active: boolean;
}

const templeTypes = ["Jyotirlinga", "Devi", "Shiv", "Ganesh", "Vishnu", "Hanuman", "Other"];

export default function AdminTemples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    district: "",
    type: "Shiv",
    description: "",
    image_url: "",
    location: "",
    virtual_darshan_url: "",
    map_url: "",
  });

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    const { data, error } = await supabase
      .from("temples")
      .select("*")
      .order("name");

    if (error) {
      toast({ title: "Error fetching temples", variant: "destructive" });
    } else {
      setTemples(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");

    try {
      if (editingTemple) {
        const { data, error } = await supabase
          .from("temples")
          .update({ ...form, slug })
          .eq("id", editingTemple.id)
          .select();

        console.log("Update result:", { data, error });

        if (error) {
          console.error("Update error:", error);
          toast({ title: "Error updating temple", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Temple updated successfully" });
        await fetchTemples();
        resetForm();
      } else {
        const { data, error } = await supabase
          .from("temples")
          .insert([{ ...form, slug }])
          .select();

        console.log("Insert result:", { data, error });

        if (error) {
          console.error("Insert error:", error);
          toast({ title: "Error adding temple", description: error.message, variant: "destructive" });
          return;
        }
        
        toast({ title: "Temple added successfully" });
        await fetchTemples();
        resetForm();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const handleEdit = (temple: Temple) => {
    setEditingTemple(temple);
    setForm({
      name: temple.name,
      slug: temple.slug,
      district: temple.district,
      type: temple.type,
      description: temple.description || "",
      image_url: temple.image_url || "",
      location: temple.location || "",
      virtual_darshan_url: temple.virtual_darshan_url || "",
      map_url: temple.map_url || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this temple?")) return;

    try {
      const { data, error } = await supabase
        .from("temples")
        .delete()
        .eq("id", id)
        .select();

      console.log("Delete result:", { data, error });

      if (error) {
        console.error("Delete error:", error);
        toast({ title: "Error deleting temple", description: error.message, variant: "destructive" });
        return;
      }
      
      toast({ title: "Temple deleted successfully" });
      await fetchTemples();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      district: "",
      type: "Shiv",
      description: "",
      image_url: "",
      location: "",
      virtual_darshan_url: "",
      map_url: "",
    });
    setEditingTemple(null);
    setDialogOpen(false);
  };

  const filteredTemples = temples.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.district.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Temple Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage temples</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Temple
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTemple ? "Edit Temple" : "Add New Temple"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temple Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL-friendly name)</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>District *</Label>
                  <Input
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Virtual Darshan URL (YouTube)</Label>
                <Input
                  value={form.virtual_darshan_url}
                  onChange={(e) => setForm({ ...form, virtual_darshan_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Google Maps URL</Label>
                <Input
                  value={form.map_url}
                  onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingTemple ? "Update" : "Add"} Temple</Button>
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
                placeholder="Search temples..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <span className="text-muted-foreground">{filteredTemples.length} temples</span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTemples.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No temples found. Add your first temple!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemples.map((temple) => (
                    <TableRow key={temple.id}>
                      <TableCell className="font-medium">{temple.name}</TableCell>
                      <TableCell>{temple.district}</TableCell>
                      <TableCell>{temple.type}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            temple.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {temple.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(temple)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(temple.id)}
                        >
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
