import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FolderTree, Tag, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  department_id: string;
}

export default function AdminTaxonomy() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newDeptName, setNewDeptName] = useState("");
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const fetchTaxonomy = async () => {
    try {
      setIsLoading(true);
      const { data: depts } = await supabase.from("departments").select("*").order("name");
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      setDepartments(depts || []);
      setCategories(cats || []);
      if (depts && depts.length > 0 && !selectedDeptId) {
        setSelectedDeptId(depts[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load taxonomy");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    
    const slug = newDeptName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase.from("departments").insert([{ name: newDeptName, slug }]).select();
    
    if (error) {
      toast.error(error.message);
    } else {
      setDepartments(prev => [...prev, ...data]);
      setNewDeptName("");
      toast.success("Department added");
    }
  };

  const handleAddCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !selectedDeptId) return;
    
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase.from("categories").insert([{ 
      name: newCatName, 
      slug, 
      department_id: selectedDeptId 
    }]).select();
    
    if (error) {
      toast.error(error.message);
    } else {
      setCategories(prev => [...prev, ...data]);
      setNewCatName("");
      toast.success("Category added");
    }
  };

  const handleDeleteDept = async (id: string) => {
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) {
      toast.error("Cannot delete department with active products (Referential Integrity Check)");
    } else {
      setDepartments(prev => prev.filter(d => d.id !== id));
      toast.success("Department deleted");
    }
  };

  const handleDeleteCat = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Cannot delete category with active products");
    } else {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Category deleted");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#800020]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8FF]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-gray-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#800020]">Taxonomy Control Center</h1>
            <p className="text-gray-500 mt-2 font-body">Manage clinical hierarchy and product routing.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            <FolderTree className="w-4 h-4" />
            Locked Protocol Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Departments (Tier 1) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#800020]"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Tier 1: Departments</h2>
            </div>
            
            <form onSubmit={handleAddDept} className="flex gap-2">
              <Input 
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="New Department..."
                className="rounded-lg border-gray-200"
              />
              <Button type="submit" size="icon" className="bg-[#800020] shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            <div className="space-y-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all group",
                    selectedDeptId === dept.id 
                      ? "bg-white border-[#D4AF37] shadow-md scale-[1.02]" 
                      : "bg-transparent border-gray-100 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      selectedDeptId === dept.id ? "bg-[#800020] text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", selectedDeptId === dept.id && "rotate-90")} />
                    </div>
                    <span className={cn(
                      "font-bold text-sm tracking-tight",
                      selectedDeptId === dept.id ? "text-[#800020]" : "text-gray-600"
                    )}>
                      {dept.name}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteDept(dept.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Categories (Tier 2) */}
          <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
            {selectedDeptId ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="text-lg font-bold text-gray-900">
                      Categories in <span className="text-[#800020]">{departments.find(d => d.id === selectedDeptId)?.name}</span>
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {categories.filter(c => c.department_id === selectedDeptId).length} Sub-Categories
                  </span>
                </div>

                <form onSubmit={handleAddCat} className="flex gap-3 mb-8">
                  <Input 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="New Sub-Category (e.g. Clinical Serums)"
                    className="h-12 rounded-xl border-gray-200"
                  />
                  <Button type="submit" className="h-12 px-8 bg-[#800020] rounded-xl font-bold uppercase tracking-widest text-xs">
                    Assign Category
                  </Button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.filter(c => c.department_id === selectedDeptId).map(cat => (
                    <div 
                      key={cat.id}
                      className="flex items-center justify-between p-4 bg-[#F8F8FF] rounded-2xl border border-gray-100 group hover:border-[#D4AF37] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                        <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCat(cat.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {categories.filter(c => c.department_id === selectedDeptId).length === 0 && (
                    <div className="col-span-2 py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl font-body italic text-sm">
                      No categories assigned to this department yet.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FolderTree className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a department to manage its sub-categories.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
