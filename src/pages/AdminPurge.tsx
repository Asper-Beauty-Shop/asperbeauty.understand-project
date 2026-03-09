import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PurgeReviewPanel = () => {
  const [purgedItems, setPurgedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the 408 items on mount
  useEffect(() => {
    fetchPurgedItems();
  }, []);

  const fetchPurgedItems = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, shopify_product_id, price, tags')
      .contains('tags', ['Pending_Purge']);
      
    if (!error && data) setPurgedItems(data);
  };

  // Handle individual checkbox toggles
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Handle "Select All"
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(purgedItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Action 1: The "Undo" (Restore to Active)
  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);

    // Call RPC to safely remove Pending_Purge tag and reset status/category
    const { error } = await supabase.rpc('remove_purge_tag_bulk', {
      product_ids: selectedIds
    });

    if (!error) {
      setPurgedItems(purgedItems.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      toast.success("Items restored successfully");
    } else {
      console.error(error);
      toast.error("Restore failed");
    }
    setIsProcessing(false);
  };

  // Action 2: The Permanent Hard Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    // Crucial Guardrail: Force confirmation before destructive actions
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} items? This cannot be undone.`);
    if (!confirmDelete) return;

    setIsProcessing(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', selectedIds);

    if (!error) {
      setPurgedItems(purgedItems.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      toast.success("Items deleted permanently");
    } else {
      toast.error("Delete failed");
    }
    setIsProcessing(false);
  };

  return (
    <div className="admin-purge-container" style={{ padding: '40px', backgroundColor: '#F8F8FF', minHeight: '100vh', paddingTop: '100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ color: '#333333', fontFamily: 'Tajawal', fontSize: '2rem' }}>
          Purge Review ({purgedItems.length} Items Flagged)
        </h1>
        
        {/* Bulk Action Controls */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleBulkRestore} 
            disabled={isProcessing || selectedIds.length === 0}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#FFFFFF', 
              color: '#C5A028',
              border: '1px solid #C5A028', 
              cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Restore Selected
          </button>
          <button 
            onClick={handleBulkDelete} 
            disabled={isProcessing || selectedIds.length === 0}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#800020', 
              color: '#FFFFFF', 
              border: 'none', 
              cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Permanently Delete Selected
          </button>
        </div>
      </header>

      {/* The Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #EEEEEE', backgroundColor: '#333333', color: '#FFFFFF' }}>
              <th style={{ padding: '16px' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === purgedItems.length && purgedItems.length > 0} />
              </th>
              <th style={{ padding: '16px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Shopify ID</th>
              <th style={{ padding: '16px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Product Title</th>
              <th style={{ padding: '16px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {purgedItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #EEEEEE', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px' }}>
                  <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleSelect(item.id)} />
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>{item.shopify_product_id}</td>
                <td style={{ padding: '16px', fontWeight: '500', color: '#1A1A1A' }}>{item.title}</td>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#C5A028' }}>{item.price} JOD</td>
              </tr>
            ))}
            {purgedItems.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No items pending purge</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurgeReviewPanel;