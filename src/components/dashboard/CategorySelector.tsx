"use client";

import { useState } from "react";
import styles from "./CategorySelector.module.css";

interface CategorySelectorProps {
  categories: readonly string[];
  selected: ReadonlySet<string>;
  onToggle: (category: string) => void;
  onCreate: (name: string) => string;
}

export default function CategorySelector({
  categories,
  selected,
  onToggle,
  onCreate,
}: CategorySelectorProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const cancel = () => {
    setCreating(false);
    setName("");
    setError("");
  };

  const add = () => {
    try {
      const category = onCreate(name);
      if (!selected.has(category)) onToggle(category);
      cancel();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add category.");
    }
  };

  return (
    <section className={styles.selector} aria-label="Tool categories">
      <div className={styles.label}>Categories</div>
      <div className={styles.chips}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selected.has(category)}
            className={`${styles.chip} ${selected.has(category) ? styles.selected : ""}`}
            onClick={() => onToggle(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {creating ? (
        <div className={styles.creation}>
          <div className={styles.row}>
            <input
              aria-label="New category name"
              value={name}
              maxLength={24}
              autoFocus
              placeholder="Category name"
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  add();
                }
                if (event.key === "Escape") cancel();
              }}
            />
            <button type="button" onClick={add}>Add</button>
            <button type="button" onClick={cancel}>Cancel</button>
          </div>
          {error ? <div className={styles.error} role="alert">{error}</div> : null}
        </div>
      ) : (
        <button type="button" className={styles.newCategory} onClick={() => setCreating(true)}>
          + New category
        </button>
      )}
    </section>
  );
}
