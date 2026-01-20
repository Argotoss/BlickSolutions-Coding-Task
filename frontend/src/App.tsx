import { useEffect, useMemo, useState } from "react";
import { createItem, deleteItem, fetchItems, updateItem } from "./api";
import "./App.css";
import type { ShoppingItem } from "./types";

const formatCountLabel = (count: number): string => {
  if (count === 0) {
    return "No items yet";
  }
  if (count === 1) {
    return "1 item";
  }
  return `${count} items`;
};

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const summaryLabel = useMemo(() => formatCountLabel(items.length), [items.length]);
  const boughtCount = useMemo(() => items.filter((item) => item.bought).length, [items]);
  const pendingCount = items.length - boughtCount;
  const progressPercent = items.length === 0 ? 0 : Math.round((boughtCount / items.length) * 100);
  const progressLabel = loading
    ? "Fetching items"
    : items.length === 0
      ? "Ready when you are"
      : `${boughtCount} of ${items.length} bought`;
  const statusText = loading ? "Loading..." : summaryLabel;
  const canAdd = nameInput.trim().length > 0 && !isSaving;

  useEffect(() => {
    let isActive = true;

    const loadItems = async (): Promise<void> => {
      try {
        const data = await fetchItems();
        if (isActive) {
          setItems(data);
        }
      } catch (error: unknown) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load items");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      isActive = false;
    };
  }, []);

  const handleAdd = async (): Promise<void> => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a product name.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const item = await createItem(trimmed);
      setItems((previous) => [item, ...previous]);
      setNameInput("");
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (item: ShoppingItem): Promise<void> => {
    setErrorMessage(null);
    try {
      const updated = await updateItem(item._id, !item.bought);
      setItems((previous) =>
        previous.map((entry) => (entry._id === updated._id ? updated : entry))
      );
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update item");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    setErrorMessage(null);
    try {
      await deleteItem(id);
      setItems((previous) => previous.filter((entry) => entry._id !== id));
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete item");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <p className="eyebrow">Blick Shopping</p>
          <span className="status-pill">{statusText}</span>
        </div>
        <h1>Shopping List</h1>
        <p className="subtitle">
          Add products, mark them as bought, and keep your list fresh.
        </p>
        <div className="summary-row">
          <div className="summary-card">
            <span className="summary-value">{boughtCount}</span>
            <span className="summary-label">Bought</span>
          </div>
          <div className="summary-card">
            <span className="summary-value">{pendingCount}</span>
            <span className="summary-label">To buy</span>
          </div>
        </div>
      </header>
      <main className="panel">
        <div className="panel-header">
          <div>
            <h2>Items</h2>
            <p className="panel-subtitle">Check items off as you shop.</p>
          </div>
          <div className="progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="progress-label">{progressLabel}</span>
          </div>
        </div>
        <div className="input-row">
          <input
            aria-label="Product name"
            className="item-input"
            placeholder="Add a product (e.g., Butter)"
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAdd();
              }
            }}
          />
          <button className="add-button" type="button" onClick={handleAdd} disabled={!canAdd}>
            Add
          </button>
        </div>
        <div className="list">
          {loading ? (
            <p className="list-placeholder">Loading your list...</p>
          ) : items.length === 0 ? (
            <p className="list-placeholder">
              No items yet. Add your first product above.
            </p>
          ) : (
            <ul className="items">
              {items.map((item) => (
                <li className="item" key={item._id}>
                  <label className="item-label">
                    <input
                      checked={item.bought}
                      className="item-checkbox"
                      onChange={() => handleToggle(item)}
                      type="checkbox"
                    />
                    <span className={item.bought ? "item-name bought" : "item-name"}>
                      {item.name}
                    </span>
                  </label>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errorMessage ? (
          <p className="error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </main>
      <footer className="credit">
        Daniel Kozak · Coding Task for BlickSolutions Full-Stack Developer position
      </footer>
    </div>
  );
}

export default App;
