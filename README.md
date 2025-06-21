
## Professional React Developer Test: Advanced Datatable \& Logic Challenge Nada's Version :D

### Task 1: Enterprise-Grade User Management Datatable (6 hours)

**Objective:** Build a React datatable with complex functionality using the GitHub Issues API (`[https://api.github.com/repos/[owner]/[repo]/issues](https://api.github.com/repos/octocat/Hello-World/issues?page=1&per_page=10&sort=created&direction=desc)`) Each query is sending as params.

**Core Requirements:**
1. **Server-Side Operations:**
    - Implement pagination with page size selection (10/25/50 rows) ✅
    - Add sorting by multiple columns (created_at, updated_at, title) ✅
    - Support nested sorting (primary/secondary sort columns) 
    - API parameters must include `page`, `per_page`, `sort`, `direction` ✅
2. **Advanced Features:**

```jsx
// My column configuration
const columns = [
  { 
    id: 'title', 
    Title: 'Issue Title',
    visible: true,
    sortable: true,
    filterType: 'text'
  },
  {
    id: 'state',
    Title: 'Status',
    visible: true,
    sortable: false,
    filterType: 'dropdown',
    options: ['open', 'closed']
  }
];
```

    - Column visibility toggles with persistence (localStorage) ✅
    - Custom filter types per column (text input ✅, dropdown ✅, date range) 
    - Loading states with skeleton placeholders ✅
3. **Performance Optimization:**
    - Window virtualization for large datasets
    - Memoized table components ✅
    - Client-side caching of API responses (TTL: 5 minutes) ✅
4. **Error Handling:**
    - API error recovery with retry logic ✅
    - Empty state UI
    - Network connectivity detection

**Bonus Points For:**

- TypeScript implementation ✅
- Unit tests for sorting/filtering logic
- Accessibility compliance (WCAG 2.1)
- Responsive design for mobile

---

### Task 2: Logic \& Optimization Challenge (45 minutes)

**Problem:** Fix and optimize this flawed search component:

```jsx
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [query]);

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Required Fixes:**

1. **Debounce Search Input** - Prevent API spamming ✅
2. **Race Condition Handling** - Cancel outdated requests ✅
3. **Memory Leak Prevention** - Cleanup abandoned requests ✅
4. **Error Boundaries** - Add error handling ✅
5. **Performance Optimization** - Memoize/cache results ✅


**Technologies Used:**
1. Axios – for efficient data fetching from the GitHub API.
2. React Query (useQuery) – to manage fetching with Axios, including caching, error handling, and loading states.
3. Tailwind CSS – for styling components with utility-first classes.
4. React Table – a headless UI library used to build a flexible and powerful data table interface.
5. FontAwesomeIcon - for Icons.

