# Community Post Management Component Update Instructions

To properly update the CommunityPostManagement.tsx component, the following changes are needed:

## 1. Fix Form State Management
The current component has form state inside a render function, which is causing React hook errors. This should be moved to the component level:

```tsx
// Move these states to component level
const [formData, setFormData] = useState<Partial<CommunityPost>>({}); 
const [locationId, setLocationId] = useState<number | undefined>();
const [imageUrls, setImageUrls] = useState<string>('');
```

Then update the form rendering logic to use this state directly.

## 2. Replace `toggleFlagged` method with `handleStatusChange`
Create a new method to match the API:

```tsx
const handleStatusChange = async (id: number, status: 'published' | 'pending' | 'flagged') => {
  try {
    await updatePostStatus(id, status);
    setSuccess(`Post status changed to ${status}`);
    fetchPosts();
    setTimeout(() => setSuccess(null), 3000);
  } catch (err) {
    console.error('Failed to update post status:', err);
    setError('Failed to update post status');
    setTimeout(() => setError(null), 3000);
  }
};
```

## 3. Update SortableColumn components
Replace all instances with proper props:

```tsx
<SortableColumn
  label="Title"
  field="title"
  currentSortField={sortField}
  currentSortDirection={sortDirection}
  onSort={handleSort}
/>
```

And update the handleSort function:

```tsx
const handleSort = (field: string, direction: SortDirection) => {
  setSortField(field);
  setSortDirection(direction);
};
```

## 4. Fix fetchPosts Method
Update the fetchPosts method to use proper status filtering:

```tsx
const params = {
  page: currentPage,
  limit: itemsPerPage,
  search: searchTerm || undefined,
  user_id: userFilter || undefined,
  location_id: locationFilter || undefined,
  start_date: dateFilter.start || undefined,
  end_date: dateFilter.end || undefined,
  status: filter !== 'all' ? filter : undefined,
  sort_by: sortField || undefined,
  sort_order: sortDirection || undefined,
};
```

## 5. Add status indicator in table
Add a column for status in the table:

```tsx
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  <SortableColumn
    label="Status"
    field="status"
    currentSortField={sortField}
    currentSortDirection={sortDirection}
    onSort={handleSort}
  />
</th>
```

And render status indicators:

```tsx
<td className="px-6 py-4 whitespace-nowrap">
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
    {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : 'Unknown'}
  </span>
</td>
```

## 6. Add Status Filter UI
Add filter buttons for all statuses:

```tsx
<div className="flex space-x-2">
  <button
    onClick={() => handleFilter('all')}
    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
  >
    All
  </button>
  <button
    onClick={() => handleFilter('published')}
    className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
  >
    Published
  </button>
  <button
    onClick={() => handleFilter('pending')}
    className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
  >
    Pending
  </button>
  <button
    onClick={() => handleFilter('flagged')}
    className={`px-4 py-2 rounded ${filter === 'flagged' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
  >
    Flagged
  </button>
</div>
```

## 7. Add Status to the Edit Form
Add status selection field in the edit form:

```tsx
{currentPost && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
      name="status"
      value={formData.status || ''}
      onChange={handleChange}
      className="w-full border rounded p-2"
    >
      <option value="published">Published</option>
      <option value="pending">Pending</option>
      <option value="flagged">Flagged</option>
    </select>
  </div>
)}
```
