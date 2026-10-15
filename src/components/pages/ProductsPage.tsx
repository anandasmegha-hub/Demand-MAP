import React, { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export const ProductsPage: React.FC = () => {
  const { products, setSelectedProduct, addToast, adjustStock, searchQuery, addProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'demand'>('demand');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Specialty Coffee');
  const [newProdPrice, setNewProdPrice] = useState('14.50');
  const [newProdCost, setNewProdCost] = useState('6.20');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdMin, setNewProdMin] = useState('15');

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const effectiveSearch = searchTerm || searchQuery;

  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        !effectiveSearch ||
        p.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(effectiveSearch.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'all' || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return a.stock - b.stock;
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'demand') return b.unitsSold30d - a.unitsSold30d;
      return 0;
    });

  const handleExportCSV = () => {
    addToast(`Simulating product catalog CSV export (${products.length} SKUs downloaded).`, 'success');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const parsedPrice = parseFloat(newProdPrice) || 10.0;
    const parsedCost = parseFloat(newProdCost) || 5.0;
    const parsedStock = parseInt(newProdStock) || 20;
    const parsedMin = parseInt(newProdMin) || 10;

    let status: 'optimal' | 'reorder' | 'critical' | 'out_of_stock' = 'optimal';
    if (parsedStock === 0) status = 'out_of_stock';
    else if (parsedStock <= parsedMin * 0.5) status = 'critical';
    else if (parsedStock <= parsedMin) status = 'reorder';

    addProduct({
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdCategory,
      price: parsedPrice,
      cost: parsedCost,
      stock: parsedStock,
      minThreshold: parsedMin,
      maxCapacity: parsedMin * 4,
      unit: 'units',
      dailyDemandRate: 2.5,
      lastRestocked: 'Today',
      demandTrend: 'rising',
      status,
      unitsSold30d: 0,
      revenue30d: 0,
    });

    setShowAddModal(false);
    setNewProdName('');
  };

  return (
    <div>
      {/* Page Action Bar */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          padding: '16px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Search & Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                }}
              />
              <input
                type="text"
                placeholder="Filter by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{ paddingLeft: '34px' }}
              />
            </div>

            {/* Category select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Status select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">Status: All Statuses</option>
              <option value="optimal">Optimal Stock</option>
              <option value="reorder">Reorder Soon</option>
              <option value="critical">Critical Low</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            >
              <option value="demand">Sort: Highest Demand (30D)</option>
              <option value="stock">Sort: Lowest Stock First</option>
              <option value="price">Sort: Highest Price</option>
              <option value="name">Sort: Product Name A-Z</option>
            </select>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleExportCSV}
              title="Export product list"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={15} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No matching products found"
            description="No items match your filter criteria. Try clearing search or selecting a different category."
            actionText="Reset filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          />
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Product & SKU</th>
                  <th>Category</th>
                  <th>Retail Price</th>
                  <th>Unit Cost</th>
                  <th>Margin</th>
                  <th>In-Stock</th>
                  <th>Min Threshold</th>
                  <th>Daily Run Rate</th>
                  <th>Status</th>
                  <th>Quick Adjust</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const marginPct = Math.round(((p.price - p.cost) / p.price) * 100);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {p.sku}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                          }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                      <td style={{ color: 'var(--text-muted)' }}>${p.cost.toFixed(2)}</td>
                      <td>
                        <span
                          style={{
                            color: marginPct >= 50 ? '#047857' : '#b45309',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        >
                          {marginPct}%
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.92rem' }}>{p.stock}</strong>{' '}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.unit}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {p.minThreshold} {p.unit}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{p.dailyDemandRate}/day</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${p.status}`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 8px' }}
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '2px 8px' }}
                            onClick={() => adjustStock(p.id, 5)}
                            title="Add 5 units"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedProduct(p)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal (Interactive demonstration) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                  Add Product (Demonstration)
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Creates an item in local reactive state for demo purposes.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit} style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Product Name & Size
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombian Supremo Beans (340g)"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="search-input"
                    style={{ width: '100%', paddingLeft: '12px' }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <option value="Specialty Coffee">Specialty Coffee</option>
                    <option value="Plant Dairy">Plant Dairy</option>
                    <option value="Artisan Bakery">Artisan Bakery</option>
                    <option value="Ready to Drink">Ready to Drink</option>
                    <option value="Gourmet Pantry">Gourmet Pantry</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Retail Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '12px' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Unit Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProdCost}
                      onChange={(e) => setNewProdCost(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '12px' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      Min Safety Threshold
                    </label>
                    <input
                      type="number"
                      value={newProdMin}
                      onChange={(e) => setNewProdMin(e.target.value)}
                      className="search-input"
                      style={{ width: '100%', paddingLeft: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
