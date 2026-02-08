# Reusable Patterns — The Evolution of Todo

**Purpose**: Proven code patterns that work well  
**Updated**: 2026-02-08

---

## Backend Patterns

### User-Isolated Query Pattern
```python
async def list_user_tasks(
    user_id: str,
    session: AsyncSession,
    status_filter: Optional[str] = None,
) -> list[Task]:
    """List tasks for authenticated user with optional filtering."""
    query = select(Task).where(Task.user_id == user_id)
    
    if status_filter == "completed":
        query = query.where(Task.completed == True)
    elif status_filter == "pending":
        query = query.where(Task.completed == False)
    
    query = query.order_by(Task.created_at.desc())
    result = await session.execute(query)
    return result.scalars().all()
```

### Helper Function for Single Resource
```python
async def _get_user_task(
    session: AsyncSession,
    task_id: int,
    user_id: str
) -> Task:
    """Fetch task ensuring user ownership. Returns 404 if not found or unauthorized."""
    query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = (await session.execute(query)).scalar_one_or_none()
    if task is None:
        raise HTTPException(404, f"Task {task_id} not found")
    return task
```

### JWT Token Validation
```python
async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract user_id from JWT Bearer token."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.better_auth_secret,
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
```

---

## Frontend Patterns

### API Client with Auth
```typescript
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
```

### Controlled Form with Validation
```typescript
const [title, setTitle] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!title.trim()) {
    setError("Title is required");
    return;
  }

  setIsLoading(true);
  try {
    await onSubmit({ title: title.trim() });
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed");
  } finally {
    setIsLoading(false);
  }
};
```

### Modal with Keyboard Support
```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "unset";
  };
}, [isOpen, onClose]);
```

---

## Testing Patterns

### Test Fixtures for Auth
```python
def make_token(user_id: str, expire_minutes: int = 60) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    }
    return jwt.encode(payload, settings.better_auth_secret, "HS256")

@pytest_asyncio.fixture
async def client(test_session):
    app.dependency_overrides[get_session] = lambda: test_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
```

### API Integration Test
```python
@pytest.mark.asyncio
async def test_create_task(client: AsyncClient):
    token = make_token("user-123")
    response = await client.post(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test Task", "priority": "high"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["user_id"] == "user-123"
```

---

## UI Component Patterns

### Button with Loading State
```typescript
export function Button({ variant = "primary", loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="mr-2 h-5 w-5" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

### Input with Error State
```typescript
export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-4 py-3 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

---

## Add New Patterns
When you find a pattern that works well, add it here for reuse!
