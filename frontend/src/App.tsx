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
        <p className="eyebrow">Blick Shopping</p>
        <h1>Shopping List</h1>
        <p className="subtitle">
          Add products, mark them as bought, and keep your list fresh.
        </p>
        <p className="summary">{summaryLabel}</p>
      </header>
      <main className="panel">
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
          <button className="add-button" type="button" onClick={handleAdd} disabled={isSaving}>
            Add
          </button>
        </div>
        <div className="list">
          {loading ? (
            <p className="list-placeholder">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="list-placeholder">No items yet.</p>
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
        {errorMessage ? <p className="error">{errorMessage}</p> : null}
      </main>
    </div>
  );
}

export default App;
